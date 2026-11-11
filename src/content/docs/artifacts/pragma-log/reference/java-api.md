---
title: API Java
description: Anotaciones, interfaces y clases públicas de pragma-log.
sidebar:
  order: 53
---

Todas están en `pragma-log-core`, que llega con cualquier módulo. El paquete base es `co.com.pragma.logging.core`.

## Anotaciones

### `@MaskedLogField`

```java
import co.com.pragma.logging.core.masking.MaskedLogField;
```

Enmascara un campo, un componente de record o, en una clase, cada uno de sus campos. Lee [Cómo enmascarar datos sensibles](../../guides/masking/).

| Atributo | Tipo | Por defecto | Qué es |
|---|---|---|---|
| `type` | `MaskType` | `FULL` | Tipo de máscara. |
| `length` | `int` | `-1` (usa `masking.default-length`) | Caracteres visibles o enmascarados, según el tipo. |
| `strategy` | `String` | `""` | Nombre de la estrategia registrada, con `type = MaskType.CUSTOM`. |

### `MaskType`

```java
import co.com.pragma.logging.core.masking.MaskType;
```

| Valor | Qué hace |
|---|---|
| `FULL` | Reemplaza todo el valor. |
| `PREFIX` | Enmascara el comienzo; deja visibles los últimos caracteres. |
| `SUFFIX` | Deja visible el comienzo; enmascara el final. |
| `MIDDLE` | Deja visibles `length` caracteres a cada lado. |
| `HIDDEN` | Quita el campo del log. |
| `CUSTOM` | Usa la estrategia de `strategy`. |

### `@LogEnrichment`

```java
import co.com.pragma.logging.core.enrich.LogEnrichment;
```

En una clase o un método de un bean de Spring o CDI. Agrega campos fijos a todos los logs que se escriben mientras corre el método. `value` es una lista de `nombre=valor`. En la clase aplica a todos sus métodos y la heredan las subclases. Lee [Cómo enriquecer los logs](../../guides/enrichment/#agrega-campos-a-un-método).

### `@LogField`

```java
import co.com.pragma.logging.core.enrich.LogField;
```

En un parámetro de un método de un bean de Spring o CDI. Agrega el valor del parámetro a los logs del método, con el nombre de `value`. Los objetos salen como JSON enmascarado.

## Interfaces para extender

### `MaskingStrategy`

```java
import co.com.pragma.logging.core.masking.MaskingStrategy;

String mask(String value, char maskChar, int length);
```

Una máscara propia. Recibe el valor como texto, el carácter de máscara y la longitud de la anotación. Se registra por nombre en `masking.strategies`.

### `LogEnricher`

```java
import co.com.pragma.logging.core.enrich.LogEnricher;

void enrich(EnrichedEvent event);
```

Agrega campos a todos los logs. `EnrichedEvent` tiene:

| Método | Qué hace |
|---|---|
| `logger()` | Nombre del logger del log. |
| `level()` | Nivel del log. |
| `put(String name, Object value)` | Agrega un campo. Los objetos salen como JSON enmascarado. |

### `LogAlertListener`

```java
import co.com.pragma.logging.core.alert.LogAlertListener;
```

Recibe las alertas. Sus tres métodos tienen una implementación vacía por defecto:

| Método | Recibe |
|---|---|
| `onLargeLog(LargeLogAlert alert)` | `logger()`, `level()`, `sizeBytes()`, `maxBytes()` |
| `onMaskingError(MaskingErrorAlert alert)` | `logger()`, `error()` |
| `onMissingFields(MissingFieldsAlert alert)` | `logger()`, `level()`, `fields()` |

### `LogEventFormatter`

```java
import co.com.pragma.logging.core.format.LogEventFormatter;

String format(Map<String, Object> event);
default String header() { return null; }
```

Un formato de salida propio, para `format: custom`. `format` recibe los campos ya enmascarados y ordenados, y devuelve el texto del log terminado en salto de línea. `header` devuelve una línea para el comienzo de cada archivo, o `null`. Debe ser segura para varios hilos.

## Registro en código

Para apps sin contenedor de beans, o para registrar en pruebas:

| Método | Qué hace |
|---|---|
| `LogEnrichers.register(LogEnricher)` | Registra un enricher. |
| `LogEnrichers.unregister(LogEnricher)` | Lo quita. |
| `LogAlerts.register(LogAlertListener)` | Registra un listener de alertas. |
| `LogAlerts.unregister(LogAlertListener)` | Lo quita. |

`LogEnrichers` está en `co.com.pragma.logging.core.enrich` y `LogAlerts` en `co.com.pragma.logging.core.alert`.

## Spring Boot

### `PragmaLogReloader`

```java
import co.com.pragma.logging.spring.PragmaLogReloader;
```

Bean que vuelve a leer `pragma.log.*` y aplica los cambios. Se llama solo con cada `EnvironmentChangeEvent`; llama a `reload()` si cambias el `Environment` de otra forma. Lee [Cómo cambiar la configuración en caliente](../../guides/hot-reload/).
