# Inicio Rápido

¡Comienza con Clean Architecture Generator en 10 minutos! Construye un servicio completo de Usuario con API REST.

## Requisitos Previos

- Java 21 o superior
- Gradle 8.x o superior

## Paso 1: Crear un Nuevo Proyecto

```bash
mkdir user-service
cd user-service
```

## Paso 2: Configurar el Plugin

Crea `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()
        gradlePluginPortal()
        mavenCentral()
    }
}

rootProject.name = "user-service"
```

Crea `build.gradle.kts`:

```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
    id("java")
}

group = "com.pragma"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

repositories {
    mavenCentral()
}
```

## Paso 3: Inicializar Arquitectura Limpia

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.user
```

Esto crea:
- ✅ Estructura del proyecto con capas de arquitectura limpia
- ✅ `build.gradle.kts` con dependencias de Spring Boot
- ✅ Archivo de configuración `.cleanarch.yml`
- ✅ Estructura base de paquetes

## Paso 4: Generar Entidad de Dominio

```bash
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String,age:Integer \
  --packageName=com.pragma.user.domain.model
```

Generado: `User.java` con campos id, name, email y age.

## Paso 5: Generar Caso de Uso

```bash
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.user.domain.port.in
```

Generado:
- ✅ `CreateUserUseCase.java` (interfaz del puerto)
- ✅ `CreateUserUseCaseImpl.java` (implementación)

## Paso 6: Generar Adaptador de Salida (Redis)

```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.user.infrastructure.driven-adapters.redis
```

Generado:
- ✅ `UserRepositoryAdapter.java` (adaptador Redis)
- ✅ `UserMapper.java` (mapper MapStruct)
- ✅ `UserData.java` (entidad Redis)

## Paso 7: Generar Adaptador de Entrada (REST Controller)

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData|/users/{id}:GET:findById:User:id:PATH:String" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest
```

Generado: `UserController.java` con endpoints POST y GET.

## Paso 8: Configurar la Aplicación

Agrega a `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: user-service
  data:
    redis:
      host: localhost
      port: 6379

server:
  port: 8080
```

## Paso 9: Construir y Ejecutar

```bash
# Construir el proyecto
./gradlew build

# Ejecutar la aplicación
./gradlew bootRun
```

## Paso 10: Probar tu API

```bash
# Crear un usuario
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }'

# Obtener usuario por ID
curl http://localhost:8080/api/users/{id}
```

## Lo que has Construido

En solo 10 minutos, has creado:

- ✅ Estructura de proyecto con arquitectura limpia
- ✅ Entidad de dominio (User)
- ✅ Caso de uso con puerto e implementación
- ✅ Adaptador de repositorio Redis con operaciones CRUD
- ✅ Controlador REST API con endpoints reactivos
- ✅ Separación completa de responsabilidades

## Estructura del Proyecto

```
user-service/
├── src/main/java/com/pragma/user/
│   ├── domain/
│   │   ├── model/
│   │   │   └── User.java
│   │   └── port/
│   │       └── in/
│   │           └── CreateUserUseCase.java
│   ├── application/
│   │   └── usecase/
│   │       └── CreateUserUseCaseImpl.java
│   └── infrastructure/
│       ├── entry-points/
│       │   └── rest/
│       │       └── UserController.java
│       └── driven-adapters/
│           └── redis/
│               ├── UserRepositoryAdapter.java
│               ├── mapper/
│               │   └── UserMapper.java
│               └── entity/
│                   └── UserData.java
├── build.gradle.kts
├── settings.gradle.kts
└── .cleanarch.yml
```

## Próximos Pasos

### Agregar Más Funcionalidades

```bash
# Agregar más entidades
./gradlew generateEntity --name=Profile --fields=bio:String,avatar:String ...

# Agregar más casos de uso
./gradlew generateUseCase --name=UpdateUser ...

# Agregar más adaptadores
./gradlew generateOutputAdapter --type=mongodb ...
```

### Aprender Más

- [Tutorial Detallado](first-project) - Guía paso a paso con explicaciones
- [Referencia de Comandos](../reference/commands) - Todos los comandos disponibles
- [Generadores de Componentes](../guides/generators/entities) - Profundización en generadores
- [Guía de Arquitectura](../guides/architectures/hexagonal) - Entendiendo arquitectura hexagonal
- [Guía Spring Reactive](../guides/frameworks/spring-reactive) - Patrones de programación reactiva

## Problemas Comunes

### Error de Conexión Redis

Si obtienes un error de conexión Redis, asegúrate de que Redis esté ejecutándose:

```bash
# Usando Docker
docker run -d -p 6379:6379 redis:latest

# O instalar localmente
brew install redis  # macOS
redis-server
```

### Errores de Compilación

Si encuentras errores de compilación:

```bash
# Limpiar y reconstruir
./gradlew clean build

# Verificar versión de Java
java -version  # Debe ser 21 o superior
```

### Plugin No Encontrado

Asegúrate de que `mavenLocal()` esté en tu `settings.gradle.kts`:

```kotlin
pluginManagement {
    repositories {
        mavenLocal()  // ¡Importante!
        gradlePluginPortal()
        mavenCentral()
    }
}
```

## Consejos

1. **Comienza Simple**: Inicia con arquitectura `hexagonal-single`
2. **Usa Reactivo**: Elige paradigma `reactive` para mejor escalabilidad
3. **Prueba Cada Paso**: Genera y prueba componentes incrementalmente
4. **Sigue Convenciones**: Usa PascalCase para nombres, estructura de paquetes apropiada
5. **Lee la Documentación**: Consulta las guías detalladas para mejores prácticas
