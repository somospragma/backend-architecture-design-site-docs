# QRCodeService y BinaryToPng

Servicios para generar imágenes QR en Base64 y convertirlas a PNG.

## Importación

```typescript
import { QRCodeService, BinaryToPng } from "emvcode";
```

## QRCodeService

### createBase64(config)

Genera un QR en formato Base64 comprimido.

**Parámetros:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `content` | `string` | ✅ | Contenido del QR (string EMVCo) |
| `width` | `number` | ✅ | Ancho del QR en píxeles |
| `errorCorrectionLevel` | `string` | ❌ | Nivel de corrección: `'L'`, `'M'`, `'Q'`, `'H'` |
| `version` | `number` | ❌ | Versión del QR (1-40). Auto-detectado si no se especifica |

**Retorna:** `string` — Base64 del QR con el tamaño de la matriz como prefijo (2 primeros caracteres).

```typescript
const qrBase64 = QRCodeService.createBase64({
  content: qrString,
  width: 300,
  errorCorrectionLevel: "L",
});
```

**Niveles de corrección de errores:**

| Nivel | Recuperación | Uso recomendado |
|-------|-------------|-----------------|
| `L` | 7% | QR limpios, pantallas digitales |
| `M` | 15% | Uso general |
| `Q` | 25% | QR impresos |
| `H` | 30% | QR con logo superpuesto |

:::info Versión automática
Si no especificas `version`, el servicio selecciona automáticamente la versión óptima basándose en la longitud del contenido y el nivel de corrección de errores.
:::

## BinaryToPng

### base64ToBinary(base64)

Convierte un string Base64 a su representación binaria.

```typescript
const binaryRaw = BinaryToPng.base64ToBinary(base64String);
```

### binaryToPNG(config)

Convierte una cadena binaria a una imagen PNG. **Retorna una Promise.**

**Parámetros:**

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `binary` | `string` | Cadena de bits (`"0"` y `"1"`) |
| `rows` | `number` | Número de filas de la matriz |
| `reversed` | `boolean` | Si `true`, invierte los colores (negro ↔ blanco) |

**Retorna:** `Promise<Uint8Array>` — Bytes de la imagen PNG.

## Flujo Completo: QR String → PNG

```typescript
import {
  EMVCoContentSemanticBuilder,
  QRCodeService,
  BinaryToPng,
} from "emvcode";
import * as fs from "node:fs";

async function generarPNG() {
  // 1. Construir contenido EMVCo
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

  // 2. Generar QR Base64
  const qrBase64 = QRCodeService.createBase64({
    content: qrString,
    width: 300,
    errorCorrectionLevel: "L",
  });

  // 3. Convertir a PNG
  const trimmedBase64 = qrBase64.slice(2); // Remover prefijo de tamaño
  const binaryRaw = BinaryToPng.base64ToBinary(trimmedBase64);
  const binary = binaryRaw.replaceAll(/\s+/g, "");

  const rows = Math.floor(Math.sqrt(binary.length));
  const matrixBits = binary.slice(0, rows * rows);

  const png = await BinaryToPng.binaryToPNG({
    binary: matrixBits,
    rows,
    reversed: true,
  });

  // 4. Guardar (Node.js)
  fs.writeFileSync("qr.png", Buffer.from(png));

  // 4. Mostrar (Navegador)
  // const blob = new Blob([png], { type: "image/png" });
  // img.src = URL.createObjectURL(blob);
}
```

## Aliases (Compatibilidad)

```typescript
import { QrCodeImage } from "emvcode"; // Alias de QRCodeService
```
