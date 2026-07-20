---
layout: post
title: "TREATAS a Power BI: Comparar Dues Seleccions d'un Mateix Filtre"
tags:
  - powerbi
excerpt: "Un mateix filtre de botiga només permet una selecció alhora, però un gràfic pot necessitar comparar-ne dues. TREATAS permet transportar un context de filtre a una altra taula sense relació física ni duplicar dades."
---

Un problema habitual en informes de Power BI: hi ha una taula de botigues amb un únic filtre (*slicer*), i un gràfic ha de mostrar l'evolució de vendes de **dues botigues diferents alhora** (o de dues seleccions diferents de botigues) per comparar-les. Amb un sol filtre només es pot fer una selecció, i el model de dades no admet nadiuament "seleccionar dues vegades" la mateixa columna.

La solució intuïtiva —duplicar la taula de fets per tenir dos contextos de filtre independents— sol ser inviable quan la taula és gran: duplica volum de dades, complica el manteniment del model i, sovint, ni tan sols és possible per límits de memòria. La funció **TREATAS** de DAX resol aquest problema sense duplicar res.

## Què fa TREATAS

`TREATAS` aplica els valors resultants d'una taula com a filtre sobre les columnes d'una altra taula, encara que entre totes dues **no hi hagi cap relació física** al model de dades. La sintaxi és:

```dax
TREATAS(<taula_o_expressió>, <columna1>[, <columna2>, ...])
```

