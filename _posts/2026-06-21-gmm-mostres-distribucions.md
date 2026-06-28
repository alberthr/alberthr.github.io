---
layout: post
title: "Mostres bimodals: Troba la frontera amb GMM"
tags: 
  - estadistica
  - clustering
  - r
  - python
excerpt: "Quan una variable sembla tenir més d'una 'campana' (bimodal, trimodal...), un Gaussian Mixture Model permet estimar quants grups hi ha, a quin pertany cada observació i on és exactament el punt de tall entre grups."
---



Imagina que tens una mostra d'una sola variable contínua: temps de resposta, despesa per client, alçada d'una població, una mètrica de vendes... Quan en fas l'histograma no veus una única campana de Gauss, sinó dues, tres, o una forma estranya que fa sospitar que en realitat hi ha **diversos grups barrejats dins la mateixa columna de dades**.

El problema típic és:

- Saps (o sospites) que hi ha 2 o més subpoblacions diferents barrejades.
- No tens una etiqueta que digui a quin grup pertany cada observació.
- Vols saber **a partir de quin valor una observació deixa de pertànyer al grup A i passa a pertànyer al grup B**.

Aquest és exactament el cas d'ús per a un **Gaussian Mixture Model (GMM)**.

## Què és un GMM

Un GMM assumeix que les dades observades no provenen d'una sola distribució normal, sinó d'una **barreja ponderada de K distribucions normals**, cadascuna amb la seva pròpia mitjana (μ), desviació (σ) i pes (π):

$$
p(x) = \sum_{k=1}^{K} \pi_k \cdot \mathcal{N}(x \mid \mu_k, \sigma_k^2)
$$

Un algoritme estima aquests paràmetres sense conèixer prèviament a quin grup pertany cada punt. El resultat no és una etiqueta dura, sinó una **probabilitat de pertinença a cada grup per a cada observació** (soft clustering). A partir d'aquesta probabilitat, sí que pots assignar una etiqueta dura si et convé.


## Per què serveix exactament

- **Detectar quants grups hi ha realment** dins una variable que sembla multimodal (criteris com BIC/AIC et diuen si 2, 3 o 4 components ajusten millor).
- **Assignar cada observació a un grup**, amb una probabilitat associada (no només un sí/no).
- **Trobar el punt de tall** (threshold) entre dos grups: el valor de x on la probabilitat de pertànyer al grup A s'iguala a la del grup B.
- **Modelar la incertesa** a la zona de solapament entre distribucions, en lloc de forçar una frontera rígida com fa K-means.
- **Generar dades sintètiques** amb la mateixa estructura de barreja un cop estimats els paràmetres.


## Exemples d'utilització

- **Segmentació de clients** per despesa: detectar si hi ha un grup de "compra petita" i un de "compra gran" barrejats en la mateixa distribució de ticket mitjà, i trobar el llindar que els separa.
- **Control de qualitat / processos industrials**: una mesura que hauria de ser unimodal però mostra dues campanes indica dos lots, dues màquines o dos torns amb comportament diferent.
- **Bioestadística**: alçades, pesos o biomarcadors que combinen subpoblacions (per exemple, sexe biològic no registrat però que genera bimodalitat).
- **Detecció d'anomalies**: el component amb pes (π) molt baix i mitjana allunyada pot identificar-se com a grup d'outliers.
- **Finances**: rendiments d'un actiu que alternen entre un règim de baixa volatilitat i un règim de alta volatilitat (dos components gaussians amb σ molt diferent).
- **A/B testing post-hoc**: quan sospites que dins del grup de "tractament" hi ha en realitat responedors i no-responedors barrejats.


## Com es troba el "punt de tall" entre dos grups

Un cop el model estima els dos components (μ₁, σ₁, π₁) i (μ₂, σ₂, π₂), el punt de tall és el valor de x on:

$$
\pi_1 \cdot \mathcal{N}(x \mid \mu_1, \sigma_1^2) = \pi_2 \cdot \mathcal{N}(x \mid \mu_2, \sigma_2^2)
$$

És a dir, on la probabilitat *a posteriori* de pertànyer a un grup o l'altre val exactament 0,5. A la pràctica, no cal resoldre l'equació a mà: es calcula la probabilitat posterior per a un vector fi de valors de x i es localitza on creua el 0,5. Als exemples de codi de sota ho fem així.

## Com trobar el nombre òptim de grups (K)

Fins ara hem assumit que ja sabíem que hi havia 2 grups. Però sovint la pregunta real és: **quants grups té realment la mostra?** Potser semblen 2 a l'histograma però en realitat n'hi ha 3 solapats, o el que sembla un sol grup amaga'n dos amb mitjanes molt properes.

