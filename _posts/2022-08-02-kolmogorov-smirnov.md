---
layout: post
title: "Comparacio de distribucions amb Kolmogorov-Smirnov"
tags:
  - estadistica
excerpt: "Com determinar si dues mostres provenen de la mateixa distribució o si els residus segueixen una normal? El test de Kolmogorov-Smirnov compara funcions de distribució acumulades i ofereix un p-valor objectiu."
---

En l'àmbit de la ciència de dades o de l'estadística, sovint sorgeixen qüestions com ara si una variable segueix una distribució normal o si el comportament d'un grup d'usuaris A és equivalent al d'un grup B. Per respondre a aquestes preguntes, se sol recórrer a gràfics com histogrames o diagrames Q-Q. No obstant això, quan es requereix una mètrica objectiva i un p-valor, el **Test de Kolmogorov-Smirnov (K-S)** esdevé una de les eines més versàtils i utilitzades.


## Què és i per a què serveix?

El test de Kolmogorov-Smirnov és una prova estadística no paramètrica (és a dir, no assumeix que les dades segueixen una forma de distribució predeterminada) que s'utilitza per **comparar distribucions de variables contínues**.

Es basa en la **Funció de Distribució Acumulada** (CDF, per les seves sigles en anglès). L'estadístic del test, anomenat $D$, representa la **distància màxima vertical** entre les dues funcions acumulades que es comparen.

A la següent gràfica es mostra de manera visual com l'estadístic $D$ localitza el punt on les dues corbes presenten la separació més gran:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficKS" width="800" height="450"></canvas>
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

    const xValors = [];
    const yTeorica = [];
    for (let x = -4.0; x <= 4.0; x += 0.1) {
        xValors.push(Number(x.toFixed(2)));
        yTeorica.push(normalCDF(x));
    }

    const puntsMostra = [-1.9, -1.3, -1.0, -0.7, -0.5, -0.4, -0.2, 0.0, 0.1, 0.2, 0.4, 0.7, 0.9, 1.2, 1.3, 1.5, 2.0, 2.1, 3.0];
    const yEmpirica = [];
    
    xValors.forEach(x => {
        const puntsMenorsOIguals = puntsMostra.filter(p => p <= x).length;
        yEmpirica.push(puntsMenorsOIguals / puntsMostra.length);
    });

    const xDistancia = 1.3;
    const yTeoricaEnD = normalCDF(xDistancia);
    const yEmpiricaEnD = puntsMostra.filter(p => p <= xDistancia).length / puntsMostra.length;

    const liniaDMax = [
        { x: xDistancia, y: yTeoricaEnD },
        { x: xDistancia, y: yEmpiricaEnD }
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
                    label: 'Distància Màxima (D max)',
                    data: liniaDMax,
                    type: 'scatter',
                    showLine: true,
                    borderColor: '#1e293b',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#1e293b',
                    fill: false
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
                    type: 'linear', 
                    title: { display: true, text: 'Variable (X)', font: { weight: 'bold' } }, 
                    min: -4, 
                    max: 4 
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

1. **Test K-S d'una mostra:** Compara la distribució de les dades de la mostra amb una distribució teòrica coneguda (normal, exponencial, uniforme, etc.).
2. **Test K-S de dues mostres:** Compara si dues mostres independents procedeixen de la mateixa distribució subjacent.


## Aplicacions pràctiques

* **Validació de models:** Comprovació de si els residus d'un model de regressió segueixen una distribució normal.
* **Proves A/B (A/B Testing):** Determinació de si le temps de permanència a la web o la despesa econòmica varien significativament entre el grup de control i el de tractament.
* **Detecció de *Data Drift*:** En entorns de producció d'aprenentatge automàtic (Machine Learning), s'utilitza per analitzar si les dades d'entrada actuals mantenen la mateixa distribució que les dades d'entrenament originals.

## Limitacions a tenir en compte
Malgrat la seva potència, el test K-S presenta certs punts febles que cal considerar:
* ⚠️ Atenció amb els paràmetres estimats: Si s'aplica el test d'una mostra (per exemple, contra una normal) i es calculen la mitjana i la desviació estàndard directament a partir de les mateixes dades, el test K-S esdevé excessivament conservador. En aquests casos, es prefereix fer servir el Test de Lilliefors.
* 🪰 Sensibilitat a l'escala: Mostra una gran sensibilitat davant de qualsevol diferència en la forma, la mitjana o la dispersió de les distribucions; no obstant això, en el cas de mostres molt grans, pot resultar massa sensible i detectar diferències estadísticament significatives que en la pràctica manquen de rellevància real.


---

## Exemples pràctics: Python i R

A continuació, es mostra com aplicar el test de dues mostres mitjançant codi. En aquest supòsit, es compara si le temps de càrrega d'una pàgina web amb un servidor nou (Grup B) difereix del registrat amb el servidor antic (Grup A).

### 🐍 Implementació en Python

S'utilitza la llibreria `scipy.stats`. Es generen dades aleatòries on el Grup B reflecteix un temps de resposta lleugerament més ràpid.

```python
import numpy as np
from scipy import stats

# Fixació de la llavor per a la reproductibilitat
np.random.seed(42)

# Generació de dades simulades (temps en segons)
grup_A = np.random.normal(loc=3.0, scale=0.5, size=100) # Servidor antic
grup_B = np.random.normal(loc=2.8, scale=0.5, size=100) # Servidor nou (més ràpid)

# Aplicació del test de Kolmogorov-Smirnov de dues mostres
estadistic_d, p_valor = stats.ks_2samp(grup_A, grup_B)

print(f"Estadístic D: {estadistic_d:.4f}")
print(f"p-valor: {p_valor:.4f}")

# Interpretació
alpha = 0.05
if p_valor < alpha:
    print("Es rebutja l'hipòtesi nul·la: Les dues distribucions són significativament diferents.")
else:
    print("No es pot rebutjar l'hipòtesi nul·la: No hi ha evidència que les distribucions siguin diferents.")