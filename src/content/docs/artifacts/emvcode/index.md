---
title: Introducción
description: Qué es EMVCode, cuándo usarlo y cuándo no.
sidebar:
  order: 1
---

EMVCode arma el contenido de los códigos QR de pago EMVCo para que no tengas que serializar los campos, ordenarlos ni calcular el CRC a mano. Es una librería TypeScript para Node.js; el paquete es `@pragmasa/emvcode` y esta documentación corresponde a la versión `1.1.1`.

## Cómo es un QR EMVCo por dentro

Un QR de pago EMVCo es una cadena de texto hecha de campos TLV (*tag-length-value*): dos dígitos de tag, dos de longitud y el valor.

```text
59 09 MI TIENDA
── ── ─────────
tag  │  valor (nombre del comercio)
     longitud: 9 caracteres
```

Los tags *template* (26 a 51, 62, 64 y 80 a 99) contienen otros campos TLV adentro, llamados subtags. El último campo siempre es el `63`, con el CRC16 de todo lo anterior.

## Cuándo usarlo

- Generas QR de pago, recaudo o transferencia que deben cumplir EMVCo.
- Necesitas los tags propietarios de Colombia: canal, IVA, INC, identificador de transacción y hash de seguridad.
- Quieres el payload, su validación de CRC y su imagen QR con una sola dependencia.

## Cuándo no

- Necesitas validar un payload recibido campo por campo: `EMVTLVService` lo separa en TLV, pero no revisa tipos, longitudes ni campos obligatorios.
- Tu proyecto es ESM nativo y no puedes usar el import por defecto. Lee [las preguntas frecuentes](./faq/#puedo-usarla-en-un-proyecto-esm).
- Necesitas generar la imagen en el navegador sin polyfills: `QRCodeService` usa `Buffer`.

## Qué trae

| Pieza | Para qué |
|---|---|
| `EMVCoContentSemanticBuilder` | Arma el payload con métodos por nombre: `setMerchantName`, `setVATValue`… Es el recomendado. |
| `EMVCoContentBuilder` | Arma el payload por número de tag y subtag, para los campos que el builder semántico no cubre. |
| `HashCodeBuilder` | Genera el código de seguridad de la transacción (SHA-256 por defecto) que va en el tag `91`. |
| `CRCService` | Calcula y valida el CRC16-CCITT. Los builders lo agregan solos. |
| `QRCodeService` | Convierte el payload en una matriz QR serializada en Base64, y la decodifica. |
| `BinaryToPng` | Convierte esa matriz en una imagen PNG. |
| `EMVTLVService` | Separa un payload en sus campos TLV y lo vuelve a armar. |
| `EMVTagRegistry` y `EMVField` | El registro de tags EMVCo con su tipo y longitud, y los nombres de cada campo. |

## Cómo está organizada

La librería separa tres capas. La de aplicación tiene los dos builders. La de dominio tiene el registro de tags y los campos EMV, el CRC y el hash, y la generación del QR y del PNG. La compartida tiene las conversiones entre binario y hexadecimal. Solo necesitas lo que exporta el paquete; las capas no se importan por separado.

## Siguiente paso

Sigue el [inicio rápido](./quick-start/) para generar tu primer QR en unos minutos.