La forma correcta de respondre-ho no és "mirar l'histograma i decidir a ull", sinó ajustar el GMM amb K = 1, 2, 3, 4... i comparar com de bé s'ajusta cada model, penalitzant els models amb més paràmetres (perquè un model amb més grups gairebé sempre ajustarà "millor" les dades, encara que sigui sobreajustament). Per a això es fan servir el **BIC** i l'**AIC**.

### Què són BIC i AIC

Tots dos són criteris d'informació que comparen models entre ells combinant dues coses oposades:

1. **Com de bé explica el model les dades** (la versemblança, *log-likelihood*): com més alta, millor s'ajusta el model.
2. **Com de complex és el model** (nombre de paràmetres: més grups = més mitjanes, variàncies i pesos a estimar): com més paràmetres, més fàcil és sobreajustar.

Les fórmules, en la seva forma habitual:

$$
AIC = -2 \log L + 2p
$$

$$
BIC = -2 \log L + p \cdot \ln(n)
$$

On *log L* és la log-versemblança del model, *p* és el nombre de paràmetres lliures, i *n* és el nombre d'observacions.

**En els dos casos, com més baix és el valor, millor és el model.** Es calcula el BIC (o l'AIC) per a cada valor de K i es tria el K amb el valor més baix —o el punt a partir del qual la millora es torna marginal (un "colze" similar al de K-means, però amb base estadística).

La diferència pràctica entre tots dos:

- **AIC** penalitza menys la complexitat i tendeix a triar models amb més components, perquè es preocupa més per la capacitat predictiva que per la parsimònia.
- **BIC** penalitza més com més gran és la mostra (el terme `ln(n)` creix amb n), i per tant tendeix a triar models més senzills (menys grups) amb mostres grans. És el criteri més habitual per decidir el nombre de components en un GMM, perquè en la pràctica dona resultats més estables i interpretables.
- Si BIC i AIC discrepen (BIC diu K=2, AIC diu K=3), val la pena mirar si el tercer grup té sentit substantiu (una mida de grup raonable, una mitjana clarament diferenciada) o si és soroll que l'AIC està sobreajustant.

A la pràctica: s'ajusta el model per a un rang de K (per exemple 1 a 6), es grafica BIC i AIC en funció de K, i es tria el mínim. Als exemples de codi de sota ja s'inclou aquest pas.

---

## Implementació en Python

```python
import numpy as np
import matplotlib.pyplot as plt
from sklearn.mixture import GaussianMixture

# 1. Simulem una mostra bimodal (dos grups barrejats)
np.random.seed(42)
grup_a = np.random.normal(loc=50, scale=8, size=300)
grup_b = np.random.normal(loc=80, scale=10, size=200)
dades = np.concatenate([grup_a, grup_b]).reshape(-1, 1)

# 2. Ajustem el GMM amb 2 components
gmm = GaussianMixture(n_components=2, random_state=42)
gmm.fit(dades)

# 3. Assignem cada observació al grup més probable
etiquetes = gmm.predict(dades)
probabilitats = gmm.predict_proba(dades)  # probabilitat de pertànyer a cada grup

print("Mitjanes estimades:", gmm.means_.ravel())
print("Desviacions estimades:", np.sqrt(gmm.covariances_.ravel()))  # σ = arrel de la variància
print("Pesos (π) estimats:", gmm.weights_)

# 4. Trobem el punt de tall entre els dos grups
x_grid = np.linspace(dades.min(), dades.max(), 2000).reshape(-1, 1)
probs_grid = gmm.predict_proba(x_grid)
# Busquem on la probabilitat del grup 0 creua 0.5
diff = probs_grid[:, 0] - 0.5
idx_tall = np.where(np.diff(np.sign(diff)))[0]
punt_de_tall = x_grid[idx_tall].ravel()
print("Punt(s) de tall estimat(s):", punt_de_tall)

# 5. Trobem el nombre òptim de components comparant BIC i AIC per a k=1..6
k_range = range(1, 7)
bics, aics = [], []
for k in k_range:
    model = GaussianMixture(n_components=k, random_state=42).fit(dades)
    bics.append(model.bic(dades))
    aics.append(model.aic(dades))

k_optim_bic = list(k_range)[np.argmin(bics)]
k_optim_aic = list(k_range)[np.argmin(aics)]
print("BIC per a k=1..6:", bics, "-> mínim a k =", k_optim_bic)
print("AIC per a k=1..6:", aics, "-> mínim a k =", k_optim_aic)

plt.figure()
plt.plot(k_range, bics, marker="o", label="BIC")
plt.plot(k_range, aics, marker="o", label="AIC")
plt.xlabel("Nombre de components (K)")
plt.ylabel("Valor del criteri (com més baix, millor)")
plt.legend()
plt.title("Selecció del nombre òptim de grups")
plt.show()

# 6. Visualització de la barreja final i el punt de tall
plt.hist(dades, bins=40, density=True, alpha=0.4, color="gray")
x = np.linspace(dades.min(), dades.max(), 1000).reshape(-1, 1)
densitat = np.exp(gmm.score_samples(x))
plt.plot(x, densitat, color="teal", linewidth=2)
for p in punt_de_tall:
    plt.axvline(p, color="red", linestyle="--", label=f"Tall ≈ {p:.1f}")
plt.legend()
plt.title("GMM: barreja de 2 distribucions i punt de tall")
plt.show()
```

Punts clau d'aquest codi:

- `predict()` dona l'etiqueta dura (a quin grup s'assigna cada punt).
- `predict_proba()` dona la probabilitat de pertànyer a cada component — útil per identificar observacions "ambigües" a la zona de solapament.
- `model.bic(dades)` i `model.aic(dades)` calculen directament els dos criteris; no cal programar les fórmules a mà. Es repeteix per a diversos K i es tria el mínim, en lloc de decidir el nombre de grups a ull a partir de l'histograma.

