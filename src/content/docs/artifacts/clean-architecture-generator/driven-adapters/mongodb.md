---
title: MongoDB
description: El adaptador mongodb de generateOutputAdapter, con Spring Data MongoDB.
sidebar:
  order: 3
---

Persiste una entidad en MongoDB con Spring Data MongoDB: repositorios reactivos en reactivo y repositorios bloqueantes en imperativo. Úsalo para documentos que guardas y consultas completos.

## Cómo generarlo

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=mongodb
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Adapter`, `<Nombre>Repository`, `config/<Nombre>MongoConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` | Las mismas |
| Repositorio | `ReactiveMongoRepository<<Entidad>Entity, String>` | `MongoRepository<<Entidad>Entity, String>` |
| Paquete | `infrastructure.drivenadapters.<nombre>mongodb` | `infrastructure.drivenadapters.<nombre>mongodb` |

- El adaptador trae `save`, `findById`, `findAll`, `deleteById`, `existsById`, `count` y `deleteAll`, con la entidad del dominio.
- La entidad lleva `@Document`. Para `--entity=Product`, la colección es `products`.
- `<Nombre>MongoConfig` crea el cliente con `spring.data.mongodb.uri` y `spring.data.mongodb.database`, y activa los repositorios del paquete del adaptador.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter-data-mongodb-reactive` | `spring-boot-starter-data-mongodb` |

De prueba agrega MongoDB embebido (`de.flapdoodle.embed.mongo`).

## Configuración

En un proyecto llamado `order-service`:

```yaml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017
      database: order-service
      repositories:
        enabled: true
logging:
  level:
    org.springframework.data.mongodb: DEBUG
    org.mongodb.driver: INFO
```

`database` toma el nombre del proyecto en minúsculas. No guardes credenciales en `uri`: pásalas por variable de entorno.

## Sigue con

- [Adaptadores de salida](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
