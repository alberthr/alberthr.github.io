---
layout: post
title: "Resultats no significatius en anàlisis estadístics"
tags:
  - estadistica
excerpt: "Un resultat no significatiu no equival a l'absència d'efecte. Causes habituals, criteris d'interpretació i accions recomanades davant de resultats que no arriben al llindar de significació."
---

En l'anàlisi de dades és habitual trobar resultats que, a simple vista, semblen prometedors —o decebedors— però que, en aplicar-hi una prova estadística, no arriben al llindar de significació (normalment un *p*-valor inferior a 0,05, o un interval de confiança que no inclou el zero).

Repasso com interpretar resultats que, tot i mostrar tendències positives o negatives, no arriben a ser estadísticament significatius, i quines accions es poden seguir per prendre decisions ben fonamentades a partir d'ells.


## Significat d'un resultat no significatiu

Un resultat *no significatiu* no implica l'absència d'un efecte real, ni que aquest efecte manqui d'importància pràctica. La *significació estadística* és una eina que indica que, amb el nivell de confiança fixat (per exemple, el 95%), no es pot descartar que la diferència observada s'hagi produït per atzar.

Dit d'una altra manera: **no tenir prou evidència que hi ha un efecte no és el mateix que tenir evidència que no n'hi ha.**

La manca de significació pot tenir diverses causes:

- **Mida de mostra insuficient:** una mostra petita redueix la capacitat de l'anàlisi per detectar efectes reals (la *potència* estadística).
- **Variabilitat elevada:** quan les dades tenen molta dispersió, és més fàcil que un efecte real quedi amagat darrere del soroll.
- **Efectes petits o moderats:** alguns efectes són massa petits per detectar-se amb els recursos (mostra, mètode) disponibles.
- **El context:** és possible que la hipòtesi nul·la sigui certa, o que l'evidència disponible encara no sigui suficient per confirmar res en cap dels dos sentits.

Concloure que "no funciona" únicament perquè el resultat no és estadísticament significatiu és, per tant, un error habitual. La manca de significació no hauria de portar a conclusions precipitades.


## Exemple il·lustratiu

Un cas típic: valorar si un nou disseny de pàgina web augmenta la taxa de conversió. Una prova A/B dona el resultat següent:

- Versió actual: 4,2% de conversió
- Versió nova: 4,8% de conversió
- *p*-valor: 0,11 (no significatiu amb el llindar habitual de 0,05)

La conclusió, amb aquestes dades, és **encara limitada**. La diferència apunta en una direcció positiva, però no es pot assegurar que no sigui fruit de l'atzar. Si l'interval de confiança va, per exemple, de -0,3% a +1,5%, l'efecte real podria anar des de lleugerament negatiu fins a clarament positiu: encara hi ha massa incertesa per prendre una decisió ferma.

En aquest cas, la pregunta rellevant no és "funciona o no funciona?", sinó "hi ha prou informació per saber-ho?".


## Interpretació de tendències no significatives

- **Optimisme amb prudència:** una tendència positiva (per exemple, un tractament que sembla beneficiar els pacients, o un canvi que sembla millorar una mètrica de negoci) amb un *p*-valor superior a 0,05 no s'ha de descartar automàticament. Pot indicar un efecte real que encara no s'ha pogut detectar amb la mostra o el disseny disponibles.
- **Escepticisme saludable:** tampoc convé sobreinterpretar aquests resultats com si fossin una prova definitiva. La manca de significació estadística és un avís per anar amb compte i no treure conclusions massa ràpid.
- **Context de negoci:** val la pena avaluar si l'efecte observat té sentit pràctic, no només estadístic. Un efecte pot ser rellevant a la pràctica encara que no arribi al llindar estadístic.


## Accions recomanades

Algunes estratègies útils davant d'un resultat no significatiu:

- **Revisar la potència de l'estudi:** la potència és la probabilitat de detectar un efecte real si efectivament existeix. Si la mida de la mostra era insuficient, es pot considerar ampliar-la o combinar dades de diversos estudis mitjançant una metaanàlisi.
- **Analitzar l'interval de confiança:** indica el rang probable de l'efecte real. Un interval ampli, que inclou tant valors positius com negatius, reflecteix molta incertesa i la necessitat de més dades.
- **Valorar la rellevància pràctica:** cal determinar si l'efecte observat, encara que no sigui estadísticament significatiu, té importància real en la pràctica.
- **Fer anàlisis addicionals:** explorar subgrups, altres mètriques o altres mètodes estadístics pot aportar informació complementària útil.
- **Considerar un test a una cua, si està justificat:** quan, abans de mirar les dades, només interessa una direcció de l'efecte (per exemple, si una mètrica *millora*, no si empitjora), un test a una cua concentra tot el llindar de significació en aquesta direcció i guanya potència sense necessitat de més mostra. Aquesta decisió s'ha de prendre **abans** de veure els resultats i, idealment, quedar registrada en el pla d'anàlisi. Canviar de dues cues a una cua *després* de veure que el resultat anava en una direcció sense arribar al llindar és una forma de *p*-hacking: un ajust de les regles a posteriori per fer que el resultat "encaixi".


## Errors comuns a evitar

- **"Dragar" les dades fins trobar significació (*p*-hacking):** provar moltes mètriques, subgrups o talls de dades diferents fins trobar-ne un amb *p* < 0,05 no soluciona el problema, l'amaga. Amb prou comparacions, sempre n'hi haurà alguna significativa només per atzar.
- **Confondre "no significatiu" amb "no hi ha efecte":** són conceptes diferents, i cal ser curós amb el llenguatge utilitzat per comunicar-ho.
- **Canviar la hipòtesi a posteriori:** si el resultat no surt com s'esperava, la pregunta de recerca no s'ha de redefinir a posteriori per fer que "encaixi" amb les dades ja obtingudes.
- **Ignorar la mida de l'efecte:** centrar-se únicament en si el *p*-valor passa o no el llindar de 0,05, sense considerar la magnitud ni la rellevància pràctica de l'efecte, fa perdre informació valuosa.


## Recomanació general

La recomanació clau davant d'aquests casos és mantenir una actitud equilibrada:

- **No sobreinterpretar ni descartar automàticament els resultats no significatius.**
- **Combinar l'evidència estadística amb el context pràctic o de negoci.**
- **Comunicar els resultats de manera transparent**, incloent-hi la potència de l'estudi, els intervals de confiança i les limitacions existents.
- **Fomentar la replicació i l'acumulació d'evidència** mitjançant estudis addicionals.

Els resultats parcialment positius o negatius, encara que no arribin a la significació estadística, formen part del procés de construcció de coneixement i no s'han de tractar com a conclusions definitives.


## Conclusió

Interpretar resultats que no arriben a la significació estadística requereix una mirada àmplia, que tingui en compte la mida de l'efecte, els intervals de confiança, la potència de l'estudi i el context pràctic. Evitar decisions precipitades i fomentar la recerca addicional, amb un enfocament transparent i crític, és el que permet avançar cap a conclusions més robustes i útils.
