# Troubleshooting

Esta guía te ayuda a resolver problemas comunes al usar el Generador de Arquitectura Limpia.

## Problemas Comunes

### Problemas de Configuración

#### Error: "Configuration file .cleanarch.yml not found"

**Causa**: El archivo `.cleanarch.yml` no existe en la raíz de tu proyecto.

**Solución**:
```bash
# Inicializa un nuevo proyecto primero
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.ejemplo.servicio
```

#### Error: "Failed to parse .cleanarch.yml"

**Causa**: Error de sintaxis YAML en tu archivo de configuración.

**Solución**:
1. Verifica la indentación YAML (usa 2 espacios, no tabs)
2. Asegúrate de que los dos puntos tengan espacios después: `key: value`
3. Usa comillas para caracteres especiales
4. Valida la sintaxis YAML en línea: https://www.yamllint.com/

**Ejemplo de YAML válido**:
```yaml
project:
  name: mi-servicio
  basePackage: com.ejemplo.servicio

architecture:
  type: hexagonal-single
  paradigm: reactive
  framework: spring
```

#### Error: "Invalid package name"

**Causa**: El nombre del paquete no sigue las convenciones de Java.

**Solución**:
- Usa solo letras minúsculas, números y guiones bajos
- Comienza cada segmento con una letra
- Usa al menos 2 segmentos: `com.ejemplo`
- ❌ Incorrecto: `Com.Ejemplo`, `com..ejemplo`, `ejemplo`
- ✅ Correcto: `com.ejemplo.servicio`, `com.miempresa.app`

### Problemas de Templates

#### Error: "Template not found"

**Causa**: El template no existe para la combinación framework/paradigma seleccionada.

**Solución**:
1. Verifica que el tipo de adaptador esté soportado para tu framework
2. Verifica que el repositorio de templates sea accesible
3. Intenta limpiar el caché:
```bash
rm -rf .cleanarch/cache
./gradlew generateOutputAdapter \
  --name=MiRepositorio \
  --entity=MiEntidad \
  --type=redis
```

#### Error: "Failed to download templates"

**Causa**: Problema de red o URL de repositorio inválida.

**Solución**:
1. Verifica tu conexión a internet
2. Verifica la URL del repositorio en `.cleanarch.yml`
3. Intenta usar modo desarrollador con templates locales:
```yaml
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
```

### Problemas de Generación

#### Error: "File already exists"

**Causa**: Intentando generar un archivo que ya existe.

**Solución**:
1. Renombra o elimina el archivo existente
2. Usa un nombre diferente para el nuevo adaptador
3. Verifica si el adaptador ya fue generado

#### Error: "Failed to merge build.gradle"

**Causa**: El archivo Gradle tiene errores de sintaxis o formato inesperado.

**Solución**:
1. Haz backup de tu `build.gradle` o `build.gradle.kts`
2. Corrige cualquier error de sintaxis
3. Asegúrate de que el archivo siga el formato estándar de Gradle
4. Intenta regenerar desde un estado limpio

### Problemas de Dependencias

#### Error: "Could not resolve dependency"

**Causa**: El repositorio Maven es inaccesible o la dependencia no existe.

**Solución**:
1. Verifica tu conexión a internet
2. Verifica que Maven Central sea accesible
3. Verifica que la versión de la dependencia exista
4. Intenta actualizar las versiones de dependencias en `.cleanarch.yml`:
```yaml
dependencyOverrides:
  spring-boot: 3.2.0
```

### Problemas de Build

#### Error: "Task 'initCleanArch' not found"

**Causa**: El plugin no está aplicado correctamente al proyecto.

**Solución**:
1. Asegúrate de que el plugin esté en `build.gradle.kts`:
```kotlin
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
}
```
2. Ejecuta `./gradlew tasks --group="clean architecture"` para verificar que el plugin esté cargado
3. Intenta `./gradlew clean build`

#### Error: "Java version mismatch"

**Causa**: El proyecto requiere Java 21 o superior.

**Solución**:
1. Verifica la versión de Java: `java -version`
2. Instala Java 21 si es necesario
3. Configura la variable de entorno JAVA_HOME
4. Actualiza `build.gradle.kts`:
```kotlin
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}
```

## Modo Debug

Habilita logging detallado para diagnosticar problemas:

```bash
# Mostrar información detallada
./gradlew generateOutputAdapter --info

# Mostrar información de debug
./gradlew generateOutputAdapter --debug

# Mostrar stack traces en errores
./gradlew generateOutputAdapter --stacktrace
```

