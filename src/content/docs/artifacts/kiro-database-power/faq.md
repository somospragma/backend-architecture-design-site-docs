---
title: Preguntas frecuentes
description: Dudas comunes al instalar y usar Pragma Database Manager.
sidebar:
  order: 90
---

## ¿Tengo que clonar el repositorio?

No. Lo instalas con **Add Custom Power** → **Import power from GitHub** y la URL de la carpeta del power. El servidor MCP lo descarga `npx` desde GitHub. Solo necesitas clonar el repositorio si vas a cambiar el power o el servidor.

## ¿Puede modificar mis datos?

El servidor rechaza cualquier consulta que no empiece por `SELECT` o `WITH` o que tenga palabras como `INSERT`, `UPDATE`, `DELETE` o `DROP`. Pero es un filtro sobre el texto, no una transacción de solo lectura: una función de la base que escriba datos y se llame desde un `SELECT` pasaría el filtro. Por eso la única protección real es conectar con un usuario de base de datos que solo pueda leer.

## ¿Dónde quedan mis passwords?

En texto plano, dentro de `DB_CONNECTIONS` en `~/.kiro/settings/mcp.json`, en tu máquina. No los subas a ningún repositorio y usa usuarios de solo lectura con passwords propios, no los de una aplicación.

## Actualicé el power y desaparecieron mis conexiones

Es lo esperado. Al actualizar, Kiro borra la entrada del servidor en `~/.kiro/settings/mcp.json` y la vuelve a crear desde el `mcp.json` del power, que trae `DB_CONNECTIONS` vacío. Guarda una copia del valor antes de actualizar y pégalo después. Ver [Antes de actualizar el power](../guides/connections/#antes-de-actualizar-el-power).

## Pedí exportar un CSV y no veo el archivo

El servidor no escribe archivos: devuelve el contenido del CSV al agente, y el agente es el que lo guarda. Pídele que lo guarde en la ruta que quieras: `Guarda ese CSV en exports/orders.csv`.

## ¿Por qué falla mi consulta con `syntax error at or near "LIMIT"`?

Terminaste la consulta con `;`. En PostgreSQL y MySQL el servidor agrega `LIMIT <n>` al final y queda después del punto y coma. Quita el `;`.

## ¿Por qué me rechaza un `SELECT` que solo lee?

Porque tiene, como palabra suelta, uno de los términos bloqueados, aunque esté dentro de un string o un comentario. Por ejemplo `WHERE action = 'DELETE'`. Cambia el filtro, por ejemplo con `WHERE action LIKE 'DELET%'`, o haz la consulta desde otra herramienta.

## ¿Funciona con MariaDB?

Sí. Configúrala como una conexión `mysql`. El driver `mysql2` soporta MySQL 5.7 o superior y MariaDB 10.2 o superior.

## ¿Necesito Oracle Instant Client?

No. El servidor usa `oracledb` 6, que se conecta en modo thin sin librerías de Oracle instaladas.

## ¿Por qué en Oracle los resultados no traen los nombres de las columnas?

El servidor usa el formato por defecto de `oracledb`, que devuelve cada fila como una lista de valores. Es una limitación conocida: el diagrama de `visualize_schema_relationships` tampoco sale bien en Oracle. Usa `get_table_relationships` tabla por tabla.

## ¿Cuánto tarda en arrancar?

La primera vez, unos segundos, mientras `npx` descarga el servidor y sus dependencias. Después usa la caché de npm y arranca más rápido.

## ¿Funciona con una base que solo está en la VPN?

Sí, si tu máquina llega a ella. El servidor corre en tu máquina, con tu red.
