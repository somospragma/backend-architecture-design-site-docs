---
sidebar_position: 4
title: Quarkus
---

# Integración con Quarkus

Quarkus usa JBoss Logging internamente (que delega a java.util.logging). La integración usa un `Handler` de JUL personalizado.

## 1. Agregar dependencia

```groovy
dependencies {
    implementation 'co.pragma.logging:logging-quarkus:1.0.0-SNAPSHOT'
}
```

## 2. Crear configuración

```yaml
# src/main/resources/pragma-log-config.yml
formatter: JSON
formatterOptions:
  timestampFormatter: yyyy-MM-dd HH:mm:ss
  prettyPrint: false
  maxSizeText: 500
  includeStacktrace: true
  requiredFields:
    - message
    - timestamp
    - level
  colorConfig:
    colorize: false
maxLogSize: 5000
appName: quarkus-service
fieldsOrder:
  - timestamp
  - level
  - message
  - logger
  - thread
masking:
  enabled: true
  character: "X"
  defaultType: FULL
  defaultLength: 4
```

## 3. Registrar el handler

### Opción A: Programáticamente (recomendado para apps standalone)

```java
import co.pragma.logging.quarkus.handler.PragmaLogHandler;
import java.util.logging.Logger;
import java.util.logging.Level;

public class AppStartup {

    public void onStart(@Observes StartupEvent ev) {
        Logger rootLogger = Logger.getLogger("");
        // Remover handlers por defecto
        for (var handler : rootLogger.getHandlers()) {
            rootLogger.removeHandler(handler);
        }
        // Agregar pragma-log handler
        PragmaLogHandler pragmaHandler = new PragmaLogHandler();
        pragmaHandler.setLevel(Level.ALL);
        rootLogger.addHandler(pragmaHandler);
    }
}
```

### Opción B: CDI Producer (para inyectar el formatter)

```java
import co.pragma.logging.core.formatter.LogFormatter;
import jakarta.inject.Inject;

@ApplicationScoped
public class MyService {

    @Inject
    LogFormatter formatter;

    // El PragmaLogProducer CDI bean produce el formatter configurado
}
```

## 4. Usar normalmente

```java
import java.util.logging.Logger;

@ApplicationScoped
public class PaymentService {

    private static final Logger log = Logger.getLogger(PaymentService.class.getName());

    public void processPayment(String orderId) {
        log.info(String.format("Processing payment for order: %s", orderId));
    }

    public void handleError(Exception e) {
        log.log(Level.SEVERE, "Payment processing failed", e);
    }
}
```

## Mapeo de niveles

| JUL Level | pragma-log Level |
|-----------|-----------------|
| `SEVERE` | `ERROR` |
| `WARNING` | `WARNING` |
| `INFO` | `INFO` |
| `FINE` | `DEBUG` |
| `FINER`, `FINEST` | `TRACE` |

## Ejemplo de salida

```json
{"timestamp":"2026-01-15 10:30:22","level":"INFO","message":"Processing payment for order: ORD-001","logger":"com.myapp.PaymentService","thread":"executor-thread-1"}
{"timestamp":"2026-01-15 10:30:23","level":"ERROR","message":"Payment processing failed","logger":"com.myapp.PaymentService","thread":"executor-thread-1","exception":"..."}
```
