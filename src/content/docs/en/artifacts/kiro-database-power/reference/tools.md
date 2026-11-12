---
title: Tools
description: The 8 tools of the MCP server, with their parameters and what they return.
sidebar:
  order: 1
---

The MCP server is called `database-server` and exposes these tools. The agent picks them on its own based on what you ask. They all answer with text: JSON indented with 2 spaces, except the CSV and the diagram.

If something fails, the answer is `Error: <message>` and it's flagged as an error. The server's messages are in Spanish.

## list_connections

Lists the connections configured in `DB_CONNECTIONS`. It doesn't open any connection.

| Parameter | Type | Required |
|---|---|---|
| — | — | — |

Returns `name`, `type` (`postgresql`, `mysql` or `oracle`), `host` and `database`. In Oracle, `database` is the `serviceName`. It doesn't return users or passwords.

## list_schemas

| Parameter | Type | Required |
|---|---|---|
| `connectionName` | string | Yes |

Returns a list of `schema_name`.

| Engine | Source | Excludes |
|---|---|---|
| PostgreSQL | `information_schema.schemata` | `pg_catalog`, `information_schema`, `pg_toast` |
| MySQL | `information_schema.schemata` | `mysql`, `information_schema`, `performance_schema`, `sys` |
| Oracle | `all_users` | Nothing |

## list_tables

| Parameter | Type | Required |
|---|---|---|
| `connectionName` | string | Yes |
| `schema` | string | Yes |

Returns `table_name` and `table_type` (`BASE TABLE` or `VIEW`). In Oracle it only lists tables from `all_tables`, always as `BASE TABLE`, and the schema is converted to uppercase.

## describe_table

| Parameter | Type | Required |
|---|---|---|
| `connectionName` | string | Yes |
| `schema` | string | Yes |
| `table` | string | Yes |

Returns, per column and in order: `column_name`, `data_type`, `character_maximum_length`, `is_nullable` and `column_default`. In Oracle it comes from `all_tab_columns`, with `is_nullable` as `Y`/`N`, and the schema and table are converted to uppercase.

## execute_query

| Parameter | Type | Required | Default |
|---|---|---|---|
| `connectionName` | string | Yes | |
| `query` | string | Yes | |
| `limit` | number | No | `100` (max `1000`) |

Runs a query that starts with `SELECT` or `WITH`. Returns `{ "rowCount": n, "rows": [...] }`.

The validation and limit rules are in [Explore and query](../../guides/explore-and-query/#which-queries-it-accepts).

## export_query_csv

| Parameter | Type | Required | Default |
|---|---|---|---|
| `connectionName` | string | Yes | |
| `query` | string | Yes | |
| `filename` | string | Yes | |
| `limit` | number | No | `1000` (max `10000`) |

Runs the query with the same rules as `execute_query` and returns:

```text
Exportados <n> registros a <filename>

Contenido CSV:
<csv>
```

It doesn't write any file: the agent saves the content. The format is in [Export to CSV](../../guides/export-and-relationships/#export-to-csv).

## get_table_relationships

| Parameter | Type | Required |
|---|---|---|
| `connectionName` | string | Yes |
| `schema` | string | Yes |
| `table` | string | Yes |

Returns the foreign keys going out of the table: `constraint_name`, `column_name`, `foreign_table_schema`, `foreign_table_name` and `foreign_column_name`.

## visualize_schema_relationships

| Parameter | Type | Required |
|---|---|---|
| `connectionName` | string | Yes |
| `schema` | string | Yes |

Returns a text diagram with one block per table that has foreign keys:

```text
┌─ <table>
│  └─ <column> ──→ <target_table>.<target_column>
│
```

## Differences by engine

- **MySQL** returns the metadata column names in uppercase: `SCHEMA_NAME`, `TABLE_NAME`, `TABLE_TYPE`.
- **Oracle** returns each row as a list of values, without the column names, because the server uses the `oracledb` driver's default format. That's why, in Oracle, `visualize_schema_relationships` can't build the diagram with the table names; use `get_table_relationships` per table.
