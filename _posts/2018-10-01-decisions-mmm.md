---
layout: post
title: "Marketing Mix Modelling (MMM): Decisions a prendre abans de començar"
tags:
  - mmm
  - publicitat
excerpt: "Abans de començar un Marketing Mix Model cal resoldre alguns dilemes clau: baseline aditiva o multiplicativa, com modelar l'Ad-Stock (Decay vs. funció Gamma) o com capturar l'estacionalitat. Una anàlisi de les decisions estructurals que condicionaran tot el model."
---

Abans de llançar la primera línia de codi d'un projecte de **Marketing Mix Modeling (MMM)**, tot *analista* s'enfronta a un full en blanc amb alguns dilemes estructurals. Un model MMM no és una simple regressió que es pugui automatitzar a cegues; és la traducció matemàtica de la realitat comercial d'un producte o empresa. 

Si el model no entén com interactuen les palanques bàsiques del negoci (el preu o les botigues on es ven), o com reacciona el cervell del consumidor davant d'un anunci, els coeficients finals estaran esbiaixats. El resultat? Decisions d'optimització de pressupost basades en hipòtesis incorrectes.

En aquest article vull abordar els tres grans dilemes inicials que definiran el rumb d'un MMM: l'estructura de la baseline, el modelatge de l'efecte de la publicitat en el temps (Ad-Stock) i la captura de l'estacionalitat.


## Baseline Aditiva vs. Baseline Multiplicativa: Com interactua el teu negoci?

La **baseline** representa les vendes orgàniques de la marca, és a dir, tot allò que es vendria sense fer publicitat. La decisió de com interconectem els seus components (preu, distribució, estacionalitat...) canvia radicalment el comportament del model.

### Baseline Aditiva
En una estructura aditiva, s'assumeix que cada factor orgànic aporta una quantitat de vendes fixa, independent de la resta.

$$\text{Vendes Base}_t = \beta_0 + \text{Efecte Preu}_t + \text{Efecte Distribució}_t + \text{Estacionalitat}_t$$

* **Com funciona:** Cada parametre del model fa que la variable de sortida pugi o baixi d'un manera fixa. Per exemple, si estem a l'estiu, l'estacionalitat suma 2.000 unitats fixes. Si teniem 10 botigues i n'obrim 10 més (distribució), sumem unes altres 1.000 unitats fixes.
* **El dilema:** No reflecteix la realitat. Si es dupliquen els punts de venda, la campanya d'estiu hauria de tenir un impacte molt més gran en volum absolut. En un model aditiu, els efectes es calculen en "túnels tancats", ignorant que la distribució amplifica el potencial de les temporades altes.

### Baseline Multiplicativa
En una estructura multiplicativa, els factors de la baseline actuen com a multiplicadors o ràtios percentuals els uns sobre els altres.

$$\text{Vendes Base}_t = \beta_0 \cdot (\text{Preu}_t)^{\beta_1} \cdot (\text{Distribució}_t)^{\beta_2} \cdot \text{Estacionalitat}_t$$

* **Com funciona:** L'estacionalitat esdevé un índex (ex: $1.3$ a l'agost, un 30% més; $0.7$ al gener, un 30% menys). 
* **Per què és superior?** Captura les sinergies de manera natural. Si la teva distribució augmenta, l'índex del 30% extra de l'estiu s'aplicarà sobre aquesta nova base de vendes més gran, escalant el pic correctament. Una pujada de preu contraurà les vendes proporcionalment a la mida del mercat actual, no com una pèrdua lineal de paquets fixos.

En resum, els models aditius, son més facils d'explicar, interpretar i implementar a l'hora d'asignar pesos a cada variable de la Baseline. Els models Multiplicatius son mes treballats i a la vegada mes correctes a l'hora d'entendre la lógica de com funciona la realitat. Si només ens importa el resultat final i un cop calculat el model només volem explicar el passat i no volem simular el futur, no sol haver-hi gaire diferencies entre les 2 metodologies. 


## Modelar el retard de la publicitat (Ad-Stock): Decay vs. Funció Gamma

Un anunci vist avui pot generar una venda demà o la setmana vinent. Aquesta memòria de marca es coneix com **Ad-Stock**. El dilema aquí és triar quina funció matemàtica descriu millor la pèrdua de record del consumidor segons el canal.


### Decay (Caiguda geomètrica d'1 paràmetre)
Assumeix que l'impacte màxim de la publicitat es produeix **immediatament** (en el mateix moment de l'exposició) i decreix de manera exponencial al llarg del temps segons un factor de caiguda $\alpha$ (entre 0 i 1).

