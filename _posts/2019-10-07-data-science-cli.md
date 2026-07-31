---
layout: post
title: "Guia ràpida Git Bash: La Command Line per Analitzar Dades"
tags:
  - cheatsheet
  - cli
excerpt: "Referència de Git Bash aplicada a l'anàlisi de dades: navegació, grep, sed i awk per filtrar, transformar i agregar, i pipes per encadenar-ho tot, amb exemples sobre un fitxer CSV fictici i les particularitats de treballar-hi a Windows."
---

Abans d'obrir un notebook o un IDE, moltes preguntes sobre un fitxer de dades es poden respondre directament des de la terminal: quantes files té, quines columnes conté, si hi ha valors buits, quina és la categoria més freqüent. En un entorn professional amb Windows, l'opció més accessible per fer-ho és **Git Bash**: s'instal·la juntament amb Git (que gairebé sempre ja hi és per control de versions), no requereix WSL ni permisos d'administrador addicionals, i ofereix un emulador de terminal Unix amb `grep`, `sed`, `awk` i la resta d'eines GNU habituals. Aquest post repassa les ordres més útils per a aquest tipus d'exploració des de Git Bash, aplicades sobre un fitxer d'exemple fictici perquè cada comanda es pugui seguir amb dades concretes en lloc d'una sintaxi abstracta. A sota de cada exemple s'hi desglossa peça per peça què fa cada flag, cada símbol i cada operador, perquè no calgui memoritzar-los de cop.

## El fitxer d'exemple

Totes les ordres d'aquest post s'apliquen sobre `vendes.csv`, un fitxer fictici amb 14 files que simula un registre de vendes per ciutat i categoria:

```
data,ciutat,categoria,import
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
2025-01-06,València,Electrònica,210.00
2025-01-07,Madrid,Roba,,
2025-01-08,Barcelona,Roba,89.90
2025-01-09,"Barcelona, ES",Electrònica,150.00
2025-01-10,Madrid,Electrònica,NA
2025-01-11,València,Alimentació,28.75
2025-01-12,Barcelona,Alimentació,40.00
2025-01-13,Madrid,Roba,65.20
2025-01-14,València,Roba,55.00
2025-01-15,Barcelona,Electrònica,175.30
2025-01-16,Madrid,Alimentació,NA
```

El fitxer inclou deliberadament alguns casos habituals en dades reals: un import buit (fila 5), valors marcats com `NA` (files 8 i 16), i un camp de text amb una coma dins de cometes (`"Barcelona, ES"`, fila 7), que servirà més endavant per il·lustrar un problema típic del processament línia a línia.

## Navegació i exploració de fitxers

| Ordre | Què fa |
|---|---|
| `pwd` | Mostra el directori actual (en format Unix, `/c/Users/...`) |
| `ls -lh` | Llista fitxers amb mida llegible |
| `find . -name "*.csv"` | Cerca fitxers CSV al directori actual i subdirectoris |
| `du -sh *.csv` | Mida de cada fitxer CSV |
| `wc -l dades.csv` | Nombre de línies (files + capçalera) |
| `head -n 5 dades.csv` | Primeres 5 línies |
| `tail -n 5 dades.csv` | Últimes 5 línies |
| `tail -f log.txt` | Segueix un fitxer en temps real |
| `file dades.csv` | Detecta el tipus de fitxer (no sempre disponible, vegeu nota) |
| `split -l 1000 dades.csv part_` | Trossos un fitxer gran en fitxers més petits |

Abans d'inspeccionar el contingut, sovint cal saber què hi ha al directori i quina mida tenen els fitxers. A Git Bash, `pwd` ja mostra la ruta en format Unix (`/c/Users/albert/vendes`), no `C:\Users\albert\vendes`:

```bash
$ ls -lh
total 4.0K
-rw-r--r-- 1 albert 197121 542 gen 31 12:50 vendes.csv

$ find . -name "*.csv"
./vendes.csv

$ du -sh *.csv
4.0K    vendes.csv
```

**Desglossat:**
- `ls -lh`: `ls` per si sol ja llista fitxers; `-l` canvia el format a "llarg" (una línia per fitxer, amb permisos, propietari i mida) enlloc d'una graella compacta; `-h` (*human-readable*) converteix la mida de bytes a KB/MB/GB llegibles. Els dos flags es poden combinar en un de sol perquè cap dels dos porta un valor darrere.
- `find . -name "*.csv"`: `find` sempre necessita un punt de partida — aquí `.`, és a dir "el directori actual" — i a partir d'aquí baixa recursivament per tots els subdirectoris. `-name "*.csv"` filtra només els fitxers el nom dels quals coincideixi amb el patró; l'asterisc és un comodí que substitueix qualsevol seqüència de caràcters, així que `"*.csv"` vol dir "qualsevol nom que acabi en `.csv`". Les cometes eviten que Bash intenti expandir l'asterisc ell mateix abans de passar-lo a `find`.
- `du -sh *.csv`: `du` (*disk usage*) mostra quant espai ocupa cada fitxer o directori indicat. `-s` (*summary*) fa que, si s'apliqués sobre un directori, només en surti el total i no un desglossat de cada fitxer intern; `-h` és el mateix "human-readable" que a `ls`. `*.csv`, sense cometes aquesta vegada, sí que es vol que Bash l'expandeixi abans: substitueix el patró per la llista real de fitxers CSV del directori i els passa tots com a arguments separats a `du`.

Per fer-se una idea ràpida del volum de dades, `wc -l` compta línies sense obrir el fitxer:

```bash
$ wc -l vendes.csv
15 vendes.csv
```

**Desglossat:** `wc` (*word count*) per defecte treu tres números — línies, paraules i bytes. `-l` li diu que mostri només el recompte de línies, que és la mètrica que sol interessar amb un CSV (una línia = una fila).

El resultat és 15 perquè inclou la capçalera; el fitxer té 14 files de dades.

`head` i `tail` mostren les primeres o últimes línies, útils per confirmar que el fitxer s'ha carregat bé o per revisar les entrades més recents sense obrir-lo sencer:

