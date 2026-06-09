---
layout: default
title: Inicio
---

# Bienvenido a mi blog

Aquí tienes los artículos recientes:

{% for post in site.posts %}
  <h2>{{ post.data.title }}</h2>
  <p>Publicado en: {{ post.data.categories | join: ', ' }}</p>
  {{ post.content }}
{% endfor %}