## Implementació en R

```r
library(mclust)

set.seed(42)

# 1. Simulem la mateixa mostra bimodal
grup_a <- rnorm(300, mean = 50, sd = 8)
grup_b <- rnorm(200, mean = 80, sd = 10)
dades <- c(grup_a, grup_b)

# 2. Ajustem el model per a un rang de G; mclust calcula el BIC de cadascun
#    i selecciona automàticament el millor (per defecte, segons BIC)
model <- Mclust(dades, G = 1:6)
summary(model)

# Taula completa de BIC per a cada G i cada forma de covariància provada
model$BIC
plot(model, what = "BIC")  # gràfic de BIC en funció de G

# Nombre de components escollit automàticament
model$G

# 3. Etiquetes assignades i probabilitats de pertinença
etiquetes <- model$classification
probabilitats <- model$z  # matriu n x k amb la probabilitat de cada grup

# 4. Paràmetres estimats de cada component (resultat final de l'EM, ja convergit)
model$parameters$mean                              # mitjanes (μ) de cada grup
sqrt(model$parameters$variance$sigmasq)             # desviacions (σ), arrel de la variància
model$parameters$pro                                # pesos (π)

# 5. Punt de tall entre dos grups (per a un model de 2 components)
x_grid <- seq(min(dades), max(dades), length.out = 2000)
pred <- predict(model, newdata = x_grid)
prob_grup1 <- pred$z[, 1]
diff <- prob_grup1 - 0.5
canvis <- which(diff[-1] * diff[-length(diff)] < 0)
punt_de_tall <- x_grid[canvis]
print(punt_de_tall)

# 6. Visualització
plot(model, what = "density", main = "Densitat estimada (mixture)")
abline(v = punt_de_tall, col = "red", lty = 2)

plot(model, what = "classification")
```

`mclust` té l'avantatge que tria automàticament tant el nombre de components com la forma de la covariància (esfèrica, igual variància entre grups, variància lliure...) optimitzant el BIC, cosa que en Python cal fer manualment iterant sobre `n_components`.

> **Atenció amb el signe del BIC a `mclust`**: a diferència de `sklearn` (on `model.bic()` segueix la convenció clàssica i el millor model és el de valor **més baix**), `mclust` defineix el BIC amb el signe invertit, de manera que el millor model és el de valor **més alt**. `summary(model)` i `model$G` ja seleccionen el millor model correctament; només cal tenir-ho present si es comparen els números directament amb els de Python.

---

## GMM com a alternativa a K-means

És habitual plantejar-se K-means per a aquest mateix problema, però hi ha diferències importants:

| | K-means | GMM |
|---|---|---|
| Forma dels clústers | Esfèrics, mateixa mida implícita | El·lipsoidals, mida i forma pròpies per grup |
| Assignació | Dura (0 o 1) | Tova (probabilitat de pertinença) |
| Zona de solapament | No la modela; sempre força una frontera neta | La modela explícitament; permet dir "aquest punt és ambigu" |
| Base estadística | Heurística (distàncies) | Probabilística (versemblança) |
| Selecció del nombre de grups | Mètode del colze, silueta | BIC/AIC, amb base estadística més formal |

Per al cas concret que ens ocupa —saber a partir de quina observació es passa d'un grup a l'altre dins d'una variable contínua amb solapament—, el GMM és preferible perquè dona directament la **probabilitat de pertinença**, en lloc d'una frontera arbitrària basada només en la distància al centre del clúster.

## Resum

Un GMM és l'eina adequada quan sospites (o detectes amb un histograma) que una mostra prové de la barreja de diverses distribucions normals, i vols anar més enllà de "sembla que hi ha dos grups": vols quantificar quants grups hi ha, amb quina probabilitat pertany cada dada a cadascun, i on és exactament la frontera entre ells. La implementació és directa tant en Python (`sklearn.mixture.GaussianMixture`) com en R (`mclust`), i en ambdós casos el criteri BIC permet decidir objectivament el nombre de components.
