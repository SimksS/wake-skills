# Mutations Reference — Wake Storefront API

---

## CreateCheckout

Creates an empty cart or a cart with products.

**Parameters (`products` — optional, array)**

| Argument | Type | Required | Description |
|---|---|---|---|
| `productVariantId` | Long | Yes | Variant ID |
| `quantity` | Integer | Yes | Quantity |
| `customization` | array | No | Customizations |
| `subscription` | object | No | Subscription data |
| `metadata` | array `{key, value}` | No | Item metadata |

```graphql
mutation {
  createCheckout(products: [{
    productVariantId: 5438
    quantity: 1
  }]) {
    checkoutId
    url
    products { name productVariantId quantity price }
    subtotal
    total
  }
}
```

**Main return:** `checkoutId` (UUID), `url`, `products[]`, `subtotal`, `total`, `shippingFee`.

---

## CheckoutAddProduct

Adds one or more products to an existing cart.

**Parameters (`input`)**

| Argument | Type | Required | Description |
|---|---|---|---|
| `id` | Uuid | Yes | Cart ID |
| `products` | array | Yes | Products to add |

**`products[]`**

| Argument | Type | Required | Description |
|---|---|---|---|
| `productVariantId` | Long | Yes | Variant ID |
| `quantity` | Integer | Yes | Quantity |
| `customization` | array | No | `[{customizationId, value}]` |
| `subscription` | object | No | `{subscriptionGroupId, recurringTypeId}` |
| `metadata` | array | No | `[{key, value}]` |

```graphql
mutation {
  checkoutAddProduct(input: {
    id: "e29a5316-ee1f-4c9c-9a58-429d1b16e7fb"
    products: [{ productVariantId: 5396, quantity: 1 }]
  }) {
    checkoutId
    url
    products { name productVariantId quantity price }
    subtotal
    total
  }
}
```

> For products with customization, fetch `customizationId` via the `checkout` query first.

---

## CheckoutRemoveProduct

Removes one or more products from a cart.

**Parameters (`input`)** — same structure as `CheckoutAddProduct`.

**`customization[]` (removal)**

| Argument | Type | Required | Description |
|---|---|---|---|
| `customizationId` | String | Yes | Customization hash |
| `productVariantId` | Long | Yes | Variant ID |
| `quantity` | Integer | No | Quantity to remove (default: 1) |

```graphql
mutation {
  checkoutRemoveProduct(input: {
    id: "e29a5316-ee1f-4c9c-9a58-429d1b16e7fb"
    products: [{ productVariantId: 5396, quantity: 1 }]
  }) {
    checkoutId
    products { name productVariantId quantity }
    subtotal
    total
  }
}
```

---

## CheckoutAddressAssociate

Associates a customer saved address to the checkout.

**Parameters**

| Argument | Type | Required | Description |
|---|---|---|---|
| `customerAccessToken` | String | Yes | Customer token |
| `addressId` | ID | Yes | Address ID |
| `checkoutId` | Uuid | Yes | Cart ID |

```graphql
mutation($customerAccessToken: String!, $addressId: ID!, $checkoutId: Uuid!) {
  checkoutAddressAssociate(
    customerAccessToken: $customerAccessToken
    addressId: $addressId
    checkoutId: $checkoutId
  ) {
    cep
    checkoutId
    url
    updateDate
  }
}
```

---

## CustomerAccessTokenCreate

> ⚠️ **DEPRECATED** — Use `customerAuthenticatedLogin`.

Creates an access token (valid for 12 hours).

**Parameters (`input`)**

| Argument | Type | Required |
|---|---|---|
| `email` | String | Yes |
| `password` | String | Yes |

```graphql
mutation {
  customerAccessTokenCreate(input: { email: "user@store.com", password: "123456" }) {
    token
    validUntil
  }
}
```

---

## CustomerAccessTokenRenew

Renews the customer token without asking for the password again. The new token is valid for **90 days**.

