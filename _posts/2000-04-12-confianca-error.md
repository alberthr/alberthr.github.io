---
layout: post
title: "Nivell de confiança i marge d'error: Diferències i relació matemàtica"
tags:
  - estadistica
excerpt: "Anàlisi conceptual i formal de la diferència entre el nivell de confiança i el marge d'error en l'estadística inferencial, avaluant-ne la dependència mútua i l'impacte en la mida de la mostra."
---

En l'àmbit de l'estadística inferencial i l'anàlisi de dades, la correcta interpretació dels intervals de confiança és fonamental per evitar conclusions errònies. Com ja es va analitzar en l'article sobre el *Bootstrapping* en aquest mateix blog, l'estimació de paràmetres poblacionals a partir de mostres requereix mètodes que quantifiquin la incertesa. Dins d'aquest procés, el **nivell de confiança** i el **marge d'error** són dos conceptes estretament vinculats, però conceptualment diferents, que sovint es confonen o s'utilitzen de manera errònia com a sinònims.

Aquest article defineix ambdós conceptes, en detalla la relació matemàtica i analitza l'equilibri necessari que cal mantenir entre precisió i fiabilitat.

---

## Definició conceptual

Per il·lustrar la diferència, es pot considerar un cas pràctic: una enquesta de satisfacció interna on la mitjana obtinguda de la mostra és de **75 punts sobre 100**, especificant un **marge d'error del 3%** i un **nivell de confiança del 95%**.

### 1. El Marge d'Error (Precisió)

El **marge d'error** determina l'extensió de l'interval al voltant de l'estimador puntual (la mitjana de la mostra). Representa la quantitat màxima que es preveu que el resultat de la mostra difereixi del valor real de la població.

* En el cas esmentat, un marge d'error de 3 punts defineix un radi de seguretat.
* L'interval de confiança resultant s'estableix formalment entre $75 - 3$ i $75 + 3$, és a dir, l'interval **[72, 78]**.

El marge d'error és, per tant, una mesura de la **precisió** de l'estimació. Com més estret és aquest marge, més precisa és la forquilla de valors calculada.

### 2. El Nivell de Confiança (Fiabilitat del procés)

El **nivell de confiança** no indica la probabilitat que un interval concret contingui el paràmetre poblacional. Un cop calculat l'interval [72, 78], aquest conté la mitjana real o no la conté (la probabilitat és 1 o 0). 

El percentatge (per exemple, el 95%) fa referència a la **fiabilitat del mètode de mostreig a llarg termini**. Significa que si es repetís el procés de selecció de la mostra i el càlcul de l'interval 100 vegades sota les mateixes condicions:

* **95 de cada 100 intervals generats contindrien el paràmetre real** de la població.
* 5 d'aquests intervals fallarien i quedarien fora del valor real.

El nivell de confiança mesura la **seguretat estadística de l'algorisme o mètode** emprat per acotar la incertesa.

---

## Relació matemàtica i dependència

La connexió entre ambdós elements es regeix per fórmules estadístiques determinades. Per a l'estimació d'una mitjana poblacional en una distribució normal, la fórmula del marge d'error ($ME$) s'expressa com:

$$ME = z \cdot \frac{\sigma}{\sqrt{n}}$$

On:
* $z$ és el valor crític de la distribució normal estàndard, directament determinat pel **nivell de confiança** (per a un 95% de confiança, $z \approx 1,96$; per a un 99%, $z \approx 2,58$).
* $\sigma$ és la desviació estàndard de la població (variabilitat intrínseca de les dades).
* $n$ es correspon amb la mida de la mostra.

### L'equilibri en el disseny experimental

L'equació demostra que hi ha una dependència mútua entre les variables que obliga a fer concessions de disseny:

1. **L'augment de la confiança penalitza la precisió:** Si es desitja augmentar el nivell de confiança (del 95% al 99%) sense modificar la mostra, el valor crític $z$ s'eleva. Com que actua com a multiplicador, el marge d'error ($ME$) s'amplia de manera automàtica. Un interval més segur requereix ser més ample, perdent precisió.
2. **L'optimització del marge d'error requereix més dades:** L'única variable matemàtica que permet reduir el marge d'error (estrènyer l'interval) mantenint el mateix nivell de confiança és la mida de la mostra ($n$). Atès que es troba al denominador com a arrel quadrada ($\sqrt{n}$), per reduir el marge d'error a la meitat és necessari quadruplicar el volum de la mostra.

---

## Resum de diferències

| Mètrica | Marge d'Error | Nivell de Confiança |
| :--- | :--- | :--- |
| **Dimensió analitzada** | Mesura la **precisió** (mida de l'interval). | Mesura la **fiabilitat** (percentatge d'èxit del mètode). |
| **Expressió formal** | Unitats de la variable o percentatges ($\pm 3\%$). | Percentatge de probabilitat teòrica ($95\%$, $99\%$). |
| **Objectiu en l'experiment** | Minimitzar-lo tant com sigui possible. | Maximitzar-lo tant com sigui possible. |
| **Efecte de modificació** | Reduir-lo sense variar la $n$ rebaixa la confiança. | Augmentar-lo amplia l'interval (marge d'error). |

## Conclusió

El disseny de qualsevol prova o anàlisi estadística implica un intercanvi rigorós entre el nivell de confiança acceptat i el marge d'error tolerable. No és possible establir valors arbitraris de màxima precisió i màxima fiabilitat de manera gratuïta; la viabilitat del càlcul dependrà directament del volum de dades capturat en la mostra ($n$).