# Configuración

Referencia de todos los archivos de configuración del arquetipo.

## template.yaml (AWS SAM)

Define las funciones Lambda, API Gateway y recursos de AWS:

```yaml
AWSTemplateFormatVersion: 2010-09-09
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 10
    Runtime: nodejs18.x
    Architectures:
      - x86_64
    Metadata:
      BuildMethod: esbuild
      BuildProperties:
        Minify: true
        Target: es2020
        Sourcemap: false
```

### Propiedades clave por función

| Propiedad | Valor | Descripción |
|-----------|-------|-------------|
| `Runtime` | `nodejs20.x` | Versión de Node.js en Lambda |
| `Handler` | `app.<exportName>` | Función exportada desde `app.ts` |
| `BuildMethod` | `esbuild` | Bundler para compilar TypeScript |
| `Minify` | `true` | Minifica el código para reducir tamaño |
| `Target` | `es2020` | Target de compilación JavaScript |
| `Sourcemap` | `true` | Genera sourcemaps para debugging |
| `EntryPoints` | `[app.ts]` | Archivo de entrada para esbuild |

### Parámetros de CloudFormation

```yaml
Parameters:
  USER_DB:
    Type: String
    Description: User database
  PASSWORD_DB:
    Type: String
    Description: Password database
  HOST_DB:
    Type: String
    Description: Host database
  PORT_DB:
    Type: String
    Description: Port database
  DATABASE_DB:
    Type: String
    Description: Database name
```

## samconfig.toml

Configuración del CLI de SAM para builds y despliegues:

```toml
[default.global.parameters]
stack_name = "node-hexagonal-architecture-archetype"

[default.build.parameters]
cached = true       # Usa caché para builds incrementales
parallel = true     # Builds en paralelo

[default.deploy.parameters]
capabilities = "CAPABILITY_IAM"
confirm_changeset = true
resolve_s3 = true
```

## tsconfig.json

Configuración de TypeScript con path aliases:

```json
{
    "compilerOptions": {
        "target": "es2020",
        "module": "es2015",
        "moduleResolution": "node",
        "strict": true,
        "noEmit": true,
        "esModuleInterop": true,
        "experimentalDecorators": true,
        "baseUrl": "./",
        "paths": {
            "@domain/*": ["app/domain/*"],
            "@adapters/*": ["app/adapters/*"],
            "@lambda/*": ["app/entrypoints/lambda/*"],
            "@schemas/*": ["app/entrypoints/schemas/*"],
            "@libraries/*": ["app/libraries/*"],
            "@ports/*": ["app/domain/ports/*"],
            "@model/*": ["app/domain/model/*"]
        }
    }
}
```

| Opción | Valor | Razón |
|--------|-------|-------|
| `target` | `es2020` | Compatible con Node.js 18+ |
| `module` | `es2015` | ESModules para esbuild |
| `experimentalDecorators` | `true` | Necesario para decoradores de Powertools |
| `noEmit` | `true` | esbuild se encarga de la compilación |
| `strict` | `true` | Máxima seguridad de tipos |

## eslint.config.mjs

Configuración de ESLint con preset Antfu:

```javascript
import antfu from '@antfu/eslint-config';

export default antfu({
    typescript: true,
    formatters: true,
    stylistic: {
        semi: true,
        indent: 4,
        quotes: 'single',
    },
    rules: {
        'unicorn/filename-case': ['error', {
            case: 'kebabCase',
            ignore: ['README.md'],
        }],
    },
});
```

| Regla | Valor | Descripción |
|-------|-------|-------------|
| `semi` | `true` | Punto y coma obligatorio |
| `indent` | `4` | Indentación de 4 espacios |
| `quotes` | `single` | Comillas simples |
| `filename-case` | `kebabCase` | Nombres de archivo en kebab-case |

## jest.config.ts

Configuración de Jest para testing:

```typescript
export default {
    preset: 'ts-jest',
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    testMatch: ['**/tests/unit/**/*.test.ts'],
};
```

| Opción | Descripción |
|--------|-------------|
| `preset: 'ts-jest'` | Soporte nativo de TypeScript |
| `collectCoverage: true` | Genera reporte de cobertura |
| `coverageProvider: 'v8'` | Usa V8 para cobertura (más rápido) |
| `testMatch` | Solo archivos `*.test.ts` dentro de `tests/unit/` |
| `moduleNameMapper` | Replica los path aliases de tsconfig |

## package.json Scripts

| Script | Comando | Descripción |
|--------|---------|-------------|
| `test` | `npm run compile && npm run unit` | Compila y ejecuta tests |
| `unit` | `jest --coverage` | Ejecuta tests con cobertura |
| `compile` | `tsc` | Compila TypeScript (verificación de tipos) |
| `lint` | `eslint .` | Ejecuta linting |
| `lint:fix` | `eslint . --fix` | Corrige errores de linting automáticamente |
| `format` | `prettier . --write` | Formatea el código |
