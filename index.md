---
layout: default
title: Página Principal
---

# Artículos por Categorías

{% assign articulos = site.collections.posts.docs %}
{% assign categorias = articulos | map: 'categories' | flatten | uniq %}

{% for categoria in categorias %}
<h2>{{ categoria }}</h2>
<ul>
  {% for articulo in articulos %}
    {% if articulo.data.categories contains categoria %}
    <li>
      <a href="{{ articulo.url }}">{{ articulo.data.title }}</a>
    </li>
    {% endif %}
  {% endfor %}
</ul>
{% endfor %}
