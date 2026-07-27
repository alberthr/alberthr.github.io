---
layout: post
title: "Calcular la Cobertura a N+ Contactes a partir dels GRPs Totals"
tags:
  - publicitat
excerpt: "Com estimar la cobertura a qualsevol nivell de freqüència (2+, 3+, 5+...) a partir només del Reach a 1+ i els GRPs totals d'una campanya, aprofitant que el mitjà publicitari es comporta de manera matemàticament consistent."
---

Quan es planifica una campanya de mitjans, el primer indicador que s'obté sol ser el **Reach o Cobertura a 1+**: quin percentatge de la població ha estat exposada a l'anunci almenys una vegada. Però aquesta xifra amaga molta informació. Dins d'aquest mateix Reach hi ha persones que han vist l'anunci una sola vegada i persones que l'han vist deu. Per avaluar si una campanya té prou **freqüència efectiva**, cal poder desglossar aquesta cobertura global en trams: Cobertura a 2+, a 3+, a 5+, etc.

El problema és que els estudis de planificació no sempre proporcionen aquest desglossament complet. En canvi, gairebé sempre es disposa de dues dades bàsiques: el **Reach a 1+** i els **GRPs totals** invertits. Amb només aquests dos valors, i assumint que el mitjà es comporta de manera prou regular, es pot reconstruir tota la corba de freqüència.


## El principi: la suma de totes les cobertures és igual als GRPs

La publicitat, per molt creativa que sigui la part de contingut, funciona per sota amb una lògica summament matemàtica. Un GRP (*Gross Rating Point*) és, per definició, una unitat d'impacte bruta: no distingeix si aquell impacte l'ha rebut una persona nova o una persona que ja n'havia rebut deu abans.

Això porta a una propietat molt útil: si se sumen tots els impactes rebuts per tota la població, el resultat és exactament el total de GRPs de la campanya. I aquest total d'impactes es pot descomposar com la suma de les cobertures a cada nivell de freqüència:

$$\text{GRP} = \sum_{n=1}^{\infty} C_n$$

