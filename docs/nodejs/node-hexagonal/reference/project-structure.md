# Estructura del Proyecto

Referencia completa de la estructura de archivos y su propósito.

## Raíz del Proyecto

```
.
├── app/                    # Código fuente de la aplicación
├── events/                 # Eventos JSON para invocación local con SAM
├── app.ts                  # Entry point - exporta todos los handlers
├── template.yaml           # Plantilla SAM (define funciones Lambda)
├── samconfig.toml          # Configuración de SAM CLI
├── tsconfig.json           # Configuración de TypeScript
├── jest.config.ts          # Configuración de Jest
├── eslint.config.mjs       # Configuración de ESLint (Antfu)
├── package.json            # Dependencias y scripts
├── env.example.json        # Ejemplo de variables de entorno
├── install-script.bash     # Script de instalación interactivo
├── install-example.bash    # Instalación con código de ejemplo
└── install-structure.bash  # Instalación solo estructura
```

## Carpeta app/

### adapters/

Implementaciones concretas de los puertos del dominio.

| Archivo | Descripción |
|---------|-------------|
| `database-driver-repository.ts` | Implementa `ProductRepository` usando `DatabaseConfig` |
| `tests/unit/*.test.ts` | Tests unitarios de los adapters |

### domain/

Lógica de negocio pura sin dependencias externas.

| Carpeta/Archivo | Descripción |
|-----------------|-------------|
| `model/product.ts` | Interfaz de la entidad Product |
| `model/product-version.ts` | Interfaz de ProductVersion |
| `ports/product-repository.ts` | Interfaz del repositorio (contrato) |
| `command/create_product/` | Command y Handler para crear productos |
| `command/update_product/` | Command y Handler para actualizar productos |
| `command/delete_product/` | Command y Handler para eliminar productos |
| `queries/search_product/` | Query y Handler para buscar productos |
| `Builders/ApiResponseBuilder.ts` | Builder para respuestas Lambda |
| `constants/constants.ts` | Constantes y variables de entorno |
| `exceptions/domain-exception.ts` | Excepción de dominio |
| `exceptions/repository-exception.ts` | Excepción de repositorio |

### entrypoints/

Puntos de entrada de la aplicación (Lambda handlers).

| Carpeta/Archivo | Descripción |
|-----------------|-------------|
| `lambda/products-handler.ts` | Composición de dependencias y exports de handlers |
| `lambda/product/create_handler.ts` | Handler para POST /products |
| `lambda/product/search_handler.ts` | Handler para GET /products y GET /products/\{id\} |
| `lambda/product/update_handler.ts` | Handler para PUT /products |
| `lambda/product/delete_handler.ts` | Handler para DELETE /products/\{id\} |
| `schemas/products.ts` | Schemas Zod para validación de DTOs |
| `tests/unit/` | Tests unitarios de los handlers |

### libraries/

Infraestructura transversal y wrappers de librerías externas.

| Archivo | Descripción |
|---------|-------------|
| `lambda_instance_builder.ts` | Factory para componer Handler + CommandHandler + Repository |
| `lambda-handler-interface.ts` | Interfaz base para todos los Lambda handlers |
| `logger.ts` | Wrapper de Loggerfy con métodos tipados |
| `tracer.ts` | Wrapper de AWS Powertools Tracer |
| `metrics.ts` | Wrapper de AWS Powertools Metrics |
| `safe-object-stringify.ts` | Serialización segura de objetos |
| `orm/internals/database-config.ts` | Interfaz abstracta de conexión a BD |
| `orm/internals/sequelize.ts` | Implementación Sequelize (PostgreSQL) |
| `orm/internals/sqlite.ts` | Implementación SQLite |

## Carpeta events/

Eventos JSON para probar las funciones Lambda localmente con `sam local invoke`:

| Archivo | Descripción |
|---------|-------------|
| `create-product.json` | Evento POST para crear producto |
| `get-product.json` | Evento GET para obtener producto por ID |
| `get-all-products.json` | Evento GET para listar productos |
| `update-product.json` | Evento PUT para actualizar producto |
| `delete-product.json` | Evento DELETE para eliminar producto |
| `event.json` | Evento genérico de ejemplo |

## Entry Point (app.ts)

El archivo raíz re-exporta todos los handlers para que SAM los encuentre:

```typescript
export * from './app/entrypoints/lambda/products-handler';
```

Cada handler exportado corresponde a una propiedad `Handler` en `template.yaml`:

| Export | Handler en template.yaml |
|--------|--------------------------|
| `getProductsHandler` | `app.getProductsHandler` |
| `postProductsHandler` | `app.postProductsHandler` |
| `putProductsHandler` | `app.putProductsHandler` |
| `deleteProductsHandler` | `app.deleteProductsHandler` |
