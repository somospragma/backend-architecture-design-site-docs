---
title: EMVCoContentBuilder
description: El builder por número de tag y subtag.
sidebar:
  order: 2
---

```ts
import { EMVCoContentBuilder } from "@pragmasa/emvcode";
```

Arma el payload por número de tag. Úsalo cuando conoces la especificación EMVCo o necesitas un campo que el [builder semántico](../semantic-builder/) no tiene. Alias por compatibilidad: `EMVCoQRContentBuilder`.

## `setTag(tag, value)`

Escribe un tag simple. Devuelve el builder.

| Parámetro | Tipo | Qué es |
|---|---|---|
| `tag` | `EMVTag` | Tag de dos dígitos, de `"00"` a `"99"`. |
| `value` | `string` | Valor del campo. |

Si el valor supera la longitud máxima del tag, se recorta sin aviso. Por ejemplo, el tag `59` admite 25 caracteres. Las longitudes están en la [referencia de tags](../emv-tags/).

Lanza un error si:

- el tag no existe en el registro: `Tag AB is not defined in the EMVCo standard`. Los tags reservados (`02` a `25` y `65` a `79`) sí existen y se aceptan;
- el tag es un template: `Tag 26 is a template. Use setSubTag()`;
- el valor es vacío, `null`, `undefined` o `"N/A"`: `The tag value is invalid`.

## `setSubTag(templateTag, subTag, value)`

Escribe un subtag dentro de un tag template. Devuelve el builder.

| Parámetro | Tipo | Qué es |
|---|---|---|
| `templateTag` | `EMVTag` | Tag template: `"26"` a `"51"`, `"62"`, `"64"` u `"80"` a `"99"`. |
| `subTag` | `string` | Subtag de dos dígitos. |
| `value` | `string` | Valor del subtag. No se recorta. |

Lanza un error si el tag no es un template (`Tag 52 is not a template. Use setTag()`) o si el valor no es válido.

## `build()`

Devuelve el payload: ordena los tags y los subtags, agrega el CRC16 en el tag `63` y deja el builder vacío.

## Ejemplo

```ts
import { EMVCoContentBuilder } from "@pragmasa/emvcode";

const ACQUIRER = "COM.CO.MIPAGO";

const payload = new EMVCoContentBuilder()
  .setTag("00", "01")
  .setTag("01", "12")
  .setTag("52", "5411")
  .setTag("53", "170")
  .setTag("54", "50000")
  .setTag("58", "CO")
  .setTag("59", "MI TIENDA")
  .setTag("60", "BOGOTA")
  .setSubTag("26", "00", `${ACQUIRER}.LLA`)
  .setSubTag("26", "05", "27899526")
  .setSubTag("62", "07", "CAJA-01")
  .setSubTag("64", "00", "en")
  .setSubTag("64", "01", "MY STORE")
  .build();

console.log(payload);
```

```text
00020101021226330017COM.CO.MIPAGO.LLA0508278995265204541153031705405500005802CO5909MI TIENDA6006BOGOTA62110707CAJA-0164180002en0108MY STORE6304BDCE
```
