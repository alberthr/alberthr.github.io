---
layout: post
title: "Com Funcionen Ridge i Lasso en Regressió Lineal"
tags:
  - estadistica
  - machine-learning
  - modelitzacio
excerpt: "Quan una regressió lineal té massa variables o multicol·linealitat, els coeficients es tornen inestables. Ridge i Lasso afegeixen una penalització que els redueix, amb un efecte diferent segons el mètode triat."
---

Una regressió lineal per mínims quadrats ordinaris (OLS) busca els coeficients que minimitzen l'error de predicció sobre les dades d'entrenament, sense cap altra consideració. Quan hi ha moltes variables explicatives, variables molt correlacionades entre si (multicol·linealitat), o poques observacions en relació amb el nombre de variables, aquest criteri porta sovint a coeficients molt inestables: petits canvis a les dades generen coeficients molt diferents, alguns amb signes que no tenen sentit de negoci, i el model generalitza malament a dades noves.

**Ridge** i **Lasso** resolen aquest problema afegint una penalització a la magnitud dels coeficients dins de la mateixa funció que es minimitza. Aquesta família de tècniques es coneix com a **regularització**.


## El problema que resolen

La regressió OLS clàssica minimitza únicament la suma de residus al quadrat:

$$\min_{\beta} \sum_{i=1}^{n} (y_i - X_i\beta)^2$$

Amb multicol·linealitat o un nombre elevat de variables, aquesta minimització es torna inestable: el model pot ajustar-se molt bé a les dades d'entrenament (variància alta) però fallar en generalitzar (sobreajust). Ridge i Lasso introdueixen un terme addicional que **penalitza coeficients grans**, obligant el model a triar-los amb més prudència a canvi d'una mica de biaix.


## Ridge Regression (Regularització L2)

Ridge afegeix a la funció objectiu la suma dels **quadrats** dels coeficients, multiplicada per un paràmetre $$\lambda$$ (o $$\alpha$$, segons la notació):

$$\min_{\beta} \sum_{i=1}^{n} (y_i - X_i\beta)^2 + \lambda \sum_{j=1}^{p} \beta_j^2$$

- **Efecte:** encongeix (*shrinkage*) tots els coeficients cap a zero de manera proporcional, però **mai els porta exactament a zero**. Totes les variables originals es mantenen al model, amb un pes reduït.
- **Quan fer-la servir:** quan es té la sospita (o certesa) que la majoria de variables aporten alguna informació rellevant, i el problema principal és la multicol·linealitat i la inestabilitat dels coeficients, no la necessitat de descartar variables.
- **Cas particular útil:** quan hi ha grups de variables molt correlacionades entre si, Ridge tendeix a repartir el pes entre totes elles de manera similar, en lloc d'escollir-ne una arbitràriament.


## Lasso Regression (Regularització L1)

Lasso (*Least Absolute Shrinkage and Selection Operator*) fa servir el **valor absolut** dels coeficients en lloc del quadrat:

$$\min_{\beta} \sum_{i=1}^{n} (y_i - X_i\beta)^2 + \lambda \sum_{j=1}^{p} |\beta_j|$$

- **Efecte:** a diferència de Ridge, aquesta penalització pot portar alguns coeficients **exactament a zero**, eliminant-los del model. Lasso fa, de facto, **selecció automàtica de variables**.
- **Quan fer-lo servir:** quan se sospita que només un subconjunt de les variables disponibles és realment rellevant, i interessa un model més simple i interpretable amb menys variables actives.
- **Limitació:** amb grups de variables molt correlacionades, Lasso tendeix a escollir-ne una del grup de manera gairebé arbitrària i eliminar la resta, cosa que pot fer el model menys estable davant de petits canvis a les dades que Ridge en aquest escenari concret.

### Per què Lasso porta coeficients a zero i Ridge no

La diferència es pot visualitzar geomètricament: la regió de valors permesos per als coeficients sota la restricció de Lasso té forma de **diamant** (a causa del valor absolut), amb vèrtexs pronunciats sobre els eixos, mentre que la de Ridge té forma de **cercle/el·lipse** (a causa del quadrat), sense vèrtexs. Quan la solució òptima de la regressió sense penalitzar cau fora d'aquesta regió, el punt més proper dins seu sol trobar-se **en un vèrtex** en el cas del diamant de Lasso (on un o més coeficients valen exactament 0), mentre que amb el cercle de Ridge la solució òptima gairebé mai coincideix amb els eixos.


