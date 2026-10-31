---
sidebar_position: 2
title: Campos y Transformaciones
---

# Campos del Log

## Campos por defecto

Estos campos están disponibles automáticamente en cada log:

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `timestamp` | Sistema | Fecha/hora del evento de log |
| `level` | Logger | Nivel: TRACE, DEBUG, INFO, WARNING, ERROR |
| `message` | Código | El mensaje que pasas a `log.info(...)` |
| `logger` | Logger | Nombre completo de la clase que loguea |
| `thread` | JVM | Nombre del thread actual |

### Campos adicionales (solo Spring/WebFlux)

| Campo | Fuente | Descripción |
|-------|--------|-------------|
| `requestId` | Header `X-Request-Id` o UUID auto-generado | Identificador único del request |
| `traceId` | Header `X-Trace-Id` | Trace ID para observabilidad distribuida |
| `exception` | Logger | Excepción formateada (si se pasa un Throwable) |

### Campos del MDC

Cualquier valor que pongas en MDC (SLF4J) aparece automáticamente como campo extra en el log.

---

## Ocultar campos (`hideFields`)

Elimina campos completamente del output:

```yaml
hideFields:
  - thread        # Remueve el nombre del thread
  - logger        # Remueve el nombre del logger
  - appName       # Remueve el nombre de la app
```

**Antes:**
```json
{"timestamp":"...","level":"INFO","message":"Hello","logger":"com.myapp.Service","thread":"main"}
```

**Después (con hideFields: [logger, thread]):**
```json
{"timestamp":"...","level":"INFO","message":"Hello"}
```

---

## Renombrar campos (`renameFields`)

Cambia el nombre de un campo en el output sin afectar su valor:

```yaml
renameFields:
  level: severity
  appName: service
  className: class
  thread: threadName
```

**Antes:**
```json
{"level":"INFO","appName":"my-service"}
```

**Después:**
```json
{"severity":"INFO","service":"my-service"}
```

:::warning Usa nombres originales en fieldsOrder
En `fieldsOrder`, usa los nombres **originales** (antes del rename). El rename se aplica después del ordering.
:::

---

## Ordenar campos (`fieldsOrder`)

Controla el orden de aparición de los campos:

```yaml
fieldsOrder:
  - timestamp
  - level
  - message
  - logger
  - thread
  - requestId
  - userId
```

- Campos listados aparecen en ese orden exacto
- Campos **no listados** aparecen al final (en el orden en que llegaron)
- Campos ocultos (`hideFields`) no aparecen aunque estén en la lista

---

## Campos adicionales (`additionalFields`)

Agrega campos extra desde diferentes fuentes:

```yaml
additionalFields:
  # Extrae del header HTTP
  - name: userId
    source: header
    key: X-User-Id

  # Extrae de query parameter (?tenant=abc)
  - name: tenant
    source: query
    key: tenant

  # Valor fijo (igual en todos los logs)
  - name: environment
    source: fixed
    value: production

  # Desde el LogContext (programático)
  - name: correlationId
    source: context
    key: correlationId
```

### Sources disponibles

| Source | Descripción | Requiere |
|--------|-------------|----------|
| `header` | Valor de un HTTP request header | Spring/WebFlux |
| `query` | Valor de un query parameter | Spring/WebFlux |
| `fixed` | Valor constante definido en config | Todos |
| `context` | Valor del LogContext (programático) | Todos |

---

## Combinando transformaciones

Las transformaciones se aplican en este orden:
1. **Hide** — campos ocultos se eliminan
2. **Rename** — campos restantes se renombran
3. **Order** — campos se ordenan según `fieldsOrder`

### Ejemplo completo

```yaml
hideFields:
  - thread
  - internalToken

renameFields:
  level: severity
  appName: service
  userId: user-id

fieldsOrder:
  - timestamp
  - severity        # ← Usa el nombre ORIGINAL (level) para el orden
  - service         # ← Pero acá aparece el nombre final
  - message
  - user-id
```

**Input (LogEvent):**
```
timestamp=1234567890, level=INFO, message="Hello", thread="main", 
appName="my-app", userId="user-123", internalToken="secret"
```

**Output:**
```json
{"timestamp":"10:30:22.456","severity":"INFO","service":"my-app","message":"Hello","user-id":"user-123"}
```

Nota: `thread` e `internalToken` fueron eliminados, `level/appName/userId` fueron renombrados.
