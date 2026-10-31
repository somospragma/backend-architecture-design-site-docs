---
sidebar_position: 1
title: Spring Boot MVC
---

# Integración con Spring Boot MVC

## 1. Agregar dependencia

```groovy
// build.gradle
repositories {
    mavenLocal()  // o tu repositorio corporativo
    mavenCentral()
}

dependencies {
    implementation 'co.pragma.logging:logging-spring:1.0.0-SNAPSHOT'
}
```

## 2. Crear configuración

Crea el archivo `src/main/resources/pragma-log-config.yml`:

```yaml
formatter: JSON
formatterOptions:
  timestampFormatter: yyyy-MM-dd HH:mm:ss.SSS
  prettyPrint: true
  maxSizeText: 500
  includeStacktrace: true
  requiredFields:
    - message
    - timestamp
    - level
  colorConfig:
    colorize: false
maxLogSize: 5000
appName: mi-servicio
fieldsOrder:
  - timestamp
  - level
  - message
  - logger
  - thread
  - requestId
  - traceId
  - userId
masking:
  enabled: true
  character: "*"
  defaultType: FULL
  defaultLength: 8
```

## 3. Activar component scan

```java
@SpringBootApplication
@ComponentScan(basePackages = {"com.myapp", "co.pragma.logging.spring"})
public class MyApplication {
    public static void main(String[] args) {
        SpringApplication.run(MyApplication.class, args);
    }
}
```

:::tip No necesitas logback-spring.xml
La librería trae su propio `logback-spring.xml` empaquetado en el JAR. Si necesitas personalizar Logback (agregar file appender, async, etc.), puedes crear tu propio archivo y este tendrá prioridad.
:::

## 4. Listo — usa el logger normalmente

```java
@Slf4j
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/{id}")
    public UserResponse getUser(@PathVariable String id) {
        log.info("Fetching user with id: {}", id);
        return userService.findById(id);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        log.info("Login attempt for: {}", request.getUsername());
        return authService.authenticate(request);
    }
}
```

## Contexto HTTP automático

La librería captura automáticamente del request HTTP:

| Campo | Header | Comportamiento |
|-------|--------|----------------|
| `requestId` | `X-Request-Id` | Si no viene en header, genera UUID automáticamente |
| `traceId` | `X-Trace-Id` | Solo se agrega si el header está presente |
| Campos adicionales | Configurados en `additionalFields` | Según source: header, query, fixed |

### Ejemplo con headers

```bash
curl -H "X-Request-Id: my-req-123" \
     -H "X-Trace-Id: trace-from-gateway" \
     http://localhost:8080/api/users/1
```

**Log generado:**
```json
{
  "timestamp" : "2026-01-15 10:30:22.456",
  "level" : "INFO",
  "message" : "Fetching user with id: 1",
  "logger" : "com.myapp.UserController",
  "thread" : "http-nio-8080-exec-1",
  "requestId" : "my-req-123",
  "traceId" : "trace-from-gateway"
}
```

## Campos adicionales desde headers

```yaml
additionalFields:
  - name: userId
    source: header
    key: X-User-Id
  - name: tenantId
    source: header
    key: X-Tenant-Id
  - name: environment
    source: fixed
    value: "production"
```

Estos campos se extraen del request y se agregan a todos los logs de esa petición.

## Ejemplo completo de salida

Con la configuración de arriba y un request con headers:

```json
{
  "timestamp" : "2026-01-15 10:30:22.456",
  "level" : "INFO",
  "message" : "Fetching user with id: 1",
  "logger" : "com.myapp.UserController",
  "thread" : "http-nio-8080-exec-1",
  "requestId" : "a1b2c3d4-5678-90ab-cdef",
  "userId" : "user-from-header",
  "tenantId" : "tenant-abc"
}
```
