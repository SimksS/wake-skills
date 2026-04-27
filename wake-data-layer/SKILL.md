---
name: wake-data-layer
description: Guides implementation, maintenance, and extension of the Data Layer with GA4/GTM in Wake Storefront projects. Use when the task involves data layer, Google Analytics 4, Google Tag Manager, ecommerce events (view_item, add_to_cart, purchase, begin_checkout, view_cart, page_view), `data_layer_*.html` components, `event_manager.js`, or interaction tracking in the Wake storefront.
---

# Wake Data Layer

## When to use

Use this skill when the user asks you to:

- Implement or adjust Data Layer in Wake Storefront.
- Add new GA4/GTM events.
- Map Data Layer fields by page type.
- Debug events not firing in GTM/GA4.
- Understand the architecture of `event_manager.js`.
- Migrate or update the Data Layer version.

## Architecture

The Data Layer in Wake Storefront is composed of three layers:

### 1. HTML data components (`Components/utils/data_layer/`)

Each event has its own HTML component, named by event type:

- `data_layer_config.html` — configures GA4/GTM; must be present on every page that fires events.
- `data_layer_hotsite_view.html` — `page_view` event on Hotsite/Home pages.
- `data_layer_product_details.html` — `view_item` event on the product page.
- `data_layer_cart.html` — `view_cart` event on the cart.
- Other components named according to the event.

Data is generated in Scriban at page render time and inserted into the HTML as JavaScript objects.

### 2. `data_layer_config.html`

Loads GA4 or GTM automatically based on IDs configured in the admin panel:

- **GTM**: `General Settings > GoogleTagManagerId`
- **GA4**: campo `Google-Analytics-Ids`

IDs are read via `common.graphql`. If the field is filled, the corresponding script is loaded. After configuration, the component fires the internal `dataLayerConfigured` event.

### 3. `Assets/JS/event_manager.js`

Waits for the `dataLayerConfigured` event, reads Data Layer objects from the HTML, and sends them via `gtag()` to GA4/GTM.

Default mapped events:

| GA4 event | Context |
|---|---|
| `view_item` | Product page |
| `view_item_list` | Home, Search |
| `page_view` | Hotsite |
| `view_cart` | Cart, Shipping |
| `add_to_cart` | Cart |
| `remove_from_cart` | Cart |
| `search` | Search |
| `add_to_wishlist` | Wishlist |
| `remove_from_wishlist` | Wishlist |
| `begin_checkout` | Checkout start |
| `purchase` | Confirmation |

### Initialization flow

```
user_login.js: page load → checks logged-in user → fires userChecked
event_manager.js: receives userChecked → loads data_layer_config
data_layer_config.html: configures GA/GTM → fires dataLayerConfigured
event_manager.js: receives dataLayerConfigured → processes Data Layer objects
```

## Special case: Snippets

Events that depend on data loaded after the page render (e.g., cart via API) must not use `{{ }}` blocks in snippets for safety.

In these cases, use a literal field in the HTML to inject the data directly, without Scriban:

```html
<!-- Instead of {{ data_layer_cart }} inside the snippet, use: -->
<div data-datalayer='{ "event": "view_cart", ... }'></div>
```

Componentize the data the same way, but in the snippet code, not in the Scriban template.

## Adding a new event

1. **Create the data component** in `Components/utils/data_layer/data_layer_<event_name>.html` using Scriban to build the JavaScript object from query data.
2. **Include the component** on the relevant page together with `{{ data_layer_config }}`.
3. **Add a listener** in `Assets/JS/event_manager.js` waiting for `dataLayerConfigured`, read the object from HTML, and call `gtag('event', '<event_name>', object)`.
4. **If needed**, fire a custom internal event in other scripts so `event_manager` can capture it.

## `pageType` by page

| Page | `pageType` | GA4 event |
|---|---|---|
| Home | `HOTSITE - HOME` | `page_view` |
| Hotsite/Category | `HOTSITE` | `page_view` |
| Product | `PRODUCT` | `view_item` |
| Cart (bag) | `CHECKOUT - SACOLA` | `view_cart` |
| Shipping | `CHECKOUT - FRETE` | `view_cart` |
| Checkout | `fechamento` | `begin_checkout` |
| Confirmation | `confirmacao` | `purchase` |

## Minimal `user` structure

```json
{
  "user": {
    "id": "VISIT-<uuid>",
    "emailConsumidor": "[email protected]"
  },
  "session": {
    "isLogged": false,
    "site": { "siteDomain": "https://loja.com.br" }
  }
}
```

- `user.id` uses the `VISIT-` prefix for visitors and `CLIENT-<id>` for logged-in users.
- `emailConsumidor` is present only on checkout pages when logged in.

## Avoid

- Using Scriban `{{ }}` inside snippets for Data Layer data (use a literal field).
- Forgetting `{{ data_layer_config }}` on the page when adding a new event component.
- Calling `gtag()` before the `dataLayerConfigured` event.
- Duplicating send logic outside `event_manager.js`.

## Reference

- Full schemas by page: [reference.md](reference.md)
- Wake docs: `https://wakecommerce.readme.io/docs/data-layer`
- Implementation: `https://wakecommerce.readme.io/docs/implementando-o-data-layer`
- Official GA4 events: `https://developers.google.com/analytics/devguides/collection/ga4/ecommerce`
