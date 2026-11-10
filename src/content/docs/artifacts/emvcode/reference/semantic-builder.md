---
title: EMVCoContentSemanticBuilder
description: Todos los métodos del builder semántico y el tag que escribe cada uno.
sidebar:
  order: 1
---

```ts
import { EMVCoContentSemanticBuilder, EMVField } from "@pragmasa/emvcode";
```

Arma el payload con métodos por nombre. Cada método devuelve el builder, así que se pueden encadenar. Alias por compatibilidad: `EMVCoQrContentSemanticBuilder`.

## Comportamiento común

- Los valores deben ser `string`. Un valor vacío, `null`, `undefined` o `"N/A"` lanza `The tag value is invalid`.
- En los tags simples, un valor más largo que el máximo del tag se recorta sin aviso. En los subtags no se recorta.
- Llamar dos veces al mismo método reemplaza el valor anterior.
- `build()` no revisa los campos obligatorios: con el builder vacío devuelve solo el CRC (`63046007`).

:::caution[Problemas conocidos en 1.1.1]
- `setAdditionalChannelOrigin` escribe en el subtag `62.10`, el del NIT, y lo reemplaza. Usa `setSubTag("62", "11", valor)`.
- `setServiceCode`, `setProductTypeCollection`, `setOriginAccount`, `setDestinationAccount`, `setDestinationAccountReference` y `setProductTypeTransference` siempre lanzan `Tag 9x is a template. Use setSubTag()`. Usa `setSubTag("92", "01", valor)` y lo mismo para los tags `94` a `98`.
- El paquete no exporta el enum de las condiciones. Para `setTipIndicator`, `setVATCondition` y `setINCCondition`, usa `"01" as TypeConditionValue`.
:::

## Inicio

| Método | Escribe | Notas |
|---|---|---|
| `setPayloadFormatIndicator(value = "01")` | `00` | Solo acepta `"01"`. Se puede llamar sin argumento. |
| `setStaticQR()` | `01` = `11` | QR para muchos pagos, sin monto. |
| `setDynamicQR()` | `01` = `12` | QR para un solo pago. |
| `setAcquirerNetworkId(value)` | — | No escribe en el payload. Guarda el valor en mayúsculas en la propiedad `acquirerNetworkId` (por defecto `COM.ACQUIRER`) para armar los GUI. |

## Cuenta del comercio

| Método | Escribe |
|---|---|
| `setMerchantAccountGUI(value)` | `26.00` |
| `setMerchantAccountId(value, keyType)` | `26.01` a `26.05`, según `keyType` |
| `setNetworkGUI(value)` / `setNetworkId(value)` | `49.00` / `49.01` |
| `setMerchantCodeGUI(value)` / `setMerchantCode(value)` | `50.00` / `50.01` |
| `setAggregatorCodeGUI(value)` / `setAggregatorCode(value)` | `51.00` / `51.01` |

Valores de `keyType` para `setMerchantAccountId`:

| `keyType` | Subtag |
|---|---|
| `EMVField.MERCHANT_ACCOUNT_ID` | `01` |
| `EMVField.MERCHANT_ACCOUNT_MOBILE` | `02` |
| `EMVField.MERCHANT_ACCOUNT_EMAIL` | `03` |
| `EMVField.MERCHANT_ACCOUNT_ALPHANUMERIC` | `04` |
| `EMVField.MERCHANT_ACCOUNT_MERCHANT_ID` | `05` |

## Comercio y transacción

| Método | Escribe | Longitud máxima |
|---|---|---|
| `setMerchantCategoryCode(value)` | `52` | 4 |
| `setCurrencyISO4217(value)` | `53` | 3 |
| `setTransactionAmount(value)` | `54` | 13 |
| `setTipIndicator(value)` | `55` | 2 |
| `setTipFixedAmount(value)` | `56` | 13 |
| `setTipPercentage(value)` | `57` | 5 |
| `setCountryCode(value)` | `58` | 2 |
| `setMerchantName(value)` | `59` | 25 |
| `setMerchantCity(value)` | `60` | 15 |
| `setPostalCode(value)` | `61` | 10 |

