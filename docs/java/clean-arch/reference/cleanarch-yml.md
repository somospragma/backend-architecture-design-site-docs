# Referencia de .cleanarch.yml

Referencia completa del archivo de configuración `.cleanarch.yml` que controla el comportamiento del plugin de Clean Architecture.

---

## Descripción General

El archivo `.cleanarch.yml` es el archivo de configuración principal del proyecto. Se genera automáticamente al ejecutar `initCleanArch` y contiene:

- Configuración del proyecto (nombre, paquete base, versión)
- Tipo de arquitectura y paradigma
- Configuración de plantillas (modo local/remoto, branch, caché)
- Registro de componentes generados
- Dependencias del proyecto

:::warning Advertencia
No edites manualmente `.cleanarch.yml` a menos que sepas lo que estás haciendo. El plugin usa este archivo para rastrear componentes y evitar duplicados.
:::

---

## Ejemplo Completo

```yaml
# Información del proyecto
project:
  name: payment-service
  basePackage: com.pragma.payment
  createdAt: 2026-01-31T10:30:00Z
  pluginVersion: 1.0.0

# Configuración de arquitectura
architecture:
  type: hexagonal-single
  paradigm: reactive
  framework: spring
  adaptersAsModules: false

# Configuración de plantillas (modo desarrollador)
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: feature/init-templates
  cache: false

# Versiones de dependencias
dependencies:
  springBoot: 3.2.0
  java: 21
  mapstruct: 1.5.5.Final
  lombok: 1.18.30

# Componentes generados (rastreados automáticamente)
components:
  adapters:
    input:
      - name: PaymentController
        type: rest
        packageName: com.pragma.payment.infrastructure.entry-points.rest
        createdAt: 2026-01-31T10:35:00Z
    output:
      - name: PaymentCacheRedisAdapter
        type: redis
        packageName: com.pragma.payment.infrastructure.driven-adapters.redis
        createdAt: 2026-01-31T10:36:00Z
      - name: PaymentPersistenceMongoAdapter
        type: mongodb
        packageName: com.pragma.payment.infrastructure.driven-adapters.mongodb
        createdAt: 2026-01-31T10:37:00Z
  usecases:
    - name: ProcessPaymentUseCase
      packageName: com.pragma.payment.application.usecase
      createdAt: 2026-01-31T10:34:00Z
    - name: ValidatePaymentUseCase
      packageName: com.pragma.payment.application.usecase
      createdAt: 2026-01-31T10:35:00Z
  entities:
    - name: Payment
      packageName: com.pragma.payment.domain.model
      createdAt: 2026-01-31T10:33:00Z
  mappers:
    - name: PaymentMapper
      packageName: com.pragma.payment.infrastructure.driven-adapters.mongodb
      createdAt: 2026-01-31T10:37:00Z
```

---

## Secciones del Archivo

### project

Información básica del proyecto.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | String | Sí | Nombre del proyecto (usado en configuraciones y documentación) |
| `basePackage` | String | Sí | Paquete base de Java (ej: `com.pragma.payment`) |
| `createdAt` | DateTime | Sí | Fecha y hora de creación del proyecto (ISO 8601) |
| `pluginVersion` | String | Sí | Versión del plugin usada para crear el proyecto |

**Ejemplo:**
```yaml
project:
  name: user-service
  basePackage: com.company.user
  createdAt: 2026-01-31T10:30:00Z
  pluginVersion: 1.0.0
```

---

### architecture

Configuración de la arquitectura del proyecto.

| Campo | Tipo | Requerido | Descripción | Valores |
|-------|------|-----------|-------------|---------|
| `type` | String | Sí | Tipo de arquitectura | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single`, `onion-multi` |
| `paradigm` | String | Sí | Paradigma de programación | `reactive`, `imperative` |
| `framework` | String | Sí | Framework a usar | `spring`, `quarkus` |
| `adaptersAsModules` | Boolean | No | Si los adaptadores son módulos separados | `true`, `false` (default: `false`) |

**Tipos de Arquitectura:**

- **hexagonal-single**: Módulo único con todas las capas
- **hexagonal-multi**: Tres módulos (domain, application, infrastructure)
- **hexagonal-multi-granular**: Módulos granulares (model, ports, usecase, adapters)
- **onion-single**: Arquitectura Onion de módulo único
- **onion-multi**: Arquitectura Onion multi-módulo

**Ejemplo:**
```yaml
architecture:
  type: onion-single
  paradigm: reactive
  framework: spring
  adaptersAsModules: false
