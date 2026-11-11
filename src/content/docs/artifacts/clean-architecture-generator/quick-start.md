---
title: Inicio rápido
description: Crea un microservicio hexagonal con una entidad, un caso de uso, MongoDB y un endpoint REST en menos de 10 minutos.
sidebar:
  order: 2
---

Al terminar tendrás un servicio Spring Boot reactivo con una entidad, un caso de uso, un adaptador de MongoDB y una API REST en `/api/v1/products`, con sus pruebas de arquitectura en verde. Los métodos generados traen `TODO` donde va tu lógica.

## Requisitos

- JDK `21`.
- Gradle `8.5` o superior instalado, solo para el primer comando. Después usas el wrapper que genera el plugin (Gradle `8.14.1`).
- Acceso a `api.github.com` y `codeload.github.com`: el plugin descarga las plantillas de GitHub. Sin red, lee [cómo trabajar sin conexión](../guides/template-versions/#cómo-trabajar-sin-conexión).

## 1. Prepara la carpeta

El plugin solo crea proyectos en una carpeta vacía. Crea una con el nombre del servicio, en minúsculas y con guiones:

```bash
mkdir product-service && cd product-service
```

Crea `settings.gradle.kts`:

```kotlin
rootProject.name = "product-service"
```

Crea `build.gradle.kts`:

```kotlin
plugins {
    id("co.com.pragma.archetype-generator") version "1.1.1"
}
```

## 2. Crea el proyecto

```bash
gradle initCleanArch --package=com.example.productservice --architecture=hexagonal-single --paradigm=reactive
```

El plugin descarga el último tag de plantillas, reemplaza los dos archivos anteriores por los del proyecto y escribe `.cleanarch.yml` con la arquitectura y el paradigma. Desde aquí usa `./gradlew`.

## 3. Agrega el dominio

Una entidad con dos campos:

```bash
./gradlew generateEntity --name=Product --fields=name:String,price:Double
```

Un caso de uso para crear productos:

```bash
./gradlew generateUseCase --name=CreateProduct --methods=execute:Product:product:Product
```

Quedan `domain/model/Product.java`, `domain/ports/ICreateProductUseCase.java` y `domain/usecases/CreateProductUseCase.java`. El caso de uso trae los métodos `execute`, `findById`, `findAll`, `update` y `delete` con `TODO`: ahí va tu lógica de negocio.

## 4. Agrega los adaptadores

El de salida a MongoDB, que crea también el gateway `IProductGateway`:

```bash
./gradlew generateOutputAdapter --name=Product --entity=Product --type=mongodb
```

El de entrada REST:

```bash
./gradlew generateInputAdapter --name=Product --type=rest --useCase=CreateProduct --endpoints="/products:POST:execute:Product:product:BODY:Product"
```

- El adaptador de MongoDB implementa `IProductGateway` con `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count` y `deleteAll` sobre un repositorio de Spring Data.
- El REST publica `GET`, `POST`, `PUT` y `DELETE` en `/api/v1/products`, con sus DTO y su mapper.
- Cada adaptador agrega sus dependencias a `build.gradle.kts` y sus propiedades a `application.yml`.

## 5. Pruébalo

```bash
./gradlew build -x pitest -x dependencyCheckAnalyze
```

El build compila y corre las pruebas, incluidas las de ArchUnit que verifican que el dominio no dependa de Spring ni de los adaptadores. Debe terminar en `BUILD SUCCESSFUL`. Los dos `-x` saltan las mutaciones y el análisis OWASP, que tardan varios minutos; córrelos en tu pipeline.

Para ver todo lo que generaste:

```bash
./gradlew listComponents
```

## Siguiente paso

- [Elige la arquitectura](../guides/architectures/) que mejor encaja con tu servicio.
- Mira todas las opciones de cada comando en la [referencia de tareas](../reference/tasks/).
- Revisa los [adaptadores de entrada](../reference/entry-points/) y [de salida](../reference/driven-adapters/) disponibles.
