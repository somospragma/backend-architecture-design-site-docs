# Onion Single Module

## Descripción

La arquitectura Onion (Cebolla) organiza el código en capas concéntricas, con el dominio en el centro y las dependencias apuntando hacia adentro. Es ideal para proyectos que priorizan Domain-Driven Design (DDD) y la independencia total del dominio.

## Características

- **Módulos Gradle**: 1 módulo único
- **Complejidad**: Media
- **Ideal para**: Proyectos con dominio rico, DDD
- **Tamaño de equipo**: 1-5 desarrolladores
- **Tiempo de build**: Rápido
- **Patrón**: Capas concéntricas

## Estructura del Proyecto

```
my-project/
├── build.gradle
├── settings.gradle
└── src/
    ├── main/
    │   ├── java/com/example/myproject/
    │   │   ├── core/                       # Capas internas
    │   │   │   ├── domain/                 # Capa más interna
    │   │   │   │   ├── User.java
    │   │   │   │   ├── Product.java
    │   │   │   │   └── Order.java
    │   │   │   └── application/            # Capa de aplicación
    │   │   │       ├── service/            # Servicios y casos de uso
    │   │   │       │   ├── CreateUserService.java
    │   │   │       │   └── GetProductService.java
    │   │   │       └── port/               # Interfaces de puertos
    │   │   │           ├── IUserRepository.java
    │   │   │           ├── IProductRepository.java
    │   │   │           └── IEmailService.java
    │   │   └── infrastructure/             # Capa más externa
    │   │       ├── adapter/
    │   │       │   ├── in/                 # Adaptadores de entrada
    │   │       │   │   └── rest/
    │   │       │   │       ├── UserController.java
    │   │       │   │       └── ProductController.java
    │   │       │   └── out/                # Adaptadores de salida
    │   │       │       ├── mongodb/
    │   │       │       │   ├── UserMongoAdapter.java
    │   │       │       │   └── UserMongoRepository.java
    │   │       │       ├── redis/
    │   │       │       │   └── CacheAdapter.java
    │   │       │       └── email/
    │   │       │           └── EmailAdapter.java
    │   │       └── config/                 # Configuración
    │   │           ├── BeanConfiguration.java
    │   │           └── SecurityConfig.java
    │   └── resources/
    │       ├── application.yml
    │       └── logback.xml
    └── test/
```

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                           │
│                    (Capa Externa)                           │
│                                                             │
│  ┌──────────────┐                        ┌──────────────┐  │
│  │  Adapter In  │                        │  Adapter Out │  │
│  │    (REST)    │                        │  (MongoDB)   │  │
│  └──────┬───────┘                        └──────┬───────┘  │
│         │                                       │          │
│         │  ┌─────────────────────────────┐     │          │
│         └─→│   CORE / APPLICATION        │←────┘          │
│            │   (Capa de Aplicación)      │                │
│            │                             │                │
│            │  ┌───────────────────┐     │                │
│            │  │     Services      │     │                │
│            │  │   (Use Cases)     │     │                │
│            │  └─────────┬─────────┘     │                │
│            │            │               │                │
│            │  ┌─────────▼─────────┐     │                │
│            │  │      Ports        │     │                │
│            │  │   (Interfaces)    │     │                │
│            │  └───────────────────┘     │                │
│            └────────────┬────────────────┘                │
│                         │                                 │
│            ┌────────────▼────────────┐                    │
│            │    CORE / DOMAIN        │                    │
│            │  (Capa más Interna)     │                    │
│            │                         │                    │
│            │  ┌─────────────────┐   │                    │
│            │  │    Entities     │   │                    │
│            │  │  Value Objects  │   │                    │
│            │  │  Business Rules │   │                    │
│            │  └─────────────────┘   │                    │
│            └─────────────────────────┘                    │
└─────────────────────────────────────────────────────────────┘

Regla de Dependencia: Las flechas apuntan hacia el centro
```

## Capas y Responsabilidades

### Core / Domain (Núcleo del Dominio)

**Ubicación**: `core/domain/`

**Dependencias**: Ninguna (capa más interna)

**Responsabilidades**:
- Entidades del dominio con lógica de negocio
- Objetos de valor inmutables
- Reglas de negocio puras
- Eventos del dominio
- Excepciones del dominio

**Características**:
- Sin dependencias externas
- Sin anotaciones de frameworks
- Lógica de negocio pura
- Fácilmente testeable

**Ejemplo**:
```java
// core/domain/User.java
public class User {
    private final UserId id;
    private final Email email;
    private final UserName name;
    private UserStatus status;
    
