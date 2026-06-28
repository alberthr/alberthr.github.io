---
layout: post
title: "Regressió lineal a Power BI amb DAX: LINEST i LINESTX"
tags:
  - powerbi
  - dax
  - estadistica
excerpt: "DAX incorpora les funcions LINEST i LINESTX per fer regressió lineal directament dins del model de Power BI. Repassem la sintaxi, com extreure pendent, intercepct i R² amb SELECTCOLUMNS, un cas pràctic de vendes vs. inversió en promoció, i els principals indicadors estadístics que cal vigilar per interpretar el model."
---

Fins fa relativament poc, fer una regressió lineal dins de Power BI obligava a recórrer a trucs amb `SUMX`, fórmules estadístiques manuals (suma de quadrats, covariàncies...) o a sortir del model cap a Python/R. Des de 2023, DAX incorpora dues funcions natives pensades exactament per això: **`LINEST`** i **`LINESTX`**. En aquest post repassem com funcionen, com escriure'n el codi i com interpretar els indicadors que retornen.

## Per què fer regressió dins del mateix model

Treballant amb dades de vendes (el meu cas habitual a ALDI), és molt útil poder respondre preguntes com:

- Quina relació hi ha entre la inversió en promocions i les vendes resultants?
- Quin és el pes (slope) de cada variable quan hi ha més d'un factor explicatiu?
- Quina part de la variabilitat de les vendes queda explicada pel model (R²)?

Fer-ho amb DAX té l'avantatge que el càlcul respon dinàmicament als filtres, segmentadors i al context del visual, sense haver d'exportar dades.

## `LINEST` vs `LINESTX`

| | `LINEST` | `LINESTX` |
|---|---|---|
| Entrada | Columnes directes d'una taula | Una taula + expressions (poden ser mesures) avaluades fila a fila |
| Flexibilitat | Menor, només referències de columna | Major, admet `FILTER`, `SUMMARIZECOLUMNS`, mesures... |
| Ús típic | Regressions ràpides sobre una taula plana | Regressions sobre dades agregades o filtrades dinàmicament |

Internament, `LINEST` crida `LINESTX`, així que en la pràctica gairebé sempre és més útil dominar `LINESTX`.

### Sintaxi

```dax
LINEST ( <ColumnaY>, <ColumnaX> [, <ColumnaX> [, … ] ] [, <Const>] )

LINESTX ( <Taula>, <ExpressióY>, <ExpressióX> [, <ExpressióX> [, … ] ] [, <Const>] )
```

Totes dues retornen una **taula d'una sola fila** amb columnes com:

- `Slope1`, `Slope2`, ... `SlopeN` → el pendent associat a cada variable X
- `Intercept` → el terme constant (b)
- `CoefficientOfDetermination` → el R² del model
- `StandardError`, `StandardErrorSlope1`, `StandardErrorIntercept` → errors estàndard
- `FStatistic`, `DegreesOfFreedom`, `RegressionSumOfSquares`, `ResidualSumOfSquares` → estadístics del contrast de significació

## Exemple pràctic: vendes en funció de la inversió en promoció

Imaginem una taula `Vendes` amb una fila per botiga i setmana, amb columnes `Vendes[Import]` i `Vendes[InversioPromocio]`.

### 1. Mesura de regressió simple

```dax
RegressioSimple =
LINESTX (
    Vendes,
    Vendes[Import],
    Vendes[InversioPromocio]
)
```

Aquesta mesura/taula calculada retorna una fila amb `Slope1`, `Intercept`, `CoefficientOfDetermination`, etc., calculats sobre el context de filtre actiu (per exemple, si hi ha un segmentador de botiga, el model es recalcula només amb les files visibles).

### 2. Extreure'n els valors individuals

Com que `LINESTX` retorna una taula i no un escalar, cal aïllar els valors amb `SELECTCOLUMNS` i variables, perquè no es recalculi la regressió cada cop que es referencia un resultat:

```dax
Pendent =
VAR Resultat =
    LINESTX (
        Vendes,
        Vendes[Import],
        Vendes[InversioPromocio]
    )
RETURN
    SELECTCOLUMNS ( Resultat, "S", [Slope1] )

Interceptor =
VAR Resultat =
    LINESTX (
        Vendes,
        Vendes[Import],
        Vendes[InversioPromocio]
    )
RETURN
    SELECTCOLUMNS ( Resultat, "I", [Intercept] )

R2 =
VAR Resultat =
    LINESTX (
        Vendes,
        Vendes[Import],
        Vendes[InversioPromocio]
    )
RETURN
    SELECTCOLUMNS ( Resultat, "R2", [CoefficientOfDetermination] )
```

