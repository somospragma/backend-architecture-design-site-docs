# Create Your First Project

Let's create a complete payment service with clean architecture.

## Initialize the Project

```bash
mkdir payment-service
cd payment-service

cat > build.gradle.kts << 'EOF'
plugins {
    id("com.pragma.archetype-generator") version "1.0.0"
}
EOF

./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.company.payment
```

## Generate Domain Entity

```bash
./gradlew generateEntity \
  --name=Payment \
  --fields="id:String,amount:BigDecimal,status:PaymentStatus"
```

## Generate Use Case

```bash
./gradlew generateUseCase \
  --name=ProcessPayment \
  --input=PaymentRequest \
  --output=PaymentResponse
```

## Generate Adapters

### Output Adapter (Redis Cache)

```bash
./gradlew generateOutputAdapter \
  --type=redis \
  --name=PaymentCache \
  --cacheStrategy=writeThrough \
  --ttl=3600
```

### Input Adapter (REST API)

```bash
./gradlew generateInputAdapter \
  --type=rest \
  --name=Payment \
  --basePath=/api/v1/payments
```

## Build and Run

```bash
./gradlew build
./gradlew bootRun
```

Your service is now running on `http://localhost:8080`!

## What's Next?

- [Learn about Hexagonal Architecture](../guides/architectures/hexagonal)
- [Explore all available commands](../reference/commands)
- [Add more adapters](../guides/frameworks/spring-reactive)
