---
title: How to explore and query a database
description: Walk through schemas and tables, and write queries the server accepts.
sidebar:
  order: 2
---

By the end you'll know how to walk through a database you don't know and which queries the server accepts, with its limits.

The examples use a `pg-local` connection to a PostgreSQL database with a `shop` schema and the `customers`, `products`, `orders` and `order_items` tables.

## Walk through the database

Go from general to specific:

```text
Show the schemas in pg-local
```

```json
[{ "schema_name": "public" }, { "schema_name": "shop" }]
```

```text
Describe the orders table in the shop schema in pg-local
```

```json
[
  { "column_name": "id", "data_type": "integer", "character_maximum_length": null, "is_nullable": "NO", "column_default": "nextval('shop.orders_id_seq'::regclass)" },
  { "column_name": "customer_id", "data_type": "integer", "character_maximum_length": null, "is_nullable": "NO", "column_default": null },
  { "column_name": "status", "data_type": "character varying", "character_maximum_length": 20, "is_nullable": "NO", "column_default": null },
  { "column_name": "created_at", "data_type": "timestamp with time zone", "character_maximum_length": null, "is_nullable": "NO", "column_default": "now()" }
]
```

What a "schema" is depends on the engine:

| Engine | `list_schemas` returns | The `schema` parameter is |
|---|---|---|
| PostgreSQL | The database schemas, without `pg_catalog`, `information_schema` or `pg_toast`. | The schema, for example `public` or `shop`. |
| MySQL | The server's databases, without the system ones. | The database name, for example `my_app`. |
| Oracle | Every database user (`all_users`), system ones included. | The owner of the tables. It's converted to uppercase. |

## Query

Ask for what you need and the agent writes the `SELECT`:

```text
Show the orders with the customer name in pg-local
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

You can also give it the exact query, including ones that use `WITH`:

```text
Run in pg-local, with limit 2: WITH totals AS (SELECT oi.order_id, SUM(oi.quantity * p.price) AS total FROM shop.order_items oi JOIN shop.products p ON p.id = oi.product_id GROUP BY oi.order_id) SELECT * FROM totals ORDER BY order_id
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

In PostgreSQL, `numeric` columns come back as text (`"210000.00"`) so no precision is lost.

## Which queries it accepts

The server checks the query text before running it:

1. It must start with `SELECT` or `WITH`, in any case.
2. It can't contain, as a whole word, `DROP`, `DELETE`, `INSERT`, `UPDATE`, `ALTER`, `CREATE`, `TRUNCATE`, `GRANT`, `REVOKE`, `EXEC` or `EXECUTE`. The whole text is checked, strings and comments included.

If the query doesn't pass, the agent gets:

```text
Error: Solo se permiten queries SELECT o WITH. Queries de modificación (INSERT, UPDATE, DELETE, DROP, etc.) están bloqueadas por seguridad.
```

The server's messages are in Spanish. Because it's a word filter, it also rejects queries that only read, for example `SELECT * FROM audit WHERE action = 'DELETE'`. Words that contain another, such as `deleted_at` or `updated_by`, do pass.

## Row limit

| Tool | Default | Maximum |
|---|---|---|
| `execute_query` | 100 | 1,000 |
| `export_query_csv` | 1,000 | 10,000 |

In PostgreSQL and MySQL, the server appends `LIMIT <n>` to the query. Keep two things in mind:

- **Don't end the query with `;`.** The server would append the `LIMIT` after the semicolon and the database would answer `Error: syntax error at or near "LIMIT"`.
- **If the query already contains the word `LIMIT`,** anywhere, the server doesn't add its own and keeps yours, even above the maximum.

In Oracle the query isn't changed: the driver stops reading when it reaches the limit.

## Common errors

| Message | What happened |
|---|---|
| `Error: Connection 'pg-local' not found` | There's no connection with that name. Ask `List the available database connections`. |
| `Error: syntax error at or near "LIMIT"` | The query ends with `;`. Remove it. |
| `Error: Solo se permiten queries SELECT o WITH…` | The query doesn't start with `SELECT`/`WITH` or has a blocked word. |
| `Error: connect ECONNREFUSED…` or a timeout | The database doesn't answer on that host and port. The server waits 10 seconds to connect. |
