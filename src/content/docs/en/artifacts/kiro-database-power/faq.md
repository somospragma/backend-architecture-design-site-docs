---
title: FAQ
description: Common questions when installing and using Pragma Database Manager.
sidebar:
  order: 90
---

## Do I need to clone the repository?

No. You install it with **Add Custom Power** → **Import power from GitHub** and the URL of the power's folder. `npx` downloads the MCP server from GitHub. You only need to clone the repository if you're going to change the power or the server.

## Can it change my data?

The server rejects any query that doesn't start with `SELECT` or `WITH` or that contains words such as `INSERT`, `UPDATE`, `DELETE` or `DROP`. But it's a filter on the text, not a read-only transaction: a database function that writes data and is called from a `SELECT` would pass the filter. That's why the only real protection is connecting with a database user that can only read.

## Where do my passwords end up?

In plain text, inside `DB_CONNECTIONS` in `~/.kiro/settings/mcp.json`, on your machine. Don't push them to any repository, and use read-only users with their own passwords, not an application's.

## I updated the power and my connections disappeared

That's expected. When updating, Kiro deletes the server entry in `~/.kiro/settings/mcp.json` and recreates it from the power's `mcp.json`, which ships an empty `DB_CONNECTIONS`. Save a copy of the value before updating and paste it back afterwards. See [Before you update the power](../guides/connections/#before-you-update-the-power).

## I asked for a CSV export and I don't see the file

The server doesn't write files: it returns the CSV content to the agent, and the agent saves it. Ask it to save it where you want: `Save that CSV to exports/orders.csv`.

## Why does my query fail with `syntax error at or near "LIMIT"`?

You ended the query with `;`. In PostgreSQL and MySQL the server appends `LIMIT <n>` at the end, so it lands after the semicolon. Remove the `;`.

## Why does it reject a `SELECT` that only reads?

Because it contains one of the blocked words as a whole word, even inside a string or a comment. For example `WHERE action = 'DELETE'`. Change the filter, for example to `WHERE action LIKE 'DELET%'`, or run the query from another tool.

## Does it work with MariaDB?

Yes. Set it up as a `mysql` connection. The `mysql2` driver supports MySQL 5.7 or later and MariaDB 10.2 or later.

## Do I need Oracle Instant Client?

No. The server uses `oracledb` 6, which connects in thin mode without Oracle libraries installed.

## Why don't Oracle results include the column names?

The server uses the `oracledb` default format, which returns each row as a list of values. It's a known limitation: the `visualize_schema_relationships` diagram doesn't come out right in Oracle either. Use `get_table_relationships` table by table.

## How long does it take to start?

The first time, a few seconds, while `npx` downloads the server and its dependencies. After that it uses the npm cache and starts faster.

## Does it work with a database that's only on the VPN?

Yes, if your machine can reach it. The server runs on your machine, on your network.