```

---

### templates

Configuración del sistema de plantillas. Esta sección controla cómo el plugin carga las plantillas.

| Campo | Tipo | Requerido | Descripción | Default |
|-------|------|-----------|-------------|---------|
| `mode` | String | No | Modo de plantillas | `production` (default), `developer` |
| `localPath` | String | No | Ruta local a las plantillas | `null` |
| `repository` | String | No | URL del repositorio Git de plantillas | URL oficial |
| `branch` | String | No | Branch del repositorio a usar | `main` |
| `cache` | Boolean | No | Si se debe cachear las plantillas remotas | `true` |

#### Modos de Plantillas

**Modo Production (por defecto):**
```yaml
templates:
  mode: production
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: main
  cache: true
```

Las plantillas se descargan del repositorio remoto y se cachean localmente.

**Modo Developer (desarrollo local):**
```yaml
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
  cache: false
```

Las plantillas se cargan desde el sistema de archivos local. Útil para:
- Desarrollar nuevas plantillas
- Probar cambios en plantillas existentes
- Contribuir al proyecto

**Modo Developer con Branch Remoto:**
```yaml
templates:
  mode: developer
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: feature/new-adapter
  cache: false
```

Prueba plantillas desde un branch específico antes de fusionar a main.

#### Auto-detección de Plantillas Locales

Si no se especifica `localPath`, el plugin intenta auto-detectar plantillas en:
```
../backend-architecture-design-archetype-generator-templates
```

Si existe, se usa automáticamente en modo developer.

**Ejemplo completo:**
```yaml
templates:
  mode: developer
  localPath: /home/user/projects/templates
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: feature/init-templates
  cache: false
```

---

### dependencies

Versiones de las dependencias principales del proyecto.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `springBoot` | String | Sí (Spring) | Versión de Spring Boot |
| `java` | String | Sí | Versión de Java |
| `mapstruct` | String | Sí | Versión de MapStruct |
| `lombok` | String | No | Versión de Lombok |
| `quarkus` | String | Sí (Quarkus) | Versión de Quarkus |

**Ejemplo:**
```yaml
dependencies:
  springBoot: 3.2.0
  java: 21
  mapstruct: 1.5.5.Final
  lombok: 1.18.30
```

---

### components

Registro de todos los componentes generados. Esta sección es administrada automáticamente por el plugin.

:::info Información
El plugin actualiza esta sección automáticamente cada vez que generas un componente. No la edites manualmente.
:::

#### components.adapters.input

Adaptadores de entrada (entry points) generados.

**Campos:**
- `name`: Nombre del adaptador
- `type`: Tipo de adaptador (`rest`, `graphql`, `grpc`, `websocket`)
- `packageName`: Paquete completo del adaptador
- `createdAt`: Fecha de creación

**Ejemplo:**
```yaml
components:
  adapters:
    input:
      - name: UserController
        type: rest
        packageName: com.pragma.user.infrastructure.entry-points.rest
        createdAt: 2026-01-31T10:35:00Z
      - name: PaymentWebSocketHandler
        type: websocket
        packageName: com.pragma.payment.infrastructure.entry-points.websocket
        createdAt: 2026-01-31T11:20:00Z
```

#### components.adapters.output

Adaptadores de salida (driven adapters) generados.

**Campos:**
- `name`: Nombre del adaptador
- `type`: Tipo de adaptador (`redis`, `mongodb`, `postgresql`, `rest_client`, `kafka`)
- `packageName`: Paquete completo del adaptador
- `createdAt`: Fecha de creación

**Ejemplo:**
```yaml
components:
  adapters:
    output:
      - name: UserCacheRedisAdapter
        type: redis
        packageName: com.pragma.user.infrastructure.driven-adapters.redis
        createdAt: 2026-01-31T10:36:00Z
      - name: UserPersistenceMongoAdapter
        type: mongodb
        packageName: com.pragma.user.infrastructure.driven-adapters.mongodb
        createdAt: 2026-01-31T10:37:00Z
