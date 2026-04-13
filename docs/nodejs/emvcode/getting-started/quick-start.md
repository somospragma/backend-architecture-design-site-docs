# Inicio Rápido

¡Genera tu primer código QR de pago EMVCo en 5 minutos!

## Requisitos Previos

- Node.js 16 o superior
- npm 8+

## Paso 1: Crear un Nuevo Proyecto

```bash
mkdir mi-app-pagos
cd mi-app-pagos
npm init -y
npm install emvcode typescript ts-node
npx tsc --init
```

## Paso 2: QR Estático Simple

Crea `qr-simple.ts`:

```typescript
import { EMVCoContentSemanticBuilder } from "emvcode";

const emv = new EMVCoContentSemanticBuilder();

const qrString = emv
  .setPayloadFormatIndicator("01")
  .setStaticQR()
  .setMerchantCategoryCode("5812")   // Restaurante
  .setCurrencyISO4217("170")          // COP
  .setCountryCode("CO")
  .setMerchantName("RESTAURANTE EL BUEN SABOR")
  .setMerchantCity("MEDELLIN")
  .setPostalCode("050001")
  .build();

console.log("QR String:", qrString);
```

```bash
npx ts-node qr-simple.ts
```

Resultado: una cadena TLV con CRC calculado automáticamente. ✅

## Paso 3: QR Dinámico con Monto

Crea `qr-dinamico.ts`:

```typescript
import { EMVCoContentSemanticBuilder, EMVField } from "emvcode";

const ACQUIRER = "COM.CO.MIPAGO";
const emv = new EMVCoContentSemanticBuilder();

const qrString = emv
  .setPayloadFormatIndicator("01")
  .setDynamicQR()
  .setMerchantAccountGUI(`${ACQUIRER}.LLA`)
  .setMerchantAccountId("27899526", EMVField.MERCHANT_ACCOUNT_MERCHANT_ID)
  .setMerchantCategoryCode("5411")
  .setCurrencyISO4217("170")
  .setTransactionAmount("50000")
  .setCountryCode("CO")
  .setMerchantName("SUPERMERCADO LA ECONOMIA")
  .setMerchantCity("BOGOTA")
  .setPostalCode("110111")
  .build();

console.log("QR Dinámico:", qrString);
```

## Paso 4: Agregar Seguridad con Hash

Crea `qr-seguro.ts`:

```typescript
import {
  EMVCoContentSemanticBuilder,
  HashCodeBuilder,
  EMVField,
} from "emvcode";

async function main() {
  const ACQUIRER = "COM.CO.MIPAGO";
  const transactionId = "TRX-001234";
  const amount = "75000";

  // 1. Generar hash de seguridad
  const securityHash = await new HashCodeBuilder()
    .setUniqueCode("123456789")
    .setChannel("POS")
    .setTerminalId("TERM-001")
    .setTransactionId(transactionId)
    .setTransactionAmount(amount)
    .build();

  // 2. Construir QR con seguridad
  const emv = new EMVCoContentSemanticBuilder();

  const qrString = emv
    .setPayloadFormatIndicator("01")
    .setDynamicQR()
    .setMerchantAccountGUI(`${ACQUIRER}.LLA`)
    .setMerchantAccountId("123456789", EMVField.MERCHANT_ACCOUNT_MERCHANT_ID)
    .setMerchantCategoryCode("5411")
    .setCurrencyISO4217("170")
    .setTransactionAmount(amount)
    .setCountryCode("CO")
    .setMerchantName("MI TIENDA")
    .setMerchantCity("CALI")
    .setTransactionIdGui(`${ACQUIRER}.TRXID`)
    .setTransactionId(transactionId)
    .setSecurityHashGui(`${ACQUIRER}.SEC`)
    .setSecurityHash(securityHash)
    .build();

  console.log("QR Seguro:", qrString);
  console.log("Hash:", securityHash);
}

main();
```

## Paso 5: Generar Imagen QR (PNG)

Crea `qr-imagen.ts`:

```typescript
import {
  EMVCoContentSemanticBuilder,
  QRCodeService,
  BinaryToPng,
} from "emvcode";
import * as fs from "node:fs";

async function main() {
  // 1. Construir contenido QR
  const emv = new EMVCoContentSemanticBuilder();
  const qrString = emv
    .setPayloadFormatIndicator("01")
    .setStaticQR()
    .setMerchantCategoryCode("5411")
    .setCurrencyISO4217("170")
    .setCountryCode("CO")
    .setMerchantName("MI TIENDA")
    .setMerchantCity("BOGOTA")
    .build();

  // 2. Generar QR en Base64
  const qrBase64 = QRCodeService.createBase64({
    content: qrString,
    width: 300,
    errorCorrectionLevel: "L",
  });

  // 3. Convertir a PNG
  const trimmedBase64 = qrBase64.slice(2);
  const binaryRaw = BinaryToPng.base64ToBinary(trimmedBase64);
  const binary = binaryRaw.replaceAll(/\s+/g, "");
  const rows = Math.floor(Math.sqrt(binary.length));
  const matrixBits = binary.slice(0, rows * rows);

  const png = await BinaryToPng.binaryToPNG({
    binary: matrixBits,
    rows,
    reversed: true,
  });

  // 4. Guardar archivo
  fs.writeFileSync("mi-qr.png", Buffer.from(png));
  console.log("✅ QR guardado en mi-qr.png");
}

main();
```

## Paso 6: Validar un QR

```typescript
import { CRCService } from "emvcode";

const qrString = "00020101021152045411...6304ABCD";

const isValid = CRCService.validateCRC16(qrString);
console.log("QR válido:", isValid); // true o false
```

## Lo que has Construido

En solo 5 minutos, has aprendido a:

- ✅ Generar QR estáticos y dinámicos
- ✅ Usar el Builder Semántico con métodos descriptivos
- ✅ Agregar seguridad con hashes SHA-256
- ✅ Generar imágenes QR en PNG
- ✅ Validar integridad con CRC16

## Próximos Pasos

- [API EMVCoContentBuilder](../api/emv-builder) — Builder básico por tags
- [API EMVCoContentSemanticBuilder](../api/semantic-builder) — Builder semántico completo
- [QR con Impuestos](../guides/qr-with-taxes) — Ejemplo con IVA e INC
- [QR Dinámico con Seguridad](../guides/dynamic-qr-security) — Flujo completo de pago seguro
- [Referencia de Tags EMV](../reference/emv-tags) — Tabla completa de tags
