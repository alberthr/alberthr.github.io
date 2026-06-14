---
layout: post
title: "Marketin Mix Modelling (MMM): Decisions a prendre abans de començar"
tags:
  - mmm
  - publicitat
---

Abans de llançar la primera línia de codi d'un projecte de **Marketing Mix Modeling (MMM)**, tot *data scientist* s'enfronta a un full en blanc ple de dilemes estructurals. Un model MMM no és una simple regressió que es pugui automatitzar a cegues; és la traducció matemàtica de la realitat comercial d'una empresa. 

Si el model no entén com interactuen les palanques bàsiques del negoci (el preu o les botigues on es ven), o com reacciona el cervell del consumidor davant d'un anunci, els coeficients finals estaran esbiaixats. El resultat? Decisions multimilionàries d'optimització de pressupost basades en hipòtesis incorrectes.

En aquest article abordarem els tres grans dilemes inicials que definiran el rumb del teu MMM: l'estructura de la baseline, el modelatge de l'efecte de la publicitat en el temps (Ad-Stock) i la captura de l'estacionalitat.


## Baseline Aditiva vs. Baseline Multiplicativa: Com interactua el teu negoci?

La **baseline** representa les vendes orgàniques de la marca, és a dir, tot allò que es vendria sense fer publicitat. La decisió de com interconectem els seus components (preu, distribució, accions macroeconòmiques) canvia radicalment el comportament del model.

### Baseline Aditiva
En una estructura aditiva, s'assumeix que cada factor orgànic aporta una quantitat de vendes fixa, independent de la resta.

$\text{Vendes Base}_t = \beta_0 + \text{Efecte Preu}_t + \text{Efecte Distribució}_t + \text{Estacionalitat}_t$

* **Com funciona:** Si estem a l'estiu, l'estacionalitat suma 2.000 unitats fixes. Si obrim 10 botigues més (distribució), sumem unes altres 1.000 unitats fixes.
* **El dilema comercial:** No reflecteix la realitat. Si dupliques els teus punts de venda, la teva campanya d'estiu hauria de tenir un impacte molt més gran en volum absolut. En un model aditiu, els efectes es calculen en "túnels tancats", ignorant que la distribució amplifica el potencial de les temporades altes.

### Baseline Multiplicativa
En una estructura multiplicativa, els factors de la baseline actuen com a multiplicadors o ràtios percentuals els uns sobre els altres.

$\text{Vendes Base}_t = \beta_0 \cdot (\text{Preu}_t)^{\beta_1} \cdot (\text{Distribució}_t)^{\beta_2} \cdot \text{Estacionalitat}_t$

* **Com funciona:** L'estacionalitat esdevé un índex (ex: $1.3$ a l'agost, un 30% més; $0.7$ al gener, un 30% menys). 
* **Per què és superior?** Captura les sinergies de manera natural. Si la teva distribució augmenta, l'índex del 30% extra de l'estiu s'aplicarà sobre aquesta nova base de vendes més gran, escalant el pic correctament. Una pujada de preu contraurà les vendes proporcionalment a la mida del mercat actual, no com una pèrdua lineal de paquets fixos.


## Modelar el retard de la publicitat (Ad-Stock): Decay vs. Funció Gamma

Un anunci vist avui pot generar una venda demà o la setmana vinent. Aquesta memòria de marca es coneix com **Ad-Stock**. El dilema aquí és triar quina funció matemàtica descriu millor la pèrdua de record del consumidor segons el canal.


### Decay (Decaïment Geomètric de 1 paràmetre)
Assumeix que l'impacte màxim de la publicitat es produeix **immediatament** (en el mateix moment de l'exposició) i decreix de manera exponencial al llarg del temps segons un factor d'esvaïment $\alpha$ (entre 0 i 1).

$Adstock_t = X_t + \alpha \cdot Adstock_{t-1}$

* **Característiques:** És ràpida de calcular i només requereix optimitzar un únic paràmetre.
* **Quan triar-la?** Per a canals digitals i d'acció immediata (*Paid Search*, *Performance Marketing*, *Emailing*), on l'usuari fa clic i compra al moment, i el record s'esvaeix ràpidament si no es torna a impactar.

### Funció Gamma (2 paràmetres: Forma i Escala)
La funció Gamma és molt més sofisticada. Permet modelar un **efecte retardat (*lagged effect*)**. L'impacte màxim de l'anunci no té lloc el primer dia, sinó que pot assolir el seu pic uns dies o setmanes més tard, caient després de forma asimètrica.

