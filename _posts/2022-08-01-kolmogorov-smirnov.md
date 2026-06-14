---
layout: post
title: "Comparacio de distribucions amb Kolmogorov-Smirnov"
tags:
  - estadistica
---

Quan treballem en ciència de dades o estadística, sovint ens fem preguntes com: *Aquesta variable segueix una distribució normal?* o *Els usuaris del grup A es comporten igual que els del grup B?* Per respondre a això, solem recórrer a gràfics com histogrames o diagrames Q-Q. Però si necessitem una mètrica objectiva i un p-valor, el **Test de Kolmogorov-Smirnov (K-S)** és una de les eines més versàtils i utilitzades.


## Què és i per a què serveix?

El test de Kolmogorov-Smirnov és una prova estadística no paramètrica (és a dir, no assumeix que les dades segueixen una forma de distribució predeterminada) que serveix per **comparar distribucions de variables contínues**.

Es basa en la **Funció de Distribució Acumulada** (CDF, per les seves sigles en anglès). L'estadístic del test, anomenat $D$, és literalment la **distància màxima vertical** entre les dues funcions acumulades que estem comparant.

A la següent imatge es pot veure gràficament com l'estadístic $D$ busca el punt on les dues corbes es separen més:

![Concepte de l'estadístic D en el test Kolmogorov-Smirnov](https://raw.githubusercontent.com/alberthr/alberthr.github.io/refs/heads/main/_posts/img/2022-08-01-kolmogorov-smirnov_01.png)

Hi ha dues variants principals d'aquest test:

1. **Test K-S d'una mostra:** Compara la distribució de les teves dades amb una distribució teòrica coneguda (normal, exponencial, uniforme, etc.).
2. **Test K-S de dues mostres:** Compara si dues mostres independents procedeixen de la mateixa distribució subjacent.


## Aplicacions pràctiques

* **Validació de models:** Comprovar si els residus d'un model de regressió segueixen una distribució normal.
* **Proves A/B (A/B Testing):** Determinar si el temps de permanència a la web o els diners gastats varien significativament entre el grup de control i el de tractament.
* **Detecció de *Data Drift*:** En entorns de producció de Machine Learning, s'utilitza per veure si les dades que entren avui al model tenen la mateixa distribució que les dades amb les quals es va entrenar.

---

## Exemples pràctiques: Python i R

Anem a veure com aplicar el test de dues mostres utilitzant codi. Imaginem que volem comparar si el temps de càrrega de la nostra web amb un servidor nou (Grup B) és diferent del servidor antic (Grup A).

### Implementació a Python

Farem servir la llibreria `scipy.stats`. Generarem dades aleatòries on el Grup B és lleugerament més ràpid.

```python
import numpy as np
from scipy import stats

# Fixem la llavor per a la reproductibilitat
np.random.seed(42)

# Generem dades simulades (temps en segons)
grup_A = np.random.normal(loc=3.0, scale=0.5, size=100) # Servidor antic
grup_B = np.random.normal(loc=2.8, scale=0.5, size=100) # Servidor nou (més ràpid)

# Apliquem el test de Kolmogorov-Smirnov de dues mostres
estadistic_d, p_valor = stats.ks_2samp(grup_A, grup_B)

print(f"Estadístic D: {estadistic_d:.4f}")
print(f"p-valor: {p_valor:.4f}")

# Interpretació
alpha = 0.05
if p_valor < alpha:
    print("Rebutgem l'hipòtesi nul·la: Les dues distribucions són significativament diferents.")
else:
    print("No podem rebutjar l'hipòtesi nul·la: No hi ha evidència que les distribucions siguin diferents.")
```


### Exemple a R

```r
# Fixem la llavor
set.seed(27)

# Generem les mateixes dades simulades
grup_A <- rnorm(100, mean = 3.0, sd = 0.5)
grup_B <- rnorm(100, mean = 2.8, sd = 0.5)

# Grafiquem les mostres
plot(ecdf(grup_A), col = "blue", main = "Comparativa de CDFs i Mètode K-S", 
     xlab = "Valor", ylab = "Probabilitat Acumulada", verticals = TRUE, do.points = FALSE)
plot(ecdf(grup_B), col = "red", add = TRUE, verticals = TRUE, do.points = FALSE)

# Apliquem el test K-S
resultat <- ks.test(grup_A, grup_B)

# Mostrem els resultats per pantalla
print(resultat)

# Comprovar el p-valor de manera programàtica
if (resultat$p.value < 0.05) {
  cat("Resultat: Les distribucions són significativament diferents.\n")
} else {
  cat("Resultat: No hi ha diferències significatives.\n")
}

```
