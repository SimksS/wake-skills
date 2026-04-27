---
name: wake-components
description: Creates, reviews, and registers HTML/Scriban components in Wake Storefront SSR. Use when the task involves `Components/`, `Configs/components.json`, `{{ component_name }}` calls, component parameters, page/component availability, or dynamic data validated via `wake-graphql-mcp`.
---

# Wake Components

## When to use

Use this skill when the user asks you to create, modify, register, or debug a Wake Storefront SSR component.

Also trigger when the task mentions `Components/`, `Configs/components.json`, `params`, `inheritVariables`, `availableInAllPages`, `availableInComponents`, or Scriban calls like `{{ product_card product: item }}`.

## Expected outcome

When finishing a component task, the agent should deliver:

- A `.html` file inside `Components/`.
- A corresponding entry in `Configs/components.json`.
- A Scriban call using exactly the registered `name`.
- An explicit parameter contract when the component receives data.
- Shape validation via `wake-graphql-mcp` when data comes from Wake Commerce.

## Component contract

A Wake component consists of:

- `Components/<path>.html`: template HTML/Scriban.
- `Configs/components.json`: the registry that makes the component callable.

The `path` in JSON is always relative to `Components/`.

## Registering in `components.json`

`Configs/components.json` is an array. Each item describes a component.

Essential fields:

- `name`: name used in the Scriban call.
- `path`: `.html` path within `Components/`.

Recommended fields:

- `params`: component input contract.
- `inheritVariables`: use `false` by default.
- `availableInAllPages`, `availableInAllComponents`, `availableInPages`, `availableInComponents`: control where the component can be used.

Recommended template:

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

## Required flow

1. Define the component’s goal and where it will be called.
2. Choose a technical `name` in `snake_case`.
3. Define the minimal parameters in `params`.
4. If it renders Wake Commerce data, validate the shape with `wake-graphql-mcp` before writing the template.
5. Create or update `Components/<path>.html`.
6. Create or update the entry in `Configs/components.json`.
7. Update the Scriban call in the consuming template.

## Calling from a template

Without parameters:

```scriban
{{ newsletter }}
```

With parameters:

```scriban
{{ product_brand brand: product.product_brand }}
```

The called name must match the registered `name` exactly.

## Dynamic data

If the component receives data coming from GraphQL:

- Confirm the query with the `wake-queries` skill.
- Validate fields and nullability with `wake-graphql-mcp`.
- Pass only the data the component needs.
- Avoid `inheritVariables: true` as a shortcut to access everything.

## Recommended patterns

- Use `snake_case` para `name`: `product_brand`, `side_cart`, `banners_carousel`.
- Group files by domain: `Components/product/product_brand.html`.
- Mark `required: true` only when the component can’t render correctly without the parameter.
- Prefer small, reusable components with a clear contract.

## Avoid

- Creating a `.html` without registering it in `components.json`.
- Registering a `path` outside `Components/`.
- Using `inheritVariables: true` by default.
- Accessing implicit global data when a parameter would solve it.
- Inventing object shapes without validating the data source.

## Final checklist

- [ ] The `.html` is in `Components/` (or a subfolder).
- [ ] There is a registry entry in `Configs/components.json`.
- [ ] `name`, `path`, and the Scriban call match exactly.
- [ ] `params` documents input data.
- [ ] `inheritVariables` is only `true` when there’s a justified reason.
- [ ] Wake Commerce data was validated before writing the template.

## Reference

- Additional details: [reference.md](reference.md)
- Official docs: `https://wakecommerce.readme.io/docs/components`
- `components.json`: `https://wakecommerce.readme.io/docs/componentsjson`
