---
layout: post
title: "Resultats no significatius en anàlisis estadístics"
tags:
  - estadistica
excerpt: "Trobar-se amb resultats no significatius quan s'analitzen dades és una situació molt comuna. Què significa exactament? Què hem de pensar quan passa això? Com hauríem d'actuar? Quines recomanacions hauríem de donar?"
---


En el món de l'anàlisi de dades, és habitual trobar-se amb resultats que, a simple vista, semblen prometedors —o al contrari, decebedors— però que, en aplicar-hi una prova estadística, no arriben al llindar de significació (normalment un *p*-valor inferior a 0,05, o un interval de confiança que no inclou el zero). Què hem de pensar en aquests moments? Els hem d'ignorar o hi ha altres coses a tenir en compte?

Com a nota personal, m'agradaria divagar una mica sobre com interpretar resultats que, tot i mostrar tendències prometedores o negatives, no arriben a ser estadísticament significatius, i quines accions seguir per prendre decisions ben fonamentades.


## Què vol dir, exactament, que un resultat no sigui significatiu

Primer de tot, cal recordar una cosa important: que un resultat *no sigui significatiu* no vol dir que no hi hagi un efecte real, ni que aquest efecte no tingui importància pràctica. La *significació estadística* és, simplement, una eina que ens diu que, amb el nivell de confiança que hem fixat (per exemple, el 95%), no podem descartar que la diferència que veiem s'hagi produït per atzar.

Dit d'una altra manera: **no tenir prou evidència que hi ha un efecte no és el mateix que tenir evidència de que no n'hi ha.**

Aquesta manca de significació pot tenir diverses causes:

- **Mida de mostra insuficient:** una mostra petita redueix la capacitat de l'anàlisi per detectar efectes reals (és el que en estadística en diem *potència*).
- **Variabilitat elevada:** quan les dades tenen molta dispersió, és més fàcil que un efecte real quedi amagat darrere del "soroll".
- **Efectes petits o moderats:** alguns efectes simplement són massa petits per detectar-se amb els recursos (mostra, mètode) que tenim disponibles.
- **El context:** és possible que la hipòtesi nul·la sigui certa de veritat, o que l'evidència que tenim encara no sigui suficient per confirmar res en cap dels dos sentits.

Per això, pensar que "no funciona" només perquè el resultat no és estadísticament significatiu pot ser un error. La manca de significació no ens hauria de portar a conclusions precipitades.


## Un exemple senzill

Imaginem que volem saber si un nou disseny de pàgina web augmenta la taxa de conversió. Fem una prova A/B i obtenim:

- Versió actual: 4,2% de conversió
- Versió nova: 4,8% de conversió
- *p*-valor: 0,11 (per tant, no significatiu amb el llindar habitual de 0,05)

Què en podem concloure? Doncs **no gaire cosa, encara**. La diferència apunta en una direcció positiva, però amb les dades que tenim no podem assegurar que no sigui fruit de l'atzar. Si mirem l'interval de confiança i veiem que va, per exemple, de -0,3% a +1,5%, això ens diu que l'efecte real podria anar des de lleugerament negatiu fins a clarament positiu. Encara hi ha massa incertesa per prendre una decisió ferma.

En aquest cas, la pregunta correcta no és "funciona o no funciona?", sinó "tenim prou informació per saber-ho?".


## Què pensar quan els resultats mostren una tendència, però no són significatius?

- **Optimisme amb prudència:** si veus una tendència positiva (per exemple, un tractament que sembla beneficiar els pacients, o un canvi que sembla millorar una mètrica de negoci) però amb un *p*-valor superior a 0,05, no cal descartar automàticament aquesta observació. Pot ser indicatiu d'un efecte real que, simplement, encara no s'ha pogut detectar amb la mostra o el disseny que tenim.
- **Escepticisme saludable:** però tampoc convé sobreinterpretar aquests resultats com si fossin una prova definitiva. La manca de significació estadística és un avís per anar amb compte i no treure conclusions massa ràpid.
- **Tenir en compte el context:** val la pena avaluar si l'efecte observat té sentit pràctic o de negoci, no només estadístic. De vegades, un efecte pot ser rellevant a la pràctica encara que no arribi al llindar estadístic.


