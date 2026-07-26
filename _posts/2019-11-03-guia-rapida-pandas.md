---
layout: post
title: "Guia ràpida Pandas: Què cal saber per manipular dades"
tags:
  - python
  - cheatsheet
excerpt: "Referència ràpida de mètodes de Pandas: lectura i escriptura de fitxers, exploració, selecció i filtratge, neteja, transformació, agrupació, combinació de taules, dates i text, amb exemples de codi curts."
---

Referència compacta dels mètodes més habituals de Pandas, agrupats per tipus d'operació. Cada entrada indica el mètode, què fa i un exemple mínim.

## Lectura i Escriptura

```python
pd.read_csv("fitxer.csv")                         # llegeix CSV
pd.read_excel("fitxer.xlsx", sheet_name="Full1")  # llegeix Excel
pd.read_parquet("fitxer.parquet")                 # llegeix Parquet
pd.read_sql(query, connexio)                      # llegeix des de SQL

df.to_csv("sortida.csv", index=False)             # desa a CSV
df.to_excel("sortida.xlsx", index=False)          # desa a Excel
df.to_parquet("sortida.parquet")                  # desa a Parquet
```

## Exploració Inicial

```python
df.head()                 # primeres 5 files
df.tail(10)               # últimes 10 files
df.shape                  # (files, columnes)
df.info()                 # tipus de dades i nuls per columna
df.describe()             # estadístics bàsics de columnes numèriques
df.columns                # llista de columnes
df.dtypes                 # tipus de dada per columna
df.isna().sum()           # nombre de nuls per columna
df.nunique()              # valors únics per columna
df["col"].value_counts()  # freqüència de valors d'una columna
```

## Selecció i Filtratge

```python
df["col"]                              # selecciona una columna (Series)
df[["col1", "col2"]]                   # selecciona diverses columnes (DataFrame)
df.loc[df["col"] > 10]                 # filtra per condició
df.loc[5:10, ["col1", "col2"]]         # selecció per etiqueta (files i columnes)
df.iloc[0:5, 0:3]                      # selecció per posició
df.query("col > 10 and altra == 'A'")  # filtratge amb sintaxi d'expressió
df[df["col"].isin(["A", "B"])]         # filtra per pertinença a una llista
df[df["col"].between(10, 20)]          # filtra per rang de valors
```

## Neteja de Dades

```python
df.dropna()                          # elimina files amb nuls
df.dropna(subset=["col"])            # elimina files amb nul en una columna concreta
df.fillna(0)                         # substitueix nuls per un valor
df.fillna(df["col"].mean())          # substitueix nuls per la mitjana
df.drop_duplicates()                 # elimina files duplicades
df.drop(columns=["col1", "col2"])    # elimina columnes
df.rename(columns={"antic": "nou"})  # renombra columnes
df.astype({"col": "int"})            # canvia el tipus de dada
df["col"] = df["col"].str.strip()    # elimina espais en blanc d'una columna de text
```

## Transformació de Columnes

```python
df["nova"] = df["col1"] + df["col2"]                 # crear columna a partir d'altres
df["col"].apply(lambda x: x * 2)                     # aplica una funció element a element
df.apply(lambda row: row["a"] + row["b"], axis=1)    # aplica una funció per fila
df["col"].map({"A": 1, "B": 2})                      # substitueix valors segons un diccionari
df["cat"] = pd.cut(df["col"], bins=[0, 10, 20, 30])  # discretitza en intervals
df["rang"] = df["col"].rank()                        # rang de valors
df.sort_values("col", ascending=False)               # ordena per columna
df.reset_index(drop=True)                            # reinicialitza l'índex
df.set_index("col")                                  # defineix una columna com a índex
```

## Agregació i Agrupació

```python
df.groupby("categoria")["import"].sum()    # suma per grup
df.groupby("categoria").agg({"import": "sum", "qty": "mean"})    # múltiples agregacions
df.groupby(["cat1", "cat2"]).size()    # recompte per combinació de grups
df.pivot_table(index="categoria", columns="mes", values="import", aggfunc="sum")    # taula dinàmica

df["import"].sum()      # suma
df["import"].mean()     # mitjana
df["import"].median()   # mediana
df["import"].std()      # desviació estàndard
df["import"].cumsum()   # suma acumulada
```

## Combinació de Taules

```python
pd.concat([df1, df2])                         # apila files (o columnes amb axis=1)
pd.merge(df1, df2, on="id", how="left")       # combina per clau (left/right/inner/outer)
df1.join(df2, on="id")                        # combina utilitzant l'índex
```

## Dates i Sèries Temporals

```python
df["data"] = pd.to_datetime(df["data"])                  # converteix a tipus data
df["any"] = df["data"].dt.year                           # extreu l'any
df["mes"] = df["data"].dt.month                          # extreu el mes
df["dia_setmana"] = df["data"].dt.day_name()             # nom del dia de la setmana
df.set_index("data").resample("M").sum()                 # agregació per mes
df["dies"] = (df["data_fi"] - df["data_inici"]).dt.days  # diferència entre dates
```

## Text (accessor `.str`)

```python
df["col"].str.lower()               # minúscules
df["col"].str.contains("text")      # comprova si conté un patró
df["col"].str.replace("a", "b")     # substitueix text
df["col"].str.split(",")            # divideix en llista
df["col"].str.len()                 # longitud del text
```

## Visualització Ràpida

```python
df["col"].plot(kind="hist", bins=20)                      # histograma
df.plot(x="data", y="import", kind="line")                # línia temporal
df.groupby("categoria")["import"].sum().plot(kind="bar")  # barres per grup
```
