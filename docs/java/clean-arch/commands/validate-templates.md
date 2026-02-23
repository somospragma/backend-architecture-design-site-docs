# validateTemplates

Valida la estructura y contenido de las plantillas de arquitecturas y adaptadores sin generar código. Útil para contribuidores que desarrollan nuevas plantillas o modifican las existentes.

:::info Para Contribuidores
Este comando es especialmente útil durante el desarrollo de plantillas en modo local. Permite verificar que las plantillas son correctas antes de hacer commit o crear un pull request.
:::

## Sintaxis

```bash
./gradlew validateTemplates \
  [--architecture=<tipo>] \
  [--adapter=<nombre>] \
  [--all]
```

## Parámetros

| Parámetro | Requerido | Descripción | Valor por Defecto |
|-----------|-----------|-------------|-------------------|
| `--architecture` | No | Validar arquitectura específica | - |
| `--adapter` | No | Validar adaptador específico | - |
| `--all` | No | Validar todas las plantillas | `false` |

:::note
Si no se especifica ningún parámetro, el comando valida todas las plantillas disponibles.
:::

## Validaciones Realizadas

### Validación de Arquitecturas

Para cada arquitectura, el comando verifica:

#### 1. Estructura de Archivos
- ✅ Existe `structure.yml` con configuración de la arquitectura
- ✅ Existe `README.md.ftl` con documentación de la arquitectura
- ✅ Existe carpeta `templates/` con plantillas de proyecto

#### 2. Contenido de structure.yml
- ✅ Campo `architecture` está presente y es válido
- ✅ Campo `description` está presente
- ✅ Sección `adapterPaths` define rutas para adaptadores driven y driving
- ✅ Sección `namingConventions` define convenciones de nombres
- ✅ Sección `layerDependencies` define dependencias entre capas
- ✅ Sección `structure` define la estructura de carpetas

#### 3. Placeholders en Rutas
- ✅ Placeholders `{name}`, `{type}`, `{basePackage}`, `{module}` son válidos
- ✅ Rutas de adaptadores no contienen placeholders no soportados

#### 4. Sintaxis de Plantillas
- ✅ Archivos `.ftl` tienen sintaxis FreeMarker válida
- ✅ No hay directivas sin cerrar (`#if`, `#list`, etc.)
- ✅ Variables usadas están definidas en el contexto

### Validación de Adaptadores

Para cada adaptador, el comando verifica:

#### 1. Estructura de Archivos
- ✅ Existe `metadata.yml` con configuración del adaptador
- ✅ Existe carpeta `templates/` con plantillas del adaptador
- ✅ Todos los archivos de plantilla referenciados existen

#### 2. Contenido de metadata.yml
- ✅ Campo `name` está presente
- ✅ Campo `type` es válido (`driven` o `driving`)
- ✅ Campo `description` está presente
- ✅ Sección `dependencies` tiene formato correcto
- ✅ Sección `testDependencies` (si existe) tiene formato correcto
- ✅ Campo `applicationPropertiesTemplate` (si existe) referencia archivo existente
- ✅ Sección `configurationClasses` (si existe) tiene formato correcto
- ✅ Sección `templates` lista plantillas existentes

#### 3. Dependencias
- ✅ Cada dependencia tiene `group`, `artifact`, y `version`
- ✅ Versiones usan placeholders válidos (ej., `${springBootVersion}`)
- ✅ Dependencias de prueba tienen `scope: test`

#### 4. Plantillas de Propiedades
- ✅ Archivo `application-properties.yml.ftl` (si existe) tiene sintaxis YAML válida
- ✅ Propiedades usan placeholders válidos
- ✅ Incluye comentario de advertencia sobre secretos

#### 5. Clases de Configuración
- ✅ Cada clase de configuración tiene `name`, `packagePath`, y `templatePath`
- ✅ Archivos de plantilla de configuración existen
- ✅ Plantillas tienen sintaxis FreeMarker válida

## Ejemplos

### Validar Todas las Plantillas

```bash
./gradlew validateTemplates --all
```

**Salida exitosa:**

