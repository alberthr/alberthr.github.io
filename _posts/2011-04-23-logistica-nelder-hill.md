---
layout: post
title: "Més enllà del Solver d'Excel: Equació de Hill vs. Logística de Nelder Modificada en Mix de Mitjans"
date: 2026-06-27 12:00:00 +0200
categories: marketing-analytics mmm data-science
excerpt: "Reflexió tècnica sobre la naturalesa matemàtica de l'Equació de Hill i la Logística de Nelder Modificada. Anàlisi del comportament de les corbes de saturació i la seva idoneïtat segons si es modelitzen vendes o cobertura."
---

En el desplegament de models de **Media Mix Modeling (MMM)** o en el disseny d'algorismes d'optimització de pressupostos publicitaris, l'elecció de la funció de saturació constitueix un dels reptes matemàtics més crítics. 

Sovint, les fórmules heretades de fulls de càlcul corporatius s'utilitzen de manera intercanviable sota termes imprecisos com *"Logística Modificada"* o *"Fórmula Excel"*. Tanmateix, l'**Equació de Hill** i la **Logística de Nelder Modificada (Zero-Intercept)** presenten propietats algebraiques diferents que afecten directament el comportament de l'optimitzador segons si l'objectiu són les **vendes** o la **cobertura neta**.

---

## 1. L'Equació de Hill i l'efecte de massa crítica

Originalment formulada per descriure fenòmens bioquímics, l'Equació de Hill s'ha consolidat en l'anàlisi de màrqueting per la seva capacitat de capturar efectes de llindar complexos.

### La Fórmula
$$y = E_{max} \cdot \frac{x^n}{EC_{50}^n + x^n}$$

### Propietats dels paràmetres:
* **$E_{max}$ (Sostre Màxim):** Representa l'asímptota horitzontal de la funció, és a dir, el límit teòric de resposta davant d'una inversió infinita.
* **$EC_{50}$ (Punt Mitjà de Transició):** Indica la quantitat de GRPs o inversió necessària per assolir exactament el $50\%$ del sostre màxim ($E_{max}/2$). Defineix la inèrcia inicial del canal.
* **$n$ (Exponent de Hill):** Regula la curvatura. Quan $n > 1$, la funció descriu una forma sigmoide (en "S") molt estricta, ideal per a fenòmens on es requereix acumulació d'impactes abans d'observar una reacció significativa.

---

## 2. La Funció Logística de Nelder Modificada

La variant coneguda habitualment en entorns corporatius com a "Logística Modificada" és una adaptació del **Model Logístic de Nelder** de tres paràmetres, alterada algebraicament perquè la intercepció es produeixi estrictament en l'origen $(0,0)$. En una corba logística estàndard, un pressupost de zero genera un resultat positiu ($y > 0$); aquesta modificació aplica una penalització exponencial al numerador per resoldre aquesta incoherència conceptual.

### La Fórmula
$$y = K \cdot \frac{1 - e^{-\alpha \cdot x}}{1 + \theta \cdot e^{-\alpha \cdot x}}$$

