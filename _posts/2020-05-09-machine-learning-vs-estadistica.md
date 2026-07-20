---
layout: post
title: "Machine Learning vs. Estadística Tradicional"
tags:
  - machine-learning
  - estadistica
excerpt: "Sovint es presenten com a competidors, però responen preguntes diferents. Diferències de filosofia, fortaleses de cadascuna, i criteris pràctics per decidir quina fer servir en cada situació."
---

És habitual sentir parlar del Machine Learning i l'estadística tradicional com si fossin dos bàndols enfrontats, o pitjor, com si el primer hagués "substituït" la segona. La realitat és més interessant: comparteixen bona part de les eines matemàtiques (una regressió lineal és, alhora, un mètode estadístic clàssic i el model de Machine Learning més senzill possible), però parteixen de filosofies i objectius diferents. Entendre aquesta diferència de fons és més útil que triar "bàndol".


## La diferència de fons: explicar vs. predir

La distinció més important no és de tècnica, sinó **d'objectiu**:

- L'**estadística tradicional (inferencial)** busca **entendre i explicar** una relació: quin és l'efecte del preu sobre les vendes, i amb quina certesa es pot afirmar que aquest efecte és real i no fruit de l'atzar. La pregunta central és "per què passa això, i quant s'hi pot confiar?".
- El **Machine Learning (predictiu)** busca **predir amb la màxima precisió possible** un resultat futur o desconegut, encara que el "com" quedi amagat dins d'un model difícil d'interpretar. La pregunta central és "què passarà, encara que no se sàpiga exactament per què?".

Aquesta diferència d'objectiu és la que explica gairebé totes les altres diferències pràctiques que hi ha entre tots dos enfocaments.


## Filosofia i supòsits

### Estadística tradicional: parteix d'un model teòric

Un model estadístic clàssic comença amb una hipòtesi sobre com funciona el fenomen (per exemple, "les vendes depenen linealment del preu i la publicitat"), i després n'estima els paràmetres a partir de les dades, verificant si els supòsits del model (normalitat, independència, homocedasticitat...) es compleixen. Els coeficients tenen significat directe i interpretable, acompanyats d'una mesura de la seva incertesa (error estàndard, interval de confiança, p-valor).

### Machine Learning: deixa que les dades defineixin la forma

Un model de ML, especialment els no lineals (arbres, xarxes neuronals, *gradient boosting*), imposa molts menys supòsits sobre la forma de la relació: deixa que sigui l'algoritme qui descobreixi patrons complexos, interaccions i no linealitats directament de les dades. A canvi, sol renunciar a la interpretabilitat directa i, sovint, a la quantificació formal de la incertesa (tot i que existeixen tècniques per aproximar-la, com el bootstrap o els intervals de predicció).


## Fortaleses de l'estadística tradicional

- **Interpretabilitat i causalitat:** els coeficients d'una regressió es poden llegir directament ("cada euro addicional de preu redueix les vendes en X unitats"). Amb dissenys adequats (experiments, variables instrumentals, diferències en diferències), permet aproximar-se a preguntes causals, no només correlacionals.
- **Quantificació rigorosa de la incertesa:** intervals de confiança, p-valors i tests d'hipòtesi donen un marc formal per dir "aquest efecte és real amb un 95% de confiança", cosa que la majoria de mètodes de ML no ofereixen de manera nativa (encara que sí que compten amb el seu propi arsenal de [mètriques d'avaluació]({% post_url 2020-02-04-avaluacio-machine-learning %}) per quantificar el rendiment predictiu).
- **Funciona bé amb poques dades:** un model amb pocs paràmetres (com una regressió lineal) pot estimar-se de manera fiable amb mostres relativament petites; un model de ML complex normalment necessita molt més volum de dades per no sobreajustar.
- **Transparència regulatòria:** en sectors com la banca, les assegurances o la sanitat, sovint cal poder justificar per què un model ha pres una decisió concreta (per exemple, denegar un crèdit); un model estadístic clàssic ho permet de manera directa.


## Fortaleses del Machine Learning

- **Capacitat predictiva en problemes complexos:** quan la relació entre variables és altament no lineal, amb moltes interaccions, el ML sol superar clarament els mètodes clàssics en precisió pura (reconeixement d'imatges, processament de llenguatge, detecció de frau amb patrons subtils).
- **Escala amb grans volums de dades i variables:** els mètodes de ML solen aprofitar millor grans volums de dades i un nombre elevat de variables (fins i tot més variables que observacions), on la regressió clàssica té problemes tècnics (multicol·linealitat, sobreajust directe).
- **Menys supòsits previs:** no cal assumir a priori una forma funcional concreta; això és una avantatge quan realment no se sap com és la relació, però també un risc si es fa servir com a excusa per no pensar en el problema.
- **Automatització:** un cop entrenat i validat, un model de ML es pot integrar en un sistema que prengui (o suggereixi) decisions de manera automàtica i a gran escala, cosa que encaixa amb productes digitals i sistemes de recomanació.


## Quan fer servir cadascuna

Uns quants criteris pràctics, més que una regla estricta:

- **Si la pregunta és "per què passa X" o "quant efecte té Y sobre Z"**, i cal poder-ho defensar davant d'algú (un client, un regulador, un comitè de direcció): estadística tradicional.
- **Si la pregunta és "què passarà" i l'única cosa que importa és la precisió de la predicció**, sense necessitat d'explicar el mecanisme: Machine Learning.
- **Si les dades són poques** (desenes o pocs centenars d'observacions): estadística tradicional, o com a molt un model de ML molt senzill i fortament regularitzat.
- **Si les dades són moltes i la relació és clarament no lineal** (imatges, text, sèries amb patrons complexos): Machine Learning.
- **Si cal justificar legalment o èticament una decisió individual** (aprovar un préstec, un diagnòstic): estadística tradicional, o ML amb tècniques d'explicabilitat (SHAP, LIME) que aproximen una lectura interpretable.
- **Si l'objectiu és fonamentalment exploratori**, per entendre l'estructura de les dades abans de decidir res més: sovint és més ràpid i clar començar amb eines estadístiques (correlacions, regressions simples, tests de significació) abans d'invertir temps entrenant un model de ML.


## La zona de solapament

La divisió no és tan neta com sembla, i cada vegada ho és menys:

- Una **regressió lineal** és, alhora, l'eina bàsica de l'estadística inferencial i el punt de partida habitual de qualsevol curs de ML.
- Els mètodes de **regularització** (Ridge, Lasso) neixen de l'estadística però es fan servir constantment en ML per controlar el sobreajust.
- L'**estadística bayesiana** ofereix un pont natural: models amb estructura probabilística clara (com l'estadística clàssica) però amb la flexibilitat d'incorporar informació prèvia i gestionar la incertesa de manera similar a com ho fan alguns mètodes moderns de ML.
- Tècniques com **SHAP** o **LIME** intenten portar interpretabilitat estil estadística clàssica a models de ML que, per naturalesa, no en tenen.
- En la pràctica professional (per exemple, en Marketing Mix Modeling), sovint es combinen totes dues: un nucli de regressió interpretable amb transformacions no lineals (corbes de saturació, ad-stock) inspirades en tècniques més properes al ML.


## Taula resum

| | Estadística Tradicional | Machine Learning |
|---|---|---|
| **Objectiu principal** | Explicar i inferir | Predir |
| **Punt de partida** | Hipòtesi/model teòric previ | Patrons descoberts a les dades |
| **Interpretabilitat** | Alta (coeficients directes) | Variable (baixa en models complexos) |
| **Quantificació d'incertesa** | Formal (IC, p-valors) | Menys habitual, sovint aproximada |
| **Volum de dades necessari** | Pot funcionar amb poques dades | Sol necessitar-ne moltes |
| **Relacions no lineals complexes** | Limitat sense transformacions manuals | Punt fort natural |
| **Justificació regulatòria/legal** | Directa | Requereix eines addicionals (SHAP, LIME) |


## Conclusió

Plantejar Machine Learning i estadística tradicional com a rivals és, sobretot, un error de marc. Són dues caixes d'eines amb objectius diferents —explicar amb rigor davant d'entendre i predir amb precisió—, i la decisió de quina fer servir hauria de dependre de la pregunta que cal respondre, no d'una preferència metodològica ni d'una moda. En molts projectes reals, especialment en analítica de negoci, la millor solució ni tan sols és triar-ne una: és fer servir l'estadística per entendre i validar la relació, i el ML (o tècniques inspirades en ell) per afinar-ne la capacitat predictiva allà on realment aporta valor. Per posar en pràctica el costat de Machine Learning d'aquesta reflexió, la [guia ràpida d'algoritmes en Python]({% post_url 2020-01-24-machine-learning-python-guia-rapida %}) és un bon punt de partida.
