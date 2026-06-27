---
layout: post
title: "Més enllà del Solver d'Excel: Equació de Hill vs. Logística de Nelder Modificada en Mix de Mitjans"
date: 2026-06-27 12:00:00 +0200
categories: marketing-analytics mmm data-science
---

Quan treballem en **Media Mix Modeling (MMM)** o dissenyem algorismes automatitzats per optimitzar pressupostos publicitaris, ens trobem amb un repte matemàtic clàssic: **com modelar la saturació dels mitjans**.

Molt sovint, les fórmules heretades dels vells fulls de càlcul s'anomenen de forma confusa. Parlem de *"Logística Modificada"*, *"Fórmules Excel"* o *"Models de Hill"*, de vegades utilitzant-los com a sinònims. En aquest article desvetllarem la realitat matemàtica rere dues de les funcions més potents de la indústria (l'**Equació de Hill** i la **Logística de Nelder Modificada** coneguda com *Zero-Intercept*) i obrirem un debat clau: quina és millor per predir **vendes** i quina per calcular **cobertura**?

---

## 1. L'Equació de Hill (La visió de la Massa Crítica)

Originalment dissenyada l'any 1910 per descriure la unió de l'oxigen a l'hemoglobina, l'Equació de Hill s'ha convertit en un estàndard en l'analítica de màrqueting digital (per exemple, és el motor de saturació bàsic del programari *LightweightMMM* de Google).

### La Fórmula
$$y = E_{max} \cdot \frac{x^n}{EC_{50}^n + x^n}$$

### Els Paràmetres:
* **$E_{max}$ (Sostre Màxim):** El límit màxim teòric (asímptota) de resposta que el mitjà pot aconseguir si s'hi injectessin infinits GRPs.
* **$EC_{50}$ (Punt Mitjà):** GRPs requerits per assolir exactament la meitat del sostre màxim ($E_{max}/2$). Ens indica la "resistència" o duresa inicial del canal.
* **$n$ (Exponent o Factor de Curvatura):** Controla la forma inicial. Si $n > 1$, la corba adquireix una forma de \"S\" (sigmoide) molt rígida, el que significa que la publicitat necessita acumular bastants impactes abans de començar a fer efecte.

---

## 2. La Funció Logística de Nelder Modificada (El disseny corporatiu)

El que molts manuals corporatius de planificació de mitjans i agències anomenen simplement \"Logística Modificada\" o \"Fórmula Solver\" és una variació del **Model Logístic de Nelder** (3 paràmetres), forçada algebraicament perquè el seu origen passi de forma estricta pel punt $(0,0)$. 

En una corba logística estàndard, quan la inversió és $0$, la fórmula dona un resultat positiu ($y > 0$). La modificació de Nelder corregeix aquesta anomalia utilitzant una penalització exponencial al numerador.

### La Fórmula
$$y = K \cdot \frac{1 - e^{-\alpha \cdot x}}{1 + \theta \cdot e^{-\alpha \cdot x}}$$

