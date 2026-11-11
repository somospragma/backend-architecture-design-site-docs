---
title: "Complete configuration: Java with Logback"
description: A logback.xml with every pragma-log property, commented and tested.
sidebar:
  order: 56
---

This `logback.xml` has every property of the pragma-log encoder, grouped and commented, with asynchronous logging. It's the same configuration as the [Spring Boot](../example-spring-boot/) one. It was tested with a Java app without a framework: it writes every log, including the pending ones when the app ends.

```xml
<!-- src/main/resources/logback.xml -->
<configuration scan="true" scanPeriod="30 seconds">  <!-- scan: applies changes without restarting -->

  <!-- When the app shuts down, writes the pending logs of the async appender -->
  <shutdownHook/>

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="co.com.pragma.logging.logback.PragmaStructuredEncoder">

      <!-- Format -->
      <format>json</format>                        <!-- json | xml | csv | custom -->
      <!-- <pretty>true</pretty> -->               <!-- local only -->
      <!-- <csvColumns>timestamp,level,requestId,message</csvColumns> -->
      <!-- <csvDelimiter>;</csvDelimiter> -->
      <!-- <csvHeader>true</csvHeader> -->
      <!-- <customFormatter>com.acme.logging.KeyValueFormatter</customFormatter> -->
      <timestampPattern>[ISO_OFFSET_DATE_TIME]</timestampPattern>
      <timeZone>America/Bogota</timeZone>

      <!-- Identification -->
      <appName>orders-service</appName>
      <appVersion>1.4.2</appVersion>
      <includeHost>true</includeHost>
      <includePid>false</includePid>

      <!-- Fields -->
      <field>env=${ENVIRONMENT:-local}</field>     <!-- repeatable -->
      <field>team=payments</field>
      <hideFields>thread</hideFields>
      <renameField>level=severity</renameField>   <!-- repeatable -->
      <renameField>requestId=$.http.request.id</renameField>
      <fieldOrder>timestamp,severity,message</fieldOrder>
      <!-- <requiredFields>traceId</requiredFields> -->
      <!-- <requiredPlaceholder>unknown</requiredPlaceholder> -->
      <extraField>extra</extraField>
      <maxFieldLength>4000</maxFieldLength>
      <!-- <enricher>com.acme.logging.TenantEnricher</enricher> -->

      <!-- Masking -->
      <maskingEnabled>true</maskingEnabled>
      <maskCharacter>*</maskCharacter>
      <maskDefaultType>FULL</maskDefaultType>
      <maskDefaultLength>4</maskDefaultLength>
      <maskFields>password,passwd,pwd,secret,token,accessToken,refreshToken,idToken,apiKey,authToken,authorization,proxyAuthorization,cookie,setCookie,cardNumber,cvv,cvc,pin,documentId</maskFields>
      <maskMaxDepth>10</maskMaxDepth>
      <!-- <maskStrategy>iban=com.acme.logging.IbanMasking</maskStrategy> -->
      <maskPattern>CARD</maskPattern>             <!-- repeatable: CARD, EMAIL, JWT or a regex -->
      <maskPattern>EMAIL</maskPattern>
      <maskPattern>JWT</maskPattern>

      <!-- Exceptions -->
      <includeStacktrace>true</includeStacktrace>
      <stacktraceMaxDepth>50</stacktraceMaxDepth>
      <stacktraceMaxLength>16384</stacktraceMaxLength>
      <stacktraceRootCauseFirst>false</stacktraceRootCauseFirst>

      <!-- Alerts -->
      <maxLogSize>65536</maxLogSize>              <!-- bytes -->
      <truncateLargeLogs>true</truncateLargeLogs>
      <alertConsole>true</alertConsole>
      <!-- <alertListener>com.acme.logging.AlertsToMetrics</alertListener> -->
    </encoder>
  </appender>

  <!-- Readable text for local: replace CONSOLE with this appender
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="co.com.pragma.logging.logback.PragmaTextEncoder">
      <color>AUTO</color>
      <levelColor>INFO=green</levelColor>
      <levelColor>WARN=#ff8800</levelColor>
      <maskPattern>CARD</maskPattern>
    </encoder>
  </appender>
  -->

  <!-- Asynchronous logging that doesn't drop logs -->
  <appender name="ASYNC" class="co.com.pragma.logging.logback.PragmaAsyncAppender">
    <queueSize>8192</queueSize>
    <neverBlock>false</neverBlock>
    <maxFlushTime>5000</maxFlushTime>
    <appender-ref ref="CONSOLE"/>
  </appender>

  <root level="INFO">
    <appender-ref ref="ASYNC"/>
  </root>
</configuration>
```

## Before you copy it

- `<shutdownHook/>` is required with `PragmaAsyncAppender`: without it, the logs waiting in the queue are lost when the app ends.
- `${ENVIRONMENT:-local}` is the Logback syntax to read an environment variable with a default value.
- The commented lines are properties that need a class of yours, like `<enricher>`, or options for another format, like `<csvColumns>`. A class that doesn't exist is reported in the Logback status and the encoder carries on with the safe values.
- `<maskFields>` replaces the default list. The example repeats it and adds `documentId`.
- To see readable text locally, replace the `CONSOLE` appender with the commented-out one, which uses `PragmaTextEncoder`.
- Every property is explained in the [Logback reference](../logback/).