## Elastic Net: el millor (o el compromís) de tots dos mons

**Elastic Net** combina totes dues penalitzacions amb un paràmetre addicional $$\alpha \in [0,1]$$ que reparteix el pes entre L1 i L2:

$$\min_{\beta} \sum_{i=1}^{n} (y_i - X_i\beta)^2 + \lambda \left[ \alpha \sum_{j=1}^{p} |\beta_j| + (1-\alpha) \sum_{j=1}^{p} \beta_j^2 \right]$$

- **Quan fer-lo servir:** quan hi ha grups de variables correlacionades (on Ridge és més estable) però també es vol l'efecte de selecció de variables de Lasso. És sovint una opció segura per defecte quan no es té clar quin dels dos mètodes convé més.


## Com triar el valor de $$\lambda$$ (o $$\alpha$$)

El paràmetre de penalització no s'estima amb les mateixes dades d'entrenament del model: es tria mitjançant **validació creuada**, provant un rang de valors de $$\lambda$$ i quedant-se amb el que minimitza l'error en dades de validació (no vistes durant l'ajust dels coeficients per a cada $$\lambda$$ provat).

- **$$\lambda = 0$$:** equival a la regressió OLS clàssica, sense penalització.
- **$$\lambda \to \infty$$:** força tots els coeficients cap a zero (Ridge) o directament a zero (Lasso), deixant només el terme independent.

El gràfic següent (conegut com a *"regularization path"*) il·lustra com evolucionen els coeficients d'un model amb 6 variables a mesura que augmenta $$\lambda$$: a Ridge (esquerra, conceptualment) tots els coeficients s'encongeixen de manera suau sense arribar mai a zero; a Lasso, els coeficients menys rellevants arriben a zero un darrere l'altre a mesura que $$\lambda$$ creix.

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<div style="width: 100%; max-width: 750px; margin: 30px auto; padding: 15px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
  <canvas id="graficLasso" width="800" height="450"></canvas>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
    // Simulació il·lustrativa del camí de regularització de Lasso:
    // cada variable arriba a zero a un llindar de lambda diferent
    const lambdaValors = [];
    const coefs = {
        'Variable A (forta)': [], 'Variable B (moderada)': [], 'Variable C (feble)': [],
        'Variable D (feble)': [], 'Variable E (soroll)': [], 'Variable F (soroll)': []
    };
    const inicial = { 'Variable A (forta)': 2.4, 'Variable B (moderada)': 1.6, 'Variable C (feble)': 0.9,
                       'Variable D (feble)': -0.7, 'Variable E (soroll)': 0.35, 'Variable F (soroll)': -0.2 };
    const llindar = { 'Variable A (forta)': 3.0, 'Variable B (moderada)': 2.0, 'Variable C (feble)': 1.1,
                       'Variable D (feble)': 0.9, 'Variable E (soroll)': 0.4, 'Variable F (soroll)': 0.25 };

    for (let l = 0; l <= 3.2; l += 0.05) {
        lambdaValors.push(Number(l.toFixed(2)));
        Object.keys(coefs).forEach(function(nom) {
            const restant = 1 - Math.min(l / llindar[nom], 1);
            coefs[nom].push(Number((inicial[nom] * restant).toFixed(3)));
        });
    }

    const colors = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7', '#64748b'];
    const datasets = Object.keys(coefs).map(function(nom, i) {
        return {
            label: nom,
            data: coefs[nom],
            borderColor: colors[i],
            borderWidth: 2.2,
            pointRadius: 0,
            fill: false,
            tension: 0
        };
    });

    const ctx = document.getElementById('graficLasso').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: { labels: lambdaValors, datasets: datasets },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } }
            },
            scales: {
                x: {
                    type: 'linear', min: 0, max: 3.2,
                    title: { display: true, text: 'Lambda (força de la penalització)', font: { weight: 'bold' } }
                },
                y: {
                    title: { display: true, text: 'Valor del coeficient', font: { weight: 'bold' } }
                }
            }
        }
    });
});
</script>

