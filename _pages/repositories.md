---
layout: page
permalink: /repositories/
title: repositories
description: A final year student of Department of Computer Science and Engineering, IIT Kharagpur. I focus on fundamental research in self-supervised learning, reasoning, world models, interpretability, and evaluation science inspired by cognitive science and computational learning to develop
intelligent, interpretable, and human-aligned AI models.
nav: true
nav_order: 3
---

## Some Stats

{% if site.data.repositories.github_users %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}
</div>

{% endif %}

{% if site.data.repositories.github_repos %}

## Pinned Repositories

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
