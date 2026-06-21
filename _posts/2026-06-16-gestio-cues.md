---
layout: post
title: "Estimat de cues màximes en paral·lel: Com optimitzar les caixes d'un supermercat"
tags:
  - estadistica
  - cues
---

Quan pensem en l'eficiència d'un supermercat, un dels moments critics als que ens podem enfrentar es: **la cua de caixes**. Com a analistes, sovint ens trobem amb el repte de predir o estimar quina serà la longitud màxima d'una cua en un interval de temps determinat.

Cas pràctic: un escenari d'un interval de **2000 segons** on tenim **dues caixes obertes simultàniament**. A partir de les dades de tiquets i la seva variància, veurem com podem modelar el comportament de les cues.

Imaginem que hem monitorat el sistema durant un període que ha durat $T = 2000$ segons. En aquest temps, hem recollit les següents mètriques de rendiment:

| Mètrica | Caixa 1 | Caixa 2 |
| :--- | :--- | :--- |
| **Tiquets totals ($N$)** | 22 tiquets | 26 tiquets |
| **Variància del servei ($\sigma^2$)** | 2800 $s^2$ | 1300 $s^2$ |


## Com calculem la cua màxima?

Per estimar quants clients s'han arribat a acumular com a màxim en la cua durant aquests 2000 segons, aplicarem de manera seqüencial la **Teoria de Cues per a servidors en paral·lel**.


### Pas 1: Calcular les taxes i els temps mitjans de servei ($\mu$)
El primer que necessitem és saber quant de temps triga, de mitjana, cada caixa a atendre un client. Dividim el temps total ($T = 2000$ s) entre el nombre de tiquets de cada caixa:

* **Caixa 1:** $\mu_1 = \frac{2000 \text{ segons}}{22 \text{ tiquets}} \approx 90.91 \text{ s/client}$
    La seva taxa de servei és $\mu_{taxa1} = \frac{1}{90.91} \approx 0.0110 \text{ clients/s}$.
  
* **Caixa 2:** $\mu_2 = \frac{2000 \text{ segons}}{26 \text{ tiquets}} \approx 76.92 \text{ s/client}$
    La seva taxa de servei és $\mu_{taxa2} = \frac{1}{76.92} \approx 0.0130 \text{ clients/s}$.


### Pas 2: Determinar la variabilitat de cada caixa (Coeficient de Variació)
La variabilitat és la responsable real de la creació de cues. Si tothom trigués exactament el mateix, les cues serien gairebé inexistents. El **Coeficient de Variació ($C_v$)** mesura la desviació estàndard en relació amb la mitjana ($C_v = \frac{\sigma}{\mu}$):

* **Caixa 1:** La seva desviació és $\sigma_1 = \sqrt{2800} \approx 52.92$ segons.
    $C_{v1} = \frac{52.92}{90.91} \approx 0.582$
  
* **Caixa 2:** La seva desviació és $\sigma_2 = \sqrt{1300} \approx 36.06$ segons.
    $C_{v2} = \frac{36.06}{76.92} \approx 0.469$

Com que ambdós $C_v$ són menors que 1, sabem que el servei és més regular que una distribució aleatòria exponencial (on $C_v = 1$), però la Caixa 1 té fluctuacions més altes (tiquets molt llargs combinats amb tiquets molt curts).


### Pas 3: Calcular la utilització del sistema ($\rho$) i les dades agrupades
En aquest interval, el supermercat ha absorbit un total de $22 + 26 = 48$ clients. Això significa que el sistema ha estat funcionant de mitjana a una intensitat de trànsit molt alta. En sistemes quasi-saturats de curta durada, aproximem la utilització global ($\rho$) basant-nos en la capacitat utilitzada de les caixes obertes:

* **Temps mitjà de servei combinat ($\mu_s$):** Ponderat pels tiquets de cada caixa:
    $\mu_s = \frac{(22 \cdot 90.91) + (26 \cdot 76.92)}{48} = \frac{2000 + 2000}{48} \approx 83.33 \text{ s/client}$
  
