# AGENTS.md

Personal site for Devichand Budagam at [devichand.com](https://devichand.com). Jekyll site on the [al-folio](https://github.com/alshedivat/al-folio) theme. Source is `main`. GitHub Actions builds it and publishes `_site` to `gh-pages`.

## Where to edit

| Change | File |
|---|---|
| About page | `_pages/about.md` |
| News | `_news/announcement_NN.md` |
| Blog posts | `_posts/YYYY-MM-DD-title.md` |
| Publications | `_bibliography/papers.bib` |
| Publication thumbnails | `assets/img/publication_preview/` |
| Repositories | `_data/repositories.yml` |
| Services | `_pages/services.md` |
| CV | `assets/img/cv/page-N.png` (wired in `_pages/cv.md`) |
| Profile photo | `assets/img/profile_pic.jpg` |
| Social links | `_data/socials.yml` |
| Site title, description, features | `_config.yml` |
| World puzzle | `_pages/world.md`, `assets/js/world-law.js`, `_sass/_world-law.scss` |

`_pages/` is not a normal Jekyll collection. It is listed under `include` in `_config.yml`. New pages belong there, with `permalink`, `title`, `nav`, and `nav_order`.

## Content conventions

Write in the existing first person. Change only the copy the task asks for.

News items are short and dated. The next file is the next `announcement_NN.md` number. About shows the five newest (`announcements.limit` in `_pages/about.md`).

```yaml
---
layout: post
date: 2026-10-24 00:00:00-0400
inline: true
related_posts: false
published: true
---

One or two sentences. Use HTML links, as the existing items do.
```

Blog posts use `layout: post` and the filename date. Permalink is `/blog/:year/:title/`. Tags that appear on the blog index are set in `display_tags` in `_config.yml`.

Publications are BibTeX. Put the author as `Budagam, Devichand` so Jekyll Scholar can match `scholar.last_name` / `scholar.first_name`. `selected={true}` pins the paper on the about page. `preview={router.jpg}` loads `assets/img/publication_preview/router.jpg`. Keep `bibtex_show={true}` when the entry should render.

Internal links use the `relative_url` filter. A link to the world page uses `'/world/' | relative_url` as the href.

The CV is page images, not a Markdown résumé. Replace `assets/img/cv/page-N.png` and update the `figure.liquid` includes in `_pages/cv.md` if the page count changes.

## Custom code

Most of `_layouts/`, `_includes/`, `_sass/`, `_plugins/`, and `assets/js/` is the theme. Do not restyle or upgrade it unless the task is a theme change.

Site-specific code to keep intact:

- World puzzle: `_pages/world.md` (`world_law: true`), `assets/js/world-law.js`, `_sass/_world-law.scss`, the `@import "world-law"` in `assets/css/main.scss`, and the script tag in `_includes/scripts.liquid`.
- CV image layout in `_pages/cv.md`.
- `github_readme_stats_api` in `_config.yml` points at a community instance because the official host is often down.

## Preview and deploy

Local preview, from the repo root, with Ruby 3.3.5 and ImageMagick (`convert -version`). ImageMagick is required because `imagemagick.enabled` is true.

```bash
bundle install
bundle exec jekyll serve
```

Open the changed page and click through it. For layout or CSS changes, check light and dark mode and a narrow viewport.

A push to `main` deploys when the workflow path filters match. `**/*.md` deploys, except `README.md`. The deploy writes `.nojekyll` into the published site so GitHub Pages serves `gh-pages` as static files and does not run Jekyll again. Do not edit `gh-pages` by hand. Do not commit `_site/`, `.jekyll-cache/`, `vendor/`, `assets/libs/`, or `Gemfile.lock` (they are gitignored). `AGENTS.md` is excluded from the site output.
