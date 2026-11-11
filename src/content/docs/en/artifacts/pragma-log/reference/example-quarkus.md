---
title: "Complete configuration: Quarkus"
description: An application.properties with every pragma-log option, commented and tested.
sidebar:
  order: 55
---

This `application.properties` has every pragma-log option, grouped and commented. It's the same configuration as the [Spring Boot](../example-spring-boot/) one, in the Quarkus format. It was tested by starting a Quarkus app with it: it starts with no errors or warnings, and the logs come out the same as in Spring Boot.

```properties
# src/main/resources/application.properties
quarkus.application.name=orders-service
quarkus.application.version=1.4.2

pragma.log.enabled=true

# ── Format ──────────────────────────────────────────────
# json | xml | csv | custom | plain
pragma.log.format=json
# pragma.log.custom-formatter=com.acme.logging.KeyValueFormatter
# pragma.log.json.pretty=true
# pragma.log.csv.columns=timestamp,level,requestId,message
# pragma.log.csv.delimiter=;
# pragma.log.csv.header=true
pragma.log.timestamp.pattern=[ISO_OFFSET_DATE_TIME]
pragma.log.timestamp.zone=America/Bogota
# Readable text in dev mode only
%dev.pragma.log.format=plain

# ── Identification ──────────────────────────────────────
# pragma.log.app-name=orders-service
# pragma.log.version=1.4.2
pragma.log.include-host=true
pragma.log.include-pid=false

# ── Fields ──────────────────────────────────────────────
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

# ── Exceptions ──────────────────────────────────────────
pragma.log.stacktrace.include=true
pragma.log.stacktrace.max-depth=50
pragma.log.stacktrace.max-length=16384
pragma.log.stacktrace.root-cause-first=false

# ── HTTP context ────────────────────────────────────────
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

# ── Alerts ──────────────────────────────────────────────
pragma.log.alerts.max-log-size=64K
pragma.log.alerts.truncate=true
pragma.log.alerts.console=true
# pragma.log.alerts.listeners=com.acme.logging.AlertsToMetrics

# ── Plain text (format=plain) ───────────────────────────
pragma.log.color.mode=auto
pragma.log.color.levels.INFO=green
pragma.log.color.levels.WARN=#ff8800

# ── Asynchronous logging (Quarkus's own) ────────────────
quarkus.log.console.async.enabled=true
```

## Differences from Spring Boot

- Lists are comma-separated and maps put the key at the end: `pragma.log.fields.env=prod`.
- Sizes use the Quarkus format: `4K`, `64K`.
- `%dev.` applies only in dev mode: there the logs come out as readable text.
- There is no `pragma.log.async.*` or `pragma.log.context-keys`. Asynchronous logging is Quarkus's own (`quarkus.log.console.async.enabled`, `quarkus.log.file.async.enabled`).
- `quarkus.application.name` and `quarkus.application.version` are read at build time. To change `app` or `version` at startup, use `pragma.log.app-name` and `pragma.log.version`.

## Before you copy it

- The commented lines (`#`) are options that need a class of yours, like `enrichers` or `alerts.listeners`, or options for another format, like `csv.*`. Uncomment them when you use them: a class that doesn't exist stops startup.
- `masking.fields` replaces the default list. The example repeats the default list and adds `documentId`; remove or add the names from your domain.
- `required-fields` is commented out because every log that doesn't have the field generates an alert. Turn it on only with fields that all your logs have.
- Every option is explained in the [configuration reference](../configuration/).
