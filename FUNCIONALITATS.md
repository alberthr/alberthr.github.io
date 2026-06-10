# 📚 Guia de Funcionalitats Noves

Benvingut al nou **Quadern d'Anàlisis**! Aquí tens una guia detallada de totes les funcionalitats noves que s'han afegit al teu blog.

---

## 🔍 1. Cercador de Posts

### Com funciona

La barra de cerca ubicada a la capçalera del blog permet cercar posts per:
- **Títol**: Busca exacta del títol del post
- **Contingut**: Busca en el resum automàtic
- **Tags**: Busca per les etiquetes del post

### Ús

1. Fes clic a la barra de cerca
2. Escriu el terme que vols buscar
3. Els posts es filtraran **en temps real** mentre escrius
4. Esborra el text per veure tots els posts de nou

### Exemple

Si escrius "python", veuràs només els posts que tinguin "python" en el títol, resum o tags.

---

## 📝 2. Resums Automàtics

### Com funciona

Cada post de la pàgina principal mostra automàticament les **30 primeres paraules** del seu contingut.

- No necessites escriure manualment el resum
- Es genera automàticament a partir del contingut del Markdown
- Facilita la lectura ràpida

### Exemple

```
Post: "Com detectar Outliers ràpidament amb Python (IQR)"

Resum generat automàticament:
"Aquesta és la funció clàssica que faig servir per identificar valors atípics 
en un DataFrame utilitzant el rang interquartílic (IQR). El codi en Python..."
```

---

## 🏷️ 3. Filtres per Tags

### Com funciona

A la pàgina principal, pots veure un botó per a cada tag que tenguis als teus posts.

- **#tots**: Mostra tots els posts
- **#python**: Mostra només posts amb tag "python"
- **#data-analysis**: Mostra només posts amb tag "data-analysis"
- Etc.

### Ús

1. Fes clic en un dels botons de tag
2. Veuràs destacat en blau l'etiqueta seleccionada
3. Els posts es filtraran automàticament
4. Fes clic en "#tots" per veure tots els posts de nou

### Recomendació

Els tags es detallen automàticament a partir dels posts, així que no has de configurar-los manualment. Simplement usa els tags que vulgis en els teus posts Markdown.

---

## 🔗 4. Posts Relacionats

### Com funciona

Al final de cada post, apareix una secció "Posts Relacionats" que mostra **2-3 posts** amb etiquetes similars.

### Criteri de Similitud

Els posts es relacionen segons:
- **Etiquetes comunes**: Si dos posts comparteixen la mateixa etiqueta, es consideren relacionats
- **Màxim de resultats**: Es mostren fins a 3 posts relacionats
- **Si no hi ha**: Si no hi ha posts relacionats, aquesta secció no apareix

### Exemple

```
Post actual: "Com detectar Outliers amb Python"
Tags: python, outliers, neteja-dades

Posts relacionats que apareixeran:
- "Anàlisi d'Anomalies amb Pandas" (tag: python, neteja-dades)
- "Estadística Descriptiva" (tag: data-analysis, python)
```

---

## 🎨 5. Disseny Mejorat

### Canvis Visuals

1. **Títol del blog**: "Quadern d'Anàlisis"
   - Més personal i reflecteix millor el contingut

2. **Paleta de colors**:
   - Blancs i grisos subtils (més professional)
   - Accent blau vibrant (`#0066cc`) per a interactivitat
   - Millor contrast per a llegibilitat

3. **Header mejorat**:
   - Títol a l'esquerra
   - Barra de cerca a la dreta
   - Disseny flexible per a dispositius mòbils

