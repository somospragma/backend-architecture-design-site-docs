---
title: EMVCoContentSemanticBuilder
description: Every method of the semantic builder and the tag each one writes.
sidebar:
  order: 1
---

```ts
import { EMVCoContentSemanticBuilder, EMVField } from "@pragmasa/emvcode";
```

Builds the payload with named methods. Each method returns the builder, so they can be chained. Compatibility alias: `EMVCoQrContentSemanticBuilder`.

## Common behavior

- Values must be `string`. An empty value, `null`, `undefined` or `"N/A"` throws `The tag value is invalid`.
- In simple tags, a value longer than the tag's maximum is silently truncated. Subtags aren't truncated.
- Calling the same method twice replaces the previous value.
- `build()` doesn't check required fields: with an empty builder it returns only the CRC (`63046007`).

:::caution[Known issues in 1.1.1]
- `setAdditionalChannelOrigin` writes to subtag `62.10`, the tax ID one, and replaces it. Use `setSubTag("62", "11", value)`.
- `setServiceCode`, `setProductTypeCollection`, `setOriginAccount`, `setDestinationAccount`, `setDestinationAccountReference` and `setProductTypeTransference` always throw `Tag 9x is a template. Use setSubTag()`. Use `setSubTag("92", "01", value)` and the same for tags `94` to `98`.
- The package doesn't export the condition enum. For `setTipIndicator`, `setVATCondition` and `setINCCondition`, use `"01" as TypeConditionValue`.
:::

## Start

| Method | Writes | Notes |
|---|---|---|
| `setPayloadFormatIndicator(value = "01")` | `00` | Only accepts `"01"`. Can be called without an argument. |
| `setStaticQR()` | `01` = `11` | QR for many payments, without an amount. |
| `setDynamicQR()` | `01` = `12` | QR for a single payment. |
| `setAcquirerNetworkId(value)` | — | Doesn't write to the payload. Stores the value uppercased in the `acquirerNetworkId` property (`COM.ACQUIRER` by default) to build the GUIs. |

## Merchant account

| Method | Writes |
|---|---|
| `setMerchantAccountGUI(value)` | `26.00` |
| `setMerchantAccountId(value, keyType)` | `26.01` to `26.05`, depending on `keyType` |
| `setNetworkGUI(value)` / `setNetworkId(value)` | `49.00` / `49.01` |
| `setMerchantCodeGUI(value)` / `setMerchantCode(value)` | `50.00` / `50.01` |
| `setAggregatorCodeGUI(value)` / `setAggregatorCode(value)` | `51.00` / `51.01` |

`keyType` values for `setMerchantAccountId`:

| `keyType` | Subtag |
|---|---|
| `EMVField.MERCHANT_ACCOUNT_ID` | `01` |
| `EMVField.MERCHANT_ACCOUNT_MOBILE` | `02` |
| `EMVField.MERCHANT_ACCOUNT_EMAIL` | `03` |
| `EMVField.MERCHANT_ACCOUNT_ALPHANUMERIC` | `04` |
| `EMVField.MERCHANT_ACCOUNT_MERCHANT_ID` | `05` |

## Merchant and transaction

| Method | Writes | Maximum length |
|---|---|---|
| `setMerchantCategoryCode(value)` | `52` | 4 |
| `setCurrencyISO4217(value)` | `53` | 3 |
| `setTransactionAmount(value)` | `54` | 13 |
| `setTipIndicator(value)` | `55` | 2 |
| `setTipFixedAmount(value)` | `56` | 13 |
| `setTipPercentage(value)` | `57` | 5 |
| `setCountryCode(value)` | `58` | 2 |
| `setMerchantName(value)` | `59` | 25 |
| `setMerchantCity(value)` | `60` | 15 |
| `setPostalCode(value)` | `61` | 10 |

## Additional data (tag 62)

| Method | Writes |
|---|---|
| `setAdditionalBillNumber(value)` | `62.01` |
| `setAdditionalMobileNumber(value)` | `62.02` |
| `setAdditionalStoreLabel(value)` | `62.03` |
| `setAdditionalLoyaltyNumber(value)` | `62.04` |
| `setAdditionalReferenceLabel(value)` | `62.05` |
| `setAdditionalCustomerLabel(value)` | `62.06` |
| `setAdditionalTerminalLabel(value)` | `62.07` |
| `setAdditionalPurpose(value)` | `62.08` |
| `setAdditionalConsumerData(value)` | `62.09` |
| `setAdditionalMerchantTaxId(value)` | `62.10` |
| `setAdditionalChannelOrigin(value)` | `62.10` in 1.1.1; should be `62.11` |

## Alternate language (tag 64)

| Method | Writes |
|---|---|
| `setLanguagePreference(value)` | `64.00`, ISO 639 code |
| `setMerchantNameAlt(value)` | `64.01` |
| `setMerchantCityAlt(value)` | `64.02` |

## Colombian tags (80 to 99)

In each pair, the `…Gui` method writes subtag `00` and the other one writes `01`.

| Methods | Tag | What it holds |
|---|---|---|
| `setChannelGui` / `setChannel` | `80` | Channel (`POS`, `APP`, `WEB`…) |
| `setVATConditionGui` / `setVATCondition` | `81` | VAT condition: `"01"`, `"02"` or `"03"` |
| `setVATValueGui` / `setVATValue` | `82` | VAT value |
| `setVATBaseGui` / `setVATBase` | `83` | VAT base |
| `setINCConditionGui` / `setINCCondition` | `84` | INC condition |
| `setINCValueGui` / `setINCValue` | `85` | INC value |
| `setTransactionIdGui` / `setTransactionId` | `90` | Transaction identifier |
| `setSecurityHashGui` / `setSecurityHash` | `91` | Security code from [`HashCodeBuilder`](../hash-code-builder/) |
| `setServiceCode` | `92` | Collection or top-up service code. Doesn't work in 1.1.1. |
| `setReferenceOrMobileGui` / `setReferenceOrMobile` | `93` | Collection reference or mobile number |
| `setProductTypeCollection` | `94` | Collection product type. Doesn't work in 1.1.1. |
| `setOriginAccount` | `95` | Origin account. Doesn't work in 1.1.1. |
| `setDestinationAccount` | `96` | Destination account. Doesn't work in 1.1.1. |
| `setDestinationAccountReference` | `97` | Destination account reference. Doesn't work in 1.1.1. |
| `setProductTypeTransference` | `98` | Transfer product type. Doesn't work in 1.1.1. |
| `setDiscountApplicationGui` / `setDiscountApplication` | `99` | Applied discount |

## By tag

The semantic builder also has `setTag(tag, value)` and `setSubTag(templateTag, subTag, value)`, with the same rules as in [`EMVCoContentBuilder`](../content-builder/). Use them for fields without a method and to work around the known issues:

```ts
import { EMVCoContentSemanticBuilder } from "@pragmasa/emvcode";

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setDynamicQR()
  .setAdditionalMerchantTaxId("900123456")
  .setSubTag("62", "11", "APP") // instead of setAdditionalChannelOrigin("APP")
  .setSubTag("95", "01", "1234567890") // instead of setOriginAccount("1234567890")
  .build();

console.log(payload);
```

```text
000201010212622010099001234561103APP9514011012345678906304760B
```

## `build()`

Returns the payload as a `string`: fields sorted by tag, subtags sorted inside each template and the CRC16 in tag `63`. Then it empties the builder, ready for the next QR.
