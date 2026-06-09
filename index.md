---
layout: default
title: Página Principal
---

# Artículos por Categorías

{% assign categorias = site.posts | map: 'categories' | flatten | uniq %}

{% for categoria in categorias %}
  <h2>{{ categoria }}</h2>
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
<pre>{{ site.posts | jsonify }}</pre>
