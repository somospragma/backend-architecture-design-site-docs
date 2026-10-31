---
sidebar_position: 1
title: Referencia Completa YAML
---

# Referencia de Configuración

Archivo: `src/main/resources/pragma-log-config.yml`

## Configuración completa con todos los valores

```yaml
# ═══════════════════════════════════════════════════════════════
# FORMATO DEL LOG
# ═══════════════════════════════════════════════════════════════
formatter: CONSOLE          # CONSOLE | JSON (default: CONSOLE)

# ═══════════════════════════════════════════════════════════════
# OPCIONES DEL FORMATTER
# ═══════════════════════════════════════════════════════════════
formatterOptions:

  # Patrón de fecha/hora (Java DateTimeFormatter syntax)
  # Default: "yyyy/MM/dd HH:mm:ss.SSS"
  timestampFormatter: yyyy-MM-dd HH:mm:ss.SSS

  # Cómo serializar objetos complejos en los logs
  # JSON: serializa con Jackson (default)
  # JAVA_TOSTRING: usa el toString() del objeto
  # NONE: muestra solo <ClassName>
  objectSerialization: JSON    # JSON | JAVA_TOSTRING | NONE

  # JSON indentado (solo aplica cuando formatter=JSON)
  # Default: false
  prettyPrint: false

  # Máximo de caracteres por campo antes de truncar con "..."
  # Default: 9000 | 0 = sin límite
  maxSizeText: 500

  # Incluir stack trace completo cuando hay excepciones
  # Default: true
  includeStacktrace: true

  # Campos que DEBEN estar presentes (lanza error si faltan)
  # Default: [message, timestamp, level]
  requiredFields:
    - message
    - timestamp
    - level

  # Configuración de colores ANSI (solo CONSOLE)
  colorConfig:
    colorize: false          # true | false (default: false)

    # Colores por nivel de log
    # Valores válidos: BLACK, RED, GREEN, YELLOW, BLUE, MAGENTA, CYAN, WHITE
    #                  BRIGHT_BLACK, BRIGHT_RED, BRIGHT_GREEN, BRIGHT_YELLOW
    #                  BRIGHT_BLUE, BRIGHT_MAGENTA, BRIGHT_CYAN, BRIGHT_WHITE
    colors:
      ERROR: BRIGHT_RED
      WARNING: YELLOW
      INFO: BLUE
      DEBUG: WHITE
      TRACE: BRIGHT_BLACK

    # Estilos de texto por nivel
    # Valores válidos: BOLD, UNDERLINE
    textStyles:
      ERROR: BOLD
      WARNING: UNDERLINE

# ═══════════════════════════════════════════════════════════════
# CONFIGURACIÓN GENERAL
# ═══════════════════════════════════════════════════════════════

# Hint para appenders asíncronos (usado por integraciones)
# Default: true
multiThread: true

# Tamaño máximo del log completo (en caracteres)
# Si se supera, dispara hooks de alerta
# Default: 90000 | 0 = sin límite
maxLogSize: 5000

# Nombre de la aplicación (aparece como campo extra si está en fieldsOrder)
# Default: "LOG-APP"
appName: mi-servicio

# ═══════════════════════════════════════════════════════════════
# HOOKS (alertas)
# ═══════════════════════════════════════════════════════════════

# Lista de clases que implementan LogAlertListener
# Se instancian por reflexión al iniciar
hooks:
  - com.mycompany.alerts.SlackLogAlertListener
  - com.mycompany.alerts.SentryLogAlertListener

# ═══════════════════════════════════════════════════════════════
# CAMPOS: OCULTAR
# ═══════════════════════════════════════════════════════════════

# Campos que se eliminan completamente del output
# Aplica a campos fijos (timestamp, level, message) y extras
hideFields:
  - thread
  - appName
  - internalId

# ═══════════════════════════════════════════════════════════════
# CAMPOS: RENOMBRAR
# ═══════════════════════════════════════════════════════════════

# Cambia el nombre de campos en el output (original → nuevo)
renameFields:
  level: severity            # "level" aparece como "severity"
  appName: application       # "appName" aparece como "application"
  className: class           # "className" aparece como "class"

# ═══════════════════════════════════════════════════════════════
# CAMPOS: ORDEN
# ═══════════════════════════════════════════════════════════════

# Orden en que aparecen los campos en el output
# Campos no listados aquí aparecen al final
# Usa los nombres ORIGINALES (antes del rename)
fieldsOrder:
  - timestamp
  - level
  - appName
  - message
  - logger
  - thread
  - requestId
  - traceId
  - userId

# ═══════════════════════════════════════════════════════════════
# CAMPOS ADICIONALES
# ═══════════════════════════════════════════════════════════════

# Campos extra extraídos de diferentes fuentes
additionalFields:
  # Desde HTTP header
  - name: userId             # Nombre del campo en el log
    source: header           # Fuente: header
    key: X-User-Id           # Nombre del header

  # Desde query parameter
  - name: requestParam
    source: query
    key: request_id

  # Valor fijo
  - name: environment
    source: fixed
    value: "production"

  # Desde contexto (LogContext)
  - name: errorDetail
    source: context
    key: error

# ═══════════════════════════════════════════════════════════════
# ENMASCARAMIENTO (MASKING)
# ═══════════════════════════════════════════════════════════════

masking:
  # Activar/desactivar masking global
  # Default: true
  enabled: true

  # Carácter para enmascarar
  # Default: "-"
  character: "*"

  # Tipo de masking por defecto (cuando no se especifica en la anotación)
  # Default: FULL
  defaultType: FULL          # PREFIX | SUFFIX | MIDDLE | FULL | HIDDEN

  # Longitud por defecto para PREFIX/SUFFIX/MIDDLE
  # Default: 8
  defaultLength: 8

  # Estrategias personalizadas (nombre → clase completa)
  strategies:
    EMAIL: com.mycompany.masking.EmailMaskingStrategy
    CREDIT_CARD: com.mycompany.masking.CreditCardMaskingStrategy
```

## Valores por defecto (sin archivo)

Si no proporcionas `pragma-log-config.yml`, la librería usa estos defaults:

| Opción | Default |
|--------|---------|
| `formatter` | `CONSOLE` |
| `formatterOptions.timestampFormatter` | `yyyy/MM/dd HH:mm:ss.SSS` |
| `formatterOptions.maxSizeText` | `9000` |
| `formatterOptions.includeStacktrace` | `true` |
| `formatterOptions.colorConfig.colorize` | `false` |
| `multiThread` | `true` |
| `maxLogSize` | `90000` |
| `appName` | `LOG-APP` |
| `masking.enabled` | `true` |
| `masking.character` | `-` |
| `masking.defaultType` | `FULL` |

## Merge de configuración

La librería fusiona automáticamente:
1. **Base config** (valores por defecto internos de la librería)
2. **Tu `pragma-log-config.yml`** (override solo lo que necesitas)

Solo necesitas definir las opciones que quieres cambiar. El resto usa los defaults.

## Formato alternativo: .properties

También puedes usar `pragma-log-config.properties`:

```properties
formatter=JSON
formatterOptions.timestampFormatter=yyyy-MM-dd HH:mm:ss.SSS
formatterOptions.prettyPrint=true
formatterOptions.maxSizeText=500
maxLogSize=5000
appName=mi-servicio
masking.enabled=true
masking.character=*
masking.defaultType=FULL
hideFields=thread,appName
renameFields.level=severity
fieldsOrder=timestamp,level,message,logger,thread
```
