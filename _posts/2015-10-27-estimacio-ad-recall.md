---
layout: post
title: "Ad Recall Global: El vincle entre el R&F i l'eficiència creativa"
tags: 
  - publicitat
  - matematiques
excerpt: "Anàlisi de la doble transició metodològica en l'Ad Recall. Des de com estimar el record global a partir de la probabilitat individual i les corbes d'abast (R&F), fins a l'exercici invers: aïllar la 'p' intrínseca de l'anunci per avaluar i classificar l'eficàcia creativa de manera objectiva."
---

En la planificació de mitjans publicitaris, l'avaluació de l'èxit d'una campanya sovint es limita a mètriques de pressió i abast, com ara els GRPs (*Gross Rating Points*) o la Cobertura (*Reach*). No obstant això, aquests indicadors només mesuren l'exposició potencial, no l'impacte real en la memòria del consumidor. Per avaluar aquest impacte, el mercat recorre habitualment a l'**Ad Recall o Record Suggerit (Aided Ad Recall)** mitjançant estudis de post-test.

Per treure el màxim suc d'aquesta mètrica, l'analítica moderna requereix un enfocament bidireccional. D'una banda, hem de ser capaços de **predir el record global** d'una campanya combinant el comportament probabilístic individual amb la distribució de mitjans. De l'altra, hem de poder fer el camí invers: **utilitzar el record mesurat per aïllar la probabilitat neta de record ($p$)**, netejant l'efecte del pressupost per auditar de manera homogènia la qualitat de la peça creativa.


## Part 1: L'enfocament directe (De l'individu al mercat)

### El comportament individual: Probabilitat complementària
Per entendre el record global, cal començar pel comportament d'un sol individu. Si definim $p$ com la probabilitat que té una persona de recordar un anunci després d'un sol impacte (de 0 a 1), podem modelitzar la seva reacció davant successives exposicions.

En tractar-se de **record suggerit**, on l'estímul reactiva la memòria latent, s'assumeix independència en els impactes i un desgast (*wear-out*) pràcticament nul. La probabilitat de recordar l'anunci després de $n$ exposicions es calcula mitjançant la **probabilitat complementària** (1 menys la certesa de no recordar-lo cap vegada):

$$P(\text{Record} \mid n) = 1 - (1 - p)^n$$

*Exemple de creixement (amb $p = 0.30$):*
* **1 impacte ($n=1$):** $1 - (0.70)^1 = \mathbf{30\%}$ de probabilitat de record.
* **2 impactes ($n=2$):** $1 - (0.70)^2 = 1 - 0.49 = \mathbf{51\%}$ de probabilitat de record.
* **3 impactes ($n=3$):** $1 - (0.70)^3 = 1 - 0.343 = \mathbf{65.7\%}$ de probabilitat de record.

### El mètode manual: Distribució per trams de freqüència (R&F)
Per traslladar aquest comportament a la població, el mètode tradicional requereix conèixer la distribució de la corba de Cobertura i Freqüència (R&F). Si es disposa dels GRPs i del Reach (en format decimal, ex: 0.80 per al 80%), es pot estimar el percentatge de població assolit a cada tram de freqüència eficaç ($n+$) mitjançant models simplificats derivats d'Agostini:

$$\text{Cobertura}(n+) \approx \text{Reach} \times \left(1 - \frac{\text{Reach}}{\text{GRPs}}\right)^{n-1}$$

Un cop calculat el volum exacte de població que pertany a cada segment de freqüència sencer ($R_n$), el record total s'estima de manera matricial sumant les aportacions:

$$\text{Record Total (Manual)} = \sum_{n=1}^{\infty} R_n \times [1 - (1 - p)^n]$$

