---
layout: post
title: "Parametritzar Columnes Dinàmiques a dplyr"
tags:
  - r
excerpt: "Quan es fa servir dplyr dins de funcions pròpies, el nom de columna sovint no és fix sinó un paràmetre. Una manera senzilla i consistent de fer-ho, amb un exemple de dades per a cada cas."
---

Quan es fa servir `dplyr` dins de funcions pròpies, apareix sovint el mateix problema: el nom de la columna sobre la qual s'agrupa, es calcula o es resumeix **no està fixat al codi**, sinó que es passa com a paràmetre.

`dplyr` està pensat per escriure's amb noms de columna literals (`group_by(botiga)`, `mutate(total = preu * unitats)`...). Aquesta sintaxi és molt còmoda per escriure codi a mà, però es torna un problema quan el nom de la columna arriba com a paràmetre d'una funció.

Aquest article se centra únicament en **passar noms de columna** (mai expressions senceres com `mean(x)` o `a + b`), i mostra, amb dades reals a cada exemple, una manera senzilla i consistent de resoldre-ho.

## Les dades d'exemple

Tots els exemples del post fan servir la mateixa taula:

```r
library(dplyr)

vendes_diaries <- tibble(
  botiga  = c("A", "A", "B", "B"),
  vendes  = c(120, 150, 80, 60),
  unitats = c(10, 12, 8, 5)
)
```

## Per què passa això

`dplyr` interpreta els noms de columna de manera literal: quan s'escriu `group_by(botiga)`, `dplyr` busca una columna que es digui `botiga`, sense mirar si existeix cap variable amb aquest nom a l'entorn. Això és pràctic per escriure codi ràpid, però trenca dins d'una funció:

```r
agrupar_per <- function(dades, columna) {
  dades %>%
    group_by(columna) %>%
    summarise(total = sum(vendes))
}
```

Aquí, `columna` no s'interpreta com el valor que se li ha passat (per exemple `"botiga"`); `dplyr` busca una columna que es digui literalment `columna`, i falla.

## La solució: el paràmetre sempre és text

La manera més senzilla d'evitar-ho és una regla única: **quan una funció rep un nom de columna com a paràmetre, sempre es passa com a text, entre cometes** (`"botiga"`, no `botiga`). Fet això, només calen dues eines de `dplyr` per fer-hi qualsevol cosa:

- **`.data[[ ... ]]`** per **llegir** una columna existent a partir del seu nom en texte.
- **`"{ ... }" :=`** per **crear** una columna nova amb un nom que ve en text.
- **`all_of( ... )`** per **llegir** diverses columnes amb el seu nom en texte.

### Llegir una columna existent

```r
filtrar_agrupar <- function(dades, columna_grup, columna_filtre, valor) {
  dades %>%
    filter(.data[[columna_filtre]] > valor) %>%
    group_by(.data[[columna_grup]]) %>%
    summarise(total = sum(vendes), .groups = "drop")
}

filtrar_agrupar(vendes_diaries, "botiga", "unitats", 6)
```

`.data[[columna]]` li diu a `dplyr`: "busca la columna el nom de la qual és el text que hi ha dins de la variable `columna`". Funciona exactament igual dins de `select()`, `filter()`, `arrange()`, `mutate()` o qualsevol altre verb:

Existeix una altra manera de fer exactament el mateix, vàlida només per a columnes: `{{ }}` (*embrace*). A diferència de `.data[[ ]]`, que rep el nom com a **text**, `{{ }}` rep el nom **sense cometes**, escrit directament a la crida com si fos una variable normal:

```r
agrupar_per_embrace <- function(dades, columna) {
  dades %>%
    group_by({{ columna }}) %>%
    summarise(total = sum(vendes), .groups = "drop")
}

agrupar_per_embrace(vendes_diaries, botiga)   # sense cometes
```


### Crear una columna nova

```r
crear_columna <- function(dades, nom_nova, columna_origen, factor) {
  dades %>%
    mutate("{nom_nova}" := .data[[columna_origen]] * factor)
}

crear_columna(vendes_diaries, "vendes_doble", "vendes", 2)
```


Es llegeix així: "crea una columna anomenada com el text de `nom_nova`, amb el valor de la columna anomenada com el text de `columna_origen`, multiplicat per `factor`".


### Diverses columnes alhora

`all_of(columnes)` és la peça que li diu a `dplyr` "aquest vector de text són noms de columnes existents". Com s'ha de combinar amb la resta depèn del verb:

**Amb verbs que ja "seleccionen columnes" (`select()`, `rename()`, `arrange()`, `pull()`...), `all_of()` funciona sol, sense `across()`:**

```r
seleccionar <- function(dades, columnes) {
  dades %>% select(all_of(columnes))
}

seleccionar(vendes_diaries, c("botiga", "vendes"))
```


**Amb verbs que "calculen un valor" per columna (`summarise()`, `mutate()` amb una funció com `sum()` o `mean()`), `all_of()` sol no és suficient:**

Aquí cal `across()`, que és qui aplica la funció a cada columna seleccionada, una per una, i retorna un resultat per cadascuna:

```r
resumir_be <- function(dades, columnes) {
  dades %>%
    summarise(across(all_of(columnes), sum))
}

resumir_be(vendes_diaries, c("vendes", "unitats"))
```


## Implementació pràctica

Un exemple que combina totes les peces anteriors en una sola funció: agrupa per una columna (text), crea una columna calculada amb un nom (text) i resumeix un conjunt de columnes (vector de text).

```r
resum_dinamic <- function(dades, agrupar_per, nom_calcul, columnes_a_sumar) {
  dades %>%
    group_by(.data[[agrupar_per]]) %>%
    mutate("{nom_calcul}" := vendes * 1.21) %>%
    summarise(across(all_of(columnes_a_sumar), sum), .groups = "drop")
}

resum_dinamic(vendes_diaries, agrupar_per = "botiga",
              nom_calcul = "vendes_amb_iva", columnes_a_sumar = "vendes_amb_iva")
```

Resultat:

```
# A tibble: 2 × 2
  botiga vendes_amb_iva
  <chr>           <dbl>
1 A                326.7
2 B                169.4
```

Canviant només els arguments (`agrupar_per`, `nom_calcul`, `columnes_a_sumar`), la mateixa funció serveix per a qualsevol combinació de columnes, sense tocar ni una línia de codi.

## Conclusió

Amb una única regla —tractar sempre el nom de columna com a text, i fer servir `.data[[ ]]` per llegir i `"{ }" :=` per crear— n'hi ha prou per escriure funcions de `dplyr` genèriques i reutilitzables, sigui quin sigui el verb. `{{ }}` és una alternativa vàlida quan es prefereix passar el nom sense cometes, però per a un ús centrat només en columnes, quedar-se amb una sola eina (`.data[[ ]]`) evita haver de triar cada vegada entre dues maneres diferents de fer el mateix.
