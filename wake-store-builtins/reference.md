# Wake Store Built-ins — Quick Reference

Wake automatically injects the `store` object into Storefront templates. Use these values directly in Scriban to avoid extra API calls.

## How to access

Always use the `store.` prefix:

```scriban
{{ store.store_name }}
{{ store.urls.base }}
{{ store.settings.gtm_id }}
```

Because Storefront uses Scriban, injected properties appear in `underscore_case`.

## Environment

| Path | Type | Description |
| --- | --- | --- |
| `store.is_preview` | boolean | Whether the template is running in preview mode. |
| `store.is_local` | boolean | Whether execution is running in a local environment. |
| `store.default_template` | boolean | Whether it’s using Awake’s default template. |
| `store.no_script` | boolean | Whether scripts are being ignored during rendering. |

## Identification and version

| Path | Type | Description |
| --- | --- | --- |
| `store.store_name` | string | Store name. |
| `store.theme` | string | Active theme. |
| `store.last_modified` | string | Template last modified date. |
| `store.wake_last_modified` | string | Wake closed components last modified date. |

## URLs

| Path | Type | Description |
| --- | --- | --- |
| `store.urls.static_font` | string | Base URL for static fonts. |
| `store.urls.static_img` | string | Base URL for static images. |
| `store.urls.static_bundle` | string | Base URL for static bundles. |
| `store.urls.current` | string | Current page URL. |
| `store.urls.base` | string | Store base URL. |
| `store.urls.checkout` | string | Main checkout URL. |

## Checkout, login, and account URLs

URLs under `checkout_pages` are generated from `Configs/pages.json`. Prefer these values over hardcoded URLs.

| Path | Type | Description |
| --- | --- | --- |
| `store.urls.checkout_pages.checkout.home` | string | Checkout home page. |
| `store.urls.checkout_pages.checkout.complete` | string | Checkout completion page. |
| `store.urls.checkout_pages.checkout.confirmation` | string | Checkout confirmation page. |
| `store.urls.checkout_pages.login.simple` | string | Simple login page. |
| `store.urls.checkout_pages.login.authenticate` | string | Login authentication page. |
| `store.urls.checkout_pages.login.password_recovery` | string | Password recovery page. |
| `store.urls.checkout_pages.login.signup` | string | Signup page. |
| `store.urls.checkout_pages.login.impersonate` | string | Impersonate login page. |
| `store.urls.checkout_pages.login.access_key` | string | Access-key login page. |
| `store.urls.checkout_pages.account.orders` | string | Account orders page. |
| `store.urls.checkout_pages.account.data` | string | Account personal data page. |
| `store.urls.checkout_pages.account.password` | string | Account password change page. |
| `store.urls.checkout_pages.account.addresses` | string | Account addresses page. |
| `store.urls.checkout_pages.account.checking_account` | string | Account checking account page. |
| `store.urls.checkout_pages.account.subscriptions` | string | Account subscriptions page. |

## Settings

Use `store.settings` for global store settings already injected into Storefront.

| Path | Type | Description |
| --- | --- | --- |
| `store.settings.require_pickup_info` | boolean | Whether the store requires pickup information. |
| `store.settings.change_email_with_access_key` | boolean | Whether changing email via access key is allowed. |
| `store.settings.apple_client_id` | string | Apple Sign-In integration ID. |
| `store.settings.facebook_app_id` | string | Facebook integration ID. |
| `store.settings.fbits_google_analytics_id` | string | Legacy Google Analytics integration ID. |
| `store.settings.feature_policy` | string | Feature policies enabled in the browser. |
| `store.settings.gtag_id` | string | Google Analytics GA4 integration ID. |
| `store.settings.google_client_id` | string | Google Sign-In integration ID. |
| `store.settings.gtm_id` | string | Google Tag Manager integration ID. |
| `store.settings.feature_policy_header` | boolean | Whether to apply the Feature Policy header. |
| `store.settings.experience_btg` | string | BTG experience (reserved field). |
| `store.settings.experience_sdk` | string | SDK experience (reserved field). |
| `store.settings.partner_cookie_expiration_minutes` | number | Partner cookie expiration time, in minutes. |
| `store.settings.product_page_url_mode` | string | Product page URL mode. |
| `store.settings.multi_freight` | boolean | Whether the store supports multiple freight options. |
| `store.settings.login_cpf_cnpj` | boolean | Whether login can be done with CPF/CNPJ. |
| `store.settings.dispatch_text_time` | string | Configurable text shown after order dispatch. |

## Usage patterns

Password recovery link:

```scriban
<a href="{{ store.urls.checkout_pages.login.password_recovery }}">Forgot my password</a>
```

Static asset:

```scriban
<img src="{{ store.urls.static_img }}/logo.svg" alt="{{ store.store_name }}">
```

Conditional for local environment:

```scriban
{{ if store.is_local }}
  <script src="/dev-tools.js"></script>
{{ end }}
```

Optional setting:

```scriban
{{ if store.settings.gtag_id && !(store.settings.gtag_id | string.empty) }}
  <script>
    window.wakeGtagId = "{{ store.settings.gtag_id }}"
  </script>
{{ end }}
```
