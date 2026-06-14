---
layout: post
title: "Extreure tendències en sèries temporals. Suavitzat Polinómic"
tags: 
  - series-temporals
  - tendencia
  - modelitzacio
---

Quan treballem amb sèries temporals o gràfics de dispersió, sovint ens trobem amb una gran quantitat de soroll que dificulta veure la direcció real de les dades. Una línia recta de regressió lineal clàssica sol ser massa rígida, mentre que unir els punts directament genera un traç caòtic. 

Existeix un mètode matemàtic ideal per solucionar això: la **Regressió Local** o **LOESS**.

## Què és exactament LOESS?

**LOESS** (o la seva variant original **LOWESS**) significa *Locally Estimated Scatterplot Smoothing* (Suavitzat de Gràfics de Dispersió Estimat Localment). És un mètode **no paramètric**, la qual cosa significa que no assumeix que les teves dades han de seguir una forma fixa (com una línia recta o una paràbola). En lloc d'això, deixa que les pròpies dades defineixin la forma de la corba de manera totalment flexible.

A diferència d'una regressió clàssica que intenta ajustar una única fórmula a *totes* les dades alhora, LOESS construeix la línia de tendència a base de calcular múltiples regressions en petits grups de dades agrupades.

## Com funciona "per dins"?

Imagina que l'algorisme ha de dibuixar la línia de tendència d'esquerra a dreta. Per determinar l'alçada de la corba en un punt específic del gràfic (anomenem-lo punt $X$), LOESS segueix aquests quatre passos:

1. **Defineix el "veïnat" (controlat pel paràmetre `span`):** L'algorisme mira als costats del punt $X$ i selecciona un percentatge de les dades més properes. Si configurem un `span = 0.2`, LOESS agafarà només el 20% de les dades totals (les més properes). Si posem `span = 0.8`, farà servir el 80% de totes les dades del gràfic.
2. **Aplica un sistema de pes (Ponderació):** No tots els punts del veïnat importen igual. LOESS aplica una funció matemàtica (normalment la funció *tricúbica*) per donar **més pes als punts que estan tocant a $X$** i menys pes als que estan allunyats, als límits del veïnat.
3. **Calcula una regressió local:** Amb aquest petit grup de dades ponderades, calcula una regressió lineal o quadràtica. Com que els punts propers tenen més pes, la línia es veu fortament atreta cap a ells.
4. **Connecta els punts:** L'algorisme repeteix aquest procés per a cada posició al llarg de tot l'eix. Finalment, uneix tots els petits resultats locals per formar una corba suau i contínua.

### El paràmetre clau: `span` (o l'efecte "Alpha")

El paràmetre que controla com es comporta aquesta línia s'anomena formalment **`span`** (en algunes llibreries o conceptes es recorda com un factor de suavitzat o *alpha*):

* **Un `span` proper a 0:** Utilitza veïnats molt petits. La línia s'ajustarà moltíssim a les dades reals, capturant tot el soroll i els pics (sobreajust o *overfitting*). **Ajust total = 100% al soroll.**
* **Un `span` proper a 1 (o superior):** Utilitza pràcticament totes les dades alhora per a cada punt. El resultat és una línia molt suau que s'aproxima a una línia recta o una corba molt tènue. **Tendència general neta.**

---

## Implementació pràctica: Exemple en R i Python

A continuació veurem com aplicar LOESS a una sèrie temporal simulada amb soroll utilitzant els dos llenguatges estàndard de la ciència de dades. En els dos casos comparem un `span` baix (ajust total) amb un `span` alt (línia de tendència).

### Exemple en R

A R, la funció està integrada de forma nativa mitjançant `loess()`.

```r
# 1. Creem unes dades simulades (una ona sinusoïdal amb soroll)
set.seed(123)
temps <- 1:100
valors <- sin(temps/10) + rnorm(100, sd = 0.5)
dades <- data.frame(temps, valors)

# 2. Apliquem LOESS amb un span baix i un de més alt
ajust_total <- loess(valors ~ temps, data = dades, span = 0.1)
ajust_suau  <- loess(valors ~ temps, data = dades, span = 0.75)

# 3. Grafiquem el resultat (Utilitzant el sistema base de R)
plot(temps, valors, type = "l", col = "gray", 
     main = "Efecte del paràmetre 'span' a LOESS (R)", 
     xlab = "Temps", ylab = "Valors")

# Afegim les línies de tendència predites pel model
lines(temps, predict(ajust_total), col = "red", lwd = 2)     # S'ajusta al soroll
lines(temps, predict(ajust_suau), col = "blue", lwd = 2)     # Tendència neta

legend("topright", legend=c("Dades", "span = 0.1 (Ajust)", "span = 0.75 (Línia)"), 
       col=c("gray", "red", "blue"), lwd=2)
```


### Exemple en Python

A Python, podem utilitzar la llibreria statsmodels que inclou la funció lowess dins del seu mòdul de models no paramètrics.

```python
import numpy as np
import matplotlib.pyplot as plt
import statsmodels.api as sm

# 1. Creem les mateixes dades simulades
np.random.seed(123)
temps = np.arange(1, 101)
soroll = np.random.normal(0, 0.5, 100)
valors = np.sin(temps / 10) + soroll

# 2. Apliquem LOWESS (a statsmodels el paràmetre s'anomena 'frac' en lloc de 'span')
# Retorna una matriu on la segona columna [:, 1] conté els valors suavitzats
ajust_total = sm.nonparametric.lowess(valors, temps, frac=0.1)
ajust_suau  = sm.nonparametric.lowess(valors, temps, frac=0.75)

# 3. Grafiquem el resultat amb Matplotlib
plt.figure(figsize=(10, 6))
plt.plot(temps, valors, color='gray', label='Dades originals', alpha=0.7)
plt.plot(ajust_total[:, 0], ajust_total[:, 1], color='red', linewidth=2, label='frac/span = 0.1 (Ajust)')
plt.plot(ajust_suau[:, 0], ajust_suau[:, 1], color='blue', linewidth=2, label='frac/span = 0.75 (Línia)')

plt.title("Efecte del paràmetre 'frac/span' a LOWESS (Python)")
plt.xlabel("Temps")
plt.ylabel("Valors")
plt.legend()
plt.grid(True, linestyle='--', alpha=0.5)
plt.show()
```
