---
title: Consumidor de SQS
description: El adaptador sqs-consumer de generateInputAdapter, con Spring Cloud AWS SQS en los dos paradigmas.
sidebar:
  order: 5
---

Lee mensajes de una cola de Amazon SQS con `@SqsListener` de Spring Cloud AWS. En reactivo procesa cada mensaje con un `Mono`; en imperativo, de forma síncrona. Úsalo cuando otro servicio te avisa de algo de forma asíncrona.

## Cómo generarlo

```bash
./gradlew generateInputAdapter --name=OrderEvents --type=sqs-consumer --useCase=CreateOrder
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>SqsConsumer`, `config/<Nombre>SqsConsumerConfig` | `<Nombre>Consumer`, `config/<Nombre>SqsConsumerConfig` |
| Paquete | `infrastructure.entrypoints.<nombre>sqsconsumer` | `infrastructure.entrypoints.<nombre>sqsconsumer` |

- El consumidor lee la cola de `aws.sqs.consumer.queue-name`. Tu lógica va en `processMessage`.
- No recibe el caso de uso: inyéctalo tú y llámalo desde `processMessage`.
- `<Nombre>SqsConsumerConfig` crea el `SqsAsyncClient`, la fábrica de listeners con la concurrencia y el tiempo de espera de la configuración, y un `SqsTemplate`.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-cloud-aws-starter-sqs`, AWS SDK v2 `sqs` | Las mismas |

De prueba agrega Testcontainers (`localstack` y `junit-jupiter`) y Awaitility.

## Configuración

Con `--name=OrderEvents`:

```yaml
aws:
  sqs:
    consumer:
      region: us-east-1
      endpoint: null
      queue-name: orderevents-queue
      access-key: null
      secret-key: null
      max-concurrent-messages: 10
      poll-timeout: 10
spring:
  cloud:
    aws:
      sqs:
        enabled: true
logging:
  level:
    io.awspring.cloud.sqs: DEBUG
    software.amazon.awssdk.services.sqs: DEBUG
```

- `queue-name` es `<nombre>-queue`. Cámbialo por el nombre de tu cola.
- Para desarrollo local, apunta `endpoint` a LocalStack (por ejemplo, `http://localhost:4566`).
- Las llaves solo se usan si pones las dos. En AWS, déjalas vacías y usa el rol de la aplicación.

## Antes de producción

La clase trae dos listeners sobre la misma cola: `receiveMessage`, con confirmación automática, y `receiveMessageWithManualAck`, con confirmación manual. Deja solo el que vas a usar.

## Sigue con

- [Adaptadores de entrada](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
