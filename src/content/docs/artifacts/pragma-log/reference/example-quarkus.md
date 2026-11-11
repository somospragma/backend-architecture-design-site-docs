---
title: "Configuración completa: Quarkus"
description: Un application.properties con todas las opciones de pragma-log, comentado y probado.
sidebar:
  order: 55
---

Este `application.properties` tiene todas las opciones de pragma-log, agrupadas y comentadas. Es la misma configuración que la de [Spring Boot](../example-spring-boot/), en el formato de Quarkus. Se probó arrancando una app Quarkus con él: arranca sin errores ni advertencias, y los logs salen igual que en Spring Boot.

```properties
# src/main/resources/application.properties
quarkus.application.name=orders-service
quarkus.application.version=1.4.2

pragma.log.enabled=true

# ── Formato ─────────────────────────────────────────────
# json | xml | csv | custom | plain
pragma.log.format=json
# pragma.log.custom-formatter=com.acme.logging.KeyValueFormatter
# pragma.log.json.pretty=true
# pragma.log.csv.columns=timestamp,level,requestId,message
# pragma.log.csv.delimiter=;
# pragma.log.csv.header=true
pragma.log.timestamp.pattern=[ISO_OFFSET_DATE_TIME]
pragma.log.timestamp.zone=America/Bogota
# Texto legible solo en dev mode
%dev.pragma.log.format=plain

# ── Identificación ──────────────────────────────────────
# pragma.log.app-name=orders-service
# pragma.log.version=1.4.2
pragma.log.include-host=true
pragma.log.include-pid=false

# ── Campos ──────────────────────────────────────────────
pragma.log.fields.env=${ENVIRONMENT:local}
pragma.log.fields.team=payments
pragma.log.hide-fields=thread
pragma.log.rename-fields.level=severity
pragma.log.rename-fields.requestId=$.http.request.id
pragma.log.field-order=timestamp,severity,message
# pragma.log.required-fields=traceId
# pragma.log.required-placeholder=unknown
pragma.log.extra-field=extra
pragma.log.max-field-length=4000
# pragma.log.enrichers=com.acme.logging.TenantEnricher

# ── Masking ─────────────────────────────────────────────
pragma.log.masking.enabled=true
pragma.log.masking.character=*
pragma.log.masking.default-type=FULL
pragma.log.masking.default-length=4
pragma.log.masking.fields=password,passwd,pwd,secret,token,accessToken,refreshToken,idToken,apiKey,authToken,authorization,proxyAuthorization,cookie,setCookie,cardNumber,cvv,cvc,pin,documentId
pragma.log.masking.max-depth=10
# pragma.log.masking.strategies.iban=com.acme.logging.IbanMasking
pragma.log.masking.patterns=CARD,EMAIL,JWT

# ── Excepciones ─────────────────────────────────────────
pragma.log.stacktrace.include=true
pragma.log.stacktrace.max-depth=50
pragma.log.stacktrace.max-length=16384
pragma.log.stacktrace.root-cause-first=false

# ── Contexto HTTP ───────────────────────────────────────
pragma.log.http.enabled=true
pragma.log.http.request-id-header=X-Request-Id
pragma.log.http.headers=X-Client-Id,User-Agent
pragma.log.http.exclude-headers=Authorization,Proxy-Authorization,Cookie,Set-Cookie
pragma.log.http.query-params=page,channel
pragma.log.http.request-log.enabled=true
pragma.log.http.request-log.entry=false
pragma.log.http.request-log.exclude-paths=/q/**,/health
pragma.log.http.body.enabled=false
pragma.log.http.body.request=true
pragma.log.http.body.response=true
pragma.log.http.body.max-size=4K
pragma.log.http.body.content-types=application/json,application/*+json,application/x-www-form-urlencoded,application/xml,text/*

# ── Alertas ─────────────────────────────────────────────
pragma.log.alerts.max-log-size=64K
pragma.log.alerts.truncate=true
pragma.log.alerts.console=true
# pragma.log.alerts.listeners=com.acme.logging.AlertsToMetrics

# ── Texto plano (format=plain) ──────────────────────────
pragma.log.color.mode=auto
pragma.log.color.levels.INFO=green
pragma.log.color.levels.WARN=#ff8800

# ── Logging asíncrono (de Quarkus) ──────────────────────
quarkus.log.console.async.enabled=true
```

## Diferencias con Spring Boot

- Las listas van separadas por coma y los mapas con la clave al final: `pragma.log.fields.env=prod`.
- Los tamaños usan el formato de Quarkus: `4K`, `64K`.
- `%dev.` aplica solo en dev mode: ahí los logs salen como texto legible.
- No hay `pragma.log.async.*` ni `pragma.log.context-keys`. El logging asíncrono es el de Quarkus (`quarkus.log.console.async.enabled`, `quarkus.log.file.async.enabled`).
- `quarkus.application.name` y `quarkus.application.version` se leen al compilar. Para cambiar `app` o `version` al arrancar, usa `pragma.log.app-name` y `pragma.log.version`.

## Antes de copiarlo

- Las líneas comentadas (`#`) son opciones que necesitan una clase tuya, como `enrichers` o `alerts.listeners`, u opciones de otro formato, como `csv.*`. Descoméntalas cuando las uses: una clase que no existe detiene el arranque.
- `masking.fields` reemplaza la lista por defecto. El ejemplo repite la lista por defecto y agrega `documentId`; quita o agrega los nombres de tu dominio.
- `required-fields` está comentado porque cada log que no tenga el campo genera una alerta. Actívalo solo con campos que todos tus logs tienen.
- Cada opción está explicada en la [referencia de configuración](../configuration/).
