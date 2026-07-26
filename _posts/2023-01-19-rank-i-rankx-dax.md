---
layout: post
title: "Diferències i Patrons d'Ús de RANK i RANKX a DAX"
tags:
  - powerbi
excerpt: "Comparativa pràctica entre RANKX i RANK a DAX: diferències, sintaxi i exemples per calcular rànquings generals i per categoria de producte a Power BI, amb els resultats esperats de cada patró i com aplicar-los en informes reals."
---

Calcular rànquings a DAX (Data Analysis Expressions) obliga a entendre bé sobre quin conjunt d'elements s'està comparant cada fila. Hi ha dues maneres de fer-ho: la funció iterativa clàssica `RANKX` i la funció de finestra `RANK`. Aquest post compara totes dues i mostra com implementar-les correctament.

## Diferències Clau entre RANKX i RANK

* **`RANKX` (Funció iterativa):** Recorre una taula fila a fila. Per cada fila calcula el valor de referència i el compara amb la resta del conjunt indicat.
* **`RANK` (Funció de finestra):** Calcula el rang directament sobre un conjunt de dades definit amb clàusules de partició i ordenació (`ORDERBY`, `PARTITIONBY`), sense necessitat d'indicar manualment quin és el conjunt de comparació.

| Característica | RANKX | RANK |
| :--- | :--- | :--- |
| **Tipus de funció** | Iterador (`X-function`) | Funció de finestra |
| **Sintaxi principal** | `RANKX(Taula, Expressió, [Valor], [Ordre], [Ties])` | `RANK([Densitat], [Relació], [ORDERBY()], [Blanks], [PARTITIONBY()])` |
| **Conjunt de comparació** | Cal indicar-lo amb `ALL` o `ALLSELECTED` | S'indica amb `ORDERBY` i, opcionalment, `PARTITIONBY` |
| **Recàlcul per fila** | Automàtic quan s'invoca una mesura dins l'expressió | Ja incorporat en el funcionament de la finestra |

## Dades d'Exemple per a la Implementació

Per il·lustrar el comportament de les fórmules, es fa servir la taula `VendesProducte`:

| Categoria | Producte | ImportVendes |
| :--- | :--- | :--- |
| Electrònica | Portàtil | 1200 |
| Electrònica | Telèfon | 800 |
| Electrònica | Auriculars | 150 |
| Llar | Cafetera | 200 |
| Llar | Llum | 50 |

Es defineix la mesura base de suma d'import:

```dax
Total Vendes = SUM(VendesProducte[ImportVendes])
```

Es fa servir una mesura i no la columna `ImportVendes` directament perquè `RANKX` recorre la taula fila a fila i, per a cada fila, ha de recalcular el total corresponent només a aquell producte. Si s'hi posés la columna directament, el valor no es recalcularia i sortiria el mateix número a totes les files. Una mesura, en canvi, sí que es recalcula per a cada fila.

De fet, dins de `RANKX` es podria substituir `[Total Vendes]` per `SUM(VendesProducte[ImportVendes])` directament i el resultat seria idèntic. Fer-la servir com a mesura (`[Total Vendes]`) és útil sobretot per reutilitzar-la en altres càlculs sense repetir la fórmula. Si a més es vol aplicar-hi algun filtre addicional (per exemple, excloure una categoria concreta), llavors es podria fer servir `CALCULATE`.

## Implementació Pràctica de Mesures de Rànquing

### Patró 1: Rànquing Clàssic amb `RANKX`

Per ranquejar els productes segons el volum de vendes mantenint el filtre extern de la pantalla (o aplicant `ALLSELECTED`):

```dax
Rang Producte RANKX = 
IF(
    HASONEVALUE(VendesProducte[Producte]),
    RANKX(
        ALLSELECTED(VendesProducte[Producte]),
        [Total Vendes],
        ,
        DESC,
        Dense
    ),
    BLANK()
)
```

#### Resultat esperat de la mesura `Rang Producte RANKX`:

| Producte | Total Vendes | Rang Producte RANKX |
| :--- | :--- | :--- |
| Portàtil | 1200 | 1 |
| Telèfon | 800 | 2 |
| Cafetera | 200 | 3 |
| Auriculars | 150 | 4 |
| Llum | 50 | 5 |
| **Total** | **2400** | **BLANK** |

`HASONEVALUE(VendesProducte[Producte])` comprova que a la fila actual hi ha un sol producte seleccionat. A la fila de Total hi ha tots els productes barrejats, i ranquejar-los junts no vol dir res, per això la mesura hi retorna `BLANK()`. Si no s'hi posessin `ALL` o `ALLSELECTED` dins de `RANKX`, cada fila només es compararia amb ella mateixa i el rànquing sortiria sempre 1.

Si es vol calcular el rànquing de productes separat per cada Categoria (reiniciant el rànquing dins de cada grup), cal ajustar el conjunt sobre el qual itera `RANKX` amb `ALLEXCEPT`:

```dax
Rang Producte per Categoria RANKX = 
IF(
    HASONEVALUE(VendesProducte[Producte]),
    RANKX(
        ALLEXCEPT(VendesProducte, VendesProducte[Categoria]),
        [Total Vendes],
        ,
        DESC,
        Dense
    ),
    BLANK()
)
```

#### Resultat esperat per Categoria:

| Categoria | Producte | Total Vendes | Rang Producte per Categoria RANKX |
| :--- | :--- | :--- | :--- |
| Electrònica | Portàtil | 1200 | 1 |
| Electrònica | Telèfon | 800 | 2 |
| Electrònica | Auriculars | 150 | 3 |
| Llar | Cafetera | 200 | 1 |
| Llar | Llum | 50 | 2 |

### Patró 2: Rànquing Modern amb `RANK`

La funció `RANK` permet expressar la mateixa lògica de manera declarativa, amb sintaxi de funció de finestra:

```dax
Rang Producte RANK = 
IF(
    HASONEVALUE(VendesProducte[Producte]),
    RANK(
        DENSE,
        ALLSELECTED(VendesProducte[Producte]),
        ORDERBY([Total Vendes], DESC)
    ),
    BLANK()
)
```

Per fer el mateix rànquing per particions (per Categoria), s'afegeix la clàusula `PARTITIONBY`:

```dax
Rang Producte per Categoria RANK = 
IF(
    HASONEVALUE(VendesProducte[Producte]),
    RANK(
        DENSE,
        ALLSELECTED(VendesProducte[Producte], VendesProducte[Categoria]),
        ORDERBY([Total Vendes], DESC),
        DEFAULT,
        PARTITIONBY(VendesProducte[Categoria])
    ),
    BLANK()
)
```


