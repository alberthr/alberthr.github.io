---
layout: post
title: "El Mètode de Montecarlo. El Poder de l'Atzar"
tags: 
  - estadistica
---

Quan ens enfrentem a un problema matemàtic o estadístic tan complexe on calcular la solució es directament impossible, quan les fórmules tradicionals fallen, hi ha una estratègia que gairebé sembla trampa, però que està fonamentada en la matemàtica: **si no ho pots calcular, simula-ho milers de vegades.** Aquesta manera de fer s'anomenta el **Mètode de Montecarlo**.

## Què és el Mètode de Montecarlo?

El Mètode de Montecarlo és una tècnica estadística que utilitza la **generació de nombres aleatoris** per resoldre problemes que poden ser deterministes o probabilístics. El nom prové del Casino de Mònaco, fent al·lusió a la ruleta i als jocs d'atzar, i va ser batejat aixi pels científics John von Neumann, Stanislaw Ulam i Nicholas Metropolis als anys 40, mentre treballaven en el Projecte Manhattan.

La premissa és senzilla: en lloc de resoldre una equació complexa de manera analítica, utilitzem l'atzar per "experimentar" amb el model milions de vegades. Gràcies a la **Llei dels Grans Nombres**, sabem que a mesura que augmentem el nombre de simulacions, la mitjana dels resultats obtinguts convergirà cap a la solució real.

## Per a què serveix i quines aplicacions té?

Aquest mètode és una autèntica "navalla suís" en la ciència de dades i s'utilitza principalment per a:

* **Estimació de probabilitats complexes:** Calcular el risc d'una cartera d'inversions o la probabilitat de fallada d'un sistema d'enginyeria.
* **Integració numèrica:** Calcular àrees o volums sota corbes matemàtiques on la integral no té una solució tancada.
* **Optimització:** Trobar la millor configuració d'un sistema simulant diferents escenaris i avaluant quin dona el millor resultat.
* **Predicció d'estocs i logística:** Simular cadenes de subministrament o la demanda de productes sota condicions d'alta variabilitat.

---

## Un exemple clàssic: Estimació de $\pi$

La millor manera d'entendre Montecarlo és amb un exemple visual clàssic: **calcular el valor del número $\pi$** fent servir només llançaments de dards aleatoris.

Imagina un quadrat de costat $2r$ que conté un cercle inscrit de radi $r$. Si llançem "dards" de manera completament aleatòria dins del quadrat, la probabilitat que caiguin dins del cercle depèn de la relació entre les seves àrees:

<center>$\frac{\text{Àrea del cercle}}{\text{Àrea del quadrat}} = \frac{\pi r^2}{(2r)^2} = \frac{\pi}{4}$</center>

Per tant, si simulem milers de punts aleatoris, podem estimar $\pi$ com:

<center>$\pi \approx 4 \times \frac{\text{Punts dins del cercle}}{\text{Punts totals}}$</center>

### 🐍 Implementació en Python

Utilitzant `numpy`, podem vectoritzar aquesta simulació per fer-la extremadament ràpida.

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

### 📊 Implementació en R

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
