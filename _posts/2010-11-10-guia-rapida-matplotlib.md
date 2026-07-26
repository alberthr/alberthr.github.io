---
layout: post
title: "Guia ràpida Matplotlib: Llibreria basica de gràfics a Python"
tags:
  - python
  - cheatsheet
excerpt: "Referència ràpida de Matplotlib: figura i eixos, tipus de gràfic més habituals, personalització d'etiquetes i llegendes, subplots, anotacions, estils predefinits i com desar el resultat final en alta resolució."
---

Matplotlib és la llibreria bàsica de visualització en Python, i la majoria d'altres llibreries gràfiques (Seaborn, Pandas plotting) es construeixen per sobre seu. Aquesta guia recull els elements imprescindibles per crear, personalitzar i desar gràfics de manera ràpida.

## Estructura Bàsica: Figura i Eixos

Tot gràfic de Matplotlib es construeix sobre dos objectes: la `Figure` (el llenç sencer) i els `Axes` (l'àrea de dibuix concreta, amb els seus eixos X i Y). L'API orientada a objectes, recomanada per a qualsevol gràfic que no sigui trivial, es basa en `plt.subplots()`:

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 5))
ax.plot([1, 2, 3, 4], [10, 20, 15, 25])
plt.show()
```

## Implementació Pràctica

### Tipus de Gràfic Més Habituals

```python
fig, ax = plt.subplots(figsize=(8, 5))

# Línia
ax.plot(x, y, label="Sèrie A")

# Dispersió
ax.scatter(x, y, color="steelblue", alpha=0.7)

# Barres
ax.bar(categories, valors)

# Histograma
ax.hist(dades, bins=20)

# Boxplot
ax.boxplot(dades)
```

Cada mètode retorna els objectes gràfics corresponents (línies, patches, etc.), que es poden reutilitzar per personalitzar-los individualment si cal.

### Etiquetes, Títol i Llegenda

```python
ax.set_xlabel("Eix X")
ax.set_ylabel("Eix Y")
ax.set_title("Títol del gràfic")
ax.legend(loc="upper right")
```

La llegenda només mostra les sèries que s'han definit amb el paràmetre `label` a la crida corresponent (`ax.plot(..., label="Sèrie A")`).

### Colors, Estils i Mida

```python
ax.plot(x, y, color="#2c7fb8", linestyle="--", linewidth=2, marker="o")
```

Matplotlib admet colors per nom (`"red"`, `"steelblue"`), en hexadecimal (`"#2c7fb8"`) o com a tupla RGB. Els estils de línia més habituals són `"-"` (contínua), `"--"` (discontínua), `":"` (punteada) i `"-."` (mixta).

### Múltiples Gràfics amb Subplots

```python
fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(10, 8))

axes[0, 0].plot(x, y)
axes[0, 1].scatter(x, y)
axes[1, 0].bar(categories, valors)
axes[1, 1].hist(dades, bins=20)

fig.tight_layout()
```

`fig.tight_layout()` ajusta automàticament els espais entre subgràfics per evitar que les etiquetes se superposin.

### Eixos Compartits i Escales

```python
fig, ax = plt.subplots()
ax.plot(x, y)
ax.set_xlim(0, 10)
ax.set_ylim(0, 100)
ax.set_yscale("log")
```

### Anotacions i Línies de Referència

```python
ax.axhline(y=50, color="grey", linestyle="--", label="Llindar")
ax.axvline(x=5, color="red", linestyle=":")
ax.annotate("Punt màxim", xy=(3, 25), xytext=(4, 30),
            arrowprops=dict(arrowstyle="->"))
```

### Desar el Gràfic

```python
fig.savefig("grafic.png", dpi=300, bbox_inches="tight")
```

El paràmetre `dpi` controla la resolució (300 és un valor habitual per a impressió o publicacions), i `bbox_inches="tight"` retalla els marges sobrants al voltant del gràfic.

## Estils Predefinits

Matplotlib inclou estils visuals que es poden aplicar globalment abans de crear el gràfic:

```python
plt.style.use("seaborn-v0_8-whitegrid")
```

Es pot consultar la llista completa d'estils disponibles amb `plt.style.available`.

## Exemple Complet

L'exemple següent combina la majoria d'elements descrits en aquesta guia: subplots, diversos tipus de gràfic, personalització d'estil, llegenda, anotació, línia de referència i desat final.

```python
import numpy as np
import matplotlib.pyplot as plt

plt.style.use("seaborn-v0_8-whitegrid")

# Dades d'exemple
x = np.linspace(0, 10, 100)
y1 = np.sin(x)
y2 = np.cos(x)
categories = ["A", "B", "C", "D"]
valors = [23, 45, 12, 38]
dades_hist = np.random.normal(loc=50, scale=10, size=500)

fig, axes = plt.subplots(nrows=2, ncols=2, figsize=(12, 9))
fig.suptitle("Panell resum", fontsize=16, fontweight="bold")

# Gràfic 1: línies
ax1 = axes[0, 0]
ax1.plot(x, y1, color="#2c7fb8", linewidth=2, label="sin(x)")
ax1.plot(x, y2, color="#d95f02", linestyle="--", linewidth=2, label="cos(x)")
ax1.axhline(y=0, color="grey", linestyle=":")
ax1.set_title("Funcions trigonomètriques")
ax1.set_xlabel("x")
ax1.set_ylabel("valor")
ax1.legend(loc="upper right")

# Gràfic 2: barres
ax2 = axes[0, 1]
barres = ax2.bar(categories, valors, color="#66c2a5")
ax2.set_title("Valors per categoria")
ax2.set_ylabel("Total")
ax2.bar_label(barres, padding=3)

# Gràfic 3: dispersió amb anotació
ax3 = axes[1, 0]
soroll = np.random.normal(0, 0.3, size=len(x))
ax3.scatter(x, y1 + soroll, color="#7570b3", alpha=0.6, s=25)
punt_max_idx = np.argmax(y1 + soroll)
ax3.annotate(
    "Punt destacat",
    xy=(x[punt_max_idx], (y1 + soroll)[punt_max_idx]),
    xytext=(6, 1.5),
    arrowprops=dict(arrowstyle="->", color="black"),
)
ax3.set_title("Dispersió amb soroll")
ax3.set_xlabel("x")
ax3.set_ylabel("y")

# Gràfic 4: histograma
ax4 = axes[1, 1]
ax4.hist(dades_hist, bins=25, color="#e78ac3", edgecolor="white")
ax4.axvline(x=dades_hist.mean(), color="black", linestyle="--", label="Mitjana")
ax4.set_title("Distribució de dades")
ax4.set_xlabel("valor")
ax4.set_ylabel("freqüència")
ax4.legend()

fig.tight_layout()
fig.savefig("panell_resum.png", dpi=300, bbox_inches="tight")
plt.show()
```

Aquest script genera un panell de quatre gràfics amb estil consistent, cadascun amb títol, etiquetes i, quan cal, llegenda, i el desa finalment com a imatge PNG a alta resolució.

## Notes Finals

Quan es treballa amb Pandas, els `DataFrame` i les `Series` incorporen el mètode `.plot()`, que internament crida Matplotlib i n'accepta els mateixos paràmetres (`kind="bar"`, `figsize`, `ax`, etc.), fet que permet combinar-lo directament amb objectes `Axes` creats manualment.