    public User(UserId id, Email email, UserName name) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.status = UserStatus.ACTIVE;
    }
    
    // Lógica de negocio
    public void deactivate() {
        if (this.status == UserStatus.DELETED) {
            throw new UserAlreadyDeletedException();
        }
        this.status = UserStatus.INACTIVE;
    }
    
    public boolean canLogin() {
        return this.status == UserStatus.ACTIVE;
    }
}

// core/domain/Email.java (Value Object)
public class Email {
    private final String value;
    
    public Email(String value) {
        if (!isValid(value)) {
            throw new InvalidEmailException(value);
        }
        this.value = value;
    }
    
    private boolean isValid(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
    }
}
```

### Core / Application (Capa de Aplicación)

**Ubicación**: `core/application/`

**Dependencias**: Solo `core/domain`

**Responsabilidades**:
- Servicios de aplicación (casos de uso)
- Orquestación de lógica de negocio
- Definición de puertos (interfaces)
- Coordinación de transacciones

**Componentes**:
- **service/**: Implementación de casos de uso
- **port/**: Interfaces que definen contratos con el exterior

**Ejemplo**:
```java
// core/application/port/IUserRepository.java
public interface IUserRepository {
    Mono<User> save(User user);
    Mono<User> findById(UserId id);
    Mono<User> findByEmail(Email email);
    Mono<Void> delete(UserId id);
}

// core/application/port/IEmailService.java
public interface IEmailService {
    Mono<Void> sendWelcomeEmail(Email email, UserName name);
}

// core/application/service/CreateUserService.java
public class CreateUserService {
    private final IUserRepository userRepository;
    private final IEmailService emailService;
    
    public CreateUserService(IUserRepository userRepository, IEmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }
    
    public Mono<User> execute(String email, String name) {
        Email emailVO = new Email(email);
        UserName nameVO = new UserName(name);
        UserId id = UserId.generate();
        
        User user = new User(id, emailVO, nameVO);
        
        return userRepository.save(user)
            .flatMap(savedUser -> 
                emailService.sendWelcomeEmail(emailVO, nameVO)
                    .thenReturn(savedUser)
            );
    }
}
```

### Infrastructure (Capa de Infraestructura)

**Ubicación**: `infrastructure/`

**Dependencias**: `core/domain`, `core/application`

**Responsabilidades**:
- Implementación de adaptadores
- Detalles técnicos y frameworks
- Configuración de la aplicación
- Punto de entrada (main class)

**Componentes**:
- **adapter/in/**: Adaptadores de entrada (REST, GraphQL, CLI)
- **adapter/out/**: Adaptadores de salida (DB, APIs, Email)
- **config/**: Configuración de Spring, beans, seguridad

**Ejemplo**:
```java
// infrastructure/adapter/in/rest/UserController.java
@RestController
@RequestMapping("/api/users")
public class UserController {
    private final CreateUserService createUserService;
    
    @PostMapping
    public Mono<UserResponse> createUser(@RequestBody CreateUserRequest request) {
        return createUserService.execute(request.getEmail(), request.getName())
            .map(UserResponse::from);
    }
}

// infrastructure/adapter/out/mongodb/UserMongoAdapter.java
@Repository
public class UserMongoAdapter implements IUserRepository {
    private final ReactiveMongoTemplate mongoTemplate;
    
    @Override
    public Mono<User> save(User user) {
        UserDocument document = UserDocument.from(user);
        return mongoTemplate.save(document)
            .map(UserDocument::toDomain);
    }
    
    @Override
    public Mono<User> findById(UserId id) {
        return mongoTemplate.findById(id.getValue(), UserDocument.class)
            .map(UserDocument::toDomain);
    }
}

// infrastructure/adapter/out/email/EmailAdapter.java
@Service
public class EmailAdapter implements IEmailService {
    private final JavaMailSender mailSender;
    
    @Override
    public Mono<Void> sendWelcomeEmail(Email email, UserName name) {
        return Mono.fromRunnable(() -> {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email.getValue());
            message.setSubject("Welcome!");
            message.setText("Welcome " + name.getValue());
            mailSender.send(message);
        });
    }
}
```

## Reglas de Dependencia

### Principio Fundamental

**Las dependencias SIEMPRE apuntan hacia el centro (dominio)**

```
Infrastructure → Application → Domain
     ↓               ↓            ↓
  Frameworks      Services    Business Logic
  Adapters        Ports       Entities
  Config                      Value Objects
```

### Reglas Estrictas

1. **Domain no depende de nada**: Cero dependencias externas
2. **Application depende solo de Domain**: No conoce la infraestructura
3. **Infrastructure depende de todo**: Implementa los puertos definidos en Application

### Inversión de Dependencias

Los adaptadores implementan interfaces definidas en el core:

```java
// Definido en core/application/port/
public interface IUserRepository { ... }

