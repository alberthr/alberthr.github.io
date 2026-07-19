---
layout: post
title: "Algoritme Hongarès: Optimització d'Assignacions"
tags:
  - optimitzacio
  - python
  - r
excerpt: "Com trobar, entre 20 botigues de control, les 5 més similars a un grup de botigues amb tractament per a un test A/B sense biaixos? L'Algoritme Hongarès resol aquest problema d'assignació òptima minimitzant la diferència total."
---

A l'hora d'executar un test A/B amb una mostra petita, és molt probable que no es pugui assegurar que les mostres Test i Control siguin comparables. Un cas habitual en analítica de negoci: una cadena de retail aplica una nova estratègia de màrqueting en **5 botigues seleccionades** (el "Grup de Tractament"). Per mesurar l'impacte real de la campanya sense biaixos, cal comparar-les amb botigues on no s'hagi implementat la campanya. La base de dades disposa de **20 botigues de control**.

L'objectiu és trobar, dins d'aquestes 20 opcions, les **5 botigues de control més similars possibles** a les 5 botigues tractades (en facturació, mida del local, nombre de clients, etc.). El repte és fer aquest emparellament de manera que la diferència total de tot el conjunt sigui la mínima possible. L'eina matemàtica adequada per a això és l'**Algoritme Hongarès**.

## Què és l'Algoritme Hongarès?

L'algoritme hongarès (mètode de Kuhn-Munkres) és un algoritme d'optimització combinatòria dissenyat per resoldre el **problema de l'assignació**.

Provar combinacions a l'atzar per trobar quina agrupació de 5 botigues és la millor de totes no és viable: el nombre de camins possibles creix de forma exponencial. L'algoritme hongarès resol aquest problema reduint una **matriu de costos** (on cada cel·la representa la "distància" o diferència en característiques entre la botiga A i la botiga B).

## Com funciona

L'algoritme parteix d'una matriu quadrada de costos on, en aquest exemple, les files representen les botigues amb tractament i les columnes la resta de botigues control disponibles. L'objectiu és trobar una combinació d'elements on només es triï un element per fila i un per columna, minimitzant la suma total de distàncies (o costos).

L'algoritme transforma la matriu de costos original en una matriu de "costos d'oportunitat" mitjançant operacions aritmètiques senzilles a les files i columnes, buscant zeros que indiquin una assignació òptima. Els passos bàsics són:

1. **Resta de files:** trobar el valor mínim de cada fila i restar-lo a tots els elements d'aquella fila.
2. **Resta de columnes:** trobar el valor mínim de cada columna de la nova matriu i restar-lo a tots els elements de la columna.
3. **Cobertura de zeros:** traçar el menor nombre possible de línies verticals i horitzontals per cobrir tots els valors zero de la matriu.
4. **Optimització:** si el nombre de línies és igual a $n$ (la dimensió de la matriu), l'assignació òptima ja queda determinada pels zeros coberts. Si és menor, s'ajusta la matriu (restant el valor mínim no cobert als valors lliures i sumant-lo a les interseccions de les línies) i es torna al pas 3.

## Altres utilitats

Tot i que l'emparellament d'individus o botigues similars és molt útil en analítica de negoci, l'algoritme hongarès és un pilar fonamental en logística, gestió de projectes i ciència de dades aplicada a negocis:

* **Assignació de personal:** acoblar operaris a màquines industrials o consultors a projectes basant-se en les seves tarifes horàries o habilitats.
* **Logística de flotes:** decidir quin vehicle repartidor s'ha d'enviar a cada punt de recollida per minimitzar el combustible o el temps de ruta total.
* **Economia de plataformes (matching):** algoritmes de repartiment de menjar a domicili o aplicacions de transport per assignar conductors als clients més propers eficientment.


## Implementació pràctica

A continuació es simula el cas plantejat: el **Grup A** (5 botigues tractades) i el **Grup B** (20 botigues candidates a control). Cada botiga es defineix per 3 variables (Facturació, Superfície, Clients).

### Exemple en R

A R es pot evitar el paquet clàssic `clue`, que obligaria a construir la matriu quadrada de forma artificial (afegint files buides). Amb `RcppHungarian` (escrit en C++), el càlcul amb matrius rectangulars és directe i automàtic.

```R
# Instal·lar si no es té: install.packages("RcppHungarian")
library(RcppHungarian)

# 1. Creem dades sintètiques (3 característiques per botiga)
set.seed(42)
botigues_A <- matrix(rnorm(15, mean = 10, sd = 2), ncol = 3)  # 5 botigues tractades
botigues_B <- matrix(rnorm(60, mean = 10.5, sd = 2), ncol = 3) # 20 botigues control

# 2. Construïm la matriu de costos rectangular (5 files x 20 columnes)
# Calculem la distància Euclídea entre cada combinació possible
matriu_costos <- as.matrix(dist(rbind(botigues_A, botigues_B)))[1:5, 6:25]

cat("Dimensió de la matriu de costos:", dim(matriu_costos)[1], "files x", dim(matriu_costos)[2], "columnes.\n\n")

# 3. Executem l'algoritme (busca MINIMITZAR la distància total)
solucio <- HungarianSolver(matriu_costos)

# 4. Mostrar les parelles d'èxit
# Nota: Sumem 1 als índexs perquè el motor de C++ comença a comptar des de 0
parelles <- solucio$pairs

print("Parelles òptimes trobades (Botiga Tractada -> Botiga Control):")
for(i in 1:nrow(parelles)) {
  if(parelles[i, 2] != 0) { 
    cat(paste("La Botiga A_", parelles[i, 1], " s'aparella amb la Botiga Control B_", parelles[i, 2], "\n", sep=""))
  }
}
```

### Exemple en Python

A Python, la funció nativa `linear_sum_assignment` de la llibreria `scipy` gestiona les matrius rectangulars a la perfecció de manera interna.

```python
import numpy as np
from scipy.spatial.distance import cdist
from scipy.optimize import linear_sum_assignment

# 1. Creem les mateixes dades sintètiques (3 característiques per botiga)
np.random.seed(42)
botigues_A = np.random.normal(loc=10, scale=2, size=(5, 3))    # 5 files (Tractades)
botigues_B = np.random.normal(loc=10.5, scale=2, size=(20, 3)) # 20 files (Controls)

# 2. Calcular la matriu de costos rectangular (5x20)
matriu_costos = cdist(botigues_A, botigues_B, metric='euclidean')

print(f"Dimensió de la matriu de costos a Python: {matriu_costos.shape[0]} files x {matriu_costos.shape[1]} columnes.\n")

# 3. Apliquem l'Algoritme Hongarès
# El mètode retornarà exactament 5 assignacions òptimes
files_A, columnes_B = linear_sum_assignment(matriu_costos)

# 4. Mostrar el resultat de l'emparellament
print("Parelles òptimes trobades (Python):")
for a, b in zip(files_A, columnes_B):
    print(f"La Botiga A_{a+1} s'aparella amb la Botiga Control B_{b+1} (Diferència: {matriu_costos[a, b]:.2f})")
```
