# Hexagonal Multi Module Granular

## Descripción

La arquitectura Hexagonal Multi Module Granular lleva la modularidad al máximo nivel. Cada adaptador es un módulo Gradle independiente, permitiendo máxima reutilización y desarrollo en paralelo. Es ideal para proyectos grandes y equipos distribuidos.

## Características

- **Módulos Gradle**: Múltiples (dinámico, crece con adaptadores)
- **Complejidad**: Alta
- **Ideal para**: Proyectos grandes y empresariales
- **Tamaño de equipo**: 8+ desarrolladores
- **Tiempo de build**: Más lento (pero builds incrementales muy eficientes)

## Estructura del Proyecto

```
my-project/
├── build.gradle                    # Build raíz
├── settings.gradle                 # Configuración de todos los módulos
├── domain/                         # Carpeta organizadora (NO es módulo)
│   ├── model/                      # Módulo: Entidades
│   │   ├── build.gradle
│   │   └── src/main/java/com/example/myproject/domain/model/
│   │       ├── User.java
│   │       └── Product.java
│   ├── ports/                      # Módulo: Interfaces
│   │   ├── build.gradle
│   │   └── src/main/java/com/example/myproject/domain/port/
│   │       ├── in/
│   │       │   ├── CreateUserUseCase.java
│   │       │   └── GetProductUseCase.java
│   │       └── out/
│   │           ├── UserRepository.java
│   │           └── ProductRepository.java
│   └── usecase/                    # Módulo: Casos de uso
│       ├── build.gradle
│       └── src/main/java/com/example/myproject/domain/usecase/
│           ├── CreateUserUseCaseImpl.java
│           └── GetProductUseCaseImpl.java
├── application/                    # Carpeta organizadora
│   └── app-service/                # Módulo: Aplicación principal
│       ├── build.gradle
│       └── src/main/
│           ├── java/com/example/myproject/config/
│           │   ├── BeanConfiguration.java
│           │   └── SecurityConfig.java
│           └── resources/
│               ├── application.yml
│               └── logback.xml
└── infrastructure/                 # Carpeta organizadora
    ├── entry-points/               # Carpeta organizadora
    │   ├── rest-api/               # Módulo: API REST
    │   │   ├── build.gradle
    │   │   └── src/main/java/com/example/myproject/entrypoint/rest/
    │   │       ├── UserController.java
    │   │       └── ProductController.java
    │   └── messaging/              # Módulo: Mensajería (opcional)
    │       ├── build.gradle
    │       └── src/main/java/com/example/myproject/entrypoint/messaging/
    │           └── UserEventListener.java
    └── driven-adapters/            # Carpeta organizadora
        ├── mongodb/                # Módulo: Adaptador MongoDB
        │   ├── build.gradle
        │   └── src/main/java/com/example/myproject/adapter/mongodb/
        │       ├── UserMongoAdapter.java
        │       └── UserMongoRepository.java
        ├── redis/                  # Módulo: Adaptador Redis
        │   ├── build.gradle
        │   └── src/main/java/com/example/myproject/adapter/redis/
        │       └── CacheAdapter.java
        └── http-client/            # Módulo: Cliente HTTP (opcional)
            ├── build.gradle
            └── src/main/java/com/example/myproject/adapter/http/
                └── ExternalApiClient.java
```

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                           │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  rest-api    │  │  messaging   │  │   graphql    │     │
│  │   MODULE     │  │    MODULE    │  │    MODULE    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │             │
│         └─────────────────┼──────────────────┘             │
│                           │                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   mongodb    │  │    redis     │  │ http-client  │     │
│  │   MODULE     │  │    MODULE    │  │    MODULE    │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                  │             │
└─────────┼─────────────────┼──────────────────┼─────────────┘
          │                 │                  │
          └─────────────────┼──────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    APPLICATION                              │