## Quines accions podem seguir en aquests casos?

Algunes estratègies recomanables:

- **Revisar la potència de l'estudi:** la potència és la probabilitat de detectar un efecte real si efectivament existeix. La mida de la mostra era adequada? Si no ho era, es pot considerar ampliar-la, o combinar dades de diversos estudis mitjançant una metaanàlisi.
- **Mirar bé l'interval de confiança:** ens indica el rang probable de l'efecte real. Un interval ampli, que inclou tant valors positius com negatius, vol dir que hi ha molta incertesa i que caldrien més dades per treure'n una conclusió clara.
- **Valorar la rellevància pràctica:** cal determinar si l'efecte observat, encara que no sigui estadísticament significatiu, pot tenir importància real en la pràctica.
- **Fer anàlisis addicionals:** explorar subgrups, altres mètriques o altres mètodes estadístics pot aportar informació complementària útil.
- **Valorar un test a una cua, si està justificat:** si abans de mirar les dades ja sabíem que només ens interessava una direcció de l'efecte (per exemple, només volem saber si una mètrica *millora*, no si empitjora), un test a una cua concentra tot el llindar de significació en aquesta direcció i guanya potència sense necessitat de més mostra. Ara bé, aquesta decisió s'ha de prendre **abans** de veure els resultats i, idealment, deixar-la per escrit en el pla d'anàlisi. Canviar de dues cues a una cua *després* de veure que el resultat anava en una direcció però no arribava al llindar és, de fet, una forma de *p*-hacking: estàs ajustant les regles a posteriori per fer que el resultat "encaixi".


## Errors comuns a evitar

Quan ens trobem davant d'un resultat no significatiu, hi ha algunes trampes en les quals és fàcil caure:

- **"Dragar" les dades fins trobar significació (*p*-hacking):** provar moltes mètriques, subgrups o talls de dades diferents fins trobar-ne un que doni *p* < 0,05 no soluciona el problema, l'amaga. Si fem prou comparacions, n'hi haurà alguna significativa només per atzar.
- **Confondre "no significatiu" amb "no hi ha efecte":** com hem vist, són coses diferents. Cal ser curós amb el llenguatge que fem servir per comunicar-ho, tant a nosaltres mateixos com als altres.
- **Canviar la hipòtesi a posteriori:** si el resultat no surt com esperàvem, no s'ha de redefinir la pregunta de recerca a posteriori per fer que "encaixi" amb les dades que ja tenim.
- **Ignorar la mida de l'efecte:** centrar-se únicament en si el *p*-valor passa o no el llindar de 0,05, sense mirar la magnitud ni la rellevància pràctica de l'efecte, fa perdre informació valuosa.


## Quina hauria de ser la recomanació final?

La recomanació clau en aquests casos és mantenir una actitud equilibrada:

- **No sobreinterpretar ni descartar automàticament els resultats no significatius.**
- **Combinar l'evidència estadística amb el context pràctic o de negoci.**
- **Ser transparent en la comunicació dels resultats**, explicant la potència de l'estudi, els intervals de confiança i les limitacions que hi pugui haver.
- **Fomentar la replicació i l'acumulació d'evidència** mitjançant estudis addicionals.

En definitiva, els resultats parcialment positius o negatius, encara que no arribin a la significació estadística, s'han de considerar com una part més del procés de construcció de coneixement, i no com a conclusions definitives.


## Conclusió

Interpretar resultats que no arriben a la significació estadística requereix una mirada més àmplia, que tingui en compte la mida de l'efecte, els intervals de confiança, la potència de l'estudi i el context pràctic. La clau és evitar decisions precipitades i fomentar la recerca addicional, sempre amb un enfocament transparent i crític. Només així la ciència —i també l'anàlisi de dades aplicada— pot seguir avançant cap a conclusions més robustes i útils.