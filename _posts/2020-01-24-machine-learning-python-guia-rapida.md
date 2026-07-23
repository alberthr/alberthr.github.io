---
layout: post
title: "Machine Learning en Python: Guia Ràpida de Consulta"
tags:
  - python
  - machine-learning
excerpt: "Codi de referència ràpida per als algoritmes de Machine Learning més habituals en Python amb scikit-learn: KNN, Arbres de Decisió, Random Forest i Gradient Boosting. Pensat per tenir a mà a l'hora de fer un exercici."
---

Aquest post no pretén explicar en profunditat cada algoritme de Machine Learning, sinó servir de **guia de consulta ràpida**: el codi mínim necessari per instanciar, entrenar, avaluar i ajustar els models més habituals amb `scikit-learn`, a mà per quan cal fer un exercici o un prototip ràpid. Cada mètode probablement mereixerà el seu propi post en profunditat més endavant; aquest se centra en tenir el codi a punt.

Els cinc mètodes triats —**Regressió Logística**, **KNN**, **Arbres de Decisió**, **Random Forest** i **Gradient Boosting**— cobreixen un recorregut natural: d'un model lineal senzill i molt interpretable (Regressió Logística), passant per un model sense entrenament pròpiament dit (KNN) i un model interpretable però inestable (Arbre), fins a l'estabilització via *bagging* (Random Forest) i l'optimització seqüencial via *boosting* (Gradient Boosting).

Tots els exemples fan servir el mateix conjunt de dades d'exemple (classificació binària), definit un sol cop:

```python
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split

X, y = make_classification(n_samples=500, n_features=10, n_informative=6,
                            n_redundant=2, random_state=42)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42, stratify=y
)
```


## Regressió Logística

Malgrat el nom, és un mètode de **classificació**, no de regressió: ajusta una combinació lineal de les variables i la passa per una funció sigmoide per obtenir una probabilitat entre 0 i 1. És el model de referència ("baseline") abans de provar res més complex.

* **Quan fer-lo servir:** com a primer model de referència gairebé sempre, especialment quan es sospita que la relació entre variables i resultat és aproximadament lineal, o quan la interpretabilitat dels coeficients (com a "efecte" de cada variable) és important.
* **Requisit important:** igual que KNN, sol beneficiar-se d'**escalar les variables**, ja que la regularització (present per defecte a `scikit-learn`) penalitza els coeficients i és sensible a l'escala de cada variable.

```python
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

escalador = StandardScaler()
X_train_esc = escalador.fit_transform(X_train)
X_test_esc = escalador.transform(X_test)

model_lr = LogisticRegression(C=1.0, max_iter=1000, random_state=42)
model_lr.fit(X_train_esc, y_train)

prediccions = model_lr.predict(X_test_esc)
probabilitats = model_lr.predict_proba(X_test_esc)[:, 1]  # Probabilitat de la classe 1
print("Accuracy Regressió Logística:", accuracy_score(y_test, prediccions))

# Coeficients: signe i magnitud indiquen direcció i pes de cada variable (amb dades escalades)
coeficients = model_lr.coef_[0]
```

**Hiperparàmetres clau:**
- `C`: inversa de la força de regularització; valors baixos regularitzen més (coeficients més propers a 0, menys sobreajust).
- `penalty`: tipus de regularització, `'l2'` per defecte (Ridge), `'l1'` (Lasso, pot posar coeficients exactament a 0 i fer selecció de variables) o `'elasticnet'`.
- `class_weight`: útil amb classes desbalancejades (`'balanced'` ajusta automàticament el pes segons la freqüència de cada classe).


## KNN (K-Nearest Neighbors)

Classifica (o prediu) un punt nou segons la classe majoritària (o la mitjana) dels $$k$$ punts més propers en l'espai de característiques. No té una fase d'"entrenament" real: es limita a emmagatzemar les dades i calcular distàncies en el moment de predir.

