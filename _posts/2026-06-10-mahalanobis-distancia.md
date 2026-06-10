---
layout: post
title: "Què és la Distància de Mahalanobis i per a què serveix?"
description: "Descobreix com mesurar la distància entre dades tenint en compte la seva correlació i dispersió, amb exemples pràctics en Python i R."
tags:
  - outliers
  - mesures
  - distancia
---

Quan treballem amb dades multidimensionals, la primera tendència que tenim per mesurar com de "lluny" estan dos punts és utilitzar la distància euclidiana (la línia recta de tota la vida). Però, què passa si les nostres variables tenen escales diferents o estan altament correlacionades? Aquí és on la distància euclidiana falla i on la **Distància de Mahalanobis** es converteix en la nostra millor aliada.

## El problema de la Distància Euclidiana

Imagina que estàs analitzant dades de salut on mesures el pes (en kg) i l'alçada (en cm) de pacients. Un canvi de 5 unitats en el pes és una variació enorme, mentre que 5 unitats en l'alçada és relativament poc. Si calcules la distància en línia recta pura, la variable amb l'escala més gran dominarà el càlcul.

A més, el pes i l'alçada estan **correlacionats**: la gent més alta acostuma a pesar més. La distància euclidiana ignora aquesta relació, tractant les variables com si fossin totalment independents.

## Què fa diferent la Distància de Mahalanobis?

La distància de Mahalanobis calcula la distància d'un punt respecte a la mitjana d'una distribució de dades tenint en compte dos factors clau:
1. **La dispersió (variància):** Normalitza lesescales de cada variable.
2. **La correlació (covariància):** Entén com es mouen les variables de forma conjunta.

En lloc de dibuixar cercles perfectes al voltant de la mitjana (com faria la distància euclidiana), Mahalanobis dibuixa **el·lipses** que s'ajusten a la forma real del núvol de dades.



### La Fórmula Matemàtica

La fórmula per calcular la distància de Mahalanobis ($D_M$) d'un vector $x$ respecte a una mitjana $\mu$ és:

<center>$D_M(x) = \sqrt{(x - \mu)^T \Sigma^{-1} (x - \mu)}$</center>

On:
* $x$ és el vector del punt que volem avaluar.
* $\mu$ és el vector de mitjanes de les nostres dades.
* $\Sigma^{-1}$ és la **matriu inversa de covariància** (la que s'encarrega d'eliminar l'efecte de la correlació).

## Utilitats i Usos Principals

* **Detecció d'Anomalies (Outliers):** És la seva utilitat estrella. Permet identificar punts que, mirats variable per variable semblen normals, però que combinats són altament improbables.
* **Classificació de Patrons:** S'utilitza en el classificador de la distància mínima de Mahalanobis, ideal per assignar un element a un grup basant-se en la seva similitud multidimensional.
* **Sèries Temporals i Finances:** Per detectar canvis bruscos en el comportament de mercats on múltiples actius es mouen de forma correlacionada.

---

## Implementació Pràctica

Anem a veure com podem calcular aquesta distància utilitzant un petit conjunt de dades multidimensional tant en **Python** com en **R**.

### En Python (amb SciPy)

```python
import numpy as np
from scipy.spatial import distance

# Definim el nostre núvol de dades (3 observacions, 2 variables)
dades = np.array([[1, 2], [3, 4], [5, 6]])

# Calculem la matriu de covariància i la seva inversa
cov_matriu = np.cov(dades, rowvar=False)
inv_cov_matriu = np.linalg.inv(cov_matriu)

# Calculem la mitjana de les columnes
mitjana = np.mean(dades, axis=0)


# Punt nou que volem avaluar
nou_punt = np.array([2, 3])

# Calculem la distància de Mahalanobis
mahalanobis_dist = distance.mahalanobis(nou_punt, mitjana, inv_cov_matriu)

print(f"Distància de Mahalanobis: {mahalanobis_dist}")
```

### En R
R inclou una funció nativa excel·lent anomenada mahalanobis() que ens estalvia haver de fer la inversa de la matriu manualment.

```R
# Creem la matriu de dades
dades <- matrix(c(1, 3, 5, 2, 4, 6), ncol = 2)

# Calculem la mitjana de cada columna
mitjana <- colMeans(dades)

# Calculem la matriu de covariància
cov_matriu <- cov(dades)

# Punt nou a avaluar
nou_punt <- c(2, 3)

# El mètode en R retorna el quadrat de la distància (D^2), per tant fem l'arrel
mahal_quadrat <- mahalanobis(nou_punt, mitjana, cov_matriu)
mahalanobis_dist <- sqrt(mahal_quadrat)

print(paste("Distància de Mahalanobis:", mahalanobis_dist))
```
