---
title: Inicio rápido
description: Instala EMVCode y genera tu primer QR de pago EMVCo en menos de 10 minutos.
sidebar:
  order: 2
---

## Requisitos

- Node.js `16.0.0` o superior.
- Un proyecto CommonJS, o TypeScript que compile a CommonJS. Si tu proyecto es ESM nativo, lee [cómo usarla en ESM](../faq/#puedo-usarla-en-un-proyecto-esm).

## 1. Instala

```bash
npm install @pragmasa/emvcode
npm install --save-dev typescript tsx @types/node
```

Si usas TypeScript, incluye `DOM` en `lib` de tu `tsconfig.json`. `HashCodeBuilder` usa la Web Crypto API y sus tipos vienen de ahí; en Node.js no cambia nada en tiempo de ejecución.

```json
{
  "compilerOptions": {
    "lib": ["ES2020", "DOM"],
    "esModuleInterop": true,
    "strict": true
  }
}
```

## 2. Genera un QR estático

Un QR estático no lleva monto: sirve para muchos pagos. Crea `qr-estatico.ts`:

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
console.log("CRC válido:", CRCService.validateCRC16(payload));
```

```bash
npx tsx qr-estatico.ts
```

Debes ver el payload, que termina en el tag `63` con su CRC, y la validación:

```text
0002010102115204581253031705802CO5925RESTAURANTE EL BUEN SABOR6008MEDELLIN61060500016304E8EA
CRC válido: true
```

`build()` ordena los campos por tag, agrega el CRC y deja el builder vacío para el siguiente QR.

## 3. Genera un QR dinámico con monto

Un QR dinámico es para un solo pago y lleva el monto. Crea `qr-dinamico.ts`:

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

El `010212` del inicio marca el QR como dinámico, y `26…` es la cuenta del comercio con sus dos subtags.

## 4. Conviértelo en un QR

`QRCodeService.createBase64` convierte el payload en la matriz del QR, serializada en Base64 con su tamaño adelante. Crea `qr-ida-vuelta.ts` para comprobar que la matriz se lee de vuelta:

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

`77` es el tamaño de la matriz en módulos por lado. La matriz todavía no es una imagen: para obtener el PNG, sigue la guía [cómo generar la imagen del QR](../guides/qr-image/).

## Siguientes pasos

- [Cómo agregar IVA e INC al QR](../guides/qr-with-taxes/).
- [Cómo firmar un QR dinámico con el hash de seguridad](../guides/dynamic-qr-security/).
- [Todos los métodos del builder semántico](../reference/semantic-builder/).
