---
title: FAQ
description: Answers to the most common questions about EMVCode.
sidebar:
  order: 90
---

## Can I use it in an ESM project?

Yes, with the default import. The package is CommonJS and its published code is obfuscated, so Node.js can't detect the named exports: in a project with `"type": "module"` or in an `.mjs` file, `import { CRCService } from "@pragmasa/emvcode"` fails with `Named export 'CRCService' not found`.

```ts
import emvcode from "@pragmasa/emvcode";

const { CRCService, EMVCoContentSemanticBuilder } = emvcode;
```

In CommonJS projects, in TypeScript that compiles to CommonJS and with `tsx`, named imports work.

## Does it work in the browser?

Partly. The builders, `CRCService` and `HashCodeBuilder` work if Web Crypto is available. `BinaryToPng` works in browsers with `CompressionStream`. `QRCodeService` uses `Buffer`, which browsers don't have: you need a polyfill or a bundler that adds it.

## Why can't the hash be verified?

Because the timestamp goes into the hash but doesn't travel in the QR. Store the timestamp you used together with the transaction and compute the hash again with the same data. Read [how to sign a dynamic QR](../guides/dynamic-qr-security/).

## Why doesn't my QR scan?

Most often the image has no light margin around it. `BinaryToPng` only draws the matrix; add the margin as in the guide [how to generate the QR image](../guides/qr-image/).

## `build()` didn't complain and the QR has no merchant. Why?

`build()` doesn't check required fields. Check your code against the **Required** column of the [tag reference](../reference/emv-tags/).

## Why can't I read the library's code in `node_modules`?

The library's build obfuscates the JavaScript before publishing it. The types (`.d.ts`) are readable, and the source code is in the [repository](https://github.com/somospragma/backend-architecture-desing-ts-emvco-qr), under the Apache-2.0 license.

## What known issues does version 1.1.1 have?

- `setAdditionalChannelOrigin` writes to the tax ID subtag (`62.10`) instead of `62.11`.
- The methods for tags `92` and `94` to `98` always throw an error.
- The package doesn't export the condition enum (`"01"`, `"02"`, `"03"`), so TypeScript needs a cast.

Each one has a workaround; it's in the [semantic builder reference](../reference/semantic-builder/).
