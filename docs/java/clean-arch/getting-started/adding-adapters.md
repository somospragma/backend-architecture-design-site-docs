# Agregar Adaptadores

Los adaptadores son componentes que conectan tu aplicación con sistemas externos. Esta guía te muestra cómo agregar diferentes tipos de adaptadores a tu proyecto.

## Tipos de Adaptadores

### Adaptadores de Salida (Driven Adapters)

Los adaptadores de salida son utilizados por tu aplicación para interactuar con sistemas externos:

- **Bases de datos**: MongoDB, PostgreSQL, MySQL
- **Caché**: Redis, Memcached
- **APIs externas**: Clientes HTTP, servicios REST
- **Mensajería**: Kafka, RabbitMQ
- **Almacenamiento**: S3, sistemas de archivos

### Adaptadores de Entrada (Entry Points)

Los adaptadores de entrada permiten que sistemas externos interactúen con tu aplicación:

- **APIs REST**: Controladores HTTP
- **GraphQL**: Resolvers
- **Mensajería**: Consumidores de eventos
- **Línea de comandos**: CLI handlers

## Agregar un Adaptador de MongoDB

MongoDB es una base de datos NoSQL ideal para aplicaciones reactivas.

### Comando Básico

```bash
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=UserPersistence \
  --entityName=User
```

### Parámetros

- `--type`: Tipo de adaptador (mongodb)
- `--name`: Nombre del adaptador (ej: UserPersistence)
- `--entityName`: Nombre de la entidad de dominio (ej: User)

### Parámetros Opcionales

```bash
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=UserPersistence \
  --entityName=User \
  --collectionName=users \
  --databaseName=myapp
```

- `--collectionName`: Nombre de la colección en MongoDB (por defecto: nombre de entidad en plural y minúsculas)
- `--databaseName`: Nombre de la base de datos (por defecto: nombre del proyecto)

### Qué se Genera

El comando genera los siguientes archivos:

```
infrastructure/adapter/out/mongodb/
├── UserPersistenceMongoAdapter.java
├── UserPersistenceMongoRepository.java
└── config/
    └── UserPersistenceMongoConfig.java
```

**UserPersistenceMongoAdapter.java**: Implementación del puerto de salida que utiliza Spring Data MongoDB Reactive.

**UserPersistenceMongoRepository.java**: Interfaz de repositorio reactivo que extiende `ReactiveMongoRepository`.

**UserPersistenceMongoConfig.java**: Configuración de MongoDB con beans necesarios.

### Configuración Generada

El comando también actualiza `application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/myapp
      database: myapp
```

### Dependencias Agregadas

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive:3.2.0")
    testImplementation("de.flapdoodle.embed:de.flapdoodle.embed.mongo:4.11.0")
}
```

### Ejemplo de Uso

```java
@Service
public class UserService {
    private final UserPersistencePort userPersistence;
    
    public Mono<User> saveUser(User user) {
        return userPersistence.save(user);
    }
    
    public Mono<User> findUserById(String id) {
        return userPersistence.findById(id);
    }
}
```

## Agregar un Adaptador de Redis

Redis es un almacén de datos en memoria ideal para caché y sesiones.

### Comando Básico

```bash
./gradlew generateOutputAdapter \
  --type=redis \
  --name=SessionCache \
  --entityName=Session
```

### Qué se Genera

```
infrastructure/adapter/out/redis/
├── SessionCacheRedisAdapter.java
├── SessionRedisRepository.java
└── config/
    └── SessionRedisConfig.java
```

### Configuración Generada

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      timeout: 2000ms
      lettuce:
        pool:
          max-active: 8
          max-idle: 8
          min-idle: 0
```

### Dependencias Agregadas

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-redis-reactive:3.2.0")
    implementation("io.lettuce:lettuce-core:6.3.0.RELEASE")
}
```

## Agregar un Adaptador REST (API)

Crea un controlador REST para exponer endpoints HTTP.

### Comando Básico

```bash
./gradlew generateInputAdapter \
  --type=rest \
  --name=User \
  --basePath=/api/v1/users
