---
layout: post
title: "Mètodes d'Avaluació de Resultats en Machine Learning"
tags:
  - machine-learning
  - python
excerpt: "Guia completa de les mètriques per avaluar models de classificació, regressió i clustering: matriu de confusió, precision/recall, ROC-AUC, MAE/RMSE/R², validació creuada, amb fórmules, gràfics i codi."
---

Entrenar un model és només mig camí; saber si els seus resultats són bons —i "bons" segons quin criteri— és l'altra meitat, sovint infravalorada. Triar la mètrica equivocada pot fer que un model mediocre sembli excel·lent, o a l'inrevés. Aquest article repassa les mètriques principals per avaluar models de **classificació**, **regressió** i, més breument, **clustering**, amb la fórmula, la interpretació i quan té sentit fer-les servir cadascuna.

Aquest post complementa la [guia ràpida d'algoritmes de Machine Learning en Python]({% post_url 2020-01-24-machine-learning-python-guia-rapida %}) (on ja apareixien algunes d'aquestes mètriques amb codi mínim) i el post sobre [Machine Learning vs. Estadística Tradicional]({% post_url 2020-05-09-machine-learning-vs-estadistica %}), que apuntava que la manca de quantificació formal de la incertesa és una de les diferències clau respecte als mètodes estadístics clàssics.


## Classificació: la matriu de confusió com a punt de partida

Abans de qualsevol fórmula, cal entendre la **matriu de confusió**, la taula que compara les prediccions del model amb la realitat en un problema de classificació binària:

| | Predit: Positiu | Predit: Negatiu |
|---|---|---|
| **Real: Positiu** | Vertader Positiu (VP) | Fals Negatiu (FN) |
| **Real: Negatiu** | Fals Positiu (FP) | Vertader Negatiu (VN) |

Tota la resta de mètriques de classificació es construeixen combinant aquests quatre nombres de maneres diferents, cadascuna posant l'accent en un tipus d'error diferent.

### Accuracy (Exactitud)

$$\text{Accuracy} = \frac{VP + VN}{VP + VN + FP + FN}$$

El percentatge de prediccions correctes sobre el total.

- **Quan fer-la servir:** només quan les classes estan **equilibrades** (freqüències similars). Amb classes desbalancejades és enganyosa: en un problema de frau amb un 1% de casos positius, un model que sempre prediu "no frau" té un 99% d'accuracy sense haver après res.

### Precision (Precisió)

$$\text{Precision} = \frac{VP}{VP + FP}$$

De totes les prediccions positives que fa el model, quin percentatge són realment positives.

- **Quan importa:** quan el cost d'un **fals positiu** és alt. Per exemple, en un sistema que marca transaccions com a fraudulentes i bloqueja la targeta: massa falsos positius generen fricció i queixes de clients legítims.

### Recall (Sensibilitat, o Exhaustivitat)

$$\text{Recall} = \frac{VP}{VP + FN}$$

De tots els casos realment positius, quin percentatge detecta el model.

- **Quan importa:** quan el cost d'un **fals negatiu** és alt. Per exemple, en el cribratge d'una malaltia greu: és preferible investigar algun cas sa de més (fals positiu) que no deixar passar un cas malalt (fals negatiu).

### El compromís Precision-Recall

Precision i Recall solen moure's en sentits oposats: augmentar-ne un (per exemple, baixant el llindar de probabilitat necessari per classificar com a positiu) sol reduir l'altre. No hi ha una resposta universal sobre quin prioritzar; depèn del cost relatiu de cada tipus d'error en el problema concret.

### F1-Score

$$F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$

La mitjana harmònica de Precision i Recall (penalitza més que la mitjana aritmètica quan un dels dos valors és baix).

- **Quan fer-la servir:** quan cal un únic número que resumeixi l'equilibri entre tots dos, especialment amb classes desbalancejades. Existeix també l'**F-beta**, una versió generalitzada que permet pesar més el Recall ($$\beta > 1$$) o la Precision ($$\beta < 1$$) segons convingui.

### Specificity (Especificitat)

$$\text{Specificity} = \frac{VN}{VN + FP}$$

