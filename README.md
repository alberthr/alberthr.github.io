# Quadern personal d'anàlisi

Blog personal sobre estadística, modelització, MMM (Marketing Mix Modeling) i anàlisi de dades, allotjat a GitHub Pages.

## 📋 Estructura del Projecte

```
.
├── _posts/                 # Articles del blog en Markdown
├── _layouts/
│   ├── default.html        # Esquelet base (head, favicon, header, footer)
│   ├── page.html           # Pàgines estàtiques
│   └── post.html           # Entrades del blog
├── _includes/              # Capçalera i peu
├── assets/
│   ├── css/                # Estils
│   ├── js/                 # Scripts (cerca, TOC, etc.)
│   └── images/             # Imatges del site (incl. imatge OG per defecte)
├── eines/                  # Simuladors i calculadores en HTML/JS autònom
├── cv/                     # Pàgina de currículum (HTML autònom)
├── _config.yml             # Configuració del blog
├── index.html              # Pàgina principal
├── 404.html                # Pàgina d'error
└── robots.txt              # SEO
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
- Integrat amb Google Analytics

### 🔗 **Posts Relacionats**
- Al final de cada post, mostra els posts amb més tags en comú
- Ordenats per nombre de coincidències (no només per tenir-ne alguna)
- Facilita la descoberta de contingut relacionat

### 📤 **Compartir**
- Icones de compartició (X, LinkedIn, WhatsApp, email, copiar enllaç) al final de cada post
- Enllaços directes sense scripts ni dependències externes

### 📐 **Fórmules matemàtiques**
- Suport per MathJax per a notació matemàtica dins dels posts

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
     - una-etiqueta
   excerpt: "Un resum breu que apareixerà a la fitxa i a la capçalera de l'entrada."
   ---
   ```

3. Escriu el contingut en Markdown.

### 📏 Longituds recomanades

| Camp | Màxim orientatiu |
|---|---|
| `title` | ~70 caràcters |
| `excerpt` | ~250 caràcters |

Mantenir-se dins d'aquests marges evita que el títol o el resum quedin tallats a la llista de posts, a les previsualitzacions de xarxes socials o als resultats de cerca.

### 🏷️ Criteri de tags

Fes servir com a màxim 2-3 tags per post (4 només en casos genuïnament transversals). Criteris generals a l'hora de definir o reutilitzar tags:

- Agrupa per **tema o mètode**, no per detall puntual del post.
- Evita crear un tag nou que només s'utilitzaria en un sol post de manera permanent (fusiona'l amb el tag existent més proper).
- Evita tags massa genèrics que acabarien apareixent a la majoria dels posts (perden valor com a filtre).
- Revisa periòdicament la llista de tags existents abans de crear-ne un de nou, per no duplicar conceptes similars amb noms diferents.

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
- **image**: Imatge per defecte per a previsualitzacions (OpenGraph / Twitter Card)
- **twitter.card**: Tipus de card per a X
- **kramdown**: `math_engine: mathjax`, `syntax_highlighter: rouge`
- **permalink**: `/entrades/:title/`

## 📦 Tecnologies

- **Jekyll**: Generador de llocs estàtics
- **Markdown (Kramdown/GFM)**: Format per escriure posts
- **Rouge**: Ressaltat de sintaxi per a blocs de codi
  - No suporta DAX nativament; fes servir `sql` com a aproximació
- **MathJax**: Notació matemàtica
- **jekyll-seo-tag**: Metadades SEO / OpenGraph / Twitter Cards
- **GitHub Pages**: Allotjament i desplegament automàtic

## 🚀 Publicar canvis

1. Puja els canvis a la branca `main` del repositori.
2. GitHub Pages fa el build automàticament amb Jekyll (no cal `bundle install` ni servidor propi).
3. Al cap d'uns minuts els canvis són visibles al domini configurat.

### Desenvolupament local (opcional)

```bash
bundle install
bundle exec jekyll serve
```

I obre `http://localhost:4000`.

## 📄 Llicència

Copyright © 2026. Tots els drets reservats.

---

**Última actualització**: 2026-07-19
