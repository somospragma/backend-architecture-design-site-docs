# HashCodeBuilder

Genera códigos de seguridad SHA-256 para transacciones de pago.

## Importación

```typescript
import { HashCodeBuilder } from "emvcode";
```

## Uso Básico

```typescript
const securityHash = await new HashCodeBuilder()
  .setUniqueCode("123456789")
  .setChannel("POS")
  .setTerminalId("TERM-001")
  .setTransactionId("TRX-2024-001234")
  .setTransactionAmount("50000")
  .build();

console.log(securityHash); // String de 24 caracteres Base64
```

## Métodos

### setUniqueCode(value)

Código único del comercio.

```typescript
builder.setUniqueCode("123456789");
```

### setChannel(value)

Canal de la transacción. **Requerido.**

```typescript
builder.setChannel("POS");
// Valores comunes: 'POS', 'WEB', 'APP', 'ATM'
```

### setTerminalId(value)

Identificador del terminal.

```typescript
builder.setTerminalId("TERM-001");
```

### setTransactionId(value)

Identificador de la transacción.

```typescript
builder.setTransactionId("TRX-2024-001234");
```

### setTransactionAmount(value)

Monto de la transacción.

```typescript
builder.setTransactionAmount("50000");
// También acepta number:
builder.setTransactionAmount(50000);
```

### setTimestamp(timestamp?)

Timestamp para el hash. Opcional, usa `Date.now()` por defecto.

```typescript
builder.setTimestamp(1700000000000); // Timestamp específico
builder.setTimestamp();              // Usa Date.now()
```

### setAlgorithmIdentifier(id)

Algoritmo de hash. Default: `"SHA-256"`.

```typescript
builder.setAlgorithmIdentifier("SHA-256");
// Opciones: 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'
```

### build()

Genera el hash de seguridad. **Retorna una Promise.**

**Retorna:** `Promise<string>` — Hash de 24 caracteres en Base64.

**Errores:**
- `Error` si faltan campos requeridos (uniqueCode, channel, terminalId, transactionId, transactionAmount)

```typescript
const hash = await builder.build();
```

:::info Cómo funciona
1. Concatena todos los campos: `uniqueCode + channel + terminalId + transactionId + transactionAmount + timestamp`
2. Calcula SHA-256 usando Web Crypto API
3. Codifica en Base64
4. Retorna los primeros 24 caracteres
:::

## Ejemplo Completo

```typescript
import {
  EMVCoContentSemanticBuilder,
  HashCodeBuilder,
  EMVField,
} from "emvcode";

async function generarQRConSeguridad() {
  const ACQUIRER = "COM.CO.MIPAGO";
  const merchantId = "27899526";
  const transactionId = "0000942605";
  const amount = "4343";

  const securityHash = await new HashCodeBuilder()
    .setChannel("POS")
    .setTransactionAmount(amount)
    .setTerminalId("001")
    .setTransactionId(transactionId)
    .setUniqueCode(merchantId)
    .build();

  const emv = new EMVCoContentSemanticBuilder();
  emv
    .setPayloadFormatIndicator("01")
    .setDynamicQR()
    .setMerchantAccountGUI(`${ACQUIRER}.LLA`)
    .setMerchantAccountId(merchantId, EMVField.MERCHANT_ACCOUNT_MERCHANT_ID)
    .setMerchantCategoryCode("5411")
    .setCurrencyISO4217("170")
    .setTransactionAmount(amount)
    .setCountryCode("CO")
    .setMerchantName("MI TIENDA")
    .setMerchantCity("BOGOTA")
    .setSecurityHashGui(`${ACQUIRER}.SEC`)
    .setSecurityHash(securityHash)
    .setTransactionIdGui(`${ACQUIRER}.TRXID`)
    .setTransactionId(transactionId);

  return emv.build();
}
```

## Compatibilidad

- **Node.js 16+**: Usa `globalThis.crypto.subtle`
- **Navegadores**: Usa `window.crypto.subtle` (Web Crypto API)
