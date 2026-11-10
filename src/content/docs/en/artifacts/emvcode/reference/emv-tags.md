---
title: EMV tags
description: The tags EMVCode knows, with their type, maximum length and subtags.
sidebar:
  order: 6
---

This table comes from the library's registry. To query it from code, use `EMVTagRegistry.getTag("59")` or `EMVTagRegistry.getAllTags()`.

The **Required** column is the registry's `required` flag. `build()` doesn't check it: if a required field is missing, the payload is generated anyway.

## Main tags

| Tag | Type | What it is | Required | Maximum length |
|---|---|---|---|---|
| `00` | Simple | Payload format indicator | Yes | 2 |
| `01` | Simple | Point of initiation method: `11` static, `12` dynamic | Yes | 2 |
| `02`–`25` | Simple | Reserved for EMVCo | No | — |
| `26`–`51` | Template | Merchant account information | No | — |
| `52` | Simple | Merchant category code (MCC) | Yes | 4 |
| `53` | Simple | Currency, ISO 4217 | Yes | 3 |
| `54` | Simple | Transaction amount | No | 13 |
| `55` | Simple | Tip or convenience indicator | No | 2 |
| `56` | Simple | Fixed convenience fee | No | 13 |
| `57` | Simple | Percentage convenience fee | No | 5 |
| `58` | Simple | Country, ISO 3166-1 | Yes | 2 |
| `59` | Simple | Merchant name | Yes | 25 |
| `60` | Simple | Merchant city | Yes | 15 |
| `61` | Simple | Postal code | Yes | 10 |
| `62` | Template | Additional data | No | — |
| `63` | Simple | CRC, added by `build()` | Yes | 4 |
| `64` | Template | Alternate language | No | — |
| `65`–`79` | Simple | Reserved for EMVCo | No | — |

## Tag 26 subtags

| Subtag | What it is | `EMVField` |
|---|---|---|
| `00` | Globally unique identifier (GUI) | `MERCHANT_ACCOUNT_GUI` |
| `01` | Account identifier | `MERCHANT_ACCOUNT_ID` |
| `02` | Mobile number | `MERCHANT_ACCOUNT_MOBILE` |
| `03` | Email | `MERCHANT_ACCOUNT_EMAIL` |
| `04` | Alphanumeric | `MERCHANT_ACCOUNT_ALPHANUMERIC` |
| `05` | Merchant identifier | `MERCHANT_ACCOUNT_MERCHANT_ID` |

## Tag 62 subtags

| Subtag | What it is | `EMVField` |
|---|---|---|
| `01` | Bill number | `ADDITIONAL_BILL_NUMBER` |
| `02` | Mobile number | `ADDITIONAL_MOBILE_NUMBER` |
| `03` | Store | `ADDITIONAL_STORE_LABEL` |
| `04` | Loyalty number | `ADDITIONAL_LOYALTY_NUMBER` |
| `05` | Reference | `ADDITIONAL_REFERENCE_LABEL` |
| `06` | Customer | `ADDITIONAL_CUSTOMER_LABEL` |
| `07` | Terminal | `ADDITIONAL_TERMINAL_LABEL` |
| `08` | Purpose of the transaction | `ADDITIONAL_PURPOSE` |
| `09` | Data requested from the customer | `ADDITIONAL_CONSUMER_DATA` |
| `10` | Merchant tax ID | `ADDITIONAL_MERCHANT_TAX_ID` |
| `11` | Origin channel | `ADDITIONAL_CHANNEL_ORIGIN` |

## Tag 64 subtags

| Subtag | What it is | `EMVField` |
|---|---|---|
| `00` | Language, ISO 639 | `LANGUAGE_PREFERENCE` |
| `01` | Merchant name in that language | `MERCHANT_NAME_ALT` |
| `02` | City in that language | `MERCHANT_CITY_ALT` |

## Colombian tags (80 to 99)

All of them are templates. Where there's a subtag `00`, it holds the identifier (GUI) and `01` holds the value.

| Tag | What it is | Subtags | Required |
|---|---|---|---|
| `80` | Channel | `00`, `01` | Yes |
| `81` | VAT condition | `00`, `01` | Yes |
| `82` | VAT value or percentage | `00`, `01` | Yes |
| `83` | VAT base | `00`, `01` | Yes |
| `84` | INC condition | `00`, `01` | Yes |
| `85` | INC value or percentage | `00`, `01` | Yes |
| `86`–`89` | Reserved for taxes | — | No |
| `90` | Transaction identifier | `00`, `01` | Yes |
| `91` | Security code (SHA-256) | `00`, `01` | Yes |
| `92` | Collection or top-up service code | `01` | No |
| `93` | Collection reference or mobile number | `00`, `01` | No |
| `94` | Collection product type | `01` | No |
| `95` | Origin account | `01` | No |
| `96` | Destination account | `01` | No |
| `97` | Destination account reference | `01` | No |
| `98` | Transfer product type | `01` | No |
| `99` | Applied discount | `00`, `01` | No |

## Common codes

| Currency (tag `53`) | Code |
|---|---|
| Colombian peso (COP) | `170` |
| US dollar (USD) | `840` |
| Mexican peso (MXN) | `484` |
| Peruvian sol (PEN) | `604` |

| Category (tag `52`) | MCC |
|---|---|
| Transportation | `4111` |
| Grocery stores | `5411` |
| Restaurants | `5812` |
| Miscellaneous stores | `5999` |
| Hotels | `7011` |

The full specification is on the [EMVCo](https://www.emvco.com/emv-technologies/qrcodes/) website.
