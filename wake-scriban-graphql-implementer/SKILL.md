---
name: wake-scriban-graphql-implementer
description: Implements or updates Wake storefront features across Scriban HTML templates, GraphQL queries, and Storefront SDK JS. Use when editing files under Pages, Components, Snippets, Queries, or Assets/JS; when building new PDP/PLP/home/checkout sections; or when output risks Liquid-style syntax drift in Scriban templates.
---

# Wake Scriban GraphQL Implementer

Use this skill whenever a Wake task touches templates, queries, or SDK-driven interactions. It aligns your output with the Wake template pattern (Scriban + GraphQL + Storefront SDK) and actively prevents Liquid leakage.

## When to use

- Creating or editing `Pages/**/*.html`, `Components/**/*.html`, `Snippets/**/*.html`.
- Creating or editing `Queries/**/*.graphql`.
- Writing or refactoring JS in `Assets/JS/` that calls `client.*`.
- Porting a behavior referenced from a real Wake project (haight, gregory, oriba, peahi, sumire, shoulder, ugg) into the template.

## Ground truth references

- Scriban language: https://scriban.github.io/docs/language
- Scriban built-ins: https://scriban.github.io/docs/builtins
- Wake composition example: [Pages/product.html](../../Pages/product.html), [Pages/home.html](../../Pages/home.html).
- Snippet pattern: [Snippets/product_view_snippet.html](../../Snippets/product_view_snippet.html), [Snippets/cursor_pagination.html](../../Snippets/cursor_pagination.html).
- SDK bootstrap: [Components/utils/sdk_client.html](../../Components/utils/sdk_client.html).
- Query examples: [Queries/product.graphql](../../Queries/product.graphql), [Queries/search_with_cursor.graphql](../../Queries/search_with_cursor.graphql), [Queries/common.graphql](../../Queries/common.graphql).

## Implementation workflow

1. Identify the rendering surface: page, component, or snippet.
2. Design the data contract first: find or extend the GraphQL query that feeds the template.
3. Author the Scriban template using valid syntax only (see guardrails below).
4. Wire JS if the UI needs SDK interaction (cart, pagination, wishlist, snippet render).
5. Update [Configs/pages.json](../../Configs/pages.json) and [Configs/components.json](../../Configs/components.json) when paths change.

## Scriban correctness guardrails

Use Scriban, never Liquid. When translating ideas from a Liquid reference, convert them:

```html
{{# WRONG (Liquid in Wake) #}}
{% if product.available %}{{ product.title | upcase }}{% endif %}
{% assign count = products | size %}

{{# CORRECT (Scriban in Wake) #}}
{{ if product.available }}{{ product.product_name | string.upcase }}{{ end }}
{{ count = products | array.size }}
```

Scriban essentials:

- Blocks: `{{ if ... }} ... {{ else if ... }} ... {{ else }} ... {{ end }}`.
- Loops: `{{ for item in list offset: 0 limit: 6 }} ... {{ end }}` with `for.index`, `for.first`, `for.last`.
- Case: `{{ case x }} {{ when "a", "b" }} ... {{ else }} ... {{ end }}`.
- Capture: `{{ capture name }} ... {{ end }}`.
- Trim whitespace: `{{~ ... ~}}`.
- Comment: `{{# inline #}}` or `{{ ## multi-line ## }}`.
- Pipes: `| array.filter`, `| string.truncate`, `| math.format`, `| date.to_string`, `| group.by`.
- Null-safe: `obj?.a?.b` and `obj?.a ?? "fallback"`.
- Ternary: `cond ? a : b`.
- Wake components are invoked by name with named args, not via Scriban `include`.

## Template authoring templates

### Page skeleton (copy and adapt)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    {{ page_scripts position: "HEADER_START" scripts: common.scripts }}
    {{ head store: store }}
    {{ data_layer_config }}
    {{ asset type: "css" paths: ["navbar", "footer", "output_base"] }}
    {{ page_scripts position: "HEADER_END" scripts: common.scripts }}
    {{ meta_tags seo: data.<entity>.seo }}
    <link rel="canonical" href="{{ store.urls.current }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <input hidden id="data-layer-page-type" value="<PAGE_TYPE>"/>
</head>
<body class="bg-mainBg">
    {{ page_scripts position: "BODY_START" scripts: common.scripts }}
    <header>
        {{ links }}
        {{ header }}
        {{ navbar store: store menu_groups: common.menu_groups position: "Topo Header" }}
    </header>
    {{ side_cart }}
    {{ wake_overlay }}

    {{# page body #}}

    {{ page_scripts position: "FOOTER_START" scripts: common.scripts }}
    {{ footer is_preview: is_preview store: store }}
    {{ sdk_client }}
    {{ page_scripts position: "FOOTER_END" scripts: common.scripts }}
    {{ wake_scripts scripts: ["wake_utils"] }}
    {{ asset type: "js" paths: [...] options: "async" }}
    {{ page_scripts position: "BODY_END" scripts: common.scripts }}
</body>
</html>
```

### Snippet skeleton

```html
{{ ##
    Description: <what this snippet renders>
    Params:
        - Uses <Queries/...graphql>
    Usage:
        await client.snippet.render("<name>.html", "<query>.graphql", variables);
## }}

{{~ if data.search ~}}
    {{~ products = data.search.products ?? data.search.products_by_offset ~}}
{{~ else if data.hotsite ~}}
    {{~ products = data.hotsite.products ?? data.hotsite.products_by_offset ~}}
{{~ end ~}}

{{ spot_list products: products }}
```

### GraphQL snippet query skeleton

```graphql
query MySnippet(
    $url: String!
    $after: String
    $first: Int
    $partnerAccessToken: String
) {
    hotsite(url: $url, partnerAccessToken: $partnerAccessToken) {
        products(after: $after, first: $first) {
            totalCount
            pageInfo { endCursor hasNextPage }
            edges {
                node {
                    id
                    productId
                    productName
                    alias: aliasComplete
                    available
                    images(width: 275, height: 275) { url print }
                    prices {
                        listPrice
                        price
                        discountPercentage
                        bestInstallment { name displayName discount fees number value }
                    }
                }
            }
        }
    }
}
```

### SDK call skeleton

```js
const partnerAccessToken = await client.cookie.get("sf_partner_access_token");

const obj = {
    partnerAccessToken,
    url: window.location.pathname.slice(1),
    first: 12,
    after: endCursor,
};

const html = await client.snippet.render(
    "cursor_pagination.html",
    "hotsite_with_cursor.graphql",
    obj
);

const container = document.getElementById("infinity-scroll-content-div");
if (container) container.innerHTML += html;
```

## Final checklist

- [ ] All Scriban constructs are valid (no `{% %}`, no Liquid-only filters).
- [ ] GraphQL fields are consumed by the template/snippet.
- [ ] Snippet header lists query and JS caller.
- [ ] JS variable keys match GraphQL variables by name.
- [ ] DOM target verified before injection.
- [ ] `Configs/*.json` updated if paths changed.
- [ ] No `debug.log`, no `console.log`, no stray TODO without owner.
