# Wake Snippets — Quick Reference

## When Snippet is the right choice

Use Snippet when the HTML:

- Depends on a post-render interaction (typing, clicking, variant switching).
- Should be loaded on demand.
- Doesn’t need to block the page’s initial render.

If the content is static or always present on the page, consider a Component or Block before using a Snippet.

## Rendering methods

- SDK: `client.snippet.render(fileName, queryName, variables)`.
- HTTP: `POST /snippet` with `{ fileName, queryName, variables }`.
- Multi: `POST /snippet/multi` with `{ fileNames, queryName, variables }`.

## Paths

- `fileName` is relative to `Snippets/`.
- `queryName` is relative to `Queries/`.

```text
Snippets/Search/autocomplete.html              -> "Search/autocomplete.html"
Queries/SnippetQueries/autocomplete.graphql    -> "SnippetQueries/autocomplete.graphql"
```

## Multi response

`/snippet/multi` returns a list. Each item must be handled individually.

```json
[
  { "name": "autocomplete.html", "success": true, "error": null, "result": "<div></div>" }
]
```

## Recommended organization

- `Snippets/Search/`
- `Snippets/Product/`
- `Queries/SnippetQueries/`

## Validation with MCP

If the snippet renders Wake Commerce data, confirm fields, arguments, and nullability with `wake-graphql-mcp` before writing the query and template.
