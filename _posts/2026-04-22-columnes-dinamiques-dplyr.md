---
layout: post
title: "Parametritzar Columnes Dinàmiques a dplyr"
tags:
  - r
excerpt: "Quan es fa servir dplyr dins de funcions pròpies, el nom de columna sovint no és fix sinó un paràmetre. Un mètode senzill amb dues preguntes per triar l'eina correcta, i un exemple final que ho combina tot."
---
{% raw %}

Quan es fa servir `dplyr` dins de funcions pròpies, apareix sovint el mateix problema: el nom de la columna sobre la qual s'agrupa, es calcula o es resumeix **no està fixat al codi**, sinó que es passa com a paràmetre.

`dplyr` està pensat per fer-se servir de manera interactiva, amb noms de columna escrits literalment (`group_by(botiga)`, `mutate(total = preu * unitats)`...). Aquesta sintaxi és molt còmoda per escriure codi a mà, però es torna un problema quan el nom de la columna és una variable: un `string`, o un símbol que arriba com a argument d'una funció.

Aquest article proposa un mètode senzill per triar l'eina correcta en cada cas, basat en dues preguntes, i acaba amb un exemple complet que combina `group_by`, `mutate` i `summarise` dins d'una mateixa funció amb columnes totalment dinàmiques.

## Per què passa això: avaluació no estàndard (NSE)

`dplyr` fa servir el que es coneix com **non-standard evaluation** (NSE): quan s'escriu `group_by(botiga)`, `dplyr` no avalua `botiga` com si fos un objecte que ja existeix a l'entorn, sinó que interpreta literalment el text `botiga` com el nom d'una columna del `data.frame`.

Això és còmode per escriure codi ràpid i llegible, però trenca dins d'una funció:

```r
agrupar_per <- function(dades, columna) {
  dades %>%
    group_by(columna) %>%
    summarise(total = sum(vendes))
}
```

`columna` no s'interpreta com el valor que se li ha passat (per exemple `"botiga"`); `dplyr` busca una columna que es digui literalment `columna`, i l'execució falla (o, pitjor, dona un resultat silenciosament incorrecte si per casualitat existeix una columna amb aquest nom).

## El mètode: dues preguntes

Abans d'entrar en cada operador, val la pena fixar el criteri de decisió, perquè és el mateix en tots els casos i evita haver de memoritzar exemples solts. Davant de qualsevol columna dinàmica, només cal respondre dues preguntes:

1. **Com arriba la columna: com a símbol (sense cometes) o com a string (text)?**
2. **Què se'n fa: es llegeix una columna existent, o se'n crea una de nova amb un nom dinàmic?**

La combinació de les dues respostes determina directament l'eina:

| | Llegir columna existent | Crear columna nova (nom dinàmic) |
|---|---|---|
| **Arriba com a símbol** | `{{ columna }}` | `"{{ nom }}" :=` |
| **Arriba com a string** | `.data[[columna]]` | `!!nom :=` o `"{nom}" :=` |
| **Vàries columnes alhora** | `across({{ columnes }})` o `across(all_of(columnes))` | — |

La resta de l'article no és més que l'aplicació d'aquesta taula, verb per verb.

## Llegir una columna existent

### `{{ }}` (embrace), per a símbols

L'operador `{{ }}` "reenvia" un argument d'una funció cap a dins d'una funció de `dplyr`, quan la columna arriba **sense cometes** (com a símbol):

```r
agrupar_per <- function(dades, columna) {
  dades %>%
    group_by({{ columna }}) %>%
    summarise(total = sum(vendes))
}

agrupar_per(vendes_diaries, botiga)
```

`{{ }}` li diu a `dplyr`: "avalua això en el context de les dades, no com un literal".

### `.data[[ ]]`, per a strings

