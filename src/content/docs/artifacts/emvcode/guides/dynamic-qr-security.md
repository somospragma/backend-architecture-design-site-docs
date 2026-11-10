---
title: Cómo firmar un QR dinámico con el hash de seguridad
description: Genera el código de seguridad de una transacción y agrégalo al QR con su identificador.
sidebar:
  order: 2
---

Al terminar tendrás un QR dinámico con el identificador de la transacción (tag `90`) y su código de seguridad (tag `91`), que permite comprobar que el pago no se alteró.

## Antes de empezar

- Haz el [inicio rápido](../../quick-start/).
- Node.js necesita la Web Crypto API (`globalThis.crypto.subtle`), disponible desde Node.js `16`.

## Cómo funciona

1. `HashCodeBuilder` concatena el código único del comercio, el canal, la terminal, el identificador de la transacción, el monto y un timestamp.
2. Calcula el digest con SHA-256 (o el algoritmo que configures), lo codifica en Base64 y toma los primeros 24 caracteres.
3. El builder semántico pone ese código en el tag `91` y el identificador de la transacción en el tag `90`.

El timestamp entra en el hash pero no viaja en el QR. Guárdalo junto con la transacción: sin él, nadie puede volver a calcular el hash para verificarlo.

## Arma el QR

Crea `qr-seguro.ts`:

```ts
import { EMVCoContentSemanticBuilder, EMVField, HashCodeBuilder } from "@pragmasa/emvcode";

const ACQUIRER = "COM.CO.MIPAGO";

async function main() {
  const merchantId = "27899526";
  const transactionId = "TRX-1001";
  const amount = "75000";
  const timestamp = Date.now(); // guárdalo con la transacción: sin él no se puede recalcular el hash

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

Debes ver un objeto con el payload, el identificador, el timestamp y un hash de 24 caracteres. El hash y el CRC cambian en cada ejecución porque cambia el timestamp. Por ejemplo:

```text
{
  payload: '00020101021226330017COM.CO.MIPAGO.LLA0508278995265204541153031705405750005802CO5924SUPERMERCADO LA ECONOMIA6004CALI62110707CAJA-0180320021COM.CO.MIPAGO.CHANNEL0103POS90350019COM.CO.MIPAGO.TRXID0108TRX-100191490017COM.CO.MIPAGO.SEC0124v8oGu4VJJJcLBWTS07vd8Hcl6304DAEA',
  transactionId: 'TRX-1001',
  timestamp: 1794295369122,
  securityHash: 'v8oGu4VJJJcLBWTS07vd8Hcl'
}
```

## Verifica el hash

Para verificar un pago, vuelve a calcular el hash con los mismos datos y el timestamp que guardaste, y compáralo con el subtag `01` del tag `91`. Con los mismos datos, el resultado es siempre el mismo.

## Ten en cuenta

- `setChannel` lanza un error si recibe un valor vacío. `setUniqueCode`, `setTerminalId` y `setTransactionId` usan `"0"` si el valor viene vacío, y `setTransactionAmount` usa `"0"` si el monto no es mayor que cero.
- `build()` lanza `All fields are required.` si no llamaste alguno de esos cinco métodos.
- Para usar otro algoritmo, llama `setAlgorithmIdentifier("SHA-384")` en una línea aparte, antes de `build()`: no devuelve el builder, así que no se puede encadenar.

## Siguiente paso

[Genera la imagen PNG del QR](../qr-image/).