│                  ┌──────────────┐                           │
│                  │  app-service │                           │
│                  │    MODULE    │                           │
│                  └──────┬───────┘                           │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                       DOMAIN                                │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    model     │  │    ports     │  │   usecase    │     │
│  │   MODULE     │  │    MODULE    │  │    MODULE    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Módulos y Responsabilidades

### Domain Modules (Módulos de Dominio)

#### model (Entidades)

**Ubicación**: `domain/model/`

**Dependencias**: Ninguna

**Responsabilidades**:
- Entidades del dominio
- Objetos de valor
- Enums del negocio

**build.gradle**:
```groovy
dependencies {
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
}
```

#### ports (Interfaces)

**Ubicación**: `domain/ports/`

**Dependencias**: `model`

**Responsabilidades**:
- Interfaces de casos de uso (puertos de entrada)
- Interfaces de repositorios (puertos de salida)
- Contratos del dominio

**build.gradle**:
```groovy
dependencies {
    implementation project(':domain:model')
}
```

#### usecase (Casos de Uso)

**Ubicación**: `domain/usecase/`

**Dependencias**: `model`, `ports`

**Responsabilidades**:
- Implementación de casos de uso
- Lógica de negocio
- Orquestación del dominio

**build.gradle**:
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
}
```

### Application Module (Módulo de Aplicación)

#### app-service (Aplicación Principal)

**Ubicación**: `application/app-service/`

**Dependencias**: `model`, `ports`, `usecase`

**Responsabilidades**:
- Configuración de beans
- Punto de entrada de la aplicación
- Wiring de dependencias
- Configuración de seguridad

**build.gradle**:
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation project(':domain:usecase')
    
    implementation 'org.springframework.boot:spring-boot-starter'
    implementation 'org.springframework.boot:spring-boot-starter-security'
}
```

### Infrastructure Modules (Módulos de Infraestructura)

#### Entry Points (Adaptadores de Entrada)

Cada entry point es un módulo independiente:

**rest-api**: API REST
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
}
```

**messaging**: Mensajería (Kafka, RabbitMQ)
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation 'org.springframework.kafka:spring-kafka'
}
```

#### Driven Adapters (Adaptadores de Salida)

Cada driven adapter es un módulo independiente:

**mongodb**: Adaptador MongoDB
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb-reactive'
}
```

**redis**: Adaptador Redis
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation 'org.springframework.boot:spring-boot-starter-data-redis-reactive'
}
```

**http-client**: Cliente HTTP
```groovy
dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation 'org.springframework.boot:spring-boot-starter-webflux'
}
```

## Flujo de Dependencias

```
Entry Points ──┐
               ├──→ app-service ──→ usecase ──→ ports ──→ model
Driven Adapters┘

Cada módulo de adaptador:
- Depende de model y ports
- NO depende de otros adaptadores
- Es completamente independiente
```

## Cuándo Usar Esta Arquitectura

### ✅ Casos de Uso Ideales

- Proyectos grandes y empresariales (200k+ líneas de código)
- Equipos grandes (8+ desarrolladores)
- Múltiples equipos trabajando en paralelo
- Necesidad de reutilizar adaptadores en otros proyectos
- Arquitecturas de microservicios complejas
- Cuando diferentes adaptadores evolucionan independientemente
- Proyectos con múltiples clientes (web, mobile, CLI)

### ❌ Cuándo NO Usar

- Proyectos pequeños o medianos
- Equipos pequeños (< 5 desarrolladores)
- Prototipos o MVPs
- Cuando la simplicidad es prioritaria
- Equipos sin experiencia en arquitecturas multi-módulo

## Ventajas

1. **Máxima modularidad**: Cada adaptador es independiente
2. **Reutilización extrema**: Adaptadores pueden usarse en otros proyectos
3. **Desarrollo en paralelo**: Equipos pueden trabajar en adaptadores diferentes sin conflictos
4. **Builds incrementales**: Solo se recompilan módulos modificados
5. **Aislamiento de cambios**: Cambios en un adaptador no afectan otros
6. **Librerías compartidas**: Fácil crear librerías de adaptadores
7. **Testing aislado**: Cada módulo se testea independientemente
8. **Versionado granular**: Cada módulo puede tener su propia versión

