# Agregar Nuevos Handlers

Guía paso a paso para agregar un nuevo recurso al arquetipo. Usaremos como ejemplo un CRUD de `Order`.

## Paso 1: Crear el Modelo

```typescript
// app/domain/model/order.ts
interface Order {
    id: string;
    productId: string;
    quantity: number;
    total: number;
    status: string;
    create_date: string;
    last_update_date: string;
}

export default Order;
```

## Paso 2: Crear el Port

```typescript
// app/domain/ports/order-repository.ts
import type Order from '../model/order';

interface OrderRepository {
    add: (order: Order) => Promise<void>;
    get: (orderId: string) => Promise<Order>;
    list: () => Promise<Order[]>;
}

export default OrderRepository;
```

## Paso 3: Crear el Command

```typescript
// app/domain/command/create_order/command.ts
import { z } from 'zod';

export const CreateOrderCommand = z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    total: z.number().min(0),
});

export type CreateOrderCommand = z.infer<typeof CreateOrderCommand>;
```

```typescript
// app/domain/command/create_order/command_handler.ts
import type { CreateOrderCommand } from './command';
import type Order from '@model/order';
import type OrderRepository from '@ports/order-repository';
import { randomUUID } from 'node:crypto';
import { DOMAIN_ERROR_MESSAGE } from '@domain/constants/constants';
import DomainException from '@domain/exceptions/domain-exception';

export class CreateOrderCommandHandler {
    constructor(private readonly repository: OrderRepository) {}

    async execute(command: CreateOrderCommand): Promise<string> {
        try {
            const currentTime = Date.now().toString();
            const id = randomUUID();
            const order: Order = {
                id,
                productId: command.productId,
                quantity: command.quantity,
                total: command.total,
                status: 'PENDING',
                create_date: currentTime,
                last_update_date: currentTime,
            };
            await this.repository.add(order);
            return id;
        }
        catch (error) {
            throw new DomainException(
                error instanceof Error ? error.message : DOMAIN_ERROR_MESSAGE,
            );
        }
    }
}
```

## Paso 4: Crear el Schema de Validación

```typescript
// app/entrypoints/schemas/orders.ts
import { z } from 'zod';

export const CreateOrderSchema = z.object({
    productId: z.string().min(1),
    quantity: z.number().min(1),
    total: z.number().min(0),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;

export const CreateOrderResponse = z.object({
    id: z.string().min(1).uuid(),
});

export type CreateOrderResponse = z.infer<typeof CreateOrderResponse>;
```

## Paso 5: Crear el Lambda Handler

```typescript
// app/entrypoints/lambda/order/create_handler.ts
import type { APIGatewayProxyEvent } from '@aws-lambda-powertools/parser/types';
import type { LambdaApiResponse } from '@domain/builders/ApiResponseBuilder';
import type { CreateOrderCommandHandler } from '@domain/command/create_order/command_handler';
import type LambdaHandlerInterface from '@libraries/lambda-handler-interface';
import type { CreateOrderDTO, CreateOrderResponse } from '@schemas/orders';
import { ApiGatewayEnvelope } from '@aws-lambda-powertools/parser/envelopes';
import ApiResponseBuilder from '@domain/builders/ApiResponseBuilder';
import LambdaLogger, { logger } from '@libraries/logger';
import { tracer } from '@libraries/tracer';
import { CreateOrderSchema } from '@schemas/orders';

export class CreateOrderHandler implements LambdaHandlerInterface {
    constructor(private readonly commandHandler: CreateOrderCommandHandler) {}

    @tracer.captureLambdaHandler()
    @logger.injectLambdaContext({ logEvent: false })
    public async handler(
        _event: APIGatewayProxyEvent,
        _context: AWSLambda.Context,
    ): Promise<LambdaApiResponse> {
        try {
            const event = { ..._event, body: JSON.parse(_event.body!) };
            const parsed: CreateOrderDTO = ApiGatewayEnvelope.parse(
                event, CreateOrderSchema,
            );

            const id = await this.commandHandler.execute(parsed);

            return ApiResponseBuilder.empty()
                .withStatusCode(200)
                .withHeaders({ 'Content-Type': 'application/json' })
                .withBody<CreateOrderResponse>({ id })
                .build();
        }
        catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error';
            LambdaLogger.error(errorMessage);
            return ApiResponseBuilder.empty()
                .withStatusCode(400)
                .withBody({ error: errorMessage })
                .build();
        }
    }
}
```

