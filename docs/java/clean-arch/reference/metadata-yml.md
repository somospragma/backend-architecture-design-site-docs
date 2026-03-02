# Referencia de metadata.yml

Referencia completa del archivo `metadata.yml` que define las propiedades, dependencias y configuración de los adaptadores.

:::info Schema Version
Esta documentación describe el **Schema v2.0** de `metadata.yml`, que unifica la configuración para adaptadores de entrada (input/entry-points) y salida (output/driven-adapters).
:::

---

## Descripción General

El archivo `metadata.yml` describe un adaptador y contiene toda la información necesaria para generarlo:

- Información básica (nombre, descripción, tipo)
- Sufijo de clase generada
- Dependencias de producción y prueba
- Plantilla de propiedades de aplicación
- Clases de configuración adicionales
- Recursos adicionales (schemas, protos, etc.)
- Plugins y configuración de build
- Validaciones automáticas

Este archivo se encuentra en cada directorio de adaptador dentro del repositorio de plantillas.

**Importante**: El mismo schema aplica tanto para adaptadores de entrada (input) como de salida (output). La única diferencia es el campo `type` que indica la dirección del adaptador.

---

## Ubicación

```
templates/
└── frameworks/
    └── spring/
        └── reactive/
            └── adapters/
                ├── driven-adapters/
                │   ├── mongodb/
                │   │   └── metadata.yml          ← Aquí
                │   ├── redis/
                │   │   └── metadata.yml
                │   └── postgresql/
                │       └── metadata.yml
                └── entry-points/
                    ├── rest/
                    │   └── metadata.yml
                    └── websocket/
                        └── metadata.yml
```

---

## Catálogo de Adaptadores (index.json)

Además del `metadata.yml`, cada directorio de adaptadores contiene un archivo `index.json` que actúa como catálogo de todos los adaptadores disponibles en ese nivel.

### Ubicación del Catálogo

```
templates/
└── frameworks/
    └── spring/
        └── reactive/
            └── adapters/
                ├── driven-adapters/
                │   ├── index.json              ← Catálogo de driven adapters
                │   ├── mongodb/
                │   │   └── metadata.yml
                │   ├── redis/
                │   │   └── metadata.yml
                │   └── postgresql/
                │       └── metadata.yml
                └── entry-points/
                    ├── index.json              ← Catálogo de entry points
                    ├── rest/
                    │   └── metadata.yml
                    └── websocket/
                        └── metadata.yml
```

### Estructura del index.json

```json
{
  "adapters": [
    {
      "name": "mongodb",
      "displayName": "MongoDB Database",
      "description": "Adaptador de base de datos MongoDB usando Spring Data MongoDB Reactive",
      "type": "driven-adapter",
      "tags": ["database", "mongodb", "reactive", "nosql"]
    },
    {
      "name": "redis",
      "displayName": "Redis Cache",
      "description": "Adaptador de caché Redis usando Spring Data Redis Reactive",
      "type": "driven-adapter",
      "tags": ["cache", "redis", "reactive"]
    }
  ]
}
```

### Propósito del Catálogo

El archivo `index.json` permite al plugin:

1. **Descubrimiento rápido**: Listar todos los adaptadores disponibles sin leer cada `metadata.yml`
2. **Búsqueda por tags**: Filtrar adaptadores por categorías (database, cache, messaging, etc.)
3. **Validación**: Verificar que un tipo de adaptador existe antes de intentar generarlo
4. **Documentación**: Generar listados automáticos de adaptadores disponibles

### Sincronización

:::warning Importante
El `index.json` debe mantenerse sincronizado con los directorios de adaptadores. Si agregas un nuevo adaptador, debes actualizar el `index.json` correspondiente.
:::

---

## Schema v2.0 - Campos Unificados

### Campos Obligatorios

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `name` | String | Identificador del adaptador (lowercase, hyphen-separated) | `rest`, `mongodb`, `grpc` |
| `type` | String | Dirección del adaptador: `input` o `output` | `input`, `output` |
| `description` | String | Descripción del adaptador | `REST API controller using Spring MVC` |

### Campos Opcionales

#### Generación de Archivos
| Campo | Tipo | Descripción | Default | Ejemplo |
|-------|------|-------------|---------|---------|
| `suffix` | String | Sufijo para clase generada | `"Adapter"` | `"Controller"`, `"Repository"` |

#### Dependencias
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `dependencies` | List | Dependencias de implementación (Gradle) |
| `testDependencies` | List | Dependencias de test |

#### Configuración
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `applicationPropertiesTemplate` | String | Path al template de application.yml |
| `configurationClasses` | List | Clases @Configuration a generar |

#### Recursos Adicionales
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `additionalResources` | List | Archivos adicionales (schemas, protos, etc.) |

