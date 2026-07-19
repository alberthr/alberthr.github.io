---
layout: post
title: "Models de Saturació en el Món Publicitari"
tags:
  - modelitzacio
  - publicitat
excerpt: "Reflexió tècnica sobre tres funcions de saturació habituals en Media Mix Modeling: l'Equació de Hill, la Logística de Nelder Modificada i el model exponencial simple, i la seva idoneïtat segons si es modelitzen vendes o cobertura."
---

En el desplegament de models de **Media Mix Modeling (MMM)**, en el disseny d'algoritmes d'optimització de pressupostos publicitaris o en altres simulacions d'efectes decreixents, l'elecció de la funció de saturació constitueix un dels reptes matemàtics més crítics.


## L'Equació de Hill

Originalment formulada per descriure fenòmens bioquímics, l'Equació de Hill s'ha consolidat en l'anàlisi de màrqueting per la seva capacitat de capturar efectes de llindar complexos.

$$y = E_{max} \cdot \frac{x^n}{EC_{50}^n + x^n}$$

### Propietats dels paràmetres:
* **$E_{max}$ (Sostre Màxim):** Representa l'asímptota horitzontal de la funció, és a dir, el límit teòric de resposta davant d'una inversió infinita.
* **$EC_{50}$ (Punt Mitjà de Transició):** Indica la quantitat de GRPs o inversió necessària per assolir exactament el $50\%$ del sostre màxim ($E_{max}/2$). Defineix la inèrcia inicial del canal.
* **$n$ (Exponent de Hill):** Regula la curvatura. Quan $n > 1$, la funció descriu una forma sigmoide (en "S") molt estricta, ideal per a fenòmens on es requereix acumulació d'impactes abans d'observar una reacció significativa.


## Logística de Nelder Modificada

La variant coneguda habitualment en entorns corporatius com a "Logística Modificada" és una adaptació del **Model Logístic de Nelder** de tres paràmetres, alterada algebraicament perquè la intercepció es produeixi estrictament en l'origen $(0,0)$. En una corba logística estàndard, un pressupost de zero genera un resultat positiu ($y > 0$); aquesta modificació aplica una penalització exponencial al numerador per resoldre aquesta incoherència conceptual.

$$y = K \cdot \frac{1 - e^{-\frac{x}{\beta}}}{1 + \theta \cdot e^{-\frac{x}{\beta}}}$$