4. **Llistat de posts**:
   - Separador subtil entre posts
   - Indicador visual al passar per sobre (barra blava a l'esquerra)
   - Resum visible sota el títol

5. **Tags**:
   - Disseny pill (arrodonits) més modern
   - Colors coherents amb el tema
   - Millor visibilitat

---

## 📱 6. Responsive Design

El blog funciona perfectament en tots els dispositius:

- **Escriptori**: Disseny complet amb tots els elements visibles
- **Tauleta**: Elements adaptat però legibles
- **Mòbil**: Disseny columnar simplificat

### Proves Recomanades

Prova el blog en:
- Google Chrome Developer Tools (F12)
- Dispositius reals (iPhone, iPad, etc.)

---

## 🚀 7. Millores de Rendiment

### Velocitat

- Cercador **en temps real** sense necessitat de fer clic a botons
- Filtratge instantani
- No requers recarregar la pàgina

### Accessibilitat

- Etiquetes ARIA per a lectors de pantalla
- Botons clarament clicables
- Contrast suficient per a llegibilitat

### SEO

- Metadades optimitzades
- URLs cleans per a cada post
- Estructura semàntica correcta

---

## 📖 Com Usar Tots els Elements Junts

### Flux Típic de l'Usuari

1. **Veure tots els posts**: Pàgina principal amb resum de cada post
2. **Filtrar per interès**: Fer clic en un tag per veure posts d'una categoria
3. **Cercar**: Usar la barra de cerca per trobar un tema específic
4. **Llegir un post**: Fer clic en el títol
5. **Descobrir relacionats**: Veure posts similars al final
6. **Volver**: Usar el botó "Tornar a l'inici"

### Exemple Pràctic

```
Usuari: Busco algo de Python
1. Escriu "python" a la barra de cerca
2. Veu tots els posts amb "python" en títol, resum o tags
3. Fa clic en un post
4. Llegeix el post complet
5. Veu posts relacionats al final
6. Fa clic en un post relacionat
```

---

## 💡 Consells per Optimitzar el Blog

### Tags

- Usa tags descriptius i consistents
- Intenta que hi hagi 2-3 tags per post
- No facis servir massa tags per a un únic post

### Títols

- Fes-los descriptius i atractius
- Inclou paraules claus (Python, SQL, etc.)
- Evita títols massa llargs

### Resums

- Els resums es generen automàtics, però comença els posts amb una bona introducció
- Els primeres paraules han de ser interessants (ja que és el que apareix al resum)

### Exemple de Post Ben Estructurat

```markdown
---
layout: post
title: "Com Detectar Outliers amb Python i Pandas"
tags:
  - python
  - data-analysis
  - data-cleaning
---

Aquesta és la funció que faig servir cada dia per detectar valors atípics 
en datasets grans. Els outliers són punts de dades que es desvien significativament 
del patró general...

### La Funció

```python
def detecta_outliers(df, columna):
    ...
```

Etc.
```

---

## ❓ Preguntes Freqüents

**P: Puc editar els resums manuals?**
R: No, es generen automàticament. Si vols un resum diferent, cambia les primeres paraules del post.

**P: Quants posts relacionats apareixeran?**
R: Fins a 3. Si hi ha menys de 3 posts relacionats, apareixeran més pocs.

**P: Puc canviar la paleta de colors?**
R: Sí, editant el fitxer `assets/css/style.css` a la secció `:root`.

**P: El cercador busca les velles publicacions?**
R: Sí, busca tots els posts, sense limite temporal.

**P: Puc afegir més filtres?**
R: El sistema atual filtra per tags i cerca. Per a filtres més avançats, caldria editar el JavaScript.

---

## 🔧 Personalització Avançada

### Canviar Colors

Edita `assets/css/style.css`:
```css
:root {
  --accent-color: #0066cc;  /* Canvia aquest codi de color */
}
```

### Canviar Número de Posts Relacionats

Edita `_layouts/post.html`:
```liquid
{% assign max_related = 3 %}  <!-- Canvia 3 per un altre nombre -->
```

### Canviar Número de Paraules del Resum

Edita `index.html`:
```liquid
{% assign excerpt = post.content | strip_html | truncatewords: 30 %}
<!-- Canvia 30 per un altre nombre de paraules -->
```

---

## 📞 Suport

Si tens dubtes o vols afegir més funcionalitats, tens aquestes opcions:

1. Edita directament els fitxers HTML/CSS/JS
2. Consulta la documentació de Jekyll: https://jekyllrb.com/
3. Busca tutorials sobre Liquid (motor de plantilles de Jekyll)

---

**Versió**: 2.0.0 (Redisseny Professional)  
**Data**: Juny 2026

¡Gaudeix del teu nou blog! 🎉
