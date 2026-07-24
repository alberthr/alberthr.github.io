---
layout: post
title: "Principals Mètodes d'Estadística No Paramètrica"
tags:
  - estadistica
excerpt: "Quan les dades no compleixen els supòsits d'un test clàssic (normalitat, mostra gran, escala d'interval), l'estadística no paramètrica ofereix alternatives robustes. Panoràmica dels mètodes principals, amb exemples reals i càlcul manual, i de quan fer-los servir."
---

Els tests estadístics clàssics (test t, ANOVA, regressió lineal per mínims quadrats...) s'anomenen **paramètrics** perquè assumeixen que les dades segueixen una distribució coneguda, normalment la normal, definida per un nombre reduït de paràmetres (mitjana i variància). Quan aquest supòsit no es compleix —mostres petites, distribucions esbiaixades, outliers, dades ordinals en lloc de numèriques—, els resultats d'aquests tests deixen de ser fiables.

L'**estadística no paramètrica** agrupa el conjunt de mètodes que no depenen de cap forma de distribució concreta. En lloc de treballar amb la mitjana i la variància, sovint es basen en l'ordre (rangs) de les dades, en freqüències, o en tècniques de remostreig. Aquest article en repassa els mètodes principals, amb un exemple real per a cadascun i, quan els passos ho permeten, el càlcul fet a mà per veure què hi ha realment darrere del test.


## Quan utilitzar-los

Abans d'entrar en cada mètode, val la pena fixar el criteri de quan preferir-los davant d'un test clàssic:

- **Mostra petita** (habitualment $$n < 30$$), on no es pot invocar el Teorema del Límit Central per assumir normalitat.
- **Distribució clarament esbiaixada** o amb outliers importants (temps de resposta, ingressos, temps d'espera...).
- **Dades ordinals** (valoracions d'1 a 5, rànquings) en lloc de numèriques contínues, on la mitjana no té sentit ple.
- **Variància molt diferent entre grups** (heterocedasticitat), que trenca un supòsit clau de l'ANOVA o el test t.
- **Manca de coneixement previ** sobre la forma de la distribució subjacent.

El cost d'aquesta robustesa és, generalment, una **pèrdua de potència estadística**: si les dades sí que compleixen els supòsits d'un test paramètric, el test no paramètric equivalent necessita més mostra per detectar el mateix efecte. Per això la recomanació habitual és fer servir el test paramètric quan els seus supòsits es compleixen raonablement, i reservar el no paramètric per quan no és així.


## Comparar dos grups

Aquests dos tests responen la mateixa pregunta —"aquests dos grups de dades són realment diferents, o la diferència que es veu pot ser deguda a l'atzar?"— però per a dues situacions diferents: quan els dos grups són **independents** (persones diferents a cada grup) o quan són **el mateix grup mesurat dues vegades** (abans i després).

En lloc de comparar mitjanes com fa un test t, tots dos mètodes ordenen totes les dades de més petita a més gran i miren la **posició** (el rang) que ocupa cada valor. Si els dos grups fossin realment iguals, els valors alts i baixos haurien d'estar barrejats entre tots dos de manera similar; si un grup té sistemàticament els rangs més alts, és senyal que hi ha una diferència real.

### Mann-Whitney U (grups independents)

**Exemple real:** una botiga online canvia el disseny de la pàgina de pagament i vol saber si els clients completen la compra més ràpid amb el disseny nou. Es mesura el temps (en segons) de 15 clients amb el disseny antic i 15 amb el nou. Els temps tenen alguns valors molt alts (clients que es distreuen o dubten), cosa que fa que la mitjana no sigui gaire representativa — per això, en lloc d'un test t, es fa servir Mann-Whitney per comparar si els temps del grup nou tendeixen a ser més baixos.

```r
temps_antic <- c(45, 52, 38, 61, 49, 55, 70, 43, 58, 47, 90, 51, 44, 63, 48)
temps_nou   <- c(38, 41, 35, 44, 39, 42, 50, 37, 46, 40, 55, 43, 36, 48, 41)
wilcox.test(temps_antic, temps_nou)
```

Un p-valor per sota de 0,05 indica que el canvi de disseny sí que ha reduït el temps de compra de manera significativa, no per casualitat.

**Càlcul manual** (amb una mostra reduïda de 4 clients per grup, per simplificar): disseny antic 45, 52, 38, 61 · disseny nou 38, 41, 35, 44.

1. **Es barregen totes les dades i s'ordenen** de més petita a més gran: 35, 38, 38, 41, 44, 45, 52, 61.
2. **S'assigna un rang a cada valor** (la seva posició un cop ordenat; si hi ha empat, es reparteix la posició mitjana entre els empatats): 35→1, 38→2,5 (empat, es reparteix entre les posicions 2 i 3), 38→2,5, 41→4, 44→5, 45→6, 52→7, 61→8.
3. **Se sumen els rangs de cada grup per separat.** Grup nou (35, 38, 41, 44) → 1+2,5+4+5 = 12,5. Grup antic (38, 45, 52, 61) → 2,5+6+7+8 = 23,5.
4. **Es calcula l'estadístic U** amb $$U = R_1 - \frac{n_1(n_1+1)}{2}$$, on $$R_1$$ és la suma de rangs d'un grup i $$n_1$$ la seva mida: $$U_{nou} = 12,5 - \frac{4 \times 5}{2} = 2,5$$.
5. **Es compara aquest valor de U** amb una taula de valors crítics (o, com fa `wilcox.test()`, es calcula directament el p-valor associat): un U molt baix indica que un grup té sistemàticament rangs més baixos que l'altre.

### Wilcoxon (el mateix grup, abans i després)

**Exemple real:** una empresa forma els seus 20 comercials en una nova tècnica de venda i vol saber si les vendes de cadascun milloren respecte al mes anterior. Com que és **la mateixa persona** mesurada dues vegades (abans i després de la formació), no té sentit tractar-los com dos grups independents: cal comparar cada comercial amb ell mateix.

```r
vendes_abans   <- c(12, 15, 9, 20, 14, 11, 18, 13, 16, 10, 22, 15, 12, 19, 14, 17, 11, 13, 16, 20)
vendes_despres <- c(14, 17, 10, 21, 16, 13, 19, 15, 18, 12, 24, 16, 14, 21, 15, 18, 12, 15, 18, 22)
wilcox.test(vendes_abans, vendes_despres, paired = TRUE)
```

Un p-valor per sota de 0,05 indica que la millora general de vendes després de la formació és real i no explicable només per la variació habitual mes a mes.

**Càlcul manual** (5 comercials d'exemple): abans 12, 15, 9, 20, 14 · després 14, 17, 10, 21, 16.

1. **Es calcula la diferència** de cada parella (Després − Abans): +2, +2, +1, +1, +2.
2. **S'ordenen els valors absoluts de les diferències** de més petit a més gran i se'ls assigna un rang: |1|→1, |1|→2 (empat, es reparteix: 1,5 i 1,5), |2|→3, |2|→4, |2|→5 (empat triple, es reparteix la posició mitjana 4 entre els tres).
3. **Se separen els rangs segons el signe de la diferència original**, i se sumen per separat: com que totes les diferències són positives en aquest exemple, tots els rangs van al costat positiu ($$W^+ = $$ suma total) i $$W^- = 0$$.
4. **L'estadístic W és el mínim entre $$W^+$$ i $$W^-$$**: en aquest cas, $$W = 0$$.
5. Un W molt baix (allunyat del que s'esperaria si les diferències fossin a l'atzar positives i negatives per igual) indica una millora sistemàtica, no atzar.


## Comparar la forma de dues distribucions: K-S

Ja tractat en detall (fórmula, gràfic i codi complet en R i Python) en un [altre post]({% post_url 2022-08-02-kolmogorov-smirnov %}). A diferència de Mann-Whitney, que només mira si un grup tendeix a tenir valors més alts que l'altre, el K-S detecta **qualsevol** diferència de forma entre dues distribucions (mitjana, dispersió, asimetria...), no només un desplaçament.

**Exemple real:** una empresa de telecomunicacions vol saber si el temps de trucada dels clients del pla nou segueix el mateix patró general que el del pla antic (no només si la mitjana és diferent, sinó si tota la forma de la distribució ha canviat: potser ara hi ha més trucades molt curtes i també més de molt llargues).

**Càlcul manual (idea general):** s'ordenen totes les dades de cada mostra i es calcula, per a cada valor possible, quin percentatge de cada mostra queda per sota d'aquest valor (la funció de distribució acumulada empírica). Es resta aquest percentatge entre les dues mostres a cada punt, i l'estadístic $$D$$ és la diferència més gran trobada en tot el recorregut. El post enllaçat mostra aquest procés pas a pas amb un gràfic.


## Comparar més de dos grups

### Kruskal-Wallis

**Exemple real:** una cadena de supermercats vol comparar la despesa mitjana per tiquet en 3 botigues de barris diferents, per saber si hi ha diferències reals entre elles o si les diferències observades són simplement fluctuació normal. Amb mostres petites o despeses molt esbiaixades (alguns tiquets molt grans), Kruskal-Wallis és l'opció adequada en lloc d'una ANOVA.

```r
despesa <- c(18, 22, 15, 30, 34, 28, 45, 50, 41)
botiga  <- factor(rep(c("Nord", "Centre", "Sud"), each = 3))
kruskal.test(despesa ~ botiga)
```

**Càlcul manual** (amb les mateixes 9 dades, 3 per botiga): Nord 18, 22, 15 · Centre 30, 34, 28 · Sud 45, 50, 41.

1. **Es barregen totes les dades i s'ordenen**, assignant un rang de l'1 al 9: 15→1, 18→2, 22→3, 28→4, 30→5, 34→6, 41→7, 45→8, 50→9.
2. **Se sumen els rangs per grup:** Nord = 1+2+3 = 6, Centre = 4+5+6 = 15, Sud = 7+8+9 = 24.
3. **S'aplica la fórmula de l'estadístic H:**

$$H = \frac{12}{N(N+1)} \sum_{i} \frac{R_i^2}{n_i} - 3(N+1)$$

on $$N$$ és el nombre total d'observacions (9) i $$R_i$$, $$n_i$$ la suma de rangs i la mida de cada grup:

$$H = \frac{12}{9 \times 10}\left(\frac{6^2}{3} + \frac{15^2}{3} + \frac{24^2}{3}\right) - 3 \times 10 = \frac{12}{90}(12 + 75 + 192) - 30 = 37,2 - 30 = 7,2$$

4. **Es compara H amb una distribució Chi-quadrat** amb (nombre de grups − 1) graus de llibertat (aquí, 2): un valor de H tan alt com 7,2 amb només 2 graus de llibertat ja se situa per sota del 0,05 de significació, indicant que almenys una botiga difereix de la resta.

### Friedman

**Exemple real:** una empresa de software demana als mateixos 6 usuaris que valorin la seva satisfacció (d'1 a 10) amb 3 versions diferents d'una app, per saber si alguna versió agrada sistemàticament més que les altres. Com que són **els mateixos usuaris** valorant les 3 versions, cal un test per a dades aparellades amb més de dues condicions.

```r
valoracions <- matrix(c(
  6, 8, 7,
  5, 7, 6,
  7, 9, 8,
  6, 8, 8,
  4, 6, 5,
  7, 9, 7
), ncol = 3, byrow = TRUE, dimnames = list(NULL, c("VersioA", "VersioB", "VersioC")))
friedman.test(valoracions)
```

**Càlcul manual (idea general):** per a cada usuari, es converteixen les seves 3 valoracions en rangs (1 a la pitjor versió per a ell, 3 a la millor). Se sumen els rangs de cada versió entre tots els usuaris, i com més diferents siguin aquestes sumes entre versions, més gran serà l'estadístic resultant (que després es compara, igual que a Kruskal-Wallis, amb una distribució Chi-quadrat).


## Associació i correlació

### Correlació de Spearman

**Exemple real:** un departament de RRHH vol saber si els empleats amb més anys d'antiguitat tendeixen a tenir una satisfacció laboral més alta, sense assumir que la relació sigui exactament una línia recta (potser creix ràpid els primers anys i després s'estabilitza).

```r
antiguitat  <- c(1, 2, 3, 4, 5, 6, 7, 8)
satisfaccio <- c(3, 4, 4, 6, 5, 7, 8, 9)
cor.test(antiguitat, satisfaccio, method = "spearman")
```

**Càlcul manual:**

1. **Es converteix cada variable en rangs per separat.** Antiguitat ja està ordenada (rangs 1 a 8). Satisfacció (3,4,4,6,5,7,8,9) → rangs 1, 2,5, 2,5, 5, 4, 6, 7, 8 (el 4 apareix dues vegades i es reparteix la posició mitjana 2,5).
2. **Es calcula la diferència de rangs ($$d$$) per a cada parella** i s'eleva al quadrat: per exemple, a la quarta observació, antiguitat té rang 4 i satisfacció rang 5, així que $$d = -1$$, $$d^2 = 1$$.
3. **Se sumen tots els $$d^2$$.**
4. **S'aplica la fórmula:**

$$\rho = 1 - \frac{6\sum d_i^2}{n(n^2-1)}$$

Amb $$n=8$$ observacions i la suma de $$d^2$$ calculada al pas anterior, $$\rho$$ dona un valor proper a 0,9, indicant una relació monòtona forta i positiva entre antiguitat i satisfacció.

Existeix una alternativa a Spearman, la **correlació de Kendall**, que sol preferir-se amb mostres molt petites o quan hi ha molts valors repetits; en la pràctica, gairebé sempre és intercanviable amb Spearman (`cor.test(x, y, method = "kendall")`).

### Chi-quadrat d'independència

**Exemple real:** una marca vol saber si la preferència entre dos dissenys d'envàs (A o B) depèn del gènere del client, o si és independent d'aquesta variable.

```r
taula <- matrix(c(30, 20, 15, 35), nrow = 2,
                 dimnames = list(Genere = c("H", "D"), Prefereix = c("A", "B")))
chisq.test(taula)
```

**Càlcul manual** (amb la mateixa taula 2x2: 30 homes prefereixen A, 20 homes prefereixen B, 15 dones prefereixen A, 35 dones prefereixen B):

1. **Es calcula la freqüència esperada de cada cel·la** si no hi hagués cap relació entre gènere i preferència: $$E = \frac{\text{total fila} \times \text{total columna}}{\text{total general}}$$. Per a "Home-A": $$\frac{50 \times 45}{100} = 22,5$$.
2. **Es repeteix per a les 4 cel·les:** Home-B → 27,5; Dona-A → 22,5; Dona-B → 27,5.
3. **Es compara cada freqüència observada amb l'esperada** amb la fórmula:

$$\chi^2 = \sum \frac{(O-E)^2}{E}$$

Per a Home-A: $$\frac{(30-22,5)^2}{22,5} = 2,5$$. Sumant les 4 cel·les s'obté un $$\chi^2$$ total al voltant de 9,9.

4. **Es compara aquest valor amb una distribució Chi-quadrat** amb 1 grau de llibertat (files−1 × columnes−1): un valor tan alt com 9,9 supera clarament el llindar de significació, indicant que la preferència **sí** depèn del gènere en aquest exemple.


## Estimació i remostreig

### Bootstrapping

Ja tractat en detall en un [altre post]({% post_url 2020-11-11-intervals-bootstrapping %}): en lloc d'assumir una distribució teòrica, genera milers de rèpliques de la mostra original (amb reposició) per aproximar la distribució d'un estadístic qualsevol —mitjana, mediana, correlació, un coeficient de regressió— sense necessitat de fórmula analítica.

- **Quan fer-lo servir:** calcular intervals de confiança per a estadístics sense fórmula teòrica senzilla, o quan les dades no compleixen els supòsits necessaris per a la fórmula clàssica.
- **Càlcul manual:** no aplicable — és, per definició, un mètode de simulació amb milers d'iteracions per ordinador, no un procediment que es faci a mà.

### Tests de permutació

Tècnica de remostreig relacionada amb el bootstrap: en lloc de mostrejar amb reposició, es **redistribueixen aleatòriament les etiquetes de grup** entre les observacions, es recalcula l'estadístic d'interès milers de vegades, i es compara el valor observat original amb aquesta distribució simulada sota la hipòtesi nul·la.

**Exemple real:** Imagina que provem un curs ràpid i volem veure si funciona.
- **Grupo A (Control - Sense curs):** 10 alumnes: Notes finals `[5, 6, 5, 4, 6, 7, 5, 4, 6, 5]` *(Mitjana = 5.3)*
- **Grupo B (Experimental - Amb curs):** 10 alumnes: Notes finals `[7, 8, 6, 7, 8, 9, 7, 6, 8, 7]` *(Mitjana = 7.3)*
- La diferència real entre les mitjanes dels nostres grups originals és: \[\text{Media}_B - \text{Media}_A = 7.3 - 5.3 = \mathbf{2.0} \text{ punts}\]

**Càlcul manual**

1. Unir i barrejar: Juntem les 20 notes en una sola llista sense importar a quin grup pertanyen: `[5, 6, 5, 4, 6, 7, 5, 4, 6, 5, 7, 8, 6, 7, 8, 9, 7, 6, 8, 7]`.
2. Repartir a l’atzar: Tornem a dividir aquests 20 números a l’atzar en dos grups falsos de 10 notes cadascun.
3. Calcular la diferència falsa: Calculem la diferència de mitjanes d’aquests dos nous grups barrejats.
4. Repetir moltes vegades: Fem aquest procés milers de vegades per veure quantes vegades la diferència a l’atzar és igual o superior a la nostra original de 2.0.
5. Resultat (Valor p): Si de 10.000 barreges a l’atzar, només en 5 ocasions surt una diferència de 2.0 o més, el valor `p = 7 / 10000 = 0,0005 (0,07%)`. Com que és un nombre molt petit (menor al 5%), deduïm que el curs sí que té efecte i que no ha estat una casualitat.


## Regressió no paramètrica: LOESS

Quan la relació entre variables no és lineal i no es vol assumir cap forma funcional concreta, les tècniques de suavitzat local com **LOESS** (ja tractada en un [altre post]({% post_url 2018-06-09-suavitzat-polinomic %}), amb gràfic i codi en R i Python) permeten estimar la tendència directament de les dades, sense ajustar una única equació global.

- **Quan fer-la servir:** explorar visualment una relació abans de decidir quina forma funcional té sentit, o quan la relació canvia de comportament al llarg del rang de la variable explicativa.
- **Càlcul manual:** no és pràctic a mà (implica desenes de regressions locals ponderades), però el post enllaçat n'explica la lògica pas a pas.


## Resum

L'estadística no paramètrica no és un "segon plat" per quan les dades no compleixen els requisits dels tests clàssics; és una família de mètodes amb el seu propi criteri d'ús, especialment valuosa amb mostres petites, dades esbiaixades o variables ordinals i categòriques. El criteri pràctic més senzill és comprovar primer els supòsits del test paramètric equivalent (normalitat, homogeneïtat de variàncies, mida de mostra) i, si no es compleixen amb prou garantia, recórrer a l'alternativa no paramètrica corresponent d'aquesta llista.

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