Si el que arriba és un `string` (per exemple, d'un paràmetre de configuració, d'un fitxer JSON o d'un `purrr::map` sobre un vector de noms), `{{ }}` no serveix. En aquest cas cal `.data[[ ]]`, que permet indexar columnes per nom textual:

```r
agrupar_per_text <- function(dades, nom_columna) {
  dades %>%
    group_by(.data[[nom_columna]]) %>%
    summarise(total = sum(vendes))
}

agrupar_per_text(vendes_diaries, "botiga")
```

### `across()`, per a vàries columnes

Quan el que cal parametritzar és un conjunt de columnes (per exemple, totes les mètriques que s'han de resumir alhora), la solució és `across()`:

```r
resumir_metriques <- function(dades, columnes) {
  dades %>%
    summarise(across({{ columnes }}, sum, .names = "total_{.col}"))
}

resumir_metriques(vendes_diaries, c(vendes, unitats))
```

`across()` accepta tant `tidyselect` (`starts_with("vendes_")`, `where(is.numeric)`...) com vectors de noms, cosa que el fa molt versàtil per a funcions genèriques.

## Crear una columna nova amb nom dinàmic

Quan el que ha de ser dinàmic no és quina columna es llegeix, sinó **el nom de la columna que es crea**, entra en joc `:=` (de `rlang`):

```r
crear_columna <- function(dades, nom_nova, columna_origen, factor) {
  dades %>%
    mutate("{{ nom_nova }}" := {{ columna_origen }} * factor)
}
```

Si `nom_nova` arriba com a text en lloc de símbol:

```r
crear_columna_text <- function(dades, nom_nova, columna_origen, factor) {
  dades %>%
    mutate(!!nom_nova := {{ columna_origen }} * factor)
}
```

El símbol `!!` (*bang-bang*) "desempaqueta" un valor avaluat (com un string) perquè `dplyr` el faci servir com si fos codi. És l'operador clàssic de `rlang` previ a `{{ }}`, i encara imprescindible en aquest tipus de situacions (nom de columna dinàmic al costat esquerre d'una assignació).

## Aplicant les mateixes regles a la resta de verbs

Les dues preguntes de la taula anterior s'apliquen a la majoria de verbs de `dplyr`, perquè tots comparteixen el mateix motor de *tidy evaluation*. Organitzats per comportament:

- **Verbs que només llegeixen** (`select()`, `arrange()`, `count()`, `distinct()`, `pull()`, `relocate()`): funcionen igual que `group_by()`. Amb símbol, `{{ columna }}`; amb string, `.data[[columna]]`; amb diverses columnes a la vegada, `select(all_of(vector_de_noms))`.
- **Verbs amb expressió** (`filter()`, `case_when()` dins de `mutate()`): la columna es parametritza igual (`{{ }}` o `.data[[ ]]`), acompanyada normalment d'un altre paràmetre amb el valor de comparació:
  ```r
  filtrar_per <- function(dades, columna, valor) {
    dades %>% filter({{ columna }} == valor)
  }
  ```
- **Verbs que creen columna** (`mutate()`, `summarise()`, i també `rename()`): el nom nou va explícitament a l'esquerra de `:=`, seguint la mateixa regla d'abans:
  ```r
  renombrar <- function(dades, nom_nou, columna_vella) {
    dades %>% rename("{{ nom_nou }}" := {{ columna_vella }})
  }
  ```
- **Excepció — els `joins`:** `left_join()`, `inner_join()` i companyia **no accepten `{{ }}`** a l'argument `by`, perquè aquest argument espera directament un string o un vector amb nom, no una expressió no avaluada:
  ```r
  unir_per <- function(d1, d2, clau) {
    left_join(d1, d2, by = join_by(!!sym(clau) == !!sym(clau)))
  }
  ```
  És l'únic lloc on cal recórrer a `sym()` de `rlang` per convertir un string en símbol explícitament, ja que `by` no fa *tidy evaluation* per si mateix.

En definitiva: dominar `group_by()`, `mutate()` i `summarise()` amb aquest mètode cobreix gairebé tot `dplyr`. Els únics paràmetres que trenquen el patró són els que, com `by =` als joins o `.names =` dins `across()`, esperen explícitament text en lloc d'una expressió.

## Implementació pràctica

A continuació es combina tot el que s'ha vist en una sola funció, aplicada a un `data.frame` de vendes: agrupa per la columna que se li indica, crea una columna calculada amb el nom que se li indica, resumeix un conjunt variable de columnes amb `across()`, i finalment en resumeix el total amb el nom que també se li indica.

```r
library(dplyr)
library(rlang)

# Dades d'exemple
vendes <- tibble(
  botiga   = c("A", "A", "B", "B", "C"),
  producte = c("Llet", "Pa", "Llet", "Oli", "Pa"),
  preu     = c(1.2, 0.9, 1.3, 4.5, 0.95),
  unitats  = c(10, 25, 8, 4, 30),
  devolucions = c(1, 0, 2, 0, 3)
)

resum_dinamic <- function(dades, agrupar_per, nom_calcul, columnes_a_sumar, nom_resum) {
  dades %>%
    group_by(.data[[agrupar_per]]) %>%
    mutate("{nom_calcul}" := preu * unitats) %>%
    summarise(
      across(all_of(columnes_a_sumar), sum, .names = "total_{.col}"),
      "{nom_resum}" := sum(.data[[nom_calcul]]),
      .groups = "drop"
    )
}

# Cas 1: agrupar per botiga, sumant unitats i devolucions a banda del càlcul principal
resum_dinamic(vendes, agrupar_per = "botiga",
              nom_calcul = "import", columnes_a_sumar = c("unitats", "devolucions"),
              nom_resum = "total_import")

# Cas 2: el mateix codi, agrupant per producte i sumant només les devolucions
resum_dinamic(vendes, agrupar_per = "producte",
              nom_calcul = "import", columnes_a_sumar = "devolucions",
              nom_resum = "total_venut")
```

Resultat del primer cas:

```
# A tibble: 3 × 4
  botiga total_unitats total_devolucions total_import
  <chr>          <dbl>             <dbl>        <dbl>
1 A                 35                 1         34.5
2 B                 12                 2         28.4
3 C                 30                 3         28.5
```

La **mateixa funció** serveix per agrupar per `botiga` o per `producte`, canviar quina columna es calcula dins del `mutate`, i decidir quantes i quines columnes se sumen dins de l'`across()`, sense tocar ni una línia de codi: tot són paràmetres.

Un detall a remarcar: dins de `mutate()` s'utilitza `"{nom_calcul}" :=` (interpolació de glue dins de cometes) en lloc de `{{ nom_calcul }}`, perquè `nom_calcul` arriba com a text i s'està definint un **nom nou** de columna, no referenciant-ne una d'existent. Per a l'`across()`, com que `columnes_a_sumar` és un vector de strings (no un sol símbol), s'utilitza `all_of()` en lloc de `{{ }}`: és la manera correcta d'indicar a `dplyr` que aquests noms de text corresponen a columnes ja existents. I, per llegir la columna acabada de crear dins del `summarise`, s'utilitza `.data[[nom_calcul]]`, ja que en aquell punt `nom_calcul` torna a ser una referència (string) a una columna que ja existeix.

## Conclusió

La part més confusa de la *tidy evaluation* no és cap operador en concret, sinó identificar **si el que es té a la mà és un símbol o un string**, i si es fa servir per **llegir** una columna o per **anomenar-ne** una de nova. Un cop clara aquesta distinció, la tria de `{{ }}`, `.data[[ ]]` o `!!` és gairebé mecànica, i es manté igual tant dins d'un `group_by()` com d'un `select()`, un `filter()` o un `rename()`:

- Símbol + lectura → `{{ }}`
- String + lectura → `.data[[ ]]`
- String + nom nou → `"{string}" :=` o `!!string :=`
- Excepció: paràmetres que esperen text explícit (`by =` als joins) → `sym()` / `join_by()`

Amb aquestes regles n'hi ha prou per escriure funcions de `dplyr` genèriques i reutilitzables, sense haver de duplicar codi cada vegada que canvia la columna sobre la qual es treballa, sigui quin sigui el verb que es faci servir.
{% endraw %}
