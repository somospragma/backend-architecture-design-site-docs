---
title: Redis
description: El adaptador redis de generateOutputAdapter, con Spring Data Redis y Lettuce.
sidebar:
  order: 2
---

Guarda y lee datos en Redis con Spring Data Redis: `ReactiveRedisTemplate` en reactivo y `RedisTemplate` con Lettuce en imperativo. Los valores se guardan como JSON. Úsalo como caché o para datos de vida corta que lees por clave.

## Cómo generarlo

```bash
./gradlew generateOutputAdapter --name=Order --entity=Order --type=redis
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>Adapter`, `config/<Nombre>RedisConfig`, `entity/<Entidad>Entity`, `mapper/<Entidad>EntityMapper` | Las mismas |
| Paquete | `infrastructure.drivenadapters.<nombre>redis` | `infrastructure.drivenadapters.<nombre>redis` |

- El adaptador trae `save(id, entity)`, `findById`, `findAll`, `deleteById` y `existsById`, sobre `Object`. En imperativo, también `deleteAll`.
- `<Nombre>RedisConfig` crea el template con claves `String` y valores serializados con `JacksonJsonRedisSerializer`.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter-data-redis-reactive`, `spring-boot-starter-jackson` | `spring-boot-starter-data-redis`, `spring-boot-starter-jackson`, `lettuce-core` |

De prueba agrega `embedded-redis`. Como esa librería trae versiones viejas de Guava y commons-io con vulnerabilidades conocidas, el adaptador agrega al `build.gradle.kts` una regla que fuerza versiones más nuevas en todos los módulos.

## Configuración

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password: null
    timeout: 2000ms
    lettuce:
      pool:
        max-active: 8
        max-idle: 8
        min-idle: 0
        max-wait: -1ms
      shutdown-timeout: 100ms
logging:
  level:
    org.springframework.data.redis: DEBUG
```

## Notas

En imperativo, `<Nombre>RedisConfig` crea `new LettuceConnectionFactory()` sin parámetros, que se conecta a `localhost:6379`. Para usar otro host, configúralo en esa clase.

## Sigue con

- [Adaptadores de salida](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
