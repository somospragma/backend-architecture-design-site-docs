# generateOutputAdapter

Genera un adaptador de salida (driven adapter) para conectar la aplicación con sistemas externos como bases de datos, APIs REST, colas de mensajes, etc.

:::info Terminología
En arquitectura limpia, los adaptadores de salida se llaman **driven adapters** porque son conducidos por el núcleo de la aplicación. Se ubican en `infrastructure/driven-adapters/` o `infrastructure/adapter/out/` según la arquitectura.
:::

## Sintaxis

```bash
./gradlew generateOutputAdapter \
  --name=<NombreAdaptador> \
  --entity=<NombreEntidad> \
  --type=<tipoAdaptador> \
  --packageName=<paquete>
```

## Parámetros

| Parámetro | Requerido | Descripción | Valores |
|-----------|-----------|-------------|---------|
| `--name` | Sí | Nombre del adaptador | ej., `UserRepository` |
| `--entity` | Sí | Nombre de la entidad | ej., `User` |
| `--type` | Sí | Tipo de adaptador | `redis`, `mongodb`, `postgresql`, `rest_client`, `kafka` |
| `--packageName` | Sí | Paquete completo | ej., `com.pragma.test.infrastructure.driven-adapters.redis` |

## Adaptadores de Salida Disponibles

### Matriz de Disponibilidad por Framework y Paradigma

| Adaptador | Spring Reactive | Spring Imperative | Quarkus Reactive | Quarkus Imperative | Estado |
|-----------|----------------|-------------------|------------------|-------------------|--------|
| **Redis** | ✅ | 🚧 | 🚧 | 🚧 | Disponible |
| **MongoDB** | ✅ | 🚧 | 🚧 | 🚧 | Disponible |
| **PostgreSQL** | ✅ | 🚧 | 🚧 | 🚧 | Disponible |
| **REST Client** | 🚧 | 🚧 | 🚧 | 🚧 | En desarrollo |
| **Kafka** | 🚧 | 🚧 | 🚧 | 🚧 | En desarrollo |
| **DynamoDB** | 🔜 | 🔜 | 🔜 | 🔜 | Planeado |
| **MySQL** | 🔜 | 🔜 | 🔜 | 🔜 | Planeado |
| **RabbitMQ** | 🔜 | 🔜 | 🔜 | 🔜 | Planeado |
| **SQS** | 🔜 | 🔜 | 🔜 | 🔜 | Planeado |

**Leyenda:**
- ✅ Disponible y probado
- 🚧 En desarrollo
- 🔜 Planeado para futuras versiones

### Compatibilidad por Arquitectura

Todos los adaptadores de salida son compatibles con todas las arquitecturas:

| Arquitectura | Redis | MongoDB | PostgreSQL | REST Client | Kafka |
|--------------|-------|---------|------------|-------------|-------|
| `hexagonal-single` | ✅ | ✅ | ✅ | 🚧 | 🚧 |
| `hexagonal-multi` | ✅ | ✅ | ✅ | 🚧 | 🚧 |
| `hexagonal-multi-granular` | ✅ | ✅ | ✅ | 🚧 | 🚧 |
| `onion-single` | ✅ | ✅ | ✅ | 🚧 | 🚧 |

### Detalles por Tecnología

#### Spring WebFlux (Reactive)

**Bases de Datos:**
- **Redis**: Usa `spring-boot-starter-data-redis-reactive` con Lettuce
- **MongoDB**: Usa `spring-boot-starter-data-mongodb-reactive`
- **PostgreSQL**: Usa `spring-boot-starter-data-r2dbc` con `r2dbc-postgresql`

**Clientes HTTP:**
- **REST Client**: Usa `WebClient` de Spring WebFlux

**Mensajería:**
- **Kafka**: Usa `reactor-kafka` para operaciones reactivas

#### Spring MVC (Imperative) - En desarrollo

**Bases de Datos:**
- **Redis**: Usará `spring-boot-starter-data-redis`
- **MongoDB**: Usará `spring-boot-starter-data-mongodb`
- **PostgreSQL**: Usará `spring-boot-starter-data-jpa` con Hibernate

**Clientes HTTP:**
- **REST Client**: Usará `RestTemplate` o `RestClient`

**Mensajería:**
- **Kafka**: Usará `spring-kafka`

#### Quarkus Reactive - En desarrollo

**Bases de Datos:**
- **Redis**: Usará `quarkus-redis-client` con Mutiny
- **MongoDB**: Usará `quarkus-mongodb-client` con Mutiny
- **PostgreSQL**: Usará `quarkus-reactive-pg-client`

**Clientes HTTP:**
- **REST Client**: Usará `quarkus-rest-client-reactive`

**Mensajería:**
- **Kafka**: Usará `quarkus-smallrye-reactive-messaging-kafka`

## Tipos de Adaptadores

### redis
Adaptador de caché Redis con operaciones reactivas.

**Dependencias agregadas:**
- `spring-boot-starter-data-redis-reactive`
- `lettuce-core`

**Operaciones generadas:**
- `save(entity)`: Guardar en caché
- `findById(id)`: Buscar por ID
- `findAll()`: Obtener todos
- `deleteById(id)`: Eliminar por ID
- `existsById(id)`: Verificar existencia