```bash
$ head -n 5 vendes.csv
data,ciutat,categoria,import
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
2025-01-06,València,Electrònica,210.00

$ tail -n 5 vendes.csv
2025-01-12,Barcelona,Alimentació,40.00
2025-01-13,Madrid,Roba,65.20
2025-01-14,València,Roba,55.00
2025-01-15,Barcelona,Electrònica,175.30
2025-01-16,Madrid,Alimentació,NA
```

**Desglossat:** `-n 5` indica a `head`/`tail` quantes línies mostrar; `-n` és el flag i `5` és el seu valor (van sempre junts, no és un flag "booleà" com `-l` o `-h`). Sense `-n`, tots dos mostren 10 línies per defecte. `head` compta des del principi del fitxer; `tail`, des del final.

`tail -f` és diferent: en lloc de mostrar un nombre fix de línies, es queda "escoltant" el fitxer i mostra les línies noves a mesura que s'afegeixen. És l'ordre habitual per seguir un log en temps real (no genera sortida fins que el fitxer creix):

```bash
$ tail -f log.txt
```

**Desglossat:** `-f` és de *follow*. A diferència de `-n`, no porta cap valor darrere: és un interruptor que canvia el comportament de `tail` de "llegir i acabar" a "llegir i quedar-se esperant més línies". Es talla amb `Ctrl+C`.

Finalment, `file` detecta el tipus de fitxer a partir del contingut, no de l'extensió, cosa útil quan un `.csv` resulta ser en realitat un TSV o té una codificació inesperada. **Nota per a Git Bash:** a diferència de `ls`, `find`, `du`, `wc`, `head`, `tail` o `grep` (que sí que venen incloses de sèrie), `file` no sempre està present segons la versió de Git for Windows instal·lada. Si l'ordre no es reconeix, una alternativa ràpida sense instal·lar res és mirar els primers bytes amb `head -c 100 vendes.csv | cat -v`, o simplement obrir el fitxer amb `code vendes.csv` (si es té VS Code) per veure la codificació al peu de la finestra.

```bash
$ file vendes.csv
vendes.csv: ASCII text
```

Quan un fitxer és tan gran que costa manejar-lo sencer (per obrir-lo en un editor, per enviar-lo per correu, o per processar-lo en paral·lel), `split` el trosseja en fitxers més petits sense tocar-ne el contingut:

```bash
$ split -l 1000 vendes.csv part_
$ ls part_*
part_aa
```

