---
title: Cómo elegir la arquitectura
description: Las cuatro arquitecturas que genera el plugin, su árbol de carpetas y dónde queda cada componente.
sidebar:
  order: 3
---

La arquitectura se elige una sola vez, con `--architecture` en `initCleanArch`, y queda en `.cleanarch.yml`. Todo lo que generes después se ubica según ella. Las cuatro funcionan con los dos paradigmas, reactivo e imperativo.

## Cuál elegir

| Si… | Usa |
|---|---|
| Empiezas, o el servicio es pequeño | `hexagonal-single` |
| Quieres que el dominio compile aparte y no pueda importar nada de infraestructura | `hexagonal-multi` |
| El servicio tiene muchos adaptadores y quieres compilarlos y probarlos por separado | `hexagonal-multi-granular` |
| Tu equipo trabaja con onion y prefiere que los casos de uso no tengan interfaz | `onion-single` |

## Lo que comparten

- **Los adaptadores** van en `infrastructure/entry-points/` (entrada) e `infrastructure/driven-adapters/` (salida). En los paquetes Java los guiones desaparecen: `infrastructure.entrypoints` e `infrastructure.drivenadapters`.
- **La configuración** va en `infrastructure/config/`: `UseCasesConfig` registra los casos de uso como beans y `ErrorType` define los errores del dominio.
- **Las pruebas de arquitectura** van en `src/test/java/<paquete>/architecture/`. Lee [qué reglas verifican](../../reference/generated-project/#pruebas-de-arquitectura).
- **El dominio no conoce Spring.** Las entidades usan Lombok y los casos de uso reciben sus dependencias por constructor; los registra `UseCasesConfig`.

En los ejemplos, el paquete base es `com.example.demo`, la entidad `Product`, el caso de uso `CreateProduct` y los adaptadores se llaman `Product`.

## hexagonal-single

Un solo módulo de Gradle con las capas como paquetes. Es la opción por defecto.

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

- Los **puertos de entrada** (`I<Nombre>UseCase`) y los **gateways** (`I<Entidad>Gateway`) viven juntos en `domain/ports`.
- El caso de uso implementa su puerto; el adaptador de entrada depende del puerto, no de la clase.

## hexagonal-multi

Tres módulos de Gradle: `domain`, `application` e `infrastructure`.

```text
domain/                       módulo :domain, sin dependencias de Spring
└── src/main/java/com/example/demo/domain/
    ├── model/        Product.java
    ├── ports/        ICreateProductUseCase.java, IProductGateway.java
    └── usecases/     CreateProductUseCase.java
application/                  módulo :application, depende de :domain (vacío al crear)
infrastructure/               módulo :infrastructure, depende de :domain y :application
└── src/main/java/com/example/demo/
    ├── DemoApplication.java
    └── infrastructure/
        ├── config/
        ├── entrypoints/
        └── drivenadapters/
```

- El módulo `domain` no tiene Spring en su classpath: un import de infraestructura no compila.
- Los adaptadores son paquetes dentro de `infrastructure`, no módulos.
- `application.yml`, `Application` y las pruebas de arquitectura viven en `infrastructure`.

## hexagonal-multi-granular

Un módulo por cada parte del dominio y un módulo por cada adaptador que generes.

```text
domain/
├── model/          módulo :model        Product.java
├── ports/          módulo :ports        ICreateProductUseCase.java, IProductGateway.java (depende de :model)
└── usecases/       módulo :usecases     CreateProductUseCase.java (depende de :model y :ports)
infrastructure/
├── helpers/        módulo :helpers      utilidades compartidas (depende de :model y :ports)
├── entry-points/
│   └── productapi/       módulo :productapi     generado con --name=ProductApi --type=rest
└── driven-adapters/
    └── productstore/     módulo :productstore   generado con --name=ProductStore --type=mongodb
application/
└── app-service/    módulo :app-service  Application, application.yml, config y pruebas de arquitectura
```

- `generateInputAdapter` y `generateOutputAdapter` crean el módulo en `infrastructure/<entry-points|driven-adapters>/<--name en minúsculas>`, lo registran en `settings.gradle.kts` y lo agregan como dependencia de `:app-service`.
- El nombre del módulo sale solo de `--name`, sin el tipo. Dale a cada adaptador un nombre distinto (`ProductApi`, `ProductStore`), porque dos módulos no pueden llamarse igual.
- Cada módulo de adaptador depende solo de `:model` y `:ports`, más las librerías de su tecnología.
- Puedes compilar o probar un adaptador solo: `./gradlew :productstore:test`.

## onion-single

Un solo módulo, con onion: el dominio en el centro, la aplicación alrededor y la infraestructura afuera.

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

- **No hay puertos de entrada.** `generateUseCase` crea solo la clase y los adaptadores de entrada dependen de ella directamente.
- Los gateways van en `domain/gateway` en vez de `domain/ports`.
- La prueba de ArchUnit usa `onionArchitecture()`: las dependencias solo apuntan hacia adentro.

## Si algo falla

- **`Invalid architecture: … Valid values: …`**: el nombre no está en las plantillas. Usa uno de los cuatro de esta página.
- **`Project is already initialized`**: `.cleanarch.yml` ya tiene un proyecto. La arquitectura no se cambia después de crear el proyecto; crea uno nuevo y mueve tu código.
