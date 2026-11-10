---
title: Quick start
description: Install EMVCode and generate your first EMVCo payment QR in under 10 minutes.
sidebar:
  order: 2
---

## Requirements

- Node.js `16.0.0` or later.
- A CommonJS project, or TypeScript that compiles to CommonJS. If your project is native ESM, read [how to use it with ESM](../faq/#can-i-use-it-in-an-esm-project).

## 1. Install

```bash
npm install @pragmasa/emvcode
npm install --save-dev typescript tsx @types/node
```

If you use TypeScript, include `DOM` in the `lib` of your `tsconfig.json`. `HashCodeBuilder` uses the Web Crypto API and its types come from there; on Node.js nothing changes at runtime.

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"],
    "esModuleInterop": true,
    "strict": true
  }
}
```

## 2. Generate a static QR

A static QR has no amount: it works for many payments. Create `qr-estatico.ts`:

```ts
import { CRCService, EMVCoContentSemanticBuilder } from "@pragmasa/emvcode";

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setStaticQR()
  .setMerchantCategoryCode("5812")
  .setCurrencyISO4217("170")
  .setCountryCode("CO")
  .setMerchantName("RESTAURANTE EL BUEN SABOR")
  .setMerchantCity("MEDELLIN")
  .setPostalCode("050001")
  .build();

console.log(payload);
console.log("Valid CRC:", CRCService.validateCRC16(payload));
```

```bash
npx tsx qr-estatico.ts
```

You should see the payload, ending in tag `63` with its CRC, and the check:

```text
0002010102115204581253031705802CO5925RESTAURANTE EL BUEN SABOR6008MEDELLIN61060500016304E8EA
Valid CRC: true
```

`build()` sorts the fields by tag, adds the CRC and empties the builder for the next QR.

## 3. Generate a dynamic QR with an amount

A dynamic QR is for a single payment and carries the amount. Create `qr-dinamico.ts`:

```ts
import { EMVCoContentSemanticBuilder, EMVField } from "@pragmasa/emvcode";

const ACQUIRER = "COM.CO.MIPAGO";

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setDynamicQR()
  .setMerchantAccountGUI(`${ACQUIRER}.LLA`)
  .setMerchantAccountId("27899526", EMVField.MERCHANT_ACCOUNT_MERCHANT_ID)
  .setMerchantCategoryCode("5411")
  .setCurrencyISO4217("170")
  .setTransactionAmount("50000")
  .setCountryCode("CO")
  .setMerchantName("SUPERMERCADO LA ECONOMIA")
  .setMerchantCity("BOGOTA")
  .build();

console.log(payload);
```

```bash
npx tsx qr-dinamico.ts
```

```text
00020101021226330017COM.CO.MIPAGO.LLA0508278995265204541153031705405500005802CO5924SUPERMERCADO LA ECONOMIA6006BOGOTA63042EAC
```

The `010212` at the start marks the QR as dynamic, and `26…` is the merchant account with its two subtags.

## 4. Turn it into a QR

`QRCodeService.createBase64` turns the payload into the QR matrix, serialized as Base64 with its size in front. Create `qr-ida-vuelta.ts` to check that the matrix reads back:

```ts
import { EMVCoContentSemanticBuilder, QRCodeService } from "@pragmasa/emvcode";

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setStaticQR()
  .setMerchantCategoryCode("5411")
  .setCurrencyISO4217("170")
  .setCountryCode("CO")
  .setMerchantName("MI TIENDA")
  .setMerchantCity("BOGOTA")
  .build();

const encoded = QRCodeService.createBase64({ content: payload, errorCorrectionLevel: "M" });

console.log(encoded.slice(0, 2));
console.log(QRCodeService.decodeBase64(encoded) === payload);
```

```bash
npx tsx qr-ida-vuelta.ts
```

```text
77
true
```

`77` is the matrix size in modules per side. The matrix isn't an image yet: to get the PNG, follow the guide [how to generate the QR image](../guides/qr-image/).

## Next steps

- [How to add VAT and INC to the QR](../guides/qr-with-taxes/).
- [How to sign a dynamic QR with the security hash](../guides/dynamic-qr-security/).
- [Every method of the semantic builder](../reference/semantic-builder/).
