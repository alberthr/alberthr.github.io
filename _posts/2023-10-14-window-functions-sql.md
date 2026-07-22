---
layout: post
title: "Resum ràpid de les Funcions de Finestra a SQL"
tags:
  - sql
excerpt: "Panoràmica completa de les funcions de finestra (window functions) en SQL: rànquing, agregació, desplaçament i valors de posició, amb la sintaxi PARTITION BY, ORDER BY, la definició del frame amb ROWS/RANGE i molt més."
---

Les **funcions de finestra** (*window functions*) permeten calcular un valor que depèn d'un grup de files relacionades (una "finestra"), sense col·lapsar el resultat en una sola fila per grup com faria un `GROUP BY`. Cada fila original es manté, i s'hi afegeix una columna calculada a partir del seu grup. Aquest article en fa un repàs complet, organitzat per família de funcions.

## La sintaxi bàsica

Qualsevol funció de finestra segueix el mateix esquelet:

```sql
FUNCIO(...) OVER (
    PARTITION BY columna_grup
    ORDER BY columna_ordre
    [definició opcional del frame]
)
```

- **`PARTITION BY`**: defineix els grups (finestres) sobre els quals es calcula la funció, de manera anàloga a un `GROUP BY`, però sense col·lapsar files. És opcional; si s'omet, tota la taula es tracta com una única finestra.
- **`ORDER BY`**: defineix l'ordre dins de cada finestra. És obligatori per a les funcions de rànquing i de desplaçament, i opcional (però habitual) per a les d'agregació.
- **El frame** (`ROWS BETWEEN ...` o `RANGE BETWEEN ...`): defineix quines files concretes, dins de la finestra ja ordenada, entren en el càlcul per a cada fila (vegeu l'últim apartat).

### Ometre `PARTITION BY`: tota la taula com una sola finestra

Per tractar tota la taula com un únic grup, **no s'indica cap `PARTITION BY`**, simplement es fa `OVER (ORDER BY ...)` o fins i tot `OVER ()` buit del tot. No existeix cap sintaxi tipus `PARTITION BY 1` per aconseguir-ho (a diferència de `GROUP BY 1`, que en alguns motors sí és una posició numèrica vàlida); a `OVER()`, un `PARTITION BY` sempre espera una columna real, mai un número.

```sql
SELECT botiga, mes, vendes,
       -- OVER() buit: el total inclou TOTES les files de la taula, no només les de la botiga
       SUM(vendes) OVER () AS total_general,
       vendes / SUM(vendes) OVER () AS pes_sobre_total,
       -- ORDER BY sense PARTITION BY: acumulat sobre tota la taula, sense trencar per botiga
       SUM(vendes) OVER (ORDER BY mes) AS acumulat_global,
       RANK() OVER (ORDER BY vendes DESC) AS rank_global
FROM vendes_mensuals;
```

**Quan és útil:**
- **Calcular un total o mitjana general** al costat de cada fila de detall, per exemple per obtenir directament el percentatge que representa cada fila sobre el total de tota la taula (`vendes / SUM(vendes) OVER ()`), sense necessitat d'una subconsulta ni d'un `CROSS JOIN` amb el total.
- **Un rànquing global** (`RANK() OVER (ORDER BY ...)` sense `PARTITION BY`), quan interessa la posició de cada fila respecte a tot el conjunt de dades, no només respecte al seu grup.
- **Un acumulat global** (`SUM() OVER (ORDER BY ...)` sense `PARTITION BY`), quan la sèrie que interessa acumular no està trencada per cap categoria (per exemple, un total acumulat de vendes de tota l'empresa dia a dia, no botiga a botiga).

### La clàusula `WINDOW`: no repetir la mateixa definició

Quan es fan servir diverses funcions de finestra amb **exactament la mateixa** `PARTITION BY`/`ORDER BY`, escriure `OVER (PARTITION BY botiga ORDER BY mes)` una vegada i una altra és repetitiu i propens a errors si cal canviar-ho. La clàusula `WINDOW` permet definir-la un sol cop amb un nom i reutilitzar-la:

```sql
SELECT botiga, mes, vendes,
       SUM(vendes) OVER w AS total_acumulat,
       AVG(vendes) OVER w AS mitjana_acumulada,
       RANK() OVER w AS rank
FROM vendes_mensuals
WINDOW w AS (PARTITION BY botiga ORDER BY mes);
```

No està disponible a tots els motors (Oracle, per exemple, no la suporta; Databricks/Spark SQL sí), però quan hi és, evita repetir la mateixa definició tres o quatre vegades a la mateixa consulta.


## Funcions de rànquing

Assignen una posició numèrica a cada fila dins de la seva finestra, segons l'`ORDER BY` indicat.

- **`ROW_NUMBER()`**: numera les files de manera consecutiva i única (1, 2, 3, 4...), fins i tot si hi ha valors empatats a l'`ORDER BY` (en cas d'empat, l'ordre entre elles és arbitrari a menys que s'afegeixi un criteri de desempat).
- **`RANK()`**: numera igual que `ROW_NUMBER()`, però els valors empatats reben el mateix número, i el número següent **salta** tantes posicions com files empatades hi ha hagut (1, 2, 2, 4).
- **`DENSE_RANK()`**: igual que `RANK()`, però sense saltar cap número després d'un empat (1, 2, 2, 3).
- **`NTILE(n)`**: reparteix les files de la finestra en `n` grups del mateix mida (o gairebé, si el nombre de files no és divisible exactament entre `n`), numerats de l'1 a `n`. Útil per crear quartils, decils, o qualsevol altra divisió en blocs iguals.

```sql
SELECT botiga, venedor, vendes,
       ROW_NUMBER() OVER (PARTITION BY botiga ORDER BY vendes DESC) AS num_fila,
       RANK()       OVER (PARTITION BY botiga ORDER BY vendes DESC) AS rank,
       DENSE_RANK() OVER (PARTITION BY botiga ORDER BY vendes DESC) AS dense_rank,
       NTILE(4)     OVER (PARTITION BY botiga ORDER BY vendes DESC) AS quartil
FROM vendes_venedors;
```

`ROW_NUMBER()` és, amb diferència, la més utilitzada a la pràctica: quedar-se amb el primer registre de cada grup (`WHERE num_fila = 1`, en una subconsulta) és un dels usos més habituals de totes les funcions de finestra.


## Funcions d'agregació com a finestra

Les funcions d'agregació clàssiques (`SUM`, `AVG`, `COUNT`, `MIN`, `MAX`) també es poden fer servir amb `OVER (...)` en lloc de `GROUP BY`, amb l'avantatge que el resultat es manté a nivell de fila, no de grup.

- **`SUM(columna) OVER (...)`**: suma total de la finestra (o suma acumulada, si s'indica un frame progressiu, vegeu més avall).
- **`AVG(columna) OVER (...)`**: mitjana de la finestra.
- **`COUNT(*) OVER (...)`** o **`COUNT(columna) OVER (...)`**: nombre de files de la finestra (totes, o només les que tenen valor no nul en aquella columna).
- **`MIN(columna) OVER (...)`** / **`MAX(columna) OVER (...)`**: valor mínim o màxim de la finestra.

```sql
SELECT botiga, mes, vendes,
       SUM(vendes) OVER (PARTITION BY botiga) AS total_botiga,
       AVG(vendes) OVER (PARTITION BY botiga) AS mitjana_botiga,
       vendes - AVG(vendes) OVER (PARTITION BY botiga) AS desviacio_respecte_mitjana,
       MAX(vendes) OVER (PARTITION BY botiga) AS millor_mes
FROM vendes_mensuals;
```

Aquest patró és molt habitual per calcular, en la mateixa fila, tant el valor individual com una referència del seu grup (el total, la mitjana, el màxim), per exemple per calcular directament el percentatge que cada fila representa sobre el total del seu grup (`vendes / total_botiga`).


## Funcions de desplaçament (`LAG` i `LEAD`)

Permeten accedir, des d'una fila, al valor d'una altra fila **anterior** o **posterior** dins de la mateixa finestra, sense necessitat de fer un auto-join.

- **`LAG(columna, n, valor_per_defecte) OVER (...)`**: el valor de la columna a `n` files **abans** de la fila actual (per defecte, `n=1`). Molt utilitzada per calcular diferències respecte al període anterior.
- **`LEAD(columna, n, valor_per_defecte) OVER (...)`**: el mateix, però mirant `n` files **després** de la fila actual.

```sql
SELECT botiga, mes, vendes,
       LAG(vendes, 1) OVER (PARTITION BY botiga ORDER BY mes) AS vendes_mes_anterior,
       vendes - LAG(vendes, 1) OVER (PARTITION BY botiga ORDER BY mes) AS diferencia_mensual,
       LEAD(vendes, 1) OVER (PARTITION BY botiga ORDER BY mes) AS vendes_mes_seguent
FROM vendes_mensuals;
```

El tercer argument (`valor_per_defecte`) és opcional i indica què retornar quan no existeix una fila anterior o posterior (per exemple, al primer mes de la sèrie, `LAG` no té cap fila anterior i, sense aquest argument, retorna `NULL`).


## Funcions de valor de posició

- **`FIRST_VALUE(columna) OVER (...)`**: el valor de la columna a la **primera** fila de la finestra, segons l'`ORDER BY` indicat.
- **`LAST_VALUE(columna) OVER (...)`**: el valor a la **darrera** fila de la finestra. Compte: amb el frame per defecte (vegeu més avall), `LAST_VALUE` sovint retorna el valor de la **fila actual**, no el de l'última fila de tota la finestra; cal indicar explícitament `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` perquè es comporti com s'esperaria de manera intuïtiva.
- **`NTH_VALUE(columna, n) OVER (...)`**: el valor de la columna a la posició `n` de la finestra (per exemple, el segon valor més alt, si l'`ORDER BY` és descendent).

```sql
SELECT botiga, mes, vendes,
       FIRST_VALUE(vendes) OVER (PARTITION BY botiga ORDER BY mes) AS vendes_primer_mes,
       LAST_VALUE(vendes) OVER (
           PARTITION BY botiga ORDER BY mes
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS vendes_ultim_mes,
       NTH_VALUE(vendes, 2) OVER (PARTITION BY botiga ORDER BY vendes DESC) AS segon_millor_mes
FROM vendes_mensuals;
```


## Funcions de distribució

- **`PERCENT_RANK()`**: la posició relativa de la fila dins de la finestra, en una escala de 0 a 1 (0 per a la primera fila, 1 per a l'última), calculada com $\frac{rang-1}{n-1}$.
- **`CUME_DIST()`** (distribució acumulada): el percentatge de files de la finestra amb un valor menor o igual que el de la fila actual, en una escala de 0 a 1 (sempre inclou com a mínim la pròpia fila, així que mai val 0).

```sql
SELECT botiga, venedor, vendes,
       PERCENT_RANK() OVER (PARTITION BY botiga ORDER BY vendes) AS percentil,
       CUME_DIST()    OVER (PARTITION BY botiga ORDER BY vendes) AS distribucio_acumulada
FROM vendes_venedors;
```

Aquestes dues es fan servir sobretot per identificar en quin percentil relatiu se situa cada fila dins del seu grup (per exemple, "aquest venedor està al top 10% de la seva botiga").


## El frame: `ROWS` vs `RANGE`

Per defecte, una funció d'agregació amb `OVER (... ORDER BY ...)` (sense indicar cap frame) es comporta com si el frame fos "des del principi de la finestra fins a la fila actual", cosa que la converteix, sense voler-ho, en un total acumulat en lloc d'un total del grup sencer. Per controlar aquest comportament amb precisió, cal conèixer les peces amb què es construeix el frame.

### Les peces del `BETWEEN`

Un frame es defineix sempre com `BETWEEN <punt_inicial> AND <punt_final>`, on cada punt es descriu amb una d'aquestes expressions:

- **`UNBOUNDED PRECEDING`**: "des del principi de tota la finestra". S'utilitza sempre com a punt inicial quan es vol incloure totes les files anteriors sense límit.
- **`N PRECEDING`**: "`N` files abans de la fila actual" (per exemple, `3 PRECEDING`). Defineix un límit mòbil que es desplaça amb cada fila.
- **`CURRENT ROW`**: "la fila actual". Es pot fer servir tant com a punt inicial com a punt final.
- **`N FOLLOWING`**: "`N` files després de la fila actual" (per exemple, `2 FOLLOWING`). L'equivalent de `PRECEDING` però mirant endavant.
- **`UNBOUNDED FOLLOWING`**: "fins al final de tota la finestra". S'utilitza com a punt final quan es vol incloure totes les files posteriors sense límit.

Es combinen sempre dos d'aquests punts, un com a inici i un com a final, i el punt inicial ha de quedar sempre "abans o igual" que el final dins de l'ordre de la finestra (per exemple, `BETWEEN CURRENT ROW AND 3 PRECEDING` no té sentit i donaria error o un frame buit).

### Els patrons habituals

| Frame | Significat | Ús típic |
|---|---|---|
| `UNBOUNDED PRECEDING AND CURRENT ROW` | Des del principi fins a la fila actual | Total o mitjana **acumulada** |
| `N PRECEDING AND CURRENT ROW` | Les `N` files anteriors més l'actual | Mitjana o suma **mòbil** de finestra fixa |
| `N PRECEDING AND N FOLLOWING` | Un marge simètric al voltant de la fila actual | Suavitzat centrat en la fila |
| `UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` | Totes les files de la finestra, sense importar la fila actual | Total o mitjana **del grup sencer**, repetit a cada fila |
| `CURRENT ROW AND UNBOUNDED FOLLOWING` | Des de la fila actual fins al final | Total **restant** (per exemple, "quant queda per vendre de l'objectiu") |

```sql
SELECT botiga, mes, vendes,
       -- Total acumulat (des del principi fins a la fila actual)
       SUM(vendes) OVER (
           PARTITION BY botiga ORDER BY mes
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS total_acumulat,
       -- Mitjana mòbil de les 3 files anteriors + l'actual (finestra de mida fixa, 3 enrere)
       AVG(vendes) OVER (
           PARTITION BY botiga ORDER BY mes
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS mitjana_movil_3,
       -- Mitjana centrada: 1 mes abans, el mes actual, i 1 mes després
       AVG(vendes) OVER (
           PARTITION BY botiga ORDER BY mes
           ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
       ) AS mitjana_centrada,
       -- Total de tota la finestra, sense importar la fila actual (el mateix valor a totes les files del grup)
       SUM(vendes) OVER (
           PARTITION BY botiga
           ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS total_grup,
       -- Quant falta per vendre des d'aquest mes fins al final de la finestra
       SUM(vendes) OVER (
           PARTITION BY botiga ORDER BY mes
           ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
       ) AS total_restant
FROM vendes_mensuals;
```

Val a dir que quan no s'indica cap `ORDER BY` dins de l'`OVER`, el frame no té cap sentit direccional (no hi ha "abans" ni "després"), i el motor tracta tota la `PARTITION BY` com una sola finestra sencera, equivalent a `UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.

### `ROWS` vs `RANGE`: la diferència real

`ROWS` defineix el frame comptant **files físiques**: `3 PRECEDING` sempre vol dir "exactament les 3 files anteriors", encara que dues d'elles tinguin el mateix valor a l'`ORDER BY`.

`RANGE` defineix el frame per **valor lògic** de l'`ORDER BY`: `RANGE BETWEEN 3 PRECEDING AND CURRENT ROW` amb un `ORDER BY data` no vol dir "les 3 files anteriors", sinó "totes les files amb una data com a màxim 3 dies abans de la data actual", independentment de quantes files calgui incloure per cobrir aquest rang (si hi ha diverses files amb la mateixa data, `RANGE` les tracta totes com un sol bloc). Aquesta diferència només es nota quan hi ha valors empatats a l'`ORDER BY`; si cada fila té un valor únic, `ROWS` i `RANGE` donen el mateix resultat.

A la pràctica, `ROWS` és la més utilitzada perquè el seu comportament és més fàcil de predir i no depèn de si hi ha empats a les dades.


## Funcions estadístiques

A més de `SUM`, `AVG`, `MIN`, `MAX` i `COUNT`, la majoria de motors (Oracle i Databricks inclosos) permeten fer servir com a finestra les funcions estadístiques més habituals, útils per analitzar la dispersió o la relació entre variables sense sortir de SQL.

- **`VAR_POP()` / `VAR_SAMP()`** (o `VARIANCE()` a Oracle, equivalent a `VAR_SAMP`): la variància poblacional o mostral dels valors de la finestra.
- **`STDDEV_POP()` / `STDDEV_SAMP()`** (o `STDDEV()` a Oracle): la desviació estàndard poblacional o mostral, l'arrel quadrada de les anteriors.
- **`CORR(y, x)`**: el coeficient de correlació de Pearson entre dues columnes numèriques, calculat sobre la finestra.
- **`COVAR_POP(y, x)` / `COVAR_SAMP(y, x)`**: la covariància poblacional o mostral entre dues columnes.
- **`PERCENTILE_CONT(p) WITHIN GROUP (ORDER BY columna)`**: el percentil `p` (per exemple, `0.5` per a la mediana) interpolant entre valors si cal. **`PERCENTILE_DISC(p)`** fa el mateix però retornant sempre un valor real de la columna, sense interpolar.
- **`MEDIAN(columna)`**: disponible directament a Oracle (equivalent a `PERCENTILE_CONT(0.5)`); a Databricks no existeix amb aquest nom, cal fer servir `PERCENTILE_CONT(0.5) WITHIN GROUP (...)` o la funció `median()` pròpia de Spark SQL.

```sql
SELECT botiga, mes, vendes,
       STDDEV_POP(vendes) OVER (PARTITION BY botiga) AS desviacio_botiga,
       VAR_POP(vendes)    OVER (PARTITION BY botiga) AS variancia_botiga,
       (vendes - AVG(vendes) OVER (PARTITION BY botiga))
            / NULLIF(STDDEV_POP(vendes) OVER (PARTITION BY botiga), 0) AS z_score,
       CORR(vendes, unitats) OVER (PARTITION BY botiga) AS correlacio_vendes_unitats,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY vendes)
           OVER (PARTITION BY botiga) AS mediana_botiga
FROM vendes_mensuals;
```

L'exemple del `z_score` (quantes desviacions estàndard s'allunya cada fila de la mitjana del seu grup) és un dels usos més pràctics d'aquesta família: permet detectar valors atípics dins de cada botiga directament amb SQL, sense necessitat d'exportar les dades a R o Python només per a aquest càlcul. El `NULLIF(..., 0)` evita un error de divisió per zero quan una botiga només té una fila (i, per tant, desviació estàndard 0).

**Nota de sintaxi:** `PERCENTILE_CONT`/`PERCENTILE_DISC` tenen una sintaxi diferent de la resta: la funció s'escriu sense arguments de columna (`PERCENTILE_CONT(0.5)`), la columna sobre la qual es calcula va dins de `WITHIN GROUP (ORDER BY ...)`, i el `PARTITION BY` s'indica igualment a l'`OVER()` final. És fàcil oblidar algun d'aquests tres trossos la primera vegada que s'utilitza.


## Taula resum

| Funció | Família | Què fa |
|---|---|---|
| `ROW_NUMBER()` | Rànquing | Numera sense empats (1,2,3,4) |
| `RANK()` | Rànquing | Numera amb empats i salts (1,2,2,4) |
| `DENSE_RANK()` | Rànquing | Numera amb empats sense salts (1,2,2,3) |
| `NTILE(n)` | Rànquing | Reparteix en `n` grups iguals |
| `SUM() OVER` | Agregació | Suma (total o acumulada segons el frame) |
| `AVG() OVER` | Agregació | Mitjana |
| `COUNT() OVER` | Agregació | Recompte de files |
| `MIN()` / `MAX() OVER` | Agregació | Valor mínim/màxim de la finestra |
| `LAG()` | Desplaçament | Valor d'una fila anterior |
| `LEAD()` | Desplaçament | Valor d'una fila posterior |
| `FIRST_VALUE()` | Posició | Valor de la primera fila |
| `LAST_VALUE()` | Posició | Valor de l'última fila (compte amb el frame) |
| `NTH_VALUE()` | Posició | Valor de la fila en la posició N |
| `PERCENT_RANK()` | Distribució | Posició relativa (0 a 1) |
| `CUME_DIST()` | Distribució | Distribució acumulada (0 a 1) |
| `VAR_POP()` / `VAR_SAMP()` | Estadística | Variància de la finestra |
| `STDDEV_POP()` / `STDDEV_SAMP()` | Estadística | Desviació estàndard de la finestra |
| `CORR()` | Estadística | Correlació entre dues columnes |
| `COVAR_POP()` / `COVAR_SAMP()` | Estadística | Covariància entre dues columnes |
| `PERCENTILE_CONT()` / `PERCENTILE_DISC()` | Estadística | Percentil (mediana, quartils...) |
