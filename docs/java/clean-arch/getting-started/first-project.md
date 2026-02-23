# Crear tu Primer Proyecto

Esta guía te llevará paso a paso para crear un servicio completo de pagos utilizando arquitectura limpia con el patrón Hexagonal.

## Paso 1: Inicializar el Proyecto

Primero, crea un directorio para tu proyecto e inicializa la estructura base:

```bash
mkdir payment-service
cd payment-service
```

Crea un archivo `build.gradle.kts` básico:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
    id("java")
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}
```

Ahora inicializa la arquitectura limpia:

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.company.payment
```

Este comando creará la estructura completa del proyecto con:
- Estructura de carpetas según la arquitectura Hexagonal
- Configuración de Spring Boot Reactive
- Archivo `.cleanarch.yml` con la configuración del proyecto
- README.md con documentación de la arquitectura

## Paso 2: Generar una Entidad de Dominio

Crea la entidad `Payment` que representa el núcleo de tu dominio:

```bash
./gradlew generateEntity \
  --name=Payment \
  --fields="id:String,amount:BigDecimal,status:PaymentStatus,createdAt:LocalDateTime"
```

Esto generará:
- `Payment.java` en el paquete de dominio
- Getters, setters y constructores
- Métodos equals, hashCode y toString

## Paso 3: Generar un Caso de Uso

Crea el caso de uso para procesar pagos:

```bash
./gradlew generateUseCase \
  --name=ProcessPayment \
  --input=PaymentRequest \
  --output=PaymentResponse
```

Esto generará:
- `ProcessPaymentUseCase.java` (puerto de entrada)
- `ProcessPaymentUseCaseImpl.java` (implementación del caso de uso)
- Clases de request y response

## Paso 4: Generar Adaptadores de Salida

### Adaptador de Persistencia MongoDB

Agrega un adaptador para persistir pagos en MongoDB:

```bash
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=PaymentPersistence \
  --entityName=Payment
```

Esto generará:
- `PaymentPersistenceMongoAdapter.java` (implementación del adaptador)
- `PaymentPersistenceMongoRepository.java` (repositorio reactivo)
- `MongoConfig.java` (configuración de MongoDB)
- Dependencias en `build.gradle`
- Propiedades en `application.yml`

### Adaptador de Caché Redis

Agrega un adaptador para cachear pagos en Redis:

```bash
./gradlew generateOutputAdapter \
  --type=redis \
  --name=PaymentCache \
  --entityName=Payment
```

Esto generará:
- Adaptador de Redis con operaciones de caché
- Configuración de Redis
- Dependencias necesarias

## Paso 5: Generar Adaptador de Entrada

### API REST

Crea un controlador REST para exponer los endpoints:

```bash
./gradlew generateInputAdapter \
  --type=rest \
  --name=Payment \
  --basePath=/api/v1/payments
```

Esto generará:
- `PaymentController.java` (controlador REST)
- DTOs de request y response
- Mapper entre DTOs y entidades de dominio
- Tests unitarios
- Configuración de WebFlux

## Paso 6: Configurar la Aplicación

Revisa y ajusta el archivo `application.yml` generado:

```yaml
server:
  port: 8080

spring:
  application:
    name: payment-service
  
  data:
    mongodb:
      uri: mongodb://localhost:27017/payment-service
      database: payment-service
    
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms

logging:
  level:
    com.company.payment: DEBUG
```

## Paso 7: Compilar y Ejecutar

Compila el proyecto:

```bash
./gradlew build
```

Ejecuta la aplicación:

```bash
./gradlew bootRun
```

Tu servicio ahora está corriendo en `http://localhost:8080`!

## Paso 8: Probar la API

Prueba el endpoint de pagos:

```bash
# Crear un pago
curl -X POST http://localhost:8080/api/v1/payments \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.50,
    "status": "PENDING"
  }'

# Obtener un pago
curl http://localhost:8080/api/v1/payments/{id}
```

## Estructura del Proyecto Generado

```
payment-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/company/payment/
│   │   │       ├── domain/
│   │   │       │   └── model/
│   │   │       │       └── Payment.java
│   │   │       ├── application/
│   │   │       │   ├── port/
│   │   │       │   │   ├── in/
│   │   │       │   │   │   └── ProcessPaymentUseCase.java
│   │   │       │   │   └── out/
│   │   │       │   │       ├── PaymentPersistencePort.java
│   │   │       │   │       └── PaymentCachePort.java
│   │   │       │   └── usecase/
│   │   │       │       └── ProcessPaymentUseCaseImpl.java
│   │   │       └── infrastructure/
│   │   │           └── adapter/
│   │   │               ├── in/
│   │   │               │   └── rest/
│   │   │               │       └── PaymentController.java
│   │   │               └── out/
│   │   │                   ├── mongodb/
│   │   │                   │   └── PaymentPersistenceMongoAdapter.java
│   │   │                   └── redis/
│   │   │                       └── PaymentCacheRedisAdapter.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/
├── build.gradle.kts
├── settings.gradle.kts
├── .cleanarch.yml
└── README.md
```

## Próximos Pasos

Ahora que tienes tu primer proyecto funcionando, puedes:

- [Aprender más sobre la Arquitectura Hexagonal](../architectures/hexagonal-single)
- [Explorar todos los comandos disponibles](../commands/)
- [Agregar más adaptadores](adding-adapters)
- [Entender la configuración del proyecto](../reference/cleanarch-yml)
- [Explorar adaptadores disponibles](../adapters/)

## Solución de Problemas

### El proyecto no compila

Asegúrate de tener Java 21 instalado:
```bash
java -version
```

### MongoDB no está disponible

Si no tienes MongoDB instalado localmente, puedes usar Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Redis no está disponible

Si no tienes Redis instalado localmente, puedes usar Docker:
```bash
docker run -d -p 6379:6379 --name redis redis:latest
```

### Errores de dependencias

Limpia y reconstruye el proyecto:
```bash
./gradlew clean build --refresh-dependencies
```
