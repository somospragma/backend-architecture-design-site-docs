---
title: Cliente HTTP
description: El adaptador http-client de generateOutputAdapter, con WebClient en reactivo y RestClient en imperativo.
sidebar:
  order: 5
---

Llama a otra API por HTTP. En reactivo usa `WebClient`; en imperativo, `RestClient`. Úsalo cuando tu caso de uso necesita datos o acciones de otro servicio.

## Cómo generarlo

```bash
./gradlew generateOutputAdapter --name=Payments --entity=Order --type=http-client
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>HttpClientAdapter`, `config/<Nombre>WebClientConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` | `<Nombre>HttpClientAdapter`, `config/<Nombre>RestTemplateConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` |
| Paquete | `infrastructure.drivenadapters.<nombre>httpclient` | `infrastructure.drivenadapters.<nombre>httpclient` |

- El adaptador trae métodos genéricos `get`, `getList`, `post`, `put`, `patch` y `delete`. En imperativo, también `getEntity` y `postEntity`, que devuelven el `ResponseEntity`.
- En reactivo, `<Nombre>WebClientConfig` crea el `WebClient` con `base-url` y aplica `timeout` a la conexión, la lectura y la escritura.
- En imperativo, el adaptador arma su `RestClient` con el `RestClient.Builder` de Spring Boot. `<Nombre>RestTemplateConfig` crea un `RestTemplate` con `base-url` y `timeout`, pero el adaptador no lo usa.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-restclient` |

De prueba agrega `mockwebserver` y `reactor-test` en reactivo, y `spring-boot-starter-test` en imperativo.

## Configuración

Con `--name=Payments`:

```yaml
payments:
  http:
    base-url: http://localhost:8080
    timeout: 5000
```

- La clave raíz es `<nombre>`, así que cada cliente tiene la suya.
- `timeout` va en milisegundos.
- El adaptador agrega niveles `DEBUG` para el cliente: `org.springframework.web.reactive.function.client` y `reactor.netty.http.client` en reactivo; `org.springframework.web.client.RestTemplate` y `org.apache.http` en imperativo.

## Notas

En imperativo, `base-url` y `timeout` no llegan al `RestClient` del adaptador. Configúralos en el constructor del adaptador o usa URLs completas.

## Sigue con

- [Adaptadores de salida](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