**Parameters**

| Argument | Type | Required |
|---|---|---|
| `customerAccessToken` | String | Yes |

```graphql
mutation {
  customerAccessTokenRenew(customerAccessToken: "<token_atual>") {
    token
    validUntil
  }
}
```

---

## CreateNewsletterRegister

Subscribes or updates an email in the store newsletter.

**Parameters (`input`)**

| Argument | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | User name |
| `email` | String | Yes | Email |
| `recaptchaToken` | String | Yes | reCAPTCHA token |
| `gender` | Enum | No | `MALE`, `FEMALE`, or `null` |
| `informationGroupValues` | array | No | `[{id, value}]` — extra fields |

```graphql
mutation {
  createNewsletterRegister(input: {
    email: "mail@mail.com"
    name: "Maria Silva"
    recaptchaToken: "<token>"
    gender: FEMALE
  }) {
    createDate
    email
    name
    updateDate
    gender
  }
}
```

> If `gender` is not provided or is `null`, it shows as “NOT INFORMED” in the admin panel.
> For extra signup fields, use `informationGroupValues` with IDs from the `NewsletterInformationGroupFields` query.

---

## CreateProductReview

Adds a review to a product.

**Parameters (`input`)**

| Argument | Type | Required | Description |
|---|---|---|---|
| `email` | String | Yes | Reviewer email |
| `name` | String | Yes | Reviewer name |
| `productVariantId` | Long | Yes | Reviewed variant ID |
| `rating` | Int | Yes | Rating from 1 to 5 |
| `recaptchaToken` | String | Yes | reCAPTCHA token |
| `review` | String | Yes | Review text |

```graphql
mutation {
  createProductReview(input: {
    email: "user@test.com"
    name: "João"
    productVariantId: 123
    rating: 5
    recaptchaToken: "<token>"
    review: "Produto excelente!"
  }) {
    customer
    email
    rating
    review
    reviewDate
  }
}
```

---

## UpdateAddress

Updates a customer address.

**Parameters**

| Argument | Type | Required |
|---|---|---|
| `customerAccessToken` | String | Yes |
| `id` | ID | Yes |
| `address` | CustomerAddressInput | Yes |

**`CustomerAddressInput`**

| Field | Description |
|---|---|
| `name` | Recipient name |
| `phone` | Phone |
| `email` | Email |
| `street` | Street |
| `addressNumber` | Number |
| `neighborhood` | Neighborhood |
| `city` | City |
| `cep` | CEP |
| `state` | State (abbr.) |

```graphql
mutation($token: String!, $id: ID, $address: CustomerAddressInput!) {
  updateAddress(customerAccessToken: $token, id: $id, address: $address) {
    id
    name
    phone
    street
    addressNumber
    neighborhood
    city
    cep
    state
    country
  }
}
```

**Variables:**
```json
{
  "token": "<TOKEN>",
  "id": "<addressId_base64>",
  "address": {
    "name": "Nome",
    "phone": "11999990000",
    "email": "user@loja.com",
    "street": "Rua das Flores",
    "addressNumber": "100",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "cep": "01310-100",
    "state": "SP"
  }
}
```

---

## WishlistAddProduct

Adds a product to the customer wishlist.

**Parameters**

| Argument | Type | Required |
|---|---|---|
| `customerAccessToken` | String | Yes |
| `productId` | Long | Yes |

```graphql
mutation {
  wishlistAddProduct(customerAccessToken: "<token>", productId: 222) {
    productId
    productName
  }
}
```

> Returns the full wishlist after the operation (same entity as the `Products` query).

---

## WishlistRemoveProduct

Removes a product from the customer wishlist.

**Parameters** — identical to `WishlistAddProduct`.

```graphql
mutation {
  wishlistRemoveProduct(customerAccessToken: "<token>", productId: 222) {
    productId
    productName
  }
}
```

> Returns the updated wishlist after removal.
