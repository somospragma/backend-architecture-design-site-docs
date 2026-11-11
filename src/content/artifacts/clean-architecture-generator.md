---
name: Clean Architecture Generator
summary:
  es: Plugin de Gradle que genera microservicios con arquitectura hexagonal u onion, y sus adaptadores.
  en: Gradle plugin that generates microservices with hexagonal or onion architecture, and their adapters.
description:
  es: Crea el proyecto con sus capas, pruebas de arquitectura con ArchUnit y la configuración de calidad. Después genera entidades, casos de uso y adaptadores (REST, GraphQL, gRPC, SQS, MongoDB, PostgreSQL, Redis, DynamoDB) en Spring Boot reactivo o imperativo.
  en: It creates the project with its layers, ArchUnit architecture tests and quality setup. Then it generates entities, use cases and adapters (REST, GraphQL, gRPC, SQS, MongoDB, PostgreSQL, Redis, DynamoDB) on reactive or imperative Spring Boot.
install: id("co.com.pragma.archetype-generator") version "1.1.0"
kind: plugin
disciplines: [backend, dx]
languages: [java, kotlin]
technologies: [spring-boot, spring-webflux, gradle]
origin: official
owners: [somospragma/backend-chapter]
repository: https://github.com/somospragma/backend-architecture-design-archetype-generator-core
status: beta
license: Apache-2.0
docs:
  mode: indexed
  url: https://github.com/somospragma/backend-architecture-design-archetype-generator-core#readme
tags: [arquitectura limpia, clean architecture, hexagonal, onion, microservicio, microservice, generador, scaffold, adaptadores, adapters, archunit]
lastReviewed: 2026-11-11
---
