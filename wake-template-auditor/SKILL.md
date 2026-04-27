---
name: wake-template-auditor
description: Audits Wake storefront repositories for integrity, regressions, and cross-file consistency. Use for pre-release checks, migration from template to project variants, cross-repo diffs against awake, Scriban/Liquid drift detection, and risky refactors touching routing, snippets, checkout, configs, or the data layer.
---

# Wake Template Auditor

Use this skill to run a systematic audit on a Wake storefront template. The workflow is grounded in real issues found in the `awake` template and confirmed patterns across production projects (haight, gregory, oriba, peahi, sumire, shoulder, ugg).

## When to use

- Quality pass before shipping a template or project change.
- Migration audit when porting the `awake` baseline into a new store.
- Post-refactor review for checkout, account, cart, or data layer changes.
- Cross-repo parity check against the `awake` baseline.

## Audit workflow

Copy this checklist and track it explicitly while auditing:

```text
Audit progress:
- [ ] 1. Route integrity (Configs/pages.json -> Pages/ + Queries/)
- [ ] 2. Component registry integrity (Configs/components.json -> Components/)
- [ ] 3. Snippet-query coupling (Snippets/ -> Queries/ + Assets/JS/ callers)
- [ ] 4. Scriban correctness (no Liquid drift, no stale debug)
- [ ] 5. HTML structural issues (duplicate IDs, invalid <head> content)
- [ ] 6. JS data-layer loops and event contract
- [ ] 7. Configs/settings.json secrets and key consistency
- [ ] 8. SDK bootstrap presence on every page
```

### 1. Route integrity

- Parse [Configs/pages.json](../../Configs/pages.json).
- For each `path`, confirm the file exists under [Pages/](../../Pages).
- For each `query`, confirm the file exists under [Queries/](../../Queries).
- Walk `customs[]`, `routes[]`, and nested account/checkout routes.
- Flag `authLevel` entries without matching `authFallback` routes.

### 2. Component registry integrity

- Parse [Configs/components.json](../../Configs/components.json).
- Confirm every `path` maps to a real file in `Components/`.
- Cross-check `params[].required` against actual Scriban usage in each component.
- Flag registered components that are never invoked anywhere in `Pages/`, `Components/`, or `Snippets/`.

### 3. Snippet-query coupling

For each `Snippets/*.html`:

- Verify the file starts with the doc header listing the query.
- Search `Assets/JS/` for the exact `client.snippet.render("<file>.html", ...)` call.
- Confirm the query file in the call exists in `Queries/` or `Queries/SnippetQueries/`.
- Compare JS variable keys with GraphQL query variables (name and type).

### 4. Scriban correctness

Scan `Pages/`, `Components/`, `Snippets/`, `Emails/`, `Root/` for:

- Liquid-only tags: `{% ... %}`, `{% endif %}`, `{% endfor %}`, `{% assign %}`, `{% capture %}`.
- Liquid-only filters: `| size` (use `array.size`), `| upcase`/`| downcase` without `string.` prefix, `forloop.*`.
- Missing `end` keywords for `if`/`for`/`case`/`capture`/`func`.
- `{{ debug.log ... }}` left in production templates.
- Commented-out component calls (`{{# component_name ... #}}`) that should be removed or fixed.
- Stale TODO markers without owner or ticket.

### 5. HTML structural issues

- `<input>`, `<button>`, or other interactive elements inside `<head>`.
- Duplicate `id` attributes across the rendered page (watch for snippet re-injection causing duplicates).
- Missing `<!DOCTYPE html>` or `lang` attribute.
- Missing `alt` on informative images fed by product/banner data.

### 6. JS data-layer loops and event contract

In `Assets/JS/`:

- Look for `return` statements inside loops intended to collect items (bug pattern).
- Confirm events fired by `event_manager.js` match keys consumed by `Components/utils/data_layer/*`.
- Confirm cookie names remain canonical: `sf_partner_access_token`, `sf_customer_access_token`, `carrinho-id`.
- Flag direct `fetch("/graphql")` calls — should use `client.query`.

### 7. Configs/settings.json secrets and key consistency

- Flag any non-placeholder secret in [Configs/settings.json](../../Configs/settings.json).
- Flag mixed naming styles (`camelCase` + `snake_case`) inside the same section.
- Flag presence of dev-only flags in a production-facing file.

### 8. SDK bootstrap presence

For every page in `Pages/`:

- Confirm `{{ sdk_client }}` is present before any JS bundle that uses `client.*`.
- Confirm `{{ page_scripts position: ... }}` appears in the six expected positions.

## Severity model

Classify every finding:

- Critical: breaks rendering, leaks secrets, breaks checkout/account flow.
- High: broken references, missing SDK bootstrap, Liquid syntax in templates, duplicate IDs on key pages.
- Medium: style/naming inconsistencies, stale TODOs, debug traces.
- Low: minor cosmetics, formatting.

## Report format

```markdown
# Wake Template Audit — <target>

## Critical
- [file:line] <issue> — <remediation>

## High
- ...

## Medium
- ...

## Low
- ...

## Parity with awake (optional)
- <difference>: present in <project>, missing in awake (or vice-versa)

## Follow-up verification
- <next step>
```

## Known issues to specifically check in `awake`

Use these as regression anchors when auditing:

- `debug.log` leftover in [Pages/checkout/confirmation.html](../../Pages/checkout/confirmation.html).
- Stale TODO `AJUSTAR O ID DO HOTSITE NO GRAPHQL` in [Pages/home.html](../../Pages/home.html).
- `<input hidden>` used inside `<head>` in multiple page templates.
- Duplicate `id="checkout_total_snippet"` in [Pages/checkout/checkout.html](../../Pages/checkout/checkout.html).
- `console.log` leftovers across several `Assets/JS/*.js` files.
- Committed placeholder in `settings.access_token` (confirm it is not a real token).
