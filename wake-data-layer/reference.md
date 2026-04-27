# Wake Data Layer Schemas — Reference

Detailed schemas for Data Layer objects by page type.

---

## Page: Home

**Evento:** `page_view` | **pageType:** `HOTSITE - HOME`

| Field | Detail |
|---|---|
| `event` | `"page_view"` |
| `page.pageType` | `"HOTSITE - HOME"` |
| `page.name` | Page title |
| `items` | `[null]` |
| `user.id` | Visitor/customer ID |
| `session.isLogged` | `true` / `false` |
| `session.site.siteDomain` | Store domain |

```json
{
  "0": "event",
  "1": "page_view",
  "2": {
    "page": {
      "pageType": "HOTSITE - HOME",
      "name": "Loja Padrão | Maior loja do segmento de moda"
    },
    "items": [null],
    "user": { "id": "VISIT-e2b41a4b-2307-4791-8c2c-7fb5adoi647d" },
    "session": {
      "isLogged": false,
      "site": { "siteDomain": "https://lojapadrao.com.br" }
    }
  }
}
```

---

## Page: Hotsite / Category

**Evento:** `page_view` | **pageType:** `HOTSITE`

| Field | Detail |
|---|---|
| `page.pageType` | `"HOTSITE"` |
| `page.name` | Category/hotsite title |
| `items[].item_id` | Product SKU |
| `items[].item_name` | Product name |
| `items[].discount` | Applied discount |
| `items[].price` | Price |
| `items[].index` | List position |
| `items[].item_brand` | Brand |
| `items[].item_category` | Primary category |
| `items[].item_category2..49` | Additional categories |
| `items[].quantity` | Quantity |

```json
{
  "0": "event",
  "1": "page_view",
  "2": {
    "page": { "pageType": "HOTSITE", "name": "Calçados - Masculino - Loja Padrão" },
    "items": [{
      "item_id": 18799,
      "item_name": "Tênis Masculino Hovr Phantom 3 Se - Preto",
      "discount": 0,
      "price": 1199.99,
      "index": 2,
      "item_brand": "UNDER ARMOUR",
      "item_category": "Calçados",
      "item_category2": "Under Armour",
      "quantity": 1
    }],
    "user": { "id": "VISIT-e2b41a4b-2307-4791-8c2c-7fbua647d" },
    "session": { "isLogged": false, "site": { "siteDomain": "https://lojapadrao.com.br" } }
  }
}
```

---

## Page: Product

**Evento:** `view_item` | **pageType:** `PRODUCT`

| Field | Detail |
|---|---|
| `currency` | `"BRL"` |
| `value` | Product price |
| `items[].item_id` | Product ID |
| `items[].item_name` | Product name |
| `items[].discount` | Discount |
| `items[].price` | Price |
| `items[].index` | Index in list |
| `items[].item_brand` | Brand |
| `items[].item_category..22` | Categories |
| `items[].item_variant` | Variant SKU |
| `items[].related_products` | Related products `[{id, name}]` |
| `items[].quantity` | Quantity |
| `page.pageType` | `"PRODUCT"` |
| `page.name` | Product name + store |

```json
{
  "0": "event",
  "1": "view_item",
  "2": {
    "currency": "BRL",
    "value": 1199.99,
    "items": [{
      "item_id": 193399,
      "item_name": "Tênis Masculino Hovr Phantom 3 Se - Preto",
      "discount": 0,
      "price": 1199.99,
      "index": 0,
      "item_brand": "UNDER ARMOUR",
      "item_category": "Calçados",
      "item_category2": "Under Armour",
      "item_variant": "777772-JGRA_40",
      "related_products": [
        { "id": "159574", "name": "Tênis Masculino Hovr Rise 4-blk - Preto" }
      ],
      "quantity": 1
    }],
    "user": { "id": "VISIT-e2b707-4791-8c2c-7fb5adea647d" },
    "session": { "isLogged": false, "site": { "siteDomain": "https://lojapadrao.com.br" } },
    "page": { "pageType": "PRODUCT", "name": "Tênis Masculino Hovr Phantom 3 Se - Preto - Loja Padrão" }
  }
}
```

---

## Page: Cart (Bag)

**Evento:** `view_cart` | **pageType:** `CHECKOUT - SACOLA`

> Loaded via snippet (post-render). Use a literal field in HTML, not a Scriban block.

| Field | Detail |
|---|---|
| `event` | `"view_cart"` |
| `ecommerce.currency` | `"BRL"` |
| `ecommerce.value` | Cart total |
| `ecommerce.subtotal` | Subtotal |
| `ecommerce.items[].item_name` | Item name |
| `ecommerce.items[].item_id` | Item ID |
| `ecommerce.items[].price` | Unit price |
| `ecommerce.items[].quantity` | Quantity |
| `ecommerce.items[].item_variant` | Variant SKU |
| `ecommerce.items[].item_category..49` | Categories |
| `gtm.uniqueEventId` | GTM unique event ID |

