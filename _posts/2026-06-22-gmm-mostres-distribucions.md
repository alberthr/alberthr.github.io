---
layout: post
title: "Introducció als Gaussian Mixture Models (GMM): Més enllà del K-Means"
tags: 
  - machine learning
  - clustering
---

Quan parlem de *clustering* o agrupament en Machine Learning, el primer algorisme que ens ve al cap és el K-Means. És senzill, ràpid i eficaç. Però, què passa quan les nostres dades no formen cercles perfectes? Què passa si un punt podria pertànyer a més d'un grup a la vegada? Aquí és on entren en joc els **Gaussian Mixture Models (GMM)** o Models de Mescla Gaussiana.

## Què és un Gaussian Mixture Model (GMM)?

A diferència del K-Means, que assigna cada dada de forma estricte a un sol grup (*hard clustering*), el GMM és un model probabilístic. Assumeix que totes les dades han estat generades a partir d'una barreja d'un nombre fixat de **distribucions gaussianes** (normals) amb paràmetres desconeguts.

En lloc de dir "aquest punt pertany al Grup A", el GMM diu: *"Aquest punt té un 85% de probabilitats de ser del Grup A i un 15% del Grup B"* (*soft clustering*).

### El secret: L'algorisme EM

Per trobar els paràmetres d'aquestes gaussianes (la mitjana, la covariància i el pes de cada grup), el GMM utilitza l'algorisme **Expectation-Maximization (EM)**:
1. **E-step (Expectation):** Calcula la probabilitat que cada punt provingui de cada distribució gaussiana.
2. **M-step (Maximization):** Actualitza els paràmetres (mitjana, covariància i pes) de les gaussianes per maximitzar la versemblança de les dades.


## Quan es fa servir i quines utilitats té?

El GMM és especialment útil en situacions on la flexibilitat geomètrica és clau:

* **Agrupaments no esfèrics:** El K-Means assumeix que els clústers són esfèrics. Si els teus grups són el·líptics, allargats o tenen diferents mides, el K-Means fallarà. GMM s'adapta gràcies a la matriu de covariància.
* **Solapament de grups:** Quan les fronteres entre clústers no estan clares i necessites mesurar la incertesa de l'assignació.
* **Estimació de densitat:** De vegades no vols fer clústers, sinó simplement entendre la distribució de les teves dades per generar-ne de noves que s'hi assemblin.

### Exemples d'utilització reals

1. **Segmentació de clients:** Identificar perfils de compradors on un usuari pot tenir comportaments compartits de diferents segments (ex. 70% comprador compulsiu, 30% cercador d'ofertes).
2. **Processament d'imatges:** Segmentació del fons i primer pla en vídeos o imatges (computació visual).
3. **Detecció d'anomalies:** Si un nou punt de dada té una probabilitat extremadament baixa de pertànyer a qualsevol de les gaussianes del model, es pot catalogar com a anomalia o frau.


## Implementació en Python

A Python, la llibreria per excel·lència és `scikit-learn`. Podem utilitzar la classe `GaussianMixture`.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.mixture import GaussianMixture
from sklearn.datasets import make_blobs

# 1. Generar dades d'exemple de forma el·líptica
X, _ = make_blobs(n_samples=300, centers=3, cluster_std=1.0, random_state=42)
transformation = [[0.6, -0.6], [-0.4, 0.8]]
X_aniso = np.dot(X, transformation)  # Estirem les dades

# 2. Entrenar el model GMM
# Triem 3 components (clústers)
gmm = GaussianMixture(n_components=3, covariance_type='full', random_state=42)
gmm.fit(X_aniso)

# 3. Predicció de clústers i probabilitats
labels = gmm.predict(X_aniso)
probs = gmm.predict_proba(X_aniso) # Probabilitats de pertinença

# 4. Mostrar resultats
plt.scatter(X_aniso[:, 0], X_aniso[:, 1], c=labels, cmap='viridis', s=40, zorder=2)
plt.title("GMM Clustering en Python")
plt.xlabel("Característica 1")
plt.ylabel("Característica 2")
plt.show()

# Exemple de probabilitats del primer punt
print(f"Probabilitats del primer punt (Grup 0, 1, 2): {probs[0]}")
```

### Implementació en R

A R, una de les millors opcions és el paquet mclust, que a més té l'avantatge de poder seleccionar automàticament el nombre òptim de clústers utilitzant el criteri BIC.

```r
# 1. Instal·lar i carregar el paquet
if(!require(mclust)) install.packages("mclust")
library(mclust)

# 2. Utilitzarem el dataset intern 'iris' (sense la columna de l'espècie)
dades <- iris[, 1:4]

# 3. Entrenar el model GMM
# Mclust busca automàticament el millor nombre de clústers i forma de covariància
model_gmm <- Mclust(dades)

# 4. Resum del model
summary(model_gmm)

# 5. Visualitzar els resultats
# Mostra la classificació i l'estimació de densitat
plot(model_gmm, what = "classification")

# Accedir a les probabilitats de pertinença (soft clustering)
probabilitats <- model_gmm$z
head(probabilitats)
```

## Conclusió
Els Gaussian Mixture Models són una eina extremadament potent que supera les limitacions geomètriques del K-Means clàssic. Tot i que requereixen més potència de càlcul i són més sensibles a tenir poques dades, el fet d'aportar una mètrica probabilística (predict_proba) els fa indispensables en l'arsenal de qualsevol científic de dades.

T'has trobat mai amb dades que el K-Means no podia gestionar correctament? Deixa la teva experiència als comentaris!
