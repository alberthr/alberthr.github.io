# 🚀 Guia de Configuració Ràpida

## 1️⃣ Preparació Inicial

### Requisits
- Git
- Ruby 2.7+
- Jekyll (la teniu si useu GitHub Pages)
- GitHub Account (per al hosting)

### Clonar/Descarregar el Projecte

```bash
# Si tens el projecte com zip
unzip alberthr-blog-mejorat.zip
cd alberthr-blog-mejorat

# O si clonas del repositori
git clone https://github.com/alberthr/alberthr.github.io.git
cd alberthr.github.io
```

---

## 2️⃣ Configuració de Jekyll Localment

### Instal·lar Dependències

```bash
# Instal·lar gems (si és la primera vegada)
bundle install

# Actualitzar gems
bundle update
```

### Servir Localment

```bash
# Iniciar el servidor local
bundle exec jekyll serve

# La web estará en http://localhost:4000
```

### Comprovar Canvis

Mentre el servidor corre, els canvis es recompilen automàticament. Només actualitza el navegador.

---

## 3️⃣ Personalització Bàsica

### Editar Configuració (`_config.yml`)

```yaml
title: "Quadern d'Anàlisis"                  # Títol del blog
description: "Notes personals..."            # Descripció
baseurl: ""                                  # Deixa buit
url: ""                                      # Deixa buit
google_analytics: "G-XXXXXXXXXX"             # Opcional
```

### Canviar Colors (`assets/css/style.css`)

Busca la secció `:root` i modifica:

```css
:root {
  --accent-color: #0066cc;    /* Blau */
  --bg-color: #fafaf8;        /* Blanc fons */
  --text-color: #1a1a1a;      /* Text negre */
  /* ... */
}
```

### Canviar Google Analytics

1. Vai a [Google Analytics](https://analytics.google.com/)
2. Copia el ID de la propietat (ex: G-XXXXXXXXXX)
3. Pega'l a `_config.yml`

---

## 4️⃣ Afegir els Primer Posts

### Crear un Post Nou

1. Crea un fitxer a `_posts/` amb nom:
   ```
   YYYY-MM-DD-titol-slug.md
   ```
   
   Exemple: `2026-06-15-machine-learning-basico.md`

2. Afegeix el **front matter** al principi:

```yaml
---
layout: post
title: "Títol del Post (útil i descriptiu)"
tags:
  - python
  - machine-learning
  - tutorials
---

## Contingut en Markdown

Aquí escrius el teu contingut en Markdown...

### Subtítol

Més contingut...

### Codi Python

```python
def funcio():
    pass
```
```

3. Guarda el fitxer
4. El navegador es recarregarà automàticament

### Exemples de Front Matter

```yaml
---
layout: post
title: "Com Usar Pandas"
tags:
  - python
  - data-analysis
---
```

```yaml
---
layout: post
title: "SQL para Principiantes"
tags:
  - sql
  - databases
  - tutorials
---
```

---

## 5️⃣ Pujar a GitHub Pages

### 1. Configurar el Repositori

```bash
# Afegir el repositori remot
git remote add origin https://github.com/TU-USERNAME/TU-REPO.git

# Substitueix TU-USERNAME i TU-REPO
```

### 2. Fer Commit dels Canvis

```bash
# Afegir tots els fitxers
git add .

# Crear un commit
git commit -m "Actualització del blog: [descripció dels canvis]"

# Pujar a GitHub
git push origin main
```

### 3. Verificar a GitHub Pages

- Vai a `https://tu-username.github.io`
- Comprova que el blog es veu correctament

### 4. Publicació Automàtica

GitHub Pages es refresca automàticament quan fas push:
1. Fas push a la branca `main`
2. GitHub detecta els canvis
3. Compila Jekyll automàticament
4. El blog es publica

**La primera vegada pot tardar 1-5 minuts.**

---

## 6️⃣ Checks de Validació

Després de clonar/descarregar, verifica:

```bash
# 1. Que Jekyll compila sense errors
bundle exec jekyll build

# 2. Que no hi ha warnings
bundle exec jekyll serve

# 3. Que pots accedir a http://localhost:4000

# 4. Que veus:
✅ Títol "Quadern d'Anàlisis"
✅ Barra de cerca (🔍)
✅ Filtres de tags
✅ Resums de posts
✅ Dates de publicació (📅)
```

---

## 7️⃣ Troubleshooting

### Error: "Gem not found"
```bash
bundle install
```

### Error: "Port 4000 is already in use"
```bash
bundle exec jekyll serve --port 4001
# O mata el procés que usa el port
```

### Els canvis no es veus
1. Para el servidor (Ctrl+C)
2. Executa `bundle exec jekyll clean`
3. Inicia de nou: `bundle exec jekyll serve`
4. Borra la cache del navegador (Ctrl+Shift+Delete)

### Imatges que no apareixen
1. Assegura't que les imatges están en `assets/`
2. Usa la ruta relativa: `![alt](/assets/images/image.png)`

### Resum no funciona
1. Comprova que el post té contingut
2. Si és molt curt, mostra el que hi hagi
3. Pots augmentar les paraules del resum editant `index.html`

---

## 8️⃣ Estructura de Directoris Recomanada

```
alberthr.github.io/
├── _posts/
│   ├── 2026-06-09-post1.md
│   ├── 2026-06-10-post2.md
│   └── 2026-06-11-post3.md
│
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── search.js
│   └── images/  (opcional, per a imatges)
│       ├── image1.png
│       └── image2.jpg
│
├── _layouts/
│   ├── default.html
│   └── post.html
│
├── _includes/
│   ├── head.html
│   └── footer.html
│
├── _config.yml
├── index.html
├── README.md
├── FUNCIONALITATS.md
├── CANVIS.md
└── PREVISUALITZACIO.md
```

---

## 9️⃣ Àlies Útils

Crea àlies en `.zshrc` o `.bashrc` per a velocitat:

```bash
alias jserve="bundle exec jekyll serve"
alias jbuild="bundle exec jekyll build"
alias jclean="bundle exec jekyll clean"
```

Después:
```bash
jserve      # Inicia el servidor
jbuild      # Compila
jclean      # Neteja i recompila
```

---

## 🔟 Passos Finals

1. ✅ Clona/descarrega el projecte
2. ✅ Executa `bundle install`
3. ✅ Inicia el servidor amb `bundle exec jekyll serve`
4. ✅ Verifica a `http://localhost:4000`
5. ✅ Afegeix els teus posts a `_posts/`
6. ✅ Personalitza `_config.yml`
7. ✅ Personalitza `assets/css/style.css` si vols
8. ✅ Fes push a GitHub
9. ✅ Verifica a `https://tu-username.github.io`
10. ✅ ¡Gaudeix del teu blog!

---

## 📚 Recursos Útils

### Jekyll
- [Jekyll Docs](https://jekyllrb.com/docs/)
- [Liquid Syntax](https://shopify.github.io/liquid/)

### Markdown
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
- [CommonMark Spec](https://spec.commonmark.org/)

### GitHub Pages
- [GitHub Pages Docs](https://pages.github.com/)
- [Build & Test Workflow](https://docs.github.com/en/pages)

### Color Picker
- [Color Picker Online](https://www.google.com/search?q=color+picker)
- [Color Scheme Generator](https://coolors.co/)

---

## 💬 Com Demanar Ajuda

Si tens problemes:

1. **Revisa els logs**: `bundle exec jekyll serve` mostra errors
2. **Busca a Google**: "Jekyll [error]"
3. **Consulta Stack Overflow**: Puja una pregunta amb
   - El codi exacte
   - El missatge d'error complet
   - Els passos per reproduir

---

## ✨ Dica Pro

### Recompila Forçada
```bash
# Si algo es comporta estrany
rm -rf _site/
bundle exec jekyll serve
```

### Revisar Fitxers Processats
```bash
# Tot els fitxers generats están en _site/
# No els editis directament, edita els originals
```

### Usar Draft Mode
```bash
# Per a posts no publicats, renomena:
_drafts/2026-06-15-draft.md    # No apareix
_posts/2026-06-15-published.md  # Apareix
```

---

**¡Estàs llist per a começar! 🎉**

Per a dubtes específics, consulta:
- `README.md` - Visió general
- `FUNCIONALITATS.md` - Detalls de funcionalitats
- `CANVIS.md` - Que s'ha modificat
- `PREVISUALITZACIO.md` - Com es veurà
