---
layout: post
title: "Pivotar i Despivotar Taules a 4 Eines Diferents"
tags:
  - powerbi
  - sql
  - r
  - python
excerpt: "Convertir taules de format llarg a ample (pivotar) o d'ample a llarg (despivotar) és una de les transformacions més habituals en analítica de dades. Com fer-ho a Power Query, SQL, R i Python amb el mateix exemple."
---

Gairebé qualsevol flux de treball amb dades passa, en algun moment, per canviar la seva forma: convertir files en columnes (**pivotar**) o columnes en files (**despivotar**). No és una qüestió estètica: el format **llarg** (una fila per combinació d'observació i variable) sol ser el que necessiten els gràfics, els models estadístics i les taules dinàmiques, mentre que el format **ample** (una columna per categoria) sol ser el que espera un informe final o una taula de doble entrada per llegir a ull.

Aquest post mostra com fer totes dues operacions amb el mateix exemple a quatre eines: **Power Query**, **SQL** (Oracle, amb una nota sobre Databricks), **R** i **Python**.

## L'exemple compartit

Es parteix d'una taula de vendes en **format llarg**, amb una fila per botiga i mes:

| botiga | mes | vendes |
|---|---|---|
| Nord | Gener | 120 |
| Nord | Febrer | 150 |
| Nord | Març | 130 |
| Sud | Gener | 200 |
| Sud | Febrer | 180 |
| Sud | Març | 210 |

**Pivotar** aquesta taula (convertir els valors de `mes` en columnes noves) dona el **format ample**:

| botiga | Gener | Febrer | Març |
|---|---|---|---|
| Nord | 120 | 150 | 130 |
| Sud | 200 | 180 | 210 |

**Despivotar** és l'operació inversa: partint de la taula ample, es torna a la taula llarga original.


## Power Query

Power Query (dins de Power BI o Excel) fa totes dues operacions des de la interfície, sense escriure codi, encara que genera codi M per darrere.

### Pivotar

1. Es selecciona la columna que contindrà els **noms** de les noves columnes (`mes`).
2. **Transformar → Columna dinàmica** (*Pivot Column*).
3. Es tria la columna de **valors** (`vendes`) i la **funció d'agregació** (Suma, ja que hi hauria d'haver com a màxim un valor per cada combinació de botiga i mes; si n'hi hagués més d'un, calen sumar-los o promitjar-los).

El pas equivalent en codi M (visible al panell de fórmules) és:

```
= Table.Pivot(TaulaOrigen, List.Distinct(TaulaOrigen[mes]), "mes", "vendes", List.Sum)
```

### Despivotar

1. Se seleccionen les columnes que s'han de convertir en files (`Gener`, `Febrer`, `Març`); o bé se selecciona `botiga` i s'utilitza **"Unpivot Other Columns"** perquè funcioni automàticament encara que s'afegeixin més mesos en el futur.
2. **Transformar → Anul·lar dinamització de columnes** (*Unpivot Columns*).

Codi M equivalent:

```
= Table.UnpivotOtherColumns(TaulaOrigen, {"botiga"}, "mes", "vendes")
```

L'opció "Unpivot **Other** Columns" (en lloc de seleccionar manualment les columnes de mes) és la més robusta per a manteniment: si el mes següent s'afegeix una columna nova (`Abril`), la consulta ja la recull automàticament sense haver de tocar cap pas.


## SQL (Oracle)

Oracle incorpora les clàusules `PIVOT` i `UNPIVOT` natives des de la versió 11g.

### PIVOT

```sql
SELECT *
FROM (
    SELECT botiga, mes, vendes
    FROM vendes_llarg
)
PIVOT (
    SUM(vendes)
    FOR mes IN ('Gener' AS Gener, 'Febrer' AS Febrer, 'Març' AS Marc)
);
```

Com a `PIVOT`, cal indicar sempre una **funció d'agregació** (`SUM`, encara que només hi hagi un valor per combinació), i la clàusula `FOR ... IN (...)` indica quina columna es converteix en noms de columna i quins valors concrets es volen com a columnes noves (l'`AS` assigna l'alias final).

### UNPIVOT

```sql
SELECT botiga, mes, vendes
FROM vendes_ample
UNPIVOT (
    vendes
    FOR mes IN (Gener AS 'Gener', Febrer AS 'Febrer', Marc AS 'Març')
);
```

**Detall a vigilar:** l'ordre de l'`AS` s'inverteix entre `PIVOT` i `UNPIVOT`. A `PIVOT` és `'valor' AS Alias`; a `UNPIVOT` és `Columna AS 'valor'`. És un error habitual copiar l'ordre d'un a l'altre sense adonar-se'n.

### Nota sobre Databricks SQL

Databricks SQL (des del Databricks Runtime 12.2 LTS) té les mateixes clàusules `PIVOT` i `UNPIVOT`, amb una sintaxi pràcticament idèntica:

```sql
-- PIVOT a Databricks SQL: no cal l'AS, agafa el valor literal com a nom de columna
SELECT * FROM (
    SELECT botiga, mes, vendes FROM vendes_llarg
)
PIVOT (
    SUM(vendes) FOR mes IN ('Gener', 'Febrer', 'Març')
);

-- UNPIVOT a Databricks SQL
SELECT botiga, mes, vendes
FROM vendes_ample
UNPIVOT (vendes FOR mes IN (Gener, Febrer, Marc));
```

