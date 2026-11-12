---
title: Cómo configurar las conexiones
description: Agrega conexiones a PostgreSQL, MySQL y Oracle, y protégelas al actualizar el power.
sidebar:
  order: 1
---

Al terminar tendrás una o varias conexiones configuradas, sabrás dónde quedan guardadas y cómo no perderlas al actualizar el power.

## Dónde se guardan

Las conexiones viven en la variable `DB_CONNECTIONS` del servidor `power-pragma-database-power-database-server`. Kiro registra ese servidor en `~/.kiro/settings/mcp.json`, dentro de `powers.mcpServers`:

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

`DB_CONNECTIONS` es un **string** con un JSON adentro, por eso lleva las comillas escapadas. Tiene una lista por motor, y cada lista puede tener varias conexiones.

## Pídeselo al agente

La forma más simple es pedírselo a Kiro en lenguaje natural. El power trae una guía que le dice al agente cómo armar y escapar el JSON:

```text
Configura una conexión PostgreSQL llamada pg-local en localhost:5432, database my_app, usuario readonly, password dev-only
```

```text
Agrega una conexión MySQL llamada mysql-local en localhost:3306, database my_app, usuario readonly, password dev-only
```

```text
Agrega una conexión Oracle llamada oracle-dev en db-dev.example.com:1521, servicio FREEPDB1, usuario readonly, password dev-only
```

El agente lee la configuración actual, agrega la conexión nueva sin borrar las otras y guarda el string escapado.

## Edítalo a mano

Si prefieres hacerlo tú, escribe primero el JSON legible:

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

Después conviértelo en una sola línea con las comillas escapadas, por ejemplo con `node`:

```bash
node -e 'console.log(JSON.stringify(JSON.stringify(require("./conexiones.json"))))'
```

Pega el resultado, con sus comillas externas, como valor de `DB_CONNECTIONS`.

Los campos de cada motor están en la [referencia de configuración](../../reference/configuration/).

## Usa un usuario de solo lectura

El servidor solo deja pasar consultas que empiezan por `SELECT` o `WITH`, pero es un filtro de texto, no una transacción de solo lectura. Crea un usuario que solo pueda leer y úsalo en todas las conexiones. Por ejemplo, en PostgreSQL:

```sql
CREATE ROLE readonly LOGIN PASSWORD 'cambia-esto';
GRANT CONNECT ON DATABASE my_app TO readonly;
GRANT USAGE ON SCHEMA shop TO readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA shop TO readonly;
```

## Antes de actualizar el power

Cuando actualizas el power (**Check for updates** → **Install updates**), Kiro borra la entrada `power-pragma-database-power-*` de `~/.kiro/settings/mcp.json` y la vuelve a crear desde el `mcp.json` del power. `DB_CONNECTIONS` queda otra vez vacío.

Antes de actualizar, copia el valor de `DB_CONNECTIONS`. Después de actualizar, pégalo de nuevo o pídele al agente que vuelva a configurar las conexiones.

## Comprueba la configuración

```text
Lista las conexiones de base de datos disponibles
```

La respuesta muestra nombre, motor, host y base de cada conexión, sin usuarios ni passwords. Si una conexión no aparece, revisa que el JSON sea válido: si `DB_CONNECTIONS` no se puede leer, el servidor no arranca.
