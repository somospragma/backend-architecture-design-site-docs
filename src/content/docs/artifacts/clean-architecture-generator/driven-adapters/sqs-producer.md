---
title: Productor de SQS
description: El adaptador sqs-producer de generateOutputAdapter, que publica mensajes en Amazon SQS con el AWS SDK v2.
sidebar:
  order: 7
---

Publica mensajes en una cola de Amazon SQS con el AWS SDK v2: `SqsAsyncClient` en reactivo y `SqsClient` en imperativo. Úsalo para avisar a otros servicios de forma asíncrona. Para leer la cola, usa el [consumidor de SQS](../../entry-points/sqs-consumer/).

## Cómo generarlo

```bash
./gradlew generateOutputAdapter --name=OrderEvents --entity=Order --type=sqs-producer
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>SqsProducerAdapter`, `config/<Nombre>SqsConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` | Las mismas |
| Paquete | `infrastructure.drivenadapters.<nombre>sqsproducer` | `infrastructure.drivenadapters.<nombre>sqsproducer` |

- El adaptador trae `sendMessage` (con y sin atributos), `sendMessageWithDelay`, `sendMessageBatch` y `getQueueUrl`.
- Publica en la cola de `aws.sqs.queue-url`.
- `<Nombre>SqsConfig` crea el cliente con la región. Solo usa `access-key` y `secret-key` si pones las dos, y solo cambia el endpoint si `endpoint` tiene valor.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| AWS SDK v2 `sqs` | AWS SDK v2 `sqs` |

De prueba agrega Testcontainers (`localstack` y `junit-jupiter`) y, en reactivo, `reactor-test`.

## Configuración

```yaml
aws:
  sqs:
    region: us-east-1
    endpoint: null
    queue-url: null
    access-key: null
    secret-key: null
logging:
  level:
    software.amazon.awssdk.services.sqs: DEBUG
```

- Pon en `queue-url` la URL de tu cola.
- Para desarrollo local, apunta `endpoint` a LocalStack (por ejemplo, `http://localhost:4566`).
- En AWS, deja las llaves vacías y usa el rol de la aplicación. No guardes llaves en `application.yml`.

## Sigue con

- [Adaptadores de salida](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
