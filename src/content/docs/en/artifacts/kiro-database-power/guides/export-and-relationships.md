---
title: How to export to CSV and see relationships
description: Get a query result as CSV and understand how the tables connect.
sidebar:
  order: 3
---

By the end you'll have a CSV file with a query result and a text diagram with the foreign keys of a schema.

## Export to CSV

```text
Export to customers.csv: SELECT id, name, email FROM shop.customers ORDER BY id, in pg-local
```

The server runs the query and returns the CSV to the agent:

```text
Exportados 3 registros a customers.csv

Contenido CSV:
id,name,email
1,Ana Gómez,ana@example.com
2,Luis Pérez,luis@example.com
3,Marta Ruiz,marta@example.com
```

**The server doesn't write the file.** It returns the content and the name you asked for, and Kiro's agent creates `customers.csv` in your project. If it doesn't, ask it: `Save that CSV to exports/customers.csv`.

How the CSV is built:

- The first row has the column names.
- `,` separator and `\n` line breaks.
- Values with a comma, quotes or line breaks are wrapped in double quotes, and inner quotes are doubled.
- `NULL` becomes an empty field.
- It exports 1,000 rows by default and 10,000 at most. The same query and `LIMIT` rules as in [Explore and query](../explore-and-query/#row-limit) apply.

## A table's relationships

```text
Show the relationships of the order_items table in the shop schema in pg-local
```

```json
[
  {
    "constraint_name": "order_items_order_id_fkey",
    "column_name": "order_id",
    "foreign_table_schema": "shop",
    "foreign_table_name": "orders",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "order_items_product_id_fkey",
    "column_name": "product_id",
    "foreign_table_schema": "shop",
    "foreign_table_name": "products",
    "foreign_column_name": "id"
  }
]
```

It only shows the foreign keys going out of that table, not the ones pointing to it.

## A schema diagram

```text
Visualize the relationships of the shop schema in pg-local
```

```text
Diagrama de relaciones del schema: shop
==================================================

┌─ order_items
│  └─ order_id ──→ orders.id
│  └─ product_id ──→ products.id
│
┌─ orders
│  └─ customer_id ──→ customers.id
│
```

Each block is a table that has foreign keys, with its columns and the table and column they point to. Tables without foreign keys of their own, such as `customers` and `products`, have no block.

For a large model, ask the agent to turn this output into a Mermaid diagram.