El primer argument és una taula (o el resultat d'una expressió que en retorna una), i la resta d'arguments són les columnes, d'una o més taules del model, sobre les quals s'ha d'aplicar aquest resultat com a filtre. La correspondència es fa **per posició**, no per nom de columna ni per una relació existent: el primer valor de la taula d'entrada filtra la primera columna indicada, el segon valor filtra la segona columna, i així successivament.

En altres paraules: `TREATAS` permet dir "actua com si aquests valors haguessin arribat filtrant directament aquesta altra columna", sense necessitat que les dues taules estiguin connectades al diagrama de relacions.

## Com resol el problema de les dues seleccions

El motiu pel qual un sol *slicer* no permet comparar dues seleccions és el **context de filtre**: quan es filtra "Botiga A" i "Botiga B" alhora en el mateix camp, Power BI no crea dues sèries diferents, sinó un únic context que inclou totes dues botigues juntes (la suma, no la comparació).

La solució amb `TREATAS` consisteix a crear una **taula desconnectada** (sense relació al model) amb els noms de les botigues, fer-hi un *slicer* independent per a "Selecció A" i un altre per a "Selecció B", i utilitzar dues mesures DAX que, mitjançant `TREATAS`, apliquin cadascuna la seva selecció com a filtre sobre la taula real de vendes. Com que les taules desconnectades no tenen relació amb la taula de fets, els dos filtres conviuen sense interferir-se, i el mateix gràfic pot dibuixar dues línies independents a partir d'un únic model, sense duplicar la taula de vendes.

## Implementació pràctica

A continuació es construeix el cas descrit: una taula de vendes per botiga i data, i dues mesures que permeten seleccionar dues botigues diferents (o dos grups de botigues) i comparar-les en un mateix gràfic de línies.

**Pas 1 — Crear una taula desconnectada amb les botigues**, per exemple amb una consulta DAX (*Nova taula*):

```dax
Selector Botiga = DISTINCT('Vendes'[Botiga])
```

Aquesta taula es duplica un cop més amb un altre nom (`Selector Botiga B`), de manera que hi hagi dues taules desconnectades independents, cadascuna amb el seu propi *slicer* al informe. Com que són taules petites (només els noms de botiga, no les vendes), duplicar-les no té cap cost real de rendiment.

**Pas 2 — Crear les mesures que apliquen la selecció amb `TREATAS`:**

```dax
Vendes Seleccio A =
CALCULATE(
    SUM('Vendes'[Import]),
    TREATAS(VALUES('Selector Botiga'[Botiga]), 'Vendes'[Botiga])
)

Vendes Seleccio B =
CALCULATE(
    SUM('Vendes'[Import]),
    TREATAS(VALUES('Selector Botiga B'[Botiga]), 'Vendes'[Botiga])
)
```

`VALUES('Selector Botiga'[Botiga])` retorna els valors actualment seleccionats en el primer *slicer*, i `TREATAS` els aplica com a filtre sobre `'Vendes'[Botiga]`, encara que aquesta columna pertanyi a una taula sense relació amb `Selector Botiga`.

**Pas 3 — Muntar el gràfic:** amb un eix de dates i les dues mesures (`Vendes Seleccio A` i `Vendes Seleccio B`) com a valors, el gràfic de línies dibuixa dues sèries independents. Canviant la selecció de cada *slicer*, cada línia respon únicament a la seva pròpia selecció, sense afectar l'altra.

El mateix patró funciona igual de bé si, en lloc d'una sola botiga, cada *slicer* permet seleccionar diverses botigues a la vegada (un grup): `TREATAS` aplica tots els valors seleccionats com a filtre conjunt, exactament com faria un `IN` sobre la llista completa.

## Altres usos habituals de TREATAS

Més enllà de la comparació de dues seleccions, `TREATAS` és útil en diversos escenaris on cal traslladar un filtre entre taules sense relació directa:

- **Taules "bridge" sense relacions físiques**: connectar dues taules de fets (per exemple, Vendes i Objectius) a través d'una dimensió compartida (Producte, Botiga) sense necessitat de crear-hi una relació explícita al model, especialment útil quan ja hi ha massa relacions actives o es vol evitar ambigüitats de filtratge.
- **Anàlisi ABC o de benchmarking**: filtrar una taula de referència (per exemple, la mitjana del sector) amb la mateixa selecció de producte o categoria que s'aplica a la taula principal, per calcular una comparativa "propi vs. referència" sense duplicar dades.
- **Selecció dinàmica d'un període de referència**: quan cal comparar les vendes actuals amb les d'un període "de control" triat manualment per l'usuari (no necessàriament l'any anterior), amb una taula desconnectada de dates de referència i `TREATAS` per aplicar-la sobre la taula de fets.
- **Filtratge encreuat entre taules de granularitats diferents**: quan una taula té una clau composta o un format diferent del de la taula relacionada, i no és pràctic crear-hi una relació directa al model.
- **Càlcul de quota o pes sobre una selecció alternativa**: obtenir, per exemple, "quin percentatge representen les botigues seleccionades a l'Slicer B sobre el total de vendes", combinant `TREATAS` amb `CALCULATE` i `ALL`.

## TREATAS enfront d'altres alternatives

| Alternativa | Quan té sentit | Limitació principal |
|---|---|---|
| Duplicar la taula de fets | Taules petites, poques dimensions a duplicar | Escala malament amb taules grans; duplica manteniment |
| Relació bidireccional | Quan sí que té sentit una relació física permanent | No permet dues seleccions simultànies del mateix camp |
| Taula desconnectada + `SWITCH`/`SELECTEDVALUE` | Selecció única d'una opció (no una llista de valors) | Poc pràctic amb seleccions múltiples |
| `TREATAS` | Cal aplicar una o més seleccions com a filtre sobre una altra taula, sense relació física | Requereix que els valors de les columnes coincideixin (mateix tipus i format) |

## Conclusió

`TREATAS` permet simular una relació de filtratge allà on no n'hi ha, cosa que el converteix en l'eina natural per resoldre el cas de comparar dues seleccions d'un mateix camp: n'hi ha prou amb taules desconnectades petites i un parell de mesures, sense tocar el model de dades ni duplicar la taula de fets. El mateix mecanisme s'aplica a qualsevol situació on calgui traslladar un filtre d'una taula a una altra sense crear-hi una relació física.
