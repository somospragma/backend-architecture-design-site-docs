---
title: Adaptadores de entrada
description: Los entry points que genera generateInputAdapter, qué tienen en común y cuál usar.
sidebar:
  label: Resumen
  order: 1
---

Un adaptador de entrada recibe una petición, un mensaje o un disparo de reloj y llama a un caso de uso. Lo generas con:

```bash
./gradlew generateInputAdapter --name=<Nombre> --type=<tipo> --useCase=<CasoDeUso>
```

En estas páginas, `<Nombre>` es el valor de `--name`, tal cual lo escribes, y `<nombre>` es ese valor en minúsculas.

## Resumen

| `--type` | Reactivo | Imperativo | Página |
|---|---|---|---|
| `rest` | Spring WebFlux funcional: `Router` y `Handler` | Spring MVC: `@RestController` | [REST](../rest/) |
| `graphql` | Spring for GraphQL sobre WebFlux | Spring for GraphQL sobre Spring MVC | [GraphQL](../graphql/) |
| `grpc` | gRPC con stubs de Reactor (`reactor-grpc`) | gRPC con stubs bloqueantes | [gRPC](../grpc/) |
| `sqs-consumer` | Spring Cloud AWS SQS (`@SqsListener`) | Spring Cloud AWS SQS (`@SqsListener`) | [Consumidor de SQS](../sqs-consumer/) |
| `scheduled` | `@Scheduled` con Reactor | `@Scheduled` | [Tarea programada](../scheduled/) |

## Qué tienen todos

- **El paquete.** `infrastructure.entrypoints.<nombre><tipo>`, con el tipo sin guiones. Con `--name=Order --type=sqs-consumer` queda `infrastructure.entrypoints.ordersqsconsumer`.
- **La carpeta.** En `hexagonal-single`, `onion-single` y `hexagonal-multi`, el paquete va dentro del código de infraestructura. En `hexagonal-multi-granular`, cada adaptador es un módulo propio en `infrastructure/entry-points/<nombre>`.
- **Las clases.** Se llaman `<Nombre>` más el nombre de la plantilla: `<Nombre>Handler`, `<Nombre>GraphQLController`. Las de configuración van en `config/`.
- **`--useCase`.** Pásala siempre. Sin ella, la generación falla con `useCaseType` nulo. Solo `rest` en imperativo y `scheduled` reciben el caso de uso en el constructor; en los demás lo inyectas tú.
- **Las propiedades.** Cada adaptador agrega las suyas a `application.yml`. Si una clave ya existe, se conserva el valor del proyecto.

## Pruebas

Las plantillas `v1` no generan clases de prueba para los adaptadores; escríbelas tú. Sí agregan las dependencias de prueba de cada tecnología. Cada página dice cuáles.

## Sigue con

- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/), con el orden de trabajo.
- [Adaptadores de salida](../../driven-adapters/overview/).
