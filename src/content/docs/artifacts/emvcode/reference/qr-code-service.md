---
title: QR, PNG y TLV
description: QRCodeService, BinaryToPng, EMVTLVService y BinaryHexConverter.
sidebar:
  order: 5
---

```ts
import { BinaryHexConverter, BinaryToPng, EMVTLVService, QRCodeService } from "@pragmasa/emvcode";
```

## `QRCodeService`

Convierte texto en la matriz de un código QR y la lee de vuelta. Usa `Buffer`, así que en el navegador necesita un polyfill. Alias por compatibilidad: `QrCodeImage`.

### `createBase64(config, genericImage?)`

Devuelve la matriz serializada: el tamaño en módulos por lado (2 o 3 dígitos) seguido de los bits de la matriz en Base64. No es una imagen; para el PNG, usa `BinaryToPng` como en la guía [cómo generar la imagen del QR](../../guides/qr-image/).

| Campo de `config` | Tipo | Qué hace |
|---|---|---|
| `content` | `string` | El texto del QR. Obligatorio. |
| `errorCorrectionLevel` | `string` | `"L"` (7 %), `"M"` (15 %), `"Q"` (25 %) o `"H"` (30 %). Sin él, la librería elige uno según el contenido. |
| `version` | `number` | Versión del QR, de `1` a `40`. Sin ella, se elige según el contenido. |
| `width` | `number` | No se usa en `1.1.1`. |

Con `genericImage` en `true`, devuelve solo el Base64, sin el prefijo de tamaño.

### `decodeBase64(input, config?)`

Lee una matriz de `createBase64` y devuelve el texto. Si la matriz no tiene prefijo, pasa `{ genericImage: true, size }`; sin `size`, lanza `QR size is required when decoding generic base64`.

## `BinaryToPng`

| Método | Devuelve | Qué hace |
|---|---|---|
| `BinaryToPng.base64ToBinary(base64)` | `string` | Convierte Base64 en una cadena de `0` y `1`. |
| `BinaryToPng.binaryToPNG(options)` | `Promise<Uint8Array>` | Dibuja la matriz como PNG. Funciona en Node.js y en navegadores con `CompressionStream`. |

Opciones de `binaryToPNG`:

| Opción | Tipo | Por defecto | Qué hace |
|---|---|---|---|
| `binary` | `string` | — | Los bits de la matriz, fila por fila. Si hay menos de `rows × rows`, lanza `Insufficient binary`. |
| `rows` | `number` | — | Módulos por lado. |
| `scale` | `number` | `10` | Píxeles por módulo. El tipo lo exige aunque tiene valor por defecto. |
| `reversed` | `boolean` | `false` | Invierte los colores. Con la matriz de `createBase64`, usa `true`. |
| `foreground` | `[number, number, number]` | `[0, 0, 0]` | Color de los módulos oscuros. |
| `background` | `[number, number, number]` | `[255, 255, 255]` | Color del fondo. |

La imagen no incluye el margen claro que necesitan los lectores. La [guía de la imagen](../../guides/qr-image/) muestra cómo agregarlo.

## `EMVTLVService`

Separa un payload en sus campos TLV y lo vuelve a armar. No valida tipos, longitudes máximas ni el CRC.

| Método | Devuelve | Qué hace |
|---|---|---|
| `EMVTLVService.parse(input)` | `TLVNode[]` | Cada nodo tiene `tag`, `length` y `value`, o `subtags` si el valor se puede leer como TLV. Lanza un error si una longitud no cuadra. |
| `EMVTLVService.stringify(nodes)` | `string` | Vuelve a armar el texto a partir de los nodos. |
| `EMVTLVService.parseBase64(input, config?)` | `TLVNode[]` | Decodifica la matriz de `createBase64` y la separa en nodos. |
| `EMVTLVService.toBase64(input, config?, genericImage?)` | `string` | Igual que `createBase64`, a partir de un texto o de nodos. |

Un valor simple que por casualidad tiene forma de TLV se devuelve como `subtags`. Revisa el tipo del tag en el [registro](../emv-tags/) antes de usar el resultado.

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

| Método | Devuelve | Qué hace |
|---|---|---|
| `BinaryHexConverter.hexToBinary(hex)` | `string` | `"A1"` → `"10100001"`. Lanza `Invalid hexadecimal string` con caracteres no hexadecimales. |
| `BinaryHexConverter.binaryToHex(binary)` | `string` | `"10100001"` → `"a1"`, en minúsculas. Lanza `Invalid binary string` con caracteres distintos de `0` y `1`. |
