# Referencia de metadata.yml

Referencia completa del archivo `metadata.yml` que define las propiedades, dependencias y configuración de los adaptadores.

---

## Descripción General

El archivo `metadata.yml` describe un adaptador y contiene toda la información necesaria para generarlo:

- Información básica (nombre, descripción, tipo)
- Parámetros requeridos y opcionales
- Dependencias de producción y prueba
- Plantilla de propiedades de aplicación
- Clases de configuración adicionales
- Archivos de plantilla a procesar
- Ejemplos de uso

Este archivo se encuentra en cada directorio de adaptador dentro del repositorio de plantillas.

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

## Ejemplo Completo

```yaml
# Información básica del adaptador
name: mongodb
displayName: MongoDB Database
description: Adaptador de base de datos MongoDB usando Spring Data MongoDB Reactive
framework: spring
paradigm: reactive
type: driven-adapter
version: 1.0.0
author: Pragma Team
maintainers:
  - pragma@pragma.com.co

# Parámetros del adaptador
parameters:
  required:
    - name: name
      type: string
      description: Nombre del adaptador
      example: UserPersistence
    - name: entityName
      type: string
      description: Nombre de la entidad del dominio
      example: User
  optional:
    - name: collectionName
      type: string
      description: Nombre de la colección en MongoDB
      default: "{entityName?lower_case}s"
      example: users
    - name: databaseName
      type: string
      description: Nombre de la base de datos
      default: "{projectName}"
      example: myapp

# Dependencias de producción
dependencies:
  gradle:
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-data-mongodb-reactive
      version: 3.2.0
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-validation
      version: 3.2.0

# Dependencias de prueba
testDependencies:
  gradle:
    - groupId: de.flapdoodle.embed
      artifactId: de.flapdoodle.embed.mongo
      version: 4.11.0
      scope: test
    - groupId: org.testcontainers
      artifactId: mongodb
      version: 1.19.3
      scope: test

# Plantilla de propiedades de aplicación
applicationPropertiesTemplate: application-properties.yml.ftl

# Clases de configuración adicionales
configurationClasses:
  - name: MongoConfig
    packagePath: config
    templatePath: MongoConfig.java.ftl
  - name: MongoHealthIndicator
    packagePath: health
    templatePath: MongoHealthIndicator.java.ftl

# Archivos de plantilla a procesar
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
    description: Mapper entre entidad de dominio y datos

# Ejemplos de uso
examples:
  - name: Persistencia básica
    description: Adaptador de persistencia MongoDB con configuración por defecto
    command: |
      ./gradlew generateOutputAdapter \
        --type=mongodb \
        --name=UserPersistence \
        --entityName=User
  - name: Persistencia con colección personalizada
    description: Adaptador con nombre de colección específico
    command: |
      ./gradlew generateOutputAdapter \
        --type=mongodb \
        --name=ProductPersistence \
        --entityName=Product \
        --collectionName=products_catalog

# Compatibilidad
compatibility:
  plugin: ">=0.1.0"
  spring: ">=3.0.0"
  java: ">=17"

# Etiquetas para búsqueda
tags:
  - database
  - mongodb
  - reactive
  - nosql
  - persistence
```

---

## Campos del Archivo

### Información Básica

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

Dependencias de producción que se agregan al `build.gradle`.

#### dependencies.gradle

Lista de dependencias Gradle.

**Campos:**
- `groupId`: Group ID de Maven
- `artifactId`: Artifact ID
- `version`: Versión de la dependencia

**Ejemplo:**
```yaml
dependencies:
  gradle:
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-data-mongodb-reactive
      version: 3.2.0
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-validation
      version: 3.2.0
    - groupId: io.projectreactor
      artifactId: reactor-core
      version: 3.6.0
```

---

### testDependencies

Dependencias de prueba que se agregan con scope `test`.

:::info Importante
Las dependencias de prueba se agregan automáticamente con scope `test` y no afectan el classpath de producción.
:::

**Campos:**
- `groupId`: Group ID de Maven
- `artifactId`: Artifact ID
- `version`: Versión de la dependencia
- `scope`: Scope de la dependencia (siempre `test`)

**Ejemplo:**
```yaml
testDependencies:
  gradle:
    - groupId: de.flapdoodle.embed
      artifactId: de.flapdoodle.embed.mongo
      version: 4.11.0
      scope: test
    - groupId: org.testcontainers
      artifactId: mongodb
      version: 1.19.3
      scope: test
    - groupId: io.projectreactor
      artifactId: reactor-test
      version: 3.6.0
      scope: test
```

---

### applicationPropertiesTemplate

Ruta a la plantilla de propiedades de aplicación que se fusionará con `application.yml`.

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
  gradle:
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-data-r2dbc
      version: 3.2.0
    - groupId: org.postgresql
      artifactId: r2dbc-postgresql
      version: 1.0.4.RELEASE

testDependencies:
  gradle:
    - groupId: org.testcontainers
      artifactId: postgresql
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
  gradle:
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-webflux
      version: 3.2.0
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-validation
      version: 3.2.0

testDependencies:
  gradle:
    - groupId: io.projectreactor
      artifactId: reactor-test
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
  gradle:
    - groupId: org.springframework.boot
      artifactId: spring-boot-starter-webflux
      version: 3.2.0

testDependencies:
  gradle:
    - groupId: com.github.tomakehurst
      artifactId: wiremock-jre8
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

1. **Usa nombres descriptivos** - `displayName` debe ser claro y conciso
2. **Documenta parámetros** - Proporciona descripciones y ejemplos claros
3. **Incluye dependencias de prueba** - Facilita testing desde el inicio
4. **Agrega advertencias de seguridad** - En plantillas de propiedades con credenciales
5. **Proporciona ejemplos** - Ayuda a los usuarios a entender cómo usar el adaptador
6. **Usa tags apropiados** - Facilita la búsqueda y categorización
7. **Versiona tus adaptadores** - Mantén control de cambios
8. **Valida antes de publicar** - Usa `./gradlew validateTemplates`

---

## Próximos Pasos

- [Referencia de .cleanarch.yml](cleanarch-yml) - Configuración del proyecto
- [Referencia de structure.yml](structure-yml) - Configuración de arquitecturas
- [Agregar Adaptadores](../contributors/adding-adapter) - Guía para crear nuevos adaptadores
- [Modo Developer](../contributors/developer-mode) - Desarrollo de plantillas
