---
title: Cómo exportar a CSV y ver las relaciones
description: Saca el resultado de una consulta en CSV y entiende cómo se conectan las tablas.
sidebar:
  order: 3
---

Al terminar tendrás un archivo CSV con el resultado de una consulta y un diagrama de texto con las foreign keys de un schema.

## Exportar a CSV

```text
Exporta a customers.csv: SELECT id, name, email FROM shop.customers ORDER BY id, en pg-local
```

El servidor ejecuta la consulta y devuelve el CSV al agente:

```text
Exportados 3 registros a customers.csv

Contenido CSV:
id,name,email
1,Ana Gómez,ana@example.com
2,Luis Pérez,luis@example.com
3,Marta Ruiz,marta@example.com
```

**El servidor no escribe el archivo.** Devuelve el contenido y el nombre que pediste, y es el agente de Kiro el que crea `customers.csv` en tu proyecto. Si no lo crea, pídeselo: `Guarda ese CSV en exports/customers.csv`.

Cómo se arma el CSV:

- La primera fila son los nombres de las columnas.
- Separador `,` y saltos de línea `\n`.
- Los valores con coma, comillas o saltos de línea van entre comillas dobles, y las comillas internas se duplican.
- `NULL` sale como campo vacío.
- Por defecto exporta 1000 filas y como máximo 10 000. Aplican las mismas reglas de consulta y de `LIMIT` que en [Explorar y consultar](../explore-and-query/#límite-de-filas).

## Las relaciones de una tabla

```text
Muestra las relaciones de la tabla order_items del schema shop en pg-local
```

```json
[
  {
    "constraint_name": "order_items_order_id_fkey",
    "column_name": "order_id",
    "foreign_table_schema": "shop",
    "foreign_table_name": "orders",
    "foreign_column_name": "id"
  },
  {
    "constraint_name": "order_items_product_id_fkey",
    "column_name": "product_id",
    "foreign_table_schema": "shop",
    "foreign_table_name": "products",
    "foreign_column_name": "id"
  }
]
```

Solo muestra las foreign keys que salen de esa tabla, no las que llegan a ella.

## El diagrama de un schema

```text
Visualiza las relaciones del schema shop en pg-local
```

```text
Diagrama de relaciones del schema: shop
==================================================

┌─ order_items
│  └─ order_id ──→ orders.id
│  └─ product_id ──→ products.id
│
┌─ orders
│  └─ customer_id ──→ customers.id
│
```

Cada bloque es una tabla que tiene foreign keys, con sus columnas y la tabla y columna a la que apuntan. Las tablas sin foreign keys propias, como `customers` y `products`, no tienen bloque.

Para un modelo grande, pídele al agente que lo convierta en un diagrama Mermaid a partir de esta salida.
