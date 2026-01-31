# Commands Reference

Complete reference of all available Gradle tasks with real examples.

---

## initCleanArch

Initialize a new clean architecture project with the specified architecture, paradigm, and framework.

### Syntax

```bash
./gradlew initCleanArch \
  --architecture=<type> \
  --paradigm=<paradigm> \
  --framework=<framework> \
  --package=<package>
```

### Parameters

| Parameter | Required | Description | Values |
|-----------|----------|-------------|--------|
| `--architecture` | Yes | Architecture type | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single`, `onion-multi` |
| `--paradigm` | Yes | Programming paradigm | `reactive`, `imperative` |
| `--framework` | Yes | Framework to use | `spring`, `quarkus` (coming soon) |
| `--package` | Yes | Base package name | e.g., `com.company.service` |

### Architecture Types

- **hexagonal-single**: Single module with all layers in one module
- **hexagonal-multi**: Three modules (domain, application, infrastructure)
- **hexagonal-multi-granular**: Granular modules (model, ports, usecase, adapters)
- **onion-single**: Single module onion architecture
- **onion-multi**: Multi module onion architecture

### Examples

**Hexagonal Single Module with Spring Reactive:**
```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.payment
```

**Hexagonal Multi Module with Spring Imperative:**
```bash
./gradlew initCleanArch \
  --architecture=hexagonal-multi \
  --paradigm=imperative \
  --framework=spring \
  --package=com.company.user
```

### Generated Structure

After running `initCleanArch`, you'll get:
- Project structure with clean architecture layers
- `build.gradle.kts` with necessary dependencies
- `settings.gradle.kts` configured
- `.cleanarch.yml` configuration file
- Base package structure
- `README.md` with project information

---

## generateEntity

Generate a domain entity with fields, ID configuration, and proper package structure.

### Syntax

```bash
./gradlew generateEntity \
  --name=<EntityName> \
  --fields=<field1:Type1,field2:Type2> \
  --packageName=<package> \
  [--hasId=<true|false>] \
  [--idType=<type>]
```

### Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `--name` | Yes | Entity name (PascalCase) | - |
| `--fields` | Yes | Comma-separated fields with types | - |
| `--packageName` | Yes | Full package name | - |
| `--hasId` | No | Include ID field | `true` |
| `--idType` | No | Type of ID field | `String` |

### Field Format

Fields are specified as: `fieldName:FieldType,anotherField:AnotherType`

### Examples

**Simple Entity:**
```bash
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String,age:Integer \
  --packageName=com.pragma.test.domain.model
```

**Entity with Custom ID:**
```bash
./gradlew generateEntity \
  --name=Product \
  --fields=name:String,price:BigDecimal,stock:Integer \
  --packageName=com.pragma.test.domain.model \
  --hasId=true \
  --idType=Long
```

**Entity without ID:**
```bash
./gradlew generateEntity \
  --name=Address \
  --fields=street:String,city:String,zipCode:String \
  --packageName=com.pragma.test.domain.model \
  --hasId=false
```

### Generated Files

- `{EntityName}.java` in the specified package
- Includes getters, setters, constructors
- Includes ID field if `--hasId=true`

---

## generateUseCase

Generate a use case with port interface and implementation, including methods with parameters.

### Syntax

```bash
./gradlew generateUseCase \
  --name=<UseCaseName> \
  --methods=<methodName:ReturnType:param1:Type1:param2:Type2> \
  --packageName=<package> \
  [--generatePort=<true|false>] \
  [--generateImpl=<true|false>]
```

### Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `--name` | Yes | Use case name (PascalCase) | - |
| `--methods` | Yes | Method definitions | - |
| `--packageName` | Yes | Package for port interface | - |
| `--generatePort` | No | Generate port interface | `true` |
| `--generateImpl` | No | Generate implementation | `true` |

### Method Format

Methods are specified as: `methodName:ReturnType:param1:Type1:param2:Type2`

Multiple methods separated by `|`:
```
method1:Type1:param1:Type1|method2:Type2:param2:Type2
```

### Examples

**Single Method Use Case:**
```bash
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userId:String:userData:UserData \
  --packageName=com.pragma.test.domain.port.in
```

**Multiple Methods Use Case:**
```bash
./gradlew generateUseCase \
  --name=ProductManagement \
  --methods=create:Product:data:ProductData|update:Product:id:String:data:ProductData|delete:Boolean:id:String \
  --packageName=com.pragma.test.domain.port.in
```

**Port Only (No Implementation):**
```bash
./gradlew generateUseCase \
  --name=PaymentProcessor \
  --methods=process:PaymentResult:payment:Payment \
  --packageName=com.pragma.test.domain.port.in \
  --generateImpl=false
```

### Generated Files

1. **Port Interface**: `{UseCaseName}UseCase.java` in specified package
2. **Implementation**: `{UseCaseName}UseCaseImpl.java` in `application.usecase` package

---

## generateOutputAdapter

Generate a driven adapter (repository, cache, client) with CRUD operations and mappers.

:::info Terminology
In clean architecture, output adapters are called **driven adapters** because they are driven by the application core. They are located in `infrastructure/driven-adapters/`.
:::

### Syntax

```bash
./gradlew generateOutputAdapter \
  --name=<AdapterName> \
  --entity=<EntityName> \
  --type=<adapterType> \
  --packageName=<package> \
  [--methods=<customMethods>]
