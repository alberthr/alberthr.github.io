---
layout: post
title: "Comparacio de distribucions amb Kolmogorov-Smirnov"
tags:
  - estadistica
excerpt: "Com determinar si dues mostres provenen de la mateixa distribució o si els residus segueixen una normal? El test de Kolmogorov-Smirnov compara funcions de distribució acumulades i ofereix un p-valor objectiu."
---

En l'àmbit de la ciència de dades o de l'estadística, sovint sorgeixen qüestions com ara si una variable segueix una distribució normal o si el comportament d'un grup d'usuaris A és equivalent al d'un grup B. Per respondre a aquestes preguntes, se sol recórrer a gràfics com histogrames o diagrames Q-Q[cite: 1]. No obstant això, quan es requereix una mètrica objectiva i un p-valor, el **Test de Kolmogorov-Smirnov (K-S)** esdevé una de les eines més versàtils i utilitzades[cite: 1].


## Què és i per a què serveix?

El test de Kolmogorov-Smirnov és una prova estadística no paramètrica (és a dir, no assumeix que les dades segueixen una forma de distribució predeterminada) que s'utilitza per **comparar distribucions de variables contínues**[cite: 1].

Es basa en la **Funció de Distribució Acumulada** (CDF, per les seves sigles en anglès)[cite: 1]. L'estadístic del test, anomenat $D$, representa la **distància màxima vertical** entre les dues funcions acumulades que es comparen[cite: 1].

A la següent gràfica interactiva es mostra de manera visual com l'estadístic $D$ localitza el punt on les dues corbes presenten la separació més gran[cite: 1]:

<!-- GRÀFIC EN JAVASCRIPT / CANVAS -->
<div style="text-align: center; margin: 20px 0; font-family: sans-serif;">
  <canvas id="ksCanvas" width="550" height="400" style="border:1px solid #d3d3d3; background:#fff; max-width:100%;"></canvas>
</div>

<script>
(function() {
  const canvas = document.getElementById('ksCanvas');
  const ctx = canvas.getContext('2d');

  const margin = {top: 40, right: 40, bottom: 50, left: 60};
  const width = canvas.width - margin.left - margin.right;
  const height = canvas.height - margin.top - margin.bottom;

  function mapX(val) { return margin.left + ((val - (-4)) / 8) * width; }
  function mapY(val) { return margin.top + (1 - val) * height; }

  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  
  for (let i = 0; i <= 5; i++) {
    let p = i * 0.2;
    let y = mapY(p);
    ctx.beginPath(); ctx.moveTo(margin.left, y); ctx.lineTo(canvas.width - margin.right, y); ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#333';
    ctx.font = '12px sans-serif';
    ctx.fillText(p.toFixed(1), margin.left - 25, y + 4);
    ctx.setLineDash([4, 4]);
  }

  for (let xVal = -4; xVal <= 4; xVal += 2) {
    let x = mapX(xVal);
    ctx.beginPath(); ctx.moveTo(x, margin.top); ctx.lineTo(x, canvas.height - margin.bottom); ctx.stroke();
    
    ctx.setLineDash([]);
    ctx.fillStyle = '#333';
    ctx.fillText(xVal, x - 5, canvas.height - margin.bottom + 20);
    ctx.setLineDash([4, 4]);
  }
  ctx.setLineDash([]);

  ctx.font = 'bold 14px sans-serif';
  ctx.save();
  ctx.translate(18, canvas.height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('Probabilitat Acumulada (CDF)', 0, 0);
  ctx.restore();
  
  ctx.textAlign = 'center';
  ctx.fillText('Variable (X)', canvas.width / 2, canvas.height - 10);

  function normalCDF(x) {
    return 0.5 * (1 + Math.erf(x / Math.sqrt(2)));
  }
  Math.erf = function(x) {
    let a1 =  0.254829592, a2 = -0.284496736, a3 =  1.421413741;
    let a4 = -1.453152027, a5 =  1.061405429, p  =  0.3275911;
    let sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);
    let t = 1.0 / (1.0 + p * x);
    let y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  };

  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let px = -4; px <= 4; px += 0.1) {
    let canvasX = mapX(px);
    let canvasY = mapY(normalCDF(px));
    if (px === -4) ctx.moveTo(canvasX, canvasY);
    else ctx.lineTo(canvasX, canvasY);
  }
  ctx.stroke();

  const punts = [-1.9, -1.3, -1.0, -0.7, -0.5, -0.4, -0.2, 0.0, 0.1, 0.2, 0.4, 0.7, 0.9, 1.2, 1.3, 1.5, 2.0, 2.1, 3.0];
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  
  let currentX = mapX(-4);
  let currentY = mapY(0);
  ctx.moveTo(currentX, currentY);

  punts.forEach((p, index) => {
    let nextX = mapX(p);
    ctx.lineTo(nextX, currentY);
    currentY = mapY((index + 1) / punts.length);
    ctx.lineTo(nextX, currentY);
    currentX = nextX;
  });
  ctx.lineTo(mapX(4), currentY);
  ctx.stroke();

  const xD = 1.35; 
  const yNormal = normalCDF(xD);
  const yEmpirica = 13 / punts.length;

  const cxD = mapX(xD);
  const cyNormal = mapY(yNormal);
  const cyEmpirica = mapY(yEmpirica);

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  ctx.moveTo(cxD, cyNormal);
  ctx.lineTo(cxD, cyEmpirica);
  ctx.stroke();

  function drawArrowHead(x, y, up) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 5, up ? y + 8 : y - 8);
    ctx.lineTo(x + 5, up ? y + 8 : y - 8);
    ctx.closePath();
    ctx.fillStyle = 'black';
    ctx.fill();
  }
  drawArrowHead(cxD, cyNormal, true);
  drawArrowHead(cxD, cyEmpirica, false);

  ctx.fillStyle = 'black';
  ctx.font = 'italic bold 16px serif';
  ctx.fillText('D max', cxD + 25, (cyNormal + cyEmpirica) / 2 + 5);

})();
</script>

Hi ha dues variants principals d'aquest test[cite: 1]:

1. **Test K-S d'una mostra:** Compara la distribució de les dades de la mostra amb una distribució teòrica coneguda (normal, exponencial, uniforme, etc.)[cite: 1].
2. **Test K-S de dues mostres:** Compara si dues mostres independents procedeixen de la mateixa distribució subjacent[cite: 1].


## Aplicacions pràctiques

* **Validació de models:** Comprovació de si els residus d'un model de regressió segueixen una distribució normal[cite: 1].
* **Proves A/B (A/B Testing):** Determinació de si el temps de permanència a la web o la despesa econòmica varien significativament entre el grup de control i el de tractament[cite: 1].
* **Detecció de *Data Drift*:** En entorns de producció d'aprenentatge automàtic (Machine Learning), s'utilitza per analitzar si les dades d'entrada actuals mantenen la mateixa distribució que les dades d'entrenament originals[cite: 1].

## Limitacions a tenir en compte
Malgrat la seva potència, el test K-S presenta certs punts febles que cal considerar[cite: 1]:
* ⚠️ Atenció amb els paràmetres estimats: Si s'aplica el test d'una mostra (per exemple, contra una normal) i es calculen la mitjana i la desviació estàndard directament a partir de les mateixes dades, el test K-S esdevé excessivament conservador[cite: 1]. En aquests casos, és preferible fer servir el Test de Lilliefors[cite: 1].
* 🪰 Sensibilitat a l'escala: Mostra una gran sensibilitat davant de qualsevol diferència en la forma, la mitjana o la dispersió de les distribucions; no obstant això, en el cas de mostres molt grans, pot resultar massa sensible i detectar diferències estadísticament significatives que en la pràctica manquen de rellevància real[cite: 1].


---

## Exemples pràctics: Python i R

A continuació, es mostra com aplicar el test de dues mostres mitjançant codi[cite: 1]. En aquest supòsit, es compara si el temps de càrrega d'una pàgina web amb un servidor nou (Grup B) difereix del registrat amb el servidor antic (Grup A)[cite: 1].

### 🐍 Implementació en Python

S'utilitza la llibreria `scipy.stats`[cite: 1]. Es generen dades aleatòries on el Grup B reflecteix un temps de resposta lleugerament més ràpid[cite: 1].

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