---
sidebar_position: 3
title: Java Puro
---

# Integración con Java Puro

Para aplicaciones Java sin framework (CLI, batch, servicios standalone).

## 1. Agregar dependencia

```groovy
dependencies {
    implementation 'co.pragma.logging:logging-java:1.0.0-SNAPSHOT'
}
```

## 2. Crear configuración

```yaml
# src/main/resources/pragma-log-config.yml
formatter: CONSOLE
formatterOptions:
  timestampFormatter: HH:mm:ss.SSS
  maxSizeText: 300
  includeStacktrace: true
  requiredFields:
    - message
    - timestamp
    - level
  colorConfig:
    colorize: true
    colors:
      ERROR: BRIGHT_RED
      WARNING: YELLOW
      INFO: GREEN
      DEBUG: WHITE
      TRACE: BRIGHT_BLACK
    textStyles:
      ERROR: BOLD
maxLogSize: 3000
appName: my-java-app
fieldsOrder:
  - timestamp
  - level
  - message
  - logger
  - thread
masking:
  enabled: true
  character: "*"
  defaultType: FULL
  defaultLength: 4
```

## 3. Usar PragmaLogger

```java
import co.pragma.logging.java.PragmaLogger;
import java.util.Map;

public class MyApplication {

    private static final PragmaLogger log = PragmaLogger.getLogger(MyApplication.class);

    public static void main(String[] args) {
        log.info("Application starting");

        log.info("Processing order", Map.of(
            "orderId", "ORD-001",
            "amount", 150.75
        ));

        log.debug("Validation passed", Map.of("step", "payment"));

        log.warn("Memory high", Map.of("usedMb", 850, "maxMb", 1024));

        try {
            riskyOperation();
        } catch (Exception e) {
            log.error("Processing failed", e);
            // o con campos extra:
            log.error("Processing failed", Map.of("retryCount", 3), e);
        }

        log.info("Application finished");
    }
}
```

## API de PragmaLogger

| Método | Descripción |
|--------|-------------|
| `info(String message)` | Log INFO simple |
| `info(String message, Map<String, Object> extras)` | Log INFO con campos extra |
| `debug(String message)` | Log DEBUG simple |
| `debug(String message, Map<String, Object> extras)` | Log DEBUG con campos extra |
| `warn(String message)` | Log WARNING simple |
| `warn(String message, Map<String, Object> extras)` | Log WARNING con campos extra |
| `error(String message)` | Log ERROR simple |
| `error(String message, Throwable ex)` | Log ERROR con excepción |
| `error(String message, Map<String, Object> extras)` | Log ERROR con campos extra |
| `error(String message, Map<String, Object> extras, Throwable ex)` | Log ERROR completo |
| `trace(String message)` | Log TRACE simple |
| `isDebugEnabled()` | Check antes de operaciones costosas |

## Ejemplo de salida (CONSOLE)

```
10:30:22.456 [INFO] Application starting logger=com.myapp.MyApplication thread=main
10:30:22.458 [INFO] Processing order logger=com.myapp.MyApplication thread=main orderId=ORD-001 amount=150.75
10:30:22.459 [WARNING] Memory high logger=com.myapp.MyApplication thread=main usedMb=850 maxMb=1024
10:30:22.461 [ERROR] Processing failed logger=com.myapp.MyApplication thread=main exception=java.lang.RuntimeException: Connection lost...
```

## Alternativa: Logback Encoder

Si prefieres usar SLF4J directamente (sin PragmaLogger), puedes usar el encoder con un `logback.xml`:

```xml
<!-- src/main/resources/logback.xml -->
<configuration>
    <appender name="PRAGMA_LOG" class="ch.qos.logback.core.ConsoleAppender">
        <encoder class="co.pragma.logging.java.encoder.PragmaLogbackEncoder"/>
    </appender>
    <root level="INFO">
        <appender-ref ref="PRAGMA_LOG"/>
    </root>
</configuration>
```

Y luego usas SLF4J normalmente:

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

private static final Logger log = LoggerFactory.getLogger(MyApp.class);
log.info("Hello structured world");
```

:::tip La librería incluye un logback.xml por defecto
No necesitas crear el archivo `logback.xml` manualmente. La librería lo trae empaquetado. Solo créalo si quieres personalizar el comportamiento de Logback.
:::
