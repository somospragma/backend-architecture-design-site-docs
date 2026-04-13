# Testing

El arquetipo usa **Jest** con **ts-jest** para tests unitarios con cobertura de código.

## Ejecutar Tests

```bash
# Compilar y ejecutar tests
npm run test

# Solo tests (sin compilar)
npm run unit
```

## Configuración de Jest

La configuración está en `jest.config.ts`:

```typescript
export default {
    preset: 'ts-jest',
    transform: { '^.+\\.ts?$': 'ts-jest' },
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    collectCoverageFrom: ['app/**/*.{js,jsx,ts,tsx}', '!<rootDir>/node_modules/'],
    testMatch: ['**/tests/unit/**/*.test.ts'],
    moduleNameMapper: {
        '^@domain/(.*)$': '<rootDir>/app/domain/$1',
        '^@adapters/(.*)$': '<rootDir>/app/adapters/$1',
        '^@lambda/(.*)$': '<rootDir>/app/entrypoints/lambda/$1',
        '^@schemas/(.*)$': '<rootDir>/app/entrypoints/schemas/$1',
        '^@libraries/(.*)$': '<rootDir>/app/libraries/$1',
        '^@ports/(.*)$': '<rootDir>/app/domain/ports/$1',
        '^@model/(.*)$': '<rootDir>/app/domain/model/$1',
    },
};
```

:::info Path Aliases en Tests
Los `moduleNameMapper` replican los path aliases de `tsconfig.json` para que Jest resuelva los imports correctamente.
:::

## Estructura de Tests

Los tests se ubican junto a la capa que prueban:

```
app/
├── adapters/tests/unit/
│   └── database-driver-repository.test.ts
└── entrypoints/tests/unit/
    └── products/
        └── *.test.ts
```

## Ejemplo: Test del Adapter

El test del `DatabaseDriverRepository` mockea la interfaz `DatabaseConfig`:

```typescript
import type { DatabaseConfig } from '@libraries/orm/internals/database-config';
import { DatabaseDriverRepository } from '@adapters/database-driver-repository';

const databaseConfigMock: DatabaseConfig = {
    connect: jest.fn().mockImplementation(() => Promise.resolve()),
    query: jest.fn().mockResolvedValue([1, 2, 3]),
    disconnect: jest.fn().mockImplementation(() => Promise.resolve()),
    getConnection: jest.fn().mockImplementation(() => Promise.resolve()),
};

describe('database-driver-repository test suit', () => {
    const databaseDriver = new DatabaseDriverRepository(databaseConfigMock);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should call list method', async () => {
        const response = await databaseDriver.list();
        expect(response).toEqual([1, 2, 3]);
        expect(databaseConfigMock.connect).toHaveBeenCalled();
    });

    it('should call add method', async () => {
        await databaseDriver.add({
            id: '', name: '', description: '',
            create_date: '', last_update_date: '',
        });
        expect(databaseConfigMock.query).toHaveBeenCalled();
    });

    it('should call get method', async () => {
        const response = await databaseDriver.get('1');
        expect(response).toEqual(1);
        expect(databaseConfigMock.connect).toHaveBeenCalled();
    });
});
```

## Estrategia de Testing

### Qué testear

| Capa | Qué testear | Cómo |
|------|-------------|------|
| **Adapters** | Que llamen correctamente a `DatabaseConfig` | Mock de `DatabaseConfig` |
| **Command Handlers** | Lógica de negocio y manejo de errores | Mock del Port (Repository) |
| **Lambda Handlers** | Validación de schemas y respuestas HTTP | Mock del Command Handler |

### Qué se excluye de cobertura

Según `modulePathIgnorePatterns` en `jest.config.ts`:

- `app/domain/Builders/` — Builders simples sin lógica compleja
- `app/domain/exceptions/` — Clases de error simples
- `app/domain/model/` — Interfaces TypeScript (sin runtime)
- `app/domain/ports/` — Interfaces TypeScript (sin runtime)
- `app/libraries/` — Wrappers de librerías externas
- `app/entrypoints/schemas/` — Schemas Zod declarativos

## Ejemplo: Test de un Command Handler

```typescript
import { CreateProductCommandHandler } from '@domain/command/create_product/command_handler';
import type ProductRepository from '@ports/product-repository';

const repositoryMock: ProductRepository = {
    add: jest.fn().mockResolvedValue(undefined),
    get: jest.fn(),
    list: jest.fn(),
    updateAttributes: jest.fn(),
    delete: jest.fn(),
};

describe('CreateProductCommandHandler', () => {
    const handler = new CreateProductCommandHandler(repositoryMock);

    beforeEach(() => jest.clearAllMocks());

    it('should create a product and return id', async () => {
        const id = await handler.execute({
            name: 'Test Product',
            description: 'A test product',
        });

        expect(id).toBeDefined();
        expect(repositoryMock.add).toHaveBeenCalledTimes(1);
    });

    it('should throw DomainException on error', async () => {
        (repositoryMock.add as jest.Mock).mockRejectedValue(
            new Error('DB Error'),
        );

        await expect(
            handler.execute({ name: 'Test', description: 'Test' }),
        ).rejects.toThrow('DB Error');
    });
});
```
