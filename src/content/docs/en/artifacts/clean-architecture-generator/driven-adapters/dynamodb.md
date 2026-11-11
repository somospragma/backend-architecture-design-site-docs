---
title: DynamoDB
description: The dynamodb adapter of generateOutputAdapter, with the AWS SDK v2 DynamoDB client.
sidebar:
  order: 6
---

Reads and writes items in Amazon DynamoDB with the AWS SDK v2: `DynamoDbAsyncClient` in reactive and `DynamoDbClient` in imperative. Use it for data you query by key on AWS.

## How to generate it

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=dynamodb
```

## What it generates

| | Reactive | Imperative |
|---|---|---|
| Classes | `<Name>DynamoDbAdapter`, `config/<Name>DynamoDbConfig`, `entity/<Entity>Entity`, `mapper/<Entity>EntityMapper` | The same |
| Package | `infrastructure.drivenadapters.<name>dynamodb` | `infrastructure.drivenadapters.<name>dynamodb` |

- The adapter comes with `putItem`, `getItem`, `updateItem`, `deleteItem`, `scan` and `query`, on `Map<String, AttributeValue>`.
- The table is hard-coded in the adapter as `<name>_table`. Change it to yours.
- `<Name>DynamoDbConfig` creates the client with the region. It only uses `access-key` and `secret-key` if you set both, and only overrides the endpoint if `endpoint` has a value.

## Dependencies

| Reactive | Imperative |
|---|---|
| AWS SDK v2 `dynamodb` | AWS SDK v2 `dynamodb` |

For tests it adds Testcontainers (`localstack` and `junit-jupiter`) and, in reactive, `reactor-test`.

## Configuration

```yaml
aws:
  dynamodb:
    region: us-east-1
    endpoint: null
    access-key: null
    secret-key: null
logging:
  level:
    software.amazon.awssdk.services.dynamodb: DEBUG
```

- For local development, point `endpoint` to LocalStack or DynamoDB Local (for example, `http://localhost:4566`).
- On AWS, leave the keys empty and use the application's role. Don't store keys in `application.yml`.

## Next

- [Driven adapters](../overview/).
- [How to generate entities, use cases and adapters](../../guides/generate-components/).
