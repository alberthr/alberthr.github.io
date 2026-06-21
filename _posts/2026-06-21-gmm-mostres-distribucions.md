---
layout: post
title: "Mostres bimodals: Troba la frontera amb GMM"
tags: 
  - machine learning
  - clustering
---

Imagina que estàs analitzant el temps d'espera dels  clients en un restaurant o l'alçada d'una població barrejada. Quan pintes l'histograma, descobreixes que no tens la típica campana de Gauss simètrica, sinó una **distribució bimodal** (amb dos pics). De vegades els dos pics són evidents, però d'altres, les distribucions estan tan encavalcades que visualment sembla una sola massa de dades deformada.

El repte és clar: **A quin grup correspon cada observació? A partir de quin punt exacte una dada deixa de pertànyer al primer grup i passa al segon?**

En aquest article veurem com els **Gaussian Mixture Models (GMM)** responen a aquesta pregunta utilitzant la probabilitat, superant les limitacions de mètodes clàssics com el K-Means.


## El problema de la frontera en dades bimodals

Quan barregem dues fonts de dades diferents (per exemple, les vendes d'un dia laborable vs. cap de setmana), estem davant d'una mescla numèrica. Si apliquem un llindar rígid i arbitrari (com dir "tot el que sigui menor que 50 és el Grup A"), estarem cometent errors en la zona on les dues distribucions es solapen.

En aquesta zona de transició, una dada té característiques de tots dos grups. En lloc de dibuixar una línia divisòria cega, necessitem saber la **certesa** o probabilitat de la nostra assignació. 

### Per què el K-Means no és la millor opció aquí?
El K-Means és un algorisme de *hard clustering*. Això significa que mesura la distància geomètrica i assigna la dada de forma estricta a un clúster o a l'altre (estàs a dins o estàs a fora). 
* Si la frontera està difusa, K-Means tallarà pel mig sense dir-te com de segur està d'aquesta decisió.
* A més, assumeix que ambdós grups tenen la mateixa dispersió (variància), cosa que en la realitat bimodal poques vegades passa (un grup pot ser molt estret i alt, i l'altre baix i ample).


## La solució: Què fa el GMM?

El Gaussian Mixture Model (GMM) tracta el problema des de l'estadística. Assumeix que la teva mostra està formada per dues distribucions gaussianes que s'han sumat. El seu objectiu és "desmuntar" la barreja per trobar:
1. La mitjana i la variància de cada un dels dos grups.
2. El pes (proporció) de cada grup en el total de la mostra.

Un cop entrenat, el GMM no et dona una resposta binària. Et calcula el *soft clustering*: per a cada observació, et diu quina probabilitat té de formar part de la distribució 1 i de la distribució 2. 

**Com trobem el punt d'inflexió?** La dada on la probabilitat passa de ser $P(\text{Grup 1}) > 0.5$ a ser $P(\text{Grup 2}) > 0.5$ és, exactament, la frontera matemàtica on les dades canvien de grup.


## Implementació en Python: Trobant el punt de tall

Anem a simular una distribució bimodal encavalcada i a utilitzar `scikit-learn` per trobar a quin grup pertany cada dada i determinar on es creuen les probabilitats.

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.mixture import GaussianMixture

# 1. Simulem una mostra bimodal (dues poblacions solapades)
np.random.seed(42)
grup_1 = np.random.normal(loc=20, scale=3, size=400)  # Mitjana 20
grup_2 = np.random.normal(loc=28, scale=5, size=600)  # Mitjana 28 (més dispers)
dades = np.concatenate([grup_1, grup_2]).reshape(-1, 1)

# 2. Ajustem el GMM amb 2 components
gmm = GaussianMixture(n_components=2, random_state=42)
gmm.fit(dades)

# 3. Ordenem les dades per veure clarament la transició
dades_ordenades = np.sort(dades, axis=0)
probabilitats = gmm.predict_proba(dades_ordenades)
assignacio = gmm.predict(dades_ordenades)

# 4. Busquem el punt exacte on es creuen les probabilitats (frontera)
# És el punt on la probabilitat del grup 0 baixa del 50% i puja la del grup 1
punt_tall = dades_ordenades[np.argmin(np.abs(probabilitats[:, 0] - 0.5))]
print(f"Les dades canvien de grup a partir del valor aproximat de: {punt_tall[0]:.2f}")

# 5. Visualització de la transició probabilística
plt.figure(figsize=(10, 5))
plt.plot(dades_ordenades, probabilitats[:, 0], label="Probabilitat Grup 1", color="blue")
plt.plot(dades_ordenades, probabilitats[:, 1], label="Probabilitat Grup 2", color="orange")
plt.axvline(punt_tall, color="red", linestyle="--", label=f"Frontera ({punt_tall[0]:.2f})")
plt.title("Transició de probabilitat i punt d'inflexió amb GMM")
plt.xlabel("Valor de l'observació")
plt.ylabel("Probabilitat")
plt.legend()
plt.show()
```

### Implementació en R

A R, una de les millors opcions és el paquet mclust, que a més té l'avantatge de poder seleccionar automàticament el nombre òptim de clústers utilitzant el criteri BIC.

```r
# 1. Instal·lar i carregar el paquet
if(!require(mclust)) install.packages("mclust")
library(mclust)

# 2. Crear una mostra bimodal simulada
set.seed(42)
grup_1 <- rnorm(400, mean = 20, sd = 3)
grup_2 <- rnorm(600, mean = 28, sd = 5)
dades <- data.frame(valor = c(grup_1, grup_2))

# 3. Entrenar el model forçant 2 components (G=2)
model_bimodal <- Mclust(dades$valor, G = 2)

# 4. Veure a quin grup s'ha assignat cada observació final
dades$grup_assignat <- model_bimodal$classification

# 5. Extreure les probabilitats de pertinença (soft clustering)
# 'z' conté una columna per a cada component (grup)
dades$prob_grup1 <- model_bimodal$z[, 1]
dades$prob_grup2 <- model_bimodal$z[, 2]

# Mostrem les primeres línies del resultat
head(dades)

# 6. Trobar quines observacions estan a la zona d'incertesa (frontera)
# Per exemple, observacions on la probabilitat està molt renyida (entre 45% i 55%)
zona_frontera <- dades[dades$prob_grup1 > 0.45 & dades$prob_grup1 < 0.55, ]
cat("Valors en la zona de transició directa:\n")
print(range(zona_frontera$valor))

# 7. Pintar la densitat dels dos grups trobats
plot(model_bimodal, what = "density")
```

## Conclusió
Quan treballes amb dades reals, les fronteres netes no existeixen. En una distribució bimodal, el valor que separa els dos fenòmens no és un mur, sinó una zona de transició.

Utilitzar GMM en lloc de K-Means o llindars fixos et permet tractar aquesta transició amb rigor científic: saps exactament on es troba el punt d'inflexió matemàtic (el canvi de tendència al 50%) i, alhora, mantens el control sobre la incertesa de les teves dades en les zones de solapament.
