---
title: Logback
description: Propiedades de PragmaStructuredEncoder, PragmaTextEncoder y PragmaAsyncAppender en logback.xml.
sidebar:
  order: 51
---

Estas clases son de `pragma-log-logback`. Se usan en `logback.xml` en apps Java sin Spring Boot ni Quarkus. Cada propiedad es un elemento dentro del encoder o del appender.

Las propiedades marcadas como **repetible** se escriben una vez por valor. Las listas en un solo elemento van separadas por coma.

## `PragmaStructuredEncoder`

```xml
<encoder class="co.com.pragma.logging.logback.PragmaStructuredEncoder">
  <appName>orders-service</appName>
</encoder>
```

Escribe JSON, XML, CSV o un formato propio. `PragmaJsonEncoder` es un alias que se mantiene por compatibilidad.

### Formato

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `format` | `json` | `json`, `xml`, `csv` o `custom`. |
| `pretty` | `false` | JSON indentado. |
| `csvColumns` | `timestamp,level,logger,thread,message` | Columnas del CSV. |
| `csvDelimiter` | `,` | Separador del CSV. |
| `csvHeader` | `false` | Escribe los nombres de las columnas al comienzo del archivo. |
| `customFormatter` | — | Clase que implementa `LogEventFormatter`. |
| `timestampPattern` | `[ISO_OFFSET_DATE_TIME]` | Patrón de `DateTimeFormatter` o constante entre corchetes. |
| `timeZone` | La zona del sistema | Zona horaria del timestamp. |

### Campos

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `appName` | — | Valor del campo `app`. |
| `appVersion` | — | Valor del campo `version`. Sin valor, no sale. |
| `includeHost` | `true` | Agrega el campo `host`. |
| `includePid` | `false` | Agrega el campo `pid`. |
| `field` | — | Campo fijo, como `env=prod`. **Repetible.** |
| `hideFields` | — | Campos que no salen. |
| `renameField` | — | Campo renombrado, como `level=severity` o `requestId=$.http.request.id`. **Repetible.** |
| `fieldOrder` | — | Campos que van primero, en ese orden. |
| `requiredFields` | — | Campos que todo log debe tener. |
| `requiredPlaceholder` | `unknown` | Valor de un campo obligatorio que falta. |
| `extraField` | — | Objeto que agrupa el MDC y los key-values. |
| `maxFieldLength` | `0` | Caracteres máximos del mensaje y de cada texto. `0` no recorta. |
| `enricher` | — | Clase que implementa `LogEnricher`. **Repetible.** |

### Masking

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `maskingEnabled` | `true` | Activa el masking. |
| `maskCharacter` | `*` | Carácter de la máscara. |
| `maskDefaultType` | `FULL` | Tipo para los campos enmascarados por nombre. |
| `maskDefaultLength` | `4` | Longitud cuando la anotación no la define. |
| `maskFields` | La [lista por defecto](../configuration/#masking) | Nombres que se enmascaran sin anotación. Reemplaza la lista por defecto. |
| `maskMaxDepth` | `10` | Profundidad máxima de objetos anidados. |
| `maskStrategy` | — | Estrategia propia, como `iban=com.acme.IbanMasking`. **Repetible.** |
| `maskPattern` | — | `CARD`, `EMAIL`, `JWT` o una regex. **Repetible.** |

### Stack trace

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `includeStacktrace` | `true` | Escribe el stack trace. El resumen `error` sale siempre. |
| `stacktraceMaxDepth` | `50` | Frames por cada excepción de la cadena. |
| `stacktraceMaxLength` | `16384` | Caracteres máximos de todo el stack trace. |
| `stacktraceRootCauseFirst` | `false` | Escribe primero la causa raíz. |

### Alertas

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `maxLogSize` | `0` | Tamaño en bytes a partir del cual un log genera una alerta. `0` no avisa. |
| `truncateLargeLogs` | `false` | Recorta los logs más grandes que `maxLogSize`. |
| `alertConsole` | `true` | Escribe las alertas en la salida de error. |
| `alertListener` | — | Clase que implementa `LogAlertListener`. **Repetible.** |

## `PragmaTextEncoder`

```xml
<encoder class="co.com.pragma.logging.logback.PragmaTextEncoder">
  <color>AUTO</color>
</encoder>
```

Escribe texto legible con el mismo masking. Acepta las propiedades de masking, de stack trace, de alertas (sin `truncateLargeLogs`), `maxFieldLength`, `enricher`, `hideFields`, `timestampPattern` y `timeZone`, más estas:

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `color` | `AUTO` | `AUTO` (solo en una terminal y sin `NO_COLOR`), `ALWAYS` o `NEVER`. Usa `NEVER` en appenders de archivo. |
| `levelColor` | `ERROR=red`, `WARN=yellow`, `INFO=green`, `DEBUG=cyan`, `TRACE=faint` | Color de un nivel, con nombre o hex: `INFO=blue`, `WARN=#ff8800`. **Repetible.** |
| `timestampPattern` | `yyyy-MM-dd HH:mm:ss.SSS` | Patrón del timestamp en texto. |

## `PragmaAsyncAppender`

```xml
<appender name="ASYNC" class="co.com.pragma.logging.logback.PragmaAsyncAppender">
  <appender-ref ref="CONSOLE"/>
</appender>
```

Escribe los logs en otro hilo sin descartar ninguno. Hereda las propiedades del `AsyncAppender` de Logback con valores por defecto seguros:

| Propiedad | Por defecto | Qué hace |
|---|---|---|
| `queueSize` | `8192` | Logs que pueden esperar a ser escritos. |
| `discardingThreshold` | `0` | No descarta logs cuando la cola se llena. |
| `neverBlock` | `false` | `true` descarta en vez de hacer esperar a quien loguea. |
| `maxFlushTime` | `5000` | Milisegundos para escribir los pendientes al apagar. |
| `appender-ref` | — | El appender real. Obligatorio. |

Agrega `<shutdownHook/>` dentro de `<configuration>`: sin él, los logs pendientes se pierden cuando la app termina.
