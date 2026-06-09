---
layout: default
title: Inicio
---

# Bienvenido a mi blog

Aquí tienes los artículos recientes:

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: "%d %b %Y" }}
  </li>
{% endfor %}
</ul>