#### Build
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `buildPlugins` | List | Plugins de Gradle requeridos |
| `buildConfiguration` | String | Configuración de build.gradle.kts (Kotlin DSL) |

---

## Ejemplo Completo - Schema v2.0

```yaml
# ============================================================================
# METADATA.YML - SCHEMA v2.0 (UNIFIED FOR INPUT AND OUTPUT ADAPTERS)
# ============================================================================

# ----------------------------------------------------------------------------
# REQUIRED FIELDS
# ----------------------------------------------------------------------------
name: mongodb                   # Adapter identifier (lowercase, hyphen-separated)
type: output                    # "input" for entry-points, "output" for driven-adapters
description: MongoDB database adapter using Spring Data MongoDB Reactive

# ----------------------------------------------------------------------------
# OPTIONAL - FILE GENERATION
# ----------------------------------------------------------------------------
suffix: "Adapter"              # Class name suffix: {AdapterName}{Suffix}.java

# ----------------------------------------------------------------------------
# OPTIONAL - DEPENDENCIES
# ----------------------------------------------------------------------------
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-validation
    version: 3.2.0

testDependencies:
  - group: de.flapdoodle.embed
    artifact: de.flapdoodle.embed.mongo
    version: 4.11.0
  - group: org.testcontainers
    artifact: mongodb
    version: 1.19.3

# ----------------------------------------------------------------------------
# OPTIONAL - APPLICATION CONFIGURATION
# ----------------------------------------------------------------------------
applicationPropertiesTemplate: application-properties.yml.ftl

# ----------------------------------------------------------------------------
# OPTIONAL - CONFIGURATION CLASSES
# ----------------------------------------------------------------------------
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl

# ----------------------------------------------------------------------------
# OPTIONAL - ADDITIONAL RESOURCES
# ----------------------------------------------------------------------------
additionalResources:
  - name: schema.graphqls
    targetPath: graphql
    templatePath: schema.graphqls.ftl

# ----------------------------------------------------------------------------
# OPTIONAL - BUILD CONFIGURATION
# ----------------------------------------------------------------------------
buildPlugins:
  - id: com.google.protobuf
    version: 0.9.4

buildConfiguration: |
  protobuf {
      protoc {
          artifact = "com.google.protobuf:protoc:3.24.0"
      }
  }
```

---

## Validaciones Automáticas

El plugin valida automáticamente el `metadata.yml` con **28 validaciones** antes de generar el adaptador:

### Validaciones de Templates (1-7)
1. ✓ Adapter metadata existe
2. ✓ Main template existe y es válido
3. ✓ Entity template existe (si needsMapper)
4. ✓ Mapper template existe (si needsMapper)
5. ✓ Application properties template existe (si definido)
6. ✓ Configuration class templates existen (si definidos)
7. ✓ Module build template existe (si adaptersAsModules)

### Validaciones de Metadata Básico (8-20)
8. ✓ `name != null && !name.isBlank()`
9. ✓ `direction != null`
10. ✓ `type` debe ser: "input", "output", "driving", o "driven"
11. ✓ `dependencies` debe ser List válida
12. ✓ `testDependencies` debe ser List válida
13. ✓ `configurationClasses` debe ser List válida
14. ✓ `additionalResources` debe ser List válida
15. ✓ `buildPlugins` debe ser List válida
16. ✓ Cada `dependency` debe tener: group, artifact, version
17. ✓ Cada `configurationClass` debe tener: name, packagePath, templatePath
18. ✓ Cada `additionalResource` debe tener: name, templatePath
19. ✓ Cada `buildPlugin` debe tener: id, version
20. ✓ Templates referenciados deben existir

### Validaciones Adicionales (21-28)
21. ✓ `suffix` no debe estar vacío si se especifica
22. ✓ `applicationPropertiesTemplate` debe existir si se especifica
23. ✓ `buildConfiguration` debe ser válido Kotlin DSL si se especifica
24. ✓ `additionalResources.targetPath` debe ser válido (no null, no vacío)
25. ✓ `dependencies` no deben tener duplicados (group:artifact)
26. ✓ `testDependencies` no deben tener duplicados (group:artifact)
27. ✓ `configurationClasses.name` debe ser válido como nombre de clase Java
28. ✓ `configurationClasses.packagePath` debe ser válido como paquete Java

:::tip Validation-Before-Modification
Todas las validaciones se ejecutan **antes** de modificar cualquier archivo del proyecto. Si alguna validación falla, el plugin muestra todos los errores y no realiza ningún cambio.
:::

---

## Campos del Archivo

### name (Obligatorio)

**Tipo:** String  
**Descripción:** Identificador único del adaptador (lowercase, hyphen-separated)  
**Ejemplos:** `rest`, `mongodb`, `grpc`, `redis`, `graphql`

