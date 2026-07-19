---
layout: post
title: "Suavitzat LOESS per Extreure Tendències en Sèries Temporals"
tags:
  - estadistica
  - python
  - r
excerpt: "Quan una regressió lineal és massa rígida i unir punts genera soroll caòtic, LOESS ofereix un suavitzat local i flexible per detectar tendències reals en sèries temporals."
---

En sèries temporals o gràfics de dispersió, sovint apareix una gran quantitat de soroll que dificulta veure la direcció real de les dades. Una línia recta de regressió lineal clàssica sol ser massa rígida, mentre que unir els punts directament genera un traç caòtic.

Existeix un mètode matemàtic ideal per solucionar això: la **Regressió Local** o **LOESS**.

## Què és exactament LOESS?

**LOESS** (o la seva variant original **LOWESS**) significa *Locally Estimated Scatterplot Smoothing* (Suavitzat de Gràfics de Dispersió Estimat Localment). És un mètode **no paramètric**, la qual cosa significa que no assumeix que les dades han de seguir una forma fixa (com una línia recta o una paràbola). En lloc d'això, deixa que les pròpies dades defineixin la forma de la corba de manera totalment flexible.

A diferència d'una regressió clàssica que intenta ajustar una única fórmula a *totes* les dades alhora, LOESS construeix la línia de tendència a base de calcular múltiples regressions en petits grups de dades agrupades.

## Com funciona "per dins"?

L'algoritme dibuixa la línia de tendència d'esquerra a dreta. Per determinar l'alçada de la corba en un punt específic del gràfic (anomenat punt $X$), LOESS segueix aquests quatre passos:

1. **Defineix el "veïnat" (controlat pel paràmetre `span`):** l'algoritme mira als costats del punt $X$ i selecciona un percentatge de les dades més properes. Amb un `span = 0.2`, LOESS agafa només el 20% de les dades totals (les més properes). Amb `span = 0.8`, fa servir el 80% de totes les dades del gràfic.
2. **Aplica un sistema de pes (Ponderació):** no tots els punts del veïnat importen igual. LOESS aplica una funció matemàtica (normalment la funció *tricúbica*) per donar **més pes als punts que estan tocant a $X$** i menys pes als que estan allunyats, als límits del veïnat.
3. **Calcula una regressió local:** amb aquest petit grup de dades ponderades, calcula una regressió lineal o quadràtica. Com que els punts propers tenen més pes, la línia es veu fortament atreta cap a ells.
4. **Connecta els punts:** l'algoritme repeteix aquest procés per a cada posició al llarg de tot l'eix. Finalment, uneix tots els petits resultats locals per formar una corba suau i contínua.

### El paràmetre clau: `span` (o l'efecte "Alpha")

El paràmetre que controla com es comporta aquesta línia s'anomena formalment **`span`** (en algunes llibreries o conceptes es coneix com un factor de suavitzat o *alpha*):

* **Un `span` proper a 0:** utilitza veïnats molt petits. La línia s'ajusta moltíssim a les dades reals, capturant tot el soroll i els pics (sobreajust o *overfitting*). **Ajust total = 100% al soroll.**
* **Un `span` proper a 1 (o superior):** utilitza pràcticament totes les dades alhora per a cada punt. El resultat és una línia molt suau que s'aproxima a una línia recta o una corba molt tènue. **Tendència general neta.**

El gràfic següent il·lustra aquest contrast sobre una sèrie simulada (una ona sinusoïdal amb soroll): la línia vermella (`span` baix) segueix pràcticament cada oscil·lació de les dades, mentre que la línia blava (`span` alt) es queda amb la tendència de fons, ignorant el soroll puntual.

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficLoess" width="800" height="450"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    // Dades simulades il·lustratives: ona sinusoïdal amb soroll,
    // aproximant l'efecte de LOESS amb mitjanes mòbils de finestra diferent
    function seedRandom(seed) {
        let s = seed;
        return function() {
            s = (s * 9301 + 49297) % 233280;
            return s / 233280;
        };
    }
    const rand = seedRandom(123);

    const temps = [];
    const valors = [];
    for (let t = 1; t <= 100; t += 1) {
        const soroll = (rand() - 0.5) * 1.0;
        temps.push(t);
        valors.push(Math.sin(t / 10) + soroll);
    }

    function mitjanaMobil(dades, finestra) {
        const resultat = [];
        const mig = Math.floor(finestra / 2);
        for (let i = 0; i < dades.length; i += 1) {
            const inici = Math.max(0, i - mig);
            const fi = Math.min(dades.length, i + mig + 1);
            const tros = dades.slice(inici, fi);
            const mitjana = tros.reduce((a, b) => a + b, 0) / tros.length;
            resultat.push(mitjana);
        }
        return resultat;
    }

    const spanBaix = mitjanaMobil(valors, 5);   // Aproxima un 'span' baix (s'ajusta al soroll)
    const spanAlt = mitjanaMobil(valors, 41);   // Aproxima un 'span' alt (tendència neta)

    const ctx = document.getElementById('graficLoess').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: temps,
            datasets: [
                {
                    label: 'Dades originals (amb soroll)',
                    data: valors,
                    borderColor: '#cbd5e1',
                    backgroundColor: '#cbd5e1',
                    borderWidth: 1,
                    pointRadius: 0,
                    fill: false,
                    tension: 0
                },
                {
                    label: 'span baix (s\'ajusta al soroll)',
                    data: spanBaix,
                    borderColor: '#ef4444',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.2
                },
                {
                    label: 'span alt (tendència neta)',
                    data: spanAlt,
                    borderColor: '#3b82f6',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 12 } }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Temps', font: { weight: 'bold' } }
                },
                y: {
                    title: { display: true, text: 'Valor', font: { weight: 'bold' } }
                }
            }
        }
    });
});
</script>

## Implementació pràctica

A continuació es mostra com aplicar LOESS a una sèrie temporal simulada amb soroll utilitzant els dos llenguatges estàndard de la ciència de dades. En els dos casos es compara un `span` baix (ajust total) amb un `span` alt (línia de tendència).

### Implementació en R

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

### Implementació en Python

A Python, es pot utilitzar la llibreria statsmodels, que inclou la funció lowess dins del seu mòdul de models no paramètrics.

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
