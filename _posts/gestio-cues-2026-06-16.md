---
layout: post
title: "Estimat de cues màximes en paral·lel: Com optimitzar les caixes d'un supermercat"
tags:
  - estadistica
  - cues
---

Quan pensem en l'eficiència d'un supermercat, el moment crític sempre és el mateix: **la cua de caixes**. Com a enginyers de dades o analistes d'operacions, sovint ens trobem amb el repte de predir o estimar quina serà la longitud màxima d'una cua en un interval de temps determinat. 

Avui analitzarem un cas pràctic: un escenari real d'un interval de **2000 segons** on tenim **dues caixes obertes simultàniament**. A partir de les dades de tiquets i la seva variància, veurem com podem modelar el comportament de les cues.


## Les Dades del Problema

Imaginem que hem monitorat el sistema durant un període de tancament de caixa o hora punta que ha durat exactament $T = 2000$ segons. En aquest temps, hem recollit les següents mètriques de rendiment:

| Mètrica | Caixa 1 | Caixa 2 |
| :--- | :--- | :--- |
| **Tiquets totals ($N$)** | 22 tiquets | 26 tiquets |
| **Temps mitjà de servei ($\mu$)** | 90.91 s / tiquet | 76.92 s / tiquet |
| **Variància del servei ($\sigma^2$)** | 2800 $s^2$ | 1300 $s^2$ |

*Nota: El temps mitjà s'ha calculat dividint els 2000 segons totals pel nombre de tiquets de cada caixa ($\frac{2000}{22} \approx 90.91$ i $\frac{2000}{26} \approx 76.92$).*


## Modelant el Sistema: Teoria de Cues ($M/G/2$ o $G/G/2$)

En la teoria de cues, quan tenim caixes amb variàncies conegudes que no segueixen necessàriament una distribució exponencial pura (com indica l'alta variància de la Caixa 1, possiblement deguda a clients amb carros molt plens), entrem en el terreny dels models $M/G/2$ o $G/G/2$ (on $G$ significa distribució General).

La variabilitat és l'enemic número u de l'eficiència. Encara que la Caixa 2 és més ràpida en mitjana i té menys variància, el comportament de la **cua màxima conjunta** depèn de com arriben els clients i de la desviació estàndard combinada.

### 1. El factor de variabilitat (Coeficient de Variació)
El coeficient de variació ($C_v = \frac{\sigma}{\mu}$) ens indica com d'inestable és el servei:
* **Caixa 1:** $\sigma_1 = \sqrt{2800} \approx 52.91$ s $\rightarrow C_{v1} = \frac{52.91}{90.91} \approx 0.58$
* **Caixa 2:** $\sigma_2 = \sqrt{1300} \approx 36.05$ s $\rightarrow C_{v2} = \frac{36.05}{76.92} \approx 0.47$

Com que $C_v < 1$, el servei és bastant determinista (més regular que una distribució exponencial pura, on $C_v = 1$), cosa que juga al nostre favor per evitar que la cua s'infli infinitament.


## Estimació de la Cua Màxima

Per estimar la longitud màxima de la cua en aquests 2000 segons sense una simulació pas a pas, podem recórrer a l'aproximació d'estat estacionari de **Kingman** combinada amb la distribució de valors extrems per a un interval de temps $T$.

Si assumim que el sistema ha estat funcionant a prop de la seva capacitat màxima (un total de 48 clients atesos en 2000 segons, és a dir, una taxa d'arribada d'aproximadament un client cada 41 segons), la longitud mitjana de la cua en el sistema ($L_q$) es pot aproximar per la fórmula modificada per a múltiples servidors:

$$L_q \approx \frac{\rho^2}{1-\rho} \cdot \frac{C_a^2 + C_s^2}{2}$$

On:
* $\rho$ és la utilització del sistema.
* $C_s^2$ es calcula com la mitjana ponderada de les variàncies de les dues caixes.

### El "Pic" de la cua
En un interval curt de 2000 segons (uns 33 minuts), la cua màxima sol ser el resultat d'una ràfega aleatòria d'arribades combinada amb un servei lent a la Caixa 1 (recordem que té una variància molt alta de 2800). 

Utilitzant models estocàstics de valors extrems (com la distribució de Gumbel per a màxims en processos de Poisson), s'estima que la cua màxima ($Q_{max}$) en un interval determinat sol moure's en l'interval de:

$$Q_{max} \approx L_q + 3\sigma_{cua}$$

Donades les nostres mètriques, si la taxa d'arribada hagués igualat la de servei (saturació temporal), podríem haver vist pics de **fins a 5 o 6 persones esperant simultàniament** en els moments de màxima asincronia entre la durada dels tiquets de la Caixa 1 i la Caixa 2.

---

## Conclusions i Insights de Negoci

Què ens diuen realment aquestes dades?

1. **La Caixa 1 és un coll d'ampolla latent:** Tot i haver fet només 4 tiquets menys que la Caixa 2, la seva variància és més del doble (2800 vs 1300). Això significa que el temps de procés és molt impredictible.
2. **L'efecte amortidor de la Caixa 2:** La Caixa 2 actua com a línia de drenatge ràpid. En tenir una variància baixa, garanteix un flux constant que evita que la cua combinada es col·lapsi durant els 2000 segons analitzats.

Analitzar intervals de temps tancats ens permet redimensionar els nostres recursos sense necessitat d'esperar a llargs estudis de mercat. Una simple recollida de logs de tiquets és suficient per començar a optimitzar.
