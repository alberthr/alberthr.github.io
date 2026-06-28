---
layout: post
title: "Calcular intervals de confiança fent servir Bootstrapping"
tags:
  - estadistica
  - python
  - r
excerpt: "Quan no coneixes la distribució de les teves dades o necessites l'interval de confiança d'un estadístic sense fórmula teòrica (com la mediana), el Bootstrapping et permet generar-lo a partir de la teva pròpia mostra."
---

En l'estadística tradicional, hi ha una frase que es repeteix com un mantra: *"Assumim que les dades segueixen una distribució normal"*. Però, què passa quan treballes amb dades reals? La realitat de la ciència de dades és tossuda: distribucions esbiaixades, mostres petites, valors atípics (*outliers*) o mètriques complexes (com la mediana o el ràtio de dues variables) de les quals no tenim ni idea de quina és la seva distribució matemàtica.

Si no coneixes la distribució de les teves dades, com pots calcular un **interval de confiança (IC)** fiable? O si estàs fent un test estadístic a mida on no existeix una fórmula directa per al marge d'error, què fas?

La resposta és el **Bootstrapping** (o mostreig repetit). Una tècnica de computació estadística que sembla màgia, però que es basa en un principi molt sòlid: **utilitzar la teva pròpia mostra com si fos la població sencera.**

## Què és el Bootstrapping i per a què serveix?

El terme prové de l'expressió anglesa *"to pull oneself up by one's bootstraps"* (aixecar-se a un mateix estirant els cordons de les pròpies botes), que fa referència a una tasca impossible. En estadística, reflecteix la idea d'obtenir inferències d'una població utilitzant **únicament** la informació de la mostra que ja tenim.

El funcionament és sorprenentment senzill i es resumeix en quatre passos:

1. **Prendre la teva mostra original** de mida $n$.
2. **Generar una nova submostra (pseudo-mostra)** de la mateixa mida $n$, agafant elements de la mostra original a l'atzar **amb reposició** (això significa que un mateix element es pot repetir diverses vegades en la nova submostra).
3. **Calcular l'estadístic** que t'interessa (la mitjana, la mediana, la variància, un coeficient de regressió, etc.) sobre aquesta submostra.
4. **Repetir aquest procés milers de vegades (ex: $B = 10.000$).**

Al final del procés, tindràs 10.000 estimacions del teu estadístic. La distribució d'aquestes 10.000 estimacions (anomenada distribució *bootstrap*) simula la distribució mostral real. Per trobar l'interval de confiança al 95%, només hauràs de buscar els percentils 2.5 i 97.5 d'aquesta col·lecció de resultats.

## Quan és realment útil?

El *bootstrapping* és el teu millor aliat en situacions com:

* **Absència de normalitat:** Quan les teves dades tenen una distribució clarament asimètrica (com els salaris, el temps de permanència en una web o el nombre de reclamacions).
* **Estadístics sense fórmula teòrica fàcil:** Trobar l'IC de la mitjana és fàcil gràcies al Teorema del Límit Central, però quin és l'IC exacte de la *mediana* o de la *correlació de Spearman* en una mostra petita? La teoria matemàtica es complica; el *bootstrapping* ho resol en tres línies de codi.
* **A/B Testing i Tests no paramètrics:** Quan fas experiments en productes digitals i vols calcular l'interval de confiança de la millora d'una mètrica ràtio (ex: conversions / clics), on no es pot extreure el IC directament per mètodes clàssics.

---

## Exemple Pràctic: Interval de Confiança per a la Mediana

Imagina que tenim una mostra petita ($n=30$) del temps que triguen els usuaris a registrar-se a la nostra app. Les dades estan molt esbiaixades (molts usuaris triguen poc, uns pocs triguen molt). Volem calcular l'IC al 95% per a la **mediana**.

A continuació, veurem com resoldre-ho tant en Python com en R.

### 🐍 Implementació en Python

```python
import numpy as np

# Fixem la llavor per a la reproductibilitat
np.random.seed(42)

# Simulem dades reals esbiaixades (ex: distribució exponencial)
temps_registre = np.random.exponential(scale=10, size=30)

def interval_confianca_bootstrap(dades, n_bootstraps=10000, alfa=0.05):
    estimacions_bootstrap = []
    n = len(dades)
    
    for _ in range(n_bootstraps):
        # Pas 2: Mostreig amb reposició (replace=True)
        mostra_b = np.random.choice(dades, size=n, replace=True)
        # Pas 3: Calcular l'estadístic d'interès (la mediana)
        mediana_b = np.median(mostra_b)
        estimacions_bootstrap.append(mediana_b)
        
    # Pas 4: Calcular els percentils per a l'IC (ex: 2.5% i 97.5%)
    inferior = np.percentile(estimacions_bootstrap, (alfa / 2) * 100)
    superior = np.percentile(estimacions_bootstrap, (1 - alfa / 2) * 100)
    
    return np.median(dades), inferior, superior

# Executem la funció
mediana_obs, ic_inf, ic_sup = interval_confianca_bootstrap(temps_registre)

print(f"Mediana observada: {mediana_obs:.2f}")
print(f"Interval de Confiança 95% (Bootstrap): [{ic_inf:.2f}, {ic_sup:.2f}]")
```

### 📊 Implementacio a R
```r
# Fixem la llavor
set.seed(42)

# Simulem les mateixes dades esbiaixades
temps_registre <- rexp(30, rate = 1/10)

# Configuració del Bootstrap
n_bootstraps <- 10000
estimacions_bootstrap <- numeric(n_bootstraps)
n <- length(temps_registre)

for(i in 1:n_bootstraps) {
  # Pas 2: Mostreig amb reposició
  mostra_b <- sample(temps_registre, size = n, replace = TRUE)
  # Pas 3: Calcular la mediana
  estimacions_bootstrap[i] <- median(mostra_b)
}

# Pas 4: Calcular percentils per al IC del 95%
mediana_observada <- median(temps_registre)
ic_bootstrap <- quantile(estimacions_bootstrap, probs = c(0.025, 0.975))

cat(sprintf("Mediana observada: %.2f\n", mediana_observada))
cat(sprintf("Interval de Confiança 95%% (Bootstrap): [%.2f, %.2f]\n", 
            ic_bootstrap[1], ic_bootstrap[2]))
```
