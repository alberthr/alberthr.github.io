---
layout: post
title: "El Test de Kolmogorov-Smirnov: Com saber si les teves dades segueixen una distribució"
tags:
  - estadistica
---

En el món de la ciència de dades, és molt habitual haver d'assumir que les nostres variables segueixen una forma geomètrica determinada. Per exemple, potser necessites validar si els residus d'un model de regressió lineal són normals, o si el temps d'espera dels usuaris en una aplicació s'ajusta a una distribució exponencial per poder aplicar la teoria de cues.

Com podem comprovar si les nostres dades reals coincideixen amb el que diu la teoria matemàtica? En lloc d'intentar endevinar-ho mirant un histograma a ull, l'estadística ens ofereix una eina elegant i precisa: el **Test de Kolmogorov-Smirnov (K-S)**.

## Què és el Test de Kolmogorov-Smirnov?

El test de Kolmogorov-Smirnov és una prova d'hipòtesi no paramètrica que serveix per determinar si una mostra prové d'una distribució teòrica específica (test d'una mostra o *Goodness-of-Fit*), o si dues mostres independents provenen de la mateixa distribució (test de dues mostres).

A diferència d'altres proves (com el test de Shapiro-Wilk, que només mesura la normalitat), el test K-S és totalment **universal**: es pot utilitzar amb qualsevol tipus de distribució contínua (Normal, Exponencial, Uniforme, Log-normal, etc.).

### Com funciona conceptualment?

L'enginy del test K-S rau en la seva simplicitat conceptual. En lloc de comparar histogrames o barres, utilitza les **Funcions de Distribució Acumulada (CDF)**. La CDF ens mostra la probabilitat que una variable prengui un valor menor o igual a $x$.

El procés és el següent:
1. Es calcula la **CDF empírica** de la nostra mostra real (una corba en forma d'escala que puja des de 0 fins a 1).
2. Es dibuixa la **CDF teòrica** de la distribució amb la qual ens volem comparar (una corba suau ideal).
3. Es busca l'estadístic **$D$**, que és exactament la **distància vertical màxima** entre totes dues corbes.



Si la distància màxima $D$ és prou gran, significa que la realitat s'allunya de la teoria; per tant, el *p-value* baixarà del nostre llindar habitual (0.05) i rebutjarem la hipòtesi nul·la que diu que les dades segueixen aquesta distribució.

---

## Pràctica amb dades sintètiques: Com es comporta el test?

Anem a crear dos escenaris sintètics diferents:
* **Escenari A:** Generarem una mostra realment Normal i la compararem amb la corba teòrica Normal.
* **Escenari B:** Generarem una mostra d'una distribució Gamma (esbiaixada) i intentarem "forçar" el test a veure si es creu que és Normal.

A continuació veurem com programar-ho, avaluar els resultats i generar el gràfic en Python i en R.

### Exemple a Python (amb `scipy` i `matplotlib`)

```python
import numpy as np
import scipy.stats as stats
import matplotlib.pyplot as plt

# Fixem la llavor per a la reproductibilitat
np.random.seed(42)
mida_mostra = 100

# 1. Generem les dades sintètiques
dades_normals = np.random.normal(loc=0, scale=1, size=mida_mostra)
dades_gamma = np.random.gamma(shape=2, scale=1, size=mida_mostra)

# 2. Executem el Test K-S contra la distribució normal estàndard ('norm')
res_normal = stats.kstest(dades_normals, 'norm', args=(0, 1))
res_gamma = stats.kstest(dades_gamma, 'norm', args=(2, 1)) # mitjana=2 en una gamma(2,1)

print(f"Dades Normals -> Estadístic D: {res_normal.statistic:.4f}, p-value: {res_normal.pvalue:.4f}")
print(f"Dades Gamma   -> Estadístic D: {res_gamma.statistic:.4f}, p-value: {res_gamma.pvalue:.4f}")

# 3. Grafiquem les CDFs per veure el comportament visual
plt.figure(figsize=(10, 5))

# Dibuixem la CDF teòrica de referència
x = np.linspace(-3, 6, 500)
plt.plot(x, stats.norm.cdf(x, loc=0, scale=1), label='CDF Teòrica Normal', color='black', lw=2)

# Dibuixem les CDFs empíriques
plt.ecdf(dades_normals, label='CDF Empírica (Dades Normals)', color='blue', alpha=0.7)
plt.ecdf(dades_gamma, label='CDF Empírica (Dades Gamma)', color='red', alpha=0.7)

plt.title('Comparativa de CDFs: Test de Kolmogorov-Smirnov')
plt.xlabel('Valor de la Variable')
plt.ylabel('Probabilitat Acumulada')
plt.legend()
plt.grid(True, linestyle='--')
plt.show()
```

Resultat esperat: El p-value de les dades normals serà gran (ex: > 0.5), confirmant que no hi ha proves per dir que no són normals. En canvi, el de les dades Gamma serà pràcticament 0 ($< 0.05$), indicant clarament que la línia vermella s'allunya massa de la línia teòrica de control.

### Exemple a R

```r
# Fixem la llavor
set.seed(42)
mida_mostra <- 100

# 1. Generem les dades sintètiques
dades_normals <- rnorm(mida_mostra, mean = 0, sd = 1)
dades_gamma <- rgamma(mida_mostra, shape = 2, scale = 1)

# 2. Executem el Test K-S integrat de R
test_normal <- ks.test(dades_normals, "pnorm", mean = 0, sd = 1)
test_gamma <- ks.test(dades_gamma, "pnorm", mean = 2, sd = 1)

cat(sprintf("Dades Normals -> Estadístic D: %.4f, p-value: %.4f\n", test_normal$statistic, test_normal$p.value))
cat(sprintf("Dades Gamma   -> Estadístic D: %.4f, p-value: %.4f\n", test_gamma$statistic, test_gamma$p.value))

# 3. Gràfic de comportament
plot(ecdf(dades_normals), col = "blue", main = "Comparativa de CDFs i Mètode K-S", 
     xlab = "Valor", ylab = "Probabilitat Acumulada", verticals = TRUE, do.points = FALSE)
plot(ecdf(dades_gamma), col = "red", add = TRUE, verticals = TRUE, do.points = FALSE)

# Afegim la corba normal teòrica de referència
curve(pnorm(x, mean = 0, sd = 1), from = -3, to = 6, col = "black", lwd = 2, add = TRUE)

legend("bottomright", legend = c("Teòrica Normal", "Empírica Normals", "Empírica Gamma"),
       col = c("black", "blue", "red"), lty = 1, lwd = 2)
```
