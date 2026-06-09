---
layout: default
title: Página Principal
---

# Artículos por Categorías

{% assign categorias = site.posts | map: 'categories' | uniq | flatten | uniq %}

{% for categoria in categorias %}
  <h2>{{ categoria }}</h2>
  <ul>
  {% for articulo in site.articulos %}
    {% if articulo.data.categories contains categoria %}
      <li><a href="{{ articulo.url }}">{{ articulo.data.title }}</a></li>
    {% endif %}
  {% endfor %}
  </ul>
{% endfor %}