```yaml
name: mongodb
```

### type (Obligatorio)

**Tipo:** String  
**Valores:** `input` | `output` | `driving` (legacy) | `driven` (legacy)  
**Descripción:** Dirección del adaptador

- `input`: Para entry-points (adaptadores de entrada)
- `output`: Para driven-adapters (adaptadores de salida)
- `driving`/`driven`: Valores legacy, se recomienda usar `input`/`output`

```yaml
type: output
```

:::info Migración de Legacy Values
Si tu metadata.yml usa `type: driving` o `type: driven`, considera actualizarlos a `input` y `output` respectivamente. Los valores legacy siguen siendo soportados por compatibilidad.
:::

### description (Obligatorio)

**Tipo:** String  
**Descripción:** Descripción clara del adaptador

```yaml
description: MongoDB database adapter using Spring Data MongoDB Reactive
```

---

### suffix (Opcional)

**Tipo:** String  
**Default:** `"Adapter"`  
**Descripción:** Sufijo para la clase generada. Se usa para generar: `{AdapterName}{Suffix}.java`

**Ejemplos:**
- `"Controller"` → `UserController.java`
- `"Repository"` → `UserRepository.java`
- `"Service"` → `UserService.java`
- `"Adapter"` → `UserAdapter.java`

```yaml
suffix: "Repository"
```

:::warning Validación
Si especificas `suffix`, no debe estar vacío. Un suffix vacío causará un error de validación.
:::

---

### dependencies (Opcional)

**Tipo:** List<Dependency>  
**Descripción:** Dependencias de implementación que se agregan automáticamente al `build.gradle.kts`

**Estructura de cada dependency:**
```yaml
dependencies:
  - group: <groupId>        # Maven group ID (requerido)
    artifact: <artifactId>  # Maven artifact ID (requerido)
    version: <version>      # Versión (requerido)
```

**Ejemplo:**
```yaml
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-validation
    version: 3.2.0
```

**Resultado en build.gradle.kts:**
```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive:3.2.0")
    implementation("org.springframework.boot:spring-boot-starter-validation:3.2.0")
}
```

:::tip Adición Automática
El plugin agrega las dependencias automáticamente. No necesitas editarlas manualmente en build.gradle.kts.
:::

:::warning Validaciones
- Cada dependency debe tener: `group`, `artifact`, `version`
- No debe haber duplicados (se valida por `group:artifact`)
:::

---

### testDependencies (Opcional)

**Tipo:** List<Dependency>  
**Descripción:** Dependencias de test que se agregan con scope `testImplementation`

**Estructura:**
```yaml
testDependencies:
  - group: <groupId>
    artifact: <artifactId>
    version: <version>
```

**Ejemplo:**
```yaml
testDependencies:
  - group: de.flapdoodle.embed
    artifact: de.flapdoodle.embed.mongo
    version: 4.11.0
  - group: org.testcontainers
    artifact: mongodb
    version: 1.19.3
```

**Resultado en build.gradle.kts:**
```kotlin
dependencies {
    testImplementation("de.flapdoodle.embed:de.flapdoodle.embed.mongo:4.11.0")
    testImplementation("org.testcontainers:mongodb:1.19.3")
}
```

:::warning Validaciones
- Cada testDependency debe tener: `group`, `artifact`, `version`
- No debe haber duplicados (se valida por `group:artifact`)
:::

---

### applicationPropertiesTemplate (Opcional)

**Tipo:** String  
**Descripción:** Path al template de application.yml (relativo al directorio del adaptador)

El plugin procesa el template con FreeMarker y lo fusiona automáticamente con el `application.yml` existente.

**Ejemplo:**
```yaml
applicationPropertiesTemplate: application-properties.yml.ftl
```

**Contenido del template (`application-properties.yml.ftl`):**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/${projectName}
      database: ${projectName}
```

**Variables disponibles en el template:**
- `${adapterName}`: Nombre del adaptador
- `${packageName}`: Package completo
- `${projectName}`: Nombre del proyecto
- `${adapterType}`: Tipo del adaptador

:::warning Validación
Si especificas `applicationPropertiesTemplate`, el archivo debe existir en el directorio del adaptador.
:::

---

### configurationClasses (Opcional)

**Tipo:** List<ConfigurationClass>  
**Descripción:** Clases @Configuration adicionales a generar

**Estructura de cada clase:**
```yaml
configurationClasses:
  - name: <ClassName>           # Nombre de la clase (requerido)
    packagePath: <subpackage>   # Sub-paquete relativo (requerido)
    templatePath: <template>    # Path al template (requerido)
```

**Ejemplo:**
```yaml
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl
  - name: MongoHealthIndicator
    packagePath: health
    templatePath: HealthIndicator.java.ftl
