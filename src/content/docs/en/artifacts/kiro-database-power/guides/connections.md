---
title: How to set up connections
description: Add PostgreSQL, MySQL and Oracle connections, and keep them when you update the power.
sidebar:
  order: 1
---

By the end you'll have one or more connections set up, you'll know where they're stored and how not to lose them when you update the power.

## Where they're stored

Connections live in the `DB_CONNECTIONS` variable of the `power-pragma-database-power-database-server` server. Kiro registers that server in `~/.kiro/settings/mcp.json`, under `powers.mcpServers`:

```json
{
  "powers": {
    "mcpServers": {
      "power-pragma-database-power-database-server": {
        "command": "npx",
        "args": ["-y", "github:somospragma/pragma-ia-kiro-custom-powers"],
        "env": {
          "DB_CONNECTIONS": "{\"postgresql\":[],\"mysql\":[],\"oracle\":[]}"
        }
      }
    }
  }
}
```

`DB_CONNECTIONS` is a **string** that holds JSON, which is why the quotes are escaped. It has one list per engine, and each list can hold several connections.

## Ask the agent

The simplest way is to ask Kiro in natural language. The power ships a guide that tells the agent how to build and escape the JSON:

```text
Set up a PostgreSQL connection called pg-local on localhost:5432, database my_app, user readonly, password dev-only
```

```text
Add a MySQL connection called mysql-local on localhost:3306, database my_app, user readonly, password dev-only
```

```text
Add an Oracle connection called oracle-dev on db-dev.example.com:1521, service FREEPDB1, user readonly, password dev-only
```

The agent reads the current configuration, adds the new connection without removing the others and saves the escaped string.

## Edit it by hand

If you'd rather do it yourself, write the readable JSON first:

```json
{
  "postgresql": [
    {
      "name": "pg-local",
      "host": "localhost",
      "port": 5432,
      "database": "my_app",
      "user": "readonly",
      "password": "dev-only"
    }
  ],
  "mysql": [],
  "oracle": [
    {
      "name": "oracle-dev",
      "host": "db-dev.example.com",
      "port": 1521,
      "serviceName": "FREEPDB1",
      "user": "readonly",
      "password": "dev-only"
    }
  ]
}
```

Then turn it into a single line with escaped quotes, for example with `node`:

```bash
node -e 'console.log(JSON.stringify(JSON.stringify(require("./connections.json"))))'
```

Paste the output, with its outer quotes, as the value of `DB_CONNECTIONS`.

The fields for each engine are in the [configuration reference](../../reference/configuration/).

## Use a read-only user

The server only lets through queries that start with `SELECT` or `WITH`, but it's a text filter, not a read-only transaction. Create a user that can only read and use it in every connection. For example, in PostgreSQL:

```sql
CREATE ROLE readonly LOGIN PASSWORD 'change-me';
GRANT CONNECT ON DATABASE my_app TO readonly;
GRANT USAGE ON SCHEMA shop TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA shop TO readonly;
```

## Before you update the power

When you update the power (**Check for updates** → **Install updates**), Kiro deletes the `power-pragma-database-power-*` entry from `~/.kiro/settings/mcp.json` and recreates it from the power's `mcp.json`. `DB_CONNECTIONS` is empty again.

Before updating, copy the value of `DB_CONNECTIONS`. After updating, paste it back or ask the agent to set up the connections again.

## Check the configuration

```text
List the available database connections
```

The answer shows the name, engine, host and database of each connection, without users or passwords. If a connection is missing, check that the JSON is valid: if `DB_CONNECTIONS` can't be parsed, the server doesn't start.
