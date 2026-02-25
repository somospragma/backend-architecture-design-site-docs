# Adaptadores Disponibles

Los adaptadores son componentes que conectan el núcleo de tu aplicación con sistemas externos. El plugin proporciona adaptadores listos para usar que se integran perfectamente con las arquitecturas limpias.

## Matriz de Disponibilidad General

### Adaptadores de Entrada (Entry Points / Driving Adapters)

| Adaptador | Spring Reactive | Spring Imperative | Quarkus Reactive | Quarkus Imperative |
|-----------|----------------|-------------------|------------------|-------------------|
| **REST** | ✅ | ✅ | 🚧 | 🚧 |
| **GraphQL** | ✅ | ✅ | 🔜 | 🔜 |
| **gRPC** | ✅ | ✅ | 🔜 | 🔜 |
| **SQS Consumer** | ✅ | ✅ | 🔜 | 🔜 |
| **WebSocket** | 🔜 | 🔜 | 🔜 | 🔜 |

### Adaptadores de Salida (Driven Adapters)

| Adaptador | Spring Reactive | Spring Imperative | Quarkus Reactive | Quarkus Imperative |
|-----------|----------------|-------------------|------------------|-------------------|
| **Redis** | ✅ | ✅ | 🚧 | 🚧 |
| **MongoDB** | ✅ | ✅ | 🚧 | 🚧 |
| **PostgreSQL** | ✅ | ✅ | 🚧 | 🚧 |
| **HTTP Client** | ✅ | ✅ | 🚧 | 🚧 |
| **DynamoDB** | ✅ | ✅ | 🔜 | 🔜 |
| **SQS Producer** | ✅ | ✅ | 🔜 | 🔜 |
| **Kafka** | 🚧 | 🚧 | 🚧 | 🚧 |
| **MySQL** | 🔜 | 🔜 | 🔜 | 🔜 |
| **RabbitMQ** | 🔜 | 🔜 | 🔜 | 🔜 |

**Leyenda:**
- ✅ Disponible y probado
- 🚧 En desarrollo
- 🔜 Planeado para futuras versiones

## Tipos de Adaptadores

### Adaptadores de Entrada (Driving Adapters)

Los adaptadores de entrada reciben solicitudes del exterior y las dirigen hacia tu aplicación:

- **[REST Controller](./rest-controller.md)** - Expone endpoints HTTP REST para tu aplicación
  - **Reactive**: Spring WebFlux con `Mono<T>`, `Flux<T>`
  - **Imperative**: Spring MVC con tipos síncronos
  - Características: Validación, manejo de errores, códigos HTTP
  
- **GraphQL** - Proporciona una API GraphQL con resolvers
  - **Reactive**: Spring GraphQL con `Mono<T>`, `Flux<T>`
  - **Imperative**: Spring GraphQL con tipos síncronos
  - Características: Subscriptions, DataLoader, schema-first
  
- **gRPC** - Servidor gRPC para comunicación de alto rendimiento
  - **Reactive**: ReactorStub para operaciones no bloqueantes
  - **Imperative**: BlockingStub para operaciones síncronas
  - Características: Protocol Buffers, streaming bidireccional, interceptores
  
- **SQS Consumer** - Consumidor de mensajes de AWS SQS
  - **Reactive**: SqsAsyncClient con `Mono<T>`, `Flux<T>`
  - **Imperative**: SqsClient con tipos síncronos
  - Características: @SqsListener, procesamiento de mensajes, manejo de errores
  
- **WebSocket** (Próximamente) - Comunicación bidireccional en tiempo real
  - Características: STOMP, broadcast, gestión de sesiones

### Adaptadores de Salida (Driven Adapters)

Los adaptadores de salida permiten que tu aplicación se comunique con servicios externos:

#### Bases de Datos

- **[MongoDB](./mongodb.md)** - Adaptador para base de datos NoSQL MongoDB
  - **Reactive**: Spring Data MongoDB Reactive con `Mono<T>`, `Flux<T>`
  - **Imperative**: Spring Data MongoDB con tipos síncronos
  - Operaciones: CRUD completo, queries personalizadas
  
