---
layout: post
title: "Principals Anàlisis de l'Estadística No Paramètrica"
tags:
  - estadistica
  - python
  - r
excerpt: "Quan les dades incompleixen les assumpcions de normalitat o homoscedasticitat, els tests no paramètrics basats en rangs ofereixen una alternativa robusta per realitzar inferències estadístiques sense biaixos."
---

L'estadística paramètrica se sosté sobre la premissa que les dades observades segueixen una distribució de probabilitat determinada, generalment la distribució normal, la qual es defineix mitjançant paràmetres concrets com la mitjana i la variància. No obstant això, en l'anàlisi de dades reals és freqüent identificar escenaris on aquestes assumpcions es violen de forma sistemàtica. 

L'estadística no paramètrica agrupa un conjunt de tècniques d'inferència que no requereixen que la població d'origen estigui determinada per una distribució de probabilitat específica. Per aquest motiu, reben el nom de tests lliures de distribució.

## Criteris d'Aplicació

L'ús de proves no paramètriques és metodològicament necessari davant d'aquestes quatre situacions de les dades:

*   **Dades ordinals:** Variables on els valors expressen un ordre o jerarquia (com les escales Likert o els nivells de satisfacció), però on la distància numèrica entre intervals no és constant ni directament quantificable.
*   **Mostres petites:** Grups amb un nombre d'observacions reduït (típicament $n < 30$) on l'aplicació del Teorema del Límit Central no permet garantir la normalitat de la distribució mostral de la mitjana.
*   **Presència d'outliers:** Valors atípics extrems que distorsionen severament el càlcul d'estadístics paramètrics com la mitjana i la variància, invalidant la potència i validesa dels tests clàssics.
*   **Asimetria extrema:** Distribucions de dades clarament esbiaixades a la dreta o a l'esquerra (com el temps de reacció, salaris o taxes de fallada) que no s'ajusten a la simetria de la campana de Gauss.

## Fonament Estadístic: El Mecanisme de Rangs

La majoria de tests no paramètrics transformen els valors absoluts de la mostra en **rangs ordinals**. El procés consisteix a ordenar totes les observacions combinades de menor a major i assignar-los una posició numèrica entera (1, 2, 3... $N$). 

Si s'analitzen grups procedents de la mateixa població (sota la hipòtesi nul·la), l'esperança matemàtica és que la suma d'aquests rangs es distribueixi de manera equitativa entre els grups. Si un grup concentra de forma estadística els rangs més alts o més baixos, es procedeix a rebutjar la hipòtesi nul·la d'igualtat de distribucions.

Aquesta transformació elimina l'efecte de la magnitud dels *outliers* i permet el tractament numèric de dades ordinals, ja que l'anàlisi se centra exclusivament en la posició relativa de cada dada.

## Els Quatre Anàlisis Principals i Equivalències

La taula següent detalla la correspondència exacta entre els tests paramètrics tradicionals i les seves alternatives no paramètriques per a cadascun dels quatre dissenys d'estudi fonamentals:

| Disseny de l'Estudi | Test Paramètric | Test No Paramètric | Objectiu de l'Anàlisi |
| :--- | :--- | :--- | :--- |
| **2 Mostres Independents** | t de Student independents | **U de Mann-Whitney** (Wilcoxon rank-sum) | Determinar si dues distribucions independents tenen la mateixa posició central. |
| **2 Mostres Aparellades** | t de Student dependents | **Test de Wilcoxon de rangs amb signe** | Avaluar diferències en un mateix grup abans i després d'un tractament o intervenció. |
| **K Mostres Independents** | ANOVA d'un factor | **Test de Kruskal-Wallis** | Comparar la posició central de tres o més grups independents. |
| **K Mostres Aparellades** | ANOVA de mesures repetides | **Test de Friedman** | Comparar tres o més mesures preses de forma seqüencial sobre els mateixos subjectes. |

## Implementació Pràctica

A continuació es detalla l'execució d'aquests quatre anàlisis no paramètrics fonamentals utilitzant vectors de dades que incompleixen les condicions de normalitat.

### Execució en Python

S'utilitza el mòdul `scipy.stats` per dur a terme el càlcul analític de cadascun dels quatre tests descrits.

