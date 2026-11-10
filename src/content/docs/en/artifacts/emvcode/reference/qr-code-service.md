---
title: QR, PNG and TLV
description: QRCodeService, BinaryToPng, EMVTLVService and BinaryHexConverter.
sidebar:
  order: 5
---

```ts
import { BinaryHexConverter, BinaryToPng, EMVTLVService, QRCodeService } from "@pragmasa/emvcode";
```

## `QRCodeService`

Turns text into a QR code matrix and reads it back. It uses `Buffer`, so the browser needs a polyfill. Compatibility alias: `QrCodeImage`.

### `createBase64(config, genericImage?)`

Returns the serialized matrix: the size in modules per side (2 or 3 digits) followed by the matrix bits as Base64. It isn't an image; for the PNG, use `BinaryToPng` as in the guide [how to generate the QR image](../../guides/qr-image/).

| `config` field | Type | What it does |
|---|---|---|
| `content` | `string` | The QR text. Required. |
| `errorCorrectionLevel` | `string` | `"L"` (7%), `"M"` (15%), `"Q"` (25%) or `"H"` (30%). Without it, the library picks one based on the content. |
| `version` | `number` | QR version, from `1` to `40`. Without it, it's picked based on the content. |
| `width` | `number` | Not used in `1.1.1`. |

With `genericImage` set to `true`, it returns only the Base64, without the size prefix.

### `decodeBase64(input, config?)`

Reads a matrix from `createBase64` and returns the text. If the matrix has no prefix, pass `{ genericImage: true, size }`; without `size`, it throws `QR size is required when decoding generic base64`.

## `BinaryToPng`

| Method | Returns | What it does |
|---|---|---|
| `BinaryToPng.base64ToBinary(base64)` | `string` | Turns Base64 into a string of `0` and `1`. |
| `BinaryToPng.binaryToPNG(options)` | `Promise<Uint8Array>` | Draws the matrix as a PNG. Works on Node.js and in browsers with `CompressionStream`. |

`binaryToPNG` options:

| Option | Type | Default | What it does |
|---|---|---|---|
| `binary` | `string` | — | The matrix bits, row by row. If there are fewer than `rows × rows`, throws `Insufficient binary`. |
| `rows` | `number` | — | Modules per side. |
| `scale` | `number` | `10` | Pixels per module. The type requires it even though it has a default. |
| `reversed` | `boolean` | `false` | Inverts the colors. With the matrix from `createBase64`, use `true`. |
| `foreground` | `[number, number, number]` | `[0, 0, 0]` | Color of the dark modules. |
| `background` | `[number, number, number]` | `[255, 255, 255]` | Background color. |

The image doesn't include the light margin readers need. The [image guide](../../guides/qr-image/) shows how to add it.

## `EMVTLVService`

Splits a payload into its TLV fields and puts it back together. It doesn't validate types, maximum lengths or the CRC.

| Method | Returns | What it does |
|---|---|---|
| `EMVTLVService.parse(input)` | `TLVNode[]` | Each node has `tag`, `length` and `value`, or `subtags` if the value can be read as TLV. Throws if a length doesn't match. |
| `EMVTLVService.stringify(nodes)` | `string` | Builds the text back from the nodes. |
| `EMVTLVService.parseBase64(input, config?)` | `TLVNode[]` | Decodes the matrix from `createBase64` and splits it into nodes. |
| `EMVTLVService.toBase64(input, config?, genericImage?)` | `string` | Same as `createBase64`, from a text or from nodes. |

A simple value that happens to look like TLV comes back as `subtags`. Check the tag's type in the [registry](../emv-tags/) before using the result.

```ts
import { EMVTLVService } from "@pragmasa/emvcode";

const received =
  "00020101021226330017COM.CO.MIPAGO.LLA0508278995265204541153031705405500005802CO5924SUPERMERCADO LA ECONOMIA6006BOGOTA63042EAC";

for (const node of EMVTLVService.parse(received)) {
  console.log(node.tag, node.value ?? node.subtags);
}
```

```text
00 01
01 12
26 [
  { tag: '00', length: 17, value: 'COM.CO.MIPAGO.LLA' },
  { tag: '05', length: 8, value: '27899526' }
]
52 5411
53 170
54 50000
58 CO
59 SUPERMERCADO LA ECONOMIA
60 BOGOTA
63 2EAC
```

## `BinaryHexConverter`

| Method | Returns | What it does |
|---|---|---|
| `BinaryHexConverter.hexToBinary(hex)` | `string` | `"A1"` → `"10100001"`. Throws `Invalid hexadecimal string` with non-hexadecimal characters. |
| `BinaryHexConverter.binaryToHex(binary)` | `string` | `"10100001"` → `"a1"`, lowercase. Throws `Invalid binary string` with characters other than `0` and `1`. |
