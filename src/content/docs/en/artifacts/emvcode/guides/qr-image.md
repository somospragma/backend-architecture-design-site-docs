---
title: How to generate the QR's PNG image
description: Turn the payload into a PNG that any QR reader can scan.
sidebar:
  order: 3
---

When you finish you'll have a `qr.png` file with the payload's QR code, ready to show or print.

## Before you start

- Do the [quick start](../../quick-start/).
- This example is for Node.js. In the browser, `QRCodeService` needs a `Buffer` polyfill; read [the FAQ](../../faq/#does-it-work-in-the-browser).

## How it works

1. `QRCodeService.createBase64` returns the QR matrix: a prefix with the size in modules per side (2 or 3 digits) and the matrix bits as Base64.
2. `BinaryToPng.base64ToBinary` turns the Base64 into a string of `0` and `1`.
3. `BinaryToPng.binaryToPNG` draws that string as a PNG.

The matrix doesn't include the light margin around the code (the *quiet zone*). Without it, most readers don't recognize the QR, so the example adds it before drawing.

## Generate the PNG

Create `qr-imagen.ts`:

```ts
import { writeFileSync } from "node:fs";
import { BinaryToPng, EMVCoContentSemanticBuilder, QRCodeService } from "@pragmasa/emvcode";

/** Splits the size prefix (2 or 3 digits) from the matrix returned by createBase64. */
function readMatrix(encoded: string) {
  for (const digits of [2, 3]) {
    const size = Number(encoded.slice(0, digits));
    const bits = BinaryToPng.base64ToBinary(encoded.slice(digits));
    if (size >= 21 && size <= 177 && (size - 17) % 4 === 0 && bits.length === Math.ceil((size * size) / 8) * 8) {
      return { size, bits: bits.slice(0, size * size) };
    }
  }
  throw new Error("Invalid QR matrix");
}

/** Adds the 4-module light margin readers need. In the matrix, "1" is a light module. */
function addQuietZone(bits: string, size: number, margin = 4) {
  const full = size + margin * 2;
  const light = "1".repeat(full);
  const rows = [];
  for (let y = 0; y < size; y++) {
    rows.push("1".repeat(margin) + bits.slice(y * size, (y + 1) * size) + "1".repeat(margin));
  }
  return { size: full, bits: light.repeat(margin) + rows.join("") + light.repeat(margin) };
}

async function main() {
  const payload = new EMVCoContentSemanticBuilder()
    .setPayloadFormatIndicator()
    .setStaticQR()
    .setMerchantCategoryCode("5411")
    .setCurrencyISO4217("170")
    .setCountryCode("CO")
    .setMerchantName("MI TIENDA")
    .setMerchantCity("BOGOTA")
    .build();

  const matrix = readMatrix(QRCodeService.createBase64({ content: payload, errorCorrectionLevel: "M" }));
  const { size, bits } = addQuietZone(matrix.bits, matrix.size);
  const png = await BinaryToPng.binaryToPNG({ binary: bits, rows: size, scale: 8, reversed: true });

  writeFileSync("qr.png", png);
  console.log(`qr.png: ${size}×${size} modules`);
}

main();
```

```bash
npx tsx qr-imagen.ts
```

You should see `qr.png: 85×85 modules` and a 680 × 680 pixel `qr.png` file. When scanned, the reader returns the full payload.

## Adjust the image

`binaryToPNG` takes these options:

| Option | Type | What it does |
|---|---|---|
| `binary` | `string` | The matrix bits, row by row. |
| `rows` | `number` | Modules per side. |
| `scale` | `number` | Pixels per module. The type requires it even though it defaults to `10`. |
| `reversed` | `boolean` | Inverts the colors. With the matrix from `createBase64`, keep it `true` so dark modules come out dark. |
| `foreground` | `[r, g, b]` | Color of the dark modules. Black by default. |
| `background` | `[r, g, b]` | Background color. White by default. |

If you change the colors, keep high contrast between them: readers fail with similar colors.

## Keep in mind

- Don't assume the size prefix has 2 digits: from 101 modules per side it has 3. `readMatrix` tries both cases.
- The `width` option of `createBase64` isn't used yet. The image size comes from `scale`.
- `createBase64(config, true)` returns the matrix without the prefix. To read it back, pass the size: `QRCodeService.decodeBase64(base64, { genericImage: true, size })`.
