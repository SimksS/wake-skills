# Wake Blocks — Quick Reference

## Required contract

Always create both files:

- `Blocks/<type>.html`
- `Blocks/<type>.schema.json`

Without the schema, the CMS can’t save. Without the HTML, the block won’t render.

## Name equality

The schema `type` must match the base filename.

```text
type: "banner_button"
Blocks/banner_button.html
Blocks/banner_button.schema.json
```

## Schema fields

 - `type`: block technical identifier.
- `name`: name shown in the CMS.
- `settings`: editable fields.
- `settings[].name`: key accessed in the template as `block_data.<name>`.
- `settings[].type`: field type.

## Supported types

`text`, `string`, `number`, `url`, `image_picker`, `color`, `select`, `options`, `checkbox`, `boolean`.

## CMS usage

Blocks are made available on pages configured with `content_for_page`, typically via custom `Configs/pages.json` configuration.

## Block Data

```scriban
{{ block_data.title }}
{{ block_data.button_url }}
```

Each key used must exist in `settings`.

## Wake Commerce data

The schema models CMS editorial content. If the block also renders dynamic Wake Commerce data, use `wake-graphql-mcp` to confirm the shape and keep that dependency explicit.