```

**Resultado:** Si el adaptador se genera en `com.pragma.infrastructure.drivenadapters.mongodb`:
- `com.pragma.infrastructure.drivenadapters.mongodb.config.MongoConfig`
- `com.pragma.infrastructure.drivenadapters.mongodb.health.MongoHealthIndicator`

:::warning Validaciones
- Cada configurationClass debe tener: `name`, `packagePath`, `templatePath`
- `name` debe ser un nombre de clase Java válido (empieza con mayúscula, solo letras/números/underscore)
- `packagePath` debe ser un paquete Java válido (lowercase, separado por puntos)
- El template referenciado debe existir
:::

---

### additionalResources (Opcional)

**Tipo:** List<AdditionalResource>  
**Descripción:** Archivos adicionales a generar (schemas GraphQL, protos gRPC, etc.)

**Estructura:**
```yaml
additionalResources:
  - name: <filename>            # Nombre del archivo (requerido)
    targetPath: <directory>     # Directorio destino en resources (requerido)
    templatePath: <template>    # Path al template (requerido)
```

**Ejemplo:**
```yaml
additionalResources:
  - name: schema.graphqls
    targetPath: graphql
    templatePath: schema.graphqls.ftl
  - name: service.proto
    targetPath: proto
    templatePath: service.proto.ftl
```

**Resultado:** Los archivos se generan en:
- `src/main/resources/graphql/schema.graphqls`
- `src/main/resources/proto/service.proto`

:::warning Validaciones
- Cada additionalResource debe tener: `name`, `templatePath`
- `targetPath` debe ser válido (no null, no vacío)
- El template referenciado debe existir
:::

---

### buildPlugins (Opcional)

**Tipo:** List<BuildPlugin>  
**Descripción:** Plugins de Gradle requeridos por el adaptador

**Estructura:**
```yaml
buildPlugins:
  - id: <plugin-id>      # ID del plugin (requerido)
    version: <version>   # Versión (requerido)
```

**Ejemplo:**
```yaml
buildPlugins:
  - id: com.google.protobuf
    version: 0.9.4
```

**Resultado en build.gradle.kts:**
```kotlin
plugins {
    id("com.google.protobuf") version "0.9.4"
}
```

:::warning Validaciones
- Cada buildPlugin debe tener: `id`, `version`
:::

---

### buildConfiguration (Opcional)

**Tipo:** String (multi-line)  
**Descripción:** Configuración adicional de build.gradle.kts en Kotlin DSL

El contenido se procesa con FreeMarker y se agrega al final del `build.gradle.kts`.

**Variables disponibles:**
- `${resourcesPath}`: Path a resources desde structure.yml
- `${adapterName}`: Nombre del adaptador
- `${packageName}`: Package completo
- `${adapterType}`: Tipo del adaptador

**Ejemplo:**
```yaml
buildConfiguration: |
  protobuf {
      protoc {
          artifact = "com.google.protobuf:protoc:3.24.0"
      }
      plugins {
          create("grpc") {
              artifact = "io.grpc:protoc-gen-grpc-java:1.58.0"
          }
      }
  }
  
  sourceSets {
      main {
          proto {
              srcDir("${resourcesPath}/proto")
          }
      }
  }
```

:::warning Validación
Si especificas `buildConfiguration`, debe ser Kotlin DSL válido (validación básica de sintaxis).
:::

---

## Información Básica (Legacy - Deprecated)

Los siguientes campos eran parte del schema anterior y están deprecados en v2.0:

| Campo | Estado | Alternativa |
|-------|--------|-------------|
| `displayName` | Deprecated | Usar `name` |
| `framework` | Deprecated | Se detecta automáticamente |
| `paradigm` | Deprecated | Se detecta automáticamente |
| `version` | Deprecated | No necesario |
| `author` | Deprecated | No necesario |
| `maintainers` | Deprecated | No necesario |
| `parameters` | Deprecated | Se pasan como argumentos del comando |
| `files` | Deprecated | Se detectan automáticamente |
| `examples` | Deprecated | Ver documentación de comandos |
| `compatibility` | Deprecated | No necesario |
| `tags` | Deprecated | No necesario |

---

## Información Básica

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | String | Sí | Identificador único del adaptador (usado internamente) |
| `displayName` | String | Sí | Nombre para mostrar en documentación |
| `description` | String | Sí | Descripción breve del adaptador |
| `framework` | String | Sí | Framework soportado (`spring`, `quarkus`) |
| `paradigm` | String | Sí | Paradigma soportado (`reactive`, `imperative`) |
| `type` | String | Sí | Tipo de adaptador (`driven-adapter`, `entry-point`) |
| `version` | String | Sí | Versión del adaptador |
| `author` | String | No | Autor del adaptador |
| `maintainers` | Array[String] | No | Lista de mantenedores |

**Ejemplo:**
```yaml
name: redis
displayName: Redis Cache
description: Adaptador de caché Redis usando Spring Data Redis Reactive
framework: spring
paradigm: reactive
type: driven-adapter
version: 1.0.0
author: Pragma Team
maintainers:
  - pragma@pragma.com.co
  - team@pragma.com.co