* **Característiques:** Afegeix molta flexibilitat a la corba de record, però requereix fixar o optimitzar dos hiperparàmetres (forma i escala), incrementant la complexitat i el temps de computació del model.
* **Quan triar-la?** Per a mitjans tradicionals de construcció de marca (*TV*, *Ràdio*, *OOH / Exterior*). Un consumidor pot veure un anunci de TV dimarts, però no anirà al supermercat a comprar el producte fins dissabte. La funció Gamma captura perfectament aquest desplaçament temporal del pic de conversions.


## Com capturar l'Estacionalitat segons la teva arquitectura

Si el teu producte es ven més a l'hivern, has d'aïllar aquest patró perquè el model no atribueixi erròniament aquestes vendes orgàniques a les campanyes publicitàries que fas per Nadal. La teva estratègia d'estacionalitat dependrà de la baseline triada:

### A. Estacionalitat en Baseline Aditiva (Variables Dummy)
Si optes per la simplicitat lineal, pots incloure variables *dummy* (binàries) per a cada mes de l'any o setmana.
* **Inconvenient:** Si treballes amb dades setmanals, afegir 52 variables fictícies consumeix massa graus de llibertat del model, augmentant el risc de sobreajust (*overfitting*).

### B. Estacionalitat en Baseline Multiplicativa (Components de Fourier)
Per a models multiplicatius (linearitzats mitjançant logaritmes $\ln(Y)$), s'utilitzen **ones de Fourier** (sinus i cosinus) per crear corbes suaus que pugen i baixen harmònicament al llarg de l'any ($P = 365.25$ per a diari, o $P = 52.18$ per a setmanal).

$\text{Terme Fourier}_t = \sin\left(\frac{2\pi \cdot t}{P}\right) + \cos\left(\frac{2\pi \cdot t}{P}\right)$

* **Avantatge:** Captura patrons complexos i continus utilitzant molt poques variables (només uns quants parells de lletres), actuant com un ràtio que escala de forma dinàmica juntament amb el preu i la distribució.

### C. Descomposició STL Prèvia
Una alternativa cada vegada més utilitzada és extreure l'estacionalitat multiplicativa abans de la regressió mitjançant algorismes de descomposició de sèries temporals (com el mètode Loess). Això permet netejar la variable dependent o utilitzar l'índex calculat com un *input* rígid.

---

## Implementació en Python: Extreure Estacionalitat Multiplicativa

Vegem com separar l'estacionalitat d'una baseline multiplicativa utilitzant la llibreria `statsmodels`:

```python
import numpy as np
import pandas as pd
from statsmodels.tsa.seasonal import seasonal_decompose

# 1. Simulem dades diàries d'un negoci amb creixement i estacionalitat multiplicativa
np.random.seed(42)
dates = pd.date_range(start='2024-01-01', periods=730, freq='D')

# Tendència i Estacionalitat que es multipliquen
tendencia = np.linspace(100, 200, 730)
estacionalitat = 1 + 0.2 * np.sin(2 * np.pi * np.arange(730) / 365.25)
soroll = np.random.normal(1, 0.05, 730)

vendes = tendencia * estacionalitat * soroll
df = pd.DataFrame({'Vendes': vendes}, index=dates)

# 2. Executem la descomposició multiplicativa (període de 365 dies)
resultat = seasonal_decompose(df['Vendes'], model='multiplicative', period=365)

df['index_estacional'] = resultat.seasonal
df['tendencia_neta'] = resultat.trend

print(df[['Vendes', 'index_estacional', 'tendencia_neta']].head())
```

### Implementacio en R
```r
# 1. Simulem dades diàries d'un negoci amb creixement i estacionalitat multiplicativa
set.seed(42)
dies <- 1:730

# Tendència i Estacionalitat que es multipliquen
tendencia <- seq(100, 200, length.out = 730)
estacionalitat <- 1 + 0.2 * sin(2 * pi * (dies - 1) / 365.25) # (dies - 1) per quadrar amb l'np.arange de Python que comença a 0
soroll <- rnorm(730, mean = 1, sd = 0.05)

vendes <- tendencia * estacionalitat * soroll

# Convertim a objecte de sèrie temporal (ts) indicant la freqüència diària anual (365)
vendes_ts <- ts(vendes, frequency = 365, start = c(2024, 1))

# 2. Executem la descomposició multiplicativa
resultat <- decompose(vendes_ts, type = "multiplicative")

# Creem el data frame final equivalent
df <- data.frame(
  Vendes = vendes,
  index_estacional = as.vector(resultat$seasonal),
  tendencia_neta = as.vector(resultat$trend)
)

# Establim les dates com a nom de les files (equivalent a l'índex de Pandas)
dates <- seq(as.Date("2024-01-01"), by = "day", length.out = 730)
rownames(df) <- dates

print(head(df[, c("Vendes", "index_estacional", "tendencia_neta")]))
```
