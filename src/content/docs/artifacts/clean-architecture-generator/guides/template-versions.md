---
title: Cómo controlar la versión de las plantillas
description: Usa el último tag, fija uno, prueba una rama o trabaja con plantillas locales y sin conexión.
sidebar:
  order: 5
---

El código que genera el plugin sale del [repositorio de templates](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates), no del plugin. Esta guía explica cómo decidir qué versión de ese repositorio usa tu proyecto.

## Qué versión usa por defecto

El plugin `1.x` usa el tag `v1.x.y` más alto del repositorio de templates. Si existen `v1.0.0`, `v1.2.0` y `v1.2.1`, usa `v1.2.1`.

- Consulta los tags en la API de GitHub una vez cada 10 minutos por daemon de Gradle.
- Descarga el zip del tag una sola vez y lo guarda en `~/.cleanarch/templates-cache/archives/`. Un tag nunca cambia, así que las siguientes generaciones lo leen de ahí.
- Cada comando imprime la versión que usó (`Ref: v1.2.1`).

Así, una plantilla corregida te llega en la siguiente generación sin cambiar la versión del plugin. Un cambio que el plugin no entiende sube el `schemaVersion` de las plantillas y se publica en el mayor siguiente (`v2.0.0`), que tu plugin `1.x` no lee.

## Cómo fijar una versión

Para que un proyecto genere siempre igual, aunque salgan plantillas nuevas, agrega a `.cleanarch.yml`:

```yaml
templates:
  version: v1.0.1
```

Los tags disponibles están en la [lista de tags](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates/tags). Para volver a la última versión, borra `version`.

## Cómo probar plantillas que aún no tienen tag

Para probar una rama del repositorio de templates, por ejemplo la de un pull request:

```yaml
templates:
  branch: feat/kafka-adapter
```

Una rama se descarga de nuevo en cada build, así que ves sus últimos cambios. Si pones `version` y `branch`, gana `version`.

## Cómo usar plantillas locales

Si estás cambiando las plantillas, apunta el plugin a tu copia del repositorio:

```yaml
templates:
  mode: developer
  localPath: /home/dev-user/repos/backend-architecture-design-archetype-generator-templates/templates
```

- `localPath` apunta a la carpeta `templates/` del repositorio, no a su raíz.
- En modo `developer` el plugin no usa la red ni la caché: cada cambio en un `.ftl` se ve en la siguiente generación.
- Usa una ruta absoluta: una relativa se resuelve desde la carpeta en que arrancó el daemon de Gradle, que no siempre es la del proyecto. La carpeta tiene que existir.

Para crear un proyecto con plantillas locales, crea `.cleanarch.yml` solo con la sección `templates` antes de correr `initCleanArch`. El plugin la conserva al escribir el resto.

## Cómo trabajar sin conexión

Sin red, el plugin no puede consultar cuál es el último tag. Fija uno que ya hayas descargado:

1. Con conexión, corre cualquier generación con `version` fijado, para que el tag quede en la caché.
2. Sin conexión, el plugin lee ese tag de `~/.cleanarch/templates-cache/archives/` y no usa la red.

Si el tag no está en la caché, el plugin falla y dice qué tag fijar.

## Cómo limpiar la caché

```bash
./gradlew updateTemplates
```

Borra la caché de plantillas y la memoria del último tag. La siguiente generación vuelve a consultar GitHub y a descargar. `./gradlew clearTemplateCache` hace lo mismo con la caché en disco y muestra cuánto espacio liberó.

## Si algo falla

- **`Cannot read the templates releases of …`**: no hubo acceso a la API de GitHub, o se alcanzó su límite de 60 consultas por hora sin autenticación. Fija `templates.version`.
- **`… has no templates release v1.x.y for this plugin yet`**: el repositorio configurado no tiene tags de tu mayor. Fija `templates.branch` o usa el repositorio oficial.
- **`Cannot download templates … (HTTP 404)`**: el tag o la rama no existen. Revisa el nombre.
- **`Template localPath does not exist`**: la ruta de `localPath` no existe. Usa una ruta absoluta.
- **`Templates at … use schema N, but this plugin understands schema 1`**: las plantillas son de otro mayor. Usa un tag `v1.x.y` o actualiza el plugin al mayor que pide el mensaje.
