---
layout: post
title: "El Mètode de Montecarlo: Simular per Resoldre l'Irresoluble"
tags:
  - estadistica
excerpt: "Quan un problema és massa complex per resoldre's analíticament, simular-lo milers de vegades pot ser la solució. Una introducció al Mètode de Montecarlo i les seves aplicacions, amb l'exemple clàssic d'estimar el valor de π."
---

Davant d'un problema matemàtic o estadístic tan complex que calcular la solució és directament impossible, quan les fórmules tradicionals fallen, hi ha una estratègia contraintuïtiva però rigorosament fonamentada en la matemàtica: **si no es pot calcular, se simula milers de vegades.** Aquesta manera de fer s'anomena el **Mètode de Montecarlo**.

## Què és el Mètode de Montecarlo?

El Mètode de Montecarlo és una tècnica estadística que utilitza la **generació de nombres aleatoris** per resoldre problemes que poden ser deterministes o probabilístics. El nom prové del Casino de Mònaco, en al·lusió a la ruleta i als jocs d'atzar, i va ser encunyat pels científics John von Neumann, Stanislaw Ulam i Nicholas Metropolis als anys 40, mentre treballaven en el Projecte Manhattan.

La premissa és senzilla: en lloc de resoldre una equació complexa de manera analítica, s'utilitza l'atzar per "experimentar" amb el model milions de vegades. Gràcies a la **Llei dels Grans Nombres**, a mesura que augmenta el nombre de simulacions, la mitjana dels resultats obtinguts convergeix cap a la solució real.

## Per a què serveix i quines aplicacions té?

Aquest mètode és una autèntica navalla suïssa en la ciència de dades i s'utilitza principalment per a:

* **Estimació de probabilitats complexes:** calcular el risc d'una cartera d'inversions o la probabilitat de fallada d'un sistema d'enginyeria.
* **Integració numèrica:** calcular àrees o volums sota corbes matemàtiques on la integral no té una solució tancada.
* **Optimització:** trobar la millor configuració d'un sistema simulant diferents escenaris i avaluant quin dona el millor resultat.
* **Predicció d'estocs i logística:** simular cadenes de subministrament o la demanda de productes sota condicions d'alta variabilitat.
* **Inferència estadística per remostreig:** el [Bootstrapping]({% post_url 2020-11-11-intervals-bootstrapping %}) n'és un cas particular, on en lloc de simular des d'un model teòric conegut, se simula remostrejant amb reposició les pròpies dades observades per aproximar la distribució d'un estadístic.


## Implementació pràctica: Estimació de $\pi$

La millor manera d'entendre el Mètode de Montecarlo és amb un exemple visual clàssic: **estimar el valor del número $\pi$** fent servir només llançaments de dards aleatoris.

Es considera un quadrat de costat $2r$ que conté un cercle inscrit de radi $r$. Si es llancen "dards" de manera completament aleatòria dins del quadrat, la probabilitat que caiguin dins del cercle depèn de la relació entre les seves àrees:

$$\frac{\text{Àrea del cercle}}{\text{Àrea del quadrat}} = \frac{\pi r^2}{(2r)^2} = \frac{\pi}{4}$$

Per tant, simulant milers de punts aleatoris, es pot estimar $\pi$ com:

$$\pi \approx 4 \times \frac{\text{Punts dins del cercle}}{\text{Punts totals}}$$

A continuació es genera un milió de punts aleatoris dins d'un quadrat de costat 2, es compten els que cauen dins del cercle inscrit i s'aplica la fórmula anterior per estimar $\pi$, tant en Python com en R.

### Implementació en Python

Utilitzant `numpy`, es pot vectoritzar aquesta simulació per fer-la extremadament ràpida.

```python
import numpy as np

def estimar_pi_montecarlo(n_simulacions):
    # Generem coordenades X i Y aleatòries entre -1 i 1
    x = np.random.uniform(-1, 1, n_simulacions)
    y = np.random.uniform(-1, 1, n_simulacions)
    
    # Calculem la distància a l'origen (0,0)
    distancia_origen = x**2 + y**2
    
    # Comptem quants punts cauen dins del cercle de radi 1
    punts_dins = np.sum(distancia_origen <= 1)
    
    # Estimació de pi
    pi_estimat = 4 * punts_dins / n_simulacions
    return pi_estimat

# Executem la simulació amb 1 milió de punts
n = 1000000
resultat = estimar_pi_montecarlo(n)
print(f"Estimació de Pi amb {n} simulacions: {resultat}")
```

### Implementació en R

```r
estimar_pi_montecarlo <- function(n_simulacions) {
  # Generem coordenades X i Y aleatòries entre -1 i 1
  x <- runif(n_simulacions, min = -1, max = 1)
  y <- runif(n_simulacions, min = -1, max = 1)
  
  # Calculem la distància al quadrat
  distancia_origen <- x^2 + y^2
  
  # Comptem els punts dins del cercle
  punts_dins <- sum(distancia_origen <= 1)
  
  # Estimació de pi
  pi_estimat <- 4 * punts_dins / n_simulacions
  return(pi_estimat)
}

# Executem la simulació amb 1 milió de punts
n <- 1000000
resultat <- estimar_pi_montecarlo(n)
cat(sprintf("Estimació de Pi amb %d simulacions: %f\n", n, resultat))
```

## Conclusió

L'exemple de $\pi$ és senzill a propòsit, però il·lustra la idea central del Mètode de Montecarlo: quan un problema no té una solució analítica directa, o aquesta és massa complexa d'obtenir, simular-lo un nombre suficient de vegades i observar com convergeix el resultat pot ser una alternativa igual de vàlida, i sovint més senzilla d'implementar, que resoldre'l amb fórmules tancades.
