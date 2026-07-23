---
layout: post
title: "Parametritzar Columnes Dinàmiques a dplyr"
tags:
  - r
excerpt: "Quan es fa servir dplyr dins de funcions pròpies, el nom de columna sovint no és fix sinó un paràmetre. Una manera senzilla i consistent de fer-ho, amb un exemple de dades per a cada cas."
---

Quan es fa servir `dplyr` dins de funcions pròpies, apareix sovint el mateix problema: el nom de la columna sobre la qual s'agrupa, es calcula o es resumeix no està fixat al codi, sinó que es passa com a paràmetre.

`dplyr` està pensat per escriure's amb noms de columna literals (`group_by(botiga)`, `mutate(total = preu * unitats)`...). Aquesta sintaxi és molt còmoda per escriure codi a mà, però es torna un problema quan el nom de la columna arriba com a paràmetre d'una funció.

Aquest article se centra en **passar noms de columna**, i mostra, amb exemples, una manera senzilla i consistent de resoldre-ho.

## Les dades d'exemple

Tots els exemples del post fan servir la mateixa taula:

```r
library(dplyr)

vendes_diaries <- tibble(
  dia = c("Dilluns", "Dimarts", "Dilluns", "Dimarts"),
  botiga  = c("A", "A", "B", "B"),
  vendes  = c(120, 150, 80, 60),
  unitats = c(10, 12, 8, 5)
)
```

## El problema

`dplyr` interpreta els noms de columna de manera literal: quan s'escriu `group_by(botiga)`, `dplyr` busca una columna que es digui `botiga`, sense mirar si existeix cap variable amb aquest nom a l'entorn. Això és pràctic per escriure codi ràpid, però trenca dins d'una funció:

```r
agrupar_per <- function(dades, columna) {
  dades %>%
    group_by(columna) %>%
    summarise(total = sum(vendes))
}
```

Aquí, `columna` no s'interpreta com el valor que se li ha passat (per exemple `"botiga"`); `dplyr` busca una columna que es digui literalment `columna`, i falla.

## La solució

La manera més senzilla d'evitar-ho és una regla única: quan una funció rep un nom de columna com a paràmetre, sempre es passa com a text, entre cometes (`"botiga"`, no `botiga`). Fet això, només calen tres eines de `dplyr` per fer-hi qualsevol cosa:

- **`.data[[ ... ]]`** per **llegir** una columna existent a partir del seu nom en text.
- **`"{ ... }" :=`** per **crear** una columna nova amb un nom que ve en text.
- **`all_of( ... )`** per **llegir** diverses columnes amb el seu nom en text.

### Llegir una columna existent

```r
agrupar <- function(dades, columna_grup) {
  dades %>%
    group_by(.data[[columna_grup]]) %>%
    summarise(total = sum(vendes), .groups = "drop")
}

agrupar(vendes_diaries, "dia")
```

`.data[[columna]]` li diu a `dplyr`: "busca la columna el nom de la qual és el text que hi ha dins de la variable `columna`". Funciona exactament igual dins de `select()`, `filter()`, `arrange()`, `mutate()` o qualsevol altre verb:

Existeix una altra manera de fer el mateix: `{{ }}` (*embrace*). A diferència de `.data[[ ]]`, que rep el nom com a **text**, `{{ }}` rep el nom **sense cometes**, escrit directament a la crida com si fos una variable normal. La principala diferencia entre metodes es que `{{ }}` permet passar no només noms de columnes sinó també altres expressions a la funció (per exemple: `mean(x)` o `a + b`):


### Crear una columna nova

```r
crear_columna <- function(dades, nom_nova, columna_origen, factor) {
  dades %>%
    mutate("{nom_nova}" := .data[[columna_origen]] * factor)
}

crear_columna(vendes_diaries, "vendes_doble", "vendes", 2)
```

Es llegeix així: "crea una columna anomenada com el text de `nom_nova`, amb el valor de la columna anomenada com el text de `columna_origen`, multiplicat per `factor`".


### Llegir diverses columnes alhora

La peça clau es  que avisa  que s'estan passant diverses columnes es `all_of(columnes)`. Com s'ha de combinar amb la resta depèn del verb:

- Amb verbs que **"seleccionen columnes"** (`select()`, `rename()`, `arrange()`, `pull()`...), `all_of()` funciona sol, sense `across()`.
- Amb verbs que **"calculen un valor" per columna** (`summarise()`, `mutate()` amb una funció com `sum()` o `mean()`), `all_of()` sol no és suficient, aquí cal `across()`, que és qui aplica la funció a cada columna seleccionada, una per una, i retorna un resultat per cadascuna.

```r
resumir <- function(dades, seleccio, suma) {
  dades %>%
    select(all_of(seleccio)) %>%
    summarise(across(all_of(suma), sum))
}

resumir(vendes_diaries,
        seleccio = c("botiga", "vendes", "unitats"),
        suma = c("vendes", "unitats"))
```
