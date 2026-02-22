# Adaptadores Disponibles

Los adaptadores son componentes que conectan el núcleo de tu aplicación con sistemas externos. El plugin proporciona adaptadores listos para usar que se integran perfectamente con las arquitecturas limpias.

## Tipos de Adaptadores

### Adaptadores de Entrada (Driving Adapters)

Los adaptadores de entrada reciben solicitudes del exterior y las dirigen hacia tu aplicación:

- **[REST Controller](./rest-controller.md)** - Expone endpoints HTTP REST para tu aplicación
- **[GraphQL](./graphql.md)** - Proporciona una API GraphQL con resolvers reactivos o imperativos
- **[gRPC](./grpc.md)** - Servidor gRPC para comunicación de alto rendimiento

### Adaptadores de Salida (Driven Adapters)

Los adaptadores de salida permiten que tu aplicación se comunique con servicios externos:

#### Bases de Datos

- **[MongoDB](./mongodb.md)** - Adaptador para base de datos NoSQL MongoDB
- **[DynamoDB](./dynamodb.md)** - Adaptador para AWS DynamoDB
- **[JPA](./jpa.md)** - Adaptador para bases de datos relacionales usando JPA/Hibernate
- **[R2DBC](./r2dbc.md)** - Adaptador reactivo para bases de datos relacionales

#### Caché y Almacenamiento

- **[Redis](./redis.md)** - Adaptador para caché y estructuras de datos Redis

#### Mensajería

- **[SQS](./sqs.md)** - Productor de mensajes para AWS SQS
- **[Kafka](./kafka.md)** - Productor y consumidor de mensajes Kafka

#### Clientes HTTP

- **[HTTP Client](./http-client.md)** - Cliente HTTP para consumir APIs externas

## Paradigmas Soportados

Cada adaptador está disponible en dos paradigmas:

### Reactivo (Spring WebFlux / Quarkus Reactive)
- Operaciones no bloqueantes
- Retorna `Mono<T>` o `Flux<T>` (Spring) / `Uni<T>` o `Multi<T>` (Quarkus)
- Ideal para aplicaciones de alta concurrencia

### Imperativo (Spring MVC / Quarkus Imperative)
- Operaciones bloqueantes tradicionales
- Retorna `T` o `List<T>`
- Ideal para aplicaciones CRUD estándar

## Frameworks Soportados

Los adaptadores están disponibles para:

- **Spring Boot** - Reactive (WebFlux) e Imperative (MVC)
- **Quarkus** - Reactive (Mutiny) e Imperative

## Cómo Usar los Adaptadores

### Generar un Adaptador de Salida

```bash
gradle generateOutputAdapter --name=mongodb --type=driven
```

### Generar un Adaptador de Entrada

```bash
gradle generateInputAdapter --name=rest --type=driving
```

## Configuración

Cada adaptador incluye:

1. **Código del Adaptador** - Implementación lista para usar
2. **Configuración** - Clases de configuración de Spring/Quarkus
3. **Propiedades** - Configuración en `application.yml`
4. **Dependencias** - Se agregan automáticamente al `build.gradle`
5. **Tests** - Tests de integración con Testcontainers

## Próximos Pasos

- Explora los [detalles de cada adaptador](./mongodb.md) para ver ejemplos de uso
- Consulta la [guía de comandos](../commands/generate-output-adapter.md) para opciones avanzadas
- Revisa la [referencia de configuración](../reference/cleanarch-yml.md) para personalizar adaptadores
