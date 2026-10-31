---
sidebar_position: 2
title: Spring WebFlux
---

# Integración con Spring WebFlux

## 1. Agregar dependencia

```groovy
dependencies {
    implementation 'co.pragma.logging:logging-reactive:1.0.0-SNAPSHOT'
}
```

## 2. Crear configuración

```yaml
# src/main/resources/pragma-log-config.yml
formatter: JSON
formatterOptions:
  timestampFormatter: yyyy-MM-dd'T'HH:mm:ss.SSS
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
appName: webflux-service
fieldsOrder:
  - timestamp
  - level
  - message
  - logger
  - thread
  - requestId
  - traceId
masking:
  enabled: true
  character: "*"
  defaultType: FULL
  defaultLength: 8
```

## 3. Activar component scan

```java
@SpringBootApplication
@ComponentScan(basePackages = {"com.myapp", "co.pragma.logging.reactive"})
public class MyReactiveApp {
    public static void main(String[] args) {
        SpringApplication.run(MyReactiveApp.class, args);
    }
}
```

## 4. Usar normalmente

```java
@Slf4j
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @GetMapping("/{id}")
    public Mono<Order> getOrder(@PathVariable String id) {
        log.info("Fetching order: {}", id);
        return orderService.findById(id);
    }

    @PostMapping
    public Mono<Order> createOrder(@RequestBody OrderRequest request) {
        log.info("Creating order for customer: {}", request.customerId());
        return orderService.create(request);
    }
}
```

## Diferencia con Spring MVC: Reactor Context vs MDC

En Spring MVC, el contexto se propaga con MDC (thread-local). En WebFlux, los requests saltan entre threads, así que MDC no es confiable.

La librería maneja esto automáticamente:

1. **`ReactiveLogContextFilter`** (WebFilter) captura headers HTTP y los guarda en Reactor Context
2. Con `spring.reactor.context-propagation=auto`, Reactor propaga automáticamente el contexto al MDC antes de cada log

### Agregar a application.properties

```properties
spring.reactor.context-propagation=auto
```

### Contexto manual en cadenas reactivas

Si necesitas agregar contexto manualmente dentro de una cadena reactiva:

```java
import co.pragma.logging.reactive.context.ReactiveLogContext;

public Mono<Order> processOrder(String orderId) {
    return orderRepository.findById(orderId)
        .doOnNext(order -> log.info("Processing order: {}", order.getId()))
        .contextWrite(ReactiveLogContext.put("orderId", orderId))
        .contextWrite(ReactiveLogContext.put("customerId", "cust-123"));
}
```

## Ejemplo de salida

```json
{"timestamp":"2026-01-15T10:30:22.456","level":"INFO","message":"Fetching order: ORD-001","logger":"com.myapp.OrderController","thread":"reactor-http-nio-2","requestId":"auto-generated-uuid"}
```

:::note Thread names en WebFlux
Notarás que el campo `thread` muestra nombres como `reactor-http-nio-2`, `parallel-1`, etc. Esto es normal en aplicaciones reactivas.
:::
