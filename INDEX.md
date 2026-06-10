# 📚 Índex de Documentació - Quadern d'Anàlisis 2.0

Benvingut al repositori actualitzat del teu blog! Aquí tens una guia per navegar per la documentació i el projecte.

---

## 🎯 Per On Comentar?

### Si vols...

**▶️ Saber què ha canviat**
👉 Llegeix **[CANVIS.md](CANVIS.md)** - Resum complet de totes les millores

**▶️ Veure com és el blog**
👉 Mira **[PREVISUALITZACIO.md](PREVISUALITZACIO.md)** - Visuals ASCII del disseny final

**▶️ Posar el blog en marxa**
👉 Segueix **[SETUP.md](SETUP.md)** - Guia pas a pas per instalarlo

**▶️ Entendre les noves funcionalitats**
👉 Explora **[FUNCIONALITATS.md](FUNCIONALITATS.md)** - Detalls de cada feature

**▶️ Visió general del projecte**
👉 Consulta **[README.md](README.md)** - Structure, tecnologies, guia d'us

---

## 📋 Estructura de la Documentació

```
alberthr-blog-mejorat/
│
├── 📄 README.md              ← Visió general i estructura
├── 📄 SETUP.md               ← Configuració i instal·lació
├── 📄 CANVIS.md              ← Resum de les millores
├── 📄 FUNCIONALITATS.md      ← Detalls de cada nova funció
├── 📄 PREVISUALITZACIO.md    ← Com es veurà el blog
├── 📄 INDEX.md               ← Aquest fitxer
│
├── 📁 _posts/                ← Els teus posts en Markdown
├── 📁 _layouts/              ← Templates HTML dels posts
├── 📁 _includes/             ← Components reutilitzables
├── 📁 assets/
│   ├── 📁 css/               ← Estils (MODIFICAT)
│   └── 📁 js/                ← Scripts JavaScript (NOU)
│
└── 📄 _config.yml            ← Configuració del blog (MODIFICAT)
```

---

## ⚡ Inici Ràpid (3 Passos)

### Pas 1: Configurar
```bash
cd alberthr-blog-mejorat
bundle install
```

### Pas 2: Servir
```bash
bundle exec jekyll serve
```

### Pas 3: Veure
Abre el navegador a `http://localhost:4000` ✨

---

## 🎨 Que Verás al Blog?

### ✅ Noves Funcionalitats

1. **🔍 Cercador**
   - Barra a la capçalera
   - Busca per títol, resum i tags
   - En temps real sense recarregar

2. **📝 Resums Automàtics**
   - 30 primeres paraules de cada post
   - Es generen automàticament
   - Facilita la lectura ràpida

3. **🏷️ Filtres de Tags**
   - Selecciona un tag per filtrar
   - Ja existia però millorat visualment
   - Diseny pill arrodonit

4. **🔗 Posts Relacionats**
   - Al final de cada post
   - Fins a 3 posts amb tags similars
   - Millora la navegació

### 📊 Millores Visuals

