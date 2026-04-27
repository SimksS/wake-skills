---
name: wake-blocks
description: Creates, reviews, and wires reusable Wake Storefront SSR Blocks for the CMS and `content_for_page`. Use when the task involves `Blocks/`, `<type>.schema.json`, `block_data`, `settings` fields, CMS editing, or block declarations in `Configs/pages.json`.
---

# Wake Blocks

## When to use

Use this skill when the user asks you to create, modify, review, or debug Wake Blocks available in the CMS.

Also trigger when the task mentions `Blocks/`, `block_data`, `content_for_page`, `Blocks/<type>.schema.json`, CMS-editable fields, or CMS-driven customization of home/pages.

## Expected outcome

When finishing a block task, the agent should deliver:

- `Blocks/<type>.html` with the block template.
- `Blocks/<type>.schema.json` with the editable-field contract.
- `type` in the schema identical to the base filename.
- HTML access using `block_data.<name>` for each setting.
- Page declaration/usage with `content_for_page` when required.

## Required contract

Every block needs two files with the same base name:

```text
Blocks/banner_button.html
Blocks/banner_button.schema.json
```

For this example, the schema must declare:

```json
{
  "type": "banner_button"
}
```

Without `.schema.json`, the CMS can’t save the block. Without `.html`, the block won’t render correctly.

## Block schema

Minimal structure:

```json
{
  "name": "Banner with button",
  "type": "banner_button",
  "settings": [
    { "label": "Title", "name": "title", "type": "text", "required": true }
  ]
}
```

Block fields:

- `type`: technical identifier and base filename.
- `name`: friendly name shown in the CMS.
- `settings`: list of editable fields.

`settings[]` fields:

- `name`: key available as `block_data.<name>`.
- `type`: field type.
- `label`: label shown in the CMS.
- `required`: required flag.
- `options`: required for `select`/`options`.

Supported types: `text`, `string`, `number`, `url`, `image_picker`, `color`, `select`, `options`, `checkbox`, `boolean`.

## Block template

Values saved in the CMS arrive in `block_data`.

```scriban
{{~
  title = block_data.title
  button_url = block_data.button_url
~}}

<section class="banner-button">
  <h2>{{ title }}</h2>
  {{ if button_url && !(button_url | string.empty) }}
    <a href="{{ button_url }}">{{ block_data.button_text }}</a>
  {{ end }}
</section>
```

## Required flow

1. Define the block’s editorial goal in the CMS.
2. Choose the `type` in `snake_case`.
3. Create the schema with `name`, `type`, and `settings`.
4. Create the HTML using only keys that exist in `block_data`.
5. If the block renders Wake Commerce data in addition to CMS data, validate the shape with `wake-graphql-mcp`.
6. Wire the block to the page when needed, typically via `content_for_page`.
7. Verify the CMS saves it and the HTML renders correctly.

## Dynamic data

Blocks receive editorial content via `block_data`. When they also depend on Wake Commerce data, treat that dependency separately:

- Use `wake-queries` for the query.
- Use `wake-graphql-mcp` to confirm real fields.
- Don’t put API-derived fields into the CMS schema.

## Recommended patterns

- Use `snake_case` for `type`: `banner_button`, `hero_showcase`, `product_highlight`.
- Make `settings[].name` descriptive and stable.
- Use `required: true` only for truly required fields.
- Use `select` when the CMS should constrain possible values.
- Keep HTML tolerant of empty optional fields.

## Avoid

- Creating only the schema or only the HTML.
- Letting `type` differ from the base filename.
- Accessing `block_data.foo` without `settings[].name = "foo"`.
- Using a Block for post-interaction rendering; in that case, prefer a Snippet.
- Inventing GraphQL fields when the block mixes CMS and Wake Commerce data.

## Final checklist

- [ ] `Blocks/<type>.html` and `Blocks/<type>.schema.json` both exist.
- [ ] The schema `type` equals the base filename.
- [ ] Every `settings[].name` used in HTML exists in the schema.
- [ ] Optional fields are handled in the template.
- [ ] The block is wired to the page when needed.
- [ ] Wake Commerce data was validated when applicable.
 - [ ] `Blocks/<type>.html` and `Blocks/<type>.schema.json` both exist.
 - [ ] The schema `type` equals the base filename.
 - [ ] Every `settings[].name` used in HTML exists in the schema.
 - [ ] Optional fields are handled in the template.
 - [ ] The block is wired to the page when needed.
 - [ ] Wake Commerce data was validated when applicable.

## Reference

- Additional details: [reference.md](reference.md)
- Official docs: `https://wakecommerce.readme.io/docs/blocks`
