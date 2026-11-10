---
title: Introduction
description: What EMVCode is, when to use it and when not to.
sidebar:
  order: 1
---

EMVCode builds the content of EMVCo payment QR codes so you don't have to serialize the fields, sort them or compute the CRC by hand. It is a TypeScript library for Node.js; the package is `@pragmasa/emvcode` and these docs cover version `1.1.1`.

## What an EMVCo QR looks like inside

An EMVCo payment QR is a text string made of TLV (*tag-length-value*) fields: two digits of tag, two of length and the value.

```text
59 09 MI TIENDA
── ── ─────────
tag  │  value (merchant name)
     length: 9 characters
```

*Template* tags (26 to 51, 62, 64 and 80 to 99) hold other TLV fields inside, called subtags. The last field is always `63`, with the CRC16 of everything before it.

## When to use it

- You generate payment, collection or transfer QR codes that must follow EMVCo.
- You need the Colombian proprietary tags: channel, VAT, INC, transaction identifier and security hash.
- You want the payload, its CRC check and its QR image from a single dependency.

## When not to

- You need to validate a received payload field by field: `EMVTLVService` splits it into TLV, but it doesn't check types, lengths or required fields.
- Your project is native ESM and you can't use the default import. Read [the FAQ](./faq/#can-i-use-it-in-an-esm-project).
- You need to generate the image in the browser without polyfills: `QRCodeService` uses `Buffer`.

## What it includes

| Piece | What for |
|---|---|
| `EMVCoContentSemanticBuilder` | Builds the payload with named methods: `setMerchantName`, `setVATValue`… The recommended one. |
| `EMVCoContentBuilder` | Builds the payload by tag and subtag number, for fields the semantic builder doesn't cover. |
| `HashCodeBuilder` | Generates the transaction's security code (SHA-256 by default) that goes in tag `91`. |
| `CRCService` | Computes and validates the CRC16-CCITT. The builders add it on their own. |
| `QRCodeService` | Turns the payload into a QR matrix serialized as Base64, and decodes it. |
| `BinaryToPng` | Turns that matrix into a PNG image. |
| `EMVTLVService` | Splits a payload into its TLV fields and puts it back together. |
| `EMVTagRegistry` and `EMVField` | The EMVCo tag registry with each tag's type and length, and the name of each field. |

## How it is organized

The library has three layers. The application layer holds the two builders. The domain layer holds the tag registry and the EMV fields, the CRC and the hash, and the QR and PNG generation. The shared layer holds the binary and hexadecimal conversions. You only need what the package exports; the layers aren't imported separately.

## Next step

Follow the [quick start](./quick-start/) to generate your first QR in a few minutes.
