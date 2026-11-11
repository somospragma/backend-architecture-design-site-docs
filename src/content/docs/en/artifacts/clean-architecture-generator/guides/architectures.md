---
title: How to choose the architecture
description: The four architectures the plugin generates, their folder tree and where each component goes.
sidebar:
  order: 3
---

You choose the architecture only once, with `--architecture` in `initCleanArch`, and it is stored in `.cleanarch.yml`. Everything you generate afterwards is placed according to it. All four work with both paradigms, reactive and imperative.

## Which one to choose

| If… | Use |
|---|---|
| You are starting out, or the service is small | `hexagonal-single` |
| You want the domain to compile separately and be unable to import anything from infrastructure | `hexagonal-multi` |
| The service has many adapters and you want to compile and test them separately | `hexagonal-multi-granular` |
| Your team works with onion and prefers use cases without an interface | `onion-single` |

## What they share

- **Adapters** go in `infrastructure/entry-points/` (input) and `infrastructure/driven-adapters/` (output). In Java packages the hyphens disappear: `infrastructure.entrypoints` and `infrastructure.drivenadapters`.
- **Configuration** goes in `infrastructure/config/`: `UseCasesConfig` registers the use cases as beans and `ErrorType` defines the domain errors.
- **Architecture tests** go in `src/test/java/<package>/architecture/`. Read [which rules they check](../../reference/generated-project/#architecture-tests).
- **The domain doesn't know Spring.** Entities use Lombok and use cases receive their dependencies through the constructor; `UseCasesConfig` registers them.

In the examples, the base package is `com.example.demo`, the entity is `Product`, the use case is `CreateProduct` and the adapters are named `Product`.

## hexagonal-single

A single Gradle module with the layers as packages. It is the default option.

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── domain/
│   ├── model/        Product.java
│   ├── ports/        ICreateProductUseCase.java, IProductGateway.java
│   └── usecases/     CreateProductUseCase.java
└── infrastructure/
    ├── config/       UseCasesConfig.java, ErrorType.java
    ├── entrypoints/
    │   └── productrest/          ProductHandler.java, ProductRouter.java…
    └── drivenadapters/
        └── productmongodb/       ProductAdapter.java, ProductRepository.java, entity/, mapper/, config/
```

- **Input ports** (`I<Name>UseCase`) and **gateways** (`I<Entity>Gateway`) live together in `domain/ports`.
- The use case implements its port; the input adapter depends on the port, not on the class.

## hexagonal-multi

Three Gradle modules: `domain`, `application` and `infrastructure`.

```text
domain/                       :domain module, no Spring dependencies
└── src/main/java/com/example/demo/domain/
    ├── model/        Product.java
    ├── ports/        ICreateProductUseCase.java, IProductGateway.java
    └── usecases/     CreateProductUseCase.java
application/                  :application module, depends on :domain (empty on creation)
infrastructure/               :infrastructure module, depends on :domain and :application
└── src/main/java/com/example/demo/
    ├── DemoApplication.java
    └── infrastructure/
        ├── config/
        ├── entrypoints/
        └── drivenadapters/
```

- The `domain` module doesn't have Spring on its classpath: an infrastructure import doesn't compile.
- Adapters are packages inside `infrastructure`, not modules.
- `application.yml`, `Application` and the architecture tests live in `infrastructure`.

## hexagonal-multi-granular

One module for each part of the domain and one module for each adapter you generate.

```text
domain/
├── model/          :model module        Product.java
├── ports/          :ports module        ICreateProductUseCase.java, IProductGateway.java (depends on :model)
└── usecases/       :usecases module     CreateProductUseCase.java (depends on :model and :ports)
infrastructure/
├── helpers/        :helpers module      shared utilities (depends on :model and :ports)
├── entry-points/
│   └── productapi/       :productapi module     generated with --name=ProductApi --type=rest
└── driven-adapters/
    └── productstore/     :productstore module   generated with --name=ProductStore --type=mongodb
application/
└── app-service/    :app-service module  Application, application.yml, config and architecture tests
```

- `generateInputAdapter` and `generateOutputAdapter` create the module in `infrastructure/<entry-points|driven-adapters>/<--name in lowercase>`, register it in `settings.gradle.kts` and add it as a dependency of `:app-service`.
- The module name comes only from `--name`, without the type. Give each adapter a different name (`ProductApi`, `ProductStore`), because two modules can't have the same name.
- Each adapter module depends only on `:model` and `:ports`, plus the libraries of its technology.
- You can compile or test a single adapter: `./gradlew :productstore:test`.

## onion-single

A single module, with onion: the domain at the center, the application around it and the infrastructure outside.

```text
src/main/java/com/example/demo/
├── DemoApplication.java
├── domain/
│   ├── model/        Product.java
│   └── gateway/      IProductGateway.java
├── application/
│   └── usecase/      CreateProductUseCase.java
└── infrastructure/
    ├── config/
    ├── entrypoints/
    └── drivenadapters/
```

- **There are no input ports.** `generateUseCase` creates only the class, and input adapters depend on it directly.
- Gateways go in `domain/gateway` instead of `domain/ports`.
- The ArchUnit test uses `onionArchitecture()`: dependencies only point inwards.

## If something fails

- **`Invalid architecture: … Valid values: …`**: the name isn't in the templates. Use one of the four on this page.
- **`Project is already initialized`**: `.cleanarch.yml` already has a project. You can't change the architecture after creating the project; create a new one and move your code.