- **[Redis](./redis.md)** - Adaptador para caché y estructuras de datos Redis
  - **Reactive**: Spring Data Redis Reactive con Lettuce, retorna `Mono<T>`, `Flux<T>`
  - **Imperative**: RedisTemplate con tipos síncronos
  - Operaciones: Get, Set, Delete, Exists, TTL
  
- **[PostgreSQL](./postgresql.md)** - Adaptador para PostgreSQL
  - **Reactive**: Spring Data R2DBC con `Mono<T>`, `Flux<T>`
  - **Imperative**: Spring Data JPA con HikariCP, tipos síncronos
  - Operaciones: CRUD completo, queries personalizadas
  
- **[DynamoDB](./dynamodb.md)** - Adaptador para AWS DynamoDB
  - **Reactive**: AWS SDK v2 DynamoDbAsyncClient con `Mono<T>`, `Flux<T>`
  - **Imperative**: AWS SDK v2 DynamoDbClient con tipos síncronos
  - Operaciones: CRUD completo, queries, scans
  
- **MySQL** (Próximamente) - Adaptador para MySQL
  - Framework planeado: Spring Data R2DBC con r2dbc-mysql (reactive) / Spring Data JPA (imperative)

#### Clientes HTTP

- **[HTTP Client](./http-client.md)** - Cliente HTTP para consumir APIs externas
  - **Reactive**: Spring WebFlux WebClient con `Mono<T>`, `Flux<T>`
  - **Imperative**: RestTemplate con tipos síncronos
  - Operaciones: GET, POST, PUT, DELETE, PATCH
  - Características: Retry, timeout, circuit breaker

#### Mensajería

- **SQS Producer** - Productor de mensajes para AWS SQS
  - **Reactive**: AWS SDK v2 SqsAsyncClient con `Mono<T>`
  - **Imperative**: AWS SDK v2 SqsClient con tipos síncronos
  - Operaciones: Send, sendBatch, manejo de errores
  
- **Kafka** (En desarrollo) - Productor y consumidor de mensajes Kafka
  - Framework: Reactor Kafka (reactive) / Spring Kafka (imperative)
  - Operaciones: Send, consume con backpressure
  - Retorna: `Mono<T>`, `Flux<T>` (reactive) / tipos síncronos (imperative)
  
- **RabbitMQ** (Próximamente) - Cliente para RabbitMQ
  - Framework planeado: Spring AMQP Reactive / Spring AMQP

## Paradigmas Soportados

Cada adaptador está disponible en dos paradigmas:

### Reactivo (Spring WebFlux / Quarkus Reactive)
- Operaciones no bloqueantes
- Retorna `Mono<T>` o `Flux<T>` (Spring) / `Uni<T>` o `Multi<T>` (Quarkus)
- Ideal para aplicaciones de alta concurrencia
- **Casos de uso también retornan tipos reactivos**

**Importante sobre Dependencias Reactivas:**

En proyectos reactivos, la capa de casos de uso (use cases) **debe** usar tipos reactivos (`Mono<T>`, `Flux<T>`) para mantener el flujo reactivo completo:

```java
// ✅ CORRECTO - Use case reactivo
public interface CreateUserUseCase {
    Mono<User> execute(UserData userData);
}

// ❌ INCORRECTO - Bloquea el flujo reactivo
public interface CreateUserUseCase {
    User execute(UserData userData);  // Esto bloquearía el flujo
}
```

Esto permite:
- Propagación del flujo reactivo desde el adaptador de entrada hasta el adaptador de salida
- Operaciones no bloqueantes en toda la cadena
- Mejor rendimiento y escalabilidad
- Backpressure automático

### Imperativo (Spring MVC / Quarkus Imperative)
- Operaciones bloqueantes tradicionales
- Retorna `T` o `List<T>`
- Ideal para aplicaciones CRUD estándar
- Casos de uso retornan tipos síncronos

