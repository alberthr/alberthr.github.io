---
layout: post
title: "L'index de Herfindahl (o de Concentracio)"
tags:
  - estadistica
  - publicitat
---

L’índex d’Herfindahl (H-Index) és una mesura utilitzada en economia i dret de la competència per avaluar el grau de concentració de mercat d’un sector o una indústria. En poques paraules, aquest indicador ens ajuda a determinar com de concentrat o competitius són els mercats, i si existeix un risc d’abús de poder de mercat per part d’algunes empreses dominants.

Fa uns anys se'm va acudir fer servir aquest index com a part d'una calculadora que estimava cobertures de TV. La idea original era que a més concentració de GRPs en poques cadenes, més limitada estaria la cobertura de la campanya. De la mateixa manera també es calculava un index per veure com de concentrada estava la campanya en franges horaries. La calculadora era una mica més complexa que només calcular l'index de concentracio per cadenes i franges i tenia en compte mes indicadors com la quantitat de GRPs. A part, el pes de cada cadena i franja estava ponderat, no es el mateix concentrar tota una campanya de TV de Matinada que fer-ho en Prime Time.

## Com es calcula l’Índex d’Herfindahl?

L’índex d’Herfindahl es calcula sumant els quadrats de la quota de mercat de totes les empreses que operen en l’àmbit analitzat. La fórmula és:

<center>$H = \sum_{i=1}^{N} s_i^2$</center>

on:
- $\(s_i\)$ és la quota de mercat (en percentatge o en proporció) de l’empresa \(i\).
- $\(N\)$ és el nombre d’empreses en el mercat.

Per a major precisió, sovint es treballa amb quotes en forma decimal (per exemple, 0,25 en lloc de 25%).

## Exemple de càlcul

Imaginem un mercat amb 3 empreses:
- Empresa A té un 50% de quota.
- Empresa B té un 30% de quota.
- Empresa C té un 20% de quota.

Primer, expressem aquestes quotes en decimals: 0,50; 0,30; 0,20.

Aplicarem la fórmula:

<center>$H = 0,50^2 + 0,30^2 + 0,20^2 = 0,25 + 0,09 + 0,04 = 0,38$</center>

L’índex d’Herfindahl en aquest cas és 0,38 (o 3.8 si expressat en '%').

## Interpretació de l’Índex d’Herfindahl

- **Hers-Blacklowing (per a mercats molt competitius):** Els valors baixos, propers a 0, indiquen un mercat amb moltes empreses petites i poca concentració.
- **Mercats molt concentrats:** Valors alts, propers a 1 (o 10.000 si s’utilitza escales de 0 a 10.000, habitualment en alguns informes de regulació), indiquen que unes poques empreses dominen el mercat.
- **Risc de monopoli o oligopoli:** Quan la suma de les quotes quadrades és alta, hi ha risc de pràctiques anticoncurrencials i de manca de innovació.

Per exemple:
- Un índex de 0,01 (o 100 en escala 0-10.000) indica un mercat amb molta competència.
- Un índex de 0,90 (9000 en escala 0-10.000) indica un mercat molt concentrat, possiblement controlat per una o poques empreses.

## Utilitats de l’Índex d’Herfindahl

L’índex d’Herfindahl és especialment útil en:

1. **Regulació de mercats:** Autoritats de competència utilitzen aquest índex per decidir si una fusió o adquisició pot reduir la competència i crear una posició de monopoli o oligopoli. Per exemple, si la fusió d’aturables empreses incrementa notablement l’índex, pot ser considerat una amenaça per a la competència.
2. **Anàlisi de concentració de mercat:** Empreses i inversors poden utilitzar l’índex per veure si un mercat està saturat o si encara hi ha espai per a nous entrants.
3. **Investigació acadèmica i economia:** Analitzar com la concentració afecta els preus, la innovació i els estàndards de qualitat.

## Limitacions

Encara que és una mesura útil, l’índex d’Herfindahl també té justificacions limitades:
- No reflecteix la potència relativa real de l’empresa (una empresa amb 80% pot tenir més poder que dues amb 25% i 25%).
- No considera la importància diferencial dels productes o serveis.
- No mostra la naturalesa de la competència (competència real o d’antics monopolis inquietats per possibles autoritats).

## Conclusió

L’índex d’Herfindahl és una eina clau per entendre com de concentrat està un mercat i per ajudar reguladors i empreses a prendre decisions informades sobre competència i fusió. Més que una mesura definitiva, és un indicador que, en combinació amb altres, permet obtenir una imatge clara de la naturalesa competitiu d’un sector.
