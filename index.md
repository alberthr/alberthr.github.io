---
layout: default
title: Página Principal
---

# Artículos por Categorías

{% assign categorias = site.articulos | map: 'categories' | uniq | flatten | uniq %}

{% for categoria in categorias %}
  <h2>{{ categoria }}</h2>
  <ul>
  {% for post in site.posts %}
    {% if post.data.categories contains categoria %}
      <li><a href="{{ post.url }}">{{ post.data.title }}</a></li>
    {% endif %}
  {% endfor %}
  </ul>
{% endfor %}
