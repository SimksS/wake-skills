---
name: wake-performance
description: Guides performance optimizations in Wake Storefront SSR projects. Use when the task involves Page Speed, images, responsive banners, lazyload, fetchpriority, heavy scripts, mobile/desktop HTML duplication, FbitsStatic, carousels, or “hotsite-style” search in URLs like `/busca/tenis`.
---

# Wake Performance

## When to use

Use this skill when the user asks you to improve performance, Page Speed, Core Web Vitals, image loading, banners, scripts, or the HTML structure of a Wake Storefront SSR template.

Also trigger when the task mentions:

- Page Speed Insights.
- Responsive banners.
- Heavy images, `width`, `height`, `loading="lazy"`, or `fetchpriority`.
- Using `<picture>` or `srcset`.
- Scripts with large dependencies.
- Mobile/desktop HTML duplication.
- “Hotsite-style” search, like `/busca/tenis` instead of `/busca?busca=tenis`.

## Expected outcome

When finishing a performance task, the agent should deliver:

- Images served at the right size, with `width` and `height`.
- Lazy loading on images below the fold.
- High priority only for critical above-the-fold images.
- Responsive banners using `<picture>`, `srcset`, or Wake’s equivalent helper.
- Scripts loaded only when needed and without avoidable heavy dependencies.
- Responsive HTML without duplicating full structures for mobile/desktop.
- “Hotsite-style” search wired in JavaScript when adopting a path-based URL.

## Initial diagnosis

Before editing, identify which problem group is involved:

1. Imagens e banners.
2. Scripts and dependencies.
3. Duplicated layout/Scriban.
4. Search and URLs.
5. Migration with legacy static files.

Then apply only the optimizations related to the real problem. Avoid broad refactors without need.

## Image rules

- Request images already sized by the API when possible, using arguments like `images(width: 600, height: 600)`.
- Add `width` and `height` on `<img>` tags.
- Use `loading="lazy"` for images outside the initial viewport.
- Use `fetchpriority="high"` only for key above-the-fold images, like the first visible banner.
- Use `<picture>` when mobile and desktop require different dimensions.
- Prefer conventional formats like `jpg` and `png` (often convertible to `webp`).
- Avoid large `gif` assets, which tend to be heavy.

## Responsive banner rules

Banners should be registered with width information in the name (or equivalent metadata) to enable responsive selection.

When rendering banners:

 - Group related banners by name/position.
 - Sort variations by width.
 - Generate sources with `media` and `srcset`.
 - Set a default image.
 - Use `fetchpriority="high"` only on the first relevant banner.
 - Use `loading="lazy"` for the other banners/slides.

Don’t send a large desktop image to mobile users when a smaller variant exists.

## Script rules

- Avoid libraries with large dependencies for simple interactions.
- Don’t introduce jQuery just for a carousel, menu, or small behavior.
- Delay scripts that don’t affect initial visual rendering.
- Load scripts on demand when the feature isn’t above the fold.

## Layout and Scriban rules

Prefer a single, responsive HTML structure via CSS.

Avoid duplicating entire HTML blocks for mobile and desktop, because it makes the page heavier and creates redundant elements.

When editing templates, also apply:

- `rules/wake-scriban.md` for syntax and `underscore_case`.
- `wake-store-builtins` when you need static URLs like `store.urls.static_img`.

## “Hotsite-style” search

By default, search uses `/busca` with the `busca=` query string.

Default example:

```text
/busca?busca=tenis
```

Wake also supports path-based search (without query string):

```text
/busca/tenis
```

If the project opts for this format, update the corresponding JavaScript files to build and read the URL using this pattern. Don’t change only the HTML link if the JavaScript still expects `?busca=`.

## Required flow

1. Locate impacted files: `Pages/`, `Components/`, `Blocks/`, `Snippets/`, `Assets/JS`, `Assets/CSS`, or GraphQL queries.
2. Classify the problem: image, banner, script, layout, or search.
3. Read [reference.md](reference.md) for the applicable pattern.
4. If Wake Commerce data is involved, use `wake-graphql-mcp` before changing queries.
5. Apply the smallest change that improves performance without breaking behavior.
6. Verify basic accessibility is preserved, especially image `alt` and named buttons.

## Avoid

- Removing functionality to improve scores without confirming impact.
- Optimizing everything at once without diagnosis.
- Duplicating HTML for responsive variations.
- Using a large image and shrinking it visually with CSS.
- Loading third-party scripts early without an initial visual need.
- Creating “hotsite-style” search URLs without updating the corresponding JavaScript.

## Final checklist

 - [ ] Images have appropriate size and `width`/`height` attributes.
 - [ ] Images below the fold use `loading="lazy"`.
 - [ ] The initial critical image uses `fetchpriority="high"` only when it makes sense.
 - [ ] Responsive banners don’t download unnecessary variations.
 - [ ] Heavy or non-critical scripts were avoided, delayed, or loaded on demand.
 - [ ] Mobile/desktop HTML wasn’t duplicated without need.
 - [ ] “Hotsite-style” search (if used) was also wired in JavaScript.

## Reference

- Details and examples: [reference.md](reference.md)
- Page Speed: `https://wakecommerce.readme.io/docs/page-speed`
- Banners responsivos: `https://wakecommerce.readme.io/docs/banners-responsivos`
- Busca estilo hotsite: `https://wakecommerce.readme.io/docs/busca-estilo-hotsite`