- **Títol**: "Quadern d'Anàlisis" (més personal)
- **Colors**: Paleta mejorada (blau vibrant #0066cc)
- **Espai**: Més blanc, disseny respirable
- **Responsive**: Totalment adaptat a mòbils
- **Animacions**: Hover effects subtils

---

## 📖 Documentació Detallada

### [SETUP.md](SETUP.md) - Configuració
**Per a qui**: Vols instal·lar i executar el blog
- Requisits del sistema
- Instal·lació de Jekyll
- Configuració inicial
- Troubleshooting

### [CANVIS.md](CANVIS.md) - Resum de Millores
**Per a qui**: Vols saber exactament que ha canviat
- Llista de fitxers modificats
- Noves funcionalitats
- Paleta de colors
- Estadístiques del projecte

### [FUNCIONALITATS.md](FUNCIONALITATS.md) - Guia Detallada
**Per a qui**: Vols entendre com funciona tot
- Com usar cada funció
- Exemples pràctics
- Consells d'optimització
- FAQ

### [PREVISUALITZACIO.md](PREVISUALITZACIO.md) - Visuals
**Per a qui**: Vols veure com quedara visualment
- ASCII art de la pàgina principal
- ASCII art de posts individuals
- Paleta de colors visual
- Efectes de hover

### [README.md](README.md) - Visió General
**Per a qui**: Vols conèixer el projecte en general
- Estructura del projecte
- Llista de funcionalitats
- Tecnologies usades
- Com afegir posts nous

---

## 🚀 Tasques Típiques

### 🎯 Afegir un Post Nou

1. Crea un fitxer: `_posts/YYYY-MM-DD-titol.md`
2. Afegeix front matter:
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
4. Guarda i verifica a `http://localhost:4000`

📚 Més info: [SETUP.md](SETUP.md) → "4. Afegir primer posts"

### 🎨 Canviar Colors

1. Edita `assets/css/style.css`
2. Busca `:root { --accent-color: #0066cc; }`
3. Canvia el codi de color
4. Guarda i refresca el navegador

📚 Més info: [FUNCIONALITATS.md](FUNCIONALITATS.md) → "Personalització Avançada"

### 🔧 Canviar el Nombre de Posts Relacionats

1. Edita `_layouts/post.html`
2. Busca `{% assign max_related = 3 %}`
3. Canvia el número
4. Guarda i refresca

📚 Més info: [FUNCIONALITATS.md](FUNCIONALITATS.md) → "Canviar Número de Posts Relacionats"

### 📤 Pujar a GitHub Pages

1. Fes els teus canvis
2. Executa:
```bash
git add .
git commit -m "Descripció dels canvis"
git push origin main
```
3. Verifica a `https://tu-username.github.io`

📚 Més info: [SETUP.md](SETUP.md) → "5. Pujar a GitHub Pages"

---

## ❓ Preguntes Comunes

**P: Com canvio el títol del blog?**
R: Edita `_config.yml` → `title: "Nou Títol"`

**P: Puc cambiar la paleta de colors?**
R: Sí! Edita `assets/css/style.css` → `:root`

**P: Per què els resums són automàtics?**
R: Per a no haver de mantenir manualment. Si vols que siga diferent, modifica les primeres línies del post.

**P: Quants posts relacionats es mostren?**
R: Fins a 3. Si vols més, edita `_layouts/post.html`

**P: El cercador busca fitxers vells?**
R: Sí, busca tots els posts sense limitació temporal.

📚 Més preguntes: [FUNCIONALITATS.md](FUNCIONALITATS.md) → "❓ Preguntes Freqüents"

---

## 🔧 Personalitzacions Recomanades

### Nivell Fàcil
- Canviar títol (`_config.yml`)
- Canviar descripció (`_config.yml`)
- Canviar color accent (`assets/css/style.css`)
- Afegir Google Analytics (`_config.yml`)

### Nivell Mig
- Canviar nombre de posts relacionats (`_layouts/post.html`)
- Augmentar longitud de resums (`index.html`)
- Afegir més tags als posts

### Nivell Avançat
- Afegir dark mode (CSS)
- Afegir paginació (Jekyll)
- Afegir comentaris (Disqus)
- Afegir més filtres (JavaScript)

---

## 📞 Problemes Comuns

### El blog no es veu
1. Verifica que executesS `bundle exec jekyll serve`
2. Abre `http://localhost:4000` (no `localhost`)
3. Comprova que no hi ha errors en la consola

📚 Més: [SETUP.md](SETUP.md) → "Troubleshooting"

### Els canvis no apareixen
1. Para el servidor (Ctrl+C)
2. Executa `bundle exec jekyll clean`
3. Inicia de nou
4. Esborra la cache del navegador

### Error "Gem not found"
```bash
bundle install
```

---

## 📚 Recursos Externs

### Jekyll
- [Jekyll Official Docs](https://jekyllrb.com/)
- [Liquid Template Language](https://shopify.github.io/liquid/)

### Markdown
- [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### GitHub Pages
- [GitHub Pages Documentation](https://pages.github.com/)

### Disseny & Colors
- [Coolors Color Picker](https://coolors.co/)
- [HTML Color Codes](https://htmlcolorcodes.com/)

---

## 🎉 Siguents Passos

1. **Llegeix [SETUP.md](SETUP.md)** per a instal·lar
2. **Mira [PREVISUALITZACIO.md](PREVISUALITZACIO.md)** per a veure el disseny
3. **Explora [FUNCIONALITATS.md](FUNCIONALITATS.md)** per a entendre les millores
4. **Personalitza** els colors i configuració
5. **Afegeix** els teus primer posts
6. **Publica** a GitHub Pages

---

## 🎯 Checklist de Configuració

- [ ] He llegit [SETUP.md](SETUP.md)
- [ ] He instal·lat les dependències (`bundle install`)
- [ ] He inicia el servidor (`bundle exec jekyll serve`)
- [ ] He vist el blog a `http://localhost:4000`
- [ ] He editat `_config.yml` amb el meu nom i descripció
- [ ] He personalitzat els colors (opcional)
- [ ] He afegit el meu primer post a `_posts/`
- [ ] He verificat que funciona tot correctament
- [ ] He fet push a GitHub Pages
- [ ] He verificat que es veu a la web pública

---

## 📝 Historial de Versions

| Versió | Data | Canvis |
|--------|------|--------|
| 2.0.0 | Juny 2026 | Redisseny professional complet |
| 1.0.0 | Anterior | Versió inicial minimalista |

---

## 💬 Retroalimentació

Si tens suggerències o millores:
1. Prova els canvis localment
2. Fes els canvis al projecte
3. Fes push i verifica

---

**¡Gaudeix del teu blog renovado! 🚀**

Per a començar: 👉 [SETUP.md](SETUP.md)

---

*Última actualització: Juny 2026*
*Documentació completa per a Quadern d'Anàlisis v2.0*