### Els Paràmetres:
* **$K$ (Sostre de Capacitat):** L'asímptota on el canal es satura per complet (equivalent a l'$E_{max}$).
* **$\alpha$ (Velocitat d'Amortiment):** Regula la rapidesa amb la qual la corba s'enlaira cap al seu sostre des del primer moment.
* **$\theta$ (Factor de Flexió Asimètrica de Nelder):** Penalitza la corba al principi. Si $\theta > 0$, es genera una forma en \"S\" suau. Si es fixa en $0$, la fórmula col·lapsa directament en un model clàssic de rendiments decreixents exponencials ($y = K(1-e^{-\alpha x})$).

---

## El Gran Debat: Quina triar segons el teu KPI (Vendes vs. Cobertura)

La tria de la fórmula no s'ha de fer per gust programàtic, sinó entenent la natura del comportament que volem predir. Aquí és on la física dels mitjans es creua amb la matemàtica:

### Per què Nelder Modificada és ideal per a la Cobertura (Reach)
La **cobertura neta** (el percentatge de persones úniques impactades) té un funcionament molt lògic: **el primer GRP de campanya és el més valuós**, ja que tothom a qui impacta és públic nou. A partir d'aquí, cada nou GRP té més probabilitats de caure sobre algú que ja ha vist l'anunci (impactes duplicats o freqüència), per la qual cosa la capacitat d'aconseguir nova audiència es frena immediatament.
* **La solució amb Nelder:** Fixant una $\theta$ nul·la o molt baixa, la Logística de Nelder descriu perfectament aquesta arrencada vertical i el posterior aplanament ràpid. És la reina indiscutible per modelar la cobertura en l'entorn digital (Meta, YouTube) o canals de resposta immediata (Paid Search).

### Per què Hill és la reina de les Vendes i conversions
El comportament de les **Vendes** o la conversió de marca funciona a l'inrevés: llançar un sol anunci a la televisió o veure un sol bàner gairebé mai genera una compra. Es necessita un efecte de **llindar o massa crítica**; el consumidor ha de rebre diversos impactes (freqüència) perquè el missatge s'instal·li en el seu record i s'activi la intenció de compra.
* **La solució amb Hill:** L'exponent $n$ reté la corba arran de terra durant els primers GRPs (simulant que gastar poc és equivalent a no gastar res) i l'accelera verticalment en forma de \"S\" un cop s'ha superat el llindar de reactivitat de l'audiència.

---

## Exemple Pràctic: Ajust sobre un mateix núvol de dades

A continuació pots veure com s'ajusten realment l'Equació de Hill i la Logística de Nelder Modificada sobre un mateix conjunt de dades experimentals extraigudes d'una campanya. Passa el ratolí o el dit pel gràfic interactiu per explorar les diferències en cada tram:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficComparatiu" width="800" height="450"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    // Definició de les funcions matemàtiques optimitzades
    function formulaHill(x) { 
        return 91.5 * Math.pow(x, 1.75) / (Math.pow(125, 1.75) + Math.pow(x, 1.75)); 
    }
    function formulaNelder(x) { 
        return 89.0 * ((1 - Math.exp(-0.0095 * x)) / (1 + 2.1 * Math.exp(-0.0095 * x))); 
    }

    // Generar la seqüència de punts continus per a les línies
    const xValors = [];
    const yHill = [];
    const yNelder = [];
    for (let x = 0; x <= 800; x += 10) {
        xValors.push(x);
        yHill.push(formulaHill(x));
        yNelder.push(formulaNelder(x));
    }

    // Dataset de punts experimentals reals (mostra de campanya)
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

### Anàlisi de l'Ajust Visual:
1. **El Tram Inicial (0 - 150 GRPs):** Fixa't en la línia vermella de **Hill**. Com que simula l'efecte llindar necessari per a l'impacte en vendes, triga més a enlairar-se. En canvi, la línia blava de **Nelder** surt amb un pendent més pronunciat des del punt $(0,0)$, el comportament exacte d'un canal aconseguint cobertura ràpida en els primers dies de campanya.
2. **La Resolució de Saturació:** A partir dels $500$ GRPs, ambdós models coincideixen en el diagnòstic: el canal ha arribat al seu límit d'eficiència i seguir injectant pressupost només produirà rendiments decreixents fatals (esgotament de l'audiència o saturació del mercat).

---

## Conclusió i paradoxa financera

Malgrat que la ciència de dades ens diu que **Hill s'adapta millor a les Vendes** i **Nelder Modificada a la Cobertura**, en el món corporatiu sovint trobem una paradoxa clàssica: molts equips financers rebutgen el model de Hill per a les vendes. Per què? Perquè tenir un model amb "efecte llindar" implica admetre que els primers 40.000 € invertits no generaran cap retorn fins a activar la corba. Els directors financers prefereixen la lògica de Nelder per als pressupostos: un model on cada euro invertit comenci a moure l'agulla des del primer minut.

Com a data scientists o analistes, la nostra feina és triar el model basant-nos en la veritat de les dades històriques i la natura física del canal, dominant les matemàtiques que s'amaguen darrere dels botons del nostre optimitzador.