---
title: HashCodeBuilder
description: Options of the transaction security code generator.
sidebar:
  order: 3
---

```ts
import { HashCodeBuilder } from "@pragmasa/emvcode";
```

Generates the security code that goes in subtag `91.01`. It concatenates unique code, channel, terminal, transaction, amount and timestamp, in that order; computes the digest, encodes it as Base64 and returns the first 24 characters. It uses the Web Crypto API (`window.crypto.subtle` or `globalThis.crypto.subtle`).

## Methods

| Method | Returns | What it does |
|---|---|---|
| `setUniqueCode(value: string)` | the builder | Merchant's unique code. If empty, uses `"0"`. |
| `setChannel(value: string)` | the builder | Channel: `POS`, `APP`, `WEB`… If empty, throws `Channel is required.` |
| `setTerminalId(value: string)` | the builder | Terminal. If empty, uses `"0"`. |
| `setTransactionId(value: string)` | the builder | Transaction identifier. If empty, uses `"0"`. |
| `setTransactionAmount(value: string \| number)` | the builder | Amount. If it isn't greater than zero, uses `"0"`. |
| `setTimestamp(timestamp?: number)` | the builder | Milliseconds since 1970. Without an argument, uses `Date.now()`. If you don't call it, it's the moment you created the builder. |
| `setAlgorithmIdentifier(id)` | `void` | `"SHA-1"`, `"SHA-256"` (default), `"SHA-384"` or `"SHA-512"`. Can't be chained. |
| `build()` | `Promise<string>` | The 24-character code. Throws `All fields are required.` if one of the first five methods is missing. Throws `Web Crypto API is not available in this environment` if there's no Web Crypto. |

## Example

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

With the same data and the same timestamp, the result is always the same. For the full flow, read [how to sign a dynamic QR](../../guides/dynamic-qr-security/).
