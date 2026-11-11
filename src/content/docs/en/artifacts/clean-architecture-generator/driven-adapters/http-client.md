---
title: HTTP client
description: The http-client adapter of generateOutputAdapter, with WebClient in reactive and RestClient in imperative.
sidebar:
  order: 5
---

Calls another API over HTTP. In reactive it uses `WebClient`; in imperative, `RestClient`. Use it when your use case needs data or actions from another service.

## How to generate it

```bash
./gradlew generateOutputAdapter --name=Payments --entity=Order --type=http-client
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>HttpClientAdapter`, `config/<Name>WebClientConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` | `<Name>HttpClientAdapter`, `config/<Name>RestTemplateConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` |
| Package | `infrastructure.drivenadapters.<name>httpclient` | `infrastructure.drivenadapters.<name>httpclient` |

- The adapter comes with generic `get`, `getList`, `post`, `put`, `patch` and `delete` methods. In imperative, also `getEntity` and `postEntity`, which return the `ResponseEntity`.
- In reactive, `<Name>WebClientConfig` creates the `WebClient` with `base-url` and applies `timeout` to connect, read and write.
- In imperative, the adapter builds its `RestClient` from Spring Boot's `RestClient.Builder`. `<Name>RestTemplateConfig` creates a `RestTemplate` with `base-url` and `timeout`, but the adapter doesn't use it.

## Dependencies

| Reactive | Imperative |
|---|---|
| `spring-boot-starter-webflux` | `spring-boot-starter-web`, `spring-boot-starter-restclient` |

For tests it adds `mockwebserver` and `reactor-test` in reactive, and `spring-boot-starter-test` in imperative.

## Configuration

With `--name=Payments`:

```yaml
payments:
  http:
    base-url: http://localhost:8080
    timeout: 5000
```

- The root key is `<name>`, so each client has its own.
- `timeout` is in milliseconds.
- The adapter adds `DEBUG` levels for the client: `org.springframework.web.reactive.function.client` and `reactor.netty.http.client` in reactive; `org.springframework.web.client.RestTemplate` and `org.apache.http` in imperative.

## Notes

In imperative, `base-url` and `timeout` don't reach the adapter's `RestClient`. Configure them in the adapter's constructor or use full URLs.

## Next

- [Driven adapters](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