## Frameworks Soportados

Los adaptadores están disponibles para:

- **Spring Boot** - Reactive (WebFlux) e Imperative (MVC)
- **Quarkus** - Reactive (Mutiny) e Imperative (en desarrollo)

## Compatibilidad por Arquitectura

Todos los adaptadores son compatibles con todas las arquitecturas soportadas:

| Arquitectura | Descripción | Ubicación de Adaptadores |
|--------------|-------------|-------------------------|
| `hexagonal-single` | Módulo único | `infrastructure/entry-points/`, `infrastructure/driven-adapters/` |
| `hexagonal-multi` | Multi-módulo (3 módulos) | `infrastructure/src/main/java/.../entry-points/`, `infrastructure/src/main/java/.../driven-adapters/` |
| `hexagonal-multi-granular` | Multi-módulo granular (6+ módulos) | `entry-points/`, `adapters/` (módulos separados) |
| `onion-single` | Módulo único estilo Onion | `infrastructure/adapter/in/`, `infrastructure/adapter/out/` |

## Cómo Usar los Adaptadores

### Generar un Adaptador de Salida

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=mongodb \
  --packageName=com.pragma.user.infrastructure.driven-adapters.mongodb
```

### Generar un Adaptador de Entrada

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest \
  --type=rest
```

## Configuración

Cada adaptador incluye:

1. **Código del Adaptador** - Implementación lista para usar
2. **Configuración** - Clases de configuración de Spring/Quarkus
3. **Propiedades** - Configuración en `application.yml`
4. **Dependencias** - Se agregan automáticamente al `build.gradle.kts`
5. **Tests** - Tests de integración con Testcontainers (cuando aplica)
6. **Mappers** - MapStruct mappers para conversión de entidades

## Roadmap de Adaptadores

### Q1 2026 ✅ COMPLETADO
- ✅ REST (Spring Reactive)
- ✅ Redis (Spring Reactive)
- ✅ MongoDB (Spring Reactive)
- ✅ PostgreSQL (Spring Reactive)
- ✅ HTTP Client (Spring Reactive)
- ✅ DynamoDB (Spring Reactive)
- ✅ SQS Producer (Spring Reactive)
- ✅ SQS Consumer (Spring Reactive)
- ✅ GraphQL (Spring Reactive)
- ✅ gRPC (Spring Reactive)

### Q2 2026 ✅ COMPLETADO
- ✅ REST (Spring Imperative)
- ✅ Redis (Spring Imperative)
- ✅ MongoDB (Spring Imperative)
- ✅ PostgreSQL (Spring Imperative)
- ✅ HTTP Client (Spring Imperative)
- ✅ DynamoDB (Spring Imperative)
- ✅ SQS Producer (Spring Imperative)
- ✅ SQS Consumer (Spring Imperative)
- ✅ GraphQL (Spring Imperative)
- ✅ gRPC (Spring Imperative)

### Q3 2026
- 🚧 Kafka (Spring Reactive)
- 🚧 Kafka (Spring Imperative)
- 🔜 Quarkus Reactive (todos los adaptadores)

### Q4 2026
- 🔜 WebSocket (Spring Reactive)
- 🔜 WebSocket (Spring Imperative)
- 🔜 RabbitMQ (Spring Reactive)
- 🔜 RabbitMQ (Spring Imperative)
- 🔜 MySQL (Spring Reactive)
- 🔜 MySQL (Spring Imperative)
- 🔜 Quarkus Imperative (todos los adaptadores)

## Próximos Pasos

- Explora los [detalles de cada adaptador](./mongodb.md) para ver ejemplos de uso
- Consulta la [guía de comandos](../commands/generate-output-adapter.md) para opciones avanzadas
- Revisa la [referencia de configuración](../reference/cleanarch-yml.md) para personalizar adaptadores
- Lee sobre [programación reactiva](../guides/frameworks/spring-reactive) para entender el paradigma reactivo
