---
title: DynamoDB
description: El adaptador dynamodb de generateOutputAdapter, con el cliente de DynamoDB del AWS SDK v2.
sidebar:
  order: 6
---

Lee y escribe ítems en Amazon DynamoDB con el AWS SDK v2: `DynamoDbAsyncClient` en reactivo y `DynamoDbClient` en imperativo. Úsalo para datos que consultas por clave en AWS.

## Cómo generarlo

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=dynamodb
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>DynamoDbAdapter`, `config/<Nombre>DynamoDbConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` | Las mismas |
| Paquete | `infrastructure.drivenadapters.<nombre>dynamodb` | `infrastructure.drivenadapters.<nombre>dynamodb` |

- El adaptador trae `putItem`, `getItem`, `updateItem`, `deleteItem`, `scan` y `query`, sobre `Map<String, AttributeValue>`.
- La tabla está fija en el adaptador como `<nombre>_table`. Cámbiala por la tuya.
- `<Nombre>DynamoDbConfig` crea el cliente con la región. Solo usa `access-key` y `secret-key` si pones las dos, y solo cambia el endpoint si `endpoint` tiene valor.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| AWS SDK v2 `dynamodb` | AWS SDK v2 `dynamodb` |

De prueba agrega Testcontainers (`localstack` y `junit-jupiter`) y, en reactivo, `reactor-test`.

## Configuración

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

- Para desarrollo local, apunta `endpoint` a LocalStack o DynamoDB Local (por ejemplo, `http://localhost:4566`).
- En AWS, deja las llaves vacías y usa el rol de la aplicación. No guardes llaves en `application.yml`.

## Sigue con

- [Adaptadores de salida](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
