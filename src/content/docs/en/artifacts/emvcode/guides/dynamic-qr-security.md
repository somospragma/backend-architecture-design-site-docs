---
title: How to sign a dynamic QR with the security hash
description: Generate a transaction's security code and add it to the QR with its identifier.
sidebar:
  order: 2
---

When you finish you'll have a dynamic QR with the transaction identifier (tag `90`) and its security code (tag `91`), which lets you check that the payment wasn't altered.

## Before you start

- Do the [quick start](../../quick-start/).
- Node.js needs the Web Crypto API (`globalThis.crypto.subtle`), available since Node.js `16`.

## How it works

1. `HashCodeBuilder` concatenates the merchant's unique code, the channel, the terminal, the transaction identifier, the amount and a timestamp.
2. It computes the digest with SHA-256 (or the algorithm you set), encodes it as Base64 and keeps the first 24 characters.
3. The semantic builder puts that code in tag `91` and the transaction identifier in tag `90`.

The timestamp goes into the hash but doesn't travel in the QR. Store it with the transaction: without it, nobody can compute the hash again to verify it.

## Build the QR

Create `qr-seguro.ts`:

```ts
import { EMVCoContentSemanticBuilder, EMVField, HashCodeBuilder } from "@pragmasa/emvcode";

const ACQUIRER = "COM.CO.MIPAGO";

async function main() {
  const merchantId = "27899526";
  const transactionId = "TRX-1001";
  const amount = "75000";
  const timestamp = Date.now(); // store it with the transaction: without it the hash can't be computed again

  const securityHash = await new HashCodeBuilder()
    .setUniqueCode(merchantId)
    .setChannel("POS")
    .setTerminalId("CAJA-01")
    .setTransactionId(transactionId)
    .setTransactionAmount(amount)
    .setTimestamp(timestamp)
    .build();

  const payload = new EMVCoContentSemanticBuilder()
    .setPayloadFormatIndicator()
    .setDynamicQR()
    .setMerchantAccountGUI(`${ACQUIRER}.LLA`)
    .setMerchantAccountId(merchantId, EMVField.MERCHANT_ACCOUNT_MERCHANT_ID)
    .setMerchantCategoryCode("5411")
    .setCurrencyISO4217("170")
    .setTransactionAmount(amount)
    .setCountryCode("CO")
    .setMerchantName("SUPERMERCADO LA ECONOMIA")
    .setMerchantCity("CALI")
    .setChannelGui(`${ACQUIRER}.CHANNEL`)
    .setChannel("POS")
    .setAdditionalTerminalLabel("CAJA-01")
    .setTransactionIdGui(`${ACQUIRER}.TRXID`)
    .setTransactionId(transactionId)
    .setSecurityHashGui(`${ACQUIRER}.SEC`)
    .setSecurityHash(securityHash)
    .build();

  console.log({ payload, transactionId, timestamp, securityHash });
}

main();
```

```bash
npx tsx qr-seguro.ts
```

You should see an object with the payload, the identifier, the timestamp and a 24-character hash. The hash and the CRC change on every run because the timestamp changes. For example:

```text
{
  payload: '00020101021226330017COM.CO.MIPAGO.LLA0508278995265204541153031705405750005802CO5924SUPERMERCADO LA ECONOMIA6004CALI62110707CAJA-0180320021COM.CO.MIPAGO.CHANNEL0103POS90350019COM.CO.MIPAGO.TRXID0108TRX-100191490017COM.CO.MIPAGO.SEC0124v8oGu4VJJJcLBWTS07vd8Hcl6304DAEA',
  transactionId: 'TRX-1001',
  timestamp: 1794295369122,
  securityHash: 'v8oGu4VJJJcLBWTS07vd8Hcl'
}
```

## Verify the hash

To verify a payment, compute the hash again with the same data and the timestamp you stored, and compare it with subtag `01` of tag `91`. With the same data, the result is always the same.

## Keep in mind

- `setChannel` throws if it gets an empty value. `setUniqueCode`, `setTerminalId` and `setTransactionId` use `"0"` if the value is empty, and `setTransactionAmount` uses `"0"` if the amount isn't greater than zero.
- `build()` throws `All fields are required.` if you didn't call one of those five methods.
- To use another algorithm, call `setAlgorithmIdentifier("SHA-384")` on its own line, before `build()`: it doesn't return the builder, so it can't be chained.

## Next step

[Generate the QR's PNG image](../qr-image/).