Aquest tipus de gràfic és, a la pràctica, una eina d'exploració útil per si mateixa: permet veure en quin ordre "desapareixen" les variables i detectar visualment quines són clarament més robustes que d'altres.


## Implementació pràctica

A continuació es mostra com ajustar Ridge, Lasso i triar $$\lambda$$ per validació creuada, tant en Python com en R.

### Implementació en Python

```python
import numpy as np
from sklearn.linear_model import Ridge, Lasso, RidgeCV, LassoCV
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# És imprescindible escalar les variables: la penalització és sensible a l'escala
escalador = StandardScaler()
X_train_esc = escalador.fit_transform(X_train)
X_test_esc = escalador.transform(X_test)

# Ridge amb un valor de lambda (alpha a sklearn) fixat
model_ridge = Ridge(alpha=1.0)
model_ridge.fit(X_train_esc, y_train)

# Lasso amb un valor fixat
model_lasso = Lasso(alpha=0.1)
model_lasso.fit(X_train_esc, y_train)

# Selecció de lambda per validació creuada (recomanat en lloc de fixar-lo a mà)
lambda_range = np.logspace(-3, 2, 50)

model_ridge_cv = RidgeCV(alphas=lambda_range, cv=5)
model_ridge_cv.fit(X_train_esc, y_train)
print("Millor lambda (Ridge):", model_ridge_cv.alpha_)

model_lasso_cv = LassoCV(alphas=lambda_range, cv=5, random_state=42)
model_lasso_cv.fit(X_train_esc, y_train)
print("Millor lambda (Lasso):", model_lasso_cv.alpha_)
print("Variables amb coeficient a 0:", np.sum(model_lasso_cv.coef_ == 0), "de", len(model_lasso_cv.coef_))
```

### Implementació en R

A R, la llibreria de referència és `glmnet`, on `alpha = 0` correspon a Ridge, `alpha = 1` a Lasso, i qualsevol valor intermedi a Elastic Net.

```r
library(glmnet)

# glmnet requereix les dades com a matriu, no com a data.frame
X_train_mat <- as.matrix(X_train)
X_test_mat <- as.matrix(X_test)

# Ridge (alpha = 0)
model_ridge <- glmnet(X_train_mat, y_train, alpha = 0)

# Lasso (alpha = 1)
model_lasso <- glmnet(X_train_mat, y_train, alpha = 1)

# Selecció de lambda per validació creuada
cv_ridge <- cv.glmnet(X_train_mat, y_train, alpha = 0)
cv_lasso <- cv.glmnet(X_train_mat, y_train, alpha = 1)

cat("Millor lambda (Ridge):", cv_ridge$lambda.min, "\n")
cat("Millor lambda (Lasso):", cv_lasso$lambda.min, "\n")

# Coeficients amb el lambda òptim (a Lasso, els que valen "." són exactament 0)
coef(cv_lasso, s = "lambda.min")

# Prediccions amb el model final
prediccions <- predict(cv_lasso, newx = X_test_mat, s = "lambda.min")
```

`glmnet` escala les variables internament per defecte, així que no cal fer-ho manualment com a Python.


## Taula resum

| | Ridge (L2) | Lasso (L1) | Elastic Net |
|---|---|---|---|
| Porta coeficients a exactament 0 | No | Sí | Sí (parcialment) |
| Selecció de variables | No | Sí | Sí |
| Comportament amb variables correlacionades | Reparteix el pes entre elles | Selecciona una arbitràriament | Comportament intermedi |
| Quan preferir-lo | Moltes variables rellevants, multicol·linealitat | Se sospita que poques variables importen | No està clar quin dels dos convé |


## Conclusió

Ridge i Lasso resolen el mateix problema de fons —coeficients inestables per multicol·linealitat o excés de variables— amb una diferència pràctica important: Ridge redueix la magnitud de tots els coeficients sense eliminar-ne cap, mentre que Lasso pot eliminar-ne alguns completament, fent de facto selecció de variables. La tria entre tots dos (o Elastic Net com a compromís) depèn de si l'objectiu és estabilitzar un model amb moltes variables rellevants (Ridge) o simplificar-lo descartant les que no aporten prou informació (Lasso), i en tots els casos, el valor de la penalització s'hauria de triar per validació creuada, no a ull.
