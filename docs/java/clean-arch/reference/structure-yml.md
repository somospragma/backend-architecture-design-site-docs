# Referencia de structure.yml

Referencia completa del archivo `structure.yml` que define la estructura, convenciones y reglas de dependencia de cada arquitectura.

---

## Descripción General

El archivo `structure.yml` describe la estructura de una arquitectura y contiene:

- Información básica de la arquitectura
- Rutas de colocación de adaptadores (`adapterPaths`)
- Convenciones de nomenclatura (`namingConventions`)
- Reglas de dependencia entre capas (`layerDependencies`)
- Estructura de directorios y paquetes

Este archivo permite que el plugin genere código consistente independientemente de la arquitectura seleccionada.

---

## Ubicación

```
templates/
└── architectures/
    ├── hexagonal-single/
    │   └── structure.yml          ← Aquí
    ├── hexagonal-multi/
    │   └── structure.yml
    ├── hexagonal-multi-granular/
    │   └── structure.yml
    ├── onion-single/
    │   └── structure.yml
    └── onion-multi/
        └── structure.yml
```

---

## Ejemplo Completo - Onion Single

```yaml
# Información básica
architecture: "onion-single"
description: "Onion Architecture with single module - Domain at the center, surrounded by application and infrastructure layers"

# Resolución de rutas de adaptadores
# Placeholders disponibles: {name}, {type}, {basePackage}
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"

# Convenciones de nomenclatura para componentes generados
namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
    entity: ""
    valueObject: ""
    service: "Service"
    controller: "Controller"
    repository: "Repository"
  prefixes:
    interface: "I"
    abstract: "Abstract"

# Dependencias entre capas
# Define qué capas pueden depender de qué otras capas
layerDependencies:
  domain:
    - []  # Domain no tiene dependencias (capa más interna)
  application:
    - "domain"  # Application solo puede depender de domain
  infrastructure:
    - "domain"
    - "application"  # Infrastructure puede depender de ambas

# Estructura de directorios
directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/test/java"
  - "src/test/resources"

# Estructura de paquetes
packages:
  - "core/domain"
  - "core/application/service"
  - "core/application/port"
  - "infrastructure/adapter/in"
  - "infrastructure/adapter/out"
  - "infrastructure/config"
```

---

## Ejemplo Completo - Hexagonal Single

```yaml
# Información básica
name: "Hexagonal Single Module"
description: "Single module hexagonal architecture (ports & adapters)"
type: "hexagonal-single"
multiModule: false

# Resolución de rutas de adaptadores
adapterPaths:
  driven: "infrastructure/driven-adapters/{name}"
  driving: "infrastructure/entry-points/{name}"

# Convenciones de nomenclatura
namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
    entity: ""
    service: "Service"
    controller: "Controller"
  prefixes:
    interface: ""

# Dependencias entre capas
layerDependencies:
  domain:
    - []
  application:
    - "domain"
  infrastructure:
    - "domain"
    - "application"

# Estructura de directorios
directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/test/java"
  - "src/test/resources"

# Estructura de paquetes
packages:
  - "domain/model"
  - "domain/port/in"
  - "domain/port/out"
  - "application/usecase"
  - "infrastructure/entry-points/rest"
  - "infrastructure/driven-adapters"
  - "infrastructure/config"
```

---

## Campos del Archivo

### Información Básica

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `architecture` o `type` | String | Sí | Identificador único de la arquitectura |
| `name` | String | No | Nombre descriptivo de la arquitectura |
| `description` | String | Sí | Descripción de la arquitectura |
| `multiModule` | Boolean | No | Si la arquitectura usa múltiples módulos Gradle |

**Ejemplo:**
```yaml
architecture: "onion-single"
name: "Onion Architecture Single Module"
description: "Onion Architecture with single module - Domain at the center"
multiModule: false
```

---

### adapterPaths

Define dónde se colocan los adaptadores según su tipo. Esta es la sección más importante para la resolución de rutas.

**Tipos de adaptadores:**
- `driven`: Adaptadores de salida (driven adapters) - repositorios, clientes, caches
- `driving`: Adaptadores de entrada (entry points) - controladores, consumers, handlers

**Placeholders disponibles:**
- `{name}`: Nombre del adaptador
- `{type}`: Tipo del adaptador
- `{basePackage}`: Paquete base del proyecto
- `{module}`: Nombre del módulo (para arquitecturas multi-módulo)

