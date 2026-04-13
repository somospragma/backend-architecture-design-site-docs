# Adaptadores de Base de Datos

El arquetipo usa el patrón Factory para abstraer la conexión a base de datos mediante la interfaz `DatabaseConfig`.

## Interfaz DatabaseConfig

Todos los adaptadores de BD deben implementar esta interfaz:

```typescript
export interface DatabaseConfig {
    connect: () => Promise<void>;
    query: (query: string, params: any[]) => Promise<any>;
    disconnect: () => Promise<void>;
    getConnection: () => any;
}
```

## Implementaciones Disponibles

### Sequelize (PostgreSQL)

Implementación por defecto para producción. Usa Sequelize con el driver `pg`:

```typescript
import { Sequelize } from 'sequelize';
import pg from 'pg';

export class SequelizeConfig implements DatabaseConfig {
    private readonly sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(
            `postgres://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/${DATABASE_DB}`,
            { dialect: 'postgres', dialectModule: pg },
        );
    }

    public async connect(): Promise<void> {
        await this.sequelize.authenticate();
    }

    public async query(query: string, params: unknown[]): Promise<[unknown[], unknown]> {
        return await this.sequelize.query(query, { replacements: params });
    }

    public async disconnect(): Promise<void> {
        await this.sequelize.close();
    }

    public getConnection(): Sequelize {
        return this.sequelize;
    }
}
```

Para usar Sequelize, instala las dependencias:

```bash
npm install sequelize pg
```

### SQLite (Desarrollo Local)

Implementación ligera para desarrollo y testing local:

```typescript
import sqlite3 from 'sqlite3';

export class SQLiteDatabase implements DatabaseConfig {
    private db!: sqlite3.Database;

    async connect(): Promise<void> {
        this.db = new sqlite3.Database('products.db');
    }

    async query(query: string, params: unknown[] = []): Promise<unknown> {
        return await this.db.run(query, params);
    }

    async disconnect(): Promise<void> {
        this.db.close();
    }

    async getConnection() {
        return this.db;
    }
}
```

Para usar SQLite:

```bash
npm install sqlite3
```

## Cambiar de Base de Datos

Gracias a la inversión de dependencias, cambiar de BD solo requiere modificar la composición en `products-handler.ts`:

```typescript
// De PostgreSQL:
const databaseConfig = new SequelizeConfig();

// A SQLite:
const databaseConfig = new SQLiteDatabase();

// El resto del código no cambia
const repository = new DatabaseDriverRepository(databaseConfig);
```

## Crear un Nuevo Adaptador de BD

Para agregar soporte a otra base de datos (ej: MySQL, DynamoDB):

### 1. Implementar DatabaseConfig

```typescript
// app/libraries/orm/internals/mysql.ts
import type { DatabaseConfig } from './database-config';
import mysql from 'mysql2/promise';

export class MySQLConfig implements DatabaseConfig {
    private connection!: mysql.Connection;

    async connect(): Promise<void> {
        this.connection = await mysql.createConnection({
            host: HOST_DB,
            user: USER_DB,
            password: PASSWORD_DB,
            database: DATABASE_DB,
            port: Number(PORT_DB),
        });
    }

    async query(query: string, params: unknown[]): Promise<any> {
        const [rows] = await this.connection.execute(query, params);
        return rows;
    }

    async disconnect(): Promise<void> {
        await this.connection.end();
    }

    getConnection() {
        return this.connection;
    }
}
```

### 2. Usar en la composición

```typescript
import { MySQLConfig } from '@libraries/orm/internals/mysql';

const databaseConfig = new MySQLConfig();
const repository = new DatabaseDriverRepository(databaseConfig);
```

:::tip
El `DatabaseDriverRepository` no necesita cambios porque depende de la interfaz `DatabaseConfig`, no de una implementación concreta.
:::

## Variables de Entorno

Las credenciales de BD se configuran como variables de entorno en `template.yaml` y se leen desde `constants.ts`:

```typescript
// app/domain/constants/constants.ts
export const {
    USER_DB,
    PASSWORD_DB,
    HOST_DB,
    PORT_DB,
    DATABASE_DB,
} = process.env;
```

Para desarrollo local, usa un archivo `env.json`:

```json
{
  "GetProductsFunction": {
    "USER_DB": "postgres",
    "PASSWORD_DB": "password",
    "HOST_DB": "localhost",
    "PORT_DB": "5432",
    "DATABASE_DB": "mydb"
  }
}
```

Y pásalo a SAM:

```bash
sam local invoke GetProductsFunction --event events/event.json --env-vars env.json
```
