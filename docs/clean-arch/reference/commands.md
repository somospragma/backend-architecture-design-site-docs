# Commands Reference

Complete reference of all available Gradle tasks.

## initCleanArch

Initialize a new clean architecture project.

```bash
./gradlew initCleanArch \
  --architecture=<type> \
  --paradigm=<paradigm> \
  --framework=<framework> \
  --package=<package>
```

### Parameters

- `--architecture`: Architecture type
  - `hexagonal-single`: Single module hexagonal
  - `hexagonal-multi`: Multi module hexagonal (3 modules)
  - `hexagonal-multi-granular`: Granular multi module
  - `onion-single`: Single module onion
  - `onion-multi`: Multi module onion

- `--paradigm`: Programming paradigm
  - `reactive`: Non-blocking, reactive streams
  - `imperative`: Traditional blocking I/O

- `--framework`: Framework to use
  - `spring`: Spring Boot
  - `quarkus`: Quarkus (coming soon)

- `--package`: Base package (e.g., `com.company.service`)

### Example

```bash
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.company.payment
```

---

## generateEntity

Generate a domain entity.

```bash
./gradlew generateEntity \
  --name=<EntityName> \
  [--fields="field1:Type1,field2:Type2"]
```

### Parameters

- `--name`: Entity name (PascalCase)
- `--fields`: Optional comma-separated fields

### Example

```bash
./gradlew generateEntity \
  --name=Payment \
  --fields="id:String,amount:BigDecimal,status:PaymentStatus"
```

---

## generateUseCase

Generate a use case.

```bash
./gradlew generateUseCase \
  --name=<UseCaseName> \
  [--input=<InputType>] \
  [--output=<OutputType>]
```

### Parameters

- `--name`: Use case name (PascalCase)
- `--input`: Optional input type
- `--output`: Optional output type

### Example

```bash
./gradlew generateUseCase \
  --name=ProcessPayment \
  --input=PaymentRequest \
  --output=PaymentResponse
```

---

## generateOutputAdapter

Generate an output adapter (repository, cache, client).

```bash
./gradlew generateOutputAdapter \
  --type=<adapterType> \
  --name=<AdapterName> \
  [--options]
```

### Adapter Types

- `redis`: Redis cache
- `dynamodb`: DynamoDB repository
- `postgresql`: PostgreSQL repository
- `mongodb`: MongoDB repository
- `kafka`: Kafka producer
- `httpclient`: HTTP client

### Example (Redis)

```bash
./gradlew generateOutputAdapter \
  --type=redis \
  --name=PaymentCache \
  --cacheStrategy=writeThrough \
  --ttl=3600
```

---

## generateInputAdapter

Generate an input adapter (controller, consumer).

```bash
./gradlew generateInputAdapter \
  --type=<adapterType> \
  --name=<AdapterName> \
  [--options]
```

### Adapter Types

- `rest`: REST API controller
- `graphql`: GraphQL resolver
- `kafka`: Kafka consumer
- `grpc`: gRPC service

### Example (REST)

```bash
./gradlew generateInputAdapter \
  --type=rest \
  --name=Payment \
  --basePath=/api/v1/payments
```

---

## listComponents

List all generated components in the project.

```bash
./gradlew listComponents
```

### Output

```
Components in payment-service:

Input Adapters:
  - PaymentController (rest) - created 2026-01-31

Output Adapters:
  - PaymentCacheRedisAdapter (redis) - created 2026-01-31
  - PaymentRepositoryDynamoDbAdapter (dynamodb) - created 2026-01-31

Use Cases:
  - ProcessPaymentUseCase - created 2026-01-31

Entities:
  - Payment - created 2026-01-31
```

---

## Next Steps

- [Quick Start Guide](../getting-started/quick-start)
- [Configuration Reference](configuration)