**Ejemplo:**
```yaml
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"
```

**Resultado:** Si generas un adaptador MongoDB llamado "user-persistence":
```
src/main/java/com/pragma/user/infrastructure/adapter/out/user-persistence/
```

#### Ejemplos por Arquitectura

**Hexagonal Single:**
```yaml
adapterPaths:
  driven: "infrastructure/driven-adapters/{name}"
  driving: "infrastructure/entry-points/{name}"
```

**Hexagonal Multi-Granular:**
```yaml
adapterPaths:
  driven: "infrastructure/adapters/{name}"
  driving: "infrastructure/entry-points/{name}"
```

**Onion Single:**
```yaml
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
  driving: "infrastructure/adapter/in/{name}"
```

---

### namingConventions

Define sufijos y prefijos para componentes generados. Asegura nomenclatura consistente.

#### namingConventions.suffixes

Sufijos agregados a nombres de componentes.

**Componentes comunes:**
- `useCase`: Casos de uso
- `port`: Interfaces de puerto
- `adapter`: Implementaciones de adaptador
- `entity`: Entidades de dominio
- `valueObject`: Objetos de valor
- `service`: Servicios
- `controller`: Controladores
- `repository`: Repositorios
- `mapper`: Mappers

**Ejemplo:**
```yaml
namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
    entity: ""
    valueObject: ""
    service: "Service"
    controller: "Controller"
    repository: "Repository"
    mapper: "Mapper"
```

**Resultado:** Si generas un caso de uso "CreateUser":
```java
public interface CreateUserUseCase { ... }
public class CreateUserUseCaseImpl implements CreateUserUseCase { ... }
```

#### namingConventions.prefixes

Prefijos agregados a nombres de componentes.

**Prefijos comunes:**
- `interface`: Interfaces
- `abstract`: Clases abstractas
- `base`: Clases base

**Ejemplo:**
```yaml
namingConventions:
  prefixes:
    interface: "I"
    abstract: "Abstract"
    base: "Base"
```

**Resultado:** Con prefijo "I" para interfaces:
```java
public interface IUserRepository { ... }
```

:::tip Recomendación
En Java moderno, no se recomienda usar prefijos como "I" para interfaces. Deja el campo vacío:
```yaml
prefixes:
  interface: ""
```
:::

---

### layerDependencies

Define las reglas de dependencia entre capas. Asegura que la arquitectura limpia se respete.

**Formato:**
```yaml
layerDependencies:
  <capa>:
    - <capa-permitida-1>
    - <capa-permitida-2>
```

**Capas comunes:**
- `domain`: Capa de dominio (entidades, value objects)
- `application`: Capa de aplicación (casos de uso, servicios)
- `infrastructure`: Capa de infraestructura (adaptadores, configuración)

#### Reglas de Arquitectura Limpia

**Onion Architecture:**
```yaml
layerDependencies:
  domain:
    - []  # Domain no depende de nada
  application:
    - "domain"  # Application solo depende de domain
  infrastructure:
    - "domain"
    - "application"  # Infrastructure depende de ambas
```

**Hexagonal Architecture:**
```yaml
layerDependencies:
  domain:
    - []  # Domain no depende de nada
  application:
    - "domain"  # Application solo depende de domain
  infrastructure:
    - "domain"
    - "application"  # Infrastructure depende de ambas
```

:::info Principio de Dependencia
Las dependencias siempre apuntan hacia adentro:
- Infrastructure → Application → Domain
- Nunca: Domain → Application o Domain → Infrastructure
:::

#### Validación de Dependencias

El plugin valida que el código generado respete estas reglas:

**Válido:**
```java
// Infrastructure puede depender de Application
package com.pragma.user.infrastructure.adapter.out.mongodb;

import com.pragma.user.application.port.out.UserRepository; // ✓ OK
```

**Inválido:**
```java
// Domain NO puede depender de Infrastructure
package com.pragma.user.domain.model;

import com.pragma.user.infrastructure.adapter.out.mongodb.UserData; // ✗ ERROR
```

---

### directories

Lista de directorios base a crear en el proyecto.

**Directorios estándar:**
```yaml
directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/test/java"
  - "src/test/resources"
```