$$Adstock_t = \alpha \cdot X_t + (1 - \alpha) \cdot Adstock_{t-1}$$


* **Característiques:** És ràpida de calcular i només requereix optimitzar un únic paràmetre.
* **Quan triar-la?** Per a canals digitals i d'acció immediata (*Paid Search*, *Performance Marketing*, *Emailing*), on l'usuari fa clic i compra al moment, i el record s'esvaeix ràpidament si no es torna a impactar. 

### Funció Gamma (2 paràmetres: Forma i Escala)
La funció Gamma és molt més sofisticada. Permet modelar un **efecte retardat (*lagged effect*)**. L'impacte màxim de l'anunci no té lloc el primer dia, sinó que pot assolir el seu pic uns dies o setmanes més tard, caient després de forma asimètrica.

* **Característiques:** Afegeix molta flexibilitat a la corba de record, però requereix fixar o optimitzar dos hiperparàmetres (forma i escala), incrementant la complexitat i el temps de computació del model.
* **Quan triar-la?** Per a mitjans tradicionals de construcció de marca (*TV*, *Ràdio*, *OOH / Exterior*). Un consumidor pot veure un anunci de TV dimarts, però no anirà al supermercat a comprar el producte fins dissabte. La funció Gamma captura perfectament aquest desplaçament temporal del pic de conversions.

Per experiencia, encara que els mitjans tradicionals no siguin inmediats, també funciona be fer servir el Decay si estem mesurant l'efecte de la publicitat al curt plaç i estem analitzant l'efecte en Ventes en productes de gran consum (FMCG) on les bases de dades i els models es solen analitzar amb dades agrupades de manera setmanal. En productes on la decisió de compra es molt més pensada (productes financers, automovils...) pot ser més convenient fer servir una Funció Gamma.


## Com capturar l'Estacionalitat: 4 maneres senzilles

Si el teu producte es ven més a l'hivern, has d'aïllar aquest patró perquè el model no atribueixi erròniament aquestes vendes orgàniques a les campanyes publicitàries que fas per Nadal. L'objectiu és sempre el mateix: separar les vendes "normals" de les vendes que genera realment la publicitat. Aquí tens quatre maneres d'aconseguir-ho, de la més bàsica a la més refinada.

### 1. Variables Dummy (per mes o setmana)
La més directa: una variable binària (0/1) per cada mes o setmana de l'any.
* **Avantatge:** fàcil d'entendre i d'explicar a qualsevol, no cal cap càlcul previ.
* **Inconvenient:** si treballes amb dades setmanals, afegir 52 variables fictícies consumeix massa graus de llibertat del model, augmentant el risc de sobreajust (*overfitting*).

### 2. Descomposició clàssica de sèries temporals
Algorismes com `decompose()` separen automàticament la sèrie en tres trossos —tendència, estacionalitat i soroll— normalment fent servir mitjanes mòbils.
* **Avantatge:** ràpid d'aplicar, et dona un índex estacional net que pots utilitzar com a *input* fix del model.
* **Inconvenient:** assumeix un patró estacional força rígid, igual any rere any.

### 3. STL / Loess
És una versió més flexible de l'anterior: en lloc de mitjanes mòbils fa servir *loess* (una regressió local) per suavitzar la corba.
* **Avantatge:** s'adapta millor si l'estacionalitat canvia lleugerament d'un any a l'altre, o si la tendència no segueix una línia recta.
* **Quan triar-la sobre la clàssica?** Quan tens prou anys d'històric i sospites que el patró estacional "respira" una mica d'un any a l'altre.

### 4. Mirar la categoria total (o els competidors sense palanques) — el truc del FMCG
En lloc de calcular l'estacionalitat amb matemàtiques, la treus directament del mercat: si tens dades de panell, mires com es mou la categoria sencera, o específicament aquelles marques que no fan publicitat ni promocions. Si aquestes marques "passives" pugen un 30% a l'estiu, aquest 30% és estacionalitat pura de mercat, no un artefacte estadístic.
* **Avantatge:** és la més "real": no surt d'un model, surt directament del comportament del consumidor.
* **Inconvenient:** necessites dades de categoria o panell, i has de verificar bé que aquests competidors "sense palanques" realment no facin res (ni distribució agressiva, ni moviments de preu).

### Quina tries?
Les quatre opcions són independents del tipus de baseline que facis servir, però hi ha una afinitat natural que val la pena tenir present: les **dummies** sumen unitats fixes, així que casen millor amb una **baseline aditiva**; en canvi, la **descomposició clàssica**, l'**STL** i el mètode de la **categoria** et donen, de manera natural, un índex (un multiplicador), que s'integra més bé en una **baseline multiplicativa**. No és una regla estricta, però sí el camí de menys resistència.

