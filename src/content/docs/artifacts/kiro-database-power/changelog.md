---
title: Changelog
description: Cambios de Pragma Database Manager, los más nuevos arriba.
sidebar:
  order: 99
---

El power todavía no publica versiones. Los cambios se registran por fecha, a partir de los PRs del [repositorio](https://github.com/somospragma/pragma-ia-kiro-custom-powers).

## 2026-11-12

- **Instalación desde GitHub, sin clonar.** El power se importa con **Import power from GitHub** y su `mcp.json` arranca el servidor con `npx -y github:somospragma/pragma-ia-kiro-custom-powers`. Antes había que clonar el repositorio, correr `npm install` y poner una ruta absoluta en `mcp.json`.
- **`package.json` del servidor en la raíz del repositorio,** para que `npx` lo pueda ejecutar desde GitHub.
- **Dependencias al día.** `@modelcontextprotocol/sdk` 1.32, `pg` 8.23, `mysql2` 3.24, `oracledb` 6.10 y `zod` 4.6. `pnpm audit` pasa de 73 vulnerabilidades a ninguna.
- **Escaneo de seguridad** en cada PR y cada semana: gitleaks, CodeQL, zizmor, `pnpm audit` y dependency review, más Dependabot.
- **Documentación corregida.** El README, `POWER.md` y las guías de `steering/` tenían rutas que no existían. El servidor en `mcp.json` ahora se llama `database-server`.
- Licencia Apache-2.0 y CODEOWNERS con el Backend Chapter.

## 2026-01-20

- Primera versión del power, con su servidor MCP para PostgreSQL, MySQL y Oracle y sus 8 herramientas.
