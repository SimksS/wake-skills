---
name: wake-mutations
description: Guides implementation of Wake Commerce Storefront API mutations. Use when the task involves creating or manipulating the cart (CreateCheckout, CheckoutAddProduct, CheckoutRemoveProduct), associating an address to the checkout (CheckoutAddressAssociate), authenticating a user (CustomerAccessTokenCreate, CustomerAccessTokenRenew), subscribing to newsletter (CreateNewsletterRegister), reviewing a product (CreateProductReview), updating an address (UpdateAddress), or managing the wishlist (WishlistAddProduct, WishlistRemoveProduct).
---

# Wake Mutations

## When to use

Use this skill when the user asks you to implement **write** operations in the Wake Storefront API, such as:

- Creating or manipulating the shopping cart.
- Authenticating and renewing a customer access token.
- Subscribing an email to the newsletter.
- Reviewing a product.
- Updating a shipping address.
- Adding/removing a product from the wishlist.
- Associating an address to a checkout.

## Quick reference

| Mutation | Purpose | Token required |
|---|---|---|
| `createCheckout` | Create cart (empty or with products) | No |
| `checkoutAddProduct` | Add product(s) to cart | No |
| `checkoutRemoveProduct` | Remove product(s) from cart | No |
| `checkoutAddressAssociate` | Associate address to checkout | Yes |
| `customerAccessTokenCreate` | ⚠️ DEPRECATED — use `customerAuthenticatedLogin` | No |
| `customerAccessTokenRenew` | Renew existing token (new token, 90 days) | Yes (current token) |
| `createNewsletterRegister` | Subscribe/update email in newsletter | No |
| `createProductReview` | Review a product (requires reCAPTCHA) | No |
| `updateAddress` | Update customer address | Yes |
| `wishlistAddProduct` | Add product to wishlist | Yes |
| `wishlistRemoveProduct` | Remove product from wishlist | Yes |

## Key concepts

### checkoutId (UUID)

Identifies the cart. Created by `createCheckout` and reused across all checkout mutations. Persist `checkoutId` in the frontend (cookie or localStorage) for subsequent operations.

### customerAccessToken

Customer session token. Valid for **12 hours** by default; use `customerAccessTokenRenew` to generate a new token valid for **90 days** without asking for the password again.

> Do not use `customerAccessTokenCreate` — deprecated mutation. Use `customerAuthenticatedLogin`.

### reCAPTCHA

`createNewsletterRegister` and `createProductReview` require `recaptchaToken`. Obtain the token via Google reCAPTCHA JS before calling the mutation.

### Cart customizations

Products with customization use `customizationId` (base64 hash). To get the correct `customizationId`, run the `checkout` query first.

## Usage pattern

### Cart flow

```
1. createCheckout → get checkoutId
2. checkoutAddProduct (checkoutId + productVariantId + quantity)
3. checkoutAddressAssociate (checkoutId + addressId + customerAccessToken)
4. checkoutRemoveProduct (when needed)
```

### Authentication flow

```
1. customerAuthenticatedLogin (email + password) → token (12h)
2. customerAccessTokenRenew (token) → new token (90 days)
```

### Adding a product with metadata

```graphql
mutation {
  checkoutAddProduct(input: {
    id: "<checkoutId>"
    products: [{
      productVariantId: 123456
      quantity: 1
      metadata: [{ key: "key", value: "value" }]
    }]
  }) {
    checkoutId
    products { quantity productVariantId }
  }
}
```

### Adding a product with customization

```graphql
mutation {
  checkoutAddProduct(input: {
    id: "<checkoutId>"
    products: [{
      customizationId: "<hash_from_checkout_query>"
      productVariantId: 123
      quantity: 1
    }]
  }) {
    checkoutId
    products { name productVariantId customization { id values { name value } } }
  }
}
```

## Common return fields (Checkout)

After any cart mutation, the most useful fields are:

| Field | Description |
|---|---|
| `checkoutId` | Cart ID |
| `url` | Checkout URL |
| `products` | Products in the cart |
| `subtotal` | Subtotal |
| `total` | Total |
| `shippingFee` | Shipping fee |

## Avoid

- Using `customerAccessTokenCreate` (deprecated).
- Calling `checkoutAddProduct` or `checkoutRemoveProduct` without a valid `checkoutId`.
- Calling `createProductReview` or `createNewsletterRegister` without `recaptchaToken`.
- Using `customizationId` without retrieving it from the `checkout` query first.

## Reference

- Full schemas with examples: [reference.md](reference.md)
- Wake Mutations docs: `https://wakecommerce.readme.io/docs/storefront-api-mutations`
