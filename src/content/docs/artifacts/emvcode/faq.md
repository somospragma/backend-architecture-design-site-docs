---
title: Preguntas frecuentes
description: Respuestas a las preguntas que más se repiten sobre EMVCode.
sidebar:
  order: 90
---

## ¿Puedo usarla en un proyecto ESM?

Sí, con el import por defecto. El paquete es CommonJS y su código publicado está ofuscado, así que Node.js no detecta los exports con nombre: en un proyecto con `"type": "module"` o en un archivo `.mjs`, `import { CRCService } from "@pragmasa/emvcode"` falla con `Named export 'CRCService' not found`.

```ts
import emvcode from "@pragmasa/emvcode";

const { CRCService, EMVCoContentSemanticBuilder } = emvcode;
```

En proyectos CommonJS, en TypeScript que compila a CommonJS y con `tsx` los imports con nombre funcionan.

## ¿Funciona en el navegador?

En parte. Los builders, `CRCService` y `HashCodeBuilder` funcionan si hay Web Crypto. `BinaryToPng` funciona en navegadores con `CompressionStream`. `QRCodeService` usa `Buffer`, que el navegador no tiene: necesitas un polyfill o un bundler que lo agregue.

## ¿Por qué el hash no se puede verificar?

Porque el timestamp entra en el hash pero no viaja en el QR. Guarda el timestamp que usaste junto con la transacción y vuelve a calcular el hash con los mismos datos. Lee [cómo firmar un QR dinámico](../guides/dynamic-qr-security/).

## ¿Por qué mi QR no se escanea?

Lo más común es que la imagen no tenga margen claro alrededor. `BinaryToPng` dibuja solo la matriz; agrega el margen como en la guía [cómo generar la imagen del QR](../guides/qr-image/).

## `build()` no se quejó y el QR no tiene comercio. ¿Por qué?

`build()` no revisa los campos obligatorios. Revisa tu código contra la columna **Obligatorio** de la [referencia de tags](../reference/emv-tags/).

## ¿Por qué no puedo leer el código de la librería en `node_modules`?

El build de la librería ofusca el JavaScript antes de publicarlo. Los tipos (`.d.ts`) sí son legibles, y el código fuente está en el [repositorio](https://github.com/somospragma/backend-architecture-desing-ts-emvco-qr), con licencia Apache-2.0.

## ¿Qué problemas conocidos tiene la versión 1.1.1?

- `setAdditionalChannelOrigin` escribe en el subtag del NIT (`62.10`) en lugar del `62.11`.
- Los métodos de los tags `92` y `94` a `98` siempre lanzan un error.
- El paquete no exporta el enum de las condiciones (`"01"`, `"02"`, `"03"`), así que en TypeScript hace falta un cast.

Todos tienen una forma de evitarlos; está en la [referencia del builder semántico](../reference/semantic-builder/).
