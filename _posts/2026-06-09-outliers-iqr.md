---
layout: post
title: "Com detectar Outliers ràpidament amb Python (IQR)"
tags: [python, outliers, neteja-dades]
---

Aquesta és la funció clàssica que faig servir per identificar valors atípics en un DataFrame utilitzant el rang interquartílic (IQR).

### El codi en Python

```python
import pandas as pd

def detecta_outliers(df, columna):
    Q1 = df[columna].quantile(0.25)
    Q3 = df[columna].quantile(0.75)
    IQR = Q3 - Q1
    filtre_inferior = Q1 - 1.5 * IQR
    filtre_superior = Q3 + 1.5 * IQR
    
    outliers = df[(df[columna] < filtre_inferior) | (df[columna] > filtre_superior)]
    return outliers