## Paso 6: Implementar el Adapter

```typescript
// app/adapters/order-repository.ts
import type Order from '@domain/model/order';
import type OrderRepository from '@domain/ports/order-repository';
import type { DatabaseConfig } from '@libraries/orm/internals/database-config';

export class DatabaseOrderRepository implements OrderRepository {
    constructor(private readonly dbConfig: DatabaseConfig) {}

    public async add(order: Order): Promise<void> {
        await this.dbConfig.connect();
        await this.dbConfig.query(
            'INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?)',
            [order.id, order.productId, order.quantity, order.total,
             order.status, order.create_date, order.last_update_date],
        );
        await this.dbConfig.disconnect();
    }

    public async get(orderId: string): Promise<Order> {
        await this.dbConfig.connect();
        const result = await this.dbConfig.query(
            'SELECT * FROM orders WHERE id = ?', [orderId],
        );
        await this.dbConfig.disconnect();
        return result[0] as unknown as Order;
    }

    public async list(): Promise<Order[]> {
        await this.dbConfig.connect();
        const results = await this.dbConfig.query('SELECT * FROM orders', []);
        await this.dbConfig.disconnect();
        return results;
    }
}
```

## Paso 7: Registrar el Handler

Agrega el export en `products-handler.ts` o crea un nuevo archivo `orders-handler.ts`:

```typescript
// app/entrypoints/lambda/orders-handler.ts
import { DatabaseOrderRepository } from '@adapters/order-repository';
import { CreateOrderCommandHandler } from '@domain/command/create_order/command_handler';
import { CreateOrderHandler } from '@lambda/order/create_handler';
import createHandler from '@libraries/lambda_instance_builder';
import { SequelizeConfig } from '@libraries/orm/internals/sequelize';

const databaseConfig = new SequelizeConfig();
const repository = new DatabaseOrderRepository(databaseConfig);

export const postOrderHandler = createHandler(
    CreateOrderCommandHandler,
    CreateOrderHandler,
    repository,
);
```

Exporta desde `app.ts`:

```typescript
// app.ts
export * from './app/entrypoints/lambda/products-handler';
export * from './app/entrypoints/lambda/orders-handler';
```

## Paso 8: Agregar la Función en template.yaml

```yaml
PostOrderFunction:
  Type: AWS::Serverless::Function
  Properties:
    CodeUri: .
    Handler: app.postOrderHandler
    Runtime: nodejs20.x
    Environment:
      Variables:
        POWERTOOLS_SERVICE_NAME: serverlessAirline
        POWERTOOLS_METRICS_NAMESPACE: serverlessAirline
        USER_DB: !Ref USER_DB
        PASSWORD_DB: !Ref PASSWORD_DB
        HOST_DB: !Ref HOST_DB
        PORT_DB: !Ref PORT_DB
        DATABASE_DB: !Ref DATABASE_DB
    Events:
      PostApi:
        Type: Api
        Properties:
          Path: /orders
          Method: POST
  Metadata:
    BuildMethod: esbuild
    BuildProperties:
      Minify: true
      Target: es2020
      Sourcemap: true
      EntryPoints:
        - app.ts
```

## Resumen

Para cada nuevo recurso necesitas crear:

| Capa | Archivo | Responsabilidad |
|------|---------|-----------------|
| Domain | `model/<entity>.ts` | Interfaz de la entidad |
| Domain | `ports/<entity>-repository.ts` | Interfaz del repositorio |
| Domain | `command/<action>/command.ts` | Schema Zod del comando |
| Domain | `command/<action>/command_handler.ts` | Lógica de negocio |
| Entrypoints | `schemas/<entity>.ts` | DTOs de validación |
| Entrypoints | `lambda/<entity>/<action>_handler.ts` | Handler Lambda |
| Adapters | `<entity>-repository.ts` | Implementación del port |
| Config | `template.yaml` | Función SAM |
