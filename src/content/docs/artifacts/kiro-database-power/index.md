---
title: Introducción
description: Qué es Pragma Database Manager, cómo funciona y cuándo usarlo.
sidebar:
  order: 1
---

Pragma Database Manager es un power de [Kiro](https://kiro.dev) que conecta el agente a tus bases de datos PostgreSQL, MySQL y Oracle. Le preguntas en lenguaje natural y el agente explora schemas y tablas, ejecuta consultas `SELECT`, arma un CSV con los resultados y te muestra cómo se relacionan las tablas.

```text
Muestra los pedidos con el nombre del cliente en pg-local
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

## Qué resuelve

- **Preguntar sin salir del editor.** Le pides al agente que revise una tabla o que cuente registros, y él escribe y ejecuta el `SELECT`.
- **Entender un modelo de datos que no conoces.** Lista schemas y tablas, describe columnas y dibuja las foreign keys de un schema.
- **Varias bases a la vez.** Configuras varias conexiones por motor y eliges en cada pregunta a cuál ir.
- **Solo lectura.** El servidor rechaza cualquier consulta que no empiece por `SELECT` o `WITH`.

## Cómo funciona

El power tiene dos partes:

| Parte | Dónde vive | Qué hace |
|---|---|---|
| El power | `powers/pragma-database-power/` en el repositorio | `POWER.md` y las guías de `steering/` le enseñan al agente qué herramientas hay y cómo configurar conexiones. |
| El servidor MCP | `servers/database-mcp-server/` en el repositorio | Se conecta a las bases y expone [8 herramientas](./reference/tools/). Kiro lo arranca con `npx` directamente desde GitHub. |

Kiro instala el power desde GitHub y registra el servidor en `~/.kiro/settings/mcp.json`. Las conexiones van en la variable `DB_CONNECTIONS` de ese servidor. No hay que clonar el repositorio.

## Cuándo usarlo

- Estás desarrollando o depurando y quieres consultar tu base local o de desarrollo desde Kiro.
- Llegas a un proyecto nuevo y necesitas entender sus tablas y relaciones.
- Quieres sacar un CSV rápido de una consulta para revisarlo o compartirlo.

## Cuándo no

- **Para modificar datos.** No hace `INSERT`, `UPDATE`, `DELETE` ni cambios de estructura.
- **Contra producción con un usuario con permisos de escritura.** El bloqueo es un filtro de texto sobre la consulta, no una transacción de solo lectura. Usa siempre un usuario de base de datos de solo lectura.
- **Para extraer grandes volúmenes.** `execute_query` devuelve como máximo 1000 filas y `export_query_csv` 10 000.
- **Con motores distintos a PostgreSQL, MySQL (o MariaDB) y Oracle.** No hay soporte para SQL Server, SQLite ni bases NoSQL.

## Estado

El power está en estado **experimental**: no tiene versiones publicadas y puede cambiar. El código está en [somospragma/pragma-ia-kiro-custom-powers](https://github.com/somospragma/pragma-ia-kiro-custom-powers) bajo licencia Apache-2.0, y lo mantiene el Backend Chapter.
