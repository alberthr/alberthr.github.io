---
layout: default
title: Página Principal
---

# Artículos por Categorías

{% assign categorias = site.posts | map: 'categories' | flatten | uniq %}

{% for categoria in categorias %}
<h2>{{ categoria }}</h2>
<h2>Debug: lista de artículos</h2>
<pre>{{ articulos | jsonify }}</pre>
<ul>
  {% for articulo in site.posts %}
    {% if articulo.data.categories contains categoria %}
    <li>
      <a href="{{ articulo.url }}">{{ articulo.data.title }}</a>
    </li>
    {% endif %}
  {% endfor %}
</ul>
{% endfor %}