```python
import numpy as np
import scipy.stats as stats

# Fixar llavor per garantir la reproductibilitat de les simulacions
np.random.seed(42)

# =====================================================================
# 1. GENERACIÓ DE DADES NO NORMALS (Distribucions exponencials i log-normals)
# =====================================================================
# Dades per a 2 Mostres Independents (U de Mann-Whitney)
indep_A = np.random.exponential(scale=2, size=25)
indep_B = np.random.exponential(scale=3.5, size=22)

# Dades per a 2 Mostres Aparellades (Wilcoxon de rangs amb signe)
# Es simula una mesura d'un mateix grup abans i després d'una acció
abans_2g = np.random.lognormal(mean=1, sigma=0.5, size=25)
despres_2g = abans_2g + np.random.normal(loc=0.5, scale=0.2, size=25)

# Dades per a K Mostres Independents (Kruskal-Wallis)
k_ind_1 = np.random.lognormal(mean=0, sigma=1, size=20)
k_ind_2 = np.random.lognormal(mean=0.5, sigma=1, size=20)
k_ind_3 = np.random.lognormal(mean=0.1, sigma=1, size=20)

# Dades per a K Mostres Aparellades (Test de Friedman)
# Es simulen 3 mesures temporals (T1, T2, T3) sobre un grup de 15 subjectes
t1_kg = np.random.exponential(scale=10, size=15)
t2_kg = t1_kg * 1.2 + np.random.normal(0, 1, size=15)
t3_kg = t1_kg * 1.5 + np.random.normal(0, 1, size=15)

# =====================================================================
# 2. EXECUCIÓ DELS QUATRE TESTS NO PARAMÈTRICS
# =====================================================================
print("--- RESULTATS DE L'ANÀLISI NO PARAMÈTRIC (Python) ---")

# Test 1: U de Mann-Whitney (2 mostres independents)
u_stat, p_u = stats.mannwhitneyu(indep_A, indep_B, alternative='two-sided')
print(f"1. U de Mann-Whitney  -> Estadístic U: {u_stat:.4f} | p-valor: {p_u:.4f}")

# Test 2: Wilcoxon signed-rank (2 mostres aparellades)
w_stat, p_w = stats.wilcoxon(abans_2g, despres_2g)
print(f"2. Rangs amb signe de Wilcoxon -> Estadístic W: {w_stat:.4f} | p-valor: {p_w:.4f}")

# Test 3: Kruskal-Wallis (K mostres independents)
kw_stat, p_kw = stats.kruskal(k_ind_1, k_ind_2, k_ind_3)
print(f"3. Kruskal-Wallis     -> Estadístic H: {kw_stat:.4f} | p-valor: {p_kw:.4f}")

# Test 4: Friedman (K mostres aparellades)
fr_stat, p_fr = stats.friedmanchisquare(t1_kg, t2_kg, t3_kg)
print(f"4. Test de Friedman   -> Estadístic Q: {fr_stat:.4f} | p-valor: {p_fr:.4f}")
```

### Execució en R
A l'entorn R, aquests quatre mètodes es troben integrats de manera nativa dins del paquet base `stats`.

```r
# Fixar llavor per garantir la reproductibilitat de les simulacions
set.seed(42)

# =====================================================================
# 1. GENERACIÓ DE DADES NO NORMALS
# =====================================================================
# Dades per a 2 Mostres Independents (Wilcoxon-Mann-Whitney)
indep_A <- rexp(25, rate = 1/2)
indep_B <- rexp(22, rate = 1/3.5)

# Dades per a 2 Mostres Aparellades (Wilcoxon de rangs amb signe)
abans_2g <- rlnorm(25, meanlog = 1, sdlog = 0.5)
despres_2g <- abans_2g + rnorm(25, mean = 0.5, sd = 0.2)

# Dades per a K Mostres Independents (Kruskal-Wallis)
k_ind_1 <- rlnorm(20, meanlog = 0, sdlog = 1)
k_ind_2 <- rlnorm(20, meanlog = 0.5, sdlog = 1)
k_ind_3 <- rlnorm(20, meanlog = 0.1, sdlog = 1)

# Dades per a K Mostres Aparellades (Test de Friedman)
t1_kg <- rexp(15, rate = 1/10)
t2_kg <- t1_kg * 1.2 + rnorm(15, mean = 0, sd = 1)
t3_kg <- t1_kg * 1.5 + rnorm(15, mean = 0, sd = 1)

# =====================================================================
# 2. EXECUCIÓ DELS QUATRE TESTS NO PARAMÈTRICS
# =====================================================================
cat("--- RESULTATS DE L'ANÀLISI NO PARAMÈTRIC (R) ---\n")

# Test 1: Wilcoxon-Mann-Whitney (2 mostres independents)
t1 <- wilcox.test(indep_A, indep_B, alternative = "two.sided")
cat(sprintf("1. Wilcoxon-Mann-Whitney -> Estadístic W: %.4f | p-valor: %.4f\n", t1$statistic, t1$p.value))

# Test 2: Wilcoxon signed-rank (2 mostres aparellades)
t2 <- wilcox.test(abans_2g, despres_2g, paired = TRUE)
cat(sprintf("2. Rangs amb signe de Wilcoxon -> Estadístic V: %.4f | p-valor: %.4f\n", t2$statistic, t2$p.value))

# Test 3: Kruskal-Wallis (K mostres independents)
dades_kw <- c(k_ind_1, k_ind_2, k_ind_3)
grups_kw <- factor(rep(c("G1", "G2", "G3"), each = 20))
t3 <- kruskal.test(dades_kw ~ grups_kw)
cat(sprintf("3. Kruskal-Wallis     -> Estadístic Chi-sq: %.4f | p-valor: %.4f\n", t3$statistic, t3$p.value))

# Test 4: Test de Friedman (K mostres aparellades)
# Requereix una estructura de matriu on les columnes són els temps i les files els subjectes
matriu_friedman <- matrix(c(t1_kg, t2_kg, t3_kg), ncol = 3)
t4 <- friedman.test(matriu_friedman)
cat(sprintf("4. Test de Friedman   -> Estadístic Chi-sq: %.4f | p-valor: %.4f\n", t4$statistic, t4$p.value))
```
