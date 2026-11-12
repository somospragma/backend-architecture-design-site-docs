---
title: Inicio rápido
description: Instala el power desde GitHub, configura una conexión y haz tu primera consulta.
sidebar:
  order: 2
---

En unos minutos tendrás el power instalado en Kiro, una conexión a PostgreSQL configurada y tu primera consulta respondida.

## Antes de empezar

- [Kiro](https://kiro.dev) instalado.
- Node.js 18 o superior. Compruébalo con `node --version`.
- Acceso a github.com desde tu máquina.
- Una base de datos PostgreSQL, MySQL u Oracle a la que llegues desde tu máquina, y un usuario de **solo lectura**.

## 1. Instala el power

1. En Kiro, abre el panel **Powers**.
2. Elige **Add Custom Power** → **Import power from GitHub**.
3. Pega esta URL y confirma:

   ```text
   https://github.com/somospragma/pragma-ia-kiro-custom-powers/tree/main/powers/pragma-database-power
   ```

Kiro muestra `Power "pragma-database-power" installed successfully.`

## 2. Revisa que el servidor esté activo

Abre el panel **MCP Servers**. Debe aparecer `power-pragma-database-power-database-server`.

La primera vez, `npx` descarga el servidor desde GitHub e instala sus dependencias, así que puede tardar unos segundos en conectarse. Si se queda en error, revisa la versión de Node.js y tu acceso a github.com.

## 3. Configura una conexión

Pídele al agente que la configure por ti:

```text
Configura una conexión PostgreSQL llamada pg-local en localhost:5432, database my_app, usuario readonly, password dev-only
```

El agente arma el JSON y lo guarda en `DB_CONNECTIONS` del servidor, en `~/.kiro/settings/mcp.json`. Kiro vuelve a conectar el servidor cuando detecta el cambio. Si no lo hace, reconéctalo desde el panel **MCP Servers**.

Comprueba que quedó:

```text
Lista las conexiones de base de datos disponibles
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

## 4. Haz tu primera consulta

```text
Lista las tablas del schema shop en pg-local
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
Muestra los pedidos con el nombre del cliente en pg-local
```

El agente escribe el `SELECT` con el `JOIN`, lo ejecuta y te muestra las filas.

## Siguientes pasos

- [Configurar conexiones](../guides/connections/): varias bases, MySQL y Oracle, y qué pasa al actualizar el power.
- [Explorar y consultar](../guides/explore-and-query/): qué consultas acepta el servidor y sus límites.
- [Exportar a CSV y ver relaciones](../guides/export-and-relationships/).
