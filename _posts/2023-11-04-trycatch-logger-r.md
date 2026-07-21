---
layout: post
title: "Gestió d'Errors i Logs a R amb tryCatch i logger"
tags:
  - r
excerpt: "Com capturar errors sense aturar l'execució d'un script R amb tryCatch, i com registrar-ne l'activitat de manera estructurada amb el paquet logger, per a scripts i processos que s'executen sense supervisió."
---

Un script que s'executa un cop a la consola, mentre s'observa el resultat, pot permetre's que qualsevol error l'aturi en sec. Un procés que s'executa automàticament (un ETL nocturn, un informe programat, una API) no se'l pot permetre: un sol error en una de mil iteracions no hauria de tombar tot el procés, i quan alguna cosa falla, cal poder saber què ha passat sense haver-ho vist en directe. Per a això serveixen `tryCatch` (gestió d'errors) i el paquet `logger` (registre estructurat de l'activitat).


## `tryCatch`: capturar errors sense aturar l'execució

Per defecte, quan una funció de R llança un error, l'execució s'atura completament. `tryCatch()` permet interceptar aquest error (i altres condicions, com els avisos) i decidir què fer amb ell, sense que el programa mori.

### Sintaxi bàsica

```r
resultat <- tryCatch(
  {
    # Codi que es vol executar
    100 / "a"  # Provocarà un error
  },
  error = function(e) {
    # Codi que s'executa NOMÉS si hi ha un error
    message("S'ha capturat un error: ", conditionMessage(e))
    return(NA)  # Valor alternatiu a retornar
  }
)

print(resultat)  # NA
```

`tryCatch()` avalua el primer bloc; si tot va bé, retorna el seu resultat amb normalitat. Si es produeix un error, l'execució d'aquell bloc s'atura immediatament (no continua després de la línia que ha fallat) i el control passa a la funció indicada a `error =`, que rep l'objecte de la condició (`e`) i pot fer-hi el que calgui: registrar-lo, retornar un valor per defecte, o tornar a llançar-lo.

### Tres tipus de condicions: error, warning i message

`tryCatch()` no només captura errors; pot interceptar per separat els tres tipus de condicions que R pot generar:

```r
gestionar <- function(x) {
  tryCatch(
    {
      if (x < 0) warning("Valor negatiu, es farà servir el valor absolut")
      log(x)
    },
    error = function(e) {
      message("Error real: ", conditionMessage(e))
      NA
    },
    warning = function(w) {
      message("Avís capturat: ", conditionMessage(w))
      log(abs(x))  # Es recupera amb una alternativa raonable
    }
  )
}

gestionar(-4)   # Avís capturat + retorna log(4)
gestionar("a")  # Error real + retorna NA
```

És important saber que, si hi ha un bloc `warning =`, els avisos deixen d'aparèixer per pantalla de la manera habitual: es "consumeixen" dins del `tryCatch`, i cal decidir explícitament què fer-ne (registrar-los, ignorar-los, o convertir-los en un valor per defecte).

### `finally`: codi que sempre s'executa

Un quart argument, `finally`, permet indicar codi que s'executa **sempre**, hi hagi hagut error o no — útil per tancar connexions, fitxers o alliberar recursos:

```r
connexio <- NULL
tryCatch(
  {
    connexio <- DBI::dbConnect(RSQLite::SQLite(), "dades.db")
    dades <- DBI::dbGetQuery(connexio, "SELECT * FROM vendes")
  },
  error = function(e) {
    message("Error accedint a la base de dades: ", conditionMessage(e))
  },
  finally = {
    if (!is.null(connexio)) DBI::dbDisconnect(connexio)
    message("Connexió tancada.")
  }
)
```

### `tryCatch` dins d'un bucle: no aturar tot per un sol cas

Un dels usos més habituals: processar una llista d'elements (fitxers, APIs, taules) sense que un sol element problemàtic aturi tots els altres.

```r
fitxers <- c("dades_2024.csv", "dades_2025.csv", "dades_corrupte.csv")
resultats <- list()

for (f in fitxers) {
  resultats[[f]] <- tryCatch(
    {
      read.csv(f)
    },
    error = function(e) {
      message("No s'ha pogut llegir ", f, ": ", conditionMessage(e))
      NULL  # Es guarda un NULL per a aquest fitxer i es continua amb el següent
    }
  )
}

# Es descarten els fitxers que han fallat abans de continuar
resultats <- Filter(Negate(is.null), resultats)
```


## El paquet `logger`: registre estructurat