La diferència principal és que Databricks no exigeix l'`AS` per assignar l'alias (agafa directament el literal o el nom de columna), cosa que fa la sintaxi una mica més curta. Si es fa servir PySpark en lloc de SQL, el DataFrame té a més el mètode natiu `.unpivot()`.

### Alternativa sense PIVOT/UNPIVOT natiu (PostgreSQL, MySQL...)

Per a motors sense aquestes clàusules, el `PIVOT` es fa amb agregació condicional:

```sql
SELECT botiga,
       SUM(CASE WHEN mes = 'Gener' THEN vendes END) AS Gener,
       SUM(CASE WHEN mes = 'Febrer' THEN vendes END) AS Febrer,
       SUM(CASE WHEN mes = 'Març' THEN vendes END) AS Marc
FROM vendes_llarg
GROUP BY botiga;
```

I l'`UNPIVOT` amb una unió de seleccions (`UNION ALL`), una per cada columna original:

```sql
SELECT botiga, 'Gener' AS mes, Gener AS vendes FROM vendes_ample
UNION ALL
SELECT botiga, 'Febrer', Febrer FROM vendes_ample
UNION ALL
SELECT botiga, 'Març', Marc FROM vendes_ample;
```


## R (amb `tidyr`)

Des de fa uns anys, `tidyr` ha unificat el vocabulari al voltant de "llarg" i "ample" amb `pivot_wider()` i `pivot_longer()` (substituint les antigues `spread()` i `gather()`).

```r
library(tidyr)

# Pivotar: de llarg a ample
vendes_ample <- pivot_wider(
  vendes_llarg,
  names_from = mes,
  values_from = vendes
)

# Despivotar: d'ample a llarg
vendes_llarg_recuperat <- pivot_longer(
  vendes_ample,
  cols = -botiga,          # totes les columnes excepte 'botiga'
  names_to = "mes",
  values_to = "vendes"
)
```

`cols = -botiga` indica "totes les columnes menys aquesta", exactament l'equivalent de l'opció "Unpivot Other Columns" de Power Query: si s'afegeix un mes nou, no cal tocar el codi.

### Alternativa amb `reshape2` (`melt` / `dcast`)

Abans que `tidyr` estandarditzés `pivot_wider()`/`pivot_longer()`, l'eina habitual per a aquesta feina era el paquet `reshape2`, amb `melt()` (despivotar) i `dcast()` (pivotar). Encara apareix amb freqüència en codi més antic o en exemples de Stack Overflow:

```r
library(reshape2)

# Despivotar amb melt (equivalent a pivot_longer)
vendes_llarg_recuperat <- melt(
  vendes_ample,
  id.vars = "botiga",
  variable.name = "mes",
  value.name = "vendes"
)

# Pivotar amb dcast (equivalent a pivot_wider)
vendes_ample <- dcast(
  vendes_llarg,
  botiga ~ mes,
  value.var = "vendes",
  fun.aggregate = sum
)
```

La lògica és la mateixa (triar quines columnes es mantenen fixes i quines es pivoten/despivoten), però la sintaxi de `dcast()` amb fórmula (`botiga ~ mes`) resulta menys explícita que els arguments `names_from`/`values_from` de `pivot_wider()`. `tidyr` és l'opció recomanada avui dia per a codi nou, però reconèixer `melt`/`dcast` és útil per llegir codi existent.


## Python (amb `pandas`)

A `pandas`, l'operació de pivotar es fa amb `pivot_table()` (o `pivot()` si no cal agregar) i la de despivotar amb `melt()`.

```python
import pandas as pd

# Pivotar: de llarg a ample
vendes_ample = vendes_llarg.pivot_table(
    index="botiga",
    columns="mes",
    values="vendes",
    aggfunc="sum"
).reset_index()

# Despivotar: d'ample a llarg
vendes_llarg_recuperat = vendes_ample.melt(
    id_vars="botiga",
    var_name="mes",
    value_name="vendes"
)
```

`pivot_table()` sempre necessita una funció d'agregació (`aggfunc`), fins i tot si en teoria només hi ha un valor per combinació; `pivot()` (sense `_table`) es pot fer servir en el seu lloc quan es té la certesa que no calen agregar duplicats, i és lleugerament més ràpid.


## Taula resum

| Eina | Pivotar (llarg → ample) | Despivotar (ample → llarg) |
|---|---|---|
| Power Query | `Table.Pivot(...)` / botó "Pivot Column" | `Table.UnpivotOtherColumns(...)` / botó "Unpivot Columns" |
| SQL (Oracle / Databricks) | `PIVOT (SUM(...) FOR col IN (...))` | `UNPIVOT (col FOR mes IN (...))` |
| SQL (sense PIVOT natiu) | `SUM(CASE WHEN ...)` + `GROUP BY` | `UNION ALL` d'una `SELECT` per columna |
| R (`tidyr`) | `pivot_wider()` | `pivot_longer()` |
| R (`reshape2`, més antic) | `dcast()` | `melt()` |
| Python (`pandas`) | `pivot_table()` / `pivot()` | `melt()` |


## Conclusió

Encara que cada eina tingui el seu propi nom per a l'operació (Pivot Column, PIVOT, `pivot_wider`, `pivot_table`...), el concepte de fons és idèntic a totes quatre: triar quina columna aporta els **noms** de les noves columnes, quina aporta els **valors**, i (en el cas de pivotar) amb quina funció s'han d'agregar els valors si n'hi ha més d'un per combinació. Un cop identificades aquestes tres peces, traduir l'operació d'una eina a una altra és gairebé mecànic.
