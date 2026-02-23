# Adaptadores Disponibles

Los adaptadores son componentes que conectan el núcleo de tu aplicación con sistemas externos. El plugin proporciona adaptadores listos para usar que se integran perfectamente con las arquitecturas limpias.

## Matriz de Disponibilidad General

### Adaptadores de Entrada (Entry Points / Driving Adapters)

| Adaptador | Spring Reactive | Spring Imperative | Quarkus Reactive | Quarkus Imperative |
|-----------|----------------|-------------------|------------------|-------------------|
| **REST** | ✅ | 🚧 | 🚧 | 🚧 |
| **GraphQL** | 🔜 | 🔜 | 🔜 | 🔜 |
| **gRPC** | 🔜 | 🔜 | 🔜 | 🔜 |
| **WebSocket** | 🔜 | 🔜 | 🔜 | 🔜 |

### Adaptadores de Salida (Driven Adapters)

| Adaptador | Spring Reactive | Spring Imperative | Quarkus Reactive | Quarkus Imperative |
|-----------|----------------|-------------------|------------------|-------------------|
| **Redis** | ✅ | 🚧 | 🚧 | 🚧 |
| **MongoDB** | ✅ | 🚧 | 🚧 | 🚧 |
| **PostgreSQL** | ✅ | 🚧 | 🚧 | 🚧 |
| **REST Client** | 🚧 | 🚧 | 🚧 | 🚧 |
| **Kafka** | 🚧 | 🚧 | 🚧 | 🚧 |
| **DynamoDB** | 🔜 | 🔜 | 🔜 | 🔜 |
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
  - Framework: Spring WebFlux (Reactive)
  - Retorna: `Mono<T>`, `Flux<T>`
  - Características: Validación, manejo de errores, códigos HTTP
  
- **GraphQL** (Próximamente) - Proporciona una API GraphQL con resolvers reactivos o imperativos
  - Frameworks planeados: Spring GraphQL, Quarkus SmallRye GraphQL
  - Características: Subscriptions, DataLoader, schema-first
  
- **gRPC** (Próximamente) - Servidor gRPC para comunicación de alto rendimiento
  - Características: Protocol Buffers, streaming bidireccional, interceptores
  
- **WebSocket** (Próximamente) - Comunicación bidireccional en tiempo real
  - Características: STOMP, broadcast, gestión de sesiones

### Adaptadores de Salida (Driven Adapters)

Los adaptadores de salida permiten que tu aplicación se comunique con servicios externos:

#### Bases de Datos

- **[MongoDB](./mongodb.md)** - Adaptador para base de datos NoSQL MongoDB
  - Framework: Spring Data MongoDB Reactive
  - Operaciones: CRUD completo, queries personalizadas
  - Retorna: `Mono<T>`, `Flux<T>`
  
- **[Redis](./redis.md)** - Adaptador para caché y estructuras de datos Redis
  - Framework: Spring Data Redis Reactive con Lettuce
  - Operaciones: Get, Set, Delete, Exists, TTL
  - Retorna: `Mono<T>`, `Flux<T>`
  
- **PostgreSQL** - Adaptador reactivo para PostgreSQL
  - Framework: Spring Data R2DBC
  - Operaciones: CRUD completo con R2DBC
  - Retorna: `Mono<T>`, `Flux<T>`
  
- **DynamoDB** (Próximamente) - Adaptador para AWS DynamoDB
  - Framework planeado: AWS SDK v2 con soporte reactivo
  
- **MySQL** (Próximamente) - Adaptador reactivo para MySQL
  - Framework planeado: Spring Data R2DBC con r2dbc-mysql

#### Clientes HTTP

- **[HTTP Client](./http-client.md)** - Cliente HTTP para consumir APIs externas
  - Framework: Spring WebFlux WebClient
  - Operaciones: GET, POST, PUT, DELETE, PATCH
  - Características: Retry, timeout, circuit breaker
  - Retorna: `Mono<T>`, `Flux<T>`

#### Mensajería

- **Kafka** (En desarrollo) - Productor y consumidor de mensajes Kafka
  - Framework: Reactor Kafka
  - Operaciones: Send, consume con backpressure
  - Retorna: `Mono<T>`, `Flux<T>`
  
- **RabbitMQ** (Próximamente) - Cliente para RabbitMQ
  - Framework planeado: Spring AMQP Reactive
  
- **SQS** (Próximamente) - Productor de mensajes para AWS SQS
  - Framework planeado: AWS SDK v2 con soporte reactivo

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

### Q1 2026
- ✅ REST (Spring Reactive)
- ✅ Redis (Spring Reactive)
- ✅ MongoDB (Spring Reactive)
- ✅ PostgreSQL (Spring Reactive)

### Q2 2026
- 🚧 REST Client (Spring Reactive)
- 🚧 Kafka (Spring Reactive)
- 🚧 REST (Spring Imperative)
- 🚧 Redis (Spring Imperative)

### Q3 2026
- 🔜 GraphQL (Spring Reactive)
- 🔜 gRPC (Spring Reactive)
- 🔜 DynamoDB (Spring Reactive)
- 🔜 Quarkus Reactive (todos los adaptadores)

### Q4 2026
- 🔜 WebSocket (Spring Reactive)
- 🔜 RabbitMQ (Spring Reactive)
- 🔜 SQS (Spring Reactive)
- 🔜 Quarkus Imperative (todos los adaptadores)

## Próximos Pasos

- Explora los [detalles de cada adaptador](./mongodb.md) para ver ejemplos de uso
- Consulta la [guía de comandos](../commands/generate-output-adapter.md) para opciones avanzadas
- Revisa la [referencia de configuración](../reference/cleanarch-yml.md) para personalizar adaptadores
- Lee sobre [programación reactiva](../guides/frameworks/spring-reactive) para entender el paradigma reactivo
