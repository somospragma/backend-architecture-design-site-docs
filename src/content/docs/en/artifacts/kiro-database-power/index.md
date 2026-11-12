---
title: Introduction
description: What Pragma Database Manager is, how it works and when to use it.
sidebar:
  order: 1
---

Pragma Database Manager is a [Kiro](https://kiro.dev) power that connects the agent to your PostgreSQL, MySQL and Oracle databases. You ask in natural language and the agent explores schemas and tables, runs `SELECT` queries, builds a CSV with the results and shows you how the tables relate.

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

## What it solves

- **Ask without leaving the editor.** You ask the agent to check a table or count rows, and it writes and runs the `SELECT`.
- **Understand a data model you don't know.** It lists schemas and tables, describes columns and draws the foreign keys of a schema.
- **Several databases at once.** You configure several connections per engine and pick which one to use in each question.
- **Read only.** The server rejects any query that doesn't start with `SELECT` or `WITH`.

## How it works

The power has two parts:

| Part | Where it lives | What it does |
|---|---|---|
| The power | `powers/pragma-database-power/` in the repository | `POWER.md` and the `steering/` guides teach the agent which tools exist and how to configure connections. |
| The MCP server | `servers/database-mcp-server/` in the repository | Connects to the databases and exposes [8 tools](./reference/tools/). Kiro starts it with `npx` straight from GitHub. |

Kiro installs the power from GitHub and registers the server in `~/.kiro/settings/mcp.json`. Connections go in that server's `DB_CONNECTIONS` variable. You don't need to clone the repository.

## When to use it

- You're developing or debugging and want to query your local or development database from Kiro.
- You join a new project and need to understand its tables and relationships.
- You want a quick CSV from a query to review or share.

## When not to

- **To change data.** It doesn't run `INSERT`, `UPDATE`, `DELETE` or schema changes.
- **Against production with a user that can write.** The block is a text filter on the query, not a read-only transaction. Always use a read-only database user.
- **To extract large volumes.** `execute_query` returns at most 1,000 rows and `export_query_csv` 10,000.
- **With engines other than PostgreSQL, MySQL (or MariaDB) and Oracle.** There's no support for SQL Server, SQLite or NoSQL databases.

## Status

The power is **experimental**: it has no published versions and may change. The code is in [somospragma/pragma-ia-kiro-custom-powers](https://github.com/somospragma/pragma-ia-kiro-custom-powers) under the Apache-2.0 license, and the Backend Chapter maintains it.