## Desventajas

1. **Complejidad alta**: Muchos módulos para gestionar
2. **Configuración compleja**: Requiere experiencia en Gradle multi-módulo
3. **Builds más lentos**: Más módulos = más overhead
4. **Overhead de gestión**: Requiere disciplina en versionado y dependencias
5. **Curva de aprendizaje**: Difícil para desarrolladores junior
6. **Puede ser excesivo**: Overkill para la mayoría de proyectos

## Comandos del Plugin

### Crear un Nuevo Proyecto

```bash
gradle initCleanArch \
  --name=my-project \
  --package=com.example.myproject \
  --architecture=hexagonal-multi-granular \
  --framework=spring \
  --paradigm=reactive
```

Esto creará:
- Módulos base: `model`, `ports`, `usecase`, `app-service`
- Estructura de carpetas para adaptadores
- `settings.gradle` con módulos iniciales

### Generar un Adaptador de Salida

```bash
gradle generateOutputAdapter \
  --name=mongodb \
  --type=database
```

Esto creará:
- **Nuevo módulo**: `infrastructure/driven-adapters/mongodb/`
- `build.gradle` del módulo con dependencias
- Código del adaptador
- Actualización de `settings.gradle`

### Generar un Adaptador de Entrada

```bash
gradle generateInputAdapter \
  --name=rest-api \
  --type=web
```

Esto creará:
- **Nuevo módulo**: `infrastructure/entry-points/rest-api/`
- `build.gradle` del módulo
- Controladores REST
- Actualización de `settings.gradle`

## Configuración de Módulos

### settings.gradle

```groovy
rootProject.name = 'my-project'

// Domain modules
include 'domain:model'
include 'domain:ports'
include 'domain:usecase'

// Application module
include 'application:app-service'

// Infrastructure - Entry Points (se agregan dinámicamente)
include 'infrastructure:entry-points:rest-api'
include 'infrastructure:entry-points:messaging'

// Infrastructure - Driven Adapters (se agregan dinámicamente)
include 'infrastructure:driven-adapters:mongodb'
include 'infrastructure:driven-adapters:redis'
include 'infrastructure:driven-adapters:http-client'
```

### domain/model/build.gradle

```groovy
plugins {
    id 'java-library'
}

group = 'com.example'
version = '1.0.0'

dependencies {
    compileOnly 'org.projectlombok:lombok:1.18.30'
    annotationProcessor 'org.projectlombok:lombok:1.18.30'
    
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
}
```

### domain/ports/build.gradle

```groovy
plugins {
    id 'java-library'
}

dependencies {
    api project(':domain:model')
}
```

### domain/usecase/build.gradle

```groovy
plugins {
    id 'java-library'
}

dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    testImplementation 'org.mockito:mockito-core:5.7.0'
}
```

### application/app-service/build.gradle

```groovy
plugins {
    id 'java'
    id 'org.springframework.boot' version '3.2.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation project(':domain:usecase')
    
    // Aquí se agregan los adaptadores que se usan
    runtimeOnly project(':infrastructure:entry-points:rest-api')
    runtimeOnly project(':infrastructure:driven-adapters:mongodb')
    
    implementation 'org.springframework.boot:spring-boot-starter'
}
```

### infrastructure/driven-adapters/mongodb/build.gradle

```groovy
plugins {
    id 'java-library'
}

dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    
    implementation 'org.springframework.boot:spring-boot-starter-data-mongodb-reactive'
    
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'de.flapdoodle.embed:de.flapdoodle.embed.mongo:4.11.0'
}
```

## Ejemplo Completo

### 1. Crear el Proyecto

```bash
gradle initCleanArch \
  --name=user-service \
  --package=com.example.userservice \
  --architecture=hexagonal-multi-granular \
  --framework=spring \
  --paradigm=reactive
```

