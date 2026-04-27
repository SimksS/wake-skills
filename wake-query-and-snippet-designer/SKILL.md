---
name: wake-query-and-snippet-designer
description: Designs Wake GraphQL queries and snippet rendering flows for PLP, PDP, home, checkout, account, and editor-driven sections. Use when adding or refactoring snippet-based partial rendering, cursor or offset pagination, wholesale price updates, mini-cart refresh, shipping quotes, or any dynamic content loaded via client.snippet.render.
---

# Wake Query and Snippet Designer

Use this skill when building or changing any Wake partial-render flow that spans the three coupled artifacts: JS caller, snippet template, and GraphQL query.

## When to use

- Adding a new `Queries/SnippetQueries/*.graphql`.
- Creating or updating a file in `Snippets/`.
- Building cursor/offset list refresh, show-more, filters, mini-cart, shipping quotes, checkout updates, wholesale price recalculation, or wishlist refresh.
- Porting a dynamic behavior from a real Wake project into `awake`.

## Design workflow

Copy this checklist and track progress while designing:

```text
Design progress:
- [ ] 1. Define rendering target and interaction (replace, append, hydrate, refresh).
- [ ] 2. Choose pagination model (offset vs cursor) if listing data.
- [ ] 3. Author GraphQL query with minimal, correct variables.
- [ ] 4. Implement snippet HTML with the doc header and stable selectors.
- [ ] 5. Wire JS call with matching variables and safe DOM injection.
- [ ] 6. Validate three-way coupling (JS <-> Snippet <-> Query).
```

### 1. Define rendering target and interaction

- Replace: `innerHTML = html`.
- Append: `innerHTML += html`.
- Hydrate: inject once on load and attach listeners.
- Refresh: remove previous nodes, then inject.

Decide the injection container up front. Use a stable, unique ID that is not re-rendered by server-side pagination (for example `infinity-scroll-content-div`, `wake-checkout-products`, `mini-cart-container`).

### 2. Pagination model

- Offset pagination (`productsByOffset`): use when the UI exposes numbered pages (`?pagina=2&tamanho=24`).
- Cursor pagination (`products { edges { node { ... } } pageInfo }`): use when the UI shows "load more" or infinite scroll.

Cursor queries must always select:

```graphql
pageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
}
totalCount
```

Reference: [Queries/search_with_cursor.graphql](../../Queries/search_with_cursor.graphql).

### 3. Author GraphQL query

Keep snippet queries narrow. Only select fields the snippet reads.

```graphql
query HotsiteCursor(
    $url: String!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filters: [ProductFilterInput]
    $minimumPrice: Decimal
    $maximumPrice: Decimal
    $sortKey: ProductSortKeys
    $sortDirection: SortDirection
    $partnerAccessToken: String
) {
    hotsite(url: $url, partnerAccessToken: $partnerAccessToken) {
        products(
            after: $after
            before: $before
            first: $first
            last: $last
            filters: $filters
            minimumPrice: $minimumPrice
            maximumPrice: $maximumPrice
            sortDirection: $sortDirection
            sortKey: $sortKey
        ) {
            totalCount
            pageInfo { endCursor hasNextPage hasPreviousPage startCursor }
            edges { cursor node { ...ProductCardFields } }
        }
    }
}
```

Reuse the minimal product card shape across spots:

```graphql
fragment ProductCardFields on Product {
    id
    productId
    productName
    productVariantId
    alias: aliasComplete
    images(width: 275, height: 275) { url print }
    available
    prices {
        listPrice
        price
        discountPercentage
        bestInstallment { name displayName discount fees number value }
    }
}
```

### 4. Snippet implementation

Start with the doc header (mandatory). Keep logic minimal; read from `data.*` as the query shapes it.

```html
{{ ##
    Description: Renders the product list with infinite scroll
    Params:
        - Uses hotsite_with_cursor.graphql or search_with_cursor.graphql
    Usage:
        await client.snippet.render("cursor_pagination.html", "<query>.graphql", variables);
## }}

{{~
    if data.search
        products = data.search.products ?? data.search.products_by_offset
    else if data.hotsite
        products = data.hotsite.products ?? data.hotsite.products_by_offset
    end
~}}

{{ spot_list products: products }}
{{ pagination products: products page_size: page_size current_page: current_page }}
```

Snippet rules:

- Use `?.` for optional access and `??` for fallbacks.
- Do not set IDs that already exist on the parent page unless the snippet fully replaces that region.
- Keep selectors that JS depends on (for example `show-more-button`, `infinity-scroll-content-div`) stable.

### 5. JS wiring

```js
async function showMore() {
    const divButton = document.getElementById("div-button-show-more");
    if (!divButton) return;

    const endCursor = divButton.getAttribute("data-end-cursor");
    divButton.remove();

    const partnerAccessToken = await client.cookie.get("sf_partner_access_token");
    const pageSize = Number(document.getElementById("def_page_size")?.value || 12);
    const url = window.location.pathname.slice(1);

    const variables = {
        partnerAccessToken,
        filters: getFilters(),
        resultSize: pageSize,
        after: endCursor,
        url,
    };

    const html = await client.snippet.render(
        "cursor_pagination.html",
        "hotsite_with_cursor.graphql",
        variables
    );

    const container = document.getElementById("infinity-scroll-content-div");
    if (container) container.innerHTML += html;

    document.getElementById("show-more-button")?.addEventListener("click", showMore);
}
```

JS rules:

- Variable keys in `variables` must match GraphQL query variable names.
- Always verify DOM targets before mutating.
- Re-bind listeners after injection; injected nodes do not carry prior event bindings.
- Never use `fetch` directly; always call through `client.query` or `client.snippet.render`.

### 6. Validate three-way coupling

Before finalizing:

- [ ] `client.snippet.render("<name>.html", "<query>.graphql", variables)` uses real paths.
- [ ] Query variable list matches `variables` object keys exactly.
- [ ] Snippet template reads the exact fields the query returns.
- [ ] Snippet renders cleanly for empty, partial, and full data states.
- [ ] Cursor/offset update predictably for the UX flow.
- [ ] No debug output in JS or template.

## References

- SDK bootstrap: [Components/utils/sdk_client.html](../../Components/utils/sdk_client.html).
- Pagination pair: [Assets/JS/pagination.js](../../Assets/JS/pagination.js) + [Snippets/cursor_pagination.html](../../Snippets/cursor_pagination.html) + [Queries/search_with_cursor.graphql](../../Queries/search_with_cursor.graphql).
- Product refresh pair: [Assets/JS/product.js](../../Assets/JS/product.js) + [Snippets/product_view_snippet.html](../../Snippets/product_view_snippet.html) + [Queries/product.graphql](../../Queries/product.graphql).
- Scriban language: https://scriban.github.io/docs/language
- Scriban built-ins: https://scriban.github.io/docs/builtins