### mongodb
Adaptador de repositorio MongoDB con Spring Data Reactive.

**Dependencias agregadas:**
- `spring-boot-starter-data-mongodb-reactive`

**Dependencias de prueba:**
- `de.flapdoodle.embed:de.flapdoodle.embed.mongo` (MongoDB embebido para tests)

**Operaciones generadas:**
- CRUD completo reactivo
- Mappers con MapStruct
- Entidad de datos MongoDB

### postgresql
Adaptador de repositorio PostgreSQL con R2DBC.

**Dependencias agregadas:**
- `spring-boot-starter-data-r2dbc`
- `r2dbc-postgresql`

**Operaciones generadas:**
- CRUD completo reactivo
- Mappers con MapStruct
- Entidad de datos R2DBC

### rest_client
Cliente HTTP REST para consumir APIs externas.

**Dependencias agregadas:**
- `spring-boot-starter-webflux` (WebClient)

**Operaciones generadas:**
- Métodos GET, POST, PUT, DELETE
- Manejo de errores HTTP
- Configuración de timeout y retry

### kafka
Productor Kafka para enviar mensajes.

**Dependencias agregadas:**
- `spring-kafka`
- `reactor-kafka`

**Operaciones generadas:**
- `send(message)`: Enviar mensaje
- Configuración de serialización
- Manejo de errores de envío

## Ejemplos

### Adaptador Redis

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.test.infrastructure.driven-adapters.redis
```

**Archivos generados:**

```
infrastructure/driven-adapters/redis/
├── UserRepositoryAdapter.java
├── UserMapper.java
└── UserData.java
```

**Código generado (UserRepositoryAdapter.java):**

```java
@Repository
public class UserRepositoryAdapter implements UserRepository {
    
    private final ReactiveRedisTemplate<String, UserData> redisTemplate;
    private final UserMapper mapper;
    
    public UserRepositoryAdapter(
        ReactiveRedisTemplate<String, UserData> redisTemplate,
        UserMapper mapper
    ) {
        this.redisTemplate = redisTemplate;
        this.mapper = mapper;
    }
    
    @Override
    public Mono<User> save(User user) {
        UserData data = mapper.toData(user);
        return redisTemplate.opsForValue()
            .set(user.getId(), data)
            .thenReturn(user);
    }
    
    @Override
    public Mono<User> findById(String id) {
        return redisTemplate.opsForValue()
            .get(id)
            .map(mapper::toDomain);
    }
    
    // ... más operaciones
}
```

**Propiedades agregadas (application.yml):**

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      # WARNING: No almacenar credenciales en control de versiones
      # Usar variables de entorno o gestión de secretos en producción
```

### Adaptador MongoDB

```bash
./gradlew generateOutputAdapter \
  --name=ProductRepository \
  --entity=Product \
  --type=mongodb \
  --packageName=com.pragma.test.infrastructure.driven-adapters.mongodb
```

**Archivos generados:**

```
infrastructure/driven-adapters/mongodb/
├── ProductRepositoryAdapter.java
├── ProductMapper.java
├── ProductData.java
└── MongoConfig.java
```

**Código generado (ProductRepositoryAdapter.java):**

```java
@Repository
public class ProductRepositoryAdapter implements ProductRepository {
    
    private final ReactiveMongoTemplate mongoTemplate;
    private final ProductMapper mapper;
    
    @Override
    public Mono<Product> save(Product product) {
        ProductData data = mapper.toData(product);
        return mongoTemplate.save(data)
            .map(mapper::toDomain);
    }
    
    @Override
    public Flux<Product> findAll() {
        return mongoTemplate.findAll(ProductData.class)
            .map(mapper::toDomain);
    }
    
    // ... más operaciones
}
```

**Propiedades agregadas (application.yml):**

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb
      database: mydb
```

### Adaptador PostgreSQL

```bash
./gradlew generateOutputAdapter \
  --name=OrderRepository \
  --entity=Order \
  --type=postgresql \
  --packageName=com.pragma.test.infrastructure.driven-adapters.postgresql
```

**Archivos generados:**

```
infrastructure/driven-adapters/postgresql/
├── OrderRepositoryAdapter.java
├── OrderMapper.java
├── OrderData.java
└── R2dbcConfig.java
```

**Propiedades agregadas (application.yml):**

```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/mydb
    username: user
    password: ${DB_PASSWORD}
```

### Cliente REST

```bash
./gradlew generateOutputAdapter \
  --name=PaymentClient \
  --entity=Payment \
  --type=rest_client \
  --packageName=com.pragma.test.infrastructure.driven-adapters.rest
```

**Archivos generados:**

```
infrastructure/driven-adapters/rest/
├── PaymentClientAdapter.java
├── PaymentMapper.java
└── PaymentResponse.java
```

**Código generado:**

```java
@Component
public class PaymentClientAdapter implements PaymentGateway {
    
    private final WebClient webClient;
    private final PaymentMapper mapper;
    
