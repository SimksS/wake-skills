# Wake Performance — Quick Reference

## Page Speed

Main areas of impact in Wake templates:

- Imagens.
- Scripts.
- Layout/Scriban.
- Banners.
- Search and navigation.

## Imagens

### Sizing via the query

When the image comes from the Storefront API, request an optimized URL at the expected size.

```graphql
query ProductPage($productId: Long!) {
  product(productId: $productId) {
    productName
    images(width: 600, height: 600) {
      url
    }
  }
}
```

### HTML attributes

Whenever possible, declare dimensions:

```html
<img src="/image.jpg" alt="Produto" width="600" height="600">
```

Use `loading="lazy"` for images outside the initial viewport:

```html
<img src="/footer-banner.jpg" alt="Banner promocional" width="1280" height="360" loading="lazy">
```

Use `fetchpriority="high"` on a truly critical image:

```html
<img src="/hero.jpg" alt="Banner principal" width="1280" height="360" fetchpriority="high">
```

### `<picture>` for responsiveness

Use `<picture>` when each breakpoint needs a different image.

```html
<picture>
  <source media="(max-width: 720px)" srcset="/banner-mobile.jpg?w=720">
  <source media="(max-width: 1280px)" srcset="/banner-tablet.jpg?w=1280">
  <img src="/banner-desktop.jpg?w=1549" alt="Banner" width="1549" height="449">
</picture>
```

## Responsive banners

In the platform configuration, differentiate banners by width, for example:

- `Banner P`
- `Banner M`
- `Banner G`

The width needs to be available so the Storefront API can return variations and the template can select the appropriate image for the device.

Rendering pattern:

1. Filter banners by position.
2. Group related variations by name.
3. Sort by width.
4. Create `<source>` elements with `media` and `srcset`.
5. Render a default `<img>`.
6. Use high priority only for the first visible banner.
7. Use lazyload for the rest.

Simplified Scriban example:

```scriban
<picture>
  {{ for source in current_sources }}
    <source media="{{ source.media }}" srcset="{{ source.src }}?w={{ source.w }}">
  {{ end }}
  <img
    src="{{ default }}"
    alt="{{ alt }}"
    width="640"
    height="100"
    {{ if for.first }}fetchpriority="high"{{ else }}loading="lazy"{{ end }}>
</picture>
```

## Scripts

Avoid:

- Large libraries for small interactions.
- Dependencies like jQuery just for a carousel or simple UI.
- Scripts that block initial rendering without need.

Prefer:

- Native JavaScript when the interaction is small.
- On-demand loading.
- Delaying scripts that don’t affect the initial visual area.

## Layout and Scriban

Prefer a single HTML structure with responsive CSS.

Avoid:

```html
<section class="desktop-only">...</section>
<section class="mobile-only">...</section>
```

Prefer:

```html
<section class="hero">...</section>
```

And adapt via CSS.

Duplicating HTML for mobile and desktop increases page weight, creates redundant elements, and worsens maintenance.

## FbitsStatic in migrations

In stores migrating to Storefront, legacy static files may remain in Resources. For better performance, use FbitsStatic and migrate to Git only the files needed by the template.

## “Hotsite-style” search

Default format:

```text
/busca?busca=tenis
```

Hotsite-style format:

```text
/busca/tenis
```

When adopting the hotsite-style format:

- Update the JavaScripts that build the search URL.
- Update the JavaScripts that read the term from the URL.
- Preserve encode/decode of the searched term.
- Verify forms, autocomplete, and suggestion links use the same pattern.

Don’t leave part of the flow using query string while another part uses path without explicit compatibility.

## Official sources

- `https://wakecommerce.readme.io/docs/page-speed`
- `https://wakecommerce.readme.io/docs/banners-responsivos`
- `https://wakecommerce.readme.io/docs/busca-estilo-hotsite`
