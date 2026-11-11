---
title: SQS producer
description: The sqs-producer adapter of generateOutputAdapter, which publishes messages to Amazon SQS with the AWS SDK v2.
sidebar:
  order: 7
---

Publishes messages to an Amazon SQS queue with the AWS SDK v2: `SqsAsyncClient` in reactive and `SqsClient` in imperative. Use it to notify other services asynchronously. To read the queue, use the [SQS consumer](../../entry-points/sqs-consumer/).

## How to generate it

```bash
./gradlew generateOutputAdapter --name=OrderEvents --entity=Order --type=sqs-producer
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>SqsProducerAdapter`, `config/<Name>SqsConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` | The same |
| Package | `infrastructure.drivenadapters.<name>sqsproducer` | `infrastructure.drivenadapters.<name>sqsproducer` |

- The adapter comes with `sendMessage` (with and without attributes), `sendMessageWithDelay`, `sendMessageBatch` and `getQueueUrl`.
- It publishes to the queue in `aws.sqs.queue-url`.
- `<Name>SqsConfig` creates the client with the region. It only uses `access-key` and `secret-key` if you set both, and only overrides the endpoint if `endpoint` has a value.

## Dependencies

| Reactive | Imperative |
|---|---|
| AWS SDK v2 `sqs` | AWS SDK v2 `sqs` |

For tests it adds Testcontainers (`localstack` and `junit-jupiter`) and, in reactive, `reactor-test`.

## Configuration

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

- Set `queue-url` to your queue's URL.
- For local development, point `endpoint` to LocalStack (for example, `http://localhost:4566`).
- On AWS, leave the keys empty and use the application's role. Don't store keys in `application.yml`.

## Next

- [Driven adapters](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