// Implementado en infrastructure/adapter/out/
public class UserMongoAdapter implements IUserRepository { ... }
```

## Diferencias con Hexagonal

| Aspecto | Hexagonal | Onion |
|---------|-----------|-------|
| **Organización** | Ports & Adapters | Capas Concéntricas |
| **Enfoque** | Puertos y adaptadores | Capas de dentro hacia afuera |
| **Dominio** | domain/model + domain/port | core/domain (solo entidades) |
| **Puertos** | En el dominio | En application |
| **Casos de Uso** | application/usecase | core/application/service |
| **Adaptadores** | infrastructure/entry-points + driven-adapters | infrastructure/adapter/in + out |
| **Convención de nombres** | Sufijos (UseCase, Repository) | Prefijos (IRepository, IService) |

## Cuándo Usar Esta Arquitectura

### ✅ Casos de Uso Ideales

- Proyectos con dominio rico y complejo
- Aplicaciones que siguen Domain-Driven Design (DDD)
- Cuando la lógica de negocio es el núcleo del proyecto
- Proyectos que priorizan la independencia del dominio
- Aplicaciones con reglas de negocio complejas
- Cuando quieres máxima testabilidad del dominio

### ❌ Cuándo NO Usar

- Proyectos CRUD simples sin lógica de negocio
- Cuando el dominio es trivial
- Prototipos rápidos
- Aplicaciones centradas en datos más que en lógica

## Ventajas

1. **Dominio completamente independiente**: Sin dependencias de frameworks
2. **Reglas de dependencia muy claras**: Siempre hacia el centro
3. **Excelente para DDD**: Estructura natural para Domain-Driven Design
4. **Testabilidad máxima**: El dominio se testea sin frameworks
5. **Separación clara de responsabilidades**: Cada capa tiene un propósito específico
6. **Build rápido**: Single module compila rápidamente

## Desventajas

1. **Curva de aprendizaje**: Requiere entender el patrón de capas concéntricas
2. **Más interfaces**: Puede requerir más interfaces que Hexagonal
3. **Overhead para proyectos simples**: Excesivo para CRUDs básicos
4. **Reutilización limitada**: Single module dificulta reutilizar componentes

## Comandos del Plugin

### Crear un Nuevo Proyecto

```bash
gradle initCleanArch \
  --name=my-project \
  --package=com.example.myproject \
  --architecture=onion-single \
  --framework=spring \
  --paradigm=reactive
```

### Generar un Adaptador de Salida

```bash
gradle generateOutputAdapter \
  --name=mongodb \
  --type=database
```

Esto creará:
- `infrastructure/adapter/out/mongodb/MongodbAdapter.java`
- `infrastructure/adapter/out/mongodb/MongodbRepository.java`
- Configuración en `application.yml`

### Generar un Adaptador de Entrada

```bash
gradle generateInputAdapter \
  --name=rest \
  --type=web
```

Esto creará:
- `infrastructure/adapter/in/rest/RestController.java`
- Configuración necesaria

## Ejemplo Completo con DDD

### 1. Crear el Proyecto

```bash
gradle initCleanArch \
  --name=order-service \
  --package=com.example.orderservice \
  --architecture=onion-single \
  --framework=spring \
  --paradigm=reactive
```

### 2. Definir el Dominio (DDD)

```java
// core/domain/Order.java (Aggregate Root)
public class Order {
    private final OrderId id;
    private final CustomerId customerId;
    private final List<OrderLine> lines;
    private OrderStatus status;
    private Money total;
    
    public Order(OrderId id, CustomerId customerId) {
        this.id = id;
        this.customerId = customerId;
        this.lines = new ArrayList<>();
        this.status = OrderStatus.DRAFT;
        this.total = Money.zero();
    }
    
    // Business logic
    public void addLine(ProductId productId, Quantity quantity, Money price) {
        if (status != OrderStatus.DRAFT) {
            throw new OrderAlreadyConfirmedException();
        }
        
        OrderLine line = new OrderLine(productId, quantity, price);
        lines.add(line);
        recalculateTotal();
    }
    
    public void confirm() {
        if (lines.isEmpty()) {
            throw new EmptyOrderException();
        }
        if (status != OrderStatus.DRAFT) {
            throw new OrderAlreadyConfirmedException();
        }
        
        this.status = OrderStatus.CONFIRMED;
        // Domain event
        DomainEvents.raise(new OrderConfirmedEvent(this.id));
    }
    
    private void recalculateTotal() {
        this.total = lines.stream()
            .map(OrderLine::getSubtotal)
            .reduce(Money.zero(), Money::add);
    }
}

// core/domain/Money.java (Value Object)
public class Money {
    private final BigDecimal amount;
    private final Currency currency;
    
