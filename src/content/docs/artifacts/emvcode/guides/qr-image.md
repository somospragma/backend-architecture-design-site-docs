---
title: Cómo generar la imagen PNG del QR
description: Convierte el payload en un PNG que cualquier lector de QR pueda escanear.
sidebar:
  order: 3
---

Al terminar tendrás un archivo `qr.png` con el código QR del payload, listo para mostrar o imprimir.

## Antes de empezar

- Haz el [inicio rápido](../../quick-start/).
- Este ejemplo es para Node.js. En el navegador, `QRCodeService` necesita un polyfill de `Buffer`; lee [las preguntas frecuentes](../../faq/#funciona-en-el-navegador).

## Cómo funciona

1. `QRCodeService.createBase64` devuelve la matriz del QR: un prefijo con el tamaño en módulos por lado (2 o 3 dígitos) y los bits de la matriz en Base64.
2. `BinaryToPng.base64ToBinary` convierte el Base64 en una cadena de `0` y `1`.
3. `BinaryToPng.binaryToPNG` dibuja esa cadena como PNG.

La matriz no trae el margen claro alrededor del código (la *quiet zone*). Sin él, la mayoría de lectores no reconoce el QR, así que el ejemplo lo agrega antes de dibujar.

## Genera el PNG

Crea `qr-imagen.ts`:

```ts
import { writeFileSync } from "node:fs";
import { BinaryToPng, EMVCoContentSemanticBuilder, QRCodeService } from "@pragmasa/emvcode";

/** Separa el prefijo de tamaño (2 o 3 dígitos) de la matriz que devuelve createBase64. */
function readMatrix(encoded: string) {
  for (const digits of [2, 3]) {
    const size = Number(encoded.slice(0, digits));
    const bits = BinaryToPng.base64ToBinary(encoded.slice(digits));
    if (size >= 21 && size <= 177 && (size - 17) % 4 === 0 && bits.length === Math.ceil((size * size) / 8) * 8) {
      return { size, bits: bits.slice(0, size * size) };
    }
  }
  throw new Error("La matriz QR no es válida");
}

/** Agrega el margen claro de 4 módulos que los lectores necesitan. En la matriz, "1" es un módulo claro. */
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
  console.log(`qr.png: ${size}×${size} módulos`);
}

main();
```

```bash
npx tsx qr-imagen.ts
```

Debes ver `qr.png: 85×85 módulos` y un archivo `qr.png` de 680 × 680 píxeles. Al escanearlo, el lector devuelve el payload completo.

## Ajusta la imagen

`binaryToPNG` recibe estas opciones:

| Opción | Tipo | Qué hace |
|---|---|---|
| `binary` | `string` | Los bits de la matriz, fila por fila. |
| `rows` | `number` | Módulos por lado. |
| `scale` | `number` | Píxeles por módulo. El tipo la pide aunque tiene `10` por defecto. |
| `reversed` | `boolean` | Invierte los colores. Con la matriz de `createBase64`, déjalo en `true` para que los módulos oscuros salgan oscuros. |
| `foreground` | `[r, g, b]` | Color de los módulos oscuros. Por defecto, negro. |
| `background` | `[r, g, b]` | Color del fondo. Por defecto, blanco. |

Si cambias los colores, mantén un contraste alto entre los dos: los lectores fallan con colores parecidos.

## Ten en cuenta

- No asumas que el prefijo de tamaño tiene 2 dígitos: desde 101 módulos por lado tiene 3. `readMatrix` prueba los dos casos.
- La opción `width` de `createBase64` no se usa todavía. El tamaño de la imagen lo da `scale`.
- `createBase64(config, true)` devuelve la matriz sin prefijo. Para leerla de vuelta, pasa el tamaño: `QRCodeService.decodeBase64(base64, { genericImage: true, size })`.
