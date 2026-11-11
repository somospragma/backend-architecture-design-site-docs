---
title: Introducción
description: Qué genera Clean Architecture Generator, cuándo usarlo y cuándo no.
sidebar:
  order: 1
---

Clean Architecture Generator es un plugin de Gradle que crea microservicios Spring Boot con arquitectura hexagonal u onion, y después les agrega entidades, casos de uso y adaptadores sin romper las capas. El plugin es `co.com.pragma.archetype-generator` y esta documentación corresponde a la versión `1.1.1`.

## Qué genera

| Pieza | Comando | Resultado |
|---|---|---|
| Proyecto | `initCleanArch` | Las capas o módulos de la arquitectura elegida, `Application`, `application.yml`, Dockerfile, wrapper de Gradle, calidad (JaCoCo, PIT, SonarQube, OWASP) y 8 clases de pruebas ArchUnit. |
| Entidad | `generateEntity` | Una clase del dominio con Lombok, en el paquete `model` de la arquitectura. |
| Caso de uso | `generateUseCase` | La implementación y, en hexagonal, su puerto de entrada. |
| Adaptador de salida | `generateOutputAdapter` | Redis, MongoDB, PostgreSQL, cliente HTTP, DynamoDB o productor SQS, con su gateway, mapper, configuración y propiedades. |
| Adaptador de entrada | `generateInputAdapter` | REST, GraphQL, gRPC, consumidor SQS o tarea programada. |

Cada adaptador existe en dos versiones: **reactiva** (WebFlux, R2DBC, clientes asíncronos) e **imperativa** (Spring MVC, JPA, clientes síncronos). El paradigma se elige al crear el proyecto y todo lo que generes después lo respeta.

## Arquitecturas

| Arquitectura | Módulos de Gradle | Para qué |
|---|---|---|
| `hexagonal-single` | Uno | Servicios pequeños o un MVP. Es la arquitectura por defecto. |
| `hexagonal-multi` | `domain`, `application`, `infrastructure` | Servicios medianos que quieren el dominio aislado en su propio módulo. |
| `hexagonal-multi-granular` | Uno por capa del dominio y uno por adaptador | Servicios grandes, donde cada adaptador se compila y prueba por separado. |
| `onion-single` | Uno | Equipos que prefieren onion: los casos de uso viven en `application` y no hay puertos de entrada. |

Lee [cómo elegir la arquitectura](./guides/architectures/) para ver el árbol de cada una.

## Cómo llegan las plantillas

El plugin no trae el código que genera. Lo lee del [repositorio de templates](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates), en el último tag `v1.x.y`. Cuando el equipo corrige una plantilla o agrega un adaptador, publica un tag nuevo y te llega en la siguiente generación, sin actualizar el plugin. Si necesitas que un proyecto no cambie, [fija la versión de las plantillas](./guides/template-versions/).

## Cuándo usarlo

- Empiezas un microservicio Java con Spring Boot y quieres la estructura hexagonal u onion lista, con pruebas de arquitectura desde el primer commit.
- Vas a agregar adaptadores a un proyecto creado con el plugin y quieres que sigan las mismas convenciones de paquetes, nombres y pruebas.
- Quieres que las reglas de la arquitectura se verifiquen en el build, no en la revisión de código.

## Cuándo no

- Tu proyecto no lo creó el plugin. Los comandos de generación leen `.cleanarch.yml`, que solo escribe `initCleanArch`.
- Usas Maven, Quarkus, Kotlin como lenguaje de las clases generadas, o Spring Boot 3. Las plantillas generan Java 21 sobre Spring Boot `4.0.9` con Gradle.
- Necesitas una arquitectura en capas tradicional o un monolito modular. El plugin solo genera hexagonal y onion.

## Siguiente paso

Sigue el [inicio rápido](./quick-start/) para crear un servicio con una entidad, un caso de uso y dos adaptadores.
