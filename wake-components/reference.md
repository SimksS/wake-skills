# Wake Components — Quick Reference

## Related files

 - `Components/`: reusable HTML/Scriban templates.
- `Configs/components.json`: catalog of available components.
- `Configs/pages.json`: defines which page templates can consume queries and components.
- `Configs/settings.json`: static configuration injected into the template; don’t use it as operational storage.

## Typical registry entry

```json
{
  "name": "product_brand",
  "path": "product/product_brand.html",
  "params": [{ "name": "brand", "required": true }],
  "inheritVariables": false,
  "availableInAllPages": true,
  "availableInAllComponents": true
}
```

## Conventions

- `name` in `snake_case`.
- `path` relative to `Components/`.
- `params` documents the component’s public contract.
- `inheritVariables` should be `false` by default.
- Global components typically use `availableInAllPages` and `availableInAllComponents`.

## Scriban usage

```scriban
{{ product_brand brand: product.product_brand }}
```

The identifier `product_brand` must match the registry `name`.

## Dynamic data

When the component renders Wake Commerce data:

- Confirm the query with `wake-queries`.
- Validate fields with `wake-graphql-mcp`.
- Pass an explicit parameter to the component instead of relying on inherited variables.

## Docs

- Componentes: `https://wakecommerce.readme.io/docs/components`
- `components.json`: `https://wakecommerce.readme.io/docs/componentsjson`