La lògica és senzilla: la Cobertura a 1+ compta una vegada cada persona que ha rebut com a mínim un impacte. La Cobertura a 2+ torna a comptar cada persona que ha rebut com a mínim dos impactes (és a dir, aporta el "segon" impacte d'aquestes persones). La Cobertura a 3+ aporta el "tercer" impacte, i així successivament. Sumant tots els trams, cada impacte individual rebut per cada persona queda comptat exactament una vegada, i el resultat coincideix amb el total d'impactes bruts distribuïts, que és precisament la definició de GRP.

Aquesta identitat és el punt de partida per construir un model: si es coneix la forma en què decreix la cobertura tram a tram, i aquesta forma és consistent amb el total de GRP, s'ha trobat una manera de repartir la pressió publicitària entre els diferents nivells de freqüència. És exactament la condició que ha de complir el model de decaïment geomètric que es descriu a continuació.


## La fórmula: decaïment geomètric constant

El model parteix d'assumir que la cobertura decau amb una **ràtio constant entre nivells consecutius de freqüència**. Aquesta ràtio de decaïment es defineix com:

$$\text{Ràtio de Decaïment} = 1 - \frac{C_1}{\text{GRP}}$$

on $$C_1$$ és la Cobertura a 1+ i GRP són els GRPs totals de la campanya. Aquesta ràtio es pot interpretar com la "probabilitat" que una persona ja impactada rebi un impacte addicional, en relació amb el conjunt de la població. Com més alta és la freqüència mitjana (GRP entre $$C_1$$), més s'apropa la ràtio a 1 i més lentament decreix la cobertura entre trams; com més baixa és la freqüència mitjana, més ràpid cau la cobertura a mesura que puja el nivell exigit.

Amb aquesta ràtio, la cobertura a qualsevol nivell $$n+$$ ($$C_n$$) es calcula directament amb el model:

$$C_n = C_1 \cdot \left(1 - \frac{C_1}{\text{GRP}}\right)^{n-1}$$

Per a $$n=1$$, la fórmula retorna exactament el Reach conegut (l'exponent és 0), i cada nivell addicional es multiplica una vegada més per la ràtio de decaïment. És una progressió geomètrica molt senzilla de calcular amb un full de càlcul o de programar en qualsevol llenguatge, i és exactament el model que fa servir la calculadora d'aquest mateix blog.


## Una bona aproximació, no una llei exacta

És important no perdre de vista que aquest model és una **aproximació de planificació ràpida**, no el model exacte que faria servir un software de mitjans amb dades de panell. Assumeix que la cobertura decau amb una ràtio constant entre nivells consecutius, cosa que en la realitat no sempre passa exactament així.

Hi ha situacions on el mitjà real s'allunya d'aquest comportament ideal:

* **Mitjans amb capatge de freqüència (*frequency cap*):** moltes plataformes digitals limiten explícitament el nombre màxim d'impactes que una persona pot rebre (per exemple, 3 impactes per setmana). Passat aquest límit, la cobertura als trams superiors cau a zero de manera abrupta, en lloc de seguir decreixent de forma suau com prediu la progressió geomètrica.
* **Audiències amb hàbits de consum molt heterogenis:** si dins la població hi ha un grup molt petit que consumeix el mitjà de manera extrema (per exemple, algú que veu la televisió moltes hores al dia), aquest grup pot generar una cua de freqüències altes que no s'ajusta bé a una simple geometria constant.
* **Combinació de diversos mitjans o suports:** quan la xifra de GRPs prové de sumar diferents canals amb comportaments d'exposició molt diferents entre ells, la barreja resultant pot desviar-se del patró geomètric net d'un sol mitjà homogeni.

Malgrat aquestes limitacions, en la gran majoria de casos pràctics —un sol mitjà o un mix relativament homogeni, sense capatges agressius— aquesta aproximació funciona sorprenentment bé i és l'estàndard que fan servir moltes eines de planificació de mitjans per omplir taules de freqüència quan no es disposa de la corba completa.


## Completant la foto amb la fórmula de Nelder

El model d'aquest article reparteix la cobertura *entre trams de freqüència* per a un total de GRP fixat, però necessita partir sempre d'una $$C_1$$ coneguda. La pregunta que queda oberta és: d'on surt aquesta $$C_1$$ si es canvia el pressupost de la campanya?

Aquí és on entra en joc la [Logística de Nelder Modificada]({{ site.baseurl }}/entrades/logistica-nelder-hill/), descrita en un article anterior d'aquest blog: una funció de saturació que estima la Cobertura a 1+ per a qualsevol quantitat de GRP, no només per al punt concret observat en un estudi de planificació.

La combinació dels dos models dona la foto completa: amb Nelder s'obté la $$C_1$$ per a qualsevol nivell de GRP, i amb la fórmula de decaïment geomètric d'aquest article es reparteix aquesta $$C_1$$ entre tots els nivells de freqüència. El resultat és una taula de cobertura a qualsevol nivell de GRP i a qualsevol nivell de freqüència alhora, sense necessitat de disposar de dades de panell.


## Exemples numèrics

Per il·lustrar com varia el repartiment segons la pressió i la cobertura de partida, es mostren tres escenaris amb diferents combinacions de GRPs i Reach a 1+.

**Escenari A — Campanya de baixa pressió:** GRP = 150, $$C_1$$ = 55

$$\text{Ràtio de Decaïment} = 1 - \frac{55}{150} = 0.633$$

| Freqüència | 1+ | 2+ | 3+ | 4+ | 5+ |
|---|---|---|---|---|---|
| Cobertura | 55.0 | 34.8 | 22.0 | 13.9 | 8.8 |

Amb poca pressió relativa, la cobertura cau ràpidament tram a tram: arribar al 5+ només reté un 16% de la població total, senyal que la majoria de l'audiència ha rebut pocs impactes.

**Escenari B — Campanya de pressió mitjana:** GRP = 400, $$C_1$$ = 80

$$\text{Ràtio de Decaïment} = 1 - \frac{80}{400} = 0.800$$

| Freqüència | 1+ | 2+ | 3+ | 4+ | 5+ |
|---|---|---|---|---|---|
| Cobertura | 80.0 | 64.0 | 51.2 | 41.0 | 32.8 |

Amb una freqüència mitjana de 5 impactes ($$400/80$$), el decaïment és molt més suau: al tram 5+ encara es conserva un 41% de la població total, indicant una campanya amb bona acumulació de freqüència efectiva.

**Escenari C — Campanya de saturació alta:** GRP = 900, $$C_1$$ = 90

$$\text{Ràtio de Decaïment} = 1 - \frac{90}{900} = 0.900$$

| Freqüència | 1+ | 2+ | 3+ | 4+ | 5+ | 8+ |
|---|---|---|---|---|---|---|
| Cobertura | 90.0 | 81.0 | 72.9 | 65.6 | 59.0 | 43.0 |

Amb $$k = 0.9$$, la cobertura decreix molt lentament: fins i tot al tram 8+ es conserva un 43% de la població, típic d'una campanya de gran pressió on la major part de l'audiència ja assolida rep molts impactes addicionals en lloc de sumar audiència nova.

En els tres casos, si se sumessin tots els trams fins a l'infinit (o, a la pràctica, fins que la contribució és menyspreable), el resultat s'aproximaria al total de GRP de partida, tal com estableix la identitat inicial: $$\text{GRP} = \sum_{n=1}^{\infty} C_n$$.


## Calculadora

Per no haver de fer aquests càlculs a mà cada vegada, es pot fer servir la [Calculadora de Cobertura N+]({{ site.baseurl }}/eines/reach_frequency.html), que a partir del Reach a 1+ i els GRPs totals genera automàticament la taula completa de cobertura per a tots els nivells de freqüència, amb opció de copiar els resultats directament a Excel.