L'equivalent del Recall però per a la classe negativa: de tots els casos realment negatius, quin percentatge detecta correctament el model com a negatius.


## La corba ROC i l'AUC

Totes les mètriques anteriors depenen d'un **llindar de decisió** (normalment 0,5): per sobre, es classifica com a positiu; per sota, com a negatiu. La corba **ROC** (*Receiver Operating Characteristic*) mostra com canvien el Recall (eix Y, també anomenat *True Positive Rate*) i la taxa de falsos positius (eix X, *False Positive Rate* $$= FP / (FP+VN)$$) a mesura que aquest llindar es mou de 0 a 1.

$$AUC = \int_0^1 \text{TPR}(\text{FPR}) \, d(\text{FPR})$$

L'**AUC** (àrea sota la corba) resumeix tota la corba en un sol número entre 0 i 1:

- **AUC = 0,5:** el model no és millor que l'atzar (la corba coincideix amb la diagonal).
- **AUC = 1,0:** el model separa perfectament les dues classes a algun llindar.
- **Quan fer-la servir:** per comparar models de manera independent del llindar triat, i com a mètrica general de capacitat discriminativa. Menys informativa amb classes molt desbalancejades (vegeu més avall).

El gràfic següent il·lustra la corba ROC d'un model amb bona capacitat discriminativa, comparat amb la diagonal d'un classificador aleatori:

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 600px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficROC" width="700" height="600"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    // Corba ROC simulada d'un model amb bon poder discriminatiu (forma còncava clàssica)
    const fpr = [];
    const tprModel = [];
    const tprAtzar = [];
    for (let x = 0; x <= 1.0001; x += 0.02) {
        fpr.push(Number(x.toFixed(2)));
        tprModel.push(Math.pow(x, 0.35)); // corba còncava il·lustrativa, AUC ~ 0.88
        tprAtzar.push(x);
    }

    const ctx = document.getElementById('graficROC').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: fpr,
            datasets: [
                {
                    label: 'Model (AUC ≈ 0.88)',
                    data: tprModel,
                    borderColor: '#3b82f6',
                    borderWidth: 2.5,
                    pointRadius: 0,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Classificador aleatori (AUC = 0.50)',
                    data: tprAtzar,
                    borderColor: '#94a3b8',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    pointRadius: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            aspectRatio: 1.15,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 12 } } }
            },
            scales: {
                x: {
                    type: 'linear', min: 0, max: 1,
                    title: { display: true, text: 'Taxa de Falsos Positius (FPR)', font: { weight: 'bold' } }
                },
                y: {
                    min: 0, max: 1,
                    title: { display: true, text: 'Taxa de Vertaders Positius (Recall)', font: { weight: 'bold' } }
                }
            }
        }
    });
});
</script>

### Corba Precision-Recall i AUC-PR

Amb classes molt **desbalancejades**, la corba ROC pot semblar bona fins i tot amb un model mediocre, perquè el gran nombre de vertaders negatius fa que la taxa de falsos positius (FPR) es mantingui baixa encara que el nombre absolut de falsos positius sigui alt en relació amb els pocs positius reals. En aquests casos, la **corba Precision-Recall** (Precision a l'eix Y, Recall a l'eix X) i la seva àrea (**AUC-PR**) són més informatives, ja que no depenen del nombre de vertaders negatius.