```

#### components.usecases

Casos de uso generados.

**Campos:**
- `name`: Nombre del caso de uso
- `packageName`: Paquete completo
- `createdAt`: Fecha de creación

**Ejemplo:**
```yaml
components:
  usecases:
    - name: CreateUserUseCase
      packageName: com.pragma.user.application.usecase
      createdAt: 2026-01-31T10:34:00Z
    - name: UpdateUserUseCase
      packageName: com.pragma.user.application.usecase
      createdAt: 2026-01-31T10:35:00Z
```

#### components.entities

Entidades de dominio generadas.

**Campos:**
- `name`: Nombre de la entidad
- `packageName`: Paquete completo
- `createdAt`: Fecha de creación

**Ejemplo:**
```yaml
components:
  entities:
    - name: User
      packageName: com.pragma.user.domain.model
      createdAt: 2026-01-31T10:33:00Z
    - name: Payment
      packageName: com.pragma.payment.domain.model
      createdAt: 2026-01-31T10:40:00Z
```

#### components.mappers

Mappers de MapStruct generados.

**Campos:**
- `name`: Nombre del mapper
- `packageName`: Paquete completo
- `createdAt`: Fecha de creación

**Ejemplo:**
```yaml
components:
  mappers:
    - name: UserMapper
      packageName: com.pragma.user.infrastructure.driven-adapters.mongodb
      createdAt: 2026-01-31T10:37:00Z
```

---

## Casos de Uso Comunes

### Cambiar a Modo Developer Local

Para desarrollar plantillas localmente:

```yaml
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
  cache: false
```

### Probar Branch de Plantillas

Para probar un branch específico:

```yaml
templates:
  mode: developer
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: feature/new-adapter
  cache: false
```

### Regenerar un Componente

Para regenerar un componente existente:

1. Elimina la entrada del componente de la sección `components`
2. Ejecuta el comando de generación nuevamente

**Ejemplo:** Para regenerar `UserController`:

```yaml
# Antes
components:
  adapters:
    input:
      - name: UserController
        type: rest
        packageName: com.pragma.user.infrastructure.entry-points.rest
        createdAt: 2026-01-31T10:35:00Z

# Después (elimina la entrada)
components:
  adapters:
    input: []
```

Luego ejecuta:
```bash
./gradlew generateInputAdapter --name=User --useCase=CreateUserUseCase ...
```

---

## Validación

El plugin valida `.cleanarch.yml` antes de ejecutar cualquier comando (excepto `initCleanArch`).

### Errores Comunes

**Archivo no encontrado:**
```
Configuration file .cleanarch.yml not found.
Run 'gradle initCleanArch' to create initial project structure.
```

**Campo requerido faltante:**
```
Missing required field 'architecture.type' in .cleanarch.yml.
Example:
architecture:
  type: hexagonal-single
```

**Ruta local no existe:**
```
Configured local path does not exist: /path/to/templates
Please check the 'templates.localPath' configuration in .cleanarch.yml
```

**Sintaxis YAML inválida:**
```
Failed to parse .cleanarch.yml at line 15: Expected ':' after key.
Check YAML syntax.
```

---

## Mejores Prácticas

1. **No edites manualmente la sección `components`** - Deja que el plugin la administre
2. **Usa control de versiones** - Incluye `.cleanarch.yml` en Git
3. **Documenta cambios** - Si modificas configuraciones, documenta por qué
4. **Modo developer solo para desarrollo** - Usa modo production en CI/CD
5. **Valida después de editar** - Ejecuta `./gradlew validateTemplates` después de cambios manuales

---

## Próximos Pasos

- [Referencia de metadata.yml](metadata-yml) - Configuración de adaptadores
- [Referencia de structure.yml](structure-yml) - Configuración de arquitecturas
- [Modo Developer](../contributors/developer-mode) - Desarrollo de plantillas
- [Comandos](commands) - Referencia de comandos del plugin