## Datos adicionales (tag 62)

| Método | Escribe |
|---|---|
| `setAdditionalBillNumber(value)` | `62.01` |
| `setAdditionalMobileNumber(value)` | `62.02` |
| `setAdditionalStoreLabel(value)` | `62.03` |
| `setAdditionalLoyaltyNumber(value)` | `62.04` |
| `setAdditionalReferenceLabel(value)` | `62.05` |
| `setAdditionalCustomerLabel(value)` | `62.06` |
| `setAdditionalTerminalLabel(value)` | `62.07` |
| `setAdditionalPurpose(value)` | `62.08` |
| `setAdditionalConsumerData(value)` | `62.09` |
| `setAdditionalMerchantTaxId(value)` | `62.10` |
| `setAdditionalChannelOrigin(value)` | `62.10` en 1.1.1; debería ser `62.11` |

## Idioma alternativo (tag 64)

| Método | Escribe |
|---|---|
| `setLanguagePreference(value)` | `64.00`, código ISO 639 |
| `setMerchantNameAlt(value)` | `64.01` |
| `setMerchantCityAlt(value)` | `64.02` |

## Tags de Colombia (80 a 99)

En cada par, el método `…Gui` escribe el subtag `00` y el otro el `01`.

| Métodos | Tag | Qué lleva |
|---|---|---|
| `setChannelGui` / `setChannel` | `80` | Canal (`POS`, `APP`, `WEB`…) |
| `setVATConditionGui` / `setVATCondition` | `81` | Condición del IVA: `"01"`, `"02"` o `"03"` |
| `setVATValueGui` / `setVATValue` | `82` | Valor del IVA |
| `setVATBaseGui` / `setVATBase` | `83` | Base del IVA |
| `setINCConditionGui` / `setINCCondition` | `84` | Condición del INC |
| `setINCValueGui` / `setINCValue` | `85` | Valor del INC |
| `setTransactionIdGui` / `setTransactionId` | `90` | Identificador de la transacción |
| `setSecurityHashGui` / `setSecurityHash` | `91` | Código de seguridad de [`HashCodeBuilder`](../hash-code-builder/) |
| `setServiceCode` | `92` | Código de servicio de recaudo o recarga. No funciona en 1.1.1. |
| `setReferenceOrMobileGui` / `setReferenceOrMobile` | `93` | Referencia de recaudo o celular |
| `setProductTypeCollection` | `94` | Tipo de producto de recaudo. No funciona en 1.1.1. |
| `setOriginAccount` | `95` | Cuenta de origen. No funciona en 1.1.1. |
| `setDestinationAccount` | `96` | Cuenta de destino. No funciona en 1.1.1. |
| `setDestinationAccountReference` | `97` | Referencia de la cuenta de destino. No funciona en 1.1.1. |
| `setProductTypeTransference` | `98` | Tipo de producto de transferencia. No funciona en 1.1.1. |
| `setDiscountApplicationGui` / `setDiscountApplication` | `99` | Descuento aplicado |

## Por tag

El builder semántico también tiene `setTag(tag, value)` y `setSubTag(templateTag, subTag, value)`, con las mismas reglas que en [`EMVCoContentBuilder`](../content-builder/). Sirven para los campos que no tienen método y para evitar los problemas conocidos:

```ts
import { EMVCoContentSemanticBuilder } from "@pragmasa/emvcode";

const payload = new EMVCoContentSemanticBuilder()
  .setPayloadFormatIndicator()
  .setDynamicQR()
  .setAdditionalMerchantTaxId("900123456")
  .setSubTag("62", "11", "APP") // en vez de setAdditionalChannelOrigin("APP")
  .setSubTag("95", "01", "1234567890") // en vez de setOriginAccount("1234567890")
  .build();

console.log(payload);
```

```text
000201010212622010099001234561103APP9514011012345678906304760B
```

## `build()`

Devuelve el payload como `string`: los campos ordenados por tag, los subtags ordenados dentro de cada template y el CRC16 en el tag `63`. Después deja el builder vacío, listo para el siguiente QR.