```

---

### parameters

Define los parámetros que el adaptador acepta al generarse.

#### parameters.required

Parámetros obligatorios que el usuario debe proporcionar.

**Campos de cada parámetro:**
- `name`: Nombre del parámetro
- `type`: Tipo de dato (`string`, `number`, `boolean`)
- `description`: Descripción del parámetro
- `example`: Ejemplo de valor

**Ejemplo:**
```yaml
parameters:
  required:
    - name: name
      type: string
      description: Nombre del adaptador
      example: UserRepository
    - name: entityName
      type: string
      description: Nombre de la entidad del dominio
      example: User
```

#### parameters.optional

Parámetros opcionales con valores por defecto.

**Campos adicionales:**
- `default`: Valor por defecto (puede usar placeholders de FreeMarker)

**Ejemplo:**
```yaml
parameters:
  optional:
    - name: tableName
      type: string
      description: Nombre de la tabla en la base de datos
      default: "{entityName?lower_case}s"
      example: users
    - name: enableCache
      type: boolean
      description: Habilitar caché de segundo nivel
      default: "true"
      example: true
```

---

### dependencies

Dependencias de producción que se agregan automáticamente al `build.gradle.kts` cuando se genera el adaptador.

:::tip Adición Automática
El plugin lee las dependencias del `metadata.yml` y las agrega automáticamente al archivo `build.gradle.kts` del proyecto con scope `implementation`. No necesitas agregarlas manualmente.
:::

**Formato:**
```yaml
dependencies:
  - group: <groupId>
    artifact: <artifactId>
    version: <version>
```

**Campos:**
- `group`: Group ID de Maven
- `artifact`: Artifact ID
- `version`: Versión de la dependencia

**Ejemplo:**
```yaml
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-validation
    version: 3.2.0
  - group: io.projectreactor
    artifact: reactor-core
    version: 3.6.0
```

**Resultado en build.gradle.kts:**
```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-mongodb-reactive:3.2.0")
    implementation("org.springframework.boot:spring-boot-starter-validation:3.2.0")
    implementation("io.projectreactor:reactor-core:3.6.0")
    // ... otras dependencias existentes
}
```

---

### testDependencies

Dependencias de prueba que se agregan automáticamente con scope `test`.

:::info Importante
Las dependencias de prueba se agregan automáticamente con scope `testImplementation` y no afectan el classpath de producción.
:::

**Formato:**
```yaml
testDependencies:
  - group: <groupId>
    artifact: <artifactId>
    version: <version>
    scope: test
```

**Campos:**
- `group`: Group ID de Maven
- `artifact`: Artifact ID
- `version`: Versión de la dependencia
- `scope`: Scope de la dependencia (siempre `test`)

**Ejemplo:**
```yaml
testDependencies:
  - group: de.flapdoodle.embed
    artifact: de.flapdoodle.embed.mongo
    version: 4.11.0
    scope: test
  - group: org.testcontainers
    artifact: mongodb
    version: 1.19.3
    scope: test
  - group: io.projectreactor
    artifact: reactor-test
    version: 3.6.0
    scope: test
```

**Resultado en build.gradle.kts:**
```kotlin
dependencies {
    testImplementation("de.flapdoodle.embed:de.flapdoodle.embed.mongo:4.11.0")
    testImplementation("org.testcontainers:mongodb:1.19.3")
    testImplementation("io.projectreactor:reactor-test:3.6.0")
    // ... otras dependencias de prueba
}
```

---

### applicationPropertiesTemplate

Ruta a la plantilla de propiedades de aplicación que se fusionará automáticamente con el `application.yml` existente del proyecto.

:::tip Fusión Automática
El plugin procesa la plantilla de propiedades y la fusiona automáticamente con el `application.yml` existente. Las propiedades nuevas se agregan y las existentes se preservan. Si hay conflictos, el plugin te notifica.
:::

**Tipo:** String (ruta relativa al directorio del adaptador)

**Ejemplo:**
```yaml
applicationPropertiesTemplate: application-properties.yml.ftl
```

**Contenido de `application-properties.yml.ftl`:**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/${projectName}
      # ADVERTENCIA: No almacenes credenciales en control de versiones
      # Usa variables de entorno o gestión de secretos en producción
      database: ${projectName}
      auto-index-creation: true

logging:
  level:
    org.springframework.data.mongodb: DEBUG
```

