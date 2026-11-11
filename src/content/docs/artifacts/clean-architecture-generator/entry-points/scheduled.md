---
title: Tarea programada
description: El adaptador scheduled de generateInputAdapter, una tarea con @Scheduled que llama a un caso de uso.
sidebar:
  order: 6
---

Ejecuta un caso de uso cada cierto tiempo con `@Scheduled` de Spring. En reactivo, la lógica devuelve un `Mono`; en imperativo, es un método síncrono. Úsalo para trabajos periódicos: limpiezas, sincronizaciones, reportes.

## Cómo generarlo

```bash
./gradlew generateInputAdapter --name=OrderCleanup --type=scheduled --useCase=CreateOrder
```

## Qué genera

| | Reactivo | Imperativo |
|---|---|---|
| Clases | `<Nombre>ScheduledTask`, `config/<Nombre>SchedulingConfig` | Las mismas |
| Paquete | `infrastructure.entrypoints.<nombre>scheduled` | `infrastructure.entrypoints.<nombre>scheduled` |

- `<Nombre>ScheduledTask` recibe el caso de uso en el constructor. La llamada queda como `TODO` en `execute` (en reactivo, en `executeReactive`).
- `execute` lleva `@Scheduled(cron = "${scheduled.<nombre>.cron:0 */5 * * * *}")`. La clase trae comentadas dos alternativas con `fixed-delay` y `fixed-rate`.
- `<Nombre>SchedulingConfig` activa `@EnableScheduling`.

## Dependencias

| Reactivo | Imperativo |
|---|---|
| `spring-boot-starter`, `reactor-core` | `spring-boot-starter` |

De prueba agrega `spring-boot-starter-test` y Awaitility y, en reactivo, `reactor-test`.

## Configuración

Con `--name=OrderCleanup`:

```yaml
scheduled:
  ordercleanup:
    cron: 0 */5 * * * *
    enabled: true
```

- `cron` usa el formato de Spring de seis campos (segundo, minuto, hora, día, mes, día de la semana). Por defecto, cada 5 minutos.
- Las plantillas `v1` no leen `enabled`: la tarea corre aunque lo pongas en `false`.

## Sigue con

- [Adaptadores de entrada](../overview/).
- [Cómo generar entidades, casos de uso y adaptadores](../../guides/generate-components/).
