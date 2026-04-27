---
name: wake-queries
description: Creates, reviews, and wires `.graphql` files in Wake Storefront SSR projects. Use when the task involves `Queries/`, `Configs/pages.json`, snippet queries, accessing `data` in Scriban, Wake Commerce GraphQL fields, or validating response shape via `wake-graphql-mcp`.
---

# Wake Queries

## When to use

Use this skill when the user asks you to create, modify, organize, or debug GraphQL queries in Wake Storefront SSR.

Also trigger when the task mentions `Queries/`, `query` in `Configs/pages.json`, `client.snippet.render`, `/snippet`, `/snippet/multi`, or when a template needs to access data via `data`.

## Expected outcome

When finishing a query task, the agent should deliver:

- Um arquivo `.graphql` em `Queries/` ou subpasta.
- A `.graphql` file inside `Queries/` (or a subfolder).
- The correct consumption point: `Configs/pages.json` for Pages, or the query name passed to a Snippet render.
- Template access that matches the real JSON shape returned by the query.
- Evidence that dynamic fields were verified with `wake-graphql-mcp` when they come from Wake Commerce.

## Before writing code

1. Identify which screen, Page, Snippet, or component will consume the query.
2. List the required data in business terms, not in invented fields.
3. If the data comes from Wake Commerce’s GraphQL API, consult `wake-graphql-mcp` before creating or editing the query.
4. Confirm type names, fields, arguments, lists, nullability, and pagination.
5. Only then write the query and adjust the template.

## How to use `wake-graphql-mcp`

- Use `wake_graphql_search` to discover types/fields by text.
- Use `wake_graphql_type` to inspect a type’s fields and arguments.
- Use `wake_graphql_query` to run the proposed query and validate the returned shape.
- Use `wake_graphql_introspect` when you need an overview of the schema.

Do not generate a query based on memory or assumptions when MCP is available.

## File contract

- Todas as queries ficam em `Queries/`.
- Subfolders are allowed and recommended per domain: `Search/`, `Product/`, `SnippetQueries/`.
- Paths used by Wake are relative to `Queries/`.

Examples:

```text
Queries/search.graphql                    -> "search.graphql"
Queries/Search/search.graphql             -> "Search/search.graphql"
Queries/SnippetQueries/autocomplete.graphql -> "SnippetQueries/autocomplete.graphql"
```

## Pages

In Pages, the query is wired in `Configs/pages.json` via the `query` property.

```json
{
  "type": "search",
  "path": "search.html",
  "query": "Search/search.graphql"
}
```

## Snippets

In Snippets, the query is provided in the render call.

```javascript
const variables = { query: "tenis" }
const html = await client.snippet.render(
  "autocomplete.html",
  "SnippetQueries/autocomplete.graphql",
  variables
)
```

## Template access

The GraphQL response arrives in the template as `data`. Preserve the validated shape exactly.

If the query returns `data.search.products`, the template accesses:

```scriban
{{ data.search.products }}
```

Do not access `data.products` if the validated query returns `data.search.products`.

## Recommended patterns

- Name files by context: `search.graphql`, `product.graphql`, `autocomplete.graphql`.
- Prefer small, specific queries aligned to the template’s actual needs.
- Use GraphQL variables when values change by interaction, route, or context.
- Keep Page queries separate from Snippet queries when their render cycles differ.

## Avoid

- Inventing fields, aliases, or structures without schema validation.
- Coupling templates to data that isn’t in the query.
- Reusing a large query for a small screen purely for convenience.
- Placing queries outside `Queries/`.

## Final checklist

- [ ] The file is in `Queries/` (or a subfolder).
- [ ] The path used in `pages.json` or the Snippet is relative to `Queries/`.
- [ ] The query was validated against the schema when it uses Wake Commerce data.
- [ ] The template accesses `data` according to the real shape.
- [ ] Required variables were declared and passed by the consumer.

## Reference

- Additional details: [reference.md](reference.md)
- Official docs: `https://wakecommerce.readme.io/docs/queries`
