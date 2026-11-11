---
title: "Configuración completa: Spring Boot"
description: Un application.yml con todas las opciones de pragma-log, comentado y probado.
sidebar:
  order: 54
---

Este `application.yml` tiene todas las opciones de pragma-log, agrupadas y comentadas. Los valores son una configuración razonable para producción; los que no se usan casi nunca van comentados. Se probó arrancando una app Spring Boot con él: arranca sin errores ni advertencias.

```yaml
# src/main/resources/application.yml
spring:
  application:
    name: orders-service             # campo "app"
    version: 1.4.2                   # campo "version"

pragma:
  log:
    enabled: true                    # false apaga la librería

    # ── Formato ─────────────────────────────────────────────
    format: json                     # json | xml | csv | custom | plain
    # custom-formatter: com.acme.logging.KeyValueFormatter   # con format: custom
    # json:
    #   pretty: true                 # solo en local: un log en varias líneas
    # csv:
    #   columns: [timestamp, level, requestId, message]
    #   delimiter: ";"
    timestamp:
      pattern: "[ISO_OFFSET_DATE_TIME]"   # o [ISO_INSTANT], yyyy-MM-dd HH:mm:ss.SSS
      zone: America/Bogota

    # ── Identificación ──────────────────────────────────────
    # app-name: orders-service       # por defecto spring.application.name
    # version: 1.4.2                 # por defecto spring.application.version
    include-host: true               # campo "host" (nombre del pod en Kubernetes)
    include-pid: false               # campo "pid"

    # ── Campos ──────────────────────────────────────────────
    fields:                          # campos fijos en todos los logs
      env: ${ENVIRONMENT:local}
      team: payments
    hide-fields: [thread]
    rename-fields:
      level: severity
      requestId: $.http.request.id   # $.a.b anida el campo
    field-order: [timestamp, severity, message]
    # required-fields: [traceId]     # si falta, sale con required-placeholder y se avisa
    # required-placeholder: unknown
    extra-field: extra               # agrupa MDC y key-values en "extra"
    max-field-length: 4000           # corta textos más largos; 0 = sin límite
    # enrichers: [com.acme.logging.TenantEnricher]   # o como beans
    context-keys: [userId, tenantId] # WebFlux: claves del Reactor Context

    # ── Masking ─────────────────────────────────────────────
    masking:
      enabled: true
      character: "*"
      default-type: FULL             # FULL | PREFIX | SUFFIX | MIDDLE | HIDDEN
      default-length: 4
      fields: [password, passwd, pwd, secret, token, accessToken, refreshToken, idToken,
               apiKey, authToken, authorization, proxyAuthorization, cookie, setCookie,
               cardNumber, cvv, cvc, pin, documentId]   # reemplaza la lista por defecto
      max-depth: 10
      # strategies:
      #   iban: com.acme.logging.IbanMasking   # @MaskedLogField(type = CUSTOM, strategy = "iban")
      patterns: [CARD, EMAIL, JWT]   # o una regex: 'password=(\S+)'

    # ── Excepciones ─────────────────────────────────────────
    stacktrace:
      include: true
      max-depth: 50
      max-length: 16384
      root-cause-first: false

    # ── Contexto HTTP ───────────────────────────────────────
    http:
      enabled: true
      request-id-header: X-Request-Id
      headers: [X-Client-Id, User-Agent]   # "*" = todos menos exclude-headers
      exclude-headers: [Authorization, Proxy-Authorization, Cookie, Set-Cookie]
      query-params: [page, channel]        # "*" = todos
      request-log:
        enabled: true                # log de fin con http.status y http.durationMs
        entry: false                 # log al comenzar cada request
        exclude-paths: [/actuator/**, /health]
      body:
        enabled: false               # bodies enmascarados en el log de fin
        request: true
        response: true
        max-size: 4KB
        content-types: [application/json, application/*+json, application/x-www-form-urlencoded,
                        application/xml, text/*]

    # ── Alertas ─────────────────────────────────────────────
    alerts:
      max-log-size: 64KB             # avisa cuando un log supera este tamaño
      truncate: true                 # y lo recorta hasta que quepa
      console: true                  # una línea en stderr, máximo una por minuto por logger
      # listeners: [com.acme.logging.AlertsToMetrics]   # o como beans

    # ── Texto plano (format: plain) ─────────────────────────
    color:
      mode: auto                     # auto | always | never
      levels:
        INFO: green
        WARN: "#ff8800"

    # ── Logging asíncrono ───────────────────────────────────
    async:
      enabled: true
      queue-size: 8192
      never-block: false
      max-flush-time: 5s
```

## Qué produce

Un log escrito dentro de un request (`GET /customers/7?page=2` con el header `X-Client-Id: mobile`):

```json
{"timestamp":"2026-11-11T10:15:30.123-05:00","severity":"INFO","message":"Lookup finished","logger":"co.com.pragma.logging.examples.mvc.SpringMvcApp$CustomerController","extra":{"http.path":"/customers/7","http.header.x-client-id":"mobile","http.query.page":"2","http.method":"GET","http.header.user-agent":"okhttp/4.12.0","customerId":"7"},"http":{"request":{"id":"req-7"}},"app":"orders-service","version":"1.4.2","host":"orders-7d9f-x2k","env":"local","team":"payments"}
```

- `thread` no sale, `level` se llama `severity` y esos tres campos van primero.
- El `requestId` quedó anidado en `http.request.id`.
- El MDC, el contexto HTTP y los key-values van dentro de `extra`.
- `env` y `team` son campos fijos. `env` toma la variable `ENVIRONMENT`, o `local` si no existe.

## Antes de copiarlo

- Las líneas comentadas (`#`) son opciones que necesitan una clase tuya, como `enrichers` o `alerts.listeners`, u opciones de otro formato, como `csv.*`. Descoméntalas cuando las uses: una clase que no existe detiene el arranque.
- `masking.fields` reemplaza la lista por defecto. El ejemplo repite la lista por defecto y agrega `documentId`; quita o agrega los nombres de tu dominio.
- `required-fields` está comentado porque cada log que no tenga el campo genera una alerta. Actívalo solo con campos que todos tus logs tienen.
- Cada opción está explicada en la [referencia de configuración](../configuration/).
