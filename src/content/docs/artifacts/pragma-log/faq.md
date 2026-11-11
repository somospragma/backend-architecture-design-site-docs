---
title: Preguntas frecuentes
description: Dudas comunes al usar pragma-log.
sidebar:
  order: 90
---

## ¿Tengo que cambiar cómo escribo los logs?

No. Sigues usando SLF4J (`LoggerFactory.getLogger(...)`, `log.info(...)`). En Quarkus también funciona JBoss Logging (`Log.infof(...)`). pragma-log no tiene un logger propio.

## ¿Necesito un `logback-spring.xml`?

No en Spring Boot ni en Quarkus: la librería configura el logging sola. Si ya tienes un `logback-spring.xml` con appenders propios, revisa que no reemplace los de Spring Boot, o usa `PragmaStructuredEncoder` en ellos. En Java puro sí necesitas `logback.xml`.

## Logueo un objeto y sale como `<NombreDeLaClase>`. ¿Por qué?

Pasa en Quarkus en modo nativo: la clase no está registrada para reflexión y no se pueden leer sus campos. Agrégale `@RegisterForReflection`. Las clases con `@MaskedLogField` se registran solas.

## ¿Por qué un campo con un dato sensible no salió enmascarado?

Revisa en este orden:

1. Si el campo tiene `@MaskedLogField` o su nombre está en [`masking.fields`](../guides/masking/#enmascara-por-nombre-de-campo). Si definiste `masking.fields`, esa lista reemplaza la de por defecto.
2. Si el dato está dentro de un texto (`"tarjeta " + numero`). Ahí solo lo encuentran los [patrones](../guides/masking/#busca-datos-dentro-del-texto-con-patrones).
3. Si `masking.enabled` está en `false`.
4. Si el dato lo escribiste en el mensaje con concatenación en vez de `{}`: `log.info("Cliente " + cliente)` llama al `toString()` de tu clase antes de que pragma-log lo vea. Usa `log.info("Cliente {}", cliente)`.

## ¿Enmascarar hace más lento el logging?

Convertir un objeto a JSON enmascarado cuesta más que un `toString()`, y cada patrón recorre el texto de cada log. Para la mayoría de los servicios no se nota. Si el logging aparece en tus perfiles, usa el [logging asíncrono](../guides/async/) y mantén corta la lista de patrones.

## ¿Puedo ver los logs como texto en local?

Sí, con `format: plain` en un perfil local. El masking es el mismo. Lee [Texto plano para desarrollo local](../guides/formats/#texto-plano-para-desarrollo-local).

## ¿Por qué no aparece el log de fin de request?

- La ruta está en `http.request-log.exclude-paths` (por defecto `/actuator/**` en Spring Boot y `/q/**` en Quarkus).
- `http.request-log.enabled` o `http.enabled` está en `false`.
- El nivel del logger `co.com.pragma.logging.http` está por encima de `INFO`.

## ¿Por qué no salen `traceId` ni `spanId`?

pragma-log no crea trazas: las toma de Micrometer Tracing en Spring Boot (agrega `micrometer-tracing-bridge-brave` o `micrometer-tracing-bridge-otel`) o de OpenTelemetry en Quarkus (`quarkus-opentelemetry`). Si tu app no tiene trazas, esos campos no salen.

## ¿Funciona con Log4j 2?

No. pragma-log funciona sobre Logback (Spring Boot y Java puro) y sobre JBoss LogManager (Quarkus). Si tu app usa `spring-boot-starter-log4j2`, cambia a Logback, que es el de por defecto en Spring Boot.

## ¿Funciona en Kubernetes?

Sí. El campo `host` toma la variable `HOSTNAME`, que en Kubernetes es el nombre del pod. Escribir a la consola en JSON es lo que esperan los recolectores de Kubernetes, como Fluent Bit o el collector de OpenTelemetry.

## ¿Cómo agrego más de un módulo con la misma versión?

Usa el BOM:

```kotlin
dependencies {
    implementation(platform("co.com.pragma.logging:pragma-log-bom:1.0.1"))
    implementation("co.com.pragma.logging:pragma-log-spring-boot-starter")
}
```

## ¿Dónde reporto un error o pido una funcionalidad?

En los [issues del repositorio](https://github.com/somospragma/pragma-log-lib/issues). Incluye la versión de pragma-log, el framework y su versión, la configuración y el log que esperabas ver.
