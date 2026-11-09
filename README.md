# CM6 — Redesign du site

A modern, responsive static site (HTML/CSS/JS, no build step) proposed as a redesign of the CM6 (Centre Mohammed VI de Soutien à la Microfinance Solidaire) website.

## Structure

```
index.html        Single page: hero, chiffres clés, le Centre, missions, programmes (filtrables),
                  actualités, publications, CTA, contact, footer
css/styles.css    Design tokens (blue / yellow palette) + components + responsive breakpoints
js/main.js        Mobile menu, scroll-spy, scroll reveal, counters, programme filters, form validation
assets/           Favicon (add the official logo and photos here)
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

## Content to complete

The live site could not be read while building this, so content is placeholder text — no figures have been invented:

- **Chiffres clés**: set `data-count="12345"` on each `.stat__num` (optionally `data-suffix="+"`); counters animate only when a value is set.
- **Actualités, publications, coordonnées**: marked with `TODO` comments in `index.html`.
- **Logo & photos**: replace the `CM6` text mark and the `.photo-placeholder` blocks with official assets.
- **Forms**: front-end validation only; connect to a backend or form service before going live.
- **AR / EN**: language links in the top bar are placeholders.

Brand colours are defined as CSS variables at the top of `css/styles.css`.
