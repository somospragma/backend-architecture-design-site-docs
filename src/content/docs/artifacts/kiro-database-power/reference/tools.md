---
title: Herramientas
description: Las 8 herramientas del servidor MCP, con sus parámetros y lo que devuelven.
sidebar:
  order: 1
---

El servidor MCP se llama `database-server` y expone estas herramientas. El agente las elige solo según lo que le preguntes. Todas responden texto: JSON con 2 espacios de indentación, salvo el CSV y el diagrama.

Si algo falla, la respuesta es `Error: <mensaje>` y viene marcada como error.

## list_connections

Lista las conexiones configuradas en `DB_CONNECTIONS`. No abre ninguna conexión.

| Parámetro | Tipo | Requerido |
|---|---|---|
| — | — | — |

Devuelve `name`, `type` (`postgresql`, `mysql` u `oracle`), `host` y `database`. En Oracle, `database` es el `serviceName`. No devuelve usuarios ni passwords.

## list_schemas

| Parámetro | Tipo | Requerido |
|---|---|---|
| `connectionName` | string | Sí |

Devuelve una lista de `schema_name`.

| Motor | Fuente | Excluye |
|---|---|---|
| PostgreSQL | `information_schema.schemata` | `pg_catalog`, `information_schema`, `pg_toast` |
| MySQL | `information_schema.schemata` | `mysql`, `information_schema`, `performance_schema`, `sys` |
| Oracle | `all_users` | Nada |

## list_tables

| Parámetro | Tipo | Requerido |
|---|---|---|
| `connectionName` | string | Sí |
| `schema` | string | Sí |

Devuelve `table_name` y `table_type` (`BASE TABLE` o `VIEW`). En Oracle solo lista tablas de `all_tables`, siempre como `BASE TABLE`, y el schema se pasa a mayúsculas.

## describe_table

| Parámetro | Tipo | Requerido |
|---|---|---|
| `connectionName` | string | Sí |
| `schema` | string | Sí |
| `table` | string | Sí |

Devuelve, por columna y en orden: `column_name`, `data_type`, `character_maximum_length`, `is_nullable` y `column_default`. En Oracle sale de `all_tab_columns`, con `is_nullable` como `Y`/`N`, y el schema y la tabla se pasan a mayúsculas.

## execute_query

| Parámetro | Tipo | Requerido | Por defecto |
|---|---|---|---|
| `connectionName` | string | Sí | |
| `query` | string | Sí | |
| `limit` | number | No | `100` (máximo `1000`) |

Ejecuta una consulta que empiece por `SELECT` o `WITH`. Devuelve `{ "rowCount": n, "rows": [...] }`.

Las reglas de validación y del límite están en [Explorar y consultar](../../guides/explore-and-query/#qué-consultas-acepta).

## export_query_csv

| Parámetro | Tipo | Requerido | Por defecto |
|---|---|---|---|
| `connectionName` | string | Sí | |
| `query` | string | Sí | |
| `filename` | string | Sí | |
| `limit` | number | No | `1000` (máximo `10000`) |

Ejecuta la consulta con las mismas reglas que `execute_query` y devuelve:

```text
Exportados <n> registros a <filename>

Contenido CSV:
<csv>
```

No escribe ningún archivo: el agente guarda el contenido. El formato está en [Exportar a CSV](../../guides/export-and-relationships/#exportar-a-csv).

## get_table_relationships

| Parámetro | Tipo | Requerido |
|---|---|---|
| `connectionName` | string | Sí |
| `schema` | string | Sí |
| `table` | string | Sí |

Devuelve las foreign keys que salen de la tabla: `constraint_name`, `column_name`, `foreign_table_schema`, `foreign_table_name` y `foreign_column_name`.

## visualize_schema_relationships

| Parámetro | Tipo | Requerido |
|---|---|---|
| `connectionName` | string | Sí |
| `schema` | string | Sí |

Devuelve un diagrama de texto con un bloque por tabla que tiene foreign keys:

```text
┌─ <tabla>
│  └─ <columna> ──→ <tabla_destino>.<columna_destino>
│
```

## Diferencias por motor

- **MySQL** devuelve los nombres de las columnas de metadatos en mayúsculas: `SCHEMA_NAME`, `TABLE_NAME`, `TABLE_TYPE`.
- **Oracle** devuelve cada fila como una lista de valores, sin los nombres de las columnas, porque el servidor usa el formato por defecto del driver `oracledb`. Por eso, en Oracle, `visualize_schema_relationships` no puede armar el diagrama con los nombres de las tablas; usa `get_table_relationships` por tabla.
