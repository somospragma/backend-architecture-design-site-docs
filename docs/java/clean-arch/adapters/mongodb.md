# Adaptador MongoDB

El adaptador MongoDB proporciona acceso a bases de datos MongoDB NoSQL con soporte para operaciones reactivas e imperativas.

## Características

- ✅ Operaciones CRUD completas
- ✅ Consultas personalizadas con criterios
- ✅ Soporte reactivo (Spring Data Reactive MongoDB)
- ✅ Soporte imperativo (Spring Data MongoDB)
- ✅ Mapeo automático de entidades de dominio
- ✅ Tests de integración con Testcontainers

## Generar el Adaptador

```bash
gradle generateOutputAdapter --name=mongodb --type=driven
```

## Paradigmas Disponibles

### Spring Reactive (WebFlux)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-data-mongodb-reactive'
```

**Ejemplo de Uso:**
```java
@Component
public class MongoDBAdapter implements UserRepository {
    
    private final ReactiveMongoTemplate mongoTemplate;
    
    public MongoDBAdapter(ReactiveMongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    @Override
    public Mono<User> save(User user) {
        return mongoTemplate.save(user);
    }
    
    @Override
    public Mono<User> findById(String id) {
        return mongoTemplate.findById(id, User.class);
    }
    
    @Override
    public Flux<User> findAll() {
        return mongoTemplate.findAll(User.class);
    }
    
    @Override
    public Mono<Void> deleteById(String id) {
        return mongoTemplate.remove(
            Query.query(Criteria.where("id").is(id)), 
            User.class
        ).then();
    }
}
```

### Spring Imperative (MVC)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-data-mongodb'
```

**Ejemplo de Uso:**
```java
@Component
public class MongoDBAdapter implements UserRepository {
    
    private final MongoTemplate mongoTemplate;
    
    public MongoDBAdapter(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }
    
    @Override
    public User save(User user) {
        return mongoTemplate.save(user);
    }
    
    @Override
    public User findById(String id) {
        return mongoTemplate.findById(id, User.class);
    }
    
    @Override
    public List<User> findAll() {
        return mongoTemplate.findAll(User.class);
    }
    
    @Override
    public void deleteById(String id) {
        mongoTemplate.remove(
            Query.query(Criteria.where("id").is(id)), 
            User.class
        );
    }
}
```

## Configuración

### application.yml

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/myapp
      # ADVERTENCIA: No almacenes credenciales en control de versiones
      # Usa variables de entorno o gestión de secretos en producción
      database: myapp
```

### Variables de Entorno (Recomendado)

```bash
SPRING_DATA_MONGODB_URI=mongodb://user:password@host:27017/database
SPRING_DATA_MONGODB_DATABASE=myapp
```

## Configuración Avanzada

### Clase de Configuración

```java
@Configuration
public class MongoConfig {
    
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(
            MongoClientSettings.builder()
                .applyConnectionString(
                    new ConnectionString("mongodb://localhost:27017")
                )
                .applyToConnectionPoolSettings(builder -> 
                    builder.maxSize(100)
                           .minSize(10)
                           .maxWaitTime(2, TimeUnit.SECONDS)
                )
                .build()
        );
    }
}
```

## Tests de Integración

El adaptador incluye tests con Testcontainers:

```java
@SpringBootTest
@Testcontainers
class MongoDBAdapterTest {
    
    @Container
    static MongoDBContainer mongoDBContainer = 
        new MongoDBContainer("mongo:7.0")
            .withExposedPorts(27017);
    
    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.data.mongodb.uri", 
            mongoDBContainer::getReplicaSetUrl);
    }
    
    @Autowired
    private MongoDBAdapter adapter;
    
    @Test
    void shouldSaveAndRetrieveUser() {
        // Given
        User user = new User("1", "John Doe", "john@example.com");
        
        // When
        User saved = adapter.save(user).block();
        User retrieved = adapter.findById("1").block();
        
        // Then
        assertThat(retrieved).isEqualTo(saved);
    }
}
```

## Consultas Personalizadas

### Usando Criteria

```java
public Flux<User> findByEmail(String email) {
    Query query = Query.query(Criteria.where("email").is(email));
    return mongoTemplate.find(query, User.class);
}

public Flux<User> findByAgeGreaterThan(int age) {
    Query query = Query.query(Criteria.where("age").gt(age));
    return mongoTemplate.find(query, User.class);
}
```

### Agregaciones

```java
public Mono<Long> countByStatus(String status) {
    Query query = Query.query(Criteria.where("status").is(status));
    return mongoTemplate.count(query, User.class);
}
```

## Manejo de Errores

```java
@Override
public Mono<User> findById(String id) {
    return mongoTemplate.findById(id, User.class)
        .switchIfEmpty(Mono.error(
            new UserNotFoundException("User not found: " + id)
        ))
        .onErrorMap(MongoException.class, e -> 
            new DatabaseException("MongoDB error", e)
        );
}
```

## Mejores Prácticas

1. **Índices**: Define índices en tus colecciones para mejorar el rendimiento
   ```java
   @Document(collection = "users")
   @CompoundIndex(name = "email_idx", def = "{'email': 1}", unique = true)
   public class User {
       // ...
   }
   ```

2. **Proyecciones**: Usa proyecciones para recuperar solo los campos necesarios
   ```java
   Query query = new Query();
   query.fields().include("name").include("email");
   ```

3. **Paginación**: Implementa paginación para grandes conjuntos de datos
   ```java
   Query query = new Query().with(PageRequest.of(page, size));
   ```

4. **Transacciones**: Usa transacciones para operaciones atómicas (requiere replica set)
   ```java
   @Transactional
   public Mono<Void> transferData(String fromId, String toId) {
       // Operaciones transaccionales
   }
   ```

## Solución de Problemas

### Error de Conexión

**Problema**: `MongoTimeoutException: Timed out after 30000 ms`

**Solución**: Verifica que MongoDB esté ejecutándose y accesible:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:7.0
```

### Error de Autenticación

**Problema**: `MongoSecurityException: Exception authenticating`

**Solución**: Verifica las credenciales en `application.yml` o variables de entorno.

## Recursos Adicionales

- [Spring Data MongoDB Documentation](https://docs.spring.io/spring-data/mongodb/docs/current/reference/html/)
- [MongoDB Java Driver](https://www.mongodb.com/docs/drivers/java/sync/current/)
- [Testcontainers MongoDB Module](https://www.testcontainers.org/modules/databases/mongodb/)
