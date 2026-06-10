# 🎨 Previsualització Visual del Blog

## 📱 Pàgina Principal

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Quadern d'Anàlisis  🔍  [Cercar posts...]                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  Notes personals sobre data analysis, IA, analítica web         │
│  i altres temes d'interès.                                       │
│                                                                   │
│  [#tots] [#python] [#data-analysis] [#sql] [#analytics]        │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Com Detectar Outliers ràpidament amb Python (IQR)       │  │
│  │ 📅 09 jun 2026                                           │  │
│  │                                                          │  │
│  │ Aquesta és la funció clàssica que faig servir per       │  │
│  │ identificar valors atípics en un DataFrame utilitzant... │  │
│  │                                                          │  │
│  │ #python #outliers #neteja-dades                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ L'Algoritme Hongarès per a Optimització                 │  │
│  │ 📅 09 jun 2026                                           │  │
│  │                                                          │  │
│  │ Un algoritme clàssic i potent per a resoldre el         │  │
│  │ problema de assignació òptima. Descobreix com...        │  │
│  │                                                          │  │
│  │ #algoritmes #optimization #python                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Suavitzat Exponencial: Prediccions Senzilles            │  │
│  │ 📅 09 jun 2026                                           │  │
│  │                                                          │  │
│  │ Una tècnica simple i potent per a fer prediccions       │  │
│  │ sèries temporals amb només unes poques línies...        │  │
│  │                                                          │  │
│  │ #time-series #forecasting #estadística                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│ Copyright © 2026 - Quadern d'Anàlisis                           │
└─────────────────────────────────────────────────────────────────┘
```

## 📄 Pàgina de Post Individual

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Quadern d'Anàlisis  🔍  [Cercar posts...]                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  COM DETECTAR OUTLIERS RÀPIDAMENT AMB PYTHON (IQR)              │
│                                                                   │
│  📅 09 jun 2026                                                  │
│                                                                   │
│  #python #outliers #neteja-dades                                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  Aquesta és la funció clàssica que faig servir per identificar  │
│  valors atípics en un DataFrame utilitzant el rang interquartílic│
│  (IQR).                                                          │
│                                                                   │
│  ### El codi en Python                                          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ import pandas as pd                                      │  │
│  │                                                          │  │
│  │ def detecta_outliers(df, columna):                       │  │
│  │     Q1 = df[columna].quantile(0.25)                     │  │
│  │     Q3 = df[columna].quantile(0.75)                     │  │
│  │     IQR = Q3 - Q1                                        │  │
│  │     ...                                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  [Més contingut del post...]                                    │
│                                                                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                   │
│  🔗 POSTS RELACIONATS                                            │
│                                                                   │
│  ┌────────────────────────┐ ┌────────────────────────┐ ┌──────┐ │
│  │ Análisis de Anomalías  │ │ Estadística Descriptiva│ │ ...  │ │
│  │ con Python             │ │                        │ │      │ │
│  │                        │ │ #data-analysis         │ │      │ │
│  │ #python #outliers      │ │ #python                │ │      │ │
│  │ #data-cleaning         │ │                        │ │      │ │
│  └────────────────────────┘ └────────────────────────┘ └──────┘ │
│                                                                   │
│  [Botó] ← Tornar a l'inici                                      │
│                                                                   │
│ Copyright © 2026 - Quadern d'Anàlisis                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 Paleta de Colors

```
BLANC PRINCIPAL (Fons)
███████████████████████████████  #fafaf8
Blanc gairebé pur, très elegant

GRIS SECUNDARI
███████████████████████████████  #f5f3f0
Per a elements secundaris

TEXT PRINCIPAL
███████████████████████████████  #1a1a1a
Negre molt fosc per a máxima llegibilitat

TEXT MUDAT
███████████████████████████████  #666666
Gris mig per a text secundari

ACCENT PRINCIPAL (Blau)
███████████████████████████████  #0066cc
Color principal per a interacció, links, hover states

ACCENT HOVER (Blau més fosc)
███████████████████████████████  #0052a3
Per a hover states dels links

BORDER/SEPARADORES
███████████████████████████████  #e0e0e0
Gris clar per a separar elements

TAGS FONS
███████████████████████████████  #f0f4f8
Blau molt clar per a fons de tags

CODI FONS
███████████████████████████████  #1e293b
Gris fosc per a blocs de codi

SECUNDARI VERD
███████████████████████████████  #10b981
Per a elements positius/destacats

SECUNDARI TARONJA
███████████████████████████████  #f59e0b
Per a avisos/destacats
```

---

## ✨ Efectes Visuals

### Hover sobre Post
```
Sense hover:
┌────────────────────────────┐
│ Títol del Post             │
└────────────────────────────┘

Amb hover (la barra esquerra es torna blava):
█ ┌──────────────────────────┐
█ │ Títol del Post (més fosc)│
█ └──────────────────────────┘
```

### Tag
```
Normal:      #python
Amb hover:   #python (borde blau, color blau)
Actiu:       #python (fons blau, text blanc)
```

### Botó de Filtre
```
Inactiu:   [#tots] (fons clar, borde gris)
Actiu:     [#tots] (fons blau, text blanc)
Hover:     (fons blau clar, borde blau)
```

### Tarja de Post Relacionat
```
Normal:
┌─────────────────────────┐
│ Títol del Post Relacionat│
│ #tag1 #tag2              │
└─────────────────────────┘

Hover (elevació):
┌─────────────────────────┐
│ Títol (borde blau)       │
│ #tag1 #tag2              │
└─────────────────────────┘
(s'eleva lleugerament)
```

---

## 📱 Responsive en Mòbil

```
ESCRIPTORI (900px+)
┌────────────────────────────────────────┐
│ Quadern d'Anàlisis   🔍 [Cercar...]   │
├────────────────────────────────────────┤
│ Descripció del blog                     │
│ [Filtres en una línia]                  │
│ ┌──────────────────────────────────┐   │
│ │ Post 1 amb resum                 │   │
│ └──────────────────────────────────┘   │
│ ┌──────────────────────────────────┐   │
│ │ Post 2 amb resum                 │   │
│ └──────────────────────────────────┘   │
└────────────────────────────────────────┘

TAULETA (768px-900px)
┌──────────────────────────┐
│ Quadern d'Anàlisis       │
│ 🔍 [Cercar...]           │
├──────────────────────────┤
│ Descripció                │
│ [Filtres en 2-3 línies]  │
│ ┌────────────────────┐   │
│ │ Post 1             │   │
│ └────────────────────┘   │
│ ┌────────────────────┐   │
│ │ Post 2             │   │
│ └────────────────────┘   │
└──────────────────────────┘

MÒBIL (<768px)
┌────────────────────┐
│ Quadern d'Anàlisis │
│ 🔍 [Cercar...]     │
├────────────────────┤
│ Descripció         │
│ [Filtres vertical] │
│ ┌────────────────┐ │
│ │ Post 1         │ │
│ └────────────────┘ │
│ ┌────────────────┐ │
│ │ Post 2         │ │
│ └────────────────┘ │
└────────────────────┘
```

---

## 🎯 Elements Interactius

### Cercador
1. Clica a la barra "🔍 Cercar posts..."
2. Escriu una paraula clau (ex: "python")
3. Els posts es filtren en temps real
4. Esborra per veure tots de nou

**Busca en:**
- 📖 Títol del post
- 📝 Resum automàtic
- 🏷️ Tags del post

### Filtres de Tags
1. Clica en "python" o altre tag
2. Es destaca en blau l'etiqueta seleccionada
3. Veus només posts amb aquest tag
4. Clica "#tots" per veure tots

### Posts Relacionats
1. Vas a un post individual
2. Veus fins a 3 posts relacionats al final
3. Basats en tags similars
4. Clica per explorar

---

## 🔧 Personalització per l'Usuari

### Canviar Accent Color a Verd
1. Edita `assets/css/style.css`
2. Busca `:root { --accent-color: #0066cc; }`
3. Canvia a `#10b981` (verd)
4. Tots els blues es convertiran a verts

### Canviar Nombre de Posts Relacionats
1. Edita `_layouts/post.html`
2. Busca `{% assign max_related = 3 %}`
3. Canvia `3` per `5` (o el que vulguis)

### Augmentar Longitud de Resums
1. Edita `index.html`
2. Busca `truncatewords: 30`
3. Canvia `30` per `50` (més paraules)

---

## ✅ Verificació Visual

Després de clonar el projecte, verifica que veus:

- ✅ Títol "Quadern d'Anàlisis" a la capçalera
- ✅ Barra de cerca amb placie 🔍
- ✅ Filtres de tags amb disseny pill
- ✅ Resums de 2-3 línies sotots posts
- ✅ Data de publicació (📅) amb format
- ✅ Posts relacionats al final de cada post
- ✅ Colors blaus #0066cc coherents
- ✅ Hover effects en posts (barra esquerra blava)
- ✅ Responsive en mòbil (verticalment)

---

## 🎨 Canvis Principals Visuals

| Element | Abans | Després |
|---------|-------|---------|
| Títol | "Data Analyst Notebook" | "Quadern d'Anàlisis" |
| Cercador | ❌ No existia | ✅ Barra a header |
| Resums | ❌ Només títols | ✅ Resums de 30 paraules |
| Posts Relacionats | ❌ No existien | ✅ Fins a 3 al final |
| Color Accent | Blau fosc #2980b9 | Blau vibrant #0066cc |
| Espai Blanc | Mínim | Abundant (més respirable) |
| Headers | Simples | Amb accent blau a l'esquerra |
| Tags | Simples | Arrodonits (pill style) |
| Responsive | Bàsic | Completament optimitzat |

---

**Aquesta previsualització es basa en el disseny final implementat.**
