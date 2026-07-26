---
layout: post
title: "Com fer servir RANK i RANKX a DAX sense morir en l'intent"
tags:
  - dax
  - powerbi
  - business-intelligence
  - modelitzacio
excerpt: "La diferència entre RANK i RANKX a DAX i la guia pràctica per crear mesures de rànquing correctes evitant els errors de context més habituals."
---

El càlcul de rànquings en entorns de modelat de dades mitjançant DAX (Data Analysis Expressions) sol presentar reptes conceptuals associats a l'avaluació del context de filtre i a la transició de context. La coexistència de la funció iterativa tradicional `RANKX` i de la funció de finestra més recent `RANK` requereix compondre adequadament els patrons de formulació per evitar resultats incorrectes o ineficiències de rendiment.

## Diferències Clau entre RANKX i RANK

La diferència fonamental entre ambdues funcions rau en l'arquitectura d'avaluació interna:

* **`RANKX` (Funció iterativa):** Avalua una expressió per a cada fila d'una taula especificada. Opera realitzant un recorregut fila a fila, on es calcula el valor de referència i es compara respecte al conjunt d'avaluació definit.
* **`RANK` (Funció de finestra):** Introduïda per simplificar les operacions basades en relacions d'ordre, calcula el rang directament sobre un conjunt de dades definit mitjançant clàusules de partició i ordenació (`ORDERBY`, `PARTITIONBY`), reduint la necessitat de gestionar la transició de context de manera manual.

| Característica | RANKX | RANK |
| :--- | :--- | :--- |
| **Tipus de funció** | Iterador (`X-function`) | Funció de finestra |
| **Sintaxi principal** | `RANKX(Taula, Expressió, [Valor], [Ordre], [Ties])` | `RANK([Densitat], [Relació], [ORDERBY()], [Blanks], [PARTITIONBY()])` |
| **Avaluació de context** | Requerix `ALL` o `ALLSELECTED` per modificar el context de filtre | Utilitza relacions primitives o taules directes dins de `ORDERBY` |
| **Transició de Context** | Automàtica quan s'invoca una mesura dins l'expressió | Implicitament gestionada per la finestra definitòria |

## Casos d'Ús, Errors Habituals i el paper de HASONEVALUE

Un dels errors més comuns en utilitzar `RANKX` dins d'una mesura és obtenir el valor `1` de forma constant per a totes les files de la matriu o taula visual.

Això passa quan el primer argument de `RANKX` és la taula actual del context de fila sense cap modificador de filtre (per exemple, la taula `Productes` directament). Com que el visual avalua la mesura filtre a filtre (un sol producte per fila), la taula sobre la qual itera `RANKX` conté un únic element, fent que el rànquing d'aquest element respecte a si mateix sigui sempre `1`.

Per evitar-ho, cal expandir el context d'avaluació utilitzant `ALL` (per calcular el rànquing absolut en tot el model) o `ALLSELECTED` (per calcular el rànquing respecte als elements actualment filtrats al report).

### El paper de HASONEVALUE

La funció `HASONEVALUE(Columna)` comprova si el context de filtre actual ha reduït els valors d'una columna a exactament un de sol. 

Això és fonamental en les mesures de rànquing per dues raons principals:
1. **Control de la fila de Totals:** A la fila de totals o subtotals d'un visual, la columna filtrada conté múltiples valors. Si s'executa el rànquing en aquesta fila, el càlcul no té sentit i pot retornar un resultat confús o erroni. `HASONEVALUE` permet retornar `BLANK()` directament en aquests nivells d'agregació.
2. **Context d'Avaluació Correcte:** Garanteix que la fórmula només s'executi quan l'element que es vol ranquejar està clarament definit a la fila actual.

## Dades d'Exemple per a la Implementació

Per tal d'il·lustrar el comportament de les fórmules, es considera la taula anomenada `VendesProducte` amb les dades següents:

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

## Implementació Pràctica

### Patró 1: Rànquing Clàssic amb `RANKX`

Per ranquejar els productes en funció del volum de vendes mantenint el filtre extern de la pantalla o aplicant `ALLSELECTED`:

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

En aquesta formulació:
1. `HASONEVALUE(VendesProducte[Producte])` verifica que el visual estigui avaluant un únic producte per fila.
2. `ALLSELECTED(VendesProducte[Producte])` extreu la llista de tots els productes visibles en el context actual.
3. `[Total Vendes]` provoca la transició de context, avaluant la suma de vendes per a cadascun dels productes de la llista iterada.

#### Resultat esperat de la mesura `Rang Producte RANKX`:

| Producte | Total Vendes | Rang Producte RANKX |
| :--- | :--- | :--- |
| Portàtil | 1200 | 1 |
| Telèfon | 800 | 2 |
| Cafetera | 200 | 3 |
| Auriculars | 150 | 4 |
| Llum | 50 | 5 |
| **Total** | **2400** | **BLANK** |

Si es requereix calcular el rànquing de productes separat per cada Categoria (és a dir, reiniciar el rànquing dins de cada grup), s'ajusta el conjunt sobre el qual itera `RANKX` utilitzant `ALLEXCEPT`:

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

La funció `RANK` permet expressar la lògica d'ordenació de manera declarativa utilitzant la sintaxi de funcions de finestra:

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

Per executar la mateixa lògica de rànquing per particions (per Categoria) amb la funció `RANK`, s'afegeix la clàusula `PARTITIONBY`:

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

L'ús de `PARTITIONBY` evita la necessitat de manipular complexament els filtres mitjançant `ALLEXCEPT` o `CALCULATE`, oferint un codi més estructurat i directe de mantenir en models complexos.