* **Quan fer-lo servir:** conjunts de dades petits o mitjans, amb poques dimensions (pateix la "maledicció de la dimensionalitat" en espais d'alta dimensió), i quan la frontera de decisió no és lineal.
* **Requisit important:** cal **escalar les variables** abans d'entrenar (`StandardScaler`), ja que KNN es basa en distàncies i variables amb escales molt diferents distorsionarien el resultat.

```python
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Escalar és imprescindible amb KNN
escalador = StandardScaler()
X_train_esc = escalador.fit_transform(X_train)
X_test_esc = escalador.transform(X_test)

model_knn = KNeighborsClassifier(n_neighbors=5, weights='distance')
model_knn.fit(X_train_esc, y_train)

prediccions = model_knn.predict(X_test_esc)
print("Accuracy KNN:", accuracy_score(y_test, prediccions))
```

**Hiperparàmetres clau:**
- `n_neighbors`: el nombre de veïns ($$k$$). Valors baixos → sobreajust; valors alts → model massa suau.
- `weights`: `'uniform'` (tots els veïns pesen igual) o `'distance'` (els veïns més propers pesen més).
- `metric`: la distància utilitzada (`'minkowski'` per defecte, equivalent a euclidiana amb `p=2`).


## Arbres de Decisió

Construeix una estructura d'arbre que divideix l'espai de dades successivament segons la variable i el punt de tall que millor separen les classes (o redueixen l'error, en regressió) a cada pas.

* **Quan fer-lo servir:** quan la interpretabilitat importa (es pot visualitzar i explicar la lògica de decisió) o com a punt de partida abans de provar mètodes d'ensemble.
* **Limitació principal:** tendeix a sobreajustar si no es limita la seva profunditat; és un model amb variància alta (petits canvis a les dades poden generar arbres molt diferents).

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

model_arbre = DecisionTreeClassifier(max_depth=4, min_samples_leaf=10, random_state=42)
model_arbre.fit(X_train, y_train)

prediccions = model_arbre.predict(X_test)
print("Accuracy Arbre:", accuracy_score(y_test, prediccions))

# Visualitzar l'arbre (útil per a la interpretabilitat)
plt.figure(figsize=(14, 8))
plot_tree(model_arbre, filled=True, feature_names=[f"var_{i}" for i in range(X.shape[1])])
plt.show()

# Importància de cada variable
importancies = model_arbre.feature_importances_
```

**Hiperparàmetres clau:**
- `max_depth`: profunditat màxima de l'arbre; el control principal contra el sobreajust.
- `min_samples_leaf` / `min_samples_split`: nombre mínim d'observacions per fer un tall o per formar una fulla.
- `criterion`: `'gini'` o `'entropy'` per a classificació; `'squared_error'` per a regressió (`DecisionTreeRegressor`).


## Random Forest

Entrena molts arbres de decisió independents, cadascun sobre una mostra *bootstrap* de les dades i un subconjunt aleatori de variables a cada tall, i combina les seves prediccions (vot majoritari en classificació, mitjana en regressió). Aquesta tècnica s'anomena *bagging* (*Bootstrap Aggregating*).

* **Quan fer-lo servir:** com a millora gairebé directa d'un sol arbre: redueix la variància (menys sobreajust) sense necessitat d'ajustar gaires hiperparàmetres, i sol donar bons resultats "de sèrie" en moltes tasques tabulars.
* **Cost:** perd part de la interpretabilitat directa d'un sol arbre (encara que es pot recuperar la importància de variables agregada), i és més costós computacionalment.

```python
from sklearn.ensemble import RandomForestClassifier

model_rf = RandomForestClassifier(
    n_estimators=300,
    max_depth=8,
    max_features='sqrt',
    n_jobs=-1,
    random_state=42
)
model_rf.fit(X_train, y_train)

prediccions = model_rf.predict(X_test)
print("Accuracy Random Forest:", accuracy_score(y_test, prediccions))

# Importància de variables (mitjana entre tots els arbres)
importancies = model_rf.feature_importances_
```

**Hiperparàmetres clau:**
- `n_estimators`: nombre d'arbres. Més arbres, més estable (fins a un punt de rendiments decreixents), a canvi de més temps de còmput.
- `max_features`: nombre de variables considerades a cada tall (`'sqrt'` és habitual en classificació); controla la diversitat entre arbres.
- `max_depth`, `min_samples_leaf`: mateix efecte que en un arbre individual, però amb menys risc de sobreajust global gràcies al *bagging*.


## Gradient Boosting

A diferència del *bagging*, el *boosting* entrena els arbres **seqüencialment**: cada nou arbre s'entrena per corregir els errors (residus) del conjunt d'arbres anteriors, en lloc d'entrenar-se de manera independent. El resultat sol ser més precís que un Random Forest, a costa de ser més sensible al sobreajust i més lent d'entrenar (no es pot paral·lelitzar entre arbres de la mateixa manera).

* **Quan fer-lo servir:** quan cal exprimir el màxim rendiment predictiu i es té temps per ajustar bé els hiperparàmetres (especialment la taxa d'aprenentatge i el nombre d'arbres).
* **Variants habituals fora de scikit-learn:** `XGBoost`, `LightGBM` i `CatBoost` són implementacions optimitzades de la mateixa idea, molt més ràpides i amb regularització addicional; l'exemple de sota fa servir la versió integrada a `scikit-learn` per no dependre de cap llibreria externa.

```python
from sklearn.ensemble import GradientBoostingClassifier

model_gb = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.05,
    max_depth=3,
    subsample=0.8,
    random_state=42
)
model_gb.fit(X_train, y_train)

prediccions = model_gb.predict(X_test)
print("Accuracy Gradient Boosting:", accuracy_score(y_test, prediccions))
```

**Hiperparàmetres clau:**
- `learning_rate`: quant contribueix cada arbre nou al conjunt; valors baixos requereixen més `n_estimators` però solen generalitzar millor.
- `n_estimators`: nombre d'arbres seqüencials; sol anar lligat a `learning_rate` (més taxa d'aprenentatge baixa, més arbres calen).
- `max_depth`: als models de boosting sol mantenir-se baix (2-5), ja que cada arbre només ha de corregir un error residual, no aprendre tot el patró.
- `subsample`: fracció de dades utilitzada per entrenar cada arbre (< 1 afegeix aleatorietat i redueix sobreajust, similar a l'esperit del *bagging*).


## Quina mètrica fer servir segons el que es prediu

Abans d'entrar en el codi d'avaluació, val la pena aturar-se a triar la mètrica correcta, ja que "accuracy" no sempre és la resposta adequada. Aquest apartat en dona només un resum operatiu; per a les fórmules, la interpretació completa i més mètriques (ROC-AUC, PR-AUC, Log Loss, R² ajustat...), vegeu el post dedicat a [mètodes d'avaluació de resultats en Machine Learning]({% post_url 2020-02-04-avaluacio-machine-learning %}).

* **Classificació binària equilibrada** (les dues classes tenen una freqüència similar): `accuracy` és una mètrica raonable i fàcil d'interpretar.
* **Classificació binària desbalancejada** (per exemple, detecció de frau, on la classe positiva és rara): `accuracy` pot ser enganyosa (un model que sempre prediu "no frau" tindria accuracy molt alta). Cal mirar `precision`, `recall`, `F1-score` i, sovint, l'**AUC-ROC** o l'**AUC-PR** (més informativa encara amb classes molt desbalancejades).
* **Classificació multiclasse:** les mateixes mètriques (`precision`, `recall`, `F1`) però calculades per classe, i agregades amb una mitjana `macro` (totes les classes pesen igual) o `weighted` (pesa segons la freqüència de cada classe).
* **Regressió** (predir un valor numèric continu, no una classe): les mètriques de classificació no apliquen; cal fer servir `MAE` (error absolut mitjà, fàcil d'interpretar en les unitats originals), `RMSE` (penalitza més els errors grans) o `R²` (proporció de variància explicada).

```python
# Classificació: mètriques més enllà de l'accuracy
from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score

print("Precision:", precision_score(y_test, prediccions))
print("Recall:", recall_score(y_test, prediccions))
print("F1-score:", f1_score(y_test, prediccions))
print("AUC-ROC:", roc_auc_score(y_test, probabilitats))  # requereix probabilitats, no etiquetes

# Regressió: mètriques equivalents (exemple amb un RandomForestRegressor ja entrenat)
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# mae = mean_absolute_error(y_test_reg, prediccions_reg)
# rmse = mean_squared_error(y_test_reg, prediccions_reg, squared=False)
# r2 = r2_score(y_test_reg, prediccions_reg)
```

## Avaluació de models (comuna a tots)

Un cop entrenat qualsevol dels quatre models, les mètriques i tècniques d'avaluació habituals són les mateixes:

```python
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.model_selection import cross_val_score

# Informe complet (precisió, recall, F1 per classe)
print(classification_report(y_test, prediccions))

# Matriu de confusió
print(confusion_matrix(y_test, prediccions))

# Validació creuada (més robusta que un sol train/test split)
scores = cross_val_score(model_rf, X, y, cv=5, scoring='accuracy')
print("Accuracy per fold:", scores)
print("Mitjana:", scores.mean(), "| Desviació:", scores.std())
```

Per a cerca d'hiperparàmetres de manera sistemàtica (en lloc d'ajustar-los a mà), `GridSearchCV` o `RandomizedSearchCV` permeten provar combinacions automàticament:

```python
from sklearn.model_selection import GridSearchCV

parametres = {
    'n_estimators': [100, 300, 500],
    'max_depth': [4, 8, 12],
}
cerca = GridSearchCV(RandomForestClassifier(random_state=42), parametres, cv=5, scoring='accuracy')
cerca.fit(X_train, y_train)

print("Millors paràmetres:", cerca.best_params_)
print("Millor accuracy (CV):", cerca.best_score_)
```


## Taula resum

| Mètode | Interpretabilitat | Risc de sobreajust | Necessita escalar | Punt fort |
|---|---|---|---|---|
| Regressió Logística | Alta | Baix | Sí | Baseline ràpid i explicable |
| KNN | Baixa | Alt (amb $$k$$ petit) | Sí | Senzill, sense fase d'entrenament |
| Arbre de Decisió | Alta | Alt | No | Fàcil d'explicar i visualitzar |
| Random Forest | Mitjana | Baix | No | Robust "de sèrie", poc ajust necessari |
| Gradient Boosting | Baixa | Mitjà-alt si mal ajustat | No | Millor rendiment predictiu potencial |

Per a regressió (en lloc de classificació), quatre dels cinc mètodes tenen el seu equivalent directe a `scikit-learn`: `LinearRegression` (l'anàleg de la Regressió Logística per a target numèric), `KNeighborsRegressor`, `DecisionTreeRegressor`, `RandomForestRegressor` i `GradientBoostingRegressor`, amb la mateixa API (`fit`/`predict`) i pràcticament els mateixos hiperparàmetres.

## Conclusió

Aquesta guia cobreix el codi mínim per posar en marxa els cinc algoritmes de Machine Learning més habituals en problemes tabulars, sense entrar en el detall matemàtic de cadascun. La progressió natural per aprofundir-hi és: començar per la Regressió Logística com a referència lineal, entendre bé un Arbre de Decisió individual (la peça bàsica dels mètodes no lineals), després com el *bagging* el millora amb Random Forest, i finalment com el *boosting* n'exprimeix encara més rendiment amb Gradient Boosting. Cadascun d'aquests punts dona per un post propi més endavant.