```

### Parámetros

- `--type`: Tipo de adaptador (rest)
- `--name`: Nombre del recurso (ej: User)
- `--basePath`: Ruta base del API (ej: /api/v1/users)

### Parámetros Opcionales

```bash
./gradlew generateInputAdapter \
  --type=rest \
  --name=User \
  --basePath=/api/v1/users \
  --useCasePort=ManageUserUseCase \
  --entityName=User
```

- `--useCasePort`: Nombre del puerto del caso de uso (por defecto: \{name\}UseCase)
- `--entityName`: Nombre de la entidad de dominio (por defecto: \{name\})

### Qué se Genera

```
infrastructure/adapter/in/rest/
├── UserController.java
├── dto/
│   ├── UserRequest.java
│   └── UserResponse.java
├── mapper/
│   └── UserDtoMapper.java
└── config/
    └── UserWebFluxConfig.java
```

**UserController.java**: Controlador REST con endpoints CRUD.

**DTOs**: Objetos de transferencia de datos para request y response.

**UserDtoMapper.java**: Mapper para convertir entre DTOs y entidades de dominio.

**UserWebFluxConfig.java**: Configuración de WebFlux.

### Configuración Generada

```yaml
server:
  port: 8080
  
spring:
  webflux:
    base-path: /api/v1
```

### Dependencias Agregadas

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-webflux:3.2.0")
    implementation("org.springframework.boot:spring-boot-starter-validation:3.2.0")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.15.0")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test:3.2.0")
    testImplementation("io.projectreactor:reactor-test:3.6.0")
}
```

### Ejemplo de Endpoints Generados

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    
    @PostMapping
    public Mono<UserResponse> createUser(@RequestBody @Valid UserRequest request) {
        // Implementación
    }
    
    @GetMapping("/{id}")
    public Mono<UserResponse> getUserById(@PathVariable String id) {
        // Implementación
    }
    
    @PutMapping("/{id}")
    public Mono<UserResponse> updateUser(
        @PathVariable String id, 
        @RequestBody @Valid UserRequest request
    ) {
        // Implementación
    }
    
    @DeleteMapping("/{id}")
    public Mono<Void> deleteUser(@PathVariable String id) {
        // Implementación
    }
}
```

## Agregar un Adaptador Genérico

Si necesitas un adaptador personalizado que no está en los templates predefinidos:

```bash
./gradlew generateOutputAdapter \
  --type=generic \
  --name=EmailService
```

Esto genera una estructura básica que puedes personalizar según tus necesidades.

## Múltiples Adaptadores del Mismo Tipo

Puedes agregar múltiples adaptadores del mismo tipo con diferentes nombres:

```bash
# Base de datos principal
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=UserPersistence \
  --entityName=User

# Base de datos de auditoría
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=AuditPersistence \
  --entityName=AuditLog \
  --databaseName=audit
```

## Adaptadores en Diferentes Arquitecturas

Los adaptadores se colocan automáticamente en la ubicación correcta según la arquitectura:

### Arquitectura Hexagonal Single Module

```
infrastructure/
├── adapter/
│   ├── in/
│   │   └── rest/
│   └── out/
│       ├── mongodb/
│       └── redis/
```

### Arquitectura Onion Single Module

```
infrastructure/
├── adapter/
│   ├── in/
│   │   └── rest/
│   └── out/
│       ├── mongodb/
│       └── redis/
```

### Arquitectura Hexagonal Multi-Granular

```
infrastructure/
├── entry-points/
│   └── rest/
└── adapters/
    ├── mongodb/
    └── redis/
