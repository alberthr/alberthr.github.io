---
layout: post
title: "Principals Mètodes d'Estadística No Paramètrica"
tags:
  - estadistica
excerpt: "Quan les dades no compleixen els supòsits d'un test clàssic (normalitat, mostra gran, escala d'interval), l'estadística no paramètrica ofereix alternatives robustes. Panoràmica dels mètodes principals i de quan fer-los servir."
---

Els tests estadístics clàssics (test t, ANOVA, regressió lineal per mínims quadrats...) s'anomenen **paramètrics** perquè assumeixen que les dades segueixen una distribució coneguda, normalment la normal, definida per un nombre reduït de paràmetres (mitjana i variància). Quan aquest supòsit no es compleix —mostres petites, distribucions esbiaixades, outliers, dades ordinals en lloc de numèriques—, els resultats d'aquests tests deixen de ser fiables.

L'**estadística no paramètrica** agrupa el conjunt de mètodes que no depenen de cap forma de distribució concreta. En lloc de treballar amb la mitjana i la variància, sovint es basen en l'ordre (rangs) de les dades, en freqüències, o en tècniques de remostreig. Aquest article en repassa els mètodes principals, agrupats pel tipus de pregunta que responen.


## Quan fer servir un mètode no paramètric

Abans d'entrar en cada mètode, val la pena fixar el criteri de quan preferir-los davant d'un test clàssic:

- **Mostra petita** (habitualment $n < 30$), on no es pot invocar el Teorema del Límit Central per assumir normalitat.
- **Distribució clarament esbiaixada** o amb outliers importants (temps de resposta, ingressos, temps d'espera...).
- **Dades ordinals** (valoracions d'1 a 5, rànquings) en lloc de numèriques contínues, on la mitjana no té sentit ple.
- **Variància molt diferent entre grups** (heterocedasticitat), que trenca un supòsit clau de l'ANOVA o el test t.
- **Manca de coneixement previ** sobre la forma de la distribució subjacent.

El cost d'aquesta robustesa és, generalment, una **pèrdua de potència estadística**: si les dades sí que compleixen els supòsits d'un test paramètric, el test no paramètric equivalent necessita més mostra per detectar el mateix efecte. Per això la recomanació habitual és fer servir el test paramètric quan els seus supòsits es compleixen raonablement, i reservar el no paramètric per quan no és així.


## Comparació de dos grups

### Test de Mann-Whitney U (o Wilcoxon rank-sum)

Alternativa no paramètrica al test t per a mostres independents. En lloc de comparar mitjanes, ordena totes les observacions dels dos grups conjuntament i compara la suma de rangs de cada grup: si els dos grups provenen de la mateixa distribució, els rangs haurien d'estar barrejats de manera similar entre tots dos.

- **Quan fer-lo servir:** comparar dos grups independents (per exemple, temps de conversió entre dues versions d'una pàgina) quan les dades no són normals o la mostra és petita.
- **Hipòtesi que contrasta:** que les dues distribucions són idèntiques, no només que tinguin la mateixa mitjana; és més precís dir que contrasta si un grup tendeix a tenir valors més alts que l'altre.

### Test de Wilcoxon (dades aparellades)

Versió per a mostres **aparellades** (el mateix individu mesurat abans i després, o dues mesures relacionades), anàloga al test t aparellat. Es calculen les diferències entre cada parella, se n'ordenen els valors absoluts i es compara la suma de rangs positius amb la de rangs negatius.

- **Quan fer-lo servir:** avaluar l'efecte d'una intervenció (abans/després) quan les diferències no segueixen una distribució normal.

### Test de Kolmogorov-Smirnov (K-S)

Ja tractat en detall en un [post anterior]({% post_url 2022-08-02-kolmogorov-smirnov %}): compara les funcions de distribució acumulada de dues mostres (o d'una mostra contra una distribució teòrica) i n'obté la distància màxima entre totes dues corbes. A diferència de Mann-Whitney, que es fixa en si un grup tendeix a tenir valors més alts que l'altre, el K-S detecta **qualsevol** diferència de forma entre les dues distribucions (mitjana, variància, asimetria...), no només un desplaçament.

- **Quan fer-lo servir:** comparar si dues mostres provenen de la mateixa distribució en sentit ampli, o comprovar si una variable (per exemple, els residus d'un model) segueix una distribució teòrica coneguda, com la normal.


## Comparació de més de dos grups

### Test de Kruskal-Wallis

Extensió del Mann-Whitney a més de dos grups; és l'alternativa no paramètrica a l'ANOVA d'un factor. Compara els rangs entre tots els grups per determinar si almenys un difereix significativament de la resta.

- **Quan fer-lo servir:** comparar 3 o més grups independents (per exemple, la despesa mitjana en 4 segments de client) quan no es compleixen els supòsits de l'ANOVA.
- **Seguiment:** si el resultat és significatiu, cal un test *post-hoc* (com el de Dunn) per identificar quins grups concrets difereixen entre si, de manera anàloga a com es fa després d'una ANOVA significativa.

### Test de Friedman

Equivalent no paramètric d'una ANOVA de mesures repetides. S'utilitza quan els mateixos subjectes es mesuren sota diverses condicions (per exemple, la satisfacció d'un mateix grup d'usuaris amb 3 dissenys diferents de producte).

- **Quan fer-lo servir:** dades aparellades amb més de dues condicions, i variables ordinals o no normals.


## Associació i correlació

### Correlació de Spearman

Mesura la relació **monòtona** (no necessàriament lineal) entre dues variables, calculant la correlació de Pearson sobre els rangs de les dades en lloc dels valors originals.

- **Quan fer-la servir:** quan la relació entre dues variables no és lineal però sí consistentment creixent o decreixent, quan hi ha outliers que distorsionarien una correlació de Pearson, o amb variables ordinals.
- **Interpretació:** igual que Pearson, va de -1 a 1, però mesura si "quan una variable puja, l'altra tendeix a pujar (o baixar)", sense assumir que ho faci a un ritme constant.

### Correlació de Kendall (Tau)

Alternativa a Spearman, basada en el nombre de parells d'observacions **concordants** i **discordants** (si el rànquing d'una variable coincideix amb el de l'altra per a cada parella de punts). Sol preferir-se amb mostres petites o quan hi ha molts valors empatats.

### Chi-quadrat d'independència

Encara que sovint es classifica a part, és el mètode no paramètric per excel·lència per a **variables categòriques**: contrasta si dues variables qualitatives (per exemple, gènere i preferència de producte) són independents, comparant les freqüències observades en una taula de contingència amb les freqüències que s'esperarien si no hi hagués relació.

- **Quan fer-lo servir:** dues variables categòriques (no numèriques), amb prou observacions per cel·la (habitualment, com a mínim 5 per casella esperada).


## Estimació i remostreig

### Bootstrapping

Ja tractat en detall en un [post anterior]({% post_url 2020-11-11-intervals-bootstrapping %}): en lloc d'assumir una distribució teòrica, genera milers de rèpliques de la mostra original (amb reposició) per aproximar la distribució d'un estadístic qualsevol —mitjana, mediana, correlació, un coeficient de regressió— sense necessitat de fórmula analítica.

- **Quan fer-lo servir:** calcular intervals de confiança per a estadístics sense fórmula teòrica senzilla, o quan les dades no compleixen els supòsits necessaris per a la fórmula clàssica.

### Tests de permutació

Tècnica de remostreig relacionada amb el bootstrap: en lloc de mostrejar amb reposició, es **redistribueixen aleatòriament les etiquetes de grup** entre les observacions, es recalcula l'estadístic d'interès milers de vegades, i es compara el valor observat original amb aquesta distribució simulada sota la hipòtesi nul·la.

- **Quan fer-los servir:** com a alternativa molt flexible i intuïtiva al test t o a l'ANOVA, especialment amb mostres petites, ja que no depenen de cap supòsit distribucional i es poden aplicar a pràcticament qualsevol estadístic.


## Regressió no paramètrica

### Regressió de rangs i regressió LOESS

Quan la relació entre variables no és lineal i no es vol assumir cap forma funcional concreta, les tècniques de suavitzat local com **LOESS** (ja tractada en un [altre post]({% post_url 2018-06-09-suavitzat-polinomic %})) permeten estimar la tendència directament de les dades, sense ajustar una única equació global.

- **Quan fer-la servir:** explorar visualment una relació abans de decidir quina forma funcional té sentit, o quan la relació canvia de comportament al llarg del rang de la variable explicativa.


## Implementació pràctica

A continuació es mostren exemples breus dels mètodes més habituals —Mann-Whitney U, Kruskal-Wallis, correlació de Spearman i Chi-quadrat— aplicats a dades senzilles, tant en R com en Python.

### Implementació en R

```r
# Mann-Whitney U: comparar 2 grups independents
grup_A <- c(4.1, 3.8, 5.2, 4.5, 3.9, 4.7)
grup_B <- c(5.5, 6.1, 5.8, 6.4, 5.9, 6.0)
wilcox.test(grup_A, grup_B)

# Kruskal-Wallis: comparar 3+ grups independents
valors <- c(4.1, 3.8, 5.2, 5.5, 6.1, 5.8, 7.2, 6.9, 7.5)
grups  <- factor(rep(c("A", "B", "C"), each = 3))
kruskal.test(valors ~ grups)

# Correlació de Spearman
antiguitat <- c(1, 2, 3, 4, 5, 6, 7, 8)
satisfaccio <- c(3, 4, 4, 6, 5, 7, 8, 9)
cor.test(antiguitat, satisfaccio, method = "spearman")

# Chi-quadrat d'independència
taula <- matrix(c(30, 20, 15, 35), nrow = 2,
                 dimnames = list(Genere = c("H", "D"), Prefereix = c("A", "B")))
chisq.test(taula)
```

### Implementació en Python

```python
import numpy as np
from scipy import stats

# Mann-Whitney U: comparar 2 grups independents
grup_A = [4.1, 3.8, 5.2, 4.5, 3.9, 4.7]
grup_B = [5.5, 6.1, 5.8, 6.4, 5.9, 6.0]
print(stats.mannwhitneyu(grup_A, grup_B))

# Kruskal-Wallis: comparar 3+ grups independents
grup_A = [4.1, 3.8, 5.2]
grup_B = [5.5, 6.1, 5.8]
grup_C = [7.2, 6.9, 7.5]
print(stats.kruskal(grup_A, grup_B, grup_C))

# Correlació de Spearman
antiguitat = [1, 2, 3, 4, 5, 6, 7, 8]
satisfaccio = [3, 4, 4, 6, 5, 7, 8, 9]
print(stats.spearmanr(antiguitat, satisfaccio))

# Chi-quadrat d'independència
taula = np.array([[30, 20], [15, 35]])  # files: Genere H/D, columnes: Prefereix A/B
print(stats.chi2_contingency(taula))
```

En els quatre casos, la sortida principal a interpretar és el **p-valor**: per sota del llindar habitual (0,05), s'interpreta com a evidència que els grups difereixen (Mann-Whitney, Kruskal-Wallis), que la correlació és significativa (Spearman), o que les variables no són independents (Chi-quadrat).


## Resum: quin mètode triar

| Pregunta | Test paramètric equivalent | Alternativa no paramètrica |
|---|---|---|
| Comparar 2 grups independents | Test t | Mann-Whitney U |
| Comparar 2 mesures aparellades | Test t aparellat | Wilcoxon |
| Comparar la forma completa de 2 distribucions | — | Kolmogorov-Smirnov |
| Comparar 3+ grups independents | ANOVA | Kruskal-Wallis |
| Comparar 3+ mesures aparellades | ANOVA de mesures repetides | Friedman |
| Correlació entre 2 variables numèriques | Pearson | Spearman / Kendall |
| Associació entre 2 variables categòriques | — | Chi-quadrat |
| Interval de confiança d'un estadístic | Fórmula analítica (Teorema del Límit Central) | Bootstrapping |
| Contrastar una diferència entre grups | Test t / ANOVA | Test de permutació |
| Relació no lineal entre variables | Regressió polinòmica | LOESS |


## Conclusió

L'estadística no paramètrica no és un "segon plat" per quan les dades no compleixen els requisits dels tests clàssics; és una família de mètodes amb el seu propi criteri d'ús, especialment valuosa amb mostres petites, dades esbiaixades o variables ordinals i categòriques. El criteri pràctic més senzill és comprovar primer els supòsits del test paramètric equivalent (normalitat, homogeneïtat de variàncies, mida de mostra) i, si no es compleixen amb prou garantia, recórrer a l'alternativa no paramètrica corresponent d'aquesta llista.
