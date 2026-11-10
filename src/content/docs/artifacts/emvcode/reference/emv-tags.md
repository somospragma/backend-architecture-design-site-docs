---
title: Tags EMV
description: Los tags que conoce EMVCode, con su tipo, su longitud máxima y sus subtags.
sidebar:
  order: 6
---

Esta tabla sale del registro de la librería. Para consultarlo desde el código, usa `EMVTagRegistry.getTag("59")` o `EMVTagRegistry.getAllTags()`.

La columna **Obligatorio** es la marca `required` del registro. `build()` no la revisa: si falta un campo obligatorio, el payload se genera igual.

## Tags principales

| Tag | Tipo | Qué es | Obligatorio | Longitud máxima |
|---|---|---|---|---|
| `00` | Simple | Indicador de formato del payload | Sí | 2 |
| `01` | Simple | Método de iniciación: `11` estático, `12` dinámico | Sí | 2 |
| `02`–`25` | Simple | Reservados para EMVCo | No | — |
| `26`–`51` | Template | Información de la cuenta del comercio | No | — |
| `52` | Simple | Código de categoría del comercio (MCC) | Sí | 4 |
| `53` | Simple | Moneda, ISO 4217 | Sí | 3 |
| `54` | Simple | Monto de la transacción | No | 13 |
| `55` | Simple | Indicador de propina o cargo | No | 2 |
| `56` | Simple | Cargo fijo | No | 13 |
| `57` | Simple | Cargo en porcentaje | No | 5 |
| `58` | Simple | País, ISO 3166-1 | Sí | 2 |
| `59` | Simple | Nombre del comercio | Sí | 25 |
| `60` | Simple | Ciudad del comercio | Sí | 15 |
| `61` | Simple | Código postal | Sí | 10 |
| `62` | Template | Datos adicionales | No | — |
| `63` | Simple | CRC, lo agrega `build()` | Sí | 4 |
| `64` | Template | Idioma alternativo | No | — |
| `65`–`79` | Simple | Reservados para EMVCo | No | — |

## Subtags del tag 26

| Subtag | Qué es | `EMVField` |
|---|---|---|
| `00` | Identificador global (GUI) | `MERCHANT_ACCOUNT_GUI` |
| `01` | Identificador de la cuenta | `MERCHANT_ACCOUNT_ID` |
| `02` | Celular | `MERCHANT_ACCOUNT_MOBILE` |
| `03` | Correo | `MERCHANT_ACCOUNT_EMAIL` |
| `04` | Alfanumérico | `MERCHANT_ACCOUNT_ALPHANUMERIC` |
| `05` | Identificador del comercio | `MERCHANT_ACCOUNT_MERCHANT_ID` |

## Subtags del tag 62

| Subtag | Qué es | `EMVField` |
|---|---|---|
| `01` | Número de factura | `ADDITIONAL_BILL_NUMBER` |
| `02` | Celular | `ADDITIONAL_MOBILE_NUMBER` |
| `03` | Tienda | `ADDITIONAL_STORE_LABEL` |
| `04` | Número de fidelización | `ADDITIONAL_LOYALTY_NUMBER` |
| `05` | Referencia | `ADDITIONAL_REFERENCE_LABEL` |
| `06` | Cliente | `ADDITIONAL_CUSTOMER_LABEL` |
| `07` | Terminal | `ADDITIONAL_TERMINAL_LABEL` |
| `08` | Propósito de la transacción | `ADDITIONAL_PURPOSE` |
| `09` | Datos que se piden al cliente | `ADDITIONAL_CONSUMER_DATA` |
| `10` | NIT del comercio | `ADDITIONAL_MERCHANT_TAX_ID` |
| `11` | Canal de origen | `ADDITIONAL_CHANNEL_ORIGIN` |

## Subtags del tag 64

| Subtag | Qué es | `EMVField` |
|---|---|---|
| `00` | Idioma, ISO 639 | `LANGUAGE_PREFERENCE` |
| `01` | Nombre del comercio en ese idioma | `MERCHANT_NAME_ALT` |
| `02` | Ciudad en ese idioma | `MERCHANT_CITY_ALT` |

## Tags de Colombia (80 a 99)

Todos son templates. Donde hay subtag `00`, lleva el identificador (GUI) y el `01` lleva el valor.

| Tag | Qué es | Subtags | Obligatorio |
|---|---|---|---|
| `80` | Canal | `00`, `01` | Sí |
| `81` | Condición del IVA | `00`, `01` | Sí |
| `82` | Valor o porcentaje del IVA | `00`, `01` | Sí |
| `83` | Base del IVA | `00`, `01` | Sí |
| `84` | Condición del INC | `00`, `01` | Sí |
| `85` | Valor o porcentaje del INC | `00`, `01` | Sí |
| `86`–`89` | Reservados para impuestos | — | No |
| `90` | Identificador de la transacción | `00`, `01` | Sí |
| `91` | Código de seguridad (SHA-256) | `00`, `01` | Sí |
| `92` | Código de servicio de recaudo o recarga | `01` | No |
| `93` | Referencia de recaudo o celular | `00`, `01` | No |
| `94` | Tipo de producto de recaudo | `01` | No |
| `95` | Cuenta de origen | `01` | No |
| `96` | Cuenta de destino | `01` | No |
| `97` | Referencia de la cuenta de destino | `01` | No |
| `98` | Tipo de producto de transferencia | `01` | No |
| `99` | Descuento aplicado | `00`, `01` | No |

## Códigos de uso frecuente

| Moneda (tag `53`) | Código |
|---|---|
| Peso colombiano (COP) | `170` |
| Dólar estadounidense (USD) | `840` |
| Peso mexicano (MXN) | `484` |
| Sol peruano (PEN) | `604` |

| Categoría (tag `52`) | MCC |
|---|---|
| Transporte | `4111` |
| Supermercados | `5411` |
| Restaurantes | `5812` |
| Tiendas misceláneas | `5999` |
| Hoteles | `7011` |

La especificación completa está en el sitio de [EMVCo](https://www.emvco.com/emv-technologies/qrcodes/).
