---
sidebar_position: 4
title: Formatos (CONSOLE vs JSON)
---

# Formatos de Log

La librería soporta dos formatos de salida configurables.

## CONSOLE — Human-readable

Formato legible para desarrollo y debugging. Muestra campos como `key=value`.

```yaml
formatter: CONSOLE
```

### Ejemplo de salida

```
2026-01-15 10:30:22.456 [INFO] User logged in logger=com.myapp.AuthService thread=http-nio-8080-exec-1 userId=user-123 requestId=abc-def
```

### Características

- Timestamp formateado al inicio
- Nivel entre corchetes: `[INFO]`, `[ERROR]`, `[WARNING]`
- Mensaje después del nivel
- Campos extra como `key=value` separados por espacio
- Soporte de colores ANSI (configurable)
- Valores `null` se omiten

### Con colores habilitados

```yaml
formatterOptions:
  colorConfig:
    colorize: true
    colors:
      ERROR: BRIGHT_RED
      WARNING: YELLOW
      INFO: BLUE
      DEBUG: WHITE
    textStyles:
      ERROR: BOLD
```

Los colores se aplican a la línea completa según el nivel.

---

## JSON — Structured logging

Formato estructurado compatible con herramientas de observabilidad (ELK, Datadog, OpenTelemetry, Splunk).

```yaml
formatter: JSON
```

### Ejemplo compacto (`prettyPrint: false`)

```json
{"timestamp":"2026-01-15 10:30:22.456","level":"INFO","message":"User logged in","logger":"com.myapp.AuthService","thread":"http-nio-8080-exec-1","userId":"user-123","requestId":"abc-def"}
```

### Ejemplo pretty (`prettyPrint: true`)

```json
{
  "timestamp" : "2026-01-15 10:30:22.456",
  "level" : "INFO",
  "message" : "User logged in",
  "logger" : "com.myapp.AuthService",
  "thread" : "http-nio-8080-exec-1",
  "userId" : "user-123",
  "requestId" : "abc-def"
}
```

### Características

- JSON válido en cada línea (NDJSON cuando compact)
- Números y booleanos se serializan como tipos JSON nativos
- Compatible con Filebeat, Fluentd, Logstash
- Campos `null` incluidos como `null` en JSON
- Sin colores ANSI (nunca se aplican en JSON)

---

## Comparación

| Feature | CONSOLE | JSON |
|---------|---------|------|
| Legibilidad humana | ✅ Excelente | ⚠️ Solo con prettyPrint |
| Parseable por máquinas | ❌ | ✅ |
| Colores ANSI | ✅ Configurable | ❌ Nunca |
| Pretty print | N/A | ✅ Configurable |
| Compatible ELK/Datadog | ❌ | ✅ |
| Tipos nativos (int, bool) | ❌ Todo es texto | ✅ |
| Recomendado para | Desarrollo | Producción |

---

## Recomendación por ambiente

```yaml
# desarrollo (pragma-log-config.yml)
formatter: CONSOLE
formatterOptions:
  colorConfig:
    colorize: true
```

```yaml
# producción (pragma-log-config.yml)
formatter: JSON
formatterOptions:
  prettyPrint: false
```

:::tip Cambiar formato sin re-compilar
Solo cambia el archivo `pragma-log-config.yml` y reinicia la app. No necesitas cambiar código ni recompilar.
:::
