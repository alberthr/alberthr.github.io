---
layout: post
title: "Suma de Cobertures de Mitjans amb Teoria de la Probabilitat"
tags:
  - publicitat
excerpt: "Per què la cobertura de dos mitjans no es pot sumar directament quan el seu consum és independent, i com fer-ho servint-se de probabilitat bàsica: des de la cobertura exacta per trams fins a qualsevol nivell de freqüència N+ conjunt."
---

Quan una campanya es reparteix entre diversos mitjans —televisió i digital, per exemple— sorgeix sempre la mateixa pregunta: si la televisió té un 70% de cobertura i el digital un 50%, quina és la cobertura conjunta. La resposta fàcil, sumar els dos percentatges i obtenir un 120%, és impossible i evidencia l'error. Aquest post proposa una manera de calcular la cobertura conjunta fent servir només probabilitat bàsica, sense necessitat de programari especialitzat.


## Per què no es poden sumar directament

Sumar directament la cobertura de dos mitjans només seria correcte si cap persona consumís els dos alhora. En el cas de l'exemple, ni tan sols aquest escenari seria possible, perquè un 70% i un 50% sense cap solapament ja superarien el 100% de la població. En la pràctica, a més, que dos mitjans no tinguin cap solapament quasi mai passa: hi ha gent que veu la televisió i també consulta el digital, de manera que aquesta part de la població queda comptada dues vegades si simplement se sumen els percentatges.

Assumirem, doncs, que el consum dels mitjans és **independent**: saber que algú ha consumit el mitjà A no dona cap informació sobre si també ha consumit el mitjà B. És una simplificació raonable quan no es disposa de dades de panell creuades.


## Les regles de probabilitat que es faran servir

Tot el que ve a continuació es construeix amb només tres regles bàsiques de probabilitat.

La **regla del complementari** diu que la probabilitat que un esdeveniment no passi és 1 menys la probabilitat que sí que passi. Si un mitjà té un 70% de cobertura, la probabilitat de no haver-lo vist és $$1-0.70=0.30$$.

La **regla del producte** diu que, quan dos esdeveniments són independents, la probabilitat que passin tots dos alhora és el producte de les seves probabilitats individuals. És la regla que permet dir que la independència entre mitjans converteix "no veure A i no veure B" en una simple multiplicació.

La **regla de la suma** diu que, quan hi ha diverses maneres excloents d'arribar a un resultat, la probabilitat del resultat és la suma de les probabilitats de cada camí. Per exemple: llançant un dau, la probabilitat de treure un 1 o un 6 és $$1/6 + 1/6 = 2/6$$, perquè són dos resultats que no poden sortir alhora en la mateixa tirada. S'aplicarà la mateixa idea per calcular la probabilitat d'haver rebut **exactament un impacte combinant dos mitjans** (i 2, 3, 4... impactes): hi ha dos camins excloents que hi porten (rebre l'únic impacte del mitjà A i cap del B, o rebre l'únic impacte del mitjà B i cap de l'A), i com que ningú pot arribar-hi pels dos camins alhora, les seves probabilitats se sumen.


## El punt de partida: de la cobertura acumulada a la cobertura exacta

Els estudis de planificació solen donar la cobertura en format acumulat (1+, 2+, 3+...), és a dir, "com a mínim n vegades". Per als càlculs d'exemple d'aquest article, cal saber la probabilitat d'un tram **exacte** —ni una vegada més ni una menys—, perquè el total combinat de dos mitjans depèn de sumar impactes concrets d'un i de l'altre, no només de saber si s'ha superat un llindar.

Per aïllar un tram exacte cal restar dos trams acumulats consecutius:

$$P(\text{Exactament } n) = C_{n+} - C_{(n+1)+}$$

La lògica és senzilla: la cobertura a $$n+$$ inclou tothom que ha rebut $$n$$ impactes o més, i la cobertura a $$(n+1)+$$ inclou el mateix grup menys els que s'han quedat exactament a $$n$$. La diferència entre totes dues és, per tant, exactament la gent que s'ha quedat a $$n$$ impactes ni un més ni un menys. El cas de 0 impactes és l'únic que no es resta d'un tram superior, sinó que és directament el complementari de la cobertura a 1+ ($$1-C_{1+}$$), per la regla del complementari.

