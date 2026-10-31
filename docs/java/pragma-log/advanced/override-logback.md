---
sidebar_position: 3
title: Personalizar Logback
---

# Personalizar Logback

La librería trae su propio `logback-spring.xml` por defecto. Si necesitas personalizar el comportamiento de Logback, crea tu propio archivo en `src/main/resources/` y este tendrá prioridad automáticamente.

## Cuándo personalizar

- Agregar un appender de archivo
- Usar AsyncAppender para logging asíncrono
- Cambiar niveles de log por paquete
- Agregar múltiples destinos (consola + archivo + remoto)

## Ejemplo: AsyncAppender

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Appender principal con pragma-log -->
    <appender name="PRAGMA_LOG" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="co.pragma.logging.spring.encoder.PragmaLogEncoder"/>
    </appender>

    <!-- Wrapper asíncrono para alto throughput -->
    <appender name="ASYNC" class="ch.qos.logback.classic.AsyncAppender">
        <appender-ref ref="PRAGMA_LOG"/>
        <queueSize>1024</queueSize>
        <discardingThreshold>0</discardingThreshold>
        <includeCallerData>false</includeCallerData>
    </appender>

    <root level="INFO">
        <appender-ref ref="ASYNC"/>
    </root>
</configuration>
```

## Ejemplo: Consola + Archivo

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <!-- Consola con pragma-log -->
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="co.pragma.logging.spring.encoder.PragmaLogEncoder"/>
    </appender>

    <!-- Archivo rotativo -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>logs/app.log</file>
        <encoder class="co.pragma.logging.spring.encoder.PragmaLogEncoder"/>
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">
            <fileNamePattern>logs/app-%d{yyyy-MM-dd}.%i.log</fileNamePattern>
            <maxFileSize>50MB</maxFileSize>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
    </appender>

    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</configuration>
```

## Ejemplo: Niveles por paquete

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="PRAGMA_LOG" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="co.pragma.logging.spring.encoder.PragmaLogEncoder"/>
    </appender>

    <!-- Tu código en DEBUG -->
    <logger name="com.myapp" level="DEBUG"/>

    <!-- Silenciar frameworks -->
    <logger name="org.springframework" level="WARN"/>
    <logger name="org.hibernate" level="WARN"/>
    <logger name="co.pragma.logging.core" level="WARN"/>

    <root level="INFO">
        <appender-ref ref="PRAGMA_LOG"/>
    </root>
</configuration>
```

## Encoder por módulo

| Módulo | Clase del Encoder |
|--------|-------------------|
| `logging-spring` | `co.pragma.logging.spring.encoder.PragmaLogEncoder` |
| `logging-reactive` | `co.pragma.logging.reactive.encoder.ReactivePragmaLogEncoder` |
| `logging-java` | `co.pragma.logging.java.encoder.PragmaLogbackEncoder` |

:::tip Si no creas logback-spring.xml
La librería funciona sin él. Solo créalo cuando necesites personalizar Logback más allá de lo que pragma-log-config.yml ofrece.
:::