```

## Verificar Adaptadores Generados

Después de generar un adaptador, verifica:

1. **Archivos generados**: Revisa que todos los archivos esperados se hayan creado
2. **Dependencias**: Verifica que las dependencias se agregaron a `build.gradle.kts`
3. **Configuración**: Revisa que `application.yml` tenga las propiedades necesarias
4. **Compilación**: Ejecuta `./gradlew build` para asegurar que todo compila

```bash
./gradlew build
```

## Configurar Adaptadores

### MongoDB

Configura la conexión en `application.yml`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://username:password@host:27017/database
      database: myapp
      # Para MongoDB Atlas
      # uri: mongodb+srv://username:password@cluster.mongodb.net/database
```

### Redis

Configura la conexión en `application.yml`:

```yaml
spring:
  data:
    redis:
      host: redis-server
      port: 6379
      password: ${REDIS_PASSWORD}
      ssl: true
      timeout: 2000ms
```

### REST API

Configura el servidor en `application.yml`:

```yaml
server:
  port: 8080
  
spring:
  webflux:
    base-path: /api/v1
    
logging:
  level:
    org.springframework.web: DEBUG
```

## Mejores Prácticas

### 1. Nombres Descriptivos

Usa nombres que describan claramente la responsabilidad del adaptador:

```bash
# ✅ Bueno
./gradlew generateOutputAdapter --type=mongodb --name=UserPersistence
./gradlew generateOutputAdapter --type=redis --name=SessionCache

# ❌ Evitar
./gradlew generateOutputAdapter --type=mongodb --name=Adapter1
./gradlew generateOutputAdapter --type=redis --name=Cache
```

### 2. Separación de Responsabilidades

Crea adaptadores separados para diferentes responsabilidades:

```bash
# Persistencia de usuarios
./gradlew generateOutputAdapter --type=mongodb --name=UserPersistence

# Caché de usuarios
./gradlew generateOutputAdapter --type=redis --name=UserCache

# API de usuarios
./gradlew generateInputAdapter --type=rest --name=User
```

### 3. Configuración por Ambiente

Usa perfiles de Spring para diferentes ambientes:

```yaml
# application.yml (desarrollo)
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/myapp-dev

---
# application-prod.yml (producción)
spring:
  data:
    mongodb:
      uri: ${MONGODB_URI}  # Variable de entorno
```

### 4. Manejo de Errores

Implementa manejo de errores apropiado en tus adaptadores:

```java
@Override
public Mono<User> findById(String id) {
    return repository.findById(id)
        .switchIfEmpty(Mono.error(new UserNotFoundException(id)))
        .onErrorMap(MongoException.class, 
            e -> new DatabaseException("Error accessing database", e));
}
```

### 5. Tests

Escribe tests para tus adaptadores:

```java
@SpringBootTest
class UserPersistenceMongoAdapterTest {
    
    @Autowired
    private UserPersistencePort userPersistence;
    
    @Test
    void shouldSaveUser() {
        User user = new User("1", "John Doe");
        
        StepVerifier.create(userPersistence.save(user))
            .expectNextMatches(saved -> saved.getId().equals("1"))
            .verifyComplete();
    }
}
```

## Solución de Problemas

### El adaptador no se genera

Verifica que el archivo `.cleanarch.yml` existe en el directorio raíz:

```bash
cat .cleanarch.yml
```

### Errores de compilación

Asegúrate de que todas las dependencias se descargaron:

```bash
./gradlew clean build --refresh-dependencies
```

### Conflictos de dependencias

Revisa las versiones en `build.gradle.kts` y usa dependency management:

```kotlin
dependencyManagement {
    imports {
        mavenBom("org.springframework.boot:spring-boot-dependencies:3.2.0")
    }
}
```

### El adaptador no se conecta

Verifica que el servicio externo está corriendo:

```bash
# MongoDB
docker ps | grep mongo

# Redis
docker ps | grep redis
```

## Próximos Pasos

- [Explorar todos los adaptadores disponibles](../adapters/)
- [Entender los comandos del plugin](../commands/)
- [Aprender sobre las arquitecturas soportadas](../architectures/)
- [Configuración avanzada](../reference/cleanarch-yml)
- [Contribuir con nuevos adaptadores](../contributors/adding-adapter)
