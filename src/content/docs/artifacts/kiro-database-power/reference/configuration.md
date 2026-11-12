---
title: Configuración
description: El formato de DB_CONNECTIONS, el mcp.json del power y los valores fijos de conexión.
sidebar:
  order: 2
---

## DB_CONNECTIONS

Variable de entorno del servidor MCP. Es un string con un JSON que tiene una lista por motor:

```json
{
  "postgresql": [],
  "mysql": [],
  "oracle": []
}
```

Si la variable no existe, el servidor arranca sin conexiones. Si no es un JSON válido, el servidor no arranca.

### Campos por motor

| Campo | PostgreSQL | MySQL | Oracle | Qué es |
|---|---|---|---|---|
| `name` | Sí | Sí | Sí | Nombre con el que la usas en Kiro. Debe ser único entre todas las conexiones: si se repite, queda la última. |
| `host` | Sí | Sí | Sí | Servidor de la base. |
| `port` | Sí | Sí | Sí | Puerto. Los usuales son 5432, 3306 y 1521. Es un número, no un string. |
| `database` | Sí | Sí | — | Base de datos. |
| `serviceName` | — | — | Sí | Nombre del servicio, por ejemplo `FREEPDB1` u `ORCL`. |
| `user` | Sí | Sí | Sí | Usuario. Usa uno de solo lectura. |
| `password` | Sí | Sí | Sí | Password. |

El servidor no pone valores por defecto: escribe siempre el `port`. En Oracle, la conexión se arma como `host:port/serviceName`.

## mcp.json del power

Es el que trae el power en `powers/pragma-database-power/mcp.json`:

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

Al instalar el power, Kiro copia este servidor a `~/.kiro/settings/mcp.json`, dentro de `powers.mcpServers`, con el nombre `power-pragma-database-power-database-server`. Ahí es donde se cambia `DB_CONNECTIONS`.

`npx -y github:somospragma/pragma-ia-kiro-custom-powers` descarga la rama `main` del repositorio, instala las dependencias del `package.json` de la raíz y ejecuta `servers/database-mcp-server/index.js`. La primera vez tarda unos segundos; después `npx` usa su caché.

## Valores fijos de conexión

No se pueden cambiar desde la configuración.

| | PostgreSQL | MySQL | Oracle |
|---|---|---|---|
| Driver | `pg` | `mysql2` | `oracledb` (modo thin) |
| Conexiones por pool | 5 | 5 | 1 a 5 |
| Tiempo máximo para conectar | 10 s | 10 s | El del driver |
| Tiempo máximo de una consulta | Sin límite | Sin límite | Sin límite |

Cada conexión abre su pool la primera vez que la usas.

## Requisitos

- Node.js 18 o superior.
- Acceso a github.com para que `npx` descargue el servidor.
- Acceso de red desde tu máquina a cada base de datos.
- Oracle no necesita Oracle Instant Client: `oracledb` 6 se conecta en modo thin.