### La drecera: Model de Saturació Racional
A la pràctica, transformacions algebraiques —que converteixen les relacions logarítmiques en funcions lineals inverses— ens permeten esquivar el desglossament manual mitjançant el **Model de Saturació Racional** (equació d'estil Hill o Michaelis-Menten). Si introduïm el Reach com a valor sencer (0-100), els GRPs absoluts i la $p$ com a decimal, la fórmula és directa:

$$\text{Record Total} = \text{Reach} \times \left[ 1 - \frac{1}{\left(\frac{\text{GRPs}}{\text{Reach}}\right) \cdot \left(\frac{p}{1-p}\right) + 1} \right]$$

*Exemple pràctic de predicció:* Una campanya llança 400 GRPs, un Reach de 80 i compta amb una peça que estimem té una $p = 0.30$.
1. Freqüència mitjana = $400 / 80 = 5$
2. Ràtio de probabilitat (*Odds*) = $0.30 / (1 - 0.30) = 0.42857$
3. Factor d'impacte = $5 \times 0.42857 = 2.14285$
4. Índex de record net = $1 - [1 / (2.14285 + 1)] = 0.68181$
5. Multiplicació pel Reach = $80 \times 0.68181 = \mathbf{54.54\%}$ de record total estimat.


## Part 2: L'enfocament invers (Del mercat a la creativitat)

Sense el model directe anterior seria impossible fer l'exercici contrari, que a la pràctica és fins i tot més rellevant. En l'entorn real, el dada que tenim a priori és l'Ad Recall del post-test i el pressupost executat, mentres que la $p$ de l'anunci és la gran incògnita. 

### El gir algebraic per calcular la $p$
Si girem l'equació de saturació per aïllar la variable $p$, podem obrir la "caixa negra" de l'eficiència creativa. Per simplificar el càlcul, definim primer dues variables de tancament:
1. **Freqüència Mitjana ($\mu$):** $\mu = \frac{\text{GRPs}}{\text{Reach}}$
2. **Índex de Record Net dins la Cobertura ($\alpha$):** $\alpha = \frac{\text{Record Total}}{\text{Reach}}$

Resolent de manera inversa, la fórmula definitiva configurada per aïllar la $p$ queda així:

$$p = \frac{\alpha}{\mu \cdot (1 - \alpha) + \alpha}$$

### Cas Pràctic: Classificació i rànquing d'eficiència
Aquest gir ens permet fer comparatives homogènies. Imagineu dues campanyes:
* **Campanya A:** 500 GRPs | Reach = 80 | Ad Recall post-test = 55%
* **Campanya B:** 180 GRPs | Reach = 60 | Ad Recall post-test = 42%

A primera vista, la Campanya A té més record absolut. Però si calculem la seva $p$ netejant l'efecte de la inversió:
* **Campanya A:** $\mu = 6.25$ ; $\alpha = 0.6875 \implies p = \frac{0.6875}{6.25 \cdot (1 - 0.6875) + 0.6875} = \mathbf{0.26}$
* **Campanya B:** $\mu = 3.00$ ; $\alpha = 0.7000 \implies p = \frac{0.7000}{3.00 \cdot (1 - 0.7000) + 0.7000} = \mathbf{0.437}$

**Resultats:** Tot i tenir menys record absolut, la peça de la **Campanya B és un "killer" creatiu**. Té una probabilitat d'impacte del 43.7% davant del 26% de la Campanya A. Aquest càlcul ens permet mesurar l'èxit real de l'agència de publicitat sense el biaix dels diners dipositats en mitjans.


## Modelització Avançada de la $p$

Un cop recollit l'històric de valors de $p$ obtinguts en diferents post-tests, podem fer un pas més i construir models predictius per estimar el valor de la $p$ segons les variables de contingut abans de llançar la campanya:

$$p = f(\text{Format}) + f(\text{Creativitat}) + f(\text{Context}) + \epsilon$$

* **Mix de Formats:** Assignació de pesos segons la naturalesa visual (ex: spots de 30\" vs 10\", o formats digitals *skippable* vs *non-skippable*).
* **Saturació (*Clutter*):** Penalització de la $p$ si s'emet en blocs publicitaris densos que dilueixen la capacitat de retenció de la ment humana.
* **Atributs Creatius:** Indicadors qualitatius com la presència de marca en els primers 3 segons, l'ús de música coneguda, rostres cèlebres o girs d'humor i emotivitat.
* **Afinitat del Target:** El nivell d'alineació de la planificació; com més afí sigui el segment de població assolit, més alta serà la $p$ orgànica d'aixecar el record.


## Conclusió

L'anàlisi quantitativa de l'Ad Recall no pot ser unidireccional. La unió de l'enfocament directe i l'enfocament invers tanca el cercle analític de la publicitat: el primer ens dona la capacitat de predir i planificar escenaris teòrics de record, mentre que el segon transforma els resultats reals de post-test en mètriques pures d'auditoria creativa, permetent-nos classificar les nostres campanyes sota un mateix raser de ciència i eficiència.