---
title: Tareas de Gradle
description: Todas las tareas del plugin, sus opciones, valores por defecto y validaciones.
sidebar:
  order: 6
---

Todas las tareas están en el grupo `clean architecture` (`./gradlew tasks --group "clean architecture"`). Ninguna hace preguntas: todo se pasa con opciones `--opcion=valor`. Las opciones booleanas son *flags*: se activan con `--opcion` y se desactivan con `--no-opcion`.

## initCleanArch

Crea el proyecto en la carpeta actual y escribe `.cleanarch.yml`.

| Opción | Obligatoria | Por defecto | Valores |
|---|---|---|---|
| `--package` | Sí | | Paquete base, por ejemplo `com.example.orders`. Cada segmento en minúsculas, empezando por letra. |
| `--architecture` | No | `hexagonal-single` | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single` |
| `--paradigm` | No | `reactive` | `reactive`, `imperative` |
| `--framework` | No | `spring` | `spring` |

- El nombre del proyecto es `rootProject.name` (o el nombre de la carpeta) y tiene que cumplir `[a-z][a-z0-9-]*`.
- La carpeta tiene que estar vacía. Solo se permiten `build.gradle(.kts)`, `settings.gradle(.kts)`, `gradlew`, `gradlew.bat`, `gradle/`, `.gradle/`, `build/`, `.git`, `.gitignore` y un `.cleanarch.yml` sin sección `project`.
- Falla si `.cleanarch.yml` ya tiene un proyecto.

```bash
gradle initCleanArch --package=com.example.orders --architecture=hexagonal-multi --paradigm=imperative
```

## generateEntity

Crea una entidad del dominio.

| Opción | Obligatoria | Por defecto | Valores |
|---|---|---|---|
| `--name` | Sí | | PascalCase: `[A-Z][a-zA-Z0-9]*` |
| `--fields` | Sí | | `campo:Tipo,campo:Tipo`. Un `?` al final del tipo lo hace opcional. Los campos en camelCase. |
| `--idType` | No | `String` | `String`, `Long`, `UUID` |
| `--hasId` | No | activado | `--no-hasId` crea la entidad sin campo `id`. |
| `--packageName` | No | el paquete `model` de la arquitectura | Paquete completo. |

```bash
./gradlew generateEntity --name=Order --fields="customerId:String,total:BigDecimal,notes:String?" --idType=UUID
```

## generateUseCase

Crea un caso de uso y, en las arquitecturas hexagonales, su puerto de entrada. Las plantillas `v1` generan un esqueleto con `execute`, `findById`, `findAll`, `update` y `delete` sobre `Object` (`Mono`/`Flux` en reactivo), con `TODO` para tu lógica.

| Opción | Obligatoria | Por defecto | Valores |
|---|---|---|---|
| `--name` | Sí | | Nombre sin el sufijo `UseCase`: `CreateOrder` crea `CreateOrderUseCase`. |
| `--methods` | Sí | | `metodo:Retorno[:param:Tipo…]`. Parámetros separados por `:`, métodos por `\|`. Se valida, pero las plantillas `v1` no la usan todavía. |
| `--generatePort` | No | activado | `--no-generatePort` no crea la interfaz. Solo para onion: en hexagonal la clase implementa el puerto y sin él no compila. |
| `--generateImpl` | No | activado | `--no-generateImpl` no crea la clase. No puedes desactivar las dos. |
| `--packageName` | No | el paquete de puertos o de casos de uso | Tiene que empezar por el paquete base. |

```bash
./gradlew generateUseCase --name=CreateOrder --methods="execute:Order:order:Order"
```

## generateOutputAdapter

Crea un adaptador de salida, su gateway si falta, su entidad de persistencia y su mapper.

| Opción | Obligatoria | Por defecto | Valores |
|---|---|---|---|
| `--name` | Sí | | Nombre del adaptador, por ejemplo `Order`. |
| `--entity` | Sí | | Entidad del dominio que guarda o consulta. |
| `--type` | No | `redis` | Uno de los [adaptadores de salida](../driven-adapters/). |
| `--methods` | No | | Métodos del gateway, con el formato de `generateUseCase`. |
| `--packageName` | No | `<paquete base>.infrastructure.drivenadapters.<nombre><tipo>` | Paquete completo. |

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=mongodb
```

## generateInputAdapter

Crea un adaptador de entrada que llama a un caso de uso.

| Opción | Obligatoria | Por defecto | Valores |
|---|---|---|---|
| `--name` | Sí | | Nombre del adaptador, por ejemplo `Order`. |
| `--type` | No | `rest` | Uno de los [adaptadores de entrada](../entry-points/). |
| `--useCase` | Sí, en la práctica | | Caso de uso que llama, sin el sufijo `UseCase`. Las plantillas lo usan aunque la tarea no lo valide. |
| `--endpoints` | Solo para `rest` | | `/ruta:MÉTODO:metodo:Retorno[:param:ORIGEN:Tipo…]`, separados por `\|`. `MÉTODO`: `GET`, `POST`, `PUT`, `DELETE`, `PATCH`. `ORIGEN`: `PATH`, `BODY`, `QUERY`. Se valida, pero las plantillas `v1` publican siempre un CRUD en `/api/v1/<nombre>s`. |
| `--packageName` | No | `<paquete base>.infrastructure.entrypoints.<nombre><tipo>` | Paquete completo. |

```bash
./gradlew generateInputAdapter --name=Order --type=rest --useCase=CreateOrder \
  --endpoints="/orders:POST:execute:Order:order:BODY:Order"
```

## listComponents

Lista las entidades, casos de uso y adaptadores del proyecto. No tiene opciones.

En `hexagonal-multi-granular` y en `onion-single` la lista puede quedar incompleta, porque busca en las rutas de `hexagonal-single`.

## validateStructure

Copia las pruebas de arquitectura de las plantillas al proyecto y corre `./gradlew test --tests '*architecture*'`. Sirve para traer las reglas de una versión nueva de las plantillas. No tiene opciones.

## validateTemplates

Revisa que las plantillas estén completas. Es para quien mantiene las plantillas.

| Opción | Valores |
|---|---|
| `--architecture` | Revisa solo esa arquitectura. |
| `--adapter` | Revisa solo ese adaptador. |

Sin opciones, revisa todo.

## updateTemplates

Borra la caché de plantillas y la memoria del último tag, para que la siguiente generación vuelva a consultar GitHub. En modo `developer` no hace nada. No tiene opciones.

## clearTemplateCache

Borra la caché de plantillas en `~/.cleanarch/templates-cache/` y muestra cuánto espacio liberó. No tiene opciones.
