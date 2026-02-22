# Hexagonal Multi Module

## Descripción

La arquitectura Hexagonal Multi Module organiza el código en tres módulos Gradle separados: domain, application e infrastructure. Esta separación proporciona mejor modularidad y permite reutilizar componentes entre proyectos.

## Características

- **Módulos Gradle**: 3 módulos (domain, application, infrastructure)
- **Complejidad**: Media
- **Ideal para**: Proyectos medianos a grandes
- **Tamaño de equipo**: 3-8 desarrolladores
- **Tiempo de build**: Medio (builds incrementales eficientes)

## Estructura del Proyecto

```
my-project/
├── build.gradle                    # Build raíz
├── settings.gradle                 # Configuración de módulos
├── domain/                         # Módulo de dominio
│   ├── build.gradle
│   └── src/
│       ├── main/java/com/example/myproject/
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   └── Product.java
│       │   └── port/
│       │       ├── in/
│       │       │   ├── CreateUserUseCase.java
│       │       │   └── GetProductUseCase.java
│       │       └── out/
│       │           ├── UserRepository.java
│       │           └── ProductRepository.java
│       └── test/java/
├── application/                    # Módulo de aplicación
│   ├── build.gradle
│   └── src/
│       ├── main/java/com/example/myproject/
│       │   └── usecase/
│       │       ├── CreateUserUseCaseImpl.java
│       │       └── GetProductUseCaseImpl.java
│       └── test/java/
└── infrastructure/                 # Módulo de infraestructura
    ├── build.gradle
    └── src/
        ├── main/
        │   ├── java/com/example/myproject/
        │   │   ├── entry-points/
        │   │   │   └── rest/
        │   │   │       ├── UserController.java
        │   │   │       └── ProductController.java
        │   │   ├── driven-adapters/
        │   │   │   ├── mongodb/
        │   │   │   │   ├── UserMongoAdapter.java
        │   │   │   │   └── UserMongoRepository.java
        │   │   │   └── redis/
        │   │   │       └── CacheAdapter.java
        │   │   └── config/
        │   │       ├── BeanConfiguration.java
        │   │       └── SecurityConfig.java
        │   └── resources/
        │       ├── application.yml
        │       └── logback.xml
        └── test/
```

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE MODULE                      │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │ Entry Points │                        │    Driven    │  │
│  │   (REST)     │                        │   Adapters   │  │
│  └──────┬───────┘                        └──────┬───────┘  │
│         │              depends on               │          │
│         └──────────────────┬────────────────────┘          │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                  APPLICATION MODULE                          │
│            ┌─────────────────────────────┐                   │
│            │   Use Case Implementations  │                   │
│            └────────────┬────────────────┘                   │
│                         │ depends on                         │
└─────────────────────────┼──────────────────────────────────────┘
                          │