*Exemple:* dos mitjans amb les corbes de cobertura N+ següents (per exemple, obtingudes amb la [fórmula de decaïment geomètric]({{ site.baseurl }}/entrades/cobertura-nplus-grps/) d'un article anterior):

| Freqüència | 1+ | 2+ | 3+ | 4+ |
|---|---|---|---|---|
| Mitjà A | 70% | 42% | 25.2% | 15.1% |
| Mitjà B | 50% | 25% | 12.5% | 6.3% |

Aplicant la resta entre trams consecutius s'obté la probabilitat exacta, escrita com $$P_A(n)$$ i $$P_B(n)$$:

| Impactes exactes | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Mitjà A — $$P_A(n)$$ | 30.0% | 28.0% | 16.8% | 10.1% |
| Mitjà B — $$P_B(n)$$ | 50.0% | 25.0% | 12.5% | 6.3% |

Aquestes probabilitats exactes són la peça bàsica amb què es construirà tota la resta de l'article, començant per la cobertura conjunta a 1+.


## Cobertura conjunta a 1+

La manera més senzilla de calcular la cobertura conjunta no és sumar les zones que se solapen (cosa que es complica ràpidament amb més de dos mitjans), sinó fer-ho pel camí invers: calcular quina part de la població **no ha estat exposada a cap dels dos mitjans**, i aplicar-hi la regla del complementari.

La probabilitat de no haver vist cap dels dos mitjans és, senzillament, el producte de $$P_A(0)$$ i $$P_B(0)$$, les probabilitats exactes de 0 impactes calculades a l'apartat anterior:

$$P(\text{Cap dels dos}) = P_A(0) \times P_B(0)$$

I la cobertura conjunta a 1+ (haver vist com a mínim un dels dos mitjans) és el seu complementari:

$$C_{1+} = 1 - \left[P_A(0) \times P_B(0)\right]$$

*Amb els valors de la taula:*

$$C_{1+} = 1 - (0.30 \times 0.50) = 1 - 0.15 = 0.85$$

La cobertura conjunta és del 85%, no del 120% que donaria la suma directa. El 15% restant és la gent que, per pur atzar estadístic, no ha topat amb cap dels dos mitjans.

El diagrama següent il·lustra la idea amb un diagrama de Venn: els dos cercles són la cobertura de cada mitjà, la zona compartida és la gent exposada a tots dos, i tot el que queda fora dels cercles és exactament aquell 15% que el càlcul ha aïllat.

<div style="width: 100%; max-width: 620px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: center;">
<svg viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg" style="max-width: 100%; height: auto;">
  <rect x="10" y="10" width="540" height="380" fill="none" stroke="#cbd5e1" stroke-width="1.5" rx="8"/>
  <circle cx="253" cy="205" r="120" fill="#3b82f6" fill-opacity="0.28" stroke="#3b82f6" stroke-width="2"/>
  <circle cx="325" cy="205" r="101" fill="#ef4444" fill-opacity="0.28" stroke="#ef4444" stroke-width="2"/>
  <text x="60" y="55" font-family="-apple-system, sans-serif" font-size="15" font-weight="600" fill="#1e293b" text-anchor="start">Mitjà A (70%)</text>
  <text x="500" y="55" font-family="-apple-system, sans-serif" font-size="15" font-weight="600" fill="#1e293b" text-anchor="end">Mitjà B (50%)</text>
  <text x="289" y="200" font-family="-apple-system, sans-serif" font-size="14" fill="#1e293b" text-anchor="middle">A i B</text>
  <text x="289" y="220" font-family="-apple-system, sans-serif" font-size="13" fill="#475569" text-anchor="middle">35%</text>
  <text x="195" y="200" font-family="-apple-system, sans-serif" font-size="13" fill="#1e293b" text-anchor="middle">Només A</text>
  <text x="195" y="218" font-family="-apple-system, sans-serif" font-size="12" fill="#475569" text-anchor="middle">35%</text>
  <text x="385" y="200" font-family="-apple-system, sans-serif" font-size="13" fill="#1e293b" text-anchor="middle">Només B</text>
  <text x="385" y="218" font-family="-apple-system, sans-serif" font-size="12" fill="#475569" text-anchor="middle">15%</text>
  <text x="289" y="365" font-family="-apple-system, sans-serif" font-size="13" fill="#64748b" text-anchor="middle">Cap dels dos: 15%</text>
</svg>
<p style="font-size: 12px; color: #64748b; margin-top: 8px;">Cobertura conjunta a 1+ = tota la població menys la zona blanca (ningú exposat)</p>
</div>


## Cobertura conjunta a 2+ contactes

Amb les probabilitats exactes de cada mitjà, es pot calcular quina part de la població ha rebut **com a mínim dos** impactes combinant els dos mitjans. Igual que abans, és més fàcil calcular-ho pel camí invers: la gent que ha rebut 0 impactes o exactament 1, restada de 100%.

$$C_{2+} = 1 - P(\text{0 impactes}) - P(\text{Exactament 1 impacte})$$

El primer terme ja es coneix: $$P(\text{0}) = P_A(0) \times P_B(0) = 0.15$$. El segon és exactament l'exemple de la regla de la suma explicat més amunt: hi ha dos camins excloents cap a "exactament 1 impacte combinat" —rebre l'únic impacte del mitjà A i cap del B, o a l'inrevés— i per tant se sumen:

$$P(\text{Exactament 1}) = \left[P_A(1) \times P_B(0)\right] + \left[P_A(0) \times P_B(1)\right]$$

*Amb els valors de la taula:*

$$P(\text{Exactament 1}) = (0.28 \times 0.50) + (0.30 \times 0.25) = 0.14 + 0.075 = 0.215$$

$$C_{2+} = 1 - 0.15 - 0.215 = 0.635$$

Un 63.5% de la població ha rebut com a mínim dos impactes combinats entre els dos mitjans.


## Cobertura conjunta a 3+ contactes (i més)

El mateix principi s'estén a 3+: cal restar de 100% la gent que ha rebut 0, exactament 1, o exactament 2 impactes combinats.

$$C_{3+} = 1 - P(\text{0}) - P(\text{Exactament 1}) - P(\text{Exactament 2})$$

Els dos primers termes ja s'han calculat a l'apartat anterior. El tercer, exactament 2 impactes combinats, té ara **tres** camins excloents: els dos impactes venen tots del mitjà A, tots del mitjà B, o un de cada. Per la regla de la suma, se sumen els tres:

$$P(\text{Exactament 2}) = \left[P_A(2) \times P_B(0)\right] + \left[P_A(0) \times P_B(2)\right] + \left[P_A(1) \times P_B(1)\right]$$

*Amb els valors de la taula:*

$$P(\text{Exactament 2}) = (0.168 \times 0.50) + (0.30 \times 0.125) + (0.28 \times 0.25) = 0.084 + 0.0375 + 0.07 = 0.1915$$

$$C_{3+} = 1 - 0.15 - 0.215 - 0.1915 = 0.4435$$

Un 44.4% de la població ha rebut com a mínim tres impactes combinats. A mesura que el nivell de freqüència exigit puja, el nombre de camins excloents que cal enumerar creix (per a "exactament 2" n'hi havia 3, per a "exactament 3" n'hi hauria 4, i així successivament), però el principi és sempre el mateix: enumerar totes les combinacions possibles d'impactes de cada mitjà que sumen el total exacte, sumar-les per la regla de la suma, i restar-ho tot de 100%.


## Combinació de més de dos mitjans

Tot el que s'ha explicat fins ara és vàlid per a dos mitjans, però la mateixa lògica es pot encadenar per a tres, quatre o els que calguin, sempre assumint independència entre tots ells. La manera més senzilla de fer-ho és no intentar combinar-los tots alhora, sinó fer-ho **de dos en dos, de manera acumulativa**:

1. Es calcula la cobertura conjunta dels mitjans A i B, tal com s'ha explicat més amunt. Aquest resultat es tracta com si fos un "mitjà combinat" nou, amb la seva pròpia cobertura.
2. Es combina aquest resultat amb el mitjà C, fent servir exactament la mateixa fórmula (com si C fos el "segon mitjà" d'un nou parell).
3. Si hi ha un quart mitjà D, es repeteix el pas amb el resultat acumulat fins llavors, i així successivament amb tots els mitjans que calgui afegir.

Aquesta manera d'anar acumulant parells és matemàticament equivalent a calcular-ho tot alhora, i té l'avantatge de ser molt més fàcil de programar i d'entendre pas a pas.

*Exemple amb tres mitjans (cobertura a 1+):* $$C_A = 0.70$$, $$C_B = 0.50$$, $$C_C = 0.30$$

Pas 1 (A + B, ja calculat més amunt): $$C_{AB} = 0.85$$

Pas 2 (AB + C):

$$C_{ABC} = 1 - \left[(1 - 0.85) \times (1 - 0.30)\right] = 1 - (0.15 \times 0.70) = 1 - 0.105 = 0.895$$

La cobertura conjunta dels tres mitjans és del 89.5%, sempre inferior a la suma directa (que donaria un impossible 150%).


## Suma de cobertures a qualsevol nivell de GRPs

Aquestes idees es poden connectar amb el model de decaïment geomètric explicat a l'[article sobre la cobertura N+ a partir dels GRPs totals]({{ site.baseurl }}/entrades/cobertura-nplus-grps/), o amb les fórmules de construcció de cobertures esmentades a l'[article sobre models de saturació (Hill i Logística de Nelder)]({{ site.baseurl }}/entrades/logistica-nelder-hill/): si per a cada mitjà es coneix la fórmula que relaciona els GRPs amb la cobertura a 1+, i a la vegada es pot estimar la cobertura a qualsevol nivell de freqüència, es pot generar la taula de cobertura conjunta de tots els mitjans combinats **per a qualsevol combinació de GRPs**, no només per al punt concret observat en un estudi.

Si addicionalment es coneix el cost per GRP de cada mitjà, aquesta combinació de fórmules permet plantejar un problema d'optimització de pressupost: repartir una inversió total entre els mitjans disponibles de manera que es maximitzi la cobertura conjunta al nivell de freqüència que es consideri efectiu (per exemple, 3+), en lloc de limitar-se a maximitzar la cobertura a 1+ de cada mitjà per separat.

El gràfic següent mostra les corbes de cobertura N+ del Mitjà A i el Mitjà B de l'exemple, junt amb la corba de la cobertura **conjunta**, calculada nivell a nivell amb la descomposició explicada més amunt. La corba conjunta queda sempre per sobre de les individuals a cada nivell de freqüència, però mai arriba a ser-ne la suma directa.

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficCobertoraNplus" width="800" height="450"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    var etiquetes = ['1+', '2+', '3+', '4+', '5+', '6+'];
    var mitjaA   = [70.0, 42.0, 25.2, 15.1, 9.1, 5.4];
    var mitjaB   = [50.0, 25.0, 12.5, 6.3, 3.1, 1.6];
    var conjunta = [85.0, 63.5, 44.4, 29.7, 19.4, 12.4];

    var ctx = document.getElementById('graficCobertoraNplus').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetes,
            datasets: [
                { label: 'Mitjà A (sol)', data: mitjaA, borderColor: '#3b82f6', borderWidth: 2.5, pointRadius: 3, fill: false, tension: 0.1 },
                { label: 'Mitjà B (sol)', data: mitjaB, borderColor: '#ef4444', borderWidth: 2.5, pointRadius: 3, fill: false, tension: 0.1 },
                { label: 'Cobertura conjunta A+B', data: conjunta, borderColor: '#10b981', borderWidth: 3, pointRadius: 3, fill: false, tension: 0.1 }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } }
            },
            scales: {
                x: { title: { display: true, text: 'Nivell de freqüència (N+)', font: { weight: 'bold' } } },
                y: { title: { display: true, text: 'Cobertura (%)', font: { weight: 'bold' } }, min: 0, max: 100 }
            }
        }
    });
});
</script>


## Una aproximació matemàtica, no la realitat

Tot aquest desenvolupament és estadística aplicada, no la realitat exacta del consum de mitjans. La independència entre mitjans és una simplificació: en la pràctica, qui consumeix molta televisió sovint també consumeix més (o menys) digital del que li tocaria per pur atzar, perquè hi ha factors comuns (edat, hàbits, disponibilitat de temps) que correlacionen el consum de diversos mitjans alhora.

Malgrat aquesta limitació, quan no es disposa de dades de panell creuades entre mitjans —que no sempre estan disponibles— aquest model probabilístic és una molt bona aproximació amb molt poca informació de partida: només calen les cobertures individuals de cada mitjà.


## Calculadora

Per no haver de fer aquests càlculs a mà, es pot fer servir la <a href="{{ site.baseurl }}/eines/suma_cobertura.html" target="_blank" rel="noopener">Calculadora de Suma de Cobertures</a>, que combina automàticament la cobertura de diversos mitjans assumint independència. Aquesta eina calcula únicament la cobertura conjunta a 1+; per a nivells superiors (2+, 3+...) cal aplicar manualment la descomposició per trams explicada en aquest article.
