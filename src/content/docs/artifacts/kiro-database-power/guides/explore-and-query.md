---
title: Cómo explorar y consultar una base
description: Recorre schemas y tablas, y escribe consultas que el servidor acepte.
sidebar:
  order: 2
---

Al terminar sabrás recorrer una base que no conoces y qué consultas acepta el servidor, con sus límites.

Los ejemplos usan una conexión `pg-local` a una base PostgreSQL con un schema `shop` y las tablas `customers`, `products`, `orders` y `order_items`.

## Recorre la base

Empieza de lo general a lo particular:

```text
Muestra los schemas de pg-local
```

```json
[{ "schema_name": "public" }, { "schema_name": "shop" }]
```

```text
Describe la tabla orders del schema shop en pg-local
```

```json
[
  { "column_name": "id", "data_type": "integer", "character_maximum_length": null, "is_nullable": "NO", "column_default": "nextval('shop.orders_id_seq'::regclass)" },
  { "column_name": "customer_id", "data_type": "integer", "character_maximum_length": null, "is_nullable": "NO", "column_default": null },
  { "column_name": "status", "data_type": "character varying", "character_maximum_length": 20, "is_nullable": "NO", "column_default": null },
  { "column_name": "created_at", "data_type": "timestamp with time zone", "character_maximum_length": null, "is_nullable": "NO", "column_default": "now()" }
]
```

Qué es un "schema" depende del motor:

| Motor | `list_schemas` devuelve | El parámetro `schema` es |
|---|---|---|
| PostgreSQL | Los schemas de la base, sin `pg_catalog`, `information_schema` ni `pg_toast`. | El schema, por ejemplo `public` o `shop`. |
| MySQL | Las bases del servidor, sin las del sistema. | El nombre de la base, por ejemplo `my_app`. |
| Oracle | Todos los usuarios de la base (`all_users`), incluidos los del sistema. | El dueño de las tablas. Se convierte a mayúsculas. |

## Consulta

Pregunta lo que necesitas y el agente escribe el `SELECT`:

```text
Muestra los pedidos con el nombre del cliente en pg-local
```

```json
{
  "rowCount": 3,
  "rows": [
    { "id": 1, "customer": "Ana Gómez", "status": "PAID" },
    { "id": 2, "customer": "Luis Pérez", "status": "PENDING" },
    { "id": 3, "customer": "Ana Gómez", "status": "SHIPPED" }
  ]
}
```

También puedes darle la consulta exacta, incluidas las que usan `WITH`:

```text
Ejecuta en pg-local, con límite 2: WITH totals AS (SELECT oi.order_id, SUM(oi.quantity * p.price) AS total FROM shop.order_items oi JOIN shop.products p ON p.id = oi.product_id GROUP BY oi.order_id) SELECT * FROM totals ORDER BY order_id
```

```json
{
  "rowCount": 2,
  "rows": [
    { "order_id": 1, "total": "210000.00" },
    { "order_id": 2, "total": "890000.00" }
  ]
}
```

En PostgreSQL, las columnas `numeric` llegan como texto (`"210000.00"`) para no perder precisión.

## Qué consultas acepta

El servidor revisa el texto de la consulta antes de ejecutarla:

1. Debe empezar por `SELECT` o `WITH`, sin importar mayúsculas.
2. No puede contener, como palabra suelta, `DROP`, `DELETE`, `INSERT`, `UPDATE`, `ALTER`, `CREATE`, `TRUNCATE`, `GRANT`, `REVOKE`, `EXEC` ni `EXECUTE`. Se revisa todo el texto, incluidos los strings y los comentarios.

Si la consulta no pasa, el agente recibe:

```text
Error: Solo se permiten queries SELECT o WITH. Queries de modificación (INSERT, UPDATE, DELETE, DROP, etc.) están bloqueadas por seguridad.
```

Como es un filtro de palabras, también rechaza consultas que solo leen, por ejemplo `SELECT * FROM audit WHERE action = 'DELETE'`. Las palabras que contienen otra, como `deleted_at` o `updated_by`, sí pasan.

## Límite de filas

| Herramienta | Por defecto | Máximo |
|---|---|---|
| `execute_query` | 100 | 1000 |
| `export_query_csv` | 1000 | 10 000 |

En PostgreSQL y MySQL, el servidor agrega `LIMIT <n>` al final de la consulta. Ten en cuenta dos cosas:

- **No termines la consulta en `;`.** El servidor agregaría el `LIMIT` después del punto y coma y la base respondería `Error: syntax error at or near "LIMIT"`.
- **Si la consulta ya tiene la palabra `LIMIT`,** en cualquier parte, el servidor no agrega el suyo y respeta el que escribiste, aunque supere el máximo.

En Oracle no se toca la consulta: el driver deja de leer al llegar al límite.

## Errores frecuentes

| Mensaje | Qué pasó |
|---|---|
| `Error: Connection 'pg-local' not found` | No hay una conexión con ese nombre. Pide `Lista las conexiones de base de datos disponibles`. |
| `Error: syntax error at or near "LIMIT"` | La consulta termina en `;`. Quítalo. |
| `Error: Solo se permiten queries SELECT o WITH…` | La consulta no empieza por `SELECT`/`WITH` o tiene una palabra bloqueada. |
| `Error: connect ECONNREFUSED…` o un timeout | La base no responde en ese host y puerto. El servidor espera 10 segundos para conectarse. |
