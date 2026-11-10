---
title: How to add VAT and INC to the QR
description: Generate a payment QR with Colombian tax information in tags 81 to 85.
sidebar:
  order: 1
---

When you finish you'll have a dynamic QR with the purchase's VAT (IVA) and consumption tax (INC), in the Colombian proprietary tags.

## Before you start

- Do the [quick start](../../quick-start/).
- Have your acquirer identifier at hand. The examples use `COM.CO.MIPAGO`.

## Which tags it uses

Each tax is a template tag with two subtags: `00` holds the identifier (GUI) and `01` holds the value.

| Tag | What it holds | Methods |
|---|---|---|
| `81` | VAT condition | `setVATConditionGui`, `setVATCondition` |
| `82` | VAT value | `setVATValueGui`, `setVATValue` |
| `83` | VAT base | `setVATBaseGui`, `setVATBase` |
| `84` | INC condition | `setINCConditionGui`, `setINCCondition` |
| `85` | INC value | `setINCValueGui`, `setINCValue` |

The condition is `"01"` (taxed), `"02"` (exempt) or `"03"` (excluded).

## Build the QR

This example is a restaurant bill: a subtotal of 80,000 COP, 19% VAT and 8% INC. Create `qr-impuestos.ts`:

```ts
import { EMVCoContentSemanticBuilder, type TypeConditionValue } from "@pragmasa/emvcode";

const ACQUIRER = "COM.CO.MIPAGO";
// "01" taxed, "02" exempt, "03" excluded. The cast is needed because the package doesn't export the enum.
const TAXED = "01" as TypeConditionValue;

const subtotal = 80000;
const iva = Math.round(subtotal * 0.19); // 15200
const inc = Math.round(subtotal * 0.08); // 6400
const total = subtotal + iva + inc; // 101600

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setDynamicQR()
  .setMerchantCategoryCode("5812")
  .setCurrencyISO4217("170")
  .setTransactionAmount(String(total))
  .setCountryCode("CO")
  .setMerchantName("RESTAURANTE EL SABOR")
  .setMerchantCity("MEDELLIN")
  .setVATConditionGui(`${ACQUIRER}.CIVAT`)
  .setVATCondition(TAXED)
  .setVATValueGui(`${ACQUIRER}.VAT`)
  .setVATValue(String(iva))
  .setVATBaseGui(`${ACQUIRER}.BASE`)
  .setVATBase(String(subtotal))
  .setINCConditionGui(`${ACQUIRER}.CINC`)
  .setINCCondition(TAXED)
  .setINCValueGui(`${ACQUIRER}.INC`)
  .setINCValue(String(inc))
  .build();

console.log(payload);
```

```bash
npx tsx qr-impuestos.ts
```

You should see the payload with the total in tag `54` and the five tax tags before the CRC:

```text
00020101021252045812530317054061016005802CO5920RESTAURANTE EL SABOR6008MEDELLIN81290019COM.CO.MIPAGO.CIVAT01020182300017COM.CO.MIPAGO.VAT01051520083310018COM.CO.MIPAGO.BASE01058000084280018COM.CO.MIPAGO.CINC01020185290017COM.CO.MIPAGO.INC010464006304534D
```

## If the product is exempt

Use condition `"02"` and leave the value and the base at `"0"`. If only VAT applies, leave out tags `84` and `85`.

```ts
const EXEMPT = "02" as TypeConditionValue;

builder
  .setVATConditionGui(`${ACQUIRER}.CIVAT`)
  .setVATCondition(EXEMPT)
  .setVATValueGui(`${ACQUIRER}.VAT`)
  .setVATValue("0")
  .setVATBaseGui(`${ACQUIRER}.BASE`)
  .setVATBase("0");
```

## Keep in mind

- EMVCode doesn't compute the taxes or check that the total adds up: it writes the values you give it.
- Values have no thousands separators, as in tag `54`.

## Next step

If the QR is dynamic, [sign it with the security hash](../dynamic-qr-security/).