**Proceso de fusión:**
1. El plugin procesa la plantilla con el contexto del adaptador (nombre, paquete, etc.)
2. Parsea el YAML resultante
3. Lee el `application.yml` existente del proyecto
4. Fusiona las propiedades nuevas con las existentes
5. Escribe el resultado en `src/main/resources/application.yml`

**Ejemplo de fusión:**

`application.yml` existente:
```yaml
spring:
  application:
    name: my-app
server:
  port: 8080
```

Después de generar adaptador MongoDB:
```yaml
spring:
  application:
    name: my-app
  data:
    mongodb:
      uri: mongodb://localhost:27017/my-app
      database: my-app
      auto-index-creation: true
server:
  port: 8080
logging:
  level:
    org.springframework.data.mongodb: DEBUG
```

:::warning Seguridad
Las plantillas de propiedades deben incluir comentarios de advertencia sobre no almacenar credenciales en el código fuente.
:::

---

### configurationClasses

Clases de configuración adicionales que se generan junto con el adaptador.

**Campos de cada clase:**
- `name`: Nombre de la clase de configuración
- `packagePath`: Ruta del paquete relativa al paquete del adaptador
- `templatePath`: Ruta a la plantilla FreeMarker (opcional, default: `{name}.java.ftl`)

**Ejemplo:**
```yaml
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: MongoConfig.java.ftl
  - name: MongoHealthIndicator
    packagePath: health
    templatePath: MongoHealthIndicator.java.ftl
  - name: MongoAuditingConfig
    packagePath: config
```

**Resultado:** Si el adaptador se genera en `com.pragma.user.infrastructure.driven-adapters.mongodb`:
- `com.pragma.user.infrastructure.driven-adapters.mongodb.config.MongoConfig`
- `com.pragma.user.infrastructure.driven-adapters.mongodb.health.MongoHealthIndicator`
- `com.pragma.user.infrastructure.driven-adapters.mongodb.config.MongoAuditingConfig`

---

### files

Lista de archivos de plantilla a procesar.

**Campos:**
- `name`: Nombre del archivo de plantilla (debe existir en el directorio del adaptador)
- `output`: Nombre del archivo de salida (puede usar placeholders)
- `description`: Descripción del archivo generado

**Placeholders disponibles:**
- `{adapterName}`: Nombre del adaptador
- `{entityName}`: Nombre de la entidad
- `{projectName}`: Nombre del proyecto
- Cualquier parámetro definido en `parameters`

**Ejemplo:**
```yaml
files:
  - name: Adapter.java.ftl
    output: "{adapterName}MongoAdapter.java"
    description: Implementación del adaptador MongoDB
  - name: Repository.java.ftl
    output: "{adapterName}MongoRepository.java"
    description: Repositorio reactivo de MongoDB
  - name: Entity.java.ftl
    output: "{entityName}Data.java"
    description: Entidad de datos de MongoDB
  - name: Mapper.java.ftl
    output: "{entityName}Mapper.java"
    description: Mapper MapStruct
```

---

### examples

Ejemplos de uso del adaptador para documentación.

**Campos:**
- `name`: Nombre del ejemplo
- `description`: Descripción del caso de uso
- `command`: Comando completo para ejecutar

**Ejemplo:**
```yaml
examples:
  - name: Persistencia básica
    description: Adaptador de persistencia MongoDB con configuración por defecto
    command: |
      ./gradlew generateOutputAdapter \
        --type=mongodb \
        --name=UserPersistence \
        --entityName=User
  
  - name: Persistencia con configuración personalizada
    description: Adaptador con colección y base de datos personalizadas
    command: |
      ./gradlew generateOutputAdapter \
        --type=mongodb \
        --name=ProductPersistence \
        --entityName=Product \
        --collectionName=products_catalog \
        --databaseName=inventory
```

---

### compatibility

Requisitos de compatibilidad del adaptador.

**Campos:**
- `plugin`: Versión mínima del plugin
- `spring`: Versión mínima de Spring (si aplica)
- `quarkus`: Versión mínima de Quarkus (si aplica)
- `java`: Versión mínima de Java

**Ejemplo:**
```yaml
compatibility:
  plugin: ">=0.1.0"
  spring: ">=3.0.0"
  java: ">=17"
```

---

### tags

Etiquetas para búsqueda y categorización.

**Tipo:** Array[String]

**Ejemplo:**
```yaml
tags:
  - database
  - mongodb
  - reactive
  - nosql
  - persistence
  - cache
```

---

## Ejemplos por Tipo de Adaptador

### Driven Adapter - Base de Datos