## Problemas de Caché

Si experimentas problemas relacionados con templates, intenta limpiar el caché:

```bash
# Eliminar caché de templates
rm -rf .cleanarch/cache

# Regenerar con templates frescos
./gradlew generateOutputAdapter \
  --name=MiRepositorio \
  --entity=MiEntidad \
  --type=redis
```

O usa la tarea de limpieza:

```bash
./gradlew clearTemplateCache
```

## Validación

Valida tu configuración y templates:

```bash
# Validar templates
./gradlew validateTemplates

# Esto verificará:
# - Sintaxis de templates
# - Variables faltantes
# - Formato de metadata
# - Declaraciones de dependencias
```

## Obtener Ayuda

Si sigues experimentando problemas:

1. **Revisa la Documentación**: Consulta las [guías](.) para información detallada
2. **Busca Issues**: Busca problemas similares en el [issue tracker](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues)
3. **Crea un Issue**: Si encontraste un bug, crea un nuevo issue con:
   - Mensaje de error
   - Pasos para reproducir
   - Tu configuración (`.cleanarch.yml`)
   - Versión de Gradle (`./gradlew --version`)
   - Versión de Java (`java -version`)
   - Versión del plugin

## Workarounds Comunes

### Workaround: Generación Manual de Archivos

Si la generación automática falla, puedes crear archivos manualmente:

1. Copia el template del directorio `templates/`
2. Reemplaza las variables manualmente:
   - `${basePackage}` → tu paquete base
   - `${projectName}` → nombre de tu proyecto
   - `${adapterName}` → nombre de tu adaptador
3. Agrega dependencias a `build.gradle` manualmente
4. Actualiza `application.yml` con la configuración

### Workaround: Modo Desarrollador

Para más control sobre los templates:

```yaml
# .cleanarch.yml
templates:
  mode: developer
  localPath: ../backend-architecture-design-archetype-generator-templates
  cache: false
```

Esto te permite:
- Modificar templates directamente
- Ver cambios inmediatamente
- Debuggear problemas de templates
- Probar templates personalizados

## Problemas Específicos por Adaptador

### Redis

#### Error: "Unable to connect to Redis"

**Solución**:
```bash
# Usando Docker
docker run -d -p 6379:6379 redis:latest

# O instalar localmente
brew install redis  # macOS
redis-server
```

#### Error: "Serialization error"

**Solución**: Asegúrate de que tus entidades sean serializables:
```java
@RedisHash("users")
public class UserData implements Serializable {
    // ...
}
```

### MongoDB

#### Error: "Connection refused to MongoDB"

**Solución**:
```bash
# Usando Docker
docker run -d -p 27017:27017 mongo:latest

# Verificar conexión
mongosh mongodb://localhost:27017
```

#### Error: "Codec not found for class"

**Solución**: Verifica que tu documento tenga las anotaciones correctas:
```java
@Document(collection = "users")
public class UserDocument {
    @Id
    private String id;
    // ...
}
```

### PostgreSQL

#### Error: "R2DBC connection failed"

**Solución**:
```bash
# Usando Docker
docker run -d \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=postgres \
  postgres:latest
```

Verifica tu configuración en `application.yml`:
```yaml
spring:
  r2dbc:
    url: r2dbc:postgresql://localhost:5432/mydb
    username: postgres
    password: postgres
```

#### Error: "Table does not exist"

**Solución**: Crea las migraciones de Flyway:
```sql
-- src/main/resources/db/migration/V1__create_users_table.sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Problemas de Testing

### Error: "Testcontainers not starting"

**Solución**:
1. Verifica que Docker esté corriendo
2. Verifica que tengas permisos para Docker
3. Aumenta los recursos de Docker (memoria, CPU)

### Error: "Tests failing with connection timeout"

**Solución**:
```java
@Testcontainers
class MyRepositoryTest {
    @Container
    static GenericContainer<?> redis = new GenericContainer<>("redis:latest")
        .withExposedPorts(6379)
        .withStartupTimeout(Duration.ofMinutes(2)); // Aumentar timeout
}
```

## Ver También

- [Guía de Inicio Rápido](getting-started/quick-start)
- [Referencia de Comandos](reference/commands)
- [Guía de Configuración](reference/configuration)
- [Guía de Contribución](contributing/overview)
