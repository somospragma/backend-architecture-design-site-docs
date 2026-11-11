---
title: "Configuración completa: Java con Logback"
description: Un logback.xml con todas las propiedades de pragma-log, comentado y probado.
sidebar:
  order: 56
---

Este `logback.xml` tiene todas las propiedades del encoder de pragma-log, agrupadas y comentadas, con logging asíncrono. Es la misma configuración que la de [Spring Boot](../example-spring-boot/). Se probó con una app Java sin framework: escribe todos los logs, incluidos los pendientes al terminar la app.

```xml
<!-- src/main/resources/logback.xml -->
<configuration scan="true" scanPeriod="30 seconds">  <!-- scan: aplica cambios sin reiniciar -->

  <!-- Al apagar la app escribe los logs pendientes del appender asíncrono -->
  <shutdownHook/>

  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="co.com.pragma.logging.logback.PragmaStructuredEncoder">

      <!-- Formato -->
      <format>json</format>                        <!-- json | xml | csv | custom -->
      <!-- <pretty>true</pretty> -->               <!-- solo en local -->
      <!-- <csvColumns>timestamp,level,requestId,message</csvColumns> -->
      <!-- <csvDelimiter>;</csvDelimiter> -->
      <!-- <csvHeader>true</csvHeader> -->
      <!-- <customFormatter>com.acme.logging.KeyValueFormatter</customFormatter> -->
      <timestampPattern>[ISO_OFFSET_DATE_TIME]</timestampPattern>
      <timeZone>America/Bogota</timeZone>

      <!-- Identificación -->
      <appName>orders-service</appName>
      <appVersion>1.4.2</appVersion>
      <includeHost>true</includeHost>
      <includePid>false</includePid>

      <!-- Campos -->
      <field>env=${ENVIRONMENT:-local}</field>     <!-- repetible -->
      <field>team=payments</field>
      <hideFields>thread</hideFields>
      <renameField>level=severity</renameField>   <!-- repetible -->
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
      <maskPattern>CARD</maskPattern>             <!-- repetible: CARD, EMAIL, JWT o una regex -->
      <maskPattern>EMAIL</maskPattern>
      <maskPattern>JWT</maskPattern>

      <!-- Excepciones -->
      <includeStacktrace>true</includeStacktrace>
      <stacktraceMaxDepth>50</stacktraceMaxDepth>
      <stacktraceMaxLength>16384</stacktraceMaxLength>
      <stacktraceRootCauseFirst>false</stacktraceRootCauseFirst>

      <!-- Alertas -->
      <maxLogSize>65536</maxLogSize>              <!-- bytes -->
      <truncateLargeLogs>true</truncateLargeLogs>
      <alertConsole>true</alertConsole>
      <!-- <alertListener>com.acme.logging.AlertsToMetrics</alertListener> -->
    </encoder>
  </appender>

  <!-- Texto legible para local: cambia CONSOLE por este appender
  <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="co.com.pragma.logging.logback.PragmaTextEncoder">
      <color>AUTO</color>
      <levelColor>INFO=green</levelColor>
      <levelColor>WARN=#ff8800</levelColor>
      <maskPattern>CARD</maskPattern>
    </encoder>
  </appender>
  -->

  <!-- Logging asíncrono que no descarta logs -->
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

## Antes de copiarlo

- `<shutdownHook/>` es necesario con `PragmaAsyncAppender`: sin él, los logs que esperan en la cola se pierden cuando la app termina.
- `${ENVIRONMENT:-local}` es la sintaxis de Logback para leer una variable de ambiente con un valor por defecto.
- Las líneas comentadas son propiedades que necesitan una clase tuya, como `<enricher>`, u opciones de otro formato, como `<csvColumns>`. Una clase que no existe se reporta en el estado de Logback y el encoder sigue con los valores seguros.
- `<maskFields>` reemplaza la lista por defecto. El ejemplo la repite y agrega `documentId`.
- Para ver texto legible en local, cambia el appender `CONSOLE` por el que está comentado, con `PragmaTextEncoder`.
- Cada propiedad está explicada en la [referencia de Logback](../logback/).
