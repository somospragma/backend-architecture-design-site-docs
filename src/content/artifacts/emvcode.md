---
name: EMVCode
summary:
  es: Librería TypeScript para armar payloads de códigos QR de pago EMVCo, con su CRC, su hash de seguridad y su imagen.
  en: TypeScript library to build EMVCo payment QR code payloads, with their CRC, security hash and image.
description:
  es: Compone los campos TLV con métodos por nombre o por tag, los ordena y calcula el CRC16 en build(). Incluye los tags propietarios de Colombia (canal, IVA, INC, identificador de transacción y hash), genera el código de seguridad con Web Crypto y convierte el payload en una matriz QR y en PNG.
  en: It composes the TLV fields with named or tag-based methods, sorts them and computes the CRC16 on build(). It includes the Colombian proprietary tags (channel, VAT, INC, transaction identifier and hash), generates the security code with Web Crypto and turns the payload into a QR matrix and a PNG.
install: npm install @pragmasa/emvcode
kind: library
disciplines: [integration, backend]
languages: [typescript]
technologies: [node]
origin: official
owners: [somospragma/backend-architecture]
repository: https://github.com/somospragma/backend-architecture-desing-ts-emvco-qr
registry:
  type: npm
  id: '@pragmasa/emvcode'
  url: https://www.npmjs.com/package/@pragmasa/emvcode
status: stable
license: Apache-2.0
docs:
  mode: hosted
tags: [emvco, emv, qr, pagos, payments, tlv, crc16, iva, inc, recaudo, transferencias, colombia]
lastReviewed: 2026-11-09
---
