---
title: REST
description: El adaptador rest de generateInputAdapter, con Spring WebFlux en reactivo y Spring MVC en imperativo.
sidebar:
  order: 2
---

Publica un caso de uso como API HTTP. En reactivo usa los endpoints funcionales de Spring WebFlux (`Router` y `Handler`); en imperativo, un `@RestController` de Spring MVC con anotaciones de OpenAPI. Úsalo cuando otro servicio o un frontend te llama por HTTP.

## Cómo generarlo

```bash
./gradlew generateInputAdapter --name=Order --type=rest --useCase=CreateOrder \
  --endpoints="/orders:POST:execute:Order:order:BODY:Order"
```

`--endpoints` es obligatoria y su formato se valida, pero las plantillas `v1` la ignoran: publican siempre un CRUD en `/api/v1/<nombre>s` (aquí, `/api/v1/orders`). Ajusta las rutas en la clase generada. El formato está en [la guía](../../guides/generate-components/#4-genera-el-adaptador-de-entrada).

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Router`, `<Nombre>Handler`, `<Nombre>RequestDTO`, `<Nombre>ResponseDTO`, `<Nombre>DTOMapper`, `<Nombre>WebFluxConfig` | `<Nombre>Controller`, `<Nombre>ExceptionHandler` |
| Rutas | `GET`, `GET /{id}`, `POST`, `PUT /{id}`, `DELETE /{id}` | Las mismas, más `PATCH /{id}` |
| Caso de uso | La inyección queda como `TODO` en el `Handler` | Se inyecta en el constructor del `Controller` |
| Paquete | `infrastructure.entrypoints.<nombre>rest` | `infrastructure.entrypoints.<nombre>rest` |

- En reactivo, `<Nombre>Router` es un `@Configuration` que declara las rutas con `RouterFunctions`, y `<Nombre>Handler` es un `@Component` con un método por ruta.
- En imperativo, `<Nombre>ExceptionHandler` es un `@RestControllerAdvice` que convierte las excepciones en respuestas de error.
- Los métodos devuelven respuestas de ejemplo y tienen un `TODO` donde va la llamada al caso de uso.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-validation`, `springdoc-openapi-starter-webmvc-ui` |

De prueba agrega `spring-boot-starter-test`, que el proyecto ya trae.

## Configuración

En reactivo, el adaptador agrega a `application.yml`:

```yaml
spring:
  reactor:
    context-propagation: auto
logging:
  level:
    com.example.orders.infrastructure.entrypoints.orderrest: DEBUG
    reactor.netty: INFO
```

En imperativo:

```yaml
spring:
  web:
    resources:
      add-mappings: true
logging:
  level:
    com.example.orders.infrastructure.entrypoints.orderrest: DEBUG
    org.springframework.web.servlet: INFO
```

La plantilla también trae `server.port`, la exposición de Actuator y el nivel de `org.springframework.web`. El proyecto ya los define, así que conservan sus valores: puerto `8080` y Actuator con `health,info,prometheus`.

## Antes de producción

- En reactivo, `<Nombre>WebFluxConfig` abre CORS a cualquier origen (`*`) en todas las rutas. Limita los orígenes.
- Cambia las rutas de ejemplo por las de tu API y conecta el caso de uso en cada método.

## Sigue con

- [Adaptadores de entrada](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
