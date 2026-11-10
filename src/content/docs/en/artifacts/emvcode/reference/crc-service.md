---
title: CRCService
description: Computing and validating the payload's CRC16-CCITT.
sidebar:
  order: 4
---

```ts
import { CRCService } from "@pragmasa/emvcode";
```

Computes the CRC16-CCITT that EMVCo requires at the end of the payload: polynomial `0x1021` and initial value `0xFFFF`, over the text's UTF-8 bytes. The builders add it on `build()`; you need it to validate a payload you receive. Compatibility aliases: `Crc` and `CRCUtils`.

## Methods

| Method | Returns | What it does |
|---|---|---|
| `CRCService.calculateCRC16(data: string)` | `string` | The CRC as 4 uppercase hexadecimal characters. |
| `CRCService.validateCRC16(qrData: string)` | `boolean` | Computes the CRC of everything except the last 4 characters and compares it with them, case-insensitively. Returns `false` if the text has fewer than 4 characters. |

To compute the CRC of a hand-built payload, include the start of tag `63` (`6304`) in the text, as the builders do:

```ts
import { CRCService } from "@pragmasa/emvcode";

const body = "0002010102115204541153031705802CO5909MI TIENDA6006BOGOTA";
const payload = `${body}6304${CRCService.calculateCRC16(`${body}6304`)}`;

console.log(payload);
console.log(CRCService.validateCRC16(payload));
```

```text
0002010102115204541153031705802CO5909MI TIENDA6006BOGOTA6304571A
true
```
