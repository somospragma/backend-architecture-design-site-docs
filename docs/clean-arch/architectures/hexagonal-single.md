# Hexagonal Single Module

## Descripción

La arquitectura Hexagonal Single Module (también conocida como Ports & Adapters) organiza el código en un único módulo Gradle con separación por paquetes. Es la opción más simple y directa para proyectos pequeños a medianos.

## Características

- **Módulos Gradle**: 1 módulo único
- **Complejidad**: Baja
- **Ideal para**: Proyectos pequeños, microservicios, prototipos
- **Tamaño de equipo**: 1-3 desarrolladores
- **Tiempo de build**: Rápido

## Estructura del Proyecto

```
my-project/
├── build.gradle
├── settings.gradle
└── src/
    ├── main/
    │   ├── java/com/example/myproject/
    │   │   ├── domain/
    │   │   │   ├── model/
    │   │   │   │   ├── User.java
    │   │   │   │   └── Product.java
    │   │   │   └── port/
    │   │   │       ├── in/
    │   │   │       │   ├── CreateUserUseCase.java
    │   │   │       │   └── GetProductUseCase.java
    │   │   │       └── out/
    │   │   │           ├── UserRepository.java
    │   │   │           └── ProductRepository.java
    │   │   ├── application/
    │   │   │   └── usecase/
    │   │   │       ├── CreateUserUseCaseImpl.java
    │   │   │       └── GetProductUseCaseImpl.java
    │   │   └── infrastructure/
    │   │       ├── entry-points/
    │   │       │   └── rest/
    │   │       │       ├── UserController.java
    │   │       │       └── ProductController.java
    │   │       ├── driven-adapters/
    │   │       │   ├── mongodb/
    │   │       │   │   ├── UserMongoAdapter.java
    │   │       │   │   └── UserMongoRepository.java
    │   │       │   └── redis/
    │   │       │       └── CacheAdapter.java
    │   │       └── config/
    │   │           ├── BeanConfiguration.java
    │   │           └── SecurityConfig.java
    │   └── resources/
    │       ├── application.yml
    │       └── logback.xml
    └── test/
        ├── java/com/example/myproject/
        │   ├── domain/
        │   ├── application/
        │   └── infrastructure/
        └── resources/
```

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE                          │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │ Entry Points │                        │    Driven    │  │
│  │   (REST)     │                        │   Adapters   │  │
│  └──────┬───────┘                        └──────┬───────┘  │
│         │                                       │          │
│         │  ┌─────────────────────────────┐     │          │
│         └─→│      APPLICATION            │←────┘          │
│            │   (Use Case Implementations)│                │
│            └────────────┬────────────────┘                │
│                         │                                 │
│            ┌────────────▼────────────┐                    │
│            │        DOMAIN           │                    │
│            │  ┌─────────────────┐   │                    │
│            │  │     Model       │   │                    │
│            │  │  (Entities)     │   │                    │
│            │  └─────────────────┘   │                    │
│            │  ┌─────────────────┐   │                    │
│            │  │   Ports (In)    │   │                    │
│            │  │   (Use Cases)   │   │                    │
│            │  └─────────────────┘   │                    │
│            │  ┌─────────────────┐   │                    │
│            │  │   Ports (Out)   │   │                    │
│            │  │ (Repositories)  │   │                    │
│            │  └─────────────────┘   │                    │
│            └─────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

## Capas y Responsabilidades

### Domain (Dominio)

**Ubicación**: `domain/`

**Responsabilidades**:
- Contiene las entidades y objetos de valor del negocio
- Define los puertos (interfaces) de entrada y salida
- No tiene dependencias externas
- Es el núcleo de la aplicación

