# Quadern personal d'anàlisi

Blog personal sobre estadística, modelització, MMM (Marketing Mix Modeling) i anàlisi de dades, allotjat a GitHub Pages.

## 📋 Estructura del Projecte

```
.
├── _posts/                    # Articles del blog en Markdown
├── _layouts/
│   ├── default.html           # Esquelet base (head, favicon, header, footer)
│   ├── page.html               # Pàgines estàtiques (eines, cv...)
│   └── post.html                # Entrades del blog (capçalera, tags, TOC, relacionats)
├── _includes/                 # Capçalera i peu
├── assets/
│   ├── css/main.css           # Estils (tema clar/fosc, tipografia Fraunces/Source Serif 4)
│   └── js/
│       ├── filter.js           # Cerca i filtre per etiquetes (client-side)
│       └── toc.js               # Scrollspy de l'índex de continguts
├── eines/                     # Simuladors i calculadores en HTML/JS autònom
├── cv/                        # Pàgina de currículum (HTML autònom)
├── _config.yml                # Configuració del blog
├── index.html                 # Pàgina principal
├── 404.html                   # Pàgina d'error
└── robots.txt                 # SEO
```

> ⚠️ **Nota:** `eines/` i `cv/` són HTML pur i no passen pel sistema de plantilles de Jekyll. Elements comuns del site (favicon, Google Analytics) s'han de mantenir manualment a cada fitxer d'aquestes carpetes.

## ✨ Funcionalitats

### 🔍 **Cercador de Posts**
- Cerca en temps real per títol, contingut i tags (indexació completa via JSON)
- Barra de cerca ubicada a la capçalera del blog
- Filtratge instantani sense recarregar la pàgina

### 📝 **Excerpts**
- Cada post defineix el seu propi resum al front matter (`excerpt`)
- Es mostra a la llista de posts i a la capçalera de l'entrada

### ⏱️ **Temps de lectura**
- Calculat automàticament a partir del nombre de paraules del post
- Es mostra a la capçalera de cada entrada

### 🏷️ **Filtratge per Tags**
- Filtra els posts per categories (tags)
- Filtre visual amb botons interactius
- Integrat amb Google Analytics (ID `G-24FW05JLVP`)

### 🔗 **Posts Relacionats**
- Al final de cada post, mostra els 3 posts amb més tags en comú
- Ordenats per nombre de coincidències (no només per tenir-ne alguna)
- Facilita la descoberta de contingut relacionat

### 📐 **Fórmules matemàtiques**
- Suport per MathJax per a notació matemàtica dins dels posts

### 🌓 **Mode fosc**
- El blog suporta tema clar i fosc

## 🎨 Disseny Visual

### Paleta i estil
- Fons de paper càlid, minimalista (blancs, grisos, un sol color de contrast)
- Motiu de scatter-plot en SVG
- Sense dates visibles enlloc del blog

### Tipografia
- Fraunces (títols) i Source Serif 4 (text)
- Mides responsive per a dispositius mòbils
- Jerarquia visual clara amb títols i subtítols

## 📱 Responsive Design

El blog és completament responsive i funciona correctament en escriptori, tauletes i mòbils.

## 🚀 Com Afegir nous Posts

1. Crea un fitxer Markdown a `_posts/` amb el format:
   ```
   AAAA-MM-DD-titol-slug.md
   ```
   (la data del nom és tècnica, per ordenar les entrades; **no es mostra enlloc** al blog)

2. Afegeix el **front matter** al principi del fitxer:
   ```yaml
   ---
   layout: post
   title: "Títol del Post"
   tags:
     - estadistica
   excerpt: "Un resum breu que apareixerà a la fitxa i a la capçalera de l'entrada."
   ---
   ```

3. Escriu el contingut en Markdown.

### 🏷️ Criteri de tags

Fes servir com a màxim 2-3 tags per post (4 només en casos genuïnament transversals):

| Tag | Quan s'utilitza |
|---|---|
| `estadistica` | Inferència, tests, mètodes estadístics (intervals, bootstrapping, K-S, GMM, Mahalanobis...) |
| `probabilitat` | Simulació i mètodes probabilístics (Montecarlo) |
| `optimitzacio` | Problemes d'assignació/optimització (Algoritme Hongarès) |
| `modelitzacio` | Modelització publicitària / MMM (corbes de saturació, Ad Recall, decisions estructurals) |
| `publicitat` | Domini d'aplicació publicitària, més ampli que `modelitzacio` |
| `r` / `python` | Quan el post inclou implementació de codi substancial (no merament il·lustrativa) en aquell llenguatge |
| `powerbi` | Posts sobre Power BI / DAX |

Evita crear tags que només portaria un sol post de manera permanent (fusiona'ls amb el tag més proper) i tags massa genèrics que acabarien a la majoria dels posts (perden valor com a filtre).

## 🔧 Afegir eines HTML

1. Desa el fitxer `.html` de l'eina dins de `/eines/`.
2. Afegeix una fitxa a `/eines/index.html`.
3. Copia el `<link rel="icon">` d'un altre fitxer de `/eines/` al `<head>` del nou fitxer.

## 📄 Actualitzar el CV

Edita directament `/cv/index.html`.

## ⚙️ Configuració

### `_config.yml`
- **title**: Títol del blog
- **description**: Descripció del blog
- **url / baseurl**: URL del site a GitHub Pages
- **kramdown**: `math_engine: mathjax`, `syntax_highlighter: rouge`
- **permalink**: `/entrades/:title/`

## 📦 Tecnologies

- **Jekyll**: Generador de llocs estàtics
- **Markdown (Kramdown/GFM)**: Format per escriure posts
- **Rouge**: Ressaltat de sintaxi per a blocs de codi
  - No suporta DAX nativament; fes servir `sql` com a aproximació
- **MathJax**: Notació matemàtica
- **GitHub Pages**: Allotjament i desplegament automàtic

## 🚀 Publicar canvis

1. Puja els canvis a la branca `main` del repositori `alberthr.github.io`.
2. GitHub Pages fa el build automàticament amb Jekyll (no cal `bundle install` ni servidor propi).
3. Al cap d'uns minuts els canvis són visibles a `https://alberthr.github.io`.

### Desenvolupament local (opcional)

```bash
bundle install
bundle exec jekyll serve
```

I obre `http://localhost:4000`.

## 📄 Llicència

Copyright © 2026 Albert Hinojosa Rovira. Tots els drets reservats.

---

**Última actualització**: 2026-07-17
