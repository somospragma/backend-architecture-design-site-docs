---
title: HashCodeBuilder
description: Opciones del generador del código de seguridad de la transacción.
sidebar:
  order: 3
---

```ts
import { HashCodeBuilder } from "@pragmasa/emvcode";
```

Genera el código de seguridad que va en el subtag `91.01`. Concatena código único, canal, terminal, transacción, monto y timestamp, en ese orden; calcula el digest, lo codifica en Base64 y devuelve los primeros 24 caracteres. Usa la Web Crypto API (`window.crypto.subtle` o `globalThis.crypto.subtle`).

## Métodos

| Método | Devuelve | Qué hace |
|---|---|---|
| `setUniqueCode(value: string)` | el builder | Código único del comercio. Si es vacío, usa `"0"`. |
| `setChannel(value: string)` | el builder | Canal: `POS`, `APP`, `WEB`… Si es vacío, lanza `Channel is required.` |
| `setTerminalId(value: string)` | el builder | Terminal. Si es vacío, usa `"0"`. |
| `setTransactionId(value: string)` | el builder | Identificador de la transacción. Si es vacío, usa `"0"`. |
| `setTransactionAmount(value: string \| number)` | el builder | Monto. Si no es mayor que cero, usa `"0"`. |
| `setTimestamp(timestamp?: number)` | el builder | Milisegundos desde 1970. Sin argumento, usa `Date.now()`. Si no lo llamas, vale el momento en que creaste el builder. |
| `setAlgorithmIdentifier(id)` | `void` | `"SHA-1"`, `"SHA-256"` (por defecto), `"SHA-384"` o `"SHA-512"`. No se puede encadenar. |
| `build()` | `Promise<string>` | El código de 24 caracteres. Lanza `All fields are required.` si falta alguno de los cinco primeros métodos. Lanza `Web Crypto API is not available in this environment` si no hay Web Crypto. |

## Ejemplo

```ts
import { HashCodeBuilder } from "@pragmasa/emvcode";

async function main() {
  const securityHash = await new HashCodeBuilder()
    .setUniqueCode("27899526")
    .setChannel("POS")
    .setTerminalId("CAJA-01")
    .setTransactionId("TRX-1001")
    .setTransactionAmount("75000")
    .setTimestamp(1735689600000)
    .build();

  console.log(securityHash);
}

main();
```

```text
ML+bdr9ZYbuu3MwiUOAMGemB
```

Con los mismos datos y el mismo timestamp, el resultado es siempre el mismo. Para el flujo completo, lee [cómo firmar un QR dinámico](../../guides/dynamic-qr-security/).
