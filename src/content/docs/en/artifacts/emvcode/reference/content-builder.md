---
title: EMVCoContentBuilder
description: The builder by tag and subtag number.
sidebar:
  order: 2
---

```ts
import { EMVCoContentBuilder } from "@pragmasa/emvcode";
```

Builds the payload by tag number. Use it when you know the EMVCo specification or need a field the [semantic builder](../semantic-builder/) doesn't have. Compatibility alias: `EMVCoQRContentBuilder`.

## `setTag(tag, value)`

Writes a simple tag. Returns the builder.

| Parameter | Type | What it is |
|---|---|---|
| `tag` | `EMVTag` | Two-digit tag, from `"00"` to `"99"`. |
| `value` | `string` | Field value. |

If the value is longer than the tag's maximum length, it's silently truncated. For example, tag `59` allows 25 characters. The lengths are in the [tag reference](../emv-tags/).

It throws if:

- the tag isn't in the registry: `Tag AB is not defined in the EMVCo standard`. Reserved tags (`02` to `25` and `65` to `79`) do exist and are accepted;
- the tag is a template: `Tag 26 is a template. Use setSubTag()`;
- the value is empty, `null`, `undefined` or `"N/A"`: `The tag value is invalid`.

## `setSubTag(templateTag, subTag, value)`

Writes a subtag inside a template tag. Returns the builder.

| Parameter | Type | What it is |
|---|---|---|
| `templateTag` | `EMVTag` | Template tag: `"26"` to `"51"`, `"62"`, `"64"` or `"80"` to `"99"`. |
| `subTag` | `string` | Two-digit subtag. |
| `value` | `string` | Subtag value. It isn't truncated. |

It throws if the tag isn't a template (`Tag 52 is not a template. Use setTag()`) or if the value is invalid.

## `build()`

Returns the payload: sorts tags and subtags, adds the CRC16 in tag `63` and empties the builder.

## Example

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
