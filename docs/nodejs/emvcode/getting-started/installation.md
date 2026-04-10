# Instalación

## Requisitos Previos

- **Node.js 16** o superior
- **npm 8+** o **pnpm** o **yarn**
- **TypeScript 5.0+** (opcional, pero recomendado)

## Instalar el Paquete

```bash
npm install emvcode
```

O con otros gestores de paquetes:

```bash
# pnpm
pnpm add emvcode

# yarn
yarn add emvcode
```

## Configuración TypeScript (Recomendado)

Si usas TypeScript, asegúrate de tener estas opciones en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020", "DOM"],
    "esModuleInterop": true,
    "strict": true
  }
}
```

:::info Nota sobre `lib`
La opción `"DOM"` es necesaria para que TypeScript reconozca la Web Crypto API (`SubtleCrypto`, `TextEncoder`). Si estás en un entorno Node.js puro, esto no afecta el runtime.
:::

## Verificar la Instalación

Crea un archivo de prueba:

```typescript
import { EMVCoContentSemanticBuilder } from "emvcode";

const emv = new EMVCoContentSemanticBuilder();

const qr = emv
  .setPayloadFormatIndicator("01")
  .setStaticQR()
  .setMerchantCategoryCode("5411")
  .setCurrencyISO4217("170")
  .setCountryCode("CO")
  .setMerchantName("TEST")
  .setMerchantCity("BOGOTA")
  .build();

console.log("QR generado:", qr);
```

Ejecuta:

```bash
npx ts-node test.ts
# o con Node.js puro
node -e "const e = require('emvcode'); console.log('EMVCode OK:', Object.keys(e))"
```

Deberías ver la cadena QR generada con formato TLV y CRC al final.

## Uso con JavaScript (CommonJS)

```javascript
const { EMVCoContentBuilder } = require("emvcode");

const emv = new EMVCoContentBuilder();
emv.setTag("00", "01");
emv.setTag("58", "CO");
console.log(emv.build());
```

## Uso en Navegador

EMVCode es compatible con navegadores modernos que soporten Web Crypto API:

```html
<script type="module">
  import { EMVCoContentSemanticBuilder } from "./node_modules/emvcode/dist/index.js";

  const emv = new EMVCoContentSemanticBuilder();
  // ... construir QR
</script>
```

## Próximos Pasos

- [Guía de Inicio Rápido](quick-start) — Genera tu primer QR de pago
- [API Reference](../api/emv-builder) — Documentación completa de la API