**Componentes**:
- **model/**: Entidades, objetos de valor, enums
- **port/in/**: Interfaces de casos de uso (contratos de entrada)
- **port/out/**: Interfaces de repositorios y servicios externos (contratos de salida)

**Ejemplo**:
```java
// domain/model/User.java
public class User {
    private String id;
    private String name;
    private String email;
    // Constructor, getters, business logic
}

// domain/port/in/CreateUserUseCase.java
public interface CreateUserUseCase {
    User execute(CreateUserCommand command);
}

// domain/port/out/UserRepository.java
public interface UserRepository {
    User save(User user);
    Optional<User> findById(String id);
}
```

### Application (Aplicación)

**Ubicación**: `application/`

**Responsabilidades**:
- Implementa los casos de uso definidos en los puertos de entrada
- Orquesta la lógica de negocio
- Depende solo del dominio

**Componentes**:
- **usecase/**: Implementaciones de los casos de uso

**Ejemplo**:
```java
// application/usecase/CreateUserUseCaseImpl.java
@Service
public class CreateUserUseCaseImpl implements CreateUserUseCase {
    private final UserRepository userRepository;
    
    public CreateUserUseCaseImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public User execute(CreateUserCommand command) {
        User user = new User(command.getName(), command.getEmail());
        return userRepository.save(user);
    }
}
```

### Infrastructure (Infraestructura)

**Ubicación**: `infrastructure/`

**Responsabilidades**:
- Implementa los adaptadores que conectan con el mundo exterior
- Contiene detalles técnicos y frameworks
- Depende del dominio y la aplicación

**Componentes**:
- **entry-points/**: Adaptadores de entrada (REST, GraphQL, mensajería)
- **driven-adapters/**: Adaptadores de salida (bases de datos, APIs externas, caché)
- **config/**: Configuración de Spring, beans, seguridad

**Ejemplo**:
```java
// infrastructure/entry-points/rest/UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final CreateUserUseCase createUserUseCase;
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        CreateUserCommand command = new CreateUserCommand(request.getName(), request.getEmail());
        User user = createUserUseCase.execute(command);
        return ResponseEntity.ok(user);
    }
}

// infrastructure/driven-adapters/mongodb/UserMongoAdapter.java
@Repository
public class UserMongoAdapter implements UserRepository {
    private final UserMongoRepository mongoRepository;
    
    @Override
    public User save(User user) {
        UserDocument document = UserDocument.from(user);
        UserDocument saved = mongoRepository.save(document);
        return saved.toUser();
    }
}
```

## Flujo de Datos

1. **Request entrante** → Entry Point (REST Controller)
2. **Entry Point** → Invoca Use Case (puerto de entrada)
3. **Use Case** → Ejecuta lógica de negocio usando el dominio
4. **Use Case** → Llama a Repository (puerto de salida)
5. **Repository** → Driven Adapter implementa la persistencia
6. **Response** → Flujo inverso hasta el cliente

## Cuándo Usar Esta Arquitectura

### ✅ Casos de Uso Ideales

- Microservicios con responsabilidad única
- Proyectos pequeños a medianos (< 50k líneas de código)
- Equipos pequeños (1-3 desarrolladores)
- Prototipos y MVPs
- Aplicaciones con requisitos de build rápido
- Proyectos donde la simplicidad es prioritaria

### ❌ Cuándo NO Usar

- Proyectos grandes con múltiples equipos
- Cuando necesitas reutilizar componentes en otros proyectos
- Aplicaciones empresariales complejas
- Cuando diferentes partes del sistema evolucionan a ritmos muy diferentes

## Ventajas

1. **Simplicidad**: Fácil de entender y configurar
2. **Build rápido**: Un solo módulo compila rápidamente
3. **Bajo overhead**: Menos configuración de dependencias
4. **Ideal para empezar**: Curva de aprendizaje baja
5. **Debugging simple**: Todo el código está en un lugar

## Desventajas

1. **Acoplamiento**: Todo se compila junto
2. **Reutilización limitada**: Difícil extraer componentes
3. **Escalabilidad**: Puede volverse difícil de mantener en proyectos grandes
4. **Builds completos**: Cualquier cambio requiere recompilar todo

## Comandos del Plugin

### Crear un Nuevo Proyecto

```bash
gradle initCleanArch \
  --name=my-project \
  --package=com.example.myproject \
  --architecture=hexagonal-single \
  --framework=spring \
  --paradigm=reactive
```

### Generar un Adaptador de Salida

```bash
gradle generateOutputAdapter \
  --name=mongodb \
  --type=database
```

Esto creará:
- `infrastructure/driven-adapters/mongodb/MongodbAdapter.java`
- `infrastructure/driven-adapters/mongodb/MongodbRepository.java`
- Configuración en `application.yml`
- Dependencias en `build.gradle`

### Generar un Adaptador de Entrada

```bash
gradle generateInputAdapter \
  --name=rest \
  --type=web
```

Esto creará:
- `infrastructure/entry-points/rest/RestController.java`
- Configuración necesaria

## Ejemplo Completo

### 1. Crear el Proyecto

```bash
gradle initCleanArch \
  --name=user-service \
  --package=com.example.userservice \
  --architecture=hexagonal-single \
  --framework=spring \
  --paradigm=reactive
```

### 2. Definir el Dominio

```java
// domain/model/User.java
public class User {
    private final String id;
    private final String name;
    private final String email;
    
    public User(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    
    // Getters
}

// domain/port/in/CreateUserUseCase.java
public interface CreateUserUseCase {
    Mono<User> execute(String name, String email);
}

// domain/port/out/UserRepository.java
public interface UserRepository {
    Mono<User> save(User user);
    Mono<User> findById(String id);
}
```

### 3. Implementar el Caso de Uso

```java
// application/usecase/CreateUserUseCaseImpl.java
@Service
public class CreateUserUseCaseImpl implements CreateUserUseCase {
    private final UserRepository userRepository;
    
    public CreateUserUseCaseImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @Override
    public Mono<User> execute(String name, String email) {
        String id = UUID.randomUUID().toString();
        User user = new User(id, name, email);
        return userRepository.save(user);
    }
}
```

### 4. Generar Adaptadores

```bash
# Adaptador MongoDB
gradle generateOutputAdapter --name=mongodb --type=database

# Adaptador REST
gradle generateInputAdapter --name=rest --type=web
```

### 5. Implementar los Adaptadores

```java
// infrastructure/driven-adapters/mongodb/MongodbAdapter.java
@Repository
public class MongodbAdapter implements UserRepository {
    private final ReactiveMongoTemplate mongoTemplate;
    
    @Override
    public Mono<User> save(User user) {
        UserDocument document = UserDocument.from(user);
        return mongoTemplate.save(document)
            .map(UserDocument::toUser);
    }
}

// infrastructure/entry-points/rest/UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final CreateUserUseCase createUserUseCase;
    
    @PostMapping
    public Mono<User> createUser(@RequestBody CreateUserRequest request) {
        return createUserUseCase.execute(request.getName(), request.getEmail());
    }
}
```

## Mejores Prácticas

1. **Mantén el dominio puro**: No uses anotaciones de frameworks en el dominio
2. **Usa interfaces para puertos**: Facilita el testing y la inversión de dependencias
3. **Separa DTOs de entidades**: Los controladores usan DTOs, el dominio usa entidades
4. **Inyección de dependencias**: Usa constructor injection para mejor testabilidad
5. **Tests por capa**: Unit tests para dominio, integration tests para infraestructura

## Recursos Adicionales

- [Comparación de Arquitecturas](./overview.md)
- [Comandos del Plugin](../commands/init-clean-arch.md)
- [Generar Adaptadores](../getting-started/adding-adapters.md)
- [Hexagonal Multi Module](./hexagonal-multi.md) - Para proyectos más grandes