```

### Parameters

| Parameter | Required | Description | Values |
|-----------|----------|-------------|--------|
| `--name` | Yes | Adapter name | e.g., `UserRepository` |
| `--entity` | Yes | Entity name | e.g., `User` |
| `--type` | Yes | Adapter type | `redis`, `mongodb`, `postgresql`, `rest_client`, `kafka` |
| `--packageName` | Yes | Full package name | - |
| `--methods` | No | Custom methods | Optional |

### Adapter Types

- **redis**: Redis cache driven adapter with reactive operations
- **mongodb**: MongoDB repository driven adapter
- **postgresql**: PostgreSQL repository driven adapter with R2DBC
- **rest_client**: HTTP REST client driven adapter
- **kafka**: Kafka producer driven adapter

### Examples

**Redis Cache Driven Adapter:**
```bash
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.test.infrastructure.driven-adapters.redis
```

**MongoDB Repository:**
```bash
./gradlew generateOutputAdapter \
  --name=ProductRepository \
  --entity=Product \
  --type=mongodb \
  --packageName=com.pragma.test.infrastructure.driven-adapters.mongodb
```

**PostgreSQL Repository:**
```bash
./gradlew generateOutputAdapter \
  --name=OrderRepository \
  --entity=Order \
  --type=postgresql \
  --packageName=com.pragma.test.infrastructure.driven-adapters.postgresql
```

### Generated Files

1. **Adapter**: `{Name}Adapter.java` - Main adapter implementation
2. **Mapper**: `{Entity}Mapper.java` - MapStruct mapper
3. **Data Entity**: `{Entity}Data.java` - Technology-specific entity

### Generated Operations

All adapters include:
- `save()` - Save entity
- `findById()` - Find by ID
- `findAll()` - Find all entities
- `deleteById()` - Delete by ID
- `existsById()` - Check existence

---

## generateInputAdapter

Generate an entry point (REST controller, GraphQL resolver, gRPC service) with endpoints.

:::info Terminology
In clean architecture, input adapters are called **entry points** because they are the entry points to the application. They are located in `infrastructure/entry-points/`.
:::

### Syntax

```bash
./gradlew generateInputAdapter \
  --name=<AdapterName> \
  --useCase=<UseCaseName> \
  --endpoints=<endpoint1|endpoint2> \
  --packageName=<package> \
  [--type=<adapterType>]
```

### Parameters

| Parameter | Required | Description | Default |
|-----------|----------|-------------|---------|
| `--name` | Yes | Adapter name | - |
| `--useCase` | Yes | Use case to inject | - |
| `--endpoints` | Yes | Endpoint definitions | - |
| `--packageName` | Yes | Full package name | - |
| `--type` | No | Adapter type | `rest` |

### Adapter Types

- **rest**: REST API entry point with Spring WebFlux
- **graphql**: GraphQL resolver entry point (coming soon)
- **grpc**: gRPC service entry point (coming soon)
- **websocket**: WebSocket handler entry point (coming soon)

### Endpoint Format

Endpoints are specified as:
```
/path:METHOD:useCaseMethod:ReturnType:param1:PARAMTYPE:Type1:param2:PARAMTYPE:Type2
```

**Parameter Types:**
- `PATH` - Path variable (`@PathVariable`)
- `BODY` - Request body (`@RequestBody`)
- `QUERY` - Query parameter (`@RequestParam`)

Multiple endpoints separated by `|`

### Examples

**Single Endpoint Entry Point:**
```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userId:PATH:String:userData:BODY:UserData" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

**Multiple Endpoints Entry Point:**
```bash
./gradlew generateInputAdapter \
  --name=Product \
  --useCase=ProductUseCase \
  --endpoints="/products:POST:create:Product:productData:BODY:ProductRequest|/products/{id}:GET:findById:Product:id:PATH:String|/products:GET:findAll:List" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

**Entry Point with Query Parameters:**
```bash
./gradlew generateInputAdapter \
  --name=Order \
  --useCase=OrderUseCase \
  --endpoints="/orders:GET:search:List:status:QUERY:String:userId:QUERY:String" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

### Generated Files

- `{Name}Controller.java` - REST controller with reactive endpoints

### Generated Code Features

- Spring WebFlux reactive endpoints
- Proper HTTP method annotations (`@PostMapping`, `@GetMapping`, etc.)
- Parameter annotations (`@PathVariable`, `@RequestBody`, `@RequestParam`)
- Reactive return types (`Mono<ResponseEntity<T>>`)
- Dependency injection of use cases

---

## Complete Workflow Example

Here's a complete example of creating a User service:

```bash
# 1. Initialize project
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.user

# 2. Generate User entity
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String,age:Integer \
  --packageName=com.pragma.user.domain.model

# 3. Generate CreateUser use case
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.user.domain.port.in

# 4. Generate Redis repository driven adapter
./gradlew generateOutputAdapter \
  --name=UserRepository \
  --entity=User \
  --type=redis \
  --packageName=com.pragma.user.infrastructure.driven-adapters.redis

# 5. Generate REST entry point
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData|/users/{id}:GET:findById:User:id:PATH:String" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest
```

---

## Next Steps

- [Configuration Reference](configuration)
- [Architecture Guides](../guides/architectures/hexagonal)
- [Framework Guides](../guides/frameworks/spring-reactive)
