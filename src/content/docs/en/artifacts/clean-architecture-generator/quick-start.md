---
title: Quick start
description: Create a hexagonal microservice with an entity, a use case, MongoDB and a REST endpoint in under 10 minutes.
sidebar:
  order: 2
---

When you finish, you will have a reactive Spring Boot service with an entity, a use case, a MongoDB adapter and a REST API at `/api/v1/products`, with its architecture tests passing. The generated methods have a `TODO` where your logic goes.

## Requirements

- JDK `21`.
- Gradle `8.5` or later installed, only for the first command. After that you use the wrapper the plugin generates (Gradle `8.14.1`).
- Access to `api.github.com` and `codeload.github.com`: the plugin downloads the templates from GitHub. Without network, read [how to work offline](../guides/template-versions/#how-to-work-offline).

## 1. Prepare the folder

The plugin only creates projects in an empty folder. Create one with the service name, in lowercase and with hyphens:

```bash
mkdir product-service && cd product-service
```

Create `settings.gradle.kts`:

```kotlin
rootProject.name = "product-service"
```

Create `build.gradle.kts`:

```kotlin
plugins {
    id("co.com.pragma.archetype-generator") version "1.1.1"
}
```

## 2. Create the project

```bash
gradle initCleanArch --package=com.example.productservice --architecture=hexagonal-single --paradigm=reactive
```

The plugin downloads the latest templates tag, replaces the two previous files with the project's own and writes `.cleanarch.yml` with the architecture and the paradigm. From here on, use `./gradlew`.

## 3. Add the domain

An entity with two fields:

```bash
./gradlew generateEntity --name=Product --fields=name:String,price:Double
```

A use case to create products:

```bash
./gradlew generateUseCase --name=CreateProduct --methods=execute:Product:product:Product
```

You get `domain/model/Product.java`, `domain/ports/ICreateProductUseCase.java` and `domain/usecases/CreateProductUseCase.java`. The use case has the methods `execute`, `findById`, `findAll`, `update` and `delete` with `TODO`: your business logic goes there.

## 4. Add the adapters

The MongoDB output adapter, which also creates the `IProductGateway` gateway:

```bash
./gradlew generateOutputAdapter --name=Product --entity=Product --type=mongodb
```

The REST input adapter:

```bash
./gradlew generateInputAdapter --name=Product --type=rest --useCase=CreateProduct --endpoints="/products:POST:execute:Product:product:BODY:Product"
```

- The MongoDB adapter implements `IProductGateway` with `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count` and `deleteAll` on top of a Spring Data repository.
- The REST adapter publishes `GET`, `POST`, `PUT` and `DELETE` at `/api/v1/products`, with its DTOs and its mapper.
- Each adapter adds its dependencies to `build.gradle.kts` and its properties to `application.yml`.

## 5. Try it

```bash
./gradlew build -x pitest -x dependencyCheckAnalyze
```

The build compiles and runs the tests, including the ArchUnit ones that check the domain doesn't depend on Spring or on the adapters. It should end in `BUILD SUCCESSFUL`. The two `-x` skip mutation testing and the OWASP analysis, which take several minutes; run them in your pipeline.

To see everything you generated:

```bash
./gradlew listComponents
```

## Next step

- [Choose the architecture](../guides/architectures/) that best fits your service.
- See every option of each command in the [tasks reference](../reference/tasks/).
- Review the available [input](../entry-points/overview/) and [output adapters](../driven-adapters/overview/).
