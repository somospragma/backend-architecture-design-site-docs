# Capas en Detalle

## Domain (Capa Interna)

La capa de dominio contiene la lógica de negocio pura. No tiene dependencias de frameworks ni librerías externas.

### Model

Interfaces TypeScript que representan las entidades del dominio:

```typescript
// app/domain/model/product.ts
interface Product {
    id: string;
    name: string;
    description?: string;
    create_date?: string;
    last_update_date: string;
}
```

### Ports (Interfaces)

Contratos que definen las operaciones disponibles. Los adaptadores los implementan:

```typescript
// app/domain/ports/product-repository.ts
interface ProductRepository {
    add: (product: Product) => Promise<void>;
    updateAttributes: (product: Product) => Promise<void>;
    get: (productId: string) => Promise<Product>;
    list: () => Promise<Product[]>;
    delete: (productId: string) => Promise<void>;
}
```

### Commands (Escritura)

Cada command tiene dos archivos:

- **command.ts**: Schema Zod que define y valida los datos de entrada
- **command_handler.ts**: Lógica de negocio que ejecuta la operación

```typescript
// app/domain/command/create_product/command.ts
export const CreateProductCommand = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

// app/domain/command/create_product/command_handler.ts
export class CreateProductCommandHandler {
    constructor(private readonly repository: ProductRepository) {}

    async execute(command: CreateProductCommand): Promise<string> {
        const product: Product = {
            id: randomUUID(),
            name: command.name,
            description: command.description,
            create_date: Date.now().toString(),
            last_update_date: Date.now().toString(),
        };
        await this.repository.add(product);
        return product.id;
    }
}
```

### Queries (Lectura)

Misma estructura que commands pero para operaciones de lectura:

```typescript
// app/domain/queries/search_product/query_handler.ts
export class SearchProductQueryHandler {
    constructor(private readonly repository: ProductRepository) {}

    async execute(command: SearchProductQuery): Promise<Product[] | Product> {
        return command && command.id
            ? await this.repository.get(command.id)
            : await this.repository.list();
    }
}
```

### Exceptions

Excepciones tipadas para el dominio y los repositorios:

```typescript
class DomainException extends Error {
    constructor(message: string) { super(message); }
}

class RepositoryException extends Error {
    constructor(message: string) { super(message); }
}
```

### Builders

`LambdaResponseBuilder` construye respuestas Lambda con API fluida:

```typescript
LambdaResponseBuilder.empty()
    .withStatusCode(200)
    .withHeaders({ 'Content-Type': 'application/json' })
    .withBody({ id: 'uuid-123' })
    .build();
// → { statusCode: 200, headers: {...}, body: '{"id":"uuid-123"}' }
```

---

## Entrypoints (Puntos de Entrada)

### Lambda Handlers

Cada handler implementa `LambdaHandlerInterface` y se encarga de:
1. Recibir el evento de API Gateway
2. Validar el schema con Zod / Powertools Parser
3. Delegar al Command/Query Handler
4. Construir la respuesta con el Builder

```typescript
// app/entrypoints/lambda/product/create_handler.ts
export class CreateProductHandler implements LambdaHandlerInterface {
    constructor(private readonly commandHandler: CreateProductCommandHandler) {}

    @tracer.captureLambdaHandler()
    @logger.injectLambdaContext({ logEvent: false })
    public async handler(
        _event: APIGatewayProxyEvent,
        _context: AWSLambda.Context,
    ): Promise<LambdaApiResponse> {
        const event = { ..._event, body: JSON.parse(_event.body!) };
        const parsed: CreateProductDTO = ApiGatewayEnvelope.parse(
            event, CreateProductSchema,
        );

        const id = await this.commandHandler.execute(parsed);

        return ApiResponseBuilder.empty()
            .withStatusCode(200)
            .withHeaders({ 'Content-Type': 'application/json' })
            .withBody<CreateProductResponse>({ id })
            .build();
    }
}
```

### Composición (products-handler.ts)

El archivo principal compone las dependencias y exporta los handlers:

```typescript
// app/entrypoints/lambda/products-handler.ts
const databaseConfig = new SequelizeConfig();
const repository = new DatabaseDriverRepository(databaseConfig);

export const postProductsHandler = createHandler(
    CreateProductCommandHandler, CreateProductHandler, repository,
);
export const getProductsHandler = createHandler(
    SearchProductQueryHandler, SearchProductHandler, repository,
);
// ... más handlers
```

### Schemas (Validación Zod)

Schemas que definen los DTOs de entrada y salida:

```typescript
// app/entrypoints/schemas/products.ts
export const CreateProductSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
});

export const GetProductSchema = APIGatewayProxyEventSchema.extend({
    pathParameters: z.object({
        id: z.string().optional(),
    }).optional().nullable(),
});
```

---

## Adapters (Implementaciones)

Los adapters implementan los ports del dominio con tecnología concreta:

```typescript
// app/adapters/database-driver-repository.ts
export class DatabaseDriverRepository implements ProductRepository {
    constructor(private readonly dbConfig: DatabaseConfig) {}

    public async list(): Promise<Product[]> {
        await this.dbConfig.connect();
        const results = await this.dbConfig.query('SELECT * FROM products', []);
        await this.dbConfig.disconnect();
        return results;
    }

    public async add(product: Product): Promise<void> {
        await this.dbConfig.connect();
        await this.dbConfig.query(
            'INSERT INTO products VALUES (?, ?, ?, ?, ?)',
            [product.id, product.name, product.description,
             product.create_date, product.last_update_date],
        );
        await this.dbConfig.disconnect();
    }
    // ... más métodos
}
```

:::tip Inversión de Dependencias
El adapter recibe `DatabaseConfig` por constructor (inyección de dependencias). Esto permite cambiar la implementación de BD sin modificar el adapter.
:::

---

## Libraries (Infraestructura Transversal)

### Logger

Wrapper sobre `loggerfy` con métodos estáticos tipados:

```typescript
LambdaLogger.info({ code: '001', message: 'Producto creado' });
LambdaLogger.error({ code: '500', message: 'Error de conexión' });
```

### Tracer

Integración con AWS X-Ray via Powertools:

```typescript
export const tracer = new Tracer({ serviceName: POWERTOOLS_SERVICE_NAME });
```

### Metrics

Integración con CloudWatch Metrics via Powertools:

```typescript
LambdaMetrics.addMetric('ProductCreated', MetricUnit.Count, 1);
```

### ORM (DatabaseConfig)

Interface que abstrae la conexión a base de datos:

```typescript
export interface DatabaseConfig {
    connect: () => Promise<void>;
    query: (query: string, params: any[]) => Promise<any>;
    disconnect: () => Promise<void>;
    getConnection: () => any;
}
```

Implementaciones disponibles:
- **SequelizeConfig**: PostgreSQL via Sequelize
- **SQLiteDatabase**: SQLite para desarrollo local

### Lambda Instance Builder

Factory function que compone Command/Query Handler + Lambda Handler + Repository:

```typescript
function createHandler<C, R>(
    CommandHandlerClass: Constructor<C>,
    HandlerClass: Constructor<LambdaHandlerInterface>,
    repository: R,
) {
    const commandHandler = new CommandHandlerClass(repository);
    const handlerInstance = new HandlerClass(commandHandler);
    return handlerInstance.handler.bind(handlerInstance);
}
```
