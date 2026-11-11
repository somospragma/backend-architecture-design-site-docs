---
name: Pragma Log
summary:
  es: Logs JSON estructurados para servicios Java, con los datos sensibles enmascarados.
  en: Structured JSON logs for Java services, with sensitive data masked.
description:
  es: Sigues usando SLF4J y cada log sale en JSON con el mismo esquema. Enmascara contraseñas, tarjetas y tokens, agrega requestId, traceId y el contexto HTTP, y funciona en Spring Boot (MVC y WebFlux), Quarkus y Java puro con Logback.
  en: You keep using SLF4J and every log comes out as JSON with the same schema. It masks passwords, cards and tokens, adds requestId, traceId and the HTTP context, and works on Spring Boot (MVC and WebFlux), Quarkus and plain Java with Logback.
install: implementation("co.com.pragma.logging:pragma-log-spring-boot-starter:0.1.0-SNAPSHOT")
kind: library
disciplines: [backend, cloudops]
languages: [java]
technologies: [spring-boot, spring-webflux, quarkus, gradle, opentelemetry]
origin: official
owners: [somospragma/backend-chapter]
repository: https://github.com/somospragma/pragma-log-lib
status: experimental
license: UNLICENSED
docs:
  mode: indexed
  url: https://github.com/somospragma/pragma-log-lib#readme
tags: [logs, logging, json, slf4j, logback, enmascarar, masking, datos sensibles, observabilidad, observability, trazas]
lastReviewed: 2026-11-03
---
