# initCleanArch

Inicializa un nuevo proyecto de arquitectura limpia con la arquitectura, paradigma y framework especificados.

## Sintaxis

```bash
./gradlew initCleanArch \
  --architecture=<tipo> \
  --paradigm=<paradigma> \
  --framework=<framework> \
  --package=<paquete>
```

## Parámetros

| Parámetro | Requerido | Descripción | Valores |
|-----------|-----------|-------------|---------|
| `--architecture` | Sí | Tipo de arquitectura | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single` |
| `--paradigm` | Sí | Paradigma de programación | `reactive`, `imperative` |
| `--framework` | Sí | Framework a utilizar | `spring`, `quarkus` |
| `--package` | Sí | Nombre del paquete base | ej., `com.empresa.servicio` |

## Tipos de Arquitectura

### hexagonal-single
Módulo único con todas las capas en un solo módulo. Ideal para proyectos pequeños y medianos.

**Estructura:**
```
src/main/java/{package}/
├── domain/
│   ├── model/
│   └── port/
├── application/
│   └── usecase/
└── infrastructure/
    ├── driven-adapters/
    └── entry-points/
```

### hexagonal-multi
Tres módulos separados (domain, application, infrastructure). Ideal para proyectos grandes con equipos distribuidos.

**Estructura:**
```
domain/
application/
infrastructure/
```

### hexagonal-multi-granular
Módulos granulares (model, ports, usecase, adapters). Máxima separación de responsabilidades.

**Estructura:**
```
model/
ports/
usecase/
adapters/
```

### onion-single
Arquitectura Onion en módulo único. Enfoque en dependencias hacia el núcleo del dominio.

**Estructura:**
```
src/main/java/{package}/
├── core/
│   ├── domain/
│   └── application/
│       ├── service/
│       └── port/
└── infrastructure/
    └── adapter/
        ├── in/
        └── out/
```

## Ejemplos

### Hexagonal Single Module con Spring Reactive

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.payment
```

Este comando genera:
- Estructura de proyecto con arquitectura hexagonal
- Configuración de Spring Boot Reactive
- Dependencias para WebFlux y R2DBC
- README.md con documentación del proyecto

### Hexagonal Multi Module con Spring Imperative

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-multi \
  --paradigm=imperative \
  --framework=spring \
  --package=com.empresa.usuario
```

Este comando genera:
- Tres módulos Gradle separados
- Configuración de Spring Boot tradicional
- Dependencias para Spring MVC y JPA
- Estructura multi-módulo en `settings.gradle.kts`

### Onion Single Module con Quarkus Reactive

```bash
./gradlew initCleanArch \
  --architecture=onion-single \
  --paradigm=reactive \
  --framework=quarkus \
  --package=com.pragma.order
```

Este comando genera:
- Estructura de arquitectura Onion
- Configuración de Quarkus Reactive
- Dependencias para Mutiny y Panache
- README.md explicando principios de Onion

## Estructura Generada

Después de ejecutar `initCleanArch`, obtendrás:

### Archivos de Configuración

- **build.gradle.kts**: Configuración de Gradle con dependencias del framework
- **settings.gradle.kts**: Configuración del proyecto (multi-módulo si aplica)
- **.cleanarch.yml**: Archivo de configuración del plugin con metadatos del proyecto
- **gradle.properties**: Propiedades del proyecto y versiones

### Estructura de Paquetes

- Estructura de carpetas según la arquitectura seleccionada
- Paquetes base creados con la convención de nombres especificada
- Archivos `.gitkeep` en carpetas vacías para mantener la estructura

### Documentación

- **README.md**: Documentación del proyecto con:
  - Descripción de la arquitectura seleccionada
  - Diagramas ASCII de la estructura
  - Guía de dónde colocar cada tipo de componente
  - Ejemplos de flujo de datos
  - Enlaces a documentación adicional

### Archivos de Aplicación

- **Application.java**: Clase principal de Spring Boot o Quarkus
- **application.yml**: Configuración de la aplicación
- Configuraciones específicas del framework seleccionado

## Configuración del Proyecto

El archivo `.cleanarch.yml` generado contiene:

```yaml
project:
  name: nombre-proyecto
  basePackage: com.empresa.servicio
  pluginVersion: 1.0.0
  createdAt: 2024-01-15T10:30:00

architecture:
  type: hexagonal-single
  paradigm: reactive
  framework: spring
  adaptersAsModules: false

templates:
  mode: production
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: main
  cache: true
```

## Modo de Desarrollo Local

Para contribuidores que desean desarrollar plantillas localmente:

```yaml
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
```

El plugin detectará automáticamente la ruta `../backend-architecture-design-archetype-generator-templates` si existe.

## Validación

El comando valida:
- ✅ Nombre de paquete sigue convenciones Java (minúsculas, sin caracteres especiales)
- ✅ Arquitectura es un tipo soportado
- ✅ Paradigma es válido para el framework seleccionado
- ✅ Framework está disponible en las plantillas
- ✅ Directorio actual no contiene un proyecto existente

## Errores Comunes

### Error: Nombre de paquete inválido

```
Package name 'Com.Example' is invalid. Package names must be lowercase.
Suggestion: 'com.example'
```

**Solución**: Usa solo minúsculas en el nombre del paquete.

### Error: Arquitectura no soportada

```
Architecture type 'hexagonal' is not supported.
Valid types: [hexagonal-single, hexagonal-multi, hexagonal-multi-granular, onion-single]
```

**Solución**: Usa uno de los tipos de arquitectura listados.

### Error: Directorio no vacío

```
Current directory is not empty. Initialize in an empty directory or use --force to overwrite.
```

**Solución**: Ejecuta el comando en un directorio vacío o usa `--force` para sobrescribir.

## Próximos Pasos

Después de inicializar el proyecto:

1. **Generar Entidades**: Usa `generateEntity` para crear entidades de dominio
2. **Generar Casos de Uso**: Usa `generateUseCase` para crear lógica de aplicación
3. **Generar Adaptadores**: Usa `generateOutputAdapter` y `generateInputAdapter` para conectar con tecnologías externas

## Ver También

- [Guía de Arquitectura Hexagonal](../architectures/hexagonal-single.md)
- [Guía de Arquitectura Onion](../architectures/onion-single.md)
- [Referencia de Configuración](../reference/configuration.md)
- [Primeros Pasos](../getting-started/first-project.md)