`message()` i `print()` són suficients per a un script petit, però no permeten distingir nivells de gravetat, no es guarden automàticament a un fitxer, i no tenen un format consistent. El paquet **`logger`** resol tot això amb una API senzilla inspirada en llibreries de logging d'altres llenguatges (com `logging` de Python o `log4j` de Java).

### Configuració bàsica

```r
library(logger)

# Nivell mínim que es registrarà (missatges per sota d'aquest nivell s'ignoren)
log_threshold(INFO)

# Format de sortida (per defecte inclou timestamp, nivell i missatge)
log_info("Procés iniciat")
log_warn("La taula té {sum(is.na(dades))} valors NA")
log_error("No s'ha pogut connectar a la base de dades")
```

Sortida per pantalla, per exemple:

```
INFO [2026-07-19 10:32:01] Procés iniciat
WARN [2026-07-19 10:32:03] La taula té 12 valors NA
ERROR [2026-07-19 10:32:05] No s'ha pogut connectar a la base de dades
```

### Nivells de log disponibles

De menys a més greu: `TRACE`, `DEBUG`, `INFO`, `SUCCESS`, `WARN`, `ERROR`, `FATAL`. Fixar `log_threshold(WARN)` fa que només es mostrin els missatges de `WARN` en amunt, útil per silenciar el detall de `DEBUG`/`INFO` en producció sense haver d'eliminar les crides del codi.

### Escriure els logs a un fitxer

Per defecte `logger` escriu a la consola, però es pot redirigir (o duplicar) la sortida cap a un fitxer:

```r
log_appender(appender_file("procesos.log"))

log_info("Aquest missatge ja va al fitxer procesos.log")

# Per escriure alhora a consola i fitxer:
log_appender(appender_tee("procesos.log"))
```

### Interpolació de variables al missatge

`logger` interpola directament expressions de R dins de claus `{ }`, sense necessitat de `paste()` ni `sprintf()`:

```r
n_files <- 3
log_info("S'han processat {n_files} fitxers correctament")
```


## Combinant `tryCatch` i `logger`

L'ús real, i el motiu pel qual val la pena conèixer totes dues eines juntes, és combinar-les: capturar l'error amb `tryCatch` i registrar-lo amb `logger`, en lloc de només mostrar-lo per pantalla amb `message()`.

```r
library(logger)
log_threshold(INFO)
log_appender(appender_tee("procesos.log"))

processar_fitxer <- function(ruta) {
  tryCatch(
    {
      log_info("Processant {ruta}")
      dades <- read.csv(ruta)
      log_success("{ruta} processat correctament ({nrow(dades)} files)")
      dades
    },
    warning = function(w) {
      log_warn("Avís processant {ruta}: {conditionMessage(w)}")
      NULL
    },
    error = function(e) {
      log_error("Error processant {ruta}: {conditionMessage(e)}")
      NULL
    }
  )
}

fitxers <- c("vendes_gener.csv", "vendes_febrer.csv", "vendes_corrupte.csv")
resultats <- lapply(fitxers, processar_fitxer)
```

Amb aquest patró, el procés continua encara que algun fitxer falli, i el fitxer `procesos.log` queda amb un registre complet i cronològic de què ha passat a cada pas — imprescindible per diagnosticar un procés que s'executa sense supervisió (per exemple, en un `cron job` o una tasca programada nocturna).


## Bones pràctiques

- **No capturar errors "en silenci":** un `tryCatch` amb un bloc `error` buit (que no registra ni informa de res) amaga problemes reals i fa molt més difícil el diagnòstic posterior. Com a mínim, sempre cal registrar l'error amb `log_error()` o `message()`.
- **No abusar de `tryCatch` per controlar flux normal:** si un cas es pot preveure amb un `if` (per exemple, comprovar si un fitxer existeix amb `file.exists()` abans de llegir-lo), és més clar fer-ho així que confiar que `tryCatch` capturi l'error resultant.
- **Fixar sempre un `log_threshold` adequat a l'entorn:** `DEBUG` o `TRACE` en desenvolupament, `INFO` o `WARN` en producció, per no inflar els fitxers de log amb detall innecessari.
- **Guardar els logs amb data al nom del fitxer** (per exemple, `glue::glue("procesos_{Sys.Date()}.log")`) si el procés s'executa diàriament, per no sobreescriure l'historial de dies anteriors.


## Conclusió

`tryCatch` i `logger` responen a dues preguntes complementàries d'un mateix problema: què fer quan alguna cosa falla (`tryCatch`) i com deixar constància de què ha passat, hagi fallat o no (`logger`). Junts converteixen un script que "funciona a la meva màquina mentre el miro" en un procés robust, capaç d'executar-se sense supervisió i de deixar prou informació per entendre qualsevol problema després dels fets, sense haver-lo vist en directe.
