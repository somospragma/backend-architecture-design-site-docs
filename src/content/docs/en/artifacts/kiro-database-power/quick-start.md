---
title: Quick start
description: Install the power from GitHub, set up a connection and run your first query.
sidebar:
  order: 2
---

In a few minutes you'll have the power installed in Kiro, a PostgreSQL connection set up and your first query answered.

## Before you start

- [Kiro](https://kiro.dev) installed.
- Node.js 18 or later. Check it with `node --version`.
- Access to github.com from your machine.
- A PostgreSQL, MySQL or Oracle database you can reach from your machine, and a **read-only** user.

## 1. Install the power

1. In Kiro, open the **Powers** panel.
2. Choose **Add Custom Power** → **Import power from GitHub**.
3. Paste this URL and confirm:

   ```text
   https://github.com/somospragma/pragma-ia-kiro-custom-powers/tree/main/powers/pragma-database-power
   ```

Kiro shows `Power "pragma-database-power" installed successfully.`

## 2. Check that the server is running

Open the **MCP Servers** panel. You should see `power-pragma-database-power-database-server`.

The first time, `npx` downloads the server from GitHub and installs its dependencies, so it can take a few seconds to connect. If it stays in error, check your Node.js version and your access to github.com.

## 3. Set up a connection

Ask the agent to set it up for you:

```text
Set up a PostgreSQL connection called pg-local on localhost:5432, database my_app, user readonly, password dev-only
```

The agent builds the JSON and saves it in the server's `DB_CONNECTIONS`, in `~/.kiro/settings/mcp.json`. Kiro reconnects the server when it detects the change. If it doesn't, reconnect it from the **MCP Servers** panel.

Check that it worked:

```text
List the available database connections
```

```json
[
  {
    "name": "pg-local",
    "type": "postgresql",
    "host": "localhost",
    "database": "my_app"
  }
]
```

## 4. Run your first query

```text
List the tables in the shop schema in pg-local
```

```json
[
  { "table_name": "customers", "table_type": "BASE TABLE" },
  { "table_name": "order_items", "table_type": "BASE TABLE" },
  { "table_name": "orders", "table_type": "BASE TABLE" },
  { "table_name": "products", "table_type": "BASE TABLE" }
]
```

```text
Show the orders with the customer name in pg-local
```

The agent writes the `SELECT` with the `JOIN`, runs it and shows you the rows.

## Next steps

- [Set up connections](../guides/connections/): several databases, MySQL and Oracle, and what happens when you update the power.
- [Explore and query](../guides/explore-and-query/): which queries the server accepts and its limits.
- [Export to CSV and see relationships](../guides/export-and-relationships/).
