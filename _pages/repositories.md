---
layout: page
permalink: /repositories/
title: repositories
description: A fourth year undergraduate student of Department of Computer Science and Engineering, IIT Kharagpur. I focus on fundamental research in Cognitive Science and NLP, particularly in Psycholinguistics, LLM Reasoning, Neurosymbolic AI, and World Models, inspired by Cognitive Science and Computational Learning to create interpretable, efficient, human-aligned AI systems.
nav: true
nav_order: 4
---

## Devichand's Github

{% if site.data.repositories.github_users %}

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for user in site.data.repositories.github_users %}
    {% include repository/repo_user.liquid username=user %}
  {% endfor %}
</div>

{% endif %}

{% if site.data.repositories.github_repos %}

## Repositories

<div class="repositories d-flex flex-wrap flex-md-row flex-column justify-content-between align-items-center">
  {% for repo in site.data.repositories.github_repos %}
    {% include repository/repo.liquid repository=repo %}
  {% endfor %}
</div>
{% endif %}
