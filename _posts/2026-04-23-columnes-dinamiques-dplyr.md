---
layout: post
title: "Programació Dinàmica a dplyr: Selecció i Maneig de Columnes"
tags:
  - r
  - dplyr
  - programacio
excerpt: "Guia tècnica sobre la selecció i modificació dinàmica de columnes a dplyr: ús de l'operador embrace {{ }}, .data[[columna]], all_of(), across() i l'operador d'assignació :=."
---

En l'ecosistema de R, la llibreria `dplyr` destaca per la seva sintaxi clara i expressiva. Tanmateix, quan cal automatitzar tasques, crear funcions reutilitzables o iterar sobre un conjunt de variables, s'enfronta el repte de l'Avaluació No Estàndard (*Non-Standard Evaluation* o NSE).

Mentre que en un ús interactiu s'escriuen els noms de les columnes directament sense cometes, la programació modular requereix avaluar arguments dinàmics. A continuació s'analitzen les diferents eines que ofereix `tidyeval` per abordar aquesta necessitat segons el context.

## El Repte de l'Avaluació No Estàndard (NSE)

`dplyr` utilitza NSE per capturar les expressions escrites abans que s'avaluïn. Això permet escriure `filter(df, edat > 30)` en lloc de `df[df$edat > 30, ]`. No obstant això, quan la columna s'emmagatzema en una variable o es passa com a argument d'una funció, el sistema busca un nom literal en lloc del contingut de la variable.

```r
# Això fallarà o donarà un resultat inesperat
filtrar_columna <- function(df, variable, valor) {
  df %>% filter(variable == valor)
}
```

Per resoldre aquest problema cal "desarborar" (*defuse*) l'expressió i avaluar-la en el context del data frame.

## Casos d'Ús i Eines Adeqüades

### Cas 1: Passar columnes com a arguments sense cometes (Symbols)

Quan es dissenya una funció on l'usuari passa el nom de la columna sense cometes (estil natiu de `dplyr`), s'utilitza l'operador *embrace* `{{ }}` (*tunnel operator*). Aquest operador captura l'expressió i la passa directament al medi ambient de `dplyr`.

```r
library(dplyr)

# Funció per calcular la mitjana i la desviació estàndard d'una columna
resumir_variable <- function(dades, columna) {
  dades %>% 
    summarise(
      mitjana = mean({{ columna }}, na.rm = TRUE),
      desviacio = sd({{ columna }}, na.rm = TRUE)
    )
}

# Ús de la funció amb l'argument unquoted
resumir_variable(mtcars, mpg)
```

### Cas 2: Treballar amb noms de columnes com a cadenes de text (Strings / Character)

Quan el nom de la columna s'obté com una cadena de text (`"mpg"`), la millor opció varia segons si es vol filtrar/transformar la variable o bé seleccionar-la.

#### 2.1 Transformació individual amb `.data[[columna]]`

L'pronoms `.data` forma part del mecanisme `tidyeval` i permet accedir a la columna especificada en una variable de tipus *string*.

```r
var_nom <- "hp"

# Filtratge dinàmic utilitzant el nom en string
mtcars %>% 
  filter(.data[[var_nom]] > 100) %>% 
  select(mpg, hp) %>% 
  head(3)
```

#### 2.2 Selecció amb `all_of()` o `any_of()`

Per a funcions de selecció com `select()`, `relocate()` o `pull()`, les funcions auxiliars `all_of()` i `any_of()` són la via adequada. `all_of()` requereix que totes les columnes existeixin (llançant un error si en falta alguna), mentre que `any_of()` ignora les variables inexistents.

```r
cols_interes <- c("mpg", "cyl", "hp")

# Selecció segura de variables en un vector de caràcters
mtcars %>% 
  select(all_of(cols_interes)) %>% 
  head(3)
```

### Cas 3: Aplicar transformacions a múltiples columnes simultàniament

