---
title: Changelog
description: Pragma Database Manager changes, newest first.
sidebar:
  order: 99
---

The power doesn't publish versions yet. Changes are recorded by date, from the [repository](https://github.com/somospragma/pragma-ia-kiro-custom-powers) PRs.

## 2026-11-12

- **Install from GitHub, without cloning.** The power is imported with **Import power from GitHub** and its `mcp.json` starts the server with `npx -y github:somospragma/pragma-ia-kiro-custom-powers`. Before, you had to clone the repository, run `npm install` and put an absolute path in `mcp.json`.
- **The server's `package.json` moved to the repository root,** so `npx` can run it from GitHub.
- **Up-to-date dependencies.** `@modelcontextprotocol/sdk` 1.32, `pg` 8.23, `mysql2` 3.24, `oracledb` 6.10 and `zod` 4.6. `pnpm audit` goes from 73 vulnerabilities to none.
- **Security scanning** on every PR and every week: gitleaks, CodeQL, zizmor, `pnpm audit` and dependency review, plus Dependabot.
- **Fixed documentation.** The README, `POWER.md` and the `steering/` guides had paths that didn't exist. The server in `mcp.json` is now called `database-server`.
- Apache-2.0 license and CODEOWNERS with the Backend Chapter.

## 2026-01-20

- First version of the power, with its MCP server for PostgreSQL, MySQL and Oracle and its 8 tools.
