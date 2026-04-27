---
name: wake-scriban
description: Guides writing, reviewing, and debugging Scriban templates in Wake Storefront SSR. Use when working with `.html` templates under Wake folders such as `Pages/`, `Blocks/`, `Snippets/`, or `Layouts/`, when the task mentions Scriban syntax, `{{ }}`, `if`/`for`/`capture`/`include`, filters, whitespace control, or when converting Liquid-like template logic to Wake Scriban.
---

# Wake Scriban

## When To Use

Use this skill whenever the user is creating, reviewing, or debugging Wake Storefront SSR templates written with Scriban.

Common triggers: `.html` files with `{{ }}`, Wake `Pages/`, `Blocks/`, `Snippets/`, `Layouts/`, `block_data`, `data`, `store`, template conditionals, loops, filters, partial rendering, or errors that look like Scriban parser/runtime errors.

## Expected Outcome

When finishing a Wake Scriban task, the agent should deliver:

- Valid Scriban inside Wake HTML templates.
- Data access that matches the source: `data` for GraphQL query results, `block_data` for CMS block settings, and `store` for built-in Storefront variables.
- Template logic that handles nullable or optional values explicitly.
- Whitespace control that keeps rendered HTML readable.
- GraphQL shape validation via `wake-graphql-mcp` when the template depends on Wake Commerce query data.

## Wake Data Sources

Pick the right root object before writing template logic:

- `data`: GraphQL response attached to a page or snippet query.
- `block_data`: CMS settings declared in `Blocks/<type>.schema.json`.
- `store`: global built-ins injected by Wake Storefront SSR.

Examples:

```scriban
{{ data.search.products }}
{{ block_data.title }}
{{ store.urls.base }}
```

If a field comes from Wake Commerce GraphQL, do not invent the shape. Validate the field names, nullability, and list/object structure with `wake-graphql-mcp`.

## Scriban Basics For Wake

Use `{{ ... }}` for code blocks. Expressions print output unless they are assignments:

```scriban
{{ title = block_data.title }}
{{ title }}
```

Use `if`/`end` for conditionals:

```scriban
{{ if product.name }}
  <h2>{{ product.name }}</h2>
{{ end }}
```

Use `for`/`end` for lists:

```scriban
{{ for product in data.search.products }}
  <article>{{ product.name }}</article>
{{ end }}
```

Use pipes for filters and function composition. The value on the left becomes the first argument of the function on the right:

```scriban
{{ product.name | string.downcase }}
```

## Null And Empty Values

In Scriban, only `null` and `false` are falsy. Values like `0`, `""`, and `[]` are truthy.

For optional strings, check both existence and emptiness:

```scriban
{{ if block_data.button_url && !(block_data.button_url | string.empty) }}
  <a href="{{ block_data.button_url }}">{{ block_data.button_text }}</a>
{{ end }}
```

For fallback values, use null-coalescing:

```scriban
{{ product.name ?? "Product" }}
```

Use optional chaining when nested data can be missing:

```scriban
{{ product.brand?.name ?? "" }}
```

## Naming And Member Access

Scriban exposes .NET-style members as `underscore_case` by default. In Wake templates, prefer `underscore_case` for injected objects.

```scriban
{{ store.urls.checkout_pages.login.password_recovery }}
```

Avoid `camelCase` unless the actual JSON/query field is confirmed to be camelCase.

Access members with dot notation for known fields and bracket notation for dynamic keys:

```scriban
{{ product.name }}
{{ product[dynamic_field_name] }}
```

## Whitespace Control

Use whitespace control deliberately in HTML templates:

- `{{-` or `-}}`: greedy strip, removes all whitespace/newlines on that side.
- `{{~` or `~}}`: non-greedy strip, useful for removing control-only lines while preserving surrounding HTML indentation.

Recommended for loop/control lines:

```scriban
<ul>
  {{~ for product in products ~}}
    <li>{{ product.name }}</li>
  {{~ end ~}}
</ul>
```

Avoid aggressive `-` around large HTML blocks unless the output must be minified.

## Template Organization

Use Wake-specific skills together with this one:

- Use `wake-blocks` for `Blocks/<type>.html` and `Blocks/<type>.schema.json`.
- Use `wake-snippets` for `Snippets/` and `/snippet` or `/snippet/multi` rendering.
- Use `wake-queries` for `Queries/*.graphql` and the resulting `data` shape.
- Use `wake-store-builtins` for `store` variables.

## Recommended Flow

1. Identify whether the template is a page, block, snippet, layout, or include.
2. Identify the data root: `data`, `block_data`, `store`, or local variables.
3. Validate Wake Commerce GraphQL fields with `wake-graphql-mcp` when needed.
4. Write simple assignments at the top of the relevant block when they improve readability.
5. Guard nullable/optional fields before rendering attributes, links, scripts, or images.
6. Use `{{~ ... ~}}` for control lines that should disappear from output.
7. Keep business logic minimal; move complex data fetching to queries or backend code.

## Avoid

- Treating Scriban exactly like Liquid; verify syntax before porting.
- Relying on JavaScript truthiness rules.
- Accessing `block_data.<field>` without a matching block schema setting.
- Inventing `data` fields from GraphQL without validation.
- Using `camelCase` for Wake built-ins that are exposed as `underscore_case`.
- Hiding complex query/data problems inside template conditionals.

## Final Checklist

- [ ] The template uses the correct Wake root object.
- [ ] Optional fields are guarded before rendering sensitive HTML attributes.
- [ ] Loops and conditionals are closed with `end`.
- [ ] Whitespace control does not collapse HTML unintentionally.
- [ ] GraphQL-backed fields were validated when applicable.
- [ ] The code remains readable as HTML after Scriban renders.

## Reference

- Full Scriban language reference: [reference.md](reference.md)
- Official Scriban docs: `https://scriban.github.io/docs/language/`