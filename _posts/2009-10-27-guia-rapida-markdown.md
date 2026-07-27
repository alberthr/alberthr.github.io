---
layout: post
title: "Guia ràpida Markdown: Format de textes pas a pas"
tags:
  - cheatsheet
excerpt: "Resum ràpid de la sintaxi bàsica de Markdown: text, capçaleres, llistes, enllaços, taules, blocs de codi i notes al peu. Inclou també com escriure fórmules matemàtiques amb notació LaTeX i com es renderitzen segons la sortida."
---

Aquest post és un resum ràpid amb la sintaxi bàsica de Markdown, útil per escriure documentació, entrades de blog, READMEs o notes.

## 1. Format bàsic de text

```markdown
**negreta**
*cursiva*
***negreta i cursiva***
~~ratllat~~
`codi inline`
```

**negreta** · *cursiva* · ~~ratllat~~ · `codi inline`

## 2. Capçaleres

```markdown
# Títol H1
## Títol H2
### Títol H3
```

## 3. Llistes

```markdown
- Element 1
- Element 2
  - Sub-element

1. Primer
2. Segon
3. Tercer
```

## 4. Enllaços i imatges

```markdown
[Text de l'enllaç](https://exemple.com)
![Text alternatiu](imatge.png)
```

## 5. Cites i separadors

```markdown
> Això és una cita.

---
```

## 6. Blocs de codi

Amb tres backticks i el llenguatge pots activar el ressaltat de sintaxi:

````markdown
```python
def hola():
    print("Hola món")
```
````

## 7. Taules

```markdown
| Columna A | Columna B |
|-----------|-----------|
| valor 1   | valor 2   |
| valor 3   | valor 4   |
```

| Columna A | Columna B |
|-----------|-----------|
| valor 1   | valor 2   |
| valor 3   | valor 4   |

## 8. Notes al peu

Molts motors de Markdown (encara que no el CommonMark original) suporten notes al peu:

```markdown
Aquí tens una nota al peu[^1].

[^1]: Aquest és el text de la nota.
```

## 9. Fórmules matemàtiques amb LaTeX

El Markdown "pur" no inclou notació matemàtica de manera nativa. Per escriure fórmules, la pràctica estàndard és fer servir la **notació de LaTeX**, el llenguatge de composició matemàtica més utilitzat, tant dins de Markdown com al món acadèmic en general.

La sintaxi habitual és:

```markdown
Fórmula en línia: $E = mc^2$

Fórmula en bloc:

$$
\int_{-\infty}^{\infty} e^{-x^2} \, dx = \sqrt{\pi}
$$
```

Alguns comandaments bàsics de LaTeX que et serviran gairebé sempre:

```markdown
\frac{a}{b}      → fracció
\sqrt{x}         → arrel quadrada
x^2              → exponent
x_i              → subíndex
\sum_{i=1}^{n}   → sumatori
\int             → integral
\alpha, \beta    → lletres gregues
```

Aquesta notació és pràcticament universal: si l'aprens, et serveix igual a GitHub, Jekyll, R Markdown, Quarto, Notion, Obsidian o Pandoc, entre d'altres.

### Un matís: cal que algú ho renderitzi

Escriure `$E = mc^2$` és només text pla — perquè es mostri com una fórmula visual cal que alguna eina interpreti aquest LaTeX i el dibuixi. Quina eina s'encarrega d'això depèn del format de sortida final:

- **Sortida HTML** (blogs, pàgines web): normalment ho fa **MathJax** o **KaTeX**, dues llibreries JavaScript pensades per renderitzar LaTeX al navegador.
- **Sortida PDF**: sol fer-ho el mateix **LaTeX complet** (via `pdflatex` o similar), que compon el document sencer.
- **Sortida Word**: eines com Pandoc converteixen les fórmules LaTeX en objectes d'equació natius de Word.

En molts entorns (GitHub, Notion, R Markdown...) aquest pas ja ve activat de sèrie; en altres (com Jekyll amb kramdown) cal configurar-ho explícitament. Però la notació que escrius tu, en si mateixa, és sempre la mateixa: LaTeX.

## Resum

Amb aquests elements bàsics —text, capçaleres, llistes, taules, codi i, si cal, notació LaTeX per a fórmules— ja tens el necessari per escriure qualsevol document en Markdown, independentment de la plataforma on l'facis servir.
