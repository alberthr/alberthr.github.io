---
layout: post
title: "Guia ràpida NumPy: Els arrays i càlculs que cal dominar"
tags:
  - python
  - cheatsheet
excerpt: "Referència ràpida de mètodes de NumPy: creació d'arrays, propietats bàsiques, indexació i selecció, operacions matemàtiques element a element, àlgebra lineal, estadístics, reshaping i nombres aleatoris, amb exemples de codi curts per a cada bloc."
---

Referència compacta dels mètodes més habituals de NumPy, agrupats per tipus d'operació. Cada entrada indica el mètode, què fa i un exemple mínim.

Un array (`ndarray`) és l'estructura de dades central de NumPy: una graella de valors del mateix tipus, indexada per un o més eixos (una dimensió és un vector, dues dimensions és una matriu, i així successivament). A diferència d'una llista de Python, un array emmagatzema les dades de manera contigua en memòria i permet aplicar operacions matemàtiques sobre tots els elements alhora, sense bucles explícits.

## Creació d'Arrays

Un array es pot crear a partir d'una estructura de Python existent (una llista o llista de llistes) o generar-se directament amb funcions que produeixen valors segons un patró (zeros, uns, seqüències, etc.).

```python
np.array([1, 2, 3])              # array a partir d'una llista
np.zeros((3, 4))                 # array de zeros
np.ones((3, 4))                  # array d'uns
np.full((3, 4), 7)               # array amb un valor constant
np.arange(0, 10, 2)              # seqüència amb pas fix
np.linspace(0, 1, 5)             # seqüència amb n valors equiespaiats
np.eye(3)                        # matriu identitat
np.array([[1, 2], [3, 4]])       # array 2D
arr.copy()                       # còpia independent d'un array
```

## Propietats d'un Array

Cada array porta associada informació sobre la seva forma i el tipus de dada que conté, útil per verificar que les operacions es fan sobre les dimensions i tipus esperats.

```python
arr.shape          # dimensions (files, columnes...)
arr.ndim           # nombre de dimensions
arr.size           # nombre total d'elements
arr.dtype          # tipus de dada
arr.astype(float)  # canvia el tipus de dada
```

## Indexació i Selecció

Els elements d'un array es poden seleccionar per posició, per interval (slicing), per condició booleana o per una llista d'índexs concrets.

```python
arr[0]                  # primer element
arr[-1]                 # últim element
arr[1:4]                # tros (slice)
arr[:, 0]               # primera columna (array 2D)
arr[0, :]               # primera fila (array 2D)
arr[arr > 5]            # filtratge booleà
np.where(arr > 5, 1, 0) # substitueix segons condició
arr[[0, 2, 4]]          # selecció per índexs (fancy indexing)
```

## Operacions Matemàtiques Element a Element

NumPy aplica les operacions aritmètiques i les funcions matemàtiques a cada element de l'array de manera vectoritzada, sense necessitat d'escriure bucles.

```python
arr + 5               # suma escalar
arr * 2               # multiplicació escalar
arr1 + arr2           # suma element a element
arr1 * arr2           # multiplicació element a element (no matricial)
np.sqrt(arr)          # arrel quadrada
np.exp(arr)           # exponencial
np.log(arr)           # logaritme natural
np.abs(arr)           # valor absolut
np.round(arr, 2)      # arrodoniment a n decimals
np.clip(arr, 0, 100)  # limita valors a un rang
```

## Estadístics i Agregacions

Els mètodes d'agregació resumeixen els valors d'un array en una o poques xifres, i es poden aplicar sobre tot l'array o per files/columnes concretes mitjançant el paràmetre `axis`.

```python
arr.sum()               # suma total
arr.mean()              # mitjana
arr.median()            # mediana (via np.median(arr))
arr.std()               # desviació estàndard
arr.var()               # variància
arr.min()               # valor mínim
arr.max()               # valor màxim
arr.argmin()            # índex del valor mínim
arr.argmax()            # índex del valor màxim
arr.sum(axis=0)         # suma per columnes (array 2D)
arr.sum(axis=1)         # suma per files (array 2D)
np.percentile(arr, 90)  # percentil 90
np.cumsum(arr)          # suma acumulada
```

## Àlgebra Lineal

El mòdul `np.linalg` conté les operacions matricials habituals en àlgebra lineal, com el producte matricial, la inversa o la resolució de sistemes d'equacions.

```python
np.dot(a, b)           # producte escalar / matricial
a @ b                  # producte matricial (equivalent a np.dot)
a.T                    # transposada
np.linalg.inv(a)       # matriu inversa
np.linalg.det(a)       # determinant
np.linalg.eig(a)       # valors i vectors propis
np.linalg.solve(a, b)  # resol sistema d'equacions lineals Ax = b
np.linalg.norm(a)      # norma d'un vector o matriu
```

## Reshaping i Combinació d'Arrays

La forma d'un array es pot modificar sense canviar-ne les dades, i diversos arrays es poden combinar en un de sol apilant-los per files, per columnes o concatenant-los directament.

```python
arr.reshape(3, 4)           # canvia la forma sense modificar les dades
arr.flatten()               # converteix a array 1D
arr.ravel()                 # com flatten, però retorna vista si és possible
np.concatenate([a, b])      # concatena arrays
np.vstack([a, b])           # apila verticalment
np.hstack([a, b])           # apila horitzontalment
np.split(arr, 3)            # divideix en n parts iguals
np.expand_dims(arr, axis=0) # afegeix una dimensió
np.squeeze(arr)             # elimina dimensions de mida 1
```

## Comparació i Lògica

Aquests mètodes permeten comparar arrays sencers, comprovar condicions element a element i detectar o eliminar valors duplicats.

```python
np.array_equal(a, b)      # comprova si dos arrays són iguals
np.all(arr > 0)           # comprova si totes les condicions es compleixen
np.any(arr > 0)           # comprova si alguna condició es compleix
np.isnan(arr)             # detecta valors NaN
np.unique(arr)            # valors únics, ordenats
np.sort(arr)              # ordena l'array
```

## Nombres Aleatoris

El generador `default_rng` és la manera recomanada de generar nombres aleatoris a NumPy; fixar una llavor (`seed`) garanteix resultats reproduïbles.

```python
rng = np.random.default_rng(seed=42)   # generador amb llavor fixa
rng.random(5)                          # 5 nombres aleatoris entre 0 i 1
rng.integers(0, 10, size=5)            # enters aleatoris entre 0 i 10
rng.normal(loc=0, scale=1, size=100)   # mostra de distribució normal
rng.choice(["A", "B", "C"], size=5)    # selecció aleatòria amb repetició
rng.shuffle(arr)                       # barreja un array in-place
```