* **Variància combinada ($C_s^2$):** Fem la mitjana ponderada dels coeficients de variació al quadrat (les seves variàncies relatives):
    $C_s^2 = \frac{22 \cdot (0.582)^2 + 26 \cdot (0.469)^2}{48} = \frac{22 \cdot 0.339 + 26 \cdot 0.220}{48} \approx 0.274$


### Pas 4: Estimar la cua mitjana en el sistema ($L_q$) mitjançant l'aproximació de Kingman
L'equació de Kingman per a múltiples servidors (model $G/G/2$) ens dona la longitud mitjana de la cua esperada quan el sistema està en un règim d'alta demanda ($\rho \approx 0.90$ en moments punta simulats d'arribades):

$L_q \approx \frac{\rho^2}{1-\rho} \cdot \frac{C_a^2 + C_s^2}{2} \cdot \frac{1}{2}$

Assumint unes arribades de clients relativament estables (per exemple, $C_a^2 \approx 0.5$ de tipus de trànsit regular de supermercat) i una utilització real en hora punta del $90\%$ ($\rho = 0.90$):

$L_q \approx \frac{0.81}{0.10} \cdot \frac{0.5 + 0.274}{2} \cdot \frac{1}{2} = 8.1 \cdot 0.387 \cdot 0.5 \approx 1.57 \text{ clients en cua de mitjana}$

De mitjana, hi ha un o dos clients esperant. Però... quin ha estat el **pic màxim** absolut en aquests 33 minuts?


### Pas 5: Càlcul de la Cua Màxima ($Q_{max}$) amb Teoria de Valors Extrems
La cua mitjana ens dona l'estat constant, però la cua fluctua constantment com una ona. La desviació estàndard de la longitud de la cua en aquests models es pot aproximar per $\sigma_{cua} \approx \sqrt{L_q(1 + L_q)} = \sqrt{1.57 \cdot 2.57} \approx 2.01$.

Per trobar el valor màxim en un interval determinat on s'han generat 48 esdeveniments, apliquem el factor de creixement de valors extrems (basat en la distribució de Gumbel), que ens diu que el pic màxim se sol trobar a unes $2.5$ o $3$ desviacions estàndard per sobre de la mitjana en períodes curts d'alta variabilitat:

$Q_{max} = L_q + (2.5 \cdot \sigma_{cua})$
$Q_{max} = 1.57 + (2.5 \cdot 2.01) = 1.57 + 5.025 = 6.595 \approx \mathbf{6-7 \text{ clients}}$

---

## Resultats

El resultat ens diu que, tot i que de mitjana la cua fos molt gestionable (només 1.5 persones de mitjana), l'alta variància de la Caixa 1 (provocada segurament per algun client amb una incidència o un carro excessivament ple) va generar un **coll d'ampolla temporal**. 

En el moment crític de l'interval de 2000 segons, **es va arribar a registrar un pic màxim de 6 o 7 clients esperant en la cua conjunta**. 

---

## ⚠️ Sabem del cert que no hi havia 100 persones fent cua?

**Amb els logs de tiquets a la mà, no ho podem saber al 100%.** Perquè la fórmula de Kingman siguin vàlida, hem hagut d'aplicar una premissa fonamental: Assumim que el supermercat no està col·lapsat en cap moment i que la taxa d'arribada de clients és igual a la taxa de sortida ($\lambda = \mu$).

### Què passaria si estiguéssim equivocats?
Si la botiga hagués estat desbordada amb una cua de 100 persones:
1. Les fórmules de Kingman **deixen de ser vàlides** (ja que el sistema seria inestable).
2. El nombre de tiquets (22 i 26) no reflectiria la demanda de la gent, sinó el **límit de velocitat humana** dels dos caixers treballant sota estrès màxim.

### Conlusio
Les dades de tiquets són un bon inici, però per validar si la nostra cua promig d'1.78 clients o la màxima de 6 són reals, sempre s'ha de contrastar el model numèric amb una validació externa (com ara els sensors de pas de la porta o un mostreig visual de les càmeres). La matemàtica ens ajuda a estimar, però la realitat es a dins del punt de venta.