**Con recursos adicionales:**
```yaml
directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/main/resources/db/migration"  # Flyway migrations
  - "src/main/resources/graphql"       # GraphQL schemas
  - "src/test/java"
  - "src/test/resources"
  - "docs"                             # Documentation
```

---

### packages

Lista de paquetes a crear dentro de `src/main/java/{basePackage}/`.

#### Onion Architecture

```yaml
packages:
  - "core/domain"
  - "core/application/service"
  - "core/application/port"
  - "infrastructure/adapter/in"
  - "infrastructure/adapter/out"
  - "infrastructure/config"
```

**Resultado:** Con `basePackage: com.pragma.user`:
```
src/main/java/com/pragma/user/
├── core/
│   ├── domain/
│   └── application/
│       ├── service/
│       └── port/
└── infrastructure/
    ├── adapter/
    │   ├── in/
    │   └── out/
    └── config/
```

#### Hexagonal Architecture

```yaml
packages:
  - "domain/model"
  - "domain/port/in"
  - "domain/port/out"
  - "application/usecase"
  - "infrastructure/entry-points/rest"
  - "infrastructure/driven-adapters"
  - "infrastructure/config"
```

**Resultado:**
```
src/main/java/com/pragma/user/
├── domain/
│   ├── model/
│   └── port/
│       ├── in/
│       └── out/
├── application/
│   └── usecase/
└── infrastructure/
    ├── entry-points/
    │   └── rest/
    ├── driven-adapters/
    └── config/
```

---

## Ejemplos Completos por Arquitectura

### Hexagonal Multi-Module

```yaml
architecture: "hexagonal-multi"
description: "Hexagonal architecture with three modules: domain, application, infrastructure"
multiModule: true

adapterPaths:
  driven: "infrastructure/driven-adapters/{name}"
  driving: "infrastructure/entry-points/{name}"

namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
    entity: ""
  prefixes:
    interface: ""

layerDependencies:
  domain:
    - []
  application:
    - "domain"
  infrastructure:
    - "domain"
    - "application"

modules:
  - name: "domain"
    description: "Domain layer with entities and ports"
    packages:
      - "model"
      - "port/in"
      - "port/out"
  
  - name: "application"
    description: "Application layer with use cases"
    packages:
      - "usecase"
    dependencies:
      - "domain"
  
  - name: "infrastructure"
    description: "Infrastructure layer with adapters"
    packages:
      - "entry-points/rest"
      - "driven-adapters"
      - "config"
    dependencies:
      - "domain"
      - "application"
```

### Hexagonal Multi-Granular

```yaml
architecture: "hexagonal-multi-granular"
description: "Hexagonal architecture with granular modules"
multiModule: true

adapterPaths:
  driven: "adapters/{name}"
  driving: "entry-points/{name}"

namingConventions:
  suffixes:
    useCase: "UseCase"
    port: "Port"
    adapter: "Adapter"
  prefixes:
    interface: ""

layerDependencies:
  model:
    - []
  ports:
    - "model"
  usecase:
    - "model"
    - "ports"
  adapters:
    - "model"
    - "ports"
    - "usecase"

modules:
  - name: "model"
    description: "Domain entities and value objects"
    packages:
      - "entity"
      - "valueobject"
  
  - name: "ports"
    description: "Port interfaces"
    packages:
      - "in"
      - "out"
    dependencies:
      - "model"
  
  - name: "usecase"
    description: "Use case implementations"
    packages:
      - "."
    dependencies:
      - "model"
      - "ports"
  
  - name: "adapters"
    description: "Adapter implementations"
    packages:
      - "."
    dependencies:
      - "model"
      - "ports"
      - "usecase"
  
  - name: "entry-points"
    description: "Entry point adapters"
    packages:
      - "rest"
      - "graphql"
    dependencies:
      - "model"
      - "ports"
      - "usecase"
```

---

## Resolución de Rutas

### Proceso de Resolución

1. **Obtener plantilla de ruta** del `adapterPaths` según tipo de adaptador
2. **Sustituir placeholders** con valores concretos
3. **Validar ruta** contra `layerDependencies`
4. **Crear estructura** de directorios si no existe

### Ejemplos de Resolución

**Configuración:**
```yaml
adapterPaths:
  driven: "infrastructure/adapter/out/{name}"
```