### Propietats dels paràmetres:
* **$K$ (Sostre de Capacitat):** L'asímptota de saturació del mercat o del canal (equivalent a l'$E_{max}$ de Hill). Representa el percentatge màxim de cobertura neta assolible per aquell mitjà.
* **$\beta$ (Constant de Velocitat en GRPs):** Actua com el denominador dins l'exponent. Defineix el volum nominal de GRPs requerit pel canal per desplegar la seva acceleració cap al sostre de saturació. A major valor de $\beta$, més lenta és la corba.
* **$\theta$ (Factor d'Asimetria de Nelder):** Controla la natura del tram inicial. Si $\theta > 0$, es genera una lleugera forma en "S" progressiva. Si $\theta = 0$, la funció col·lapsa exactament en un model clàssic de rendiments decreixents exponencials pur ($y = K(1-e^{-x/\beta})$), eliminant qualsevol inèrcia inicial.


## El model exponencial simple

Quan no cal capturar cap efecte de llindar ni cap asimetria en l'arrencada, la tercera opció habitual és el **model exponencial simple** (o exponencial negativa), la corba de rendiments decreixents purs que ja apareix com a cas particular de Nelder quan $\theta = 0$:

$$y = a \cdot \left(1 - e^{-b \cdot x}\right)$$

### Propietats dels paràmetres:
* **$a$ (Asímptota):** El valor màxim al qual tendeix $y$ quan la inversió creix indefinidament, equivalent a l'$E_{max}$ de Hill i a la $K$ de Nelder.
* **$b$ (Velocitat d'aproximació):** Controla la rapidesa amb què la corba s'acosta a l'asímptota. Com més gran és $b$, més ràpid es satura el canal.

La diferència clau respecte als altres dos models és que **només té 2 paràmetres**, enfront dels 3 de Hill ($E_{max}$, $EC_{50}$, $n$) i dels 3 de Nelder ($K$, $\beta$, $\theta$). No té cap paràmetre per controlar ni el punt d'inflexió (com $EC_{50}$ a Hill) ni l'asimetria del tram inicial (com $\theta$ a Nelder): la corba sempre creix més ràpid a l'origen i es va frenant de manera contínua, mai amb forma de S. És, de fet, la forma matemàtica que es dedueix directament d'un procés de Poisson en cobertura publicitària: assumint impactes distribuïts aleatòriament, la probabilitat d'haver rebut almenys un impacte després d'una pressió $x$ té exactament aquesta expressió.

### Quan té sentit fer-lo servir

* **Mostres petites o amb pocs punts de dades:** amb 2 paràmetres en lloc de 3, l'ajust és més estable quan no hi ha prou observacions per estimar amb fiabilitat un punt d'inflexió o un factor d'asimetria propis.
* **Primera aproximació ràpida:** com a model de referència (*baseline*) abans de provar Hill o Nelder, per tenir una estimació ràpida de l'ordre de magnitud del sostre de saturació.
* **Canals sense efecte llindar conegut:** quan no hi ha evidència ni hipòtesi de negoci que justifiqui una acumulació prèvia d'impactes abans de generar resposta (a diferència de les vendes, on sovint sí que interessa capturar-ho).
* **Interpretabilitat i comunicació:** amb només dos paràmetres, és més senzill d'explicar a un interlocutor no tècnic que els 3 paràmetres de Hill o Nelder.


## Criteris de selecció segons el KPI

L'elecció entre els tres models s'ha de basar en la natura física del fenomen que es pretén descriure:

### Idoneïtat de Nelder Modificada per a la Cobertura (Reach)
La **cobertura neta** es caracteritza per una eficiència màxima en el tram inicial: el primer GRP capturarà exclusivament audiència nova. A mesura que augmenta la pressió publicitària, la probabilitat de duplicar impactes s'eleva, de manera que el creixement marginal decreix de forma immediata des del primer instant.
* **Comportament:** Ajustant el paràmetre d'asimetria $\theta$ a valors nuls ($\theta = 0$), la fórmula de Nelder col·lapsa en una corba de rendiments decreixents purs. Replica amb exactitud aquesta arrencada vertical i el seu posterior aplanament, essent un model matemàtic ideal per a la cobertura massiva.

### Idoneïtat de Hill per a les Vendes
A diferència de la cobertura, el comportament de les **vendes** o la conversió de marca sol requerir freqüència d'impacte. Un volum baix d'inversió amb prou feines altera el comportament del consumidor; es necessita aconseguir una **massa crítica** o llindar de record perquè la intenció de compra s'activi.
* **Comportament:** L'exponent $n$ de Hill manté la corba plana prop de l'origen durant els primers trams de despesa, accelerant-se de forma sigmoide un cop superat el llindar de reactivitat del mercat.

### Idoneïtat del model exponencial simple per a canals secundaris o amb poques dades
Quan el canal analitzat no té prou volum d'observacions per justificar un model de 3 paràmetres, o quan no hi ha cap hipòtesi de negoci que reclami capturar un llindar o una asimetria concreta, el model exponencial simple ofereix un ajust raonable amb menys risc de sobreajustament.
* **Comportament:** Sense inèrcia inicial ni forma de S, la corba respon des del primer euro invertit i es va frenant de manera contínua i predictible cap al sostre.


## Exemple d'ajust sobre dades simulades

A continuació es mostra el comportament visual de l'ajust dels tres models sobre un mateix conjunt de dades **simulades il·lustratives** (no procedeixen d'un experiment real; s'han generat per visualitzar la diferència de forma entre les tres corbes). El gràfic reflecteix la diferència real en la taxa de creixement inicial de cada funció segons el KPI objectiu:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficComparatiu" width="800" height="450"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    function formulaHill(x) {
        return 80 * Math.pow(x, 2.5) / (Math.pow(160, 2.5) + Math.pow(x, 2.5));
    }

    function formulaNelder(x) {
        const e = Math.exp(-x / 160);
        return 80 * (1 - e) / (1 + 1.2 * e);
    }

    function formulaExponencial(x) {
        return 80 * (1 - Math.exp(-x / 180));
    }

    const xValors = [];
    const yHill = [];
    const yNelder = [];
    const yExponencial = [];
    for (let x = 0; x <= 800; x += 10) {
        xValors.push(x);
        yHill.push(formulaHill(x));
        yNelder.push(formulaNelder(x));
        yExponencial.push(formulaExponencial(x));
    }

    // Punts de mostra simulats: mitjana dels tres models a cada x,
    // per il·lustrar un conjunt de dades versemblant per als tres ajustos
    const xsPunts = [10, 30, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800];
    const puntsSimulats = xsPunts.map(function(x) {
        const y = (formulaHill(x) + formulaNelder(x) + formulaExponencial(x)) / 3;
        return { x: x, y: Math.round(y * 10) / 10 };
    });

    const ctx = document.getElementById('graficComparatiu').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: xValors,
            datasets: [
                {
                    label: 'Punts simulats (il·lustratius)',
                    data: puntsSimulats,
                    type: 'scatter',
                    backgroundColor: '#1e293b',
                    borderColor: '#1e293b',
                    pointRadius: 6,
                    z: 3
                },
                {
                    label: 'Ajust: Equació de Hill (Forma en S)',
                    data: yHill,
                    borderColor: '#ef4444',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Ajust: Logística de Nelder Modificada',
                    data: yNelder,
                    borderColor: '#3b82f6',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Ajust: Exponencial Simple',
                    data: yExponencial,
                    borderColor: '#22c55e',
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
1. **Arrencada de l'Exponencial Simple:** a diferència de Hill i Nelder, la corba verda no té cap inèrcia inicial ni forma de S: comença a créixer des del primer GRP a la velocitat més alta de les tres, i es va frenant de manera contínua. En aquest exemple queda situada entre les altres dues corbes en gairebé tot el rang, la qual cosa il·lustra per què sovint funciona com a bona aproximació intermèdia quan no hi ha prou informació per triar entre Hill i Nelder.
2. **Proximitat i encreuaments entre Hill i Nelder:** malgrat la seva diferent naturalesa matemàtica, aquestes dues corbes es mantenen sorprenentment properes en gairebé tot el rang de GRPs, arribant a creuar-se en dos punts diferents (cap als 100-150 GRPs i de nou cap als 700-800 GRPs). La separació màxima entre els dos ajustos és modesta i es produeix al voltant dels 300 GRPs, just quan la **Hill** (línia vermella) ja ha iniciat la seva acceleració sigmoide mentre la **Nelder** (línia blava) encara progressa de forma més gradual.
3. **Convergència en la saturació:** superats els 600-700 GRPs, els tres models tornen a aproximar-se i descriuen pràcticament el mateix fenomen físic d'esgotament d'audiència o saturació del mercat potencial, on la inversió addicional es destina gairebé en la seva totalitat a duplicar impactes (freqüència inútil), aplanant el creixement marginal cap a zero.


## Conclusions

L'anàlisi purament matemàtica suggereix l'ús de Hill per a vendes i de Nelder per a cobertura, reservant el model exponencial simple per a canals amb poques dades o sense hipòtesi clara sobre l'existència d'un llindar. Malgrat això, s'observa sovint una paradoxa en la pràctica corporativa: molts departaments financers tendeixen a rebutjar l'efecte llindar de Hill en els models de vendes, donat que assumir la corba en "S" implica conceptualitzar que els primers trams d'inversió no ofereixen cap retorn tangible. S'acaba optant, per criteris de prudència pressupostària, per la funció de Nelder o, directament, per l'exponencial simple, assumint que cada unitat monetària invertida ha de mobilitzar el KPI des del primer instant. De fet, quan, com en l'exemple anterior, l'ajust estadístic dels tres models és pràcticament indistingible en bona part del rang, l'elecció final esdevé encara més una qüestió de criteri conceptual i de disponibilitat de dades que no pas de bondat d'ajust pur.