### Propietats dels paràmetres:
* **$K$ (Sostre de Capacitat):** L'asímptota de saturació del mercat o del canal (equivalent a l'$E_{max}$ de Hill).
* **$\alpha$ (Taxa d'Amortiment):** Regula la velocitat amb la qual la funció busca el seu límit horitzontal.
* **$\theta$ (Factor d'Asimetria de Nelder):** Controla la transició inicial. Si $\theta > 0$, es genera una forma en "S" progressiva. Si $\theta = 0$, la funció col·lapsa exactament en un model clàssic de rendiments decreixents exponencials ($y = K(1-e^{-\alpha x})$).

---

## Criteris de selecció segons el KPI: Vendes vs. Cobertura

L'elecció entre ambdós models s'ha de basar en la natura física del fenomen que es pretén descriure:

### Idoneïtat de Nelder Modificada per a la Cobertura (Reach)
La **cobertura neta** es caracteritza per una eficiència màxima en el tram inicial: el primer GRP capturarà exclusivament audiència nova. A mesura que augmenta la pressió publicitària, la probabilitat de duplicar impactes s'eleva, de manera que el creixement marginal decreix de forma immediata.
* **Comportament:** Ajustant el paràmetre $\theta$ a valors nuls o molt baixos, la fórmula de Nelder replica amb exactitud aquesta arrencada vertical i el seu posterior aplanament, essent altament eficient per a mitjans digitals o canals de resposta directa.

### Idoneïtat de Hill per a les Vendes
A diferència de la cobertura, el comportament de les **vendes** o la conversió de marca sol requerir freqüència d'impacte. Un volum baix d'inversió amb prou feines altera el comportament del consumidor; es necessita aconseguir una **massa crítica** o llindar de record perquè la intenció de compra s'activi.
* **Comportament:** L'exponent $n$ de Hill manté la corba plana prop de l'origen durant els primers trams de despesa, accelerant-se de forma sigmoide un cop superat el llindar de reactivitat del mercat.

---

## Exemple d'ajust sobre dades experimentals

A continuació es mostra el comportament visual de l'ajust d'ambdós models sobre un mateix conjunt de dades experimentals simulades. El gràfic reflecteix la diferència en la taxa de creixement inicial de cada funció:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficComparatiu" width="800" height="450"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    function formulaHill(x) { 
        return 91.5 * Math.pow(x, 1.75) / (Math.pow(125, 1.75) + Math.pow(x, 1.75)); 
    }
    function formulaNelder(x) { 
        return 89.0 * ((1 - Math.exp(-0.0095 * x)) / (1 + 2.1 * Math.exp(-0.0095 * x))); 
    }

    const xValors = [];
    const yHill = [];
    const yNelder = [];
    for (let x = 0; x <= 800; x += 10) {
        xValors.push(x);
        yHill.push(formulaHill(x));
        yNelder.push(formulaNelder(x));
    }

    const puntsReals = [
        {x: 10, y: 2.1}, {x: 30, y: 7.3}, {x: 50, y: 15.4}, {x: 100, y: 34.2}, 
        {x: 150, y: 52.0}, {x: 200, y: 64.5}, {x: 300, y: 78.1}, {x: 400, y: 84.0}, 
        {x: 600, y: 88.5}, {x: 800, y: 89.2}
    ];

    const ctx = document.getElementById('graficComparatiu').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValors,
            datasets: [
                {
                    label: 'Punts de mostra (Dades Reals)',
                    data: puntsReals,
                    type: 'scatter',
                    backgroundColor: '#1e293b',
                    borderColor: '#1e293b',
                    pointRadius: 6,
                    z: 3
                },
                {
                    label: 'Ajust: Equació de Hill (Forma en S forta)',
                    data: yHill,
                    borderColor: '#ef4444',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Ajust: Logística de Nelder Modificada (Suau / Decreixent)',
                    data: yNelder,
                    borderColor: '#3b82f6',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
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
                    title: { display: true, text: 'GRPs Totals', font: { weight: 'bold' } }, 
                    min: 0, 
                    max: 800 
                },
                y: { 
                    title: { display: true, text: 'Eficiència / KPI Assolit (%)', font: { weight: 'bold' } }, 
                    min: 0, 
                    max: 100 
                }
            }
        }
    });
});
</script>

### Observacions sobre la simulació:
1. **Divergència a l'origen (0 - 150 GRPs):** S'observa com l'ajust de **Hill** (línia vermella) reté la resposta prop del zero en els trams inicials, simulant la necessitat d'una freqüència mínima. Per contra, el model de **Nelder** (línia blava) mostra un pendent inicial més accentuat, descrivint una penetració de cobertura immediata.
2. **Convergència en la saturació:** Superats els $500$ GRPs, ambdós models descriuen el mateix fenomen físic d'esgotament de l'audiència o saturació de mercat, on els increments de pressupost generen rendiments decreixents marginals pròxims a zero.

---

## Conclusions i paradoxa en l'entorn corporatiu

L'anàlisi purament matemàtica suggereix l'ús de Hill per a vendes i de Nelder per a cobertura. Malgrat això, s'observa sovint una paradoxa en la pràctica corporativa: molts departaments financers tendeixen a rebutjar l'efecte llindar de Hill en els models de vendes, donat que assumir la corba en "S" implica conceptualitzar que els primers trams d'inversió no ofereixen cap retorn tangible. S'acaba optant, per criteris de prudència pressupostària, per la funció de Nelder, assumint que cada unitat monetària invertida ha de mobilitzar el KPI des del primer instant.