---
title: CRCService
description: Cálculo y validación del CRC16-CCITT del payload.
sidebar:
  order: 4
---

```ts
import { CRCService } from "@pragmasa/emvcode";
```

Calcula el CRC16-CCITT que EMVCo exige al final del payload: polinomio `0x1021` y valor inicial `0xFFFF`, sobre los bytes UTF-8 del texto. Los builders lo agregan solos en `build()`; lo necesitas para validar un payload que recibes. Alias por compatibilidad: `Crc` y `CRCUtils`.

## Métodos

| Método | Devuelve | Qué hace |
|---|---|---|
| `CRCService.calculateCRC16(data: string)` | `string` | El CRC en 4 caracteres hexadecimales en mayúsculas. |
| `CRCService.validateCRC16(qrData: string)` | `boolean` | Calcula el CRC de todo menos los 4 últimos caracteres y lo compara con ellos, sin distinguir mayúsculas. Devuelve `false` si el texto tiene menos de 4 caracteres. |

Para calcular el CRC de un payload armado a mano, incluye el inicio del tag `63` (`6304`) en el texto, como hacen los builders:

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
