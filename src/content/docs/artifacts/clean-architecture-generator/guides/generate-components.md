---
title: Cómo generar entidades, casos de uso y adaptadores
description: El orden de trabajo, el formato de cada opción y cómo nombra el plugin lo que genera.
sidebar:
  order: 4
---

Con esta guía agregas a un proyecto existente una entidad, sus casos de uso y los adaptadores que los exponen y los persisten, en el orden en que dependen unos de otros.

## Antes de empezar

- El proyecto lo creó `initCleanArch`: los comandos leen la arquitectura, el paradigma y el paquete de `.cleanarch.yml`.
- Corre los comandos desde la raíz del proyecto.

## El orden

1. **Entidad**: los casos de uso y los adaptadores la usan.
2. **Caso de uso**: los adaptadores de entrada lo llaman.
3. **Adaptador de salida**: crea el gateway que el caso de uso necesita para persistir o consultar.
4. **Adaptador de entrada**: expone el caso de uso.

## 1. Genera la entidad

```bash
./gradlew generateEntity --name=Customer --fields="name:String,email:String,birthDate:LocalDate?" --idType=UUID
```

- `--fields` es una lista `campo:Tipo` separada por comas. Un `?` al final del tipo marca el campo como opcional.
- El plugin agrega un campo `id` del tipo de `--idType` (`String`, `Long` o `UUID`; por defecto `String`). Si declaras un campo `id`, lo ignora.
- El nombre de la entidad va en PascalCase y los campos en camelCase.
- Los tipos de `java.time` y `UUID` se importan solos.
- Pon el valor entre comillas: algunas terminales interpretan `?` como comodín.

Queda `Customer.java` en el paquete `model` de la arquitectura, con `@Data`, `@Builder` y los constructores de Lombok.

## 2. Genera los casos de uso

```bash
./gradlew generateUseCase --name=RegisterCustomer --methods="execute:Customer:customer:Customer"
```

Qué genera:

- En hexagonal, el puerto `IRegisterCustomerUseCase` en el paquete de puertos y la clase `RegisterCustomerUseCase` que lo implementa. En onion, solo la clase.
- Un esqueleto con cinco métodos: `execute`, `findById`, `findAll`, `update` y `delete`. Reciben y devuelven `Object` (`Mono` o `Flux` en reactivo) y tienen un `TODO`. Cambia los tipos por tu entidad y escribe la lógica.
- No tienes que registrarlo: `UseCasesConfig` registra como bean toda clase del paquete de casos de uso cuyo nombre termine en `UseCase`, sin poner anotaciones de Spring en el dominio.

`--methods` es obligatoria y su formato se valida (`nombre:Retorno[:parametro:Tipo…]`, métodos separados por `|`), pero las plantillas `v1` todavía no la usan: el esqueleto es el mismo para cualquier valor.

## 3. Genera el adaptador de salida

```bash
./gradlew generateOutputAdapter --name=Customer --entity=Customer --type=postgresql
```

- `--type` es uno de los [adaptadores de salida](../../driven-adapters/overview/). Por defecto, `redis`.
- `--entity` es la entidad que guarda o consulta.
- Si no existe, crea el gateway `I<Entidad>Gateway` en el paquete de puertos, que el adaptador implementa y el caso de uso usa.
- Crea una entidad de persistencia y un mapper MapStruct entre ella y la del dominio, para que el dominio no tenga anotaciones de base de datos.

## 4. Genera el adaptador de entrada

```bash
./gradlew generateInputAdapter --name=Customer --type=rest --useCase=RegisterCustomer \
  --endpoints="/customers:POST:execute:Customer:customer:BODY:Customer"
```

El adaptador REST publica un CRUD en `/api/v1/<nombre en minúsculas>s` (aquí, `/api/v1/customers`): `GET`, `GET /{id}`, `POST`, `PUT /{id}` y `DELETE /{id}`, más `PATCH /{id}` en imperativo. En imperativo es un `@RestController` que recibe el caso de uso; en reactivo, un `Router` y un `Handler` funcionales, con la inyección del caso de uso como `TODO`.

`--endpoints` es obligatoria para `rest` y su formato se valida, pero las plantillas `v1` publican siempre el CRUD anterior. Ajusta las rutas en la clase generada. El formato es:

```text
/ruta:MÉTODO:metodoDelCasoDeUso:TipoDeRetorno[:parametro:ORIGEN:Tipo…]
```

- `MÉTODO`: `GET`, `POST`, `PUT`, `DELETE` o `PATCH`.
- `ORIGEN`: `PATH`, `BODY` o `QUERY`.
- La ruta empieza por `/`. Separa los endpoints con `|`.

Los demás tipos no necesitan `--endpoints`, pero sí `--useCase`, que es el caso de uso que llaman:

```bash
./gradlew generateInputAdapter --name=CustomerEvents --type=sqs-consumer --useCase=RegisterCustomer
./gradlew generateInputAdapter --name=CustomerCleanup --type=scheduled --useCase=RegisterCustomer
```

## Cómo nombra el plugin lo que genera

| Qué | Nombre | Ejemplo con `--name=Customer` |
|---|---|---|
| Paquete del adaptador | `--name` en minúsculas + `--type` sin guiones | `infrastructure.drivenadapters.customerpostgresql` |
| Clase principal | `--name` + sufijo del adaptador | `CustomerAdapter`, `CustomerHandler`, `CustomerController` |
| Clases secundarias | `--name` + nombre de la plantilla | `CustomerRepository`, `CustomerR2dbcConfig` |
| Módulo (solo `hexagonal-multi-granular`) | `--name` en minúsculas | `:customer` |

Las clases que genera cada adaptador están en su página, desde los [adaptadores de entrada](../../entry-points/overview/) y [de salida](../../driven-adapters/overview/).

## Qué toca cada adaptador fuera de su carpeta

- **`build.gradle.kts`** del módulo que lo contiene: sus dependencias, plugins de Gradle y dependencias de pruebas.
- **`application.yml`**: sus propiedades, combinadas con las existentes.
- **`settings.gradle.kts`**: solo en `hexagonal-multi-granular`, para registrar el módulo nuevo.

Antes de escribir, el plugin respalda `application.yml` y `build.gradle.kts` en `.cleanarch/backups/`. Si la generación falla, los restaura.

## Si algo falla

- **`Adapter metadata not found for: X`**: ese tipo de adaptador no existe. Usa uno de las tablas de [adaptadores de entrada](../../entry-points/overview/) o [de salida](../../driven-adapters/overview/).
- **`The following has evaluated to null or missing: useCaseType`**: falta `--useCase`. Los adaptadores de entrada lo necesitan para saber qué caso de uso llamar.
- **`Endpoints are required`**: un adaptador `rest` necesita `--endpoints`.
- **El build falla en las pruebas de `architecture`**: alguna clase rompe una regla de la arquitectura. El mensaje de ArchUnit dice qué clase y qué regla; lee [qué verifican](../../reference/generated-project/#pruebas-de-arquitectura).