```json
{
  "event": "view_cart",
  "ecommerce": {
    "currency": "BRL",
    "value": 1199.99,
    "subtotal": 1199.99,
    "items": [{
      "item_name": "Tênis Ua Hovr Phantom 3 Se",
      "item_id": 193399,
      "price": 1199.99,
      "quantity": 1,
      "item_variant": "3982-JGRA_40",
      "item_category": "Calçados",
      "item_category2": "Under Armour"
    }]
  },
  "user": { "id": "VISIT-e2b455507-4791-8c2c-7fb5adea647d" },
  "session": { "isLogged": false, "site": { "siteDomain": "https://lojapadrao.com.br" } },
  "page": { "pageType": "CHECKOUT - SACOLA", "name": "Carrinho - LojaPadrao" },
  "gtm.uniqueEventId": 12
}
```

---

## Page: Shipping

**Evento:** `view_cart` | **pageType:** `CHECKOUT - FRETE`

> Difference vs cart: `user.emailConsumidor` is present when logged in.

| Additional field | Detail |
|---|---|
| `user.emailConsumidor` | Logged-in consumer email |
| `page.pageType` | `"CHECKOUT - FRETE"` |

```json
{
  "event": "view_cart",
  "ecommerce": {
    "currency": "BRL",
    "value": 1199.99,
    "subtotal": 1199.99,
    "items": [{
      "item_name": "Tênis Ua Hovr Phantom 3 Se",
      "item_id": 193399,
      "price": 1199.99,
      "quantity": 1,
      "item_variant": "3026p-JGRA_40",
      "item_category": "Calçados",
      "item_category2": "Under Armour"
    }]
  },
  "user": { "id": "CLIENT-475104", "emailConsumidor": "[email protected]" },
  "session": { "isLogged": true, "site": { "siteDomain": "https://lojapadrao.com.br" } },
  "page": { "pageType": "CHECKOUT - FRETE", "name": "Frete - lojapadrao" },
  "gtm.uniqueEventId": 12
}
```

---

## Page: Checkout

**Evento:** `begin_checkout` | **pageType:** `fechamento`

| Field | Detail |
|---|---|
| `event` | `"begin_checkout"` |
| `ecommerce.value` | Total value |
| `ecommerce.currency` | `"BRL"` |
| `ecommerce.coupon` | Used coupon (or empty) |
| `ecommerce.items[].item_brand` | Item brand |
| `user.emailConsumidor` | Consumer email |
| `page.pageType` | `"fechamento"` |

```json
{
  "event": "begin_checkout",
  "ecommerce": {
    "value": 1211.2,
    "currency": "BRL",
    "items": [{
      "item_name": "Tênis Ua Hovr Phantom 3 Se",
      "item_id": 193399,
      "item_variant": "3026582-JGRA_40",
      "price": 1199.99,
      "item_brand": "UNDER ARMOUR",
      "quantity": 1,
      "item_category": "Calçados",
      "item_category2": "Under Armour"
    }]
  },
  "session": { "isLogged": true, "site": { "siteDomain": "https://checkout.lojapadrao.com.br" } },
  "page": { "name": "Carrinho - Loja Padrão", "pageType": "fechamento" },
  "user": { "id": "CLIENT-475104", "emailConsumidor": "[email protected]" },
  "gtm.uniqueEventId": 9
}
```

---

## Page: Confirmation

**Evento:** `purchase` | **pageType:** `confirmacao`

| Field | Detail |
|---|---|
| `event` | `"purchase"` |
| `ecommerce.transaction_id` | Order ID |
| `ecommerce.value` | Total value |
| `ecommerce.shipping` | Shipping cost |
| `ecommerce.coupon` | Coupon (or `null`) |
| `ecommerce.discount` | Total discount |
| `ecommerce.payment_type` | Payment method (e.g. `"Pix"`) |
| `ecommerce.shipping_tier` | Delivery tier (e.g. `"Standard"`) |
| `page.pageType` | `"confirmacao"` |

```json
{
  "event": "purchase",
  "ecommerce": {
    "transaction_id": "14597",
    "value": 0.1,
    "shipping": 0,
    "currency": "BRL",
    "coupon": null,
    "items": [{
      "item_name": "Cardigan Puro Cashmere",
      "item_id": 150512,
      "item_variant": "16Bp5-1_SHIR_M",
      "price": 959.9,
      "item_brand": "2ESSENTIAL",
      "quantity": 1,
      "item_category": "Essential",
      "item_category2": "Feminino"
    }],
    "discount": -959.8,
    "payment_type": "Pix",
    "shipping_tier": "Standard"
  },
  "session": { "isLogged": true, "site": { "siteDomain": "https://checkout.lojapadrao.com.br" } },
  "page": { "name": "Carrinho - LojaPadrao", "pageType": "confirmacao" },
  "user": { "id": "CLIENT-4794", "emailConsumidor": "[email protected]" },
  "gtm.uniqueEventId": 8
}
```

---

## `user.id` prefixes

| Prefix | Situation |
|---|---|
| `VISIT-<uuid>` | Not authenticated |
| `CLIENT-<id>` | Authenticated |
