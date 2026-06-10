---
layout: post
title: "Suavitzat Exponencial: Predicció de Sèries Temporals"
tags:
  - series-temporals
  - python
  - r
  - pronostic
---

En l'anàlisi de sèries temporals, un dels reptes més habituals és separar el "soroll" de la veritable tendència de les dades. Si treballem amb mètriques de negoci que fluctuen diàriament (com les visites de la web o les vendes d'un e-commerce), fer un pronòstic basat en mitjanes mòbils simples pot deixar fora informació crucial. Per resoldre això d'una manera estadísticament robusta, disposem del **Suavitzat Exponencial** (*Exponential Smoothing*).



## Què és el Suavitzat Exponencial?

El suavitzat exponencial és una tècnica de pronòstic de sèries temporals que calcula una mitjana ponderada de les observacions passades. La seva principal característica és que **assigna pesos decreixents de forma exponencial a mesura que les dades són més antigues**. En resum: les dades d'ahir influeixen molt més en la predicció de demà que les dades de fa tres mesos.

Matemàticament, el model més bàsic (Suavitzat Exponencial Simple) es defineix amb la següent equació d'actualització:

<center>$F_{t+1} = \alpha Y_t + (1 - \alpha) F_t$</center>


On:

* $F_{t+1}$ és el pronòstic per al següent període.
* $Y_t$ és el valor real observat en el període actual.
* $F_t$ és el pronòstic que s'havia fet per al període actual.
* $\alpha$ (alpha) és el **paràmetre de suavitzat**, un valor entre 0 i 1.

Si $\alpha$ és proper a 1, l'algoritme reacciona ràpidament als canvis recents (ideal per a entorns volàtils). Si $\alpha$ és proper a 0, s'ignoren les fluctuacions ràpides i es dona més pes a la història llarga, generant una corba molt més suau.

## Tipus de Suavitzat Exponencial

Depenent de la complexitat de la teva sèrie de dades, l'algoritme s'estén en tres nivells (coneguts clàssicament com la metodologia Holt-Winters):

1. **Simple (SES):** Ideal per a dades estacionàries, sense tendència clara ni estacionalitat.
2. **Doble (Model de Holt):** Afegeix un segon paràmetre ($\beta$) per capturar la **tendència** (si les dades creixen o decreixen de forma sostinguda en el temps).
3. **Triple (Model de Holt-Winters):** Afegeix un tercer paràmetre ($\gamma$) per capturar l'**estacionalitat** (patrons que es repeteixen en intervals fixos, com l'augment de vendes cada Nadal o cada cap de setmana).

## Utilitats i casos d'ús reals

Com a Data Analysts, aquest mètode és altament valorat per la seva velocitat de càlcul i eficiència:

* **Gestió d'estocs (Inventory Management):** Predicció de la demanda de productes per evitar trencaments d'estoc en magatzems sense necessitat d'entrenar complexos models de Deep Learning.
* **Mètriques de producte web:** Establir línies base de trànsit diari o d'usuaris actius per poder detectar anomalies (caigudes de servei o pics de bots fraudulents).
* **Finances i Control d'operacions:** Pressupostos de despeses a curt termini basats en la facturació dels últims mesos.

---

## Implementació Pràctica

Anem a simular una sèrie temporal de vendes i a aplicar-hi un suavitzat doble (amb tendència) per fer una predicció dels següents passos.

### Exemple en Python

A Python, la llibreria de referència per a models estadístics és `statsmodels`.

```python
import pandas as pd
import numpy as np
from statsmodels.tsa.api import Holt

# Simulem 12 mesos de vendes amb una tendència creixent
dades_vendes = [100, 112, 118, 125, 140, 145, 153, 160, 168, 180, 188, 195]
mesos = pd.date_range(start="2026-01-01", periods=12, freq="ME")
serie_temporal = pd.Series(dades_vendes, index=mesos)

# Apliquem el Suavitzat Exponencial Doble (Holt)
model = Holt(serie_temporal, initialization_method="estimated").fit()

# Predicció per als pròxims 3 mesos
prediccio = model.forecast(3)

print("Valors ajustats interns del model:")
print(model.fittedvalues.tail(3))
print("\nPronòstic per als propers 3 mesos:")
print(prediccio)
```

### Exemple en R
A R, podem utilitzar el potent ecosistema `fable` o les funcions natives de la llibreria clàssica `forecast`.

```R
# Cal instal·lar el paquet si no el tens: install.packages("forecast")
library(forecast)

# Creem la sèrie temporal de 12 mesos
dades_vendes <- c(100, 112, 118, 125, 140, 145, 153, 160, 168, 180, 188, 195)
serie_temporal <- ts(dades_vendes, start = c(2026, 1), frequency = 12)

# Apliquem el mètode de Holt (Suavitzat Doble amb tendència)
model <- holt(serie_temporal, h = 3)

# Mostrem el resum del model i el pronòstic futur
print(summary(model))

# Veure les prediccions numèriques directament
cat("\nPronòstic per als propers 3 mesos:\n")
print(model$mean)
```