### 3. Predicció (estimació) a partir del model

Un cop tenim pendent i intercepció, la predicció és senzilla:

```dax
VendaEstimada =
VAR Resultat =
    LINESTX (
        Vendes,
        Vendes[Import],
        Vendes[InversioPromocio]
    )
VAR Pendent = SELECTCOLUMNS ( Resultat, "S", [Slope1] )
VAR Interceptor = SELECTCOLUMNS ( Resultat, "I", [Intercept] )
RETURN
    Interceptor + Pendent * [InversioPromocioSeleccionada]
```

`[InversioPromocioSeleccionada]` pot ser una mesura lligada a una taula de paràmetres (*what-if parameter*), de manera que des d'un slicer es pugui simular "si invertim X € en promoció, quina venda esperem?".

### 4. Regressió múltiple

Si volem afegir més variables explicatives, per exemple el nombre de cares (*facings*) de producte a botiga:

```dax
RegressioMultiple =
LINESTX (
    Vendes,
    Vendes[Import],
    Vendes[InversioPromocio],
    Vendes[Facings]
)
```

L'equació resultant seguirà la forma:

```
Import = Slope1 * InversioPromocio + Slope2 * Facings + Intercept
```

### 5. Regressió sobre dades agregades amb `SUMMARIZECOLUMNS`

Sovint interessa més fer la regressió a nivell de botiga (agregant totes les setmanes) que fila a fila:

```dax
RegressioPerBotiga =
VAR Agregat =
    SUMMARIZECOLUMNS (
        Vendes[Botiga],
        "VendaTotal", SUM ( Vendes[Import] ),
        "InversioTotal", SUM ( Vendes[InversioPromocio] )
    )
RETURN
    LINESTX ( Agregat, [VendaTotal], [InversioTotal] )
```

Aquest patró és el que recomana SQLBI: combinar `SUMMARIZECOLUMNS` per construir la taula de treball i `LINESTX` per ajustar-hi la recta.

## Principals indicadors a vigilar

Quan obris el resultat de `LINESTX` (per exemple amb una taula calculada o `EVALUATE` des de DAX Studio), aquests són els camps que val la pena interpretar:

- **`Slope1...N`**: quant varia la Y per cada unitat que varia cada X. És el coeficient clau del model.
- **`Intercept`**: el valor de Y quan totes les X són zero. Útil per a la interpretació, però sovint sense sentit pràctic directe (per exemple, "vendes amb zero inversió").
- **`CoefficientOfDetermination` (R²)**: entre 0 i 1; com més proper a 1, més variabilitat de Y explica el model. Per sota de ~0,3 normalment indica que el model té poc poder explicatiu.
- **`StandardErrorSlope1...N`** i **`StandardErrorIntercept`**: precisió de les estimacions. Un error estàndard gran en relació amb el pendent és senyal d'inestabilitat.
- **`FStatistic`** i **`DegreesOfFreedom`**: permeten valorar si la relació observada és estadísticament significativa o podria ser deguda a l'atzar.
- **`RegressionSumOfSquares`** i **`ResidualSumOfSquares`**: descomponen la variabilitat total entre la part explicada pel model i la part residual; la seva proporció és, de fet, la base del càlcul de R².

## Algunes cauteles

- `LINESTX` i `LINEST` tenen un **bug conegut amb segmentadors** en algunes versions: si el resultat no canvia en filtrar, val la pena revisar el context de filtre amb `ALLSELECTED`/`FILTER` explícits dins de la consulta.
- Com que el resultat és una taula, cal **emmagatzemar-lo en una variable** abans d'extreure'n columnes amb `SELECTCOLUMNS`; si no, DAX podria recalcular la regressió diverses vegades dins de la mateixa mesura.
- Aquestes funcions fan regressió **lineal** (i lineal en els paràmetres). Per a relacions no lineals cal transformar prèviament les variables (logaritmes, polinomis) o sortir del DAX cap a un llenguatge estadístic.

## Per saber-ne més

Si vols aprofundir-hi, els articles de SQLBI sobre `LINEST`/`LINESTX` i la documentació oficial de Microsoft Learn són la referència més sòlida per entendre els detalls dels paràmetres opcionals i el comportament en context de filtre.
