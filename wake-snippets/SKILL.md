---
name: wake-snippets
description: Creates, reviews, and integrates Snippets in Wake Storefront SSR for dynamic post-render HTML. Use when the task involves `Snippets/`, `/snippet`, `/snippet/multi`, `client.snippet.render`, autocomplete, on-demand rendering, snippet queries, or GraphQL validation via `wake-graphql-mcp`.
---

# Wake Snippets

## When to use

Use this skill when the user needs to render a piece of HTML after the page’s initial render.

Common cases: autocomplete, price-by-quantity, variant switching, recommendations, partial search results, click-to-load content, or any UI powered by `/snippet`.

## Expected outcome

When finishing a snippet task, the agent should deliver:

- A `.html` template in `Snippets/` (or a subfolder).
- A `.graphql` query in `Queries/` when there is dynamic data.
- SDK or HTTP calling code with correct `fileName`, `queryName`, and `variables`.
- Field validation via `wake-graphql-mcp` when the query uses Wake Commerce data.

## File contract

- `Snippets/<path>.html`: on-demand rendered HTML/Scriban.
- `Queries/<path>.graphql`: query used to feed the snippet.

Paths passed to render are relative to the base folders:

```text
Snippets/Product/card.html                 -> "Product/card.html"
Queries/SnippetQueries/product_card.graphql -> "SnippetQueries/product_card.graphql"
```

## Required flow

1. Define which interaction triggers the snippet and which HTML must be returned.
2. Identify the data needed to render that HTML.
3. If data comes from Wake Commerce, use `wake-graphql-mcp` to confirm the shape.
4. Create or adjust the query with the `wake-queries` skill.
5. Create or adjust the template in `Snippets/`.
6. Choose the render method: SDK, `POST /snippet`, or `POST /snippet/multi`.
7. Validate that `fileName`, `queryName`, and `variables` match the real files.

## Render via SDK

```javascript
const variables = { query: "tenis" }
const html = await client.snippet.render(
  "autocomplete.html",
  "SnippetQueries/autocomplete.graphql",
  variables
)
```

## Render via HTTP

```javascript
const response = await fetch("/snippet", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fileName: "autocomplete.html",
    queryName: "SnippetQueries/autocomplete.graphql",
    variables: { query: "tenis" }
  })
})

const html = await response.text()
```

## Multi render

Use `/snippet/multi` when a single query feeds more than one template.

```json
{
  "fileNames": ["autocomplete.html", "price_box.html"],
  "queryName": "SnippetQueries/search_with_price.graphql",
  "variables": { "query": "tenis", "quantity": 1 }
}
```

The response is a list with `name`, `success`, `error`, and `result`.

## Recommended patterns

- Use snippets for post-render interaction, not for static page content.
- Keep each snippet small and focused on a single interaction.
- Group snippet queries in `Queries/SnippetQueries/`.
- Prefer `/snippet/multi` when multiple HTML outputs depend on the same payload.
- Handle rendering errors in the consuming JavaScript.

## Avoid

- Placing a snippet outside `Snippets/`.
- Passing absolute paths in `fileName` or `queryName`.
- Mixing large responsibilities into a single snippet.
- Inventing GraphQL fields without consulting MCP.
- Using a snippet when a synchronous component would be a better fit.

## Final checklist

- [ ] The `.html` is in `Snippets/` (or a subfolder).
- [ ] The query (if it exists) is in `Queries/` (or a subfolder).
- [ ] `fileName` is relative to `Snippets/`.
- [ ] `queryName` is relative to `Queries/`.
- [ ] `variables` includes all arguments expected by the query.
- [ ] Wake Commerce data was validated before writing the query/template.

## Reference

- Additional details: [reference.md](reference.md)
- Official docs: `https://wakecommerce.readme.io/docs/snippets`