```
✓ Validating templates...

Architectures:
  ✓ hexagonal-single
    ✓ structure.yml is valid
    ✓ README.md.ftl is valid
    ✓ All templates are valid
  ✓ hexagonal-multi
    ✓ structure.yml is valid
    ✓ README.md.ftl is valid
    ✓ All templates are valid
  ✓ hexagonal-multi-granular
    ✓ structure.yml is valid
    ✓ README.md.ftl is valid
    ✓ All templates are valid
  ✓ onion-single
    ✓ structure.yml is valid
    ✓ README.md.ftl is valid
    ✓ All templates are valid

Adapters:
  ✓ mongodb
    ✓ metadata.yml is valid
    ✓ All templates are valid
    ✓ application-properties.yml.ftl is valid
  ✓ redis
    ✓ metadata.yml is valid
    ✓ All templates are valid
    ✓ application-properties.yml.ftl is valid
  ✓ postgresql
    ✓ metadata.yml is valid
    ✓ All templates are valid
    ✓ application-properties.yml.ftl is valid
  ✓ rest_client
    ✓ metadata.yml is valid
    ✓ All templates are valid
  ✓ kafka
    ✓ metadata.yml is valid
    ✓ All templates are valid
    ✓ application-properties.yml.ftl is valid

✓ All templates are valid!
```

### Validar Arquitectura Específica

```bash
./gradlew validateTemplates --architecture=onion-single
```

**Salida:**

```
✓ Validating architecture: onion-single

Structure:
  ✓ structure.yml found
  ✓ Required fields present: architecture, description, adapterPaths, structure
  ✓ Adapter paths defined: driven, driving
  ✓ Naming conventions defined: suffixes, prefixes
  ✓ Layer dependencies defined

Templates:
  ✓ README.md.ftl found
  ✓ FreeMarker syntax is valid
  ✓ All variables are defined: projectName, architecture, basePackage

✓ Architecture 'onion-single' is valid!
```

### Validar Adaptador Específico

```bash
./gradlew validateTemplates --adapter=mongodb
```

**Salida:**

```
✓ Validating adapter: mongodb

Metadata:
  ✓ metadata.yml found
  ✓ Required fields present: name, type, description, dependencies, templates
  ✓ Adapter type is valid: driven
  ✓ Dependencies are valid (2 dependencies)
  ✓ Test dependencies are valid (1 test dependency)
  ✓ Application properties template found: application-properties.yml.ftl
  ✓ Configuration classes defined (1 class)

Templates:
  ✓ Adapter.java.ftl found and valid
  ✓ Repository.java.ftl found and valid
  ✓ Mapper.java.ftl found and valid
  ✓ Data.java.ftl found and valid
  ✓ MongoConfig.java.ftl found and valid

Application Properties:
  ✓ application-properties.yml.ftl is valid YAML
  ✓ Contains security warning comment
  ✓ Uses valid placeholders: ${projectName}

✓ Adapter 'mongodb' is valid!
```

### Validación con Errores

```bash
./gradlew validateTemplates --adapter=custom-adapter
```

**Salida con errores:**

```
✗ Validating adapter: custom-adapter

Metadata:
  ✓ metadata.yml found
  ✗ Missing required field: 'type'
  ✗ Invalid dependency format: missing 'version' in dependency 'spring-boot-starter-web'
  ✗ Application properties template not found: application-props.yml.ftl

Templates:
  ✓ Adapter.java.ftl found
  ✗ Template syntax error in Adapter.java.ftl at line 23: Unclosed directive #if
  ✗ Referenced template not found: Config.java.ftl
  ✗ Undefined variable in Adapter.java.ftl: 'repositoryInterface'
    Available variables: name, type, package, entity

✗ Validation failed with 6 errors

Errors:
  1. Missing required field 'type' in metadata.yml
  2. Invalid dependency format in metadata.yml
  3. Application properties template 'application-props.yml.ftl' not found
  4. FreeMarker syntax error in Adapter.java.ftl at line 23
  5. Template file 'Config.java.ftl' referenced but not found
  6. Undefined variable 'repositoryInterface' in Adapter.java.ftl

Fix these errors and run validation again.
```

## Modo de Desarrollo Local

El comando `validateTemplates` es especialmente útil cuando desarrollas plantillas localmente:

### 1. Configurar Modo Local

En `.cleanarch.yml`:

```yaml
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
```

### 2. Modificar Plantillas

Edita las plantillas en el repositorio local.

### 3. Validar Cambios

```bash
./gradlew validateTemplates --adapter=mi-nuevo-adaptador
```

### 4. Iterar

Corrige errores y vuelve a validar hasta que todas las validaciones pasen.

### 5. Probar Generación

```bash
./gradlew generateOutputAdapter \
  --name=TestAdapter \
  --entity=Test \
  --type=mi-nuevo-adaptador \
  --packageName=com.test
```

## Validación de Rama Remota

Puedes validar plantillas de una rama específica antes de fusionarla:

### 1. Configurar Rama

En `.cleanarch.yml`:

```yaml
templates:
  mode: production
  repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-templates
  branch: feature/new-adapter
```

### 2. Validar

```bash
./gradlew validateTemplates --all
```

Esto descarga las plantillas de la rama especificada y las valida.

## Variables de Plantilla

El comando valida que las variables usadas en las plantillas estén definidas en el contexto:

### Variables Disponibles por Tipo de Plantilla

#### Plantillas de Arquitectura
- `projectName`: Nombre del proyecto
- `basePackage`: Paquete base del proyecto
- `architecture`: Tipo de arquitectura
- `paradigm`: Paradigma (reactive/imperative)
- `framework`: Framework (spring/quarkus)

#### Plantillas de Adaptador
- `name`: Nombre del adaptador
- `entity`: Nombre de la entidad
- `package`: Paquete del adaptador
- `type`: Tipo de adaptador (driven/driving)
- `basePackage`: Paquete base del proyecto

#### Plantillas de Propiedades
- `projectName`: Nombre del proyecto
- `adapterName`: Nombre del adaptador

## Errores Comunes

### Error: Plantilla no encontrada

```
✗ Template file 'Config.java.ftl' referenced in metadata.yml but not found
```

**Solución**: Verifica que el archivo existe en la carpeta `templates/` del adaptador.

### Error: Variable no definida

```
✗ Undefined variable 'repositoryInterface' in Adapter.java.ftl
  Available variables: name, type, package, entity
```

**Solución**: Usa solo las variables disponibles o agrega la variable al contexto.

### Error: Sintaxis FreeMarker inválida

```
✗ FreeMarker syntax error in Adapter.java.ftl at line 23: Unclosed directive #if
```

**Solución**: Asegúrate de cerrar todas las directivas FreeMarker (`#if` → `</#if>`, `#list` → `</#list>`).

### Error: YAML inválido

```
✗ Invalid YAML syntax in application-properties.yml.ftl at line 5
```

**Solución**: Verifica la sintaxis YAML (indentación, dos puntos, etc.).

### Error: Dependencia inválida

```
✗ Invalid dependency format: missing 'version' in dependency 'spring-boot-starter-web'
```

**Solución**: Asegúrate de que cada dependencia tiene `group`, `artifact`, y `version`.

## Integración con CI/CD

Puedes integrar la validación en tu pipeline de CI/CD:

### GitHub Actions

```yaml
name: Validate Templates

on:
  pull_request:
    paths:
      - 'templates/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up JDK
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          
      - name: Validate Templates
        run: ./gradlew validateTemplates --all
```

### GitLab CI

```yaml
validate-templates:
  stage: test
  script:
    - ./gradlew validateTemplates --all
  only:
    changes:
      - templates/**
```

## Opciones Avanzadas

### Validación Detallada

Para obtener más detalles sobre la validación:

```bash
./gradlew validateTemplates --all --stacktrace
```

### Validación Silenciosa

Para usar en scripts (solo muestra errores):

```bash
./gradlew validateTemplates --all --quiet
```

### Validación con Caché Deshabilitado

Para forzar descarga de plantillas remotas:

```bash
./gradlew validateTemplates --all --no-cache
```

## Checklist para Nuevas Plantillas

Antes de crear un pull request con nuevas plantillas, verifica:

- [ ] `./gradlew validateTemplates --all` pasa sin errores
- [ ] Todos los archivos `.ftl` tienen sintaxis FreeMarker válida
- [ ] `metadata.yml` o `structure.yml` tienen todos los campos requeridos
- [ ] Dependencias tienen formato correcto con versiones
- [ ] Plantillas de propiedades tienen sintaxis YAML válida
- [ ] Plantillas incluyen comentarios de advertencia sobre secretos
- [ ] Variables usadas están definidas en el contexto
- [ ] Archivos referenciados existen en el repositorio
- [ ] Generación de código funciona correctamente
- [ ] Tests de integración pasan

## Próximos Pasos

Después de validar plantillas:

1. **Probar Generación**: Usa los comandos de generación para probar las plantillas
2. **Escribir Tests**: Crea tests de integración para las nuevas plantillas
3. **Documentar**: Actualiza la documentación con las nuevas plantillas
4. **Crear PR**: Crea un pull request con las plantillas validadas

## Ver También

- [Modo de Desarrollo](../contributors/developer-mode.md)
- [Agregar Adaptadores](../contributors/adding-adapter.md)
- [Agregar Arquitecturas](../contributors/adding-architecture.md)
- [Referencia de metadata.yml](../reference/metadata-yml.md)
- [Referencia de structure.yml](../reference/structure-yml.md)
