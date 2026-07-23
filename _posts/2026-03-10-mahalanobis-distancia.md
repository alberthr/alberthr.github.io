---
layout: post
title: "Detecció d'Outliers Multivariants amb la Distància de Mahalanobis"
tags:
  - estadistica
excerpt: "Quan cada variable per separat sembla normal però la seva combinació és impossible, els outliers univariants no serveixen. Descobreix com la Distància de Mahalanobis detecta anomalies multivariants tenint en compte escales i correlacions."
---

En la cerca de valors atípics (*outliers*) en un conjunt de dades, el primer impuls sol ser analitzar cada columna per separat (anàlisi univariant): per exemple, detectar si algú té una edat inusualment alta o uns ingressos desorbitats.

El problema apareix quan el valor de cada variable per separat sembla completament normal, però **la seva combinació és impossible o molt estranya**. Aquí és on entren els *outliers* multivariants, i la millor eina per detectar-los és la **Distància de Mahalanobis**.

## El problema de la distància tradicional (Euclidiana)

Amb variables en diferents escales (per exemple, el pes en tones, el preu en milers d'euros i la potència en cavalls), no es pot mesurar la distància en línia recta de forma tradicional. Una distància de "10" en la columna de preus no significa el mateix que un "10" en la columna de pes.

A més, les variables solen estar correlacionades. Si una persona fa 2 metres d'alçada, és normal que pesi més que la mitjana. Un pes de 100 kg per a algú de 2 metres és normal; el mateix pes per a algú d'1,50 metres és un *outlier*. La distància euclidiana ignora aquesta relació.

## Què fa la Distància de Mahalanobis?

La distància de Mahalanobis resol aquests dos problemes d'un sol cop:
1. **Normalitza les escales:** transforma totes les variables perquè les diferències de magnitud no distorsionin el càlcul.
2. **Té en compte la covariància (correlació):** avalua la distància d'un punt respecte al "centre de gravetat" de les dades (el vector de mitjanes), però tenint en compte la direcció en què es distribueixen els punts.

Estadísticament, la distància de Mahalanobis al quadrat segueix una distribució **Chi-quadrat ($$\chi^2$$)**. Això permet establir un llindar matemàtic objectiu (per exemple, amb un nivell de significació del 5%) per dir: *"Qualsevol punt que superi aquesta distància té menys d'un 5% de probabilitats de pertànyer a aquest grup; per tant, és un outlier"*.


## Implementació pràctica

Els exemples següents utilitzen el dataset clàssic `mtcars`, amb 4 columnes d'escales totalment diferents: consum (`mpg`), cavalls de potència (`hp`), pes en tones (`wt`) i cilindrada (`disp`).

### Implementació en R

A R, el càlcul està integrat de forma nativa gràcies a la funció `mahalanobis()`.

```r
# 1. Seleccionem les dades amb diferents escales
dades <- mtcars[, c("mpg", "hp", "wt", "disp")]

# 2. Calculem el centre (mitjanes) i la matriu de covariància
centre       <- colMeans(dades)
covariancia  <- cov(dades)

# 3. Calcular la distància de Mahalanobis per a cada cotxe (fila)
dades$dist_mahalanobis <- mahalanobis(dades, center = centre, cov = covariancia)

# 4. Determinar el llindar crític amb la distribució Chi-quadrat
# Els graus de llibertat (df) són el nombre de columnes analitzades (4)
graus_llibertat <- 4 
alfa <- 0.05 
llindar_critic <- qchisq(p = 1 - alfa, df = graus_llibertat)

# 5. Etiquetar els outliers
dades$es_outlier <- dades$dist_mahalanobis > llindar_critic

# 6. Mostrar els 5 resultats més extrems
dades_ordenades <- dades[order(-dades$dist_mahalanobis), ]
print("Top Outliers detectats a R:")
print(head(dades_ordenades, 5))
```

### Implementació en Python

A Python es pot replicar exactament el mateix comportament utilitzant `pandas` per gestionar les dades i `scipy` per a la distribució estadística i el càlcul de la matriu inversa de covariància.

```python
import pandas as pd
import numpy as np
from scipy.stats import chi2
import statsmodels.api as sm # Només per importar el dataset mtcars

# 1. Carreguem el mateix dataset des de statsmodels
mtcars_df = sm.datasets.get_rdataset("mtcars", "datasets").data
dades = mtcars_df[["mpg", "hp", "wt", "disp"]].copy()

# 2. Càlculs necessaris (mitjanes i matriu de covariància)
centre = dades.mean()
covariancia = dades.cov()
cov_inversa = np.linalg.inv(covariancia) # Necessària per a la fórmula a Python

# 3. Funció per calcular Mahalanobis per a una fila
def calcular_mahalanobis(fila, centre, cov_inv):
    diferencia = fila - centre
    # Fórmula matemàtica: D^2 = (x - mu)^T * Sigma^-1 * (x - mu)
    return np.dot(np.dot(diferencia, cov_inv), diferencia)

# Apliquem la funció a cada fila del DataFrame
dades['dist_mahalanobis'] = dades.apply(calcular_mahalanobis, axis=1, args=(centre, cov_inversa))

# 4. Determinar el llindar crític amb Chi-quadrat
graus_llibertat = 4
alfa = 0.05
llindar_critic = chi2.ppf(1 - alfa, df=graus_llibertat)

# 5. Etiquetar els outliers
dades['es_outlier'] = dades['dist_mahalanobis'] > llindar_critic

# 6. Mostrar els 5 resultats més extrems
dades_ordenades = dades.sort_values(by='dist_mahalanobis', ascending=False)
print("Top Outliers detectats a Python:")
print(dades_ordenades.head(5))
```

## Conclusió

La distància de Mahalanobis és una eina elegant i robusta. Permet netejar conjunts de dades complexos abans d'entrenar models de Machine Learning, garantint que cap observació "anòmala en combinació" esbiaixi els resultats, fins i tot si els seus valors individuals semblen completament innocents.