┌─────────────────────────▼──────────────────────────────────┐
│                    DOMAIN MODULE                           │
│  ┌─────────────────┐   ┌─────────────────┐                │
│  │     Model       │   │   Ports (In)    │                │
│  │  (Entities)     │   │   (Use Cases)   │                │
│  └─────────────────┘   └─────────────────┘                │
│  ┌─────────────────┐                                       │
│  │   Ports (Out)   │                                       │
│  │ (Repositories)  │                                       │
│  └─────────────────┘                                       │
└────────────────────────────────────────────────────────────┘
```

## Módulos y Responsabilidades

### Domain Module (Módulo de Dominio)

**Ubicación**: `domain/`

**Dependencias**: Ninguna (módulo independiente)

**Responsabilidades**:
- Contiene las entidades y objetos de valor del negocio
- Define los puertos (interfaces) de entrada y salida
- Lógica de negocio pura
- No tiene dependencias de frameworks

**Componentes**:
- **model/**: Entidades, objetos de valor, enums
- **port/in/**: Interfaces de casos de uso
- **port/out/**: Interfaces de repositorios y servicios externos

**build.gradle**:
```groovy
dependencies {
    // Solo dependencias del dominio (sin frameworks)
    implementation 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

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

### Application Module (Módulo de Aplicación)

**Ubicación**: `application/`

**Dependencias**: `domain`

**Responsabilidades**:
- Implementa los casos de uso definidos en el dominio
- Orquesta la lógica de negocio
- Coordina entre puertos de entrada y salida

**Componentes**:
- **usecase/**: Implementaciones de los casos de uso

**build.gradle**:
```groovy
dependencies {
    implementation project(':domain')
    
    // Dependencias mínimas (inyección de dependencias)
    implementation 'org.springframework:spring-context'
}
```

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

### Infrastructure Module (Módulo de Infraestructura)

**Ubicación**: `infrastructure/`

**Dependencias**: `domain`, `application`

**Responsabilidades**:
- Implementa los adaptadores de entrada y salida
- Contiene toda la configuración de frameworks
- Punto de entrada de la aplicación (main class)
- Gestiona dependencias técnicas

**Componentes**:
- **entry-points/**: Adaptadores de entrada (REST, GraphQL, mensajería)
- **driven-adapters/**: Adaptadores de salida (bases de datos, APIs externas)
- **config/**: Configuración de Spring, beans, seguridad

**build.gradle**:
```groovy
dependencies {
    implementation project(':domain')
    implementation project(':application')
    
    // Todas las dependencias de frameworks
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb-reactive'
    implementation 'org.springframework.boot:spring-boot-starter-security'
}
```

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

// infrastructure/config/BeanConfiguration.java
@Configuration
public class BeanConfiguration {
    @Bean
    public CreateUserUseCase createUserUseCase(UserRepository userRepository) {
        return new CreateUserUseCaseImpl(userRepository);
    }
}
```

## Flujo de Dependencias

```
Infrastructure → Application → Domain
     ↓               ↓            ↓
  Frameworks    Use Cases    Business Logic
  Adapters      Orchestration   Entities
  Config                        Ports
```

**Regla de Oro**: Las dependencias siempre apuntan hacia el dominio. El dominio nunca depende de nada.

## Cuándo Usar Esta Arquitectura

### ✅ Casos de Uso Ideales

- Proyectos medianos a grandes (50k-200k líneas de código)
- Equipos de 3-8 desarrolladores
- Aplicaciones con lógica de negocio compleja
- Cuando necesitas reutilizar el dominio en múltiples aplicaciones
- Proyectos con múltiples adaptadores
- Cuando quieres builds incrementales eficientes

### ❌ Cuándo NO Usar

- Proyectos muy pequeños (overhead innecesario)
- Prototipos rápidos
- Cuando la simplicidad es más importante que la modularidad
- Equipos sin experiencia en arquitecturas multi-módulo

## Ventajas

1. **Separación clara**: Cada módulo tiene responsabilidades bien definidas
2. **Reutilización**: El módulo de dominio puede usarse en otros proyectos
3. **Builds incrementales**: Solo se recompilan los módulos modificados
4. **Testing aislado**: Puedes testear el dominio sin frameworks
5. **Evolución independiente**: Los módulos pueden evolucionar a diferentes ritmos
6. **Mejor organización**: Ideal para equipos medianos

## Desventajas

1. **Configuración más compleja**: Requiere gestionar dependencias entre módulos
2. **Overhead inicial**: Más tiempo de setup que single module
3. **Curva de aprendizaje**: Requiere entender la separación de módulos
4. **Puede ser excesivo**: Para proyectos pequeños es overkill

## Comandos del Plugin

### Crear un Nuevo Proyecto

```bash
gradle initCleanArch \
  --name=my-project \
  --package=com.example.myproject \
  --architecture=hexagonal-multi \
  --framework=spring \
  --paradigm=reactive
```

Esto creará:
- Módulo `domain/` con entidades y puertos
- Módulo `application/` con casos de uso
- Módulo `infrastructure/` con configuración
- `settings.gradle` configurando los 3 módulos

### Generar un Adaptador de Salida

```bash
gradle generateOutputAdapter \
  --name=mongodb \
  --type=database
```

Esto creará en el módulo `infrastructure`:
- `driven-adapters/mongodb/MongodbAdapter.java`
- `driven-adapters/mongodb/MongodbRepository.java`
- Configuración en `application.yml`
- Dependencias en `infrastructure/build.gradle`

### Generar un Adaptador de Entrada

```bash
gradle generateInputAdapter \
  --name=rest \
  --type=web
```

Esto creará en el módulo `infrastructure`:
- `entry-points/rest/RestController.java`
- Configuración necesaria

## Configuración de Módulos

### settings.gradle

```groovy
rootProject.name = 'my-project'

include 'domain'
include 'application'
include 'infrastructure'
```

### domain/build.gradle

```groovy
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

dependencies {
    // Solo dependencias del dominio puro
    compileOnly 'org.projectlombok:lombok:1.18.30'
    annotationProcessor 'org.projectlombok:lombok:1.18.30'
    
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}
```

### application/build.gradle

```groovy
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

dependencies {
    implementation project(':domain')
    
    // Dependencias mínimas para casos de uso
    implementation 'org.springframework:spring-context:6.1.0'
    
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    testImplementation 'org.mockito:mockito-core:5.7.0'
}
```

### infrastructure/build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

group = 'com.example'
version = '1.0.0'

dependencies {
    implementation project(':domain')
    implementation project(':application')
    
    // Todas las dependencias de frameworks
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb-reactive'
    
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'io.projectreactor:reactor-test'
}
```

## Ejemplo Completo

### 1. Crear el Proyecto

```bash
gradle initCleanArch \
  --name=user-service \
  --package=com.example.userservice \
  --architecture=hexagonal-multi \
  --framework=spring \
  --paradigm=reactive
```

### 2. Definir el Dominio (domain/)

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

### 3. Implementar Casos de Uso (application/)

```java
// application/usecase/CreateUserUseCaseImpl.java
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

### 4. Generar Adaptadores (infrastructure/)

```bash
# Adaptador MongoDB
gradle generateOutputAdapter --name=mongodb --type=database

# Adaptador REST
gradle generateInputAdapter --name=rest --type=web
```

### 5. Configurar Beans (infrastructure/)

```java
// infrastructure/config/BeanConfiguration.java
@Configuration
public class BeanConfiguration {
    @Bean
    public CreateUserUseCase createUserUseCase(UserRepository userRepository) {
        return new CreateUserUseCaseImpl(userRepository);
    }
}
```

## Mejores Prácticas

1. **Mantén el dominio puro**: No uses anotaciones de Spring en el módulo domain
2. **Application sin frameworks**: El módulo application debe tener dependencias mínimas
3. **Infrastructure contiene todo lo técnico**: Frameworks, configuración, main class
4. **Usa interfaces en puertos**: Facilita el testing y la inversión de dependencias
5. **Tests por módulo**: 
   - Domain: Unit tests puros
   - Application: Tests con mocks
   - Infrastructure: Integration tests
6. **Versionado independiente**: Considera versionar los módulos independientemente

## Migración desde Single Module

Si tienes un proyecto Hexagonal Single Module y quieres migrar:

1. **Crear estructura de módulos**:
```bash
mkdir domain application infrastructure
```

2. **Mover código**:
   - `domain/model` y `domain/port` → módulo `domain`
   - `application/usecase` → módulo `application`
   - `infrastructure/*` → módulo `infrastructure`

3. **Configurar builds**:
   - Crear `build.gradle` para cada módulo
   - Actualizar `settings.gradle`

4. **Actualizar imports**: Ajustar imports entre módulos

5. **Testear**: Verificar que todo compila y los tests pasan

## Recursos Adicionales

- [Comparación de Arquitecturas](./overview.md)
- [Hexagonal Single Module](./hexagonal-single.md) - Versión más simple
- [Hexagonal Multi Module Granular](./hexagonal-multi-granular.md) - Versión más modular
- [Comandos del Plugin](../commands/init-clean-arch.md)
