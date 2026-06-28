---
layout: post
title: "Comparacio de distribucions amb Kolmogorov-Smirnov"
tags:
  - estadistica
excerpt: "Determinar si dues mostres provenen de la mateixa distribució o si els residus segueixen una Normal. El test de Kolmogorov-Smirnov compara funcions de distribució acumulades i ofereix un p-valor objectiu."
---

En l'àmbit de la ciència de dades o de l'estadística, sovint sorgeixen qüestions com ara si una variable segueix una distribució normal o si el comportament d'un grup d'usuaris A és equivalent al d'un grup B. Per respondre a aquestes preguntes, se sol recórrer a gràfics com histogrames o diagrames Q-Q. No obstant això, quan es requereix una mètrica objectiva i un p-valor, el **Test de Kolmogorov-Smirnov (K-S)** esdevé una de les eines més versàtils i utilitzades.


## Què és i per a què serveix?

El test de Kolmogorov-Smirnov és una prova estadística no paramètrica que s'utilitza per **comparar distribucions de variables contínues**.

Es basa en la **Funció de Distribució Acumulada** (CDF, per les seves sigles en anglès). L'estadístic del test, anomenat $D$, representa la **distància màxima vertical** entre les dues funcions acumulades que es comparen.

A la següent gràfica es mostra de manera visual com l'estadístic $D$ localitza el punt on les dues corbes presenten la separació més gran:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 550px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficKS"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    function normalCDF(x) {
        const a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
        const a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;
        const sign = (x < 0) ? -1 : 1;
        const absX = Math.abs(x);
        const t = 1.0 / (1.0 + p * absX);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
        return 0.5 * (1 + sign * y);
    }

    // Generació d'eix X de -3 a +3
    const xValors = [];
    const yTeorica = [];
    for (let x = -3.0; x <= 3.0; x += 0.05) {
        xValors.push(Number(x.toFixed(2)));
        yTeorica.push(normalCDF(x));
    }

    const puntsMostra = [-1.9, -1.3, -1.0, -0.7, -0.5, -0.4, -0.2, 0.0, 0.1, 0.2, 0.4, 0.7, 0.9, 1.2, 1.3, 1.5, 2.0, 2.1, 3.0];
    const yEmpirica = [];
    
    xValors.forEach(x => {
        const puntsMenorsOIguals = puntsMostra.filter(p => p <= x).length;
        yEmpirica.push(puntsMenorsOIguals / puntsMostra.length);
    });

    // Cerca real del punt on la distància vertical és màxima
    let maxDistancia = 0;
    let xOptima = xValors[0];
    let yTeoricaOptima = yTeorica[0];
    let yEmpiricaOptima = yEmpirica[0];

    for (let i = 0; i < xValors.length; i++) {
        let dist = Math.abs(yTeorica[i] - yEmpirica[i]);
        if (dist > maxDistancia) {
            maxDistancia = dist;
            xOptima = xValors[i];
            yTeoricaOptima = yTeorica[i];
            yEmpiricaOptima = yEmpirica[i];
        }
    }

    // Creem la línia vertical sense les rodones a l'unió (feta amb estil discontínu)
    const liniaDMax = [
        { x: xOptima, y: yTeoricaOptima },
        { x: xOptima, y: yEmpiricaOptima }
    ];

    const ctx = document.getElementById('graficKS').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValors,
            datasets: [
                {
                    label: 'CDF Teòrica (Distribució Normal)',
                    data: yTeorica,
                    borderColor: '#ef4444',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'CDF Empírica (Dades Reals)',
                    data: yEmpirica,
                    borderColor: '#3b82f6',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    stepped: true
                },
                {
                    label: `Distància Màxima Real (D = ${maxDistancia.toFixed(3)})`,
                    data: liniaDMax,
                    type: 'scatter',
                    showLine: true,
                    borderColor: '#1e293b',
                    borderWidth: 2.5,
                    borderDash: [5, 5], // Línia discontínua per evitar les rodones grans
                    pointRadius: 0,     // Eliminem els cercles dels extrems
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            aspectRatio: 1.3, // Força un format molt més quadrat i compacte
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 11 } }
                }
            },
            scales: {
                x: { 
                    type: 'linear', 
                    title: { display: true, text: 'Variable (X)', font: { weight: 'bold' } }, 
                    min: -3, 
                    max: 3 
                },
                y: { 
                    title: { display: true, text: 'Probabilitat Acumulada (CDF)', font: { weight: 'bold' } }, 
                    min: 0, 
                    max: 1 
                }
            }
        }
    });
});
</script>

Hi ha dues variants principals d'aquest test:

1. **Test K-S d'una mostra:** Compara la distribució de les dades de la mostra amb una distribució teòrica coneguda (sol ser una distribució normal, pero pot ser exponencial, uniforme, etc.).
2. **Test K-S de dues mostres:** Compara si dues mostres independents procedeixen de la mateixa distribució subjacent.


## Aplicacions pràctiques

* **Validació de models:** Comprovació de si els residus d'un model de regressió segueixen una distribució normal.
* **Proves A/B (A/B Testing):** Determinació de si le temps de permanència a la web o la despesa econòmica varien significativament entre el grup de control i el de tractament.
* **Detecció de *Data Drift*:** En entorns de producció d'aprenentatge automàtic (Machine Learning), s'utilitza per analitzar si les dades d'entrada actuals mantenen la mateixa distribució que les dades d'entrenament originals.


---

## Exemples pràctiques: Python i R

Anem a veure com aplicar el test de dues mostres utilitzant codi. Imaginem que volem comparar si el temps de càrrega de la nostra web amb un servidor nou (Grup B) és diferent del servidor antic (Grup A).

### 🐍 Implementació en Python

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

### 📊 Implementacio en R

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