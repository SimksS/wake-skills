# Wake Queries — Quick Reference

## Main connections

`Queries/*.graphql` alimenta:

- Pages via `Configs/pages.json` with `query: "file.graphql"`.
- Snippets via `client.snippet.render(fileName, queryName, variables)`.
- `POST /snippet` and `POST /snippet/multi` via the `queryName` field.

## Paths

All paths are relative to `Queries/`.

```text
Queries/search.graphql        -> "search.graphql"
Queries/Search/search.graphql -> "Search/search.graphql"
```

## Template access

The GraphQL response becomes `data` in the template.

If the query returns:

```json
{
  "data": {
    "search": {
      "products": []
    }
  }
}
```

Use:

```scriban
{{ data.search.products }}
```

## Recommended organization

- `Queries/Search/`
- `Queries/Product/`
- `Queries/SnippetQueries/`
- `Queries/Content/`

## Validation with MCP

Whenever a query depends on Wake Commerce, confirm:

- Field names.
- Required arguments.
- Object/list structure.
- Fields that can be null.
- The final shape used by the template.
