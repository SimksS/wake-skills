---
name: wake-store-builtins
description: Guides usage of built-in variables injected into Scriban by Wake Storefront SSR, especially the `store` object. Use when the task involves environment (`is_preview`, `is_local`), store/checkout/asset URLs, Storefront settings, or when the user wants to avoid unnecessary API calls inside Wake templates.
---

# Wake Store Built-ins

## When to use

Use this skill when the user needs to access global variables already injected by Wake Storefront into HTML/Scriban templates.

Also trigger when the task mentions `store`, `store.urls`, `store.settings`, `is_preview`, `is_local`, `default_template`, `no_script`, checkout URLs, asset URLs, Google Analytics, GTM, social login, Feature Policy, or global store settings.

## Expected outcome

When finishing a built-ins task, the agent should:

- Use the `store` object when the information is already injected by the Storefront.
- Avoid GraphQL queries or JavaScript/API calls for data that already exists in `store`.
- Access properties using Scriban syntax and `underscore_case` names.
- Confirm whether the variable belongs to environment, identification, URLs, or settings.
- Handle optional values before rendering HTML, scripts, or links.

## Main rule

Wake automatically injects the `store` object into Storefront pages. It contains environment information, configuration, and store URLs.

Use:

```scriban
{{ store.urls.base }}
{{ store.urls.static_img }}
{{ store.settings.gtm_id }}
```

Do not create extra calls to fetch data that is already available in `store`.

## Relationship with Scriban

This skill depends on the `rules/wake-scriban.mdc` rule.

Remember that objects injected by the Storefront use `underscore_case`. For example:

```scriban
{{ store.urls.checkout_pages.login.password_recovery }}
```

Do not use `camelCase` such as `store.urls.checkoutPages.login.passwordRecovery`.

## Required flow

1. Identify which data the template needs to render.
2. Check whether that data already exists in the `store` object.
3. Consult [reference.md](reference.md) to confirm the path.
4. Use the path prefixed with `store.` in Scriban.
5. If the value can be empty, wrap rendering in a conditional.
6. Only use GraphQL, JavaScript, or an external API if the data is not available in built-ins.

## Examples

Store base URL:

```scriban
<a href="{{ store.urls.base }}">Back to the store</a>
```

Static image:

```scriban
<img src="{{ store.urls.static_img }}/logo.svg" alt="{{ store.store_name }}">
```

Conditional rendering in preview:

```scriban
{{ if store.is_preview }}
  <span class="preview-badge">Preview</span>
{{ end }}
```

Google Tag Manager only when configured:

```scriban
{{ if store.settings.gtm_id && !(store.settings.gtm_id | string.empty) }}
  <script>
    window.wakeGtmId = "{{ store.settings.gtm_id }}"
  </script>
{{ end }}
```

## Recommended patterns

- Use `store.urls.static_img`, `store.urls.static_font`, and `store.urls.static_bundle` for assets served by Wake.
- Use `store.urls.checkout_pages` for checkout/login/account links, because they are generated from `Configs/pages.json`.
- Use `store.settings` for global Storefront settings already injected.
- Use `store.is_local` and `store.is_preview` for environment logic.
- Keep conditional logic simple in templates.

## Avoid

- Running GraphQL queries for base URL, checkout URL, asset URL, or global settings already injected.
- Hardcoding checkout/login/account/asset URLs.
- Accessing built-ins without the `store.` prefix.
- Using `camelCase` for injected properties.
- Assuming optional settings always have values.

## Final checklist

- [ ] The information truly doesn’t require an extra call because it exists in `store`.
- [ ] The used path starts with `store.`.
- [ ] Properties are in `underscore_case`.
- [ ] Optional settings are guarded with conditionals.
- [ ] Checkout/account links use `store.urls.checkout_pages`.
- [ ] Assets use static URLs from `store.urls`.

## Reference

- Variables list: [reference.md](reference.md)
- Official docs: `https://wakecommerce.readme.io/docs/vari%C3%A1veis-built-in-injetadas-no-storefront`