```yaml
name: postgresql
displayName: PostgreSQL Database
description: Adaptador de base de datos PostgreSQL usando R2DBC
framework: spring
paradigm: reactive
type: driven-adapter
version: 1.0.0

parameters:
  required:
    - name: name
      type: string
      description: Nombre del adaptador
      example: UserRepository
    - name: entityName
      type: string
      description: Nombre de la entidad
      example: User

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-r2dbc
    version: 3.2.0
  - group: org.postgresql
    artifact: r2dbc-postgresql
    version: 1.0.4.RELEASE

testDependencies:
  - group: org.testcontainers
    artifact: postgresql
    version: 1.19.3
    scope: test

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: R2dbcConfig
    packagePath: config

files:
  - name: Adapter.java.ftl
    output: "{adapterName}PostgresAdapter.java"
    description: Implementación del adaptador PostgreSQL
  - name: Repository.java.ftl
    output: "{adapterName}R2dbcRepository.java"
    description: Repositorio R2DBC

tags:
  - database
  - postgresql
  - reactive
  - sql
  - r2dbc
```

### Entry Point - REST Controller

```yaml
name: rest
displayName: REST API Controller
description: Controlador REST usando Spring WebFlux
framework: spring
paradigm: reactive
type: entry-point
version: 1.0.0

parameters:
  required:
    - name: name
      type: string
      description: Nombre del controlador
      example: User
    - name: useCaseName
      type: string
      description: Nombre del caso de uso a inyectar
      example: CreateUserUseCase

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-webflux
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-validation
    version: 3.2.0

testDependencies:
  - group: io.projectreactor
    artifact: reactor-test
    version: 3.6.0
    scope: test

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: WebFluxConfig
    packagePath: config
  - name: CorsConfig
    packagePath: config

files:
  - name: Controller.java.ftl
    output: "{name}Controller.java"
    description: Controlador REST reactivo

tags:
  - rest
  - api
  - webflux
  - reactive
  - controller
```

### Driven Adapter - Cliente HTTP

```yaml
name: http-client
displayName: HTTP REST Client
description: Cliente HTTP reactivo usando WebClient
framework: spring
paradigm: reactive
type: driven-adapter
version: 1.0.0

parameters:
  required:
    - name: name
      type: string
      description: Nombre del cliente
      example: PaymentGateway
    - name: baseUrl
      type: string
      description: URL base del servicio externo
      example: https://api.payment.com
  optional:
    - name: timeout
      type: number
      description: Timeout en segundos
      default: "30"
      example: 60

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-webflux
    version: 3.2.0

testDependencies:
  - group: com.github.tomakehurst
    artifact: wiremock-jre8
    version: 2.35.0
    scope: test

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: WebClientConfig
    packagePath: config

files:
  - name: Client.java.ftl
    output: "{name}Client.java"
    description: Cliente HTTP reactivo

tags:
  - http
  - client
  - rest
  - reactive
  - webclient
```

---

## Validación

El plugin valida `metadata.yml` al cargar plantillas:

### Validaciones Realizadas

1. **Campos requeridos presentes**
2. **Tipos de datos correctos**
3. **Archivos de plantilla existen**
4. **Plantilla de propiedades existe** (si se especifica)
5. **Plantillas de clases de configuración existen**

### Errores Comunes

**Archivo de plantilla faltante:**
```
Template file 'Adapter.java.ftl' not found in adapter 'mongodb'.
Check metadata.yml references.
```

**Plantilla de propiedades faltante:**
```
Application properties template 'application-properties.yml.ftl' not found.
Check applicationPropertiesTemplate in metadata.yml.
```

**Campo requerido faltante:**
```
Missing required field 'name' in metadata.yml.
```

---

## Mejores Prácticas

## Ejemplos Completos por Tipo

### Ejemplo 1: REST Input Adapter (Imperative)

```yaml
name: rest
type: input
description: REST API controller using Spring MVC
suffix: "Controller"

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-web
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-validation
    version: 3.2.0

testDependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-test
    version: 3.2.0

applicationPropertiesTemplate: application-properties.yml.ftl
```

### Ejemplo 2: gRPC Input Adapter con Build Configuration

```yaml
name: grpc
type: input
description: gRPC entry point using gRPC Spring Boot Starter
suffix: GrpcService

dependencies:
  - group: net.devh
    artifact: grpc-server-spring-boot-starter
    version: 2.15.0.RELEASE
  - group: io.grpc
    artifact: grpc-stub
    version: 1.58.0

testDependencies:
  - group: net.devh
    artifact: grpc-client-spring-boot-starter
    version: 2.15.0.RELEASE

applicationPropertiesTemplate: application-properties.yml.ftl

additionalResources:
  - name: service.proto
    targetPath: proto
    templatePath: service.proto.ftl

buildPlugins:
  - id: com.google.protobuf
    version: 0.9.4

buildConfiguration: |
  protobuf {
      protoc {
          artifact = "com.google.protobuf:protoc:3.24.0"
      }
      plugins {
          create("grpc") {
              artifact = "io.grpc:protoc-gen-grpc-java:1.58.0"
          }
      }
      generateProtoTasks {
          all().forEach { task ->
              task.plugins {
                  create("grpc")
              }
          }
      }
  }
  
  sourceSets {
      main {
          proto {
              srcDir("${resourcesPath}/proto")
          }
      }
  }
```