    public PaymentClientAdapter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
            .baseUrl("${payment.api.url}")
            .build();
    }
    
    @Override
    public Mono<Payment> processPayment(Payment payment) {
        return webClient.post()
            .uri("/payments")
            .bodyValue(mapper.toRequest(payment))
            .retrieve()
            .bodyToMono(PaymentResponse.class)
            .map(mapper::toDomain);
    }
}
```

### Productor Kafka

```bash
./gradlew generateOutputAdapter \
  --name=NotificationPublisher \
  --entity=Notification \
  --type=kafka \
  --packageName=com.pragma.test.infrastructure.driven-adapters.kafka
```

**Archivos generados:**

```
infrastructure/driven-adapters/kafka/
├── NotificationPublisherAdapter.java
├── NotificationMapper.java
└── KafkaConfig.java
```

**Propiedades agregadas (application.yml):**

```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```

## Resolución de Rutas por Arquitectura

El plugin coloca automáticamente los adaptadores en la ubicación correcta según la arquitectura:

| Arquitectura | Ruta del Adaptador |
|--------------|-------------------|
| `hexagonal-single` | `infrastructure/driven-adapters/{name}` |
| `hexagonal-multi` | `infrastructure/src/main/java/{package}/driven-adapters/{name}` |
| `hexagonal-multi-granular` | `adapters/src/main/java/{package}/{name}` |
| `onion-single` | `infrastructure/adapter/out/{name}` |

## Fusión Inteligente de Configuración

El plugin fusiona automáticamente las propiedades del adaptador en `application.yml`:

- ✅ Preserva propiedades existentes
- ✅ Solo agrega propiedades nuevas
- ✅ Mantiene comentarios e indentación
- ✅ Agrupa propiedades por adaptador
- ⚠️ Registra advertencias si hay conflictos de valores

**Ejemplo de fusión:**

**application.yml existente:**
```yaml
spring:
  application:
    name: my-service
```

**Después de generar adaptador MongoDB:**
```yaml
spring:
  application:
    name: my-service
  data:
    mongodb:
      uri: mongodb://localhost:27017/mydb
      database: mydb
```

## Generación Incremental

Puedes agregar múltiples adaptadores a un proyecto existente:

```bash
# Agregar Redis
./gradlew generateOutputAdapter \
  --name=UserCache \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.test.infrastructure.driven-adapters.redis

# Agregar MongoDB
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=mongodb \
  --packageName=com.pragma.test.infrastructure.driven-adapters.mongodb
```

El plugin:
- ✅ Preserva código existente
- ✅ Agrega nuevas dependencias sin eliminar las existentes
- ✅ Fusiona propiedades sin sobrescribir
- ✅ Detecta adaptadores duplicados y solicita confirmación

## Validación

El comando valida:
- ✅ Existe `.cleanarch.yml` en el directorio actual
- ✅ Nombre del adaptador sigue convenciones Java
- ✅ Tipo de adaptador es soportado
- ✅ Paquete coincide con la estructura del proyecto
- ✅ Plantillas del adaptador existen en el repositorio

## Errores Comunes

### Error: Configuración no encontrada

```
Configuration file .cleanarch.yml not found.
Run 'gradle initCleanArch' to create initial project structure.
```

**Solución**: Ejecuta `initCleanArch` primero para inicializar el proyecto.

### Error: Tipo de adaptador no soportado

```
Adapter type 'mysql' is not supported.
Valid types: [redis, mongodb, postgresql, rest_client, kafka]
```

**Solución**: Usa uno de los tipos de adaptador listados.

### Error: Adaptador duplicado

```
Adapter 'UserRepository' already exists at infrastructure/driven-adapters/mongodb.
Use --force to overwrite or choose a different name.
```

**Solución**: Usa un nombre diferente o agrega `--force` para sobrescribir.

## Clases de Configuración Adicionales

Algunos adaptadores generan clases de configuración adicionales:

- **MongoDB**: `MongoConfig.java` con configuración de cliente reactivo
- **PostgreSQL**: `R2dbcConfig.java` con configuración de pool de conexiones
- **Kafka**: `KafkaConfig.java` con configuración de productor
- **Redis**: `RedisConfig.java` con configuración de template reactivo

## Dependencias de Prueba

Los adaptadores incluyen dependencias de prueba cuando es apropiado:

- **MongoDB**: Embedded MongoDB para tests de integración
- **PostgreSQL**: Testcontainers para tests con base de datos real
- **Kafka**: Embedded Kafka para tests de mensajería
- **Redis**: Embedded Redis para tests de caché

## Próximos Pasos

Después de generar un adaptador de salida:

1. **Configurar Propiedades**: Ajusta las propiedades en `application.yml` según tu entorno
2. **Implementar Lógica**: Completa la lógica de negocio en los casos de uso
3. **Escribir Tests**: Crea tests de integración para el adaptador
4. **Generar Entry Point**: Usa `generateInputAdapter` para exponer la funcionalidad

## Ver También

- [generateInputAdapter](generate-input-adapter.md)
- [Guía de Adaptadores](../guides/adapters/)
- [Referencia de Configuración](../reference/configuration.md)
- [Modo de Desarrollo](../contributors/developer-mode.md)