### 2. Definir el Dominio

```java
// domain/model/src/.../User.java
public class User {
    private final String id;
    private final String name;
    private final String email;
    
    // Constructor, getters
}

// domain/ports/src/.../CreateUserUseCase.java
public interface CreateUserUseCase {
    Mono<User> execute(String name, String email);
}

// domain/ports/src/.../UserRepository.java
public interface UserRepository {
    Mono<User> save(User user);
    Mono<User> findById(String id);
}

// domain/usecase/src/.../CreateUserUseCaseImpl.java
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

### 3. Generar Adaptadores

```bash
# Adaptador MongoDB (crea nuevo módulo)
gradle generateOutputAdapter --name=mongodb --type=database

# Adaptador REST (crea nuevo módulo)
gradle generateInputAdapter --name=rest-api --type=web
```

### 4. Configurar la Aplicación

```java
// application/app-service/src/.../BeanConfiguration.java
@Configuration
public class BeanConfiguration {
    @Bean
    public CreateUserUseCase createUserUseCase(UserRepository userRepository) {
        return new CreateUserUseCaseImpl(userRepository);
    }
}
```

### 5. Actualizar app-service/build.gradle

```groovy
dependencies {
    // ... dependencias del dominio ...
    
    // Agregar los adaptadores generados
    runtimeOnly project(':infrastructure:entry-points:rest-api')
    runtimeOnly project(':infrastructure:driven-adapters:mongodb')
}
```

## Gestión de Módulos

### Agregar un Nuevo Adaptador Manualmente

1. **Crear carpeta del módulo**:
```bash
mkdir -p infrastructure/driven-adapters/postgresql
```

2. **Crear build.gradle**:
```groovy
plugins {
    id 'java-library'
}

dependencies {
    implementation project(':domain:model')
    implementation project(':domain:ports')
    implementation 'org.springframework.boot:spring-boot-starter-data-r2dbc'
    implementation 'org.postgresql:r2dbc-postgresql'
}
```

3. **Actualizar settings.gradle**:
```groovy
include 'infrastructure:driven-adapters:postgresql'
```

4. **Agregar a app-service/build.gradle**:
```groovy
runtimeOnly project(':infrastructure:driven-adapters:postgresql')
```

### Reutilizar un Adaptador en Otro Proyecto

Los adaptadores son módulos independientes que pueden publicarse y reutilizarse:

```groovy
// En otro proyecto
dependencies {
    implementation 'com.example:mongodb-adapter:1.0.0'
}
```

## Mejores Prácticas

1. **Un adaptador = un módulo**: Cada adaptador debe ser un módulo independiente
2. **Dependencias mínimas**: Cada módulo solo debe depender de lo necesario
3. **Versionado semántico**: Usa versionado semántico para cada módulo
4. **Publicación de adaptadores**: Considera publicar adaptadores reutilizables en un repositorio Maven
5. **Testing por módulo**: Cada módulo debe tener sus propios tests
6. **Documentación por módulo**: Cada adaptador debe tener su README
7. **CI/CD por módulo**: Considera pipelines independientes para módulos críticos
8. **Gestión de versiones**: Usa un archivo de versiones centralizado

## Comparación con Otras Arquitecturas

| Aspecto | Single Module | Multi Module | Multi Granular |
|---------|---------------|--------------|----------------|
| Módulos | 1 | 3 | 7+ (dinámico) |
| Reutilización | Baja | Media | Alta |
| Complejidad | Baja | Media | Alta |
| Build Time | Rápido | Medio | Lento |
| Ideal para | Pequeño | Mediano | Grande |

## Recursos Adicionales

- [Comparación de Arquitecturas](./overview.md)
- [Hexagonal Multi Module](./hexagonal-multi.md) - Versión más simple
- [Hexagonal Single Module](./hexagonal-single.md) - Versión más simple aún
- [Comandos del Plugin](../commands/init-clean-arch.md)
- [Agregar Adaptadores](../getting-started/adding-adapters.md)