Quan cal aplicar la mateixa operació a un conjunt de columnes seleccionades de manera dinàmica, s'utilitza `across()`. Aquesta funció permet combinar *helpers* de selecció com `where()`, `all_of()` o expressions regulars.

```r
variables_num <- c("disp", "hp")

# Aplicar escalat a múltiples columnes especificades en un vector
mtcars %>% 
  mutate(across(all_of(variables_num), ~ .x / max(.x))) %>% 
  select(mpg, disp, hp) %>% 
  head(3)
```

### Cas 4: Crear o reanomenar noves columnes amb noms dinàmics

Per assignar un nom dinàmic a una nova columna creada dins de `mutate()` o `summarise()`, no es pot utilitzar l'operador d'assignació habitual `=`. Cal utilitzar l'operador *walrus* `:=` conjuntament amb l'operador `{{ }}` o la funció `glue::glue()`.

```r
library(glue)

# Creació d'una nova columna amb un nom derivat dinàmicament
calcular_log <- function(dades, columna) {
  nom_nova_col <- glue("log_{as_label(enquo(columna))}")
  
  dades %>% 
    mutate(!!nom_nova_col := log({{ columna }}))
}

mtcars %>% 
  calcular_log(mpg) %>% 
  select(mpg, log_mpg) %>% 
  head(3)
```

## Taula Resum de Decisions

A continuació es detalla l'eina recomanada segons la naturalesa de l'argument d'entrada i l'objectiu de la manipulació:

| Tipus d'Entrada | Objectiu | Eina Recomanada | Exemple |
| :--- | :--- | :--- | :--- |
| **Symbol** (`col`) | Passar variable sense cometes | `{{ col }}` | `summarise(df, m = mean({{ col }}))` |
| **String** (`"col"`) | Avaluar variable individual | `.data[["col"]]` | `filter(df, .data[["col"]] > 0)` |
| **Vector String** | Seleccionar múltiples columnes | `all_of(vars)` / `any_of(vars)` | `select(df, all_of(vars))` |
| **Múltiples cols** | Modificar diverses columnes | `across(all_of(vars), fn)` | `mutate(df, across(all_of(vars), log))` |
| **Nom Dinàmic** | Crear columna amb nom variable | `:=` amb `{{ }}` o `glue` | `mutate(df, "prefix_{var}" := val)` |

## Implementació Pràctica

A continuació es mostra la integració de tots aquests patrons en una funció d'anàlisi de dades modular. Aquesta funció rep un conjunt de dades, agrupa per una columna (passada com a *symbol*), calcula estadístics per a un conjunt de variables (passades com a *strings*) i genera una nova columna amb un nom calculat dinàmicament.

```r
library(dplyr)
library(glue)

# Funció d'anàlisi modular
analitzar_mètriques <- function(dades, grup_var, cols_analisi, llindar_hp = 100) {
  
  # 1. Nom dinàmic per a la variable indicadora
  nom_flag <- glue("alta_potencia_{llindar_hp}")
  
  dades %>% 
    # 2. Filtratge utilitzant sintaxi .data
    filter(.data[["hp"]] >= llindar_hp) %>% 
    
    # 3. Creació de nova columna amb nom dinàmic (:=)
    mutate(!!nom_flag := if_else(hp > 150, 1, 0)) %>% 
    
    # 4. Agrupació per variable sense cometes ({{ }})
    group_by({{ grup_var }}) %>% 
    
    # 5. Càlcul massiu sobre vector de variables en string (across + all_of)
    summarise(
      across(
        all_of(cols_analisi), 
        list(mitjana = ~ mean(.x, na.rm = TRUE), sd = ~ sd(.x, na.rm = TRUE)),
        .names = "{.col}_{.fn}"
      ),
      recompte = n(),
      .groups = "drop"
    )
}

# Execució de la funció sobre el dataset mtcars
variables_a_resumir <- c("mpg", "qsec")

resultat <- analitzar_mètriques(
  dades = mtcars, 
  grup_var = cyl, 
  cols_analisi = variables_a_resumir, 
  llindar_hp = 90
)

print(resultat)
```