### Ejemplo 3: GraphQL Input Adapter

```yaml
name: graphql
type: input
description: GraphQL entry point using Spring for GraphQL
suffix: GraphQLController

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-graphql
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-web
    version: 3.2.0

testDependencies:
  - group: org.springframework.graphql
    artifact: spring-graphql-test
    version: 1.2.0

applicationPropertiesTemplate: application-properties.yml.ftl

additionalResources:
  - name: schema.graphqls
    targetPath: graphql
    templatePath: schema.graphqls.ftl
```

### Ejemplo 4: MongoDB Output Adapter

```yaml
name: mongodb
type: output
description: MongoDB database adapter using Spring Data MongoDB Reactive
suffix: Adapter

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-mongodb-reactive
    version: 3.2.0

testDependencies:
  - group: de.flapdoodle.embed
    artifact: de.flapdoodle.embed.mongo
    version: 4.11.0
  - group: org.testcontainers
    artifact: mongodb
    version: 1.19.3

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl
```

### Ejemplo 5: Redis Output Adapter

```yaml
name: redis
type: output
description: Redis cache adapter using Spring Data Redis
suffix: Adapter

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-redis
    version: 3.2.0
  - group: io.lettuce
    artifact: lettuce-core
    version: 6.3.0.RELEASE

testDependencies:
  - group: it.ozimov
    artifact: embedded-redis
    version: 0.7.3

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: RedisConfig
    packagePath: config
    templatePath: Config.java.ftl
```

### Ejemplo 6: PostgreSQL Output Adapter

```yaml
name: postgresql
type: output
description: PostgreSQL database adapter using Spring Data JPA
suffix: Repository

dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-data-jpa
    version: 3.2.0
  - group: org.postgresql
    artifact: postgresql
    version: 42.7.1

testDependencies:
  - group: com.h2database
    artifact: h2
    version: 2.2.224

applicationPropertiesTemplate: application-properties.yml.ftl

configurationClasses:
  - name: JpaConfig
    packagePath: config
    templatePath: JpaConfig.java.ftl
```

---

## Mejores Prácticas

1. **Usa el schema v2.0** - Sigue el schema unificado para input y output adapters
2. **Especifica suffix** - Ayuda a identificar el propósito de la clase generada
3. **Incluye dependencias de prueba** - Facilita testing desde el inicio
4. **Agrega applicationPropertiesTemplate** - Proporciona configuración por defecto
5. **Valida nombres Java** - Asegúrate que configurationClasses.name sea válido
6. **Evita duplicados** - No repitas dependencies o testDependencies
7. **Usa buildConfiguration para casos especiales** - gRPC, protobuf, etc.
8. **Documenta additionalResources** - Schemas GraphQL, protos gRPC, etc.

---

## Errores Comunes y Soluciones

### Error: "suffix cannot be empty if specified"
```yaml
# ❌ Incorrecto
suffix: ""

# ✅ Correcto
suffix: "Adapter"
# o simplemente omitir el campo
```

### Error: "Duplicate dependency found"
```yaml
# ❌ Incorrecto
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-web
    version: 3.2.0
  - group: org.springframework.boot
    artifact: spring-boot-starter-web
    version: 3.1.0

# ✅ Correcto
dependencies:
  - group: org.springframework.boot
    artifact: spring-boot-starter-web
    version: 3.2.0
```

### Error: "Invalid Java class name"
```yaml
# ❌ Incorrecto
configurationClasses:
  - name: mongoConfig  # Debe empezar con mayúscula
    packagePath: config
    templatePath: Config.java.ftl

# ✅ Correcto
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl
```

### Error: "Invalid Java package name"
```yaml
# ❌ Incorrecto
configurationClasses:
  - name: MongoConfig
    packagePath: Config  # Debe ser lowercase
    templatePath: Config.java.ftl

# ✅ Correcto
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: Config.java.ftl
```

---

## Próximos Pasos

- [Referencia de .cleanarch.yml](cleanarch-yml) - Configuración del proyecto
- [Referencia de structure.yml](structure-yml) - Configuración de arquitecturas
- [Agregar Adaptadores](../contributors/adding-adapter) - Guía para crear nuevos adaptadores
- [Modo Developer](../contributors/developer-mode) - Desarrollo de plantillas
