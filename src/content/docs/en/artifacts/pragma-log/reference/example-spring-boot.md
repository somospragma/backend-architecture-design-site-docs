---
title: "Complete configuration: Spring Boot"
description: An application.yml with every pragma-log option, commented and tested.
sidebar:
  order: 54
---

This `application.yml` has every pragma-log option, grouped and commented. The values are a reasonable configuration for production; the ones you almost never use are commented out. It was tested by starting a Spring Boot app with it: it starts with no errors or warnings.

```yaml
# src/main/resources/application.yml
spring:
  application:
    name: orders-service             # "app" field
    version: 1.4.2                   # "version" field

pragma:
  log:
    enabled: true                    # false turns off the library

    # ── Format ──────────────────────────────────────────────
    format: json                     # json | xml | csv | custom | plain
    # custom-formatter: com.acme.logging.KeyValueFormatter   # with format: custom
    # json:
    #   pretty: true                 # local only: one log across several lines
    # csv:
    #   columns: [timestamp, level, requestId, message]
    #   delimiter: ";"
    timestamp:
      pattern: "[ISO_OFFSET_DATE_TIME]"   # or [ISO_INSTANT], yyyy-MM-dd HH:mm:ss.SSS
      zone: America/Bogota

    # ── Identification ──────────────────────────────────────
    # app-name: orders-service       # defaults to spring.application.name
    # version: 1.4.2                 # defaults to spring.application.version
    include-host: true               # "host" field (pod name in Kubernetes)
    include-pid: false               # "pid" field

    # ── Fields ──────────────────────────────────────────────
    fields:                          # fixed fields in every log
      env: ${ENVIRONMENT:local}
      team: payments
    hide-fields: [thread]
    rename-fields:
      level: severity
      requestId: $.http.request.id   # $.a.b nests the field
    field-order: [timestamp, severity, message]
    # required-fields: [traceId]     # if missing, goes out with required-placeholder and alerts
    # required-placeholder: unknown
    extra-field: extra               # groups MDC and key-values in "extra"
    max-field-length: 4000           # cuts longer texts; 0 = no limit
    # enrichers: [com.acme.logging.TenantEnricher]   # or as beans
    context-keys: [userId, tenantId] # WebFlux: Reactor Context keys

    # ── Masking ─────────────────────────────────────────────
    masking:
      enabled: true
      character: "*"
      default-type: FULL             # FULL | PREFIX | SUFFIX | MIDDLE | HIDDEN
      default-length: 4
      fields: [password, passwd, pwd, secret, token, accessToken, refreshToken, idToken,
               apiKey, authToken, authorization, proxyAuthorization, cookie, setCookie,
               cardNumber, cvv, cvc, pin, documentId]   # replaces the default list
      max-depth: 10
      # strategies:
      #   iban: com.acme.logging.IbanMasking   # @MaskedLogField(type = CUSTOM, strategy = "iban")
      patterns: [CARD, EMAIL, JWT]   # or a regex: 'password=(\S+)'

    # ── Exceptions ──────────────────────────────────────────
    stacktrace:
      include: true
      max-depth: 50
      max-length: 16384
      root-cause-first: false

    # ── HTTP context ────────────────────────────────────────
    http:
      enabled: true
      request-id-header: X-Request-Id
      headers: [X-Client-Id, User-Agent]   # "*" = all except exclude-headers
      exclude-headers: [Authorization, Proxy-Authorization, Cookie, Set-Cookie]
      query-params: [page, channel]        # "*" = all
      request-log:
        enabled: true                # end log with http.status and http.durationMs
        entry: false                 # log when each request starts
        exclude-paths: [/actuator/**, /health]
      body:
        enabled: false               # masked bodies in the end log
        request: true
        response: true
        max-size: 4KB
        content-types: [application/json, application/*+json, application/x-www-form-urlencoded,
                        application/xml, text/*]

    # ── Alerts ──────────────────────────────────────────────
    alerts:
      max-log-size: 64KB             # alerts when a log goes over this size
      truncate: true                 # and cuts it until it fits
      console: true                  # one line on stderr, at most one per minute per logger
      # listeners: [com.acme.logging.AlertsToMetrics]   # or as beans

    # ── Plain text (format: plain) ──────────────────────────
    color:
      mode: auto                     # auto | always | never
      levels:
        INFO: green
        WARN: "#ff8800"

    # ── Asynchronous logging ────────────────────────────────
    async:
      enabled: true
      queue-size: 8192
      never-block: false
      max-flush-time: 5s
```

## What it produces

A log written inside a request (`GET /customers/7?page=2` with the header `X-Client-Id: mobile`):

```json
{"timestamp":"2026-11-11T10:15:30.123-05:00","severity":"INFO","message":"Lookup finished","logger":"co.com.pragma.logging.examples.mvc.SpringMvcApp$CustomerController","extra":{"http.path":"/customers/7","http.header.x-client-id":"mobile","http.query.page":"2","http.method":"GET","http.header.user-agent":"okhttp/4.12.0","customerId":"7"},"http":{"request":{"id":"req-7"}},"app":"orders-service","version":"1.4.2","host":"orders-7d9f-x2k","env":"local","team":"payments"}
```

- `thread` doesn't appear, `level` is called `severity` and those three fields go first.
- The `requestId` is nested in `http.request.id`.
- The MDC, the HTTP context and the key-values go inside `extra`.
- `env` and `team` are fixed fields. `env` takes the `ENVIRONMENT` variable, or `local` if it doesn't exist.

## Before you copy it

- The commented lines (`#`) are options that need a class of yours, like `enrichers` or `alerts.listeners`, or options for another format, like `csv.*`. Uncomment them when you use them: a class that doesn't exist stops startup.
- `masking.fields` replaces the default list. The example repeats the default list and adds `documentId`; remove or add the names from your domain.
- `required-fields` is commented out because every log that doesn't have the field generates an alert. Turn it on only with fields that all your logs have.
- Every option is explained in the [configuration reference](../configuration/).