La tria final depèn sobretot de les dades que tinguis: si només comptes amb la teva pròpia sèrie, vas amb dummies o descomposició/STL; si tens accés a dades de mercat, l'opció 4 sol ser la més robusta perquè no depèn de cap supòsit matemàtic.


---

### 🐍 Implementació en Python: Regressió Aditiva vs. Multiplicativa

Vegem amb un exemple senzill com canvia la regressió segons triem una baseline aditiva (OLS clàssica) o multiplicativa (log-log, on els coeficients passen a ser elasticitats):

```python
import numpy as np
import pandas as pd
import statsmodels.api as sm

np.random.seed(42)
n = 104  # 2 anys de dades setmanals

# Simulem les variables explicatives
preu = np.random.normal(10, 1, n)
distribucio = np.random.normal(500, 50, n)
estacionalitat = 1 + 0.3 * np.sin(2 * np.pi * np.arange(n) / 52)
soroll = np.random.normal(1, 0.05, n)

# Generem les vendes seguint una lògica multiplicativa real
vendes = 1000 * (preu ** -0.5) * (distribucio ** 0.8) * estacionalitat * soroll

df = pd.DataFrame({
    'vendes': vendes,
    'preu': preu,
    'distribucio': distribucio,
    'estacionalitat': estacionalitat
})

# --- Model Aditiu (regressió lineal clàssica) ---
X_add = sm.add_constant(df[['preu', 'distribucio', 'estacionalitat']])
model_add = sm.OLS(df['vendes'], X_add).fit()
print("--- Model Aditiu (coeficients = unitats de venda) ---")
print(model_add.params)

# --- Model Multiplicatiu (log-log: coeficients = elasticitats) ---
df['log_vendes'] = np.log(df['vendes'])
df['log_preu'] = np.log(df['preu'])
df['log_distribucio'] = np.log(df['distribucio'])
df['log_estacionalitat'] = np.log(df['estacionalitat'])

X_mult = sm.add_constant(df[['log_preu', 'log_distribucio', 'log_estacionalitat']])
model_mult = sm.OLS(df['log_vendes'], X_mult).fit()
print("\n--- Model Multiplicatiu (coeficients = elasticitats) ---")
print(model_mult.params)
```

En el model aditiu, cada coeficient s'interpreta en unitats de venda (ex: "cada euro de pujada de preu resta X unitats"). En el model multiplicatiu, com que treballem amb logaritmes, els coeficients s'interpreten com a **elasticitats**: el coeficient del preu (al voltant de -0.5) vol dir que un 1% de pujada de preu redueix les vendes un 0.5%, independentment del nivell de vendes actual.

### 📊 Implementació en R

```r
set.seed(42)
n <- 104  # 2 anys de dades setmanals

# Simulem les variables explicatives
preu <- rnorm(n, mean = 10, sd = 1)
distribucio <- rnorm(n, mean = 500, sd = 50)
estacionalitat <- 1 + 0.3 * sin(2 * pi * (0:(n - 1)) / 52)
soroll <- rnorm(n, mean = 1, sd = 0.05)

# Generem les vendes seguint una lògica multiplicativa real
vendes <- 1000 * (preu^-0.5) * (distribucio^0.8) * estacionalitat * soroll

df <- data.frame(vendes, preu, distribucio, estacionalitat)

# --- Model Aditiu (regressió lineal clàssica) ---
model_add <- lm(vendes ~ preu + distribucio + estacionalitat, data = df)
cat("--- Model Aditiu (coeficients = unitats de venda) ---\n")
print(coef(model_add))

# --- Model Multiplicatiu (log-log: coeficients = elasticitats) ---
df$log_vendes <- log(df$vendes)
df$log_preu <- log(df$preu)
df$log_distribucio <- log(df$distribucio)
df$log_estacionalitat <- log(df$estacionalitat)

model_mult <- lm(log_vendes ~ log_preu + log_distribucio + log_estacionalitat, data = df)
cat("\n--- Model Multiplicatiu (coeficients = elasticitats) ---\n")
print(coef(model_mult))
```

Com que les dades s'han generat seguint una lògica multiplicativa, fixa't com el model log-log recupera coeficients molt propers als reals (-0.5 per al preu, 0.8 per a la distribució), mentre que el model aditiu, en forçar relacions lineals sobre una realitat que no ho és, dona coeficients esbiaixats i més difícils d'interpretar correctament fora del rang de dades observat.
