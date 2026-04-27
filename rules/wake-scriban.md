# Rule: Wake Scriban in HTML Templates

When working on Wake Storefront SSR HTML templates, remember the templating language is Scriban.

Use this rule for files in `Pages/`, `Components/`, `Blocks/`, `Snippets/`, `Emails/`, and any `.html` that contains `{{ ... }}` expressions.

## Essential Rules

1. Use Scriban syntax for variables, conditionals, loops, and functions.
2. Do not treat the template as pure Liquid, Handlebars, JSX, or JavaScript.
3. Objects and variables injected by the Storefront have their names converted to `underscore_case`.
4. Variables declared inside the template itself do not go through this conversion.
5. When accessing GraphQL data, use the real query shape, but access injected names in `underscore_case` in Scriban.

## Conversion Example

If the API returns (or docs show):

```text
data.menuGroups
```

In a Wake Scriban template, access:

```scriban
{{ data.menu_groups }}
```

## Before Editing a Template

1. Confirm the file is rendered by Wake Storefront SSR.
2. Identify which objects are injected into the template (`data`, `block_data`, component params, settings, etc.).
3. For Wake Commerce GraphQL data, also apply `wake-graphql-mcp.md`.
4. Write Scriban expressions using `underscore_case` for injected objects.

## Avoid

- Using `camelCase` on injected objects, like `data.menuGroups`, when the template expects `data.menu_groups`.
- Inventing helpers or filters without confirming they exist in Scriban/Wake.
- Putting overly complex logic in HTML; prefer preparing the query, params, or data upstream when possible.
- Copying Liquid examples without adapting syntax and names for Scriban.

Official reference: `https://wakecommerce.readme.io/docs/scriban`
