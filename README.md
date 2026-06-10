# Quadern d'Anàlisis

Blog personal sobre data analysis, IA, analítica web i altres temes d'interès.

## 📋 Estructura del Projecte

```
.
├── _posts/                    # Articles del blog en Markdown
├── _layouts/                  # Plantilles HTML dels posts
├── _includes/                 # Components reutilitzables
├── assets/
│   ├── css/                   # Estils del blog
│   └── js/                    # Scripts JavaScript
├── _config.yml                # Configuració del blog
└── index.html                 # Pàgina principal
```

## ✨ Funcionalitats

### 🔍 **Cercador de Posts**
- Cerca en temps real per títol, contingut i tags
- Barra de cerca ubicada a la capçalera del blog
- Filtratge instantani sense recarregar la pàgina

### 📝 **Resums Automàtics**
- Cada post mostra un breu resum (30 primeres paraules)
- Generat automàticament a partir del contingut
- Facilita la lectura ràpida de la llista de posts

### 🏷️ **Filtratge per Tags**
- Filtra els posts per categories (tags)
- Filtre visual amb botons interactius
- Integrat amb Google Analytics

### 🔗 **Posts Relacionats**
- Al final de cada post, mostra 2-3 posts amb tags similars
- Facilita la descoberta de contingut relacionat
- Millora la navegació entre posts

## 🎨 Disseny Visual

### Paleta de Colors
- **Fons principal**: Blanc gairebé pur (`#fafaf8`)
- **Accent principal**: Blau vibrant (`#0066cc`)
- **Text**: Negre molt fosc (`#1a1a1a`) per a màxima llegibilitat
- **Secundari**: Grisos clars per a separadors i accents subtils

### Tipografia
- Font del sistema (Apple, Segoe UI, Roboto, etc.)
- Mides responsive per a dispositius mòbils
- Jerarquia visual clara amb títols i subtítols

## 📱 Responsive Design

El blog és completament responsive i funciona correctament en:
- 📺 Escriptori (900px de màxim ample)
- 💻 Tauletes
- 📱 Mòbils

## 🚀 Com Afegir nous Posts

1. Crea un fitxer Markdown a la carpeta `_posts/` amb el format:
   ```
   YYYY-MM-DD-titol-slug.md
   ```

2. Afegeix el **front matter** al principi del fitxer:
   ```yaml
   ---
   layout: post
   title: "Títol del Post"
   tags:
     - tag1
     - tag2
   ---
   ```

3. Escriu el contingut en Markdown

4. Els resums es generaran automàticament a partir del contingut

## 🔧 Configuració

### `_config.yml`
- **title**: Títol del blog
- **description**: Descripció del blog
- **baseurl**: URL base (deixa buit per a GitHub Pages)
- **google_analytics**: ID de Google Analytics (opcional)

## 📦 Tecnologies

- **Jekyll**: Generador de llocs estàtics
- **Markdown**: Format per a escriure posts
- **Kramdown**: Parser de Markdown amb suport per a codi sintàctic
- **Rouge**: Ressaltat de sintaxi per a blocs de codi

## 🎯 Millores Recents

- ✅ Nou títol: "Quadern d'Anàlisis"
- ✅ Paleta de colors mejorada (blancs, grisos + accent blau)
- ✅ Cercador de posts per títol i contingut
- ✅ Resums automàtics dels posts
- ✅ Posts relacionats per similitud de tags
- ✅ Disseny més professional amb millor jerarquia visual
- ✅ Totalment responsive per a mòbils
- ✅ Animacions suaus i transicions

## 📚 Exemples de Tags Recomanats

Alguns exemples de tags que pots usar:
- `python` - Posts sobre Python
- `data-analysis` - Anàlisi de dades
- `sql` - Consultes SQL
- `analytics` - Web Analytics
- `machine-learning` - Machine Learning
- `visualization` - Visualització de dades
- `ai` - Intel·ligència Artificial

## 🤝 Contribucions

Aquest és un projecte personal, però si tens suggestions o millores, siusplau reporta issues o fes pull requests.

## 📄 Llicència

Copyright © 2026 Albert HR. Tots els drets reservats.

---

**Última actualització**: 2026-06-10
