---
layout: post
title: "Columnes dinàmiques a dplyr: Com parametritzar-les"
tags: r
excerpt: "Quan fem servir dplyr dins de funcions pròpies, el nom de columna sovint no és fix sinó un paràmetre. Repasso {{ }}, .data[[ ]], across() i := per parametritzar group_by, mutate i summarise, amb un exemple final que combina les tres operacions de forma totalment dinàmica."

---

Quan comencem a fer servir `dplyr` dins de funcions pròpies, més d'hora que tard ens trobem amb el mateix problema: volem que el nom de la columna sobre la qual agrupem, calculem o resumim **no estigui fixat al codi**, sinó que es passi com a paràmetre.

El problema és que `dplyr` està pensat per fer-se servir de manera interactiva, amb noms de columna escrits literalment (`group_by(botiga)`, `mutate(total = preu * unitats)`...). Aquesta sintaxi és molt còmoda quan escrivim codi a mà, però es torna un problema quan el nom de la columna és una variable (un `string`, o un símbol que ens arriba com a argument d'una funció).

En aquest article repasso les eines que ofereix el `tidyverse` (concretament `rlang`, integrat dins `dplyr`) per resoldre això de manera neta, i acabo amb un exemple complet que combina `group_by`, `mutate` i `summarise` dins d'una mateixa funció amb columnes totalment dinàmiques.

## Per què passa això: avaluació diferida (NSE)

`dplyr` fa servir el que es coneix com **non-standard evaluation** (NSE): quan escrius `group_by(botiga)`, `dplyr` no avalua `botiga` com si fos un objecte que ja existeix a l'entorn; interpreta literalment el text `botiga` com el nom d'una columna del `data.frame`.

Això és genial per escriure codi ràpid i llegible, però si dins d'una funció fem:

```r
agrupar_per <- function(dades, columna) {
  dades %>%
    group_by(columna) %>%
    summarise(total = sum(vendes))
}
```

`columna` no s'interpretarà com el valor que li hem passat (per exemple `"botiga"`), sinó que `dplyr` buscarà una columna que es digui literalment `columna`, i petarà (o, pitjor encara, donarà un resultat silenciosament incorrecte si per casualitat existeix una columna amb aquest nom).

## Les tres eines bàsiques

### 1. `{{ }}` (embrace) — la més habitual

L'operador `{{ }}` és la manera més senzilla de "reenviar" un argument d'una funció cap a dins d'una funció de `dplyr`. Funciona quan l'usuari et passa el **nom de la columna sense cometes** (com a símbol):

```r
agrupar_per <- function(dades, columna) {
  dades %>%
    group_by({{ columna }}) %>%
    summarise(total = sum(vendes))
}

agrupar_per(vendes_diaries, botiga)
```

Aquí `columna` arriba com una expressió no avaluada (gràcies a la *tidy evaluation*), i `{{ }}` li diu a `dplyr`: "avalua això en el context de les dades, no com un literal".

### 2. `.data[[ ]]` — quan el nom arriba com a text (string)

Si el que reps és un `string` (per exemple, ve d'un paràmetre de configuració, d'un fitxer JSON o d'un `purrr::map` sobre un vector de noms), `{{ }}` no serveix. Aquí fem servir `.data[[ ]]`, del paquet `rlang`, que permet indexar columnes per nom textual:

```r
agrupar_per_text <- function(dades, nom_columna) {
  dades %>%
    group_by(.data[[nom_columna]]) %>%
    summarise(total = sum(vendes))
}

agrupar_per_text(vendes_diaries, "botiga")
```

Regla pràctica: **`{{ }}` per a símbols (noms sense cometes), `.data[[ ]]` per a strings**.

### 3. `across()` — quan no és una sola columna, sinó vàries

Quan el que volem parametritzar és un conjunt de columnes (per exemple, totes les mètriques que s'han de resumir alhora), la solució és `across()`:

```r
resumir_metriques <- function(dades, columnes) {
  dades %>%
    summarise(across({{ columnes }}, sum, .names = "total_{.col}"))
}

resumir_metriques(vendes_diaries, c(vendes, unitats))
```

`across()` accepta tant `tidyselect` (`starts_with("vendes_")`, `where(is.numeric)`...) com vectors de noms, el que el fa molt versàtil per a funcions genèriques.

## I quan necessito crear el nom de la nova columna també de forma dinàmica?

Aquí entra en joc `:=` (de `rlang`), que permet que el **nom** d'una columna nova (no només el seu contingut) sigui dinàmic:

```r
crear_columna <- function(dades, nom_nova, columna_origen, factor) {
  dades %>%
    mutate("{{ nom_nova }}" := {{ columna_origen }} * factor)
}
```

O, si `nom_nova` arriba com a text:

```r
crear_columna_text <- function(dades, nom_nova, columna_origen, factor) {
  dades %>%
    mutate(!!nom_nova := {{ columna_origen }} * factor)
}
```

El símbol `!!` (*bang-bang*) "desempaqueta" un valor avaluat (com un string) perquè `dplyr` el faci servir com si fos codi. És l'operador clàssic de `rlang` previ a `{{ }}`, i encara és imprescindible en aquest tipus de situacions (nom de columna dinàmic en el costat esquerre d'una assignació).

## Resum de quina eina fer servir segons el cas

| Situació | Eina |
|---|---|
| Una columna, arriba com a símbol (sense cometes) | `{{ columna }}` |
| Una columna, arriba com a text (string) | `.data[[columna]]` |
| Vàries columnes alhora | `across({{ columnes }})` o `across(all_of(columnes))` |
| Nom de columna nova dinàmic (costat esquerre) | `"{{ nom }}" :=` o `!!nom :=` |
| Múltiples expressions a desempaquetar | `!!!` (per a llistes d'arguments) |

## I als altres verbs de dplyr? `group_by`, `mutate` i `summarise` només són la punta de l'iceberg

Les mateixes regles que hem vist fins ara s'apliquen a la majoria de verbs de `dplyr`, perquè tots comparteixen el mateix motor de *tidy evaluation*. La manera més pràctica d'organitzar-ho no és verb per verb, sinó per **grups de comportament**:

### Grup 1: verbs que simplement "llegeixen" una columna existent

`select()`, `arrange()`, `count()`, `distinct()`, `pull()` i `relocate()` funcionen exactament igual que `group_by()`: reben una referència a una columna (símbol o string) i no en creen cap de nova. Si ja domines `{{ }}` i `.data[[ ]]` per a `group_by()`, els tens tots resolts:

```r
# select() com a representant del grup
seleccionar_cols <- function(dades, columna) {
  dades %>% select({{ columna }})
}

# arrange() afegeix només el matís de l'ordre descendent
ordenar_per <- function(dades, columna) {
  dades %>% arrange(desc({{ columna }}))
}
```

Amb strings, el patró és sempre `.data[[columna]]`, i per seleccionar diverses columnes a la vegada, `select(all_of(vector_de_noms))`.

### Grup 2: verbs que avaluen una expressió (no només un nom)

`filter()` és el cas més habitual d'aquest grup: no rep només el nom d'una columna, sinó una condició completa que la fa servir. La columna es parametritza igual (`{{ }}` o `.data[[ ]]`), però normalment hi acompanya un altre paràmetre amb el valor de comparació:

```r
filtrar_per <- function(dades, columna, valor) {
  dades %>% filter({{ columna }} == valor)
}
```

`case_when()` dins d'un `mutate()` es comporta igual: la columna dinàmica simplement apareix dins d'una condició (`.data[[columna]] > 10 ~ "alt"`), sense cap regla nova respecte al que ja coneixem.

### Grup 3: verbs que creen una columna amb nom nou

Aquí hi entren `mutate()` i `summarise()` (ja vistos), i també `rename()`, amb la particularitat que el nom nou hi va explícitament a l'esquerra:

```r
renombrar <- function(dades, nom_nou, columna_vella) {
  dades %>% rename("{{ nom_nou }}" := {{ columna_vella }})
}
```

La regla és la mateixa que ja hem aplicat: si el nom nou arriba com a string, `"{nom}" :=`; si arriba com a símbol que vols capturar literalment, `{{ nom }}` al costat esquerre de `:=`.

### Grup 4: l'excepció real — els `joins`

`left_join()`, `inner_join()` i companyia **no accepten `{{ }}`** a l'argument `by`. Aquest argument espera directament un string o un vector amb nom, no una expressió no avaluada, així que la sintaxi és diferent de tota la resta:

```r
unir_per <- function(d1, d2, clau) {
  left_join(d1, d2, by = setNames(clau, clau))
}

# alternativa amb la sintaxi moderna de join_by()
unir_per2 <- function(d1, d2, clau) {
  left_join(d1, d2, by = join_by(!!sym(clau) == !!sym(clau)))
}
```

És l'únic lloc on cal recórrer a `sym()` de `rlang` per convertir un string en símbol explícitament, ja que `by` no fa *tidy evaluation* per si mateix.

En definitiva: si ja saps moure't amb `group_by()`, `mutate()` i `summarise()`, en realitat ja saps moure't amb gairebé tot `dplyr`. Els únics paràmetres que trenquen el patró són els que, com `by =` als joins o `.names =` dins `across()`, esperen explícitament text en lloc d'una expressió.

## 📊 Exemple final

Posem-ho tot junt amb un cas real: una funció que, donat un `data.frame` de vendes, agrupa per la columna que li indiquem, crea una columna calculada amb el nom que li indiquem, resumeix un conjunt variable de columnes amb `across()`, i finalment en resumeix el total amb el nom que li indiquem també.

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

Fixa't que la **mateixa funció** serveix per agrupar per `botiga` o per `producte`, canviar quina columna es calcula dins del `mutate`, i decidir quantes i quines columnes es sumen dins del `across()`, sense tocar ni una línia de codi: tot són paràmetres.

Un detall important: dins de `mutate()` he fet servir `"{nom_calcul}" :=` (interpolació de glue dins de cometes) en lloc de `{{ nom_calcul }}`, perquè `nom_calcul` arriba com a text i estem definint un **nom nou** de columna, no referenciant-ne una d'existent. Per al `across()`, com que `columnes_a_sumar` és un vector de strings (no un sol símbol), fem servir `all_of()` en lloc de `{{ }}`: és la manera correcta de dir-li a `dplyr` "aquests noms de text són columnes que ja existeixen". I després, per llegir la columna acabada de crear dins del `summarise`, faig servir `.data[[nom_calcul]]`, ja que en aquell punt `nom_calcul` torna a ser una referència (string) a una columna que ja existeix.

## Conclusió

La part més confusa de la *tidy evaluation* no és cap operador en concret, sinó saber **si el que tens a la mà és un símbol o un string**, i si l'estàs fent servir per **llegir** una columna o per **anomenar-ne** una de nova. Un cop tens clara aquesta distinció, la tria de `{{ }}`, `.data[[ ]]` o `!!` és gairebé mecànica, i es manté igual tant si estàs dins d'un `group_by()` com d'un `select()`, un `filter()` o un `rename()`:

- Símbol + lectura → `{{ }}`
- String + lectura → `.data[[ ]]`
- String + nom nou → `"{string}" :=` o `!!string :=`
- Excepció: paràmetres que esperen text explícit (`by =` als joins) → `sym()` / `join_by()`

Amb aquestes regles n'hi ha prou per escriure funcions de `dplyr` genèriques i reutilitzables, sense haver de duplicar codi cada vegada que canvia la columna sobre la qual treballem, sigui quin sigui el verb que facis servir.
