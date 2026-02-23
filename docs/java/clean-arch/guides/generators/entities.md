# Generating Entities

Learn how to generate domain entities with the Clean Architecture Generator.

## Overview

Entities are the core business objects in your domain layer. They represent the fundamental concepts of your business and contain business logic.

## Basic Usage

```bash
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String \
  --packageName=com.pragma.domain.model
```

## Parameters

### Required Parameters

- **--name**: Entity name in PascalCase (e.g., `User`, `Product`, `Order`)
- **--fields**: Comma-separated list of fields with types
- **--packageName**: Full package name where the entity will be created

### Optional Parameters

- **--hasId**: Include an ID field (default: `true`)
- **--idType**: Type of the ID field (default: `String`)

## Field Types

You can use any Java type for fields:

### Primitive Types
- `String`
- `Integer`, `Long`, `Double`, `Float`
- `Boolean`
- `BigDecimal`

### Date/Time Types
- `LocalDate`
- `LocalDateTime`
- `Instant`

### Custom Types
- Your own domain types
- Enums
- Value objects

## Examples

### Simple Entity

```bash
./gradlew generateEntity \
  --name=Product \
  --fields=name:String,price:BigDecimal,stock:Integer \
  --packageName=com.pragma.ecommerce.domain.model
```

**Generated code:**

```java
package com.pragma.ecommerce.domain.model;

public class Product {
    private String id;
    private String name;
    private BigDecimal price;
    private Integer stock;

    // Constructors
    public Product() {}

    public Product(String id, String name, BigDecimal price, Integer stock) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.stock = stock;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}
```

### Entity with Custom ID Type

```bash
./gradlew generateEntity \
  --name=Order \
  --fields=userId:String,totalAmount:BigDecimal,status:OrderStatus \
  --packageName=com.pragma.ecommerce.domain.model \
  --idType=Long
```

### Entity without ID

For value objects or entities that don't need an ID:

```bash
./gradlew generateEntity \
  --name=Address \
  --fields=street:String,city:String,zipCode:String,country:String \
  --packageName=com.pragma.ecommerce.domain.model \
  --hasId=false
```

### Entity with Date Fields

```bash
./gradlew generateEntity \
  --name=Payment \
  --fields=amount:BigDecimal,currency:String,processedAt:LocalDateTime,status:PaymentStatus \
  --packageName=com.pragma.payment.domain.model
```

### Complex Entity

```bash
./gradlew generateEntity \
  --name=User \
  --fields=username:String,email:String,firstName:String,lastName:String,birthDate:LocalDate,active:Boolean,createdAt:Instant \
  --packageName=com.pragma.user.domain.model
```

## Best Practices

### 1. Use Domain Language

Name your entities using the language of your business domain:

```bash
# Good
./gradlew generateEntity --name=Customer ...
./gradlew generateEntity --name=Invoice ...
./gradlew generateEntity --name=ShoppingCart ...

# Avoid
./gradlew generateEntity --name=UserData ...
./gradlew generateEntity --name=CustomerDTO ...
```

### 2. Keep Entities Focused

Each entity should represent a single concept:

```bash
# Good - Separate concerns
./gradlew generateEntity --name=User --fields=name:String,email:String ...
./gradlew generateEntity --name=Address --fields=street:String,city:String ...

# Avoid - Too many responsibilities
./gradlew generateEntity --name=User --fields=name:String,email:String,street:String,city:String,orderHistory:List ...
```

### 3. Use Appropriate Types

Choose the right type for each field:

```bash
# Good
--fields=price:BigDecimal,quantity:Integer,createdAt:Instant

# Avoid
--fields=price:Double,quantity:String,createdAt:String
```

### 4. Consider ID Strategy

Choose the ID type based on your persistence strategy:

```bash
# UUID for distributed systems
--idType=String

# Auto-increment for traditional databases
--idType=Long

# No ID for value objects
--hasId=false
```

## Adding Business Logic

After generating an entity, you can add business logic methods:

```java
public class Product {
    private String id;
    private String name;
    private BigDecimal price;
    private Integer stock;

    // Generated code...

    // Add business logic
    public boolean isAvailable() {
        return stock > 0;
    }

    public void decreaseStock(int quantity) {
        if (quantity > stock) {
            throw new IllegalArgumentException("Insufficient stock");
        }
        this.stock -= quantity;
    }

    public BigDecimal calculateTotal(int quantity) {
        return price.multiply(BigDecimal.valueOf(quantity));
    }
}
```

## Working with Enums

If you use enum types in your fields, create them separately:

```java
// Create enum manually
package com.pragma.ecommerce.domain.model;

public enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
```

Then use it in your entity:

```bash
./gradlew generateEntity \
  --name=Order \
  --fields=userId:String,totalAmount:BigDecimal,status:OrderStatus \
  --packageName=com.pragma.ecommerce.domain.model
```

## Next Steps

- [Generating Use Cases](use-cases)
- [Generating Adapters](adapters)
- [Domain Layer Best Practices](../architectures/hexagonal#domain-layer)