**Comando:**
```bash
./gradlew generateOutputAdapter \
  --type=mongodb \
  --name=user-persistence \
  --entityName=User
```

**Resolución:**
1. Tipo: `driven` → Plantilla: `"infrastructure/adapter/out/{name}"`
2. Sustituir `{name}` → `"infrastructure/adapter/out/user-persistence"`
3. Ruta completa: `src/main/java/com/pragma/user/infrastructure/adapter/out/user-persistence/`

---

## Validación

El plugin valida `structure.yml` al cargar arquitecturas:

### Validaciones Realizadas

1. **Campo `architecture` o `type` presente**
2. **Campo `description` presente**
3. **Sección `adapterPaths` presente y no vacía**
4. **`adapterPaths` contiene `driven` y `driving`**
5. **Sección `layerDependencies` válida** (si está presente)
6. **Sección `namingConventions` válida** (si está presente)

### Errores Comunes

**adapterPaths faltante:**
```
Adapter paths are required in structure.yml
Example:
adapterPaths:
  driven: infrastructure/adapter/out/{name}
  driving: infrastructure/adapter/in/{name}
```

**Tipo de adaptador faltante:**
```
adapterPaths must contain 'driven' and 'driving' entries
```

**layerDependencies inválido:**
```
layerDependencies must be a map of layer names to dependency lists
```

---

## Mejores Prácticas

1. **Usa placeholders consistentes** - Siempre usa `{name}` para nombres de adaptadores
2. **Define dependencias claras** - Especifica `layerDependencies` para validación
3. **Documenta la arquitectura** - Proporciona `description` detallada
4. **Sigue convenciones Java** - Usa sufijos estándar (`UseCase`, `Port`, `Adapter`)
5. **Evita prefijos en interfaces** - No uses "I" para interfaces en Java moderno
6. **Organiza paquetes lógicamente** - Agrupa por capa, no por tipo técnico
7. **Valida antes de publicar** - Usa `./gradlew validateTemplates`

---

## Comparación de Arquitecturas

| Característica | Hexagonal Single | Hexagonal Multi | Onion Single |
|----------------|------------------|-----------------|--------------|
| **Módulos** | 1 | 3 | 1 |
| **Complejidad** | Baja | Media | Baja |
| **Driven Adapters** | `infrastructure/driven-adapters/` | `infrastructure/driven-adapters/` | `infrastructure/adapter/out/` |
| **Entry Points** | `infrastructure/entry-points/` | `infrastructure/entry-points/` | `infrastructure/adapter/in/` |
| **Domain** | `domain/model/` | `domain/model/` | `core/domain/` |
| **Use Cases** | `application/usecase/` | `application/usecase/` | `core/application/service/` |
| **Ports** | `domain/port/in/`, `domain/port/out/` | `domain/port/in/`, `domain/port/out/` | `core/application/port/` |

---

## Creando una Nueva Arquitectura

Para crear una nueva arquitectura:

1. **Crea directorio** en `templates/architectures/{nombre}/`
2. **Crea `structure.yml`** con la configuración
3. **Define `adapterPaths`** para driven y driving
4. **Define `layerDependencies`** para validación
5. **Define `packages`** para estructura de paquetes
6. **Crea `README.md.ftl`** con documentación
7. **Valida** con `./gradlew validateTemplates --architecture={nombre}`

**Ejemplo mínimo:**
```yaml
architecture: "mi-arquitectura"
description: "Mi arquitectura personalizada"

adapterPaths:
  driven: "adapters/out/{name}"
  driving: "adapters/in/{name}"

layerDependencies:
  domain:
    - []
  application:
    - "domain"
  infrastructure:
    - "domain"
    - "application"

directories:
  - "src/main/java"
  - "src/main/resources"
  - "src/test/java"
  - "src/test/resources"

packages:
  - "domain"
  - "application"
  - "infrastructure"
```

---

## Próximos Pasos

- [Referencia de .cleanarch.yml](cleanarch-yml) - Configuración del proyecto
- [Referencia de metadata.yml](metadata-yml) - Configuración de adaptadores
- [Agregar Arquitecturas](../contributors/adding-architecture) - Guía para crear nuevas arquitecturas
- [Arquitecturas Disponibles](../architectures/overview) - Comparación de arquitecturas