    public Money(BigDecimal amount, Currency currency) {
        if (amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new NegativeAmountException();
        }
        this.amount = amount;
        this.currency = currency;
    }
    
    public Money add(Money other) {
        if (!this.currency.equals(other.currency)) {
            throw new DifferentCurrencyException();
        }
        return new Money(this.amount.add(other.amount), this.currency);
    }
    
    public static Money zero() {
        return new Money(BigDecimal.ZERO, Currency.USD);
    }
}
```

### 3. Definir Servicios y Puertos

```java
// core/application/port/IOrderRepository.java
public interface IOrderRepository {
    Mono<Order> save(Order order);
    Mono<Order> findById(OrderId id);
    Flux<Order> findByCustomerId(CustomerId customerId);
}

// core/application/port/IInventoryService.java
public interface IInventoryService {
    Mono<Boolean> checkAvailability(ProductId productId, Quantity quantity);
    Mono<Void> reserve(ProductId productId, Quantity quantity);
}

// core/application/service/CreateOrderService.java
public class CreateOrderService {
    private final IOrderRepository orderRepository;
    private final IInventoryService inventoryService;
    
    public Mono<Order> execute(CustomerId customerId, List<OrderLineRequest> lines) {
        OrderId orderId = OrderId.generate();
        Order order = new Order(orderId, customerId);
        
        return Flux.fromIterable(lines)
            .flatMap(line -> 
                inventoryService.checkAvailability(line.getProductId(), line.getQuantity())
                    .filter(available -> available)
                    .switchIfEmpty(Mono.error(new ProductNotAvailableException()))
                    .thenReturn(line)
            )
            .doOnNext(line -> order.addLine(
                line.getProductId(), 
                line.getQuantity(), 
                line.getPrice()
            ))
            .then(orderRepository.save(order));
    }
}
```

### 4. Implementar Adaptadores

```bash
# Generar adaptadores
gradle generateOutputAdapter --name=mongodb --type=database
gradle generateInputAdapter --name=rest --type=web
```

```java
// infrastructure/adapter/out/mongodb/OrderMongoAdapter.java
@Repository
public class OrderMongoAdapter implements IOrderRepository {
    private final ReactiveMongoTemplate mongoTemplate;
    
    @Override
    public Mono<Order> save(Order order) {
        OrderDocument document = OrderDocument.from(order);
        return mongoTemplate.save(document)
            .map(OrderDocument::toDomain);
    }
}

// infrastructure/adapter/in/rest/OrderController.java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final CreateOrderService createOrderService;
    
    @PostMapping
    public Mono<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        CustomerId customerId = new CustomerId(request.getCustomerId());
        List<OrderLineRequest> lines = request.getLines();
        
        return createOrderService.execute(customerId, lines)
            .map(OrderResponse::from);
    }
}
```

## Mejores Prácticas

1. **Dominio puro**: No uses anotaciones de frameworks en core/domain
2. **Value Objects**: Usa objetos de valor para conceptos del dominio
3. **Aggregate Roots**: Identifica y protege los agregados
4. **Domain Events**: Usa eventos para comunicar cambios importantes
5. **Prefijos en interfaces**: Usa "I" para interfaces de puertos (IRepository, IService)
6. **Validación en el dominio**: Las reglas de negocio viven en las entidades
7. **Inmutabilidad**: Prefiere objetos inmutables en el dominio
8. **Testing por capas**:
   - Domain: Unit tests puros sin frameworks
   - Application: Tests con mocks de puertos
   - Infrastructure: Integration tests

## Patrones DDD Comunes

### Aggregate Root
```java
public class Order {
    // Order es el aggregate root
    // Controla el acceso a OrderLine
    private List<OrderLine> lines;
    
    public void addLine(...) {
        // Solo Order puede modificar sus líneas
    }
}
```

### Value Object
```java
public class Email {
    private final String value;
    
    // Inmutable, validación en constructor
    public Email(String value) {
        validate(value);
        this.value = value;
    }
}
```

### Domain Event
```java
public class OrderConfirmedEvent {
    private final OrderId orderId;
    private final Instant occurredOn;
    
    // Representa algo que pasó en el dominio
}
```

### Repository Pattern
```java
public interface IOrderRepository {
    // Abstracción de persistencia
    Mono<Order> save(Order order);
    Mono<Order> findById(OrderId id);
}
```

## Recursos Adicionales

- [Comparación de Arquitecturas](./overview.md)
- [Hexagonal Single Module](./hexagonal-single.md) - Alternativa con Ports & Adapters
- [Domain-Driven Design](https://martinfowler.com/tags/domain%20driven%20design.html)
- [Comandos del Plugin](../commands/init-clean-arch.md)