- **Regla pràctica:** amb classes equilibrades, ROC-AUC; amb classes molt desbalancejades (fraude, detecció d'anomalies, diagnòstic de malalties rares), Precision-Recall AUC.

## Log Loss (entropia creuada)

$$\text{Log Loss} = -\frac{1}{n}\sum_{i=1}^{n} \left[ y_i \log(p_i) + (1-y_i)\log(1-p_i) \right]$$

On $$y_i$$ és l'etiqueta real (0 o 1) i $$p_i$$ la probabilitat predita per al cas $$i$$.

A diferència de les mètriques anteriors, que només miren l'etiqueta final (positiu/negatiu), el Log Loss avalua directament les **probabilitats predites**: penalitza molt fort les prediccions segures però equivocades (per exemple, predir 0,99 de probabilitat quan la resposta real és negativa).

- **Quan fer-lo servir:** quan la calibració de les probabilitats importa, no només la classificació final (per exemple, en un model que alimenta un càlcul de risc financer posterior).


## Classificació multiclasse: com agregar les mètriques

Amb més de dues classes, Precision, Recall i F1 es calculen per a cada classe individualment (tractant-la com "positiva" contra la resta) i després s'agreguen d'alguna de les maneres següents:

- **Macro:** mitjana simple entre classes, tractant totes per igual independentment de la seva mida. Útil quan totes les classes importen igual, encara que siguin minoritàries.
- **Weighted:** mitjana ponderada per la freqüència de cada classe. Reflecteix millor el rendiment "global" quan hi ha classes molt més freqüents que d'altres.
- **Micro:** es sumen tots els VP, FP i FN de totes les classes conjuntament abans de calcular la mètrica; en classificació multiclasse d'una sola etiqueta per exemple, el micro-F1 coincideix amb l'accuracy global.


## Mètriques de Regressió

Quan la variable a predir és numèrica contínua (preu, temperatura, vendes), les mètriques de classificació no apliquen.

### MAE (Mean Absolute Error)

$$MAE = \frac{1}{n}\sum_{i=1}^{n} |y_i - \hat{y}_i|$$

L'error mitjà en les mateixes unitats que la variable original. Fàcil d'interpretar directament ("el model s'equivoca, de mitjana, en 250 unitats").

- **Quan fer-la servir:** com a mètrica principal quan es vol una interpretació directa i no es vol penalitzar especialment els errors grans per sobre dels petits.

### MSE (Mean Squared Error) i RMSE

$$MSE = \frac{1}{n}\sum_{i=1}^{n} (y_i - \hat{y}_i)^2 \qquad RMSE = \sqrt{MSE}$$

El MSE eleva els errors al quadrat, penalitzant molt més els errors grans que els petits. El RMSE en fa l'arrel quadrada per tornar a les unitats originals de la variable, mantenint aquesta penalització.

- **Quan fer-la servir:** quan els errors grans són especialment costosos i cal que el model els eviti amb més èmfasi que als errors petits.

### MAPE (Mean Absolute Percentage Error)

$$MAPE = \frac{100\%}{n}\sum_{i=1}^{n} \left|\frac{y_i - \hat{y}_i}{y_i}\right|$$

Expressa l'error com a percentatge, cosa que en facilita la comparació entre variables amb escales molt diferents.

- **Limitació important:** no es pot fer servir si $$y_i$$ pot valer 0 o valors molt propers a 0 (divisió per un nombre proper a zero dispara l'error percentual de manera artificial).

### R² (Coeficient de Determinació)

$$R^2 = 1 - \frac{\sum_i (y_i - \hat{y}_i)^2}{\sum_i (y_i - \bar{y})^2}$$

La proporció de la variància de la variable objectiu que el model explica, en relació amb un model ingenu que sempre prediu la mitjana. Va (habitualment) de 0 a 1, tot i que pot ser negatiu si el model és pitjor que predir sempre la mitjana.

- **Quan fer-la servir:** com a mesura general de bondat d'ajust, especialment útil per comparar models entre si sobre les mateixes dades. Compte amb comparar-lo entre datasets diferents: el mateix model pot tenir R² molt diferent només perquè la variància de la variable objectiu és diferent.
- **R² ajustat:** una variant que penalitza afegir variables que no aporten poder explicatiu real, útil quan es comparen models amb un nombre diferent de variables.


## Clustering: avaluació sense etiquetes reals

Quan no hi ha una etiqueta "correcta" coneguda (aprenentatge no supervisat), l'avaluació és més indirecta:

- **Silhouette Score:** per a cada punt, compara la distància mitjana als punts del seu propi clúster amb la distància mitjana als punts del clúster més proper. Va de -1 a 1; valors propers a 1 indiquen clústers ben separats i compactes.
- **Inertia (suma de quadrats intra-clúster):** utilitzada sobretot en el mètode del "colze" per triar el nombre de clústers en K-means; sempre disminueix en afegir més clústers, així que no serveix per comparar models amb K diferent directament, només per identificar el punt on la millora es torna marginal.


## Validació creuada: avaluar bé, no només amb la mètrica correcta

Triar la mètrica adequada és necessari, però no suficient: cal avaluar-la sobre dades que el model no hagi vist durant l'entrenament. Un sol *train/test split* pot donar una estimació esbiaixada per atzar (bona o dolenta segons quines observacions han caigut al conjunt de test). La **validació creuada** (*k-fold cross-validation*) divideix les dades en $$k$$ blocs, entrena $$k$$ vegades (deixant cada vegada un bloc diferent fora com a test) i promeja el resultat, donant una estimació molt més robusta i, de pas, una idea de la variabilitat del rendiment del model.


## Implementació pràctica

A continuació es mostra com calcular les mètriques principals de classificació i regressió amb `scikit-learn`.

### Classificació

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, average_precision_score, log_loss,
    confusion_matrix, classification_report
)

# y_test: etiquetes reals | prediccions: etiquetes predites | probabilitats: predict_proba()[:, 1]

print("Accuracy:", accuracy_score(y_test, prediccions))
print("Precision:", precision_score(y_test, prediccions))
print("Recall:", recall_score(y_test, prediccions))
print("F1-score:", f1_score(y_test, prediccions))
print("ROC-AUC:", roc_auc_score(y_test, probabilitats))
print("PR-AUC (Average Precision):", average_precision_score(y_test, probabilitats))
print("Log Loss:", log_loss(y_test, probabilitats))

print("\nMatriu de confusió:\n", confusion_matrix(y_test, prediccions))
print("\nInforme complet:\n", classification_report(y_test, prediccions))

# Multiclasse: cal indicar el tipus de mitjana
# f1_score(y_test, prediccions, average='macro')     # o 'weighted', 'micro'
```

### Regressió

```python
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, r2_score
)
import numpy as np

