---
title: Configuration
description: The DB_CONNECTIONS format, the power's mcp.json and the fixed connection values.
sidebar:
  order: 2
---

## DB_CONNECTIONS

Environment variable of the MCP server. It's a string holding JSON with one list per engine:

```json
{
  "postgresql": [],
  "mysql": [],
  "oracle": []
}
```

If the variable doesn't exist, the server starts with no connections. If it isn't valid JSON, the server doesn't start.

### Fields per engine

| Field | PostgreSQL | MySQL | Oracle | What it is |
|---|---|---|---|---|
| `name` | Yes | Yes | Yes | The name you use in Kiro. It must be unique across all connections: if it repeats, the last one wins. |
| `host` | Yes | Yes | Yes | Database server. |
| `port` | Yes | Yes | Yes | Port. The usual ones are 5432, 3306 and 1521. It's a number, not a string. |
| `database` | Yes | Yes | — | Database. |
| `serviceName` | — | — | Yes | Service name, for example `FREEPDB1` or `ORCL`. |
| `user` | Yes | Yes | Yes | User. Use a read-only one. |
| `password` | Yes | Yes | Yes | Password. |

The server sets no defaults: always write the `port`. In Oracle, the connection is built as `host:port/serviceName`.

## The power's mcp.json

It's the one the power ships in `powers/pragma-database-power/mcp.json`:

```json
{
  "mcpServers": {
    "database-server": {
      "command": "npx",
      "args": ["-y", "github:somospragma/pragma-ia-kiro-custom-powers"],
      "env": {
        "DB_CONNECTIONS": "{\"postgresql\":[],\"mysql\":[],\"oracle\":[]}"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

When you install the power, Kiro copies this server to `~/.kiro/settings/mcp.json`, under `powers.mcpServers`, as `power-pragma-database-power-database-server`. That's where you change `DB_CONNECTIONS`.

`npx -y github:somospragma/pragma-ia-kiro-custom-powers` downloads the repository's `main` branch, installs the dependencies from the root `package.json` and runs `servers/database-mcp-server/index.js`. The first time takes a few seconds; after that `npx` uses its cache.

## Fixed connection values

They can't be changed from the configuration.

| | PostgreSQL | MySQL | Oracle |
|---|---|---|---|
| Driver | `pg` | `mysql2` | `oracledb` (thin mode) |
| Connections per pool | 5 | 5 | 1 to 5 |
| Connect timeout | 10 s | 10 s | The driver's |
| Query timeout | None | None | None |

Each connection opens its pool the first time you use it.

## Requirements

- Node.js 18 or later.
- Access to github.com so `npx` can download the server.
- Network access from your machine to each database.
- Oracle doesn't need Oracle Instant Client: `oracledb` 6 connects in thin mode.