**Desglossat:** `-l 1000` indica que cada tros ha de tenir com a màxim 1000 línies (n'hi ha altres com `-b` per trossejar per mida en bytes enlloc de per línies). `vendes.csv` és el fitxer d'entrada. `part_` és el prefix amb què `split` anomena els fitxers resultants, afegint-hi sufixos alfabètics (`part_aa`, `part_ab`, `part_ac`...). Com que `vendes.csv` només té 15 línies (per sota del límit de 1000), tot cap en un únic fitxer, `part_aa`. En un CSV real de milions de files, aquest mateix exemple generaria diversos fitxers, cadascun processable per separat.

## Inspecció ràpida de dades tabulars

| Ordre | Què fa |
|---|---|
| `head -1 dades.csv \| tr ',' '\n'` | Llista les columnes (una per línia) |
| `cut -d',' -f1,3 dades.csv` | Selecciona les columnes 1 i 3 |
| `sort -t',' -k2 -n dades.csv` | Ordena pel valor numèric de la 2a columna |
| `uniq -c` | Compta línies repetides consecutives (cal `sort` abans) |
| `nl dades.csv` | Numera les línies del fitxer |

Un cop es confirma que el fitxer és correcte, el pas següent sol ser entendre'n l'estructura: quantes columnes té i com es diuen.

```bash
$ head -1 vendes.csv | tr ',' '\n'
data
ciutat
categoria
import
```

**Desglossat:** aquesta ordre en realitat en són dues, unides per un pipe (el símbol `|`, explicat en detall més avall). La primera part, `head -1 vendes.csv`, mostra només la primera línia del fitxer (`-1` és una forma abreujada d'escriure `-n 1`); com que la primera línia d'un CSV és la capçalera, el resultat és `data,ciutat,categoria,import`. Aquesta línia, en lloc de mostrar-se per pantalla, s'envia com a entrada a la segona part: `tr ',' '\n'`. `tr` (*translate*) substitueix caràcters un a un: el primer argument, `','`, és el caràcter a buscar (la coma), i el segon, `'\n'`, és pel qual es substitueix (un salt de línia). El resultat és que cada nom de columna, que abans estava separat per comes en una sola línia, ara ocupa la seva pròpia línia.

Per veure només algunes columnes sense carregar el fitxer sencer, `cut` selecciona per posició:

```bash
$ cut -d',' -f2,4 vendes.csv | head -5
ciutat,import
Barcelona,120.50
Madrid,45.00
Barcelona,32.10
València,210.00
```

**Desglossat:** `cut` divideix cada línia en "camps" segons un separador i en mostra només els que es demanin. `-d','` (*delimiter*) diu que el separador és la coma; sense aquest flag, `cut` assumiria per defecte el tabulador, que no serveix per a un CSV. `-f2,4` (*fields*) indica quins camps es volen, numerats des d'1: aquí la 2 (`ciutat`) i la 4 (`import`); es poden separar per comes per triar-ne diversos de no consecutius, o amb un guionet (`-f2-4`) per triar un rang. El `| head -5` final és només per no imprimir totes les 14 files a la pantalla en l'exemple.

Quan les columnes tenen longituds molt diferents, llegir el CSV separat per comes es fa incòmode. A Linux, l'eina habitual per alinear-ho en una taula visual és `column -t`; **a Git Bash aquesta ordre normalment no hi és** (`column` forma part d'`util-linux`, no de les eines GNU que Git for Windows inclou). L'alternativa sense instal·lar res és fer l'alineació amb `awk`:

```bash
$ awk -F',' '{printf "%-15s %-12s %-15s %-8s\n", $1, $2, $3, $4}' vendes.csv | head -5
data            ciutat       categoria       import
2025-01-03      Barcelona    Electrònica     120.50
2025-01-04      Madrid       Alimentació     45.00
2025-01-05      Barcelona    Alimentació     32.10
2025-01-06      València     Electrònica     210.00
```

**Desglossat:** `awk` es tracta amb més detall al seu propi apartat; de moment, `-F','` li diu que separi cada línia per comes, i `$1`, `$2`, `$3`, `$4` referencien la primera, segona, tercera i quarta columna resultants. `printf` és una funció d'impressió amb format, igual que en C o Python: la cadena `"%-15s %-12s %-15s %-8s\n"` defineix quatre "forats" de text (`%s`), cadascun amb una amplada mínima fixa (el número) i alineats a l'esquerra (el signe `-`; sense el signe, s'alinearien a la dreta). El `\n` final és el salt de línia; sense ell, totes les files quedarien enganxades en una de sola.

Si es prefereix tenir `column` disponible tal qual, cal instal·lar-lo a part (per exemple copiant el binari d'un MSYS2 complet); per a l'ús puntual, l'`awk` anterior sol ser suficient.

Per ordenar el fitxer segons una columna numèrica, `sort` amb `-t` (separador) i `-k` (columna clau) permet, per exemple, veure les vendes de major a menor import:

```bash
$ sort -t',' -k4 -nr vendes.csv | head -5
2025-01-06,València,Electrònica,210.00
2025-01-15,Barcelona,Electrònica,175.30
2025-01-03,Barcelona,Electrònica,120.50
2025-01-08,Barcelona,Roba,89.90
2025-01-13,Madrid,Roba,65.20
```

**Desglossat:** `-t','` marca la coma com a separador de columnes (igual que `-d` a `cut`, però `sort` en diu `-t` de *tabulació/tab*, encara que aquí no s'usi cap tab). `-k4` (*key*) indica que la clau d'ordenació és la columna 4 (l'import), no la línia sencera. `-n` fa que la comparació sigui numèrica (`"9" < "10"`) enlloc d'alfabètica (on `"9" > "10"` perquè "9" ve després de "1" lletra a lletra). `-r` inverteix l'ordre (*reverse*), de manera que el resultat vagi de major a menor en lloc de menor a major.

I `uniq -c`, aplicat després d'un `sort`, compta quantes vegades es repeteix cada valor consecutiu. Cal ordenar abans perquè `uniq` només agrupa línies idèntiques *adjacents*:

```bash
$ cut -d',' -f2 vendes.csv | sort | uniq -c
      1 "Barcelona
      1 ciutat
      5 Barcelona
      5 Madrid
      3 València
```

**Desglossat:** aquesta línia encadena tres ordres amb pipes. `cut -d',' -f2` extreu només la columna de ciutat de cada línia. `sort`, sense flags, ordena aquestes ciutats alfabèticament — pas imprescindible perquè el pas següent funcioni. `uniq -c`: `uniq` per si sol elimina línies duplicades consecutives; el flag `-c` (*count*) fa que, a més d'eliminar-les, mostri quantes vegades n'hi havia de cada abans d'agrupar-les.

Aquí ja es veu un primer efecte del problema de comes dins de text: `"Barcelona, ES"` no compta com a "Barcelona" perquè `cut`, en tallar per comes, ha partit aquest camp en dos (per això apareix la línia solta `"Barcelona`, amb la cometa d'obertura tallada). S'hi torna més endavant.

Per numerar les línies d'un fitxer, per exemple per referenciar-les ràpidament en una conversa o un informe, `nl` és més net que `cat -n` perquè no numera línies buides:

```bash
$ nl vendes.csv | head -5
     1  data,ciutat,categoria,import
     2  2025-01-03,Barcelona,Electrònica,120.50
     3  2025-01-04,Madrid,Alimentació,45.00
     4  2025-01-05,Barcelona,Alimentació,32.10
     5  2025-01-06,València,Electrònica,210.00
```

**Desglossat:** `nl` (*number lines*) no porta cap flag en aquest exemple; simplement rep el fitxer com a argument i n'imprimeix cada línia precedida del seu número.

## `grep`: buscar i filtrar

| Ordre | Què fa |
|---|---|
| `grep "Barcelona" dades.csv` | Línies que contenen "Barcelona" |
| `grep -i "barcelona" dades.csv` | Ignora majúscules/minúscules |
| `grep -v "Barcelona" dades.csv` | Línies que NO la contenen |
| `grep -c "Barcelona" dades.csv` | Compta les coincidències |
| `grep -n "error" log.txt` | Mostra el número de línia |
| `grep -E "2024\|2025" dades.csv` | Expressió regular (OR entre patrons) |
| `grep -r "TODO" ./scripts/` | Cerca recursiva dins un directori |

`grep` cerca línies que continguin un patró. Es crida sempre amb la forma `grep [flags] "patró" fitxer`: el patró entre cometes és el text a buscar, i el fitxer és on buscar-lo. És la eina més ràpida per confirmar si una dada existeix al fitxer sense obrir-lo:

```bash
$ grep "Barcelona" vendes.csv
2025-01-03,Barcelona,Electrònica,120.50
2025-01-05,Barcelona,Alimentació,32.10
2025-01-08,Barcelona,Roba,89.90
2025-01-09,"Barcelona, ES",Electrònica,150.00
2025-01-12,Barcelona,Alimentació,40.00
2025-01-15,Barcelona,Electrònica,175.30
```

Per defecte `grep` distingeix majúscules de minúscules; `-i` ho desactiva:

```bash
$ grep -i "barcelona" vendes.csv
2025-01-03,Barcelona,Electrònica,120.50
2025-01-05,Barcelona,Alimentació,32.10
2025-01-08,Barcelona,Roba,89.90
2025-01-09,"Barcelona, ES",Electrònica,150.00
2025-01-12,Barcelona,Alimentació,40.00
2025-01-15,Barcelona,Electrònica,175.30
```

**Desglossat:** `-i` (*ignore case*) fa que "Barcelona", "barcelona" i "BARCELONA" es considerin la mateixa coincidència. El resultat és idèntic a l'ordre anterior perquè totes les aparicions de "Barcelona" al fitxer ja fan servir majúscula inicial; `-i` es notaria si al fitxer hi hagués una entrada escrita com "BARCELONA" o "barcelona".

`-v` inverteix la cerca i mostra les línies que **no** contenen el patró, útil per descartar registres coneguts i inspeccionar la resta:

```bash
$ grep -v "Barcelona" vendes.csv
data,ciutat,categoria,import
2025-01-04,Madrid,Alimentació,45.00
2025-01-06,València,Electrònica,210.00
2025-01-07,Madrid,Roba,,
2025-01-10,Madrid,Electrònica,NA
2025-01-11,València,Alimentació,28.75
2025-01-13,Madrid,Roba,65.20
2025-01-14,València,Roba,55.00
2025-01-16,Madrid,Alimentació,NA
```

**Desglossat:** `-v` (*invert*) capgira la lògica de `grep`: en lloc de quedar-se amb les línies que coincideixen amb el patró, es queda amb les que NO hi coincideixen. Per això la capçalera hi surt (no conté "Barcelona") i totes les files de Madrid i València també.

Quan només interessa saber quantes coincidències hi ha, sense veure-les, `-c` retorna el recompte:

```bash
$ grep -c "Electrònica" vendes.csv
5
```

**Desglossat:** `-c` (*count*) substitueix la llista de línies coincidents per un sol número: quantes n'hi havia. El compte és 5 perquè `grep` busca text literal, línia a línia, sense saber res de columnes: també compta la fila 9 (`"Barcelona, ES",Electrònica,150.00`), on la coma extra dins les cometes desplaça les columnes però no impedeix que la paraula "Electrònica" hi aparegui igualment.

`-n` afegeix el número de línia al resultat, molt útil en fitxers de log per localitzar exactament on ha aparegut un error:

```bash
$ grep -n "NA" vendes.csv
9:2025-01-10,Madrid,Electrònica,NA
15:2025-01-16,Madrid,Alimentació,NA
```

**Desglossat:** `-n` (*line number*) anteposa a cada línia coincident el seu número dins el fitxer, separat per dos punts (`9:`, `15:`). Sense aquest flag, la sortida seria idèntica però sense saber a quina línia correspon cada resultat.

`-E` activa expressions regulars esteses, cosa que permet combinar patrons amb `|` (OR):

```bash
$ grep -E "Roba|Alimentació" vendes.csv
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
2025-01-07,Madrid,Roba,,
2025-01-08,Barcelona,Roba,89.90
2025-01-11,València,Alimentació,28.75
2025-01-12,Barcelona,Alimentació,40.00
2025-01-13,Madrid,Roba,65.20
2025-01-14,València,Roba,55.00
2025-01-16,Madrid,Alimentació,NA
```

**Desglossat:** `-E` (*extended regex*) canvia el "dialecte" de patrons que entén `grep`, activant símbols com el `|`. Aquí `"Roba|Alimentació"` s'ha de llegir com "Roba" O "Alimentació": qualsevol línia que contingui una de les dues paraules hi coincideix. Sense `-E`, el `|` es tractaria com un caràcter literal i no com un operador OR (per fer-ho sense `-E` caldria escapar-lo com `grep "Roba\|Alimentació"`).

I `-r` fa la cerca recursiva dins d'un directori sencer, útil per localitzar un terme (per exemple un `TODO`) en tot un projecte:

```bash
$ grep -r "TODO" ./scripts/
```

**Desglossat:** `-r` (*recursive*) fa que, en lloc de rebre un sol fitxer com a argument, `grep` rebi un directori (`./scripts/`) i el recorri sencer, entrant en tots els subdirectoris, buscant el patró a cada fitxer que hi trobi.

## `sed`: substituir i transformar

| Ordre | Què fa |
|---|---|
| `sed 's/,/;/g' dades.csv` | Substitueix comes per punt i coma |
| `sed -n '2,10p' dades.csv` | Imprimeix només les línies 2 a 10 |
| `sed '1d' dades.csv` | Elimina la primera línia (capçalera) |
| `sed 's/€//g' dades.csv` | Elimina el símbol € de tot el fitxer |
| `sed -i.bak 's/NA/0/g' dades.csv` | Substitueix "in place" i desa còpia `.bak` |

Mentre que `grep` filtra línies, `sed` les modifica. La transformació més habitual és la substitució de text amb `s/patró/reemplaçament/`:

```bash
$ sed 's/,/;/g' vendes.csv | head -3
data;ciutat;categoria;import
2025-01-03;Barcelona;Electrònica;120.50
2025-01-04;Madrid;Alimentació;45.00
```

**Desglossat:** `'s/,/;/g'` és la sintaxi pròpia de `sed`, amb quatre parts separades per barres: la `s` inicial indica "substitute"; entre la primera i la segona barra hi va el patró a buscar (`,`, la coma); entre la segona i la tercera hi va el reemplaçament (`;`, punt i coma); i després de l'última barra hi ha els flags — aquí `g` (*global*), que indica que s'ha de substituir totes les coincidències de cada línia, no només la primera que trobi. Sense `g`, només canviaria la primera coma de cada línia.

`sed -n` amb un rang imprimeix només un tram de línies, útil per inspeccionar una part concreta d'un fitxer llarg sense fer `head` i `tail` per separat:

```bash
$ sed -n '2,6p' vendes.csv
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
2025-01-06,València,Electrònica,210.00
2025-01-07,Madrid,Roba,,
```

**Desglossat:** `-n` desactiva el comportament per defecte de `sed`, que és imprimir totes les línies encara que no se n'hagi tocat cap; amb `-n`, `sed` només imprimeix el que se li digui explícitament. `'2,6p'` és aquesta instrucció explícita: `2,6` és un rang de línies (de la 2 a la 6, ambdues incloses) i `p` és l'ordre "print" (imprimeix). Combinats, `-n` i `'2,6p'` fan que només es vegin les línies 2 a 6 i cap més.

Eliminar la capçalera abans de processar les dades és una necessitat freqüent; `1d` esborra la primera línia:

```bash
$ sed '1d' vendes.csv | head -3
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
```

**Desglossat:** `'1d'` també és una adreça (`1`, la línia 1) seguida d'una ordre (`d`, *delete*). Es llegeix com "a la línia 1, esborra-la". Aquí no cal `-n` perquè l'ordre és "esborra" i no "imprimeix": `sed` continua imprimint totes les línies per defecte, excepte la que s'ha esborrat.

`sed` també serveix per netejar símbols concrets, com un `€` que de vegades s'incrusta en columnes numèriques i n'impedeix el càlcul. Com que `vendes.csv` no en conté cap, la sortida és idèntica a l'original:

```bash
$ sed 's/€//g' vendes.csv | head -3
data,ciutat,categoria,import
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
```

**Desglossat:** mateixa estructura `s/patró/reemplaçament/g` d'abans, però amb el reemplaçament buit (no hi ha res entre la segona i la tercera barra). Substituir per "res" equival a esborrar: cada `€` que trobi es treu de la línia sense deixar-hi cap caràcter en el seu lloc.

Quan cal aplicar el canvi directament sobre el fitxer (en lloc de només mostrar-lo per pantalla), `-i` edita "in place". Afegir una extensió després de `-i` (com `.bak`) crea automàticament una còpia de seguretat abans de modificar l'original. **A Git Bash aquest flag funciona igual que a Linux** (a diferència de macOS, on `sed -i` exigeix un argument buit `''` abans de l'extensió):

```bash
$ sed -i.bak 's/NA/0/g' vendes.csv
$ cat vendes.csv
data,ciutat,categoria,import
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
2025-01-06,València,Electrònica,210.00
2025-01-07,Madrid,Roba,,
2025-01-08,Barcelona,Roba,89.90
2025-01-09,"Barcelona, ES",Electrònica,150.00
2025-01-10,Madrid,Electrònica,0
2025-01-11,València,Alimentació,28.75
2025-01-12,Barcelona,Alimentació,40.00
2025-01-13,Madrid,Roba,65.20
2025-01-14,València,Roba,55.00
2025-01-15,Barcelona,Electrònica,175.30
2025-01-16,Madrid,Alimentació,0
```

**Desglossat:** `-i` (*in-place*) fa que `sed` no mostri el resultat per pantalla sinó que sobreescrigui directament el fitxer d'entrada. `.bak`, enganxat sense espai just després de `-i`, li diu a `sed` que abans de sobreescriure, guardi una còpia de l'original amb aquest sufix afegit al nom (`vendes.csv.bak`). Si s'hagués escrit `-i` sense res darrere, l'original es perdria sense còpia de seguretat. La resta, `'s/NA/0/g'`, és la mateixa substitució global ja explicada, aquí canviant el text `NA` per `0`.

Aquesta ordre és especialment útil sobre `vendes.csv`: substitueix els `NA` de les files 8 i 16 per `0`, cosa que permet després sumar la columna d'import sense que `awk` interpreti `NA` com un valor no numèric (que compta com a zero silenciosament, però és millor deixar-ho explícit). El fitxer `vendes.csv.bak` conserva l'original amb els `NA` intactes.

## `awk`: processar columnes i agregar

| Ordre | Què fa |
|---|---|
| `awk -F',' '{print $1, $3}' dades.csv` | Imprimeix columnes 1 i 3 |
| `awk -F',' '$3 > 100 {print}' dades.csv` | Files on la columna 3 > 100 |
| `awk -F',' '{suma += $3} END {print suma}' dades.csv` | Suma la columna 3 |
| `awk -F',' '{suma+=$3; n++} END {print suma/n}' dades.csv` | Mitjana de la columna 3 |
| `awk -F',' '{count[$1]++} END {for (k in count) print k, count[k]}' dades.csv` | Freqüència per categoria (columna 1) |
| `awk 'NR>1' dades.csv` | Totes les línies excepte la capçalera |

`awk` és l'eina més potent d'aquest recull perquè no només filtra o substitueix, sinó que permet fer càlculs sobre columnes. La seva sintaxi general és `awk 'condició {acció}' fitxer`: per cada línia del fitxer, si es compleix la condició (opcional), s'executa l'acció entre claus.

Per imprimir només algunes columnes:

```bash
$ awk -F',' '{print $2, $4}' vendes.csv | head -5
ciutat import
Barcelona 120.50
Madrid 45.00
Barcelona 32.10
València 210.00
```

**Desglossat:** `-F','` (*field separator*) li diu a `awk` que separi cada línia per comes, igual que `-d` a `cut`. Un cop separada, cada tros queda accessible com `$1` (primera columna), `$2` (segona), i així successivament — de manera semblant a com es referencien els arguments en un script de shell. Aquí no hi ha cap condició abans de les claus, per tant l'acció `{print $2, $4}` s'executa a totes les línies sense excepció: imprimeix la columna 2 i la 4, separades per un espai (la coma dins de `print` separa els valors a imprimir, no defineix com se separen visualment).

Per filtrar files segons una condició numèrica:

```bash
$ awk -F',' '$4 > 100 {print}' vendes.csv
data,ciutat,categoria,import
2025-01-03,Barcelona,Electrònica,120.50
2025-01-06,València,Electrònica,210.00
2025-01-09,"Barcelona, ES",Electrònica,150.00
2025-01-10,Madrid,Electrònica,NA
2025-01-15,Barcelona,Electrònica,175.30
2025-01-16,Madrid,Alimentació,NA
```

**Desglossat:** aquí sí que hi ha una condició abans de les claus: `$4 > 100`, és a dir "la columna 4 és més gran que 100". Quan la condició es compleix, s'executa `{print}`, que sense arguments imprimeix la línia sencera tal com ha arribat (no només una columna). Aquest resultat sorprèn a primer cop d'ull: hi apareixen la capçalera i les files amb `NA`, que no haurien de complir "import > 100". El motiu és que `awk` només fa comparació *numèrica* quan els dos costats són numèrics; com que `"import"` i `"NA"` no ho són, `awk` cau a comparació *alfabètica* de text, i `"import" > "100"` i `"NA" > "100"` són certes perquè la lletra inicial ("i", "N") és, alfabèticament, més gran que el caràcter "1". Per evitar-ho cal descartar la capçalera i els valors no numèrics abans de filtrar, per exemple amb `NR>1 && $4 != "NA"`. A banda d'això, la fila 7 (`"Barcelona, ES"`) també pateix el problema ja conegut: la coma interna desplaça una columna i `$4` deixa de correspondre a l'import real.

Per sumar una columna sencera:

```bash
$ awk -F',' 'NR>1 {suma += $4} END {print suma}' vendes.csv
861.75
```

**Desglossat:** `NR` (*number of record*) és una variable interna d'`awk` que conté el número de línia que s'està processant en cada moment (equivalent al que `nl` mostrava explícitament). La condició `NR>1` fa que l'acció només s'executi a partir de la segona línia, saltant-se la capçalera. Dins de l'acció, `suma += $4` és una abreviatura de `suma = suma + $4`: a cada línia, es va sumant l'import (columna 4) a una variable `suma`, que `awk` crea automàticament la primera vegada que s'usa (comença a 0). El bloc `END {print suma}` és especial: no s'executa a cada línia sinó una sola vegada, en acabar de llegir tot el fitxer, i és on s'imprimeix el resultat final acumulat. Els valors `NA` i el buit de la fila 5 es tracten com a 0 en un context aritmètic, per això no calen fitxers previs "netejats" per obtenir aquest total.

De manera semblant, la mitjana es calcula acumulant tant la suma com el nombre de files:

```bash
$ awk -F',' 'NR>1 {suma+=$4; n++} END {print suma/n}' vendes.csv
61.5536
```

**Desglossat:** dins de la mateixa acció hi ha dues instruccions separades per `;` (el punt i coma separa instruccions dins d'un mateix bloc d'`awk`, igual que faria un salt de línia). `suma+=$4` acumula l'import com abans; `n++` incrementa en 1 una segona variable, `n`, que fa de comptador de files processades. Al bloc `END`, `suma/n` divideix el total acumulat pel nombre de files, donant la mitjana.

Per obtenir una freqüència per categoria (equivalent a un `GROUP BY` en SQL), `awk` pot fer servir un array associatiu indexat pel valor de la columna:

```bash
$ awk -F',' 'NR>1 {count[$3]++} END {for (k in count) print k, count[k]}' vendes.csv
Alimentació 5
Roba 4
 ES" 1
Electrònica 4
```

**Desglossat:** `count[$3]` és un array associatiu (com un diccionari en Python): en lloc d'indexar-se per posició numèrica, s'indexa pel valor de la columna 3 (la categoria). `count[$3]++` incrementa en 1 el comptador associat a la categoria d'aquella línia; si és la primera vegada que apareix, `awk` la crea automàticament amb valor 0 abans d'incrementar-la. Al bloc `END`, `for (k in count)` és un bucle que recorre totes les claus (categories) que s'han vist, guardant cadascuna a la variable `k`; per cada una, `print k, count[k]` imprimeix el nom de la categoria i el seu comptador. Aquí es torna a veure l'efecte de la coma dins de cometes: la fila 7 (`"Barcelona, ES"`) es compta com a categoria "Alimentació" de més (perquè el que hauria de ser `categoria` ara és `ciutat` desplaçada), i apareix una categoria espúria ` ES"` amb 1 aparició. Sense aquest problema hi hauria exactament 4 files per categoria.

I quan només cal descartar la capçalera sense fer cap altra transformació, `NR>1` sol n'hi ha prou:

```bash
$ awk -F',' 'NR>1' vendes.csv | head -3
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
```

**Desglossat:** aquí hi ha condició (`NR>1`) però no acció explícita entre claus. Quan `awk` només té una condició, el seu comportament per defecte és `{print}`: imprimeix la línia sencera si la condició es compleix. És per això que aquesta ordre equival a "imprimeix totes les línies excepte la primera".

## Pipes: encadenar ordres

| Pipeline | Què fa |
|---|---|
| `tail -n +2 dades.csv \| cut -d',' -f1 \| sort \| uniq -c \| sort -rn \| head -5` | Top 5 categories més freqüents de la columna 1 (sense capçalera) |
| `grep "2025" dades.csv \| cut -d',' -f2 \| sort -u \| wc -l` | Compta files úniques d'una columna que compleixen una condició |
| `grep -v "^$" dades.csv \| sed 's/,,/,0,/g' > dades_netes.csv` | Filtra, transforma i desa el resultat a un fitxer nou |
| `find . -name "*.csv" \| xargs -I{} wc -l {}` | Passa cada resultat com a argument de la comanda següent |

El símbol `|` envia la sortida d'una ordre com a entrada de la següent, exactament com ja s'ha vist als exemples anteriors (`head -1 | tr`, `cut | head`, etc.). Això permet construir en una sola línia pipelines que combinen diverses de les eines anteriors, cadascuna fent una tasca senzilla, i encadenar-les fins a obtenir el resultat final.

Per obtenir les categories més freqüents, ordenades de major a menor:

```bash
$ tail -n +2 vendes.csv | cut -d',' -f3 | sort | uniq -c | sort -rn
      5 Alimentació
      4 Roba
      4 Electrònica
      1  ES"
```

**Desglossat, pas a pas:**
- `tail -n +2 vendes.csv`: fins ara `-n` sempre anava amb un número positiu ("les últimes N línies"); amb un `+` davant, el significat canvia a "comença a mostrar a partir de la línia N (inclosa)". `+2` vol dir "des de la línia 2 en endavant", que és una manera habitual de dir "salta't la capçalera".
- `| cut -d',' -f3`: de cada línia rebuda, en queda's només la columna 3 (categoria).
- `| sort`: ordena alfabèticament aquesta llista de categories, perquè les iguals quedin adjacents.
- `| uniq -c`: compta quantes vegades es repeteix cada categoria consecutiva.
- `| sort -rn`: torna a ordenar, aquesta vegada el resultat de `uniq -c` (que comença amb el número), de forma numèrica (`-n`) i descendent (`-r`), perquè la categoria més freqüent aparegui primer.

La línia ` ES"` amb 1 aparició torna a ser l'efecte de la coma dins de cometes a la fila 7.

Per comptar valors únics d'una columna que compleixen una condició:

```bash
$ grep "2025-01-1" vendes.csv | cut -d',' -f2 | sort -u | wc -l
3
```

**Desglossat:** `grep "2025-01-1"` es queda amb les línies el text de les quals conté literalment "2025-01-1" — com que les dates estan al principi de la línia, això vol dir dies del 10 al 19 de gener (la segona meitat del mes en aquest fitxer). `cut -d',' -f2` n'extreu la ciutat. `sort -u` combina en un sol pas ordenar i eliminar duplicats: el flag `-u` (*unique*) de `sort` fa innecessari encadenar-hi després un `uniq` separat. Finalment `wc -l` compta quantes línies (ciutats diferents) han quedat: 3 (Barcelona, Madrid i València).

Per filtrar, transformar i desar el resultat en un fitxer nou:

```bash
$ grep -v "^$" vendes.csv | sed 's/,,/,0,/g' > vendes_netes.csv
$ head -8 vendes_netes.csv
data,ciutat,categoria,import
2025-01-03,Barcelona,Electrònica,120.50
2025-01-04,Madrid,Alimentació,45.00
2025-01-05,Barcelona,Alimentació,32.10
2025-01-06,València,Electrònica,210.00
2025-01-07,Madrid,Roba,0,
2025-01-08,Barcelona,Roba,89.90
```

**Desglossat:** `"^$"` és una expressió regular que vol dir "una línia buida": el `^` marca l'inici de línia i el `$` el final; quan van seguits sense res entremig, només hi encaixa una línia sense cap caràcter. `grep -v "^$"` elimina, doncs, les línies completament buides. `sed 's/,,/,0,/g'` busca dues comes seguides (`,,`, que apareixen quan un camp és buit, com a la fila 5, `Roba,,`) i les substitueix per `,0,`, deixant-hi un 0 explícit. El `>` final ja no és un pipe sinó una redirecció (es detalla a l'apartat següent): en lloc d'enviar el resultat a una altra ordre, el desa en un fitxer nou, `vendes_netes.csv`.

Una eina que sovint falta en aquest tipus de repàs és `xargs`: agafa la sortida d'una ordre i la converteix en arguments de la següent, cosa útil quan una comanda no accepta entrada per `stdin` directament (per exemple, `wc -l` sap llegir d'un pipe, però moltes altres ordres necessiten rebre el nom del fitxer com a argument explícit). Per exemple, per comptar les línies de tots els CSV que troba `find`, passant cada nom de fitxer a `wc -l`:

```bash
$ find . -name "*.csv" | xargs -I{} wc -l {}
15 ./vendes.csv
```

**Desglossat:** `-I{}` defineix un "marcador de posició": `{}` és un símbol arbitrari (podria ser qualsevol altre) que, dins de la comanda que segueix, es reemplaça per cada línia rebuda del pipe, una a una. Aquí, per cada fitxer que `find` ha trobat, `xargs` executa `wc -l <nom_del_fitxer>`, substituint `{}` pel nom real. Sense `-I{}`, `xargs` per defecte també enganxaria els arguments rebuts al final de la comanda, però `-I{}` permet controlar exactament on va cada argument, cosa necessària aquí perquè `{}` apareix dues vegades (un cop implícit dins l'ordre `wc -l {}`).

Nota: amb dades que continguin cometes soltes (com la fila 7, `"Barcelona, ES"`), `xargs` pot queixar-se de "unmatched double quote" si se li passen directament com a arguments; en aquests casos cal l'opció `-0` combinada amb `print0`, o bé evitar `xargs` i fer servir un bucle `while read`.

## Cas d'ús complet: quina ciutat factura més

Com a exemple final, es pot combinar diverses ordres per respondre una pregunta concreta: quina ciutat acumula més import total de vendes.

```bash
$ tail -n +2 vendes.csv \
  | awk -F',' '{suma[$2] += $4} END {for (c in suma) print suma[c], c}' \
  | sort -rn \
  | head -1
457.8 Barcelona
```

**Desglossat, pas a pas:** (la barra invertida `\` al final de cada línia només serveix perquè Bash sàpiga que la comanda continua a la línia següent; no forma part de la lògica, és purament visual per no escriure-ho tot en una línia llarguíssima)
- `tail -n +2 vendes.csv`: descarta la capçalera, com ja s'ha vist.
- `awk -F',' '{suma[$2] += $4} END {...}'`: aquí `suma` és un array associatiu indexat per ciutat (`$2`), i a cada línia s'hi acumula l'import (`$4`) d'aquella ciutat — el mateix patró que l'exemple de comptar categories, però sumant imports en lloc de comptar aparicions. Al bloc `END`, el bucle `for (c in suma)` recorre totes les ciutats vistes i n'imprimeix el total (`suma[c]`) seguit del nom (`c`).
- `sort -rn`: ordena aquest resultat (número seguit de ciutat) numèricament i de manera descendent, perquè la ciutat amb més facturació quedi primera.
- `head -1`: es queda només amb la primera línia d'aquest resultat ja ordenat, és a dir, la ciutat guanyadora.

Aquest exemple il·lustra bé el valor d'encadenar ordres: cap eina per separat respondria la pregunta, però la combinació de totes fa innecessari obrir cap notebook per a una consulta puntual.

## Redirecció i encadenament de processos

| Operador | Què fa |
|---|---|
| `comanda > sortida.txt` | Redirigeix la sortida a un fitxer (sobreescriu) |
| `comanda >> sortida.txt` | Afegeix la sortida al final del fitxer |
| `comanda 2> errors.txt` | Redirigeix només els errors |
| `comanda1 && comanda2` | Executa comanda2 només si comanda1 acaba amb èxit |
| `comanda1 ; comanda2` | Executa comanda2 sempre, independentment del resultat de comanda1 |
| `diff fitxer1 fitxer2` | Mostra les diferències línia a línia entre dos fitxers |

Més enllà dels pipes (que connecten la sortida d'una ordre amb l'*entrada* d'una altra), hi ha operadors per controlar on va la sortida d'una ordre i quan s'executa la següent:

```bash
comanda > sortida.txt      # redirigeix la sortida a un fitxer (sobreescriu)
comanda >> sortida.txt     # afegeix la sortida al final del fitxer
comanda 2> errors.txt      # redirigeix només els errors
comanda1 && comanda2       # executa comanda2 només si comanda1 acaba amb èxit
comanda1 ; comanda2        # executa comanda2 sempre, independentment del resultat de comanda1
```

**Desglossat:**
- `>` envia la sortida normal (allò que la comanda escriuria per pantalla) a un fitxer; si el fitxer ja existia, el sobreescriu sencer.
- `>>` fa el mateix, però afegeix el contingut al final del fitxer sense esborrar el que ja hi havia (útil per anar acumulant resultats de diverses execucions, com un log).
- `2>` és semblant a `>`, però redirigeix un canal diferent: cada comanda de Unix té una sortida "normal" (canal 1, *stdout*) i una sortida "d'errors" (canal 2, *stderr*); `2>` capta només aquest segon canal, deixant que els resultats normals continuïn mostrant-se per pantalla.
- `&&` és una condició: executa la segona comanda només si la primera ha acabat amb èxit (codi de sortida 0, sense errors).
- `;` no comprova res: simplement executa una comanda i, quan acaba (amb èxit o no), executa la següent.

`&&` és especialment útil en pipelines de processament de dades: per exemple, executar un script de neteja i, només si acaba correctament, executar el script d'anàlisi que en depèn:

```bash
$ sed -i 's/NA/0/g' vendes.csv && awk -F',' 'NR>1{s+=$4}END{print s}' vendes.csv
861.75
```

Finalment, per comparar el fitxer net (`vendes_netes.csv`) amb l'original i veure exactament què ha canviat, `diff` mostra les línies afegides o modificades:

```bash
$ diff vendes.csv vendes_netes.csv
6c6
< 2025-01-07,Madrid,Roba,,
---
> 2025-01-07,Madrid,Roba,0,
```

**Desglossat:** `diff` rep dos fitxers com a arguments i en compara el contingut línia a línia. La notació `6c6` es llegeix "línia 6 canviada per línia 6" (`c` de *change*; també hi pot haver `a` per línies afegides i `d` per línies eliminades). Sota d'aquesta capçalera, la línia que comença amb `<` mostra com era al primer fitxer (l'original), i la que comença amb `>` mostra com és al segon (el modificat); la ratlla `---` només separa visualment totes dues versions.

## Particularitats de Git Bash a Windows

Treballar amb Git Bash en lloc d'una terminal Linux nativa comporta algunes diferències que val la pena conèixer:

- **Rutes:** Git Bash tradueix les rutes de Windows a format Unix. `C:\Users\albert\dades` es referencia com `/c/Users/albert/dades`. Les eines com `cd`, `ls` o `find` esperen aquest format; barrejar `\` i `/` en una mateixa ruta sol provocar errors.
- **Final de línia (CRLF vs LF):** un fitxer editat o exportat des d'Excel o Notepad a Windows sovint porta finals de línia `\r\n` (CRLF) en lloc de `\n` (LF, l'habitual a Unix). Això es manifesta com un caràcter `^M` sobrant en sortides de `cat -A` o com a línies que semblen buides després d'un `sed`. Per normalitzar-ho: `sed -i 's/\r$//' vendes.csv` (substitueix el `\r` que hi ha just abans del final de cada línia, `$`, per res), o si es té instal·lat, `dos2unix vendes.csv`.
- **Portapapers:** `clip` (no és Git Bash pròpiament, sinó una eina de Windows accessible des de la terminal) permet copiar la sortida d'una ordre directament al porta-retalls, útil per enganxar un resultat a un correu o un document: `head -5 vendes.csv | clip`.
- **Programes interactius:** algunes eines interactives natives de Windows (com `python` en mode consola) no es comporten bé sota Git Bash sense `winpty` al davant; si una ordre es queda penjada o no mostra el prompt correctament, provar `winpty ordre`.
- **Obrir l'explorador d'arxius:** `explorer.exe .` obre el directori actual a l'explorador de fitxers de Windows, útil per revisar visualment un resultat exportat.
- **Eines que falten:** com s'ha vist amb `column`, no totes les eines GNU/Linux habituals venen incloses. Si una ordre dona `command not found`, val la pena comprovar primer si hi ha una alternativa amb `awk`/`sed` abans de buscar-ne una instal·lació addicional.

## Limitacions: quan cal deixar pas a eines especialitzades

Els exemples anteriors ja han mostrat el problema diverses vegades: `cut` i `awk -F','` treballen línia a línia i tallen per la posició literal de cada coma, sense saber que unes cometes poden agrupar diversos valors com un sol camp. Amb `"Barcelona, ES"`, totes dues eines interpreten que hi ha una coma addicional i desplacen la resta de columnes.

Per a fitxers CSV amb text lliure, camps entre cometes o separadors escapats, val la pena fer el pas a eines que sí que entenen l'estructura real del format, com `csvkit` o `miller`. Totes dues s'instal·len amb `pip` i funcionen igual des de Git Bash que des de Linux, ja que criden l'intèrpret de Python, no eines natives del sistema:

```bash
$ pip install csvkit
$ csvcut -c ciutat,import vendes.csv | head -5
ciutat,import
Barcelona,120.50
Madrid,45.00
Barcelona,32.10
València,210.00
```

**Desglossat:** `-c ciutat,import` (*columns*) selecciona columnes pel seu nom en lloc de per posició numèrica, cosa que `cut` no pot fer. A diferència de `cut`, `csvcut` interpreta correctament que `"Barcelona, ES"` és un sol camp, encara que contingui una coma, i selecciona les columnes sense desplaçar-les.

Per a exploracions ràpides sobre dades netes, `grep`, `sed` i `awk` continuen sent les eines més ràpides; per a CSVs amb text lliure, `csvkit` o `miller` estalvien errors silenciosos difícils de detectar.
