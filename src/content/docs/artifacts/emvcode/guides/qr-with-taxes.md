---
title: Cómo agregar IVA e INC al QR
description: Genera un QR de pago con la información tributaria de Colombia en los tags 81 a 85.
sidebar:
  order: 1
---

Al terminar tendrás un QR dinámico con el IVA y el impuesto al consumo (INC) de la compra, en los tags propietarios de Colombia.

## Antes de empezar

- Haz el [inicio rápido](../../quick-start/).
- Ten a mano el identificador de tu adquirente. En los ejemplos se usa `COM.CO.MIPAGO`.

## Qué tags usa

Cada impuesto es un tag template con dos subtags: `00` lleva el identificador (GUI) y `01` lleva el valor.

| Tag | Qué lleva | Métodos |
|---|---|---|
| `81` | Condición del IVA | `setVATConditionGui`, `setVATCondition` |
| `82` | Valor del IVA | `setVATValueGui`, `setVATValue` |
| `83` | Base del IVA | `setVATBaseGui`, `setVATBase` |
| `84` | Condición del INC | `setINCConditionGui`, `setINCCondition` |
| `85` | Valor del INC | `setINCValueGui`, `setINCValue` |

La condición es `"01"` (gravado), `"02"` (exento) o `"03"` (excluido).

## Arma el QR

Este ejemplo es la cuenta de un restaurante: subtotal de 80.000 COP, IVA del 19 % e INC del 8 %. Crea `qr-impuestos.ts`:

```ts
import { EMVCoContentSemanticBuilder, type TypeConditionValue } from "@pragmasa/emvcode";

const ACQUIRER = "COM.CO.MIPAGO";
// "01" gravado, "02" exento, "03" excluido. El cast hace falta porque el paquete no exporta el enum.
const GRAVADO = "01" as TypeConditionValue;

const subtotal = 80000;
const iva = Math.round(subtotal * 0.19); // 15200
const inc = Math.round(subtotal * 0.08); // 6400
const total = subtotal + iva + inc; // 101600

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setDynamicQR()
  .setMerchantCategoryCode("5812")
  .setCurrencyISO4217("170")
  .setTransactionAmount(String(total))
  .setCountryCode("CO")
  .setMerchantName("RESTAURANTE EL SABOR")
  .setMerchantCity("MEDELLIN")
  .setVATConditionGui(`${ACQUIRER}.CIVAT`)
  .setVATCondition(GRAVADO)
  .setVATValueGui(`${ACQUIRER}.VAT`)
  .setVATValue(String(iva))
  .setVATBaseGui(`${ACQUIRER}.BASE`)
  .setVATBase(String(subtotal))
  .setINCConditionGui(`${ACQUIRER}.CINC`)
  .setINCCondition(GRAVADO)
  .setINCValueGui(`${ACQUIRER}.INC`)
  .setINCValue(String(inc))
  .build();

console.log(payload);
```

```bash
npx tsx qr-impuestos.ts
```

Debes ver el payload con el total en el tag `54` y los cinco tags de impuestos antes del CRC:

```text
00020101021252045812530317054061016005802CO5920RESTAURANTE EL SABOR6008MEDELLIN81290019COM.CO.MIPAGO.CIVAT01020182300017COM.CO.MIPAGO.VAT01051520083310018COM.CO.MIPAGO.BASE01058000084280018COM.CO.MIPAGO.CINC01020185290017COM.CO.MIPAGO.INC010464006304534D
```

## Si el producto está exento

Usa la condición `"02"` y deja el valor y la base en `"0"`. Si solo aplica IVA, omite los tags `84` y `85`.

```ts
const EXENTO = "02" as TypeConditionValue;

builder
  .setVATConditionGui(`${ACQUIRER}.CIVAT`)
  .setVATCondition(EXENTO)
  .setVATValueGui(`${ACQUIRER}.VAT`)
  .setVATValue("0")
  .setVATBaseGui(`${ACQUIRER}.BASE`)
  .setVATBase("0");
```

## Ten en cuenta

- EMVCode no calcula los impuestos ni revisa que el total cuadre: escribe los valores que le pases.
- Los valores van sin separadores de miles, como en el tag `54`.

## Siguiente paso

Si el QR es dinámico, [fírmalo con el hash de seguridad](../dynamic-qr-security/).
