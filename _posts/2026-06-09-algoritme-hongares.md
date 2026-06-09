---
layout: post
title: "L'Algoritme Hongarès: Optimització d'assignació de recursos"
tags:
  - algoritmes
  - python
  - r
  - optimitzacio
---

En el dia a dia de l'anàlisi de dades i la investigació operativa, sovint ens trobem amb problemes on hem de repartir tasques eficientment. Si tenim un grup de treballadors i un conjunt de projectes, on cada treballador té un cost (o temps) diferent per a cada projecte, com podem assignar una tasca a cada persona minimitzant el cost total? La resposta elegant a aquest problema de combinatòria és l'**Algoritme Hongarès**.



## Què és l'Algoritme Hongarès?

Desenvolupat originalment pel matemàtic Harold Kuhn l'any 1955 (qui el va anomenar així en honor als treballs previs dels matemàtics hongaresos Dénes Kőnig i Jenő Egerváry), és un mètode d'optimització combinatòria que resol el **problema de l'assignació** en un temps polinòmic $O(n^3)$. 

Abans de la seva aparició, resoldre aquest problema per força bruta requeria calcular totes les permutacions possibles ($n!$), una bogeria inexecutable a mesura que la matriu de dades creixia.

L'algoritme parteix d'una matriu quadrada de costos on les files representen els agents (recursos) i les columnes les tasques. L'objectiu és trobar una combinació d'elements on només es triï un element per fila i un per columna, minimitzant la suma total.

## Com funciona? (Els passos clau)

L'algoritme transforma la matriu de costos original en una matriu de "costos d'oportunitat" mitjançant operacions aritmètiques senzilles a les files i columnes, buscant zeros que indiquin una assignació òptima. Els passos bàsics són:

1. **Resta de files:** Trobar el valor mínim de cada fila i restar-lo a tots els elements d'aquella fila.
2. **Resta de columnes:** Trobar el valor mínim de cada columna de la nova matriu i restar-lo a tots els elements de la columna.
3. **Cobertura de zeros:** Traçar el menor nombre possible de línies verticals i horitzontals per cobrir tots les valors zero de la matriu.
4. **Optimització:** Si el nombre de línies és igual a $n$ (la dimensió de la matriu), ja tenim l'assignació òptima als zeros coberts. Si és menor, s'ajusta la matriu (restant el valor mínim no cobert als valors lliures i sumant-lo a les interseccions de les línies) i es torna al pas 3.

## Utilitats i casos d'ús reals

Aquest algoritme és un pilar fonamental en logística, gestió de projectes i ciència de dades aplicada a negocis:

* **Assignació de personal:** Acoblar operaris a màquines industrials o consultors a projectes basant-se en les seves tarifes horàries o habilitats.
* **Logística de flotes:** Decidir quin vehicle repartidor s'ha d'enviar a cada punt de recollida per minimitzar el combustible o el temps de ruta total.
* **Economia de plataformes (Matching):** Algoritmes de repartiment de menjar a domicili o aplicacions de transport viatger per assignar conductors als clients més propers eficientment.

---

## Implementació Pràctica

Avui en dia no cal fer aquestes restes a mà. Tant Python com R tenen llibreries optimitzades que resolen el problema en mil·lisegons. Suposem que tenim 3 treballadors i 3 tasques amb la següent matriu de costos:

$$
\begin{pmatrix}
9 & 2 & 78 \\
6 & 4 & 37 \\
5 & 8 & 26
\end{pmatrix}
$$

### Exemple en Python

A Python, utilitzem la funció `linear_sum_assignment` de la llibreria científica `scipy`.

```python
import numpy as np
from scipy.optimize import linear_sum_assignment

# Definim la matriu de costos
cost_matrix = np.array([
    [9, 2, 78],
    [6, 4, 37],
    [5, 8, 26]
])

# Apliquem l'algoritme hongarès
row_ind, col_ind = linear_sum_assignment(cost_matrix)

# Mostrem els resultats
print("Assignacions òptimes:")
for worker, task in zip(row_ind, col_ind):
    print(f"Treballador {worker} -> Tasca {task} (Cost: {cost_matrix[worker, task]})")

print(f"Cost total mínim: {cost_matrix[row_ind, col_ind].sum()}")
```

###Exemple en R
A R, podem utilitzar el paquet clue que conté la funció solve_LSAP (Linear Sum Assignment Problem).


```R
# Cal instal·lar el paquet si no el tens: install.packages("clue")
library(clue)

# Definim la matriu de costos
cost_matrix <- matrix(c(9, 6, 5, 
                        2, 4, 8, 
                        78, 37, 26), 
                      nrow = 3, ncol = 3)

# Apliquem l'algoritme hongarès
resultat <- solve_LSAP(cost_matrix)

# Mostrem els resultats
print("Tasques assignades als treballadors 1, 2 i 3 respectivament:")
print(as.vector(resultat))

# Calculem el cost total
cost_total <- sum(cost_matrix[cbind(seq_along(resultat), resultat)])
cat("Cost total mínim:", cost_total, "\n")
```