# y_test_reg: valors reals | prediccions_reg: valors predits

mae = mean_absolute_error(y_test_reg, prediccions_reg)
rmse = mean_squared_error(y_test_reg, prediccions_reg, squared=False)
r2 = r2_score(y_test_reg, prediccions_reg)

# MAPE (compte si hi ha valors reals propers a 0)
mape = np.mean(np.abs((y_test_reg - prediccions_reg) / y_test_reg)) * 100

print(f"MAE: {mae:.2f}  |  RMSE: {rmse:.2f}  |  R²: {r2:.3f}  |  MAPE: {mape:.1f}%")
```

### Validació creuada

```python
from sklearn.model_selection import cross_val_score, StratifiedKFold

# Per a classificació, StratifiedKFold manté la proporció de classes a cada fold
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=cv, scoring='f1')

print("F1 per fold:", scores)
print("Mitjana:", scores.mean(), "| Desviació estàndard:", scores.std())
```


## Taula resum

| Mètrica | Tipus de problema | Quan fer-la servir |
|---|---|---|
| Accuracy | Classificació | Classes equilibrades |
| Precision | Classificació | Cost alt del fals positiu |
| Recall | Classificació | Cost alt del fals negatiu |
| F1-Score | Classificació | Equilibri Precision/Recall, classes desbalancejades |
| ROC-AUC | Classificació | Comparar models, classes relativament equilibrades |
| PR-AUC | Classificació | Classes molt desbalancejades |
| Log Loss | Classificació (probabilitats) | Quan la calibració de la probabilitat importa |
| MAE | Regressió | Interpretació directa, sense penalitzar errors grans |
| RMSE | Regressió | Penalitzar més els errors grans |
| MAPE | Regressió | Comparar error relatiu entre escales diferents (sense zeros) |
| R² | Regressió | Bondat d'ajust general, comparar models |
| Silhouette | Clustering | Qualitat de la separació entre clústers |


## Conclusió

No existeix una mètrica universal "correcta": la tria depèn del tipus de problema (classificació, regressió, clustering), de si les classes estan equilibrades, i sobretot del **cost relatiu de cada tipus d'error** en el context de negoci concret. Una bona pràctica és calcular sempre més d'una mètrica (per exemple, Precision, Recall i F1 alhora, no només accuracy), i avaluar-les amb validació creuada en lloc d'un sol *train/test split*, per assegurar que el número obtingut reflecteix realment la capacitat del model i no un atzar favorable en la partició de les dades.
