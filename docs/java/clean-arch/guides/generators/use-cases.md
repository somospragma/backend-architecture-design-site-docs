# Generating Use Cases

Learn how to generate use cases with ports and implementations.

## Overview

Use cases represent the application's business logic and orchestrate the flow of data between entities and adapters. Each use case is defined by a port (interface) and an implementation.

## Basic Usage

```bash
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.domain.port.in
```

## Parameters

### Required Parameters

- **--name**: Use case name in PascalCase (e.g., `CreateUser`, `ProcessPayment`)
- **--methods**: Method definitions with parameters
- **--packageName**: Package for the port interface (usually `domain.port.in`)

### Optional Parameters

- **--generatePort**: Generate port interface (default: `true`)
- **--generateImpl**: Generate implementation (default: `true`)

## Method Format

Methods are defined as: `methodName:ReturnType:param1:Type1:param2:Type2`

Multiple methods separated by `|`:
```
method1:Type1:param1:Type1|method2:Type2:param2:Type2
```

## Examples

### Single Method Use Case

```bash
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.user.domain.port.in
```

**Generated Port:**

```java
package com.pragma.user.domain.port.in;

/**
 * Use case: CreateUser
 * Port interface defining the contract for this use case.
 */
public interface CreateUserUseCase {

  /**
   * execute
   * @param userData UserData
   * @return User
   */
  User execute(UserData userData);

}
```

**Generated Implementation:**

```java
package com.pragma.user.application.usecase;

import com.pragma.user.domain.port.in.CreateUserUseCase;

/**
 * Implementation of CreateUserUseCase.
 */
public class CreateUserUseCaseImpl implements CreateUserUseCase {

  @Override
  public User execute(UserData userData) {
    // TODO: Implement use case logic
    throw new UnsupportedOperationException("Not implemented yet");
  }

}
```

### Multiple Methods Use Case

```bash
./gradlew generateUseCase \
  --name=ProductManagement \
  --methods=create:Product:data:ProductData|update:Product:id:String:data:ProductData|delete:Boolean:id:String \
  --packageName=com.pragma.ecommerce.domain.port.in
```

**Generated Port:**

```java
package com.pragma.ecommerce.domain.port.in;

public interface ProductManagementUseCase {

  Product create(ProductData data);
  
  Product update(String id, ProductData data);
  
  Boolean delete(String id);

}
```

### Query Use Case

```bash
./gradlew generateUseCase \
  --name=FindUser \
  --methods=findById:User:id:String|findByEmail:User:email:String|findAll:List \
  --packageName=com.pragma.user.domain.port.in
```

### Command Use Case

```bash
./gradlew generateUseCase \
  --name=ProcessPayment \
  --methods=process:PaymentResult:payment:Payment:paymentMethod:PaymentMethod \
  --packageName=com.pragma.payment.domain.port.in
```

### Reactive Use Case

For reactive applications, use reactive return types:

```bash
./gradlew generateUseCase \
  --name=CreateOrder \
  --methods=execute:Mono:orderData:OrderData \
  --packageName=com.pragma.order.domain.port.in
```

Then manually update the generated code to use proper reactive types:

```java
public interface CreateOrderUseCase {
  Mono<Order> execute(OrderData orderData);
}
```

## Use Case Patterns

### 1. Command Pattern

Single method that performs an action:

```bash
./gradlew generateUseCase \
  --name=SendEmail \
  --methods=send:Boolean:recipient:String:subject:String:body:String \
  --packageName=com.pragma.notification.domain.port.in
```

### 2. Query Pattern

Single method that retrieves data:

```bash
./gradlew generateUseCase \
  --name=GetUserProfile \
  --methods=execute:UserProfile:userId:String \
  --packageName=com.pragma.user.domain.port.in
```

### 3. CRUD Pattern

Multiple methods for entity management:

```bash
./gradlew generateUseCase \
  --name=UserCrud \
  --methods=create:User:data:UserData|read:User:id:String|update:User:id:String:data:UserData|delete:Boolean:id:String \
  --packageName=com.pragma.user.domain.port.in
```

### 4. Validation Pattern

Use case that validates and processes:

```bash
./gradlew generateUseCase \
  --name=ValidateAndCreateOrder \
  --methods=execute:OrderResult:orderRequest:OrderRequest \
  --packageName=com.pragma.order.domain.port.in
```

## Implementing Use Case Logic

After generation, implement the business logic in the implementation class:

```java
@Service
public class CreateUserUseCaseImpl implements CreateUserUseCase {

  private final UserRepository userRepository;
  private final EmailService emailService;

  public CreateUserUseCaseImpl(
      UserRepository userRepository,
      EmailService emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  @Override
  public User execute(UserData userData) {
    // 1. Validate input
    validateUserData(userData);
    
    // 2. Check if user exists
    if (userRepository.existsByEmail(userData.getEmail())) {
      throw new UserAlreadyExistsException(userData.getEmail());
    }
    
    // 3. Create user entity
    User user = new User();
    user.setName(userData.getName());
    user.setEmail(userData.getEmail());
    user.setCreatedAt(Instant.now());
    
    // 4. Save user
    User savedUser = userRepository.save(user);
    
    // 5. Send welcome email
    emailService.sendWelcomeEmail(savedUser.getEmail());
    
    return savedUser;
  }

  private void validateUserData(UserData userData) {
    if (userData.getName() == null || userData.getName().isBlank()) {
      throw new ValidationException("Name is required");
    }
    if (userData.getEmail() == null || !isValidEmail(userData.getEmail())) {
      throw new ValidationException("Valid email is required");
    }
  }

  private boolean isValidEmail(String email) {
    return email.matches("^[A-Za-z0-9+_.-]+@(.+)$");
  }
}
```

## Reactive Implementation

For reactive use cases with Spring WebFlux:

```java
@Service
public class CreateUserUseCaseImpl implements CreateUserUseCase {

  private final UserRepository userRepository;
  private final EmailService emailService;

  public CreateUserUseCaseImpl(
      UserRepository userRepository,
      EmailService emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  @Override
  public Mono<User> execute(UserData userData) {
    return validateUserData(userData)
        .then(checkUserNotExists(userData.getEmail()))
        .then(createUser(userData))
        .flatMap(user -> userRepository.save(user))
        .flatMap(user -> sendWelcomeEmail(user)
            .thenReturn(user));
  }

  private Mono<Void> validateUserData(UserData userData) {
    if (userData.getName() == null || userData.getName().isBlank()) {
      return Mono.error(new ValidationException("Name is required"));
    }
    if (userData.getEmail() == null) {
      return Mono.error(new ValidationException("Email is required"));
    }
    return Mono.empty();
  }

  private Mono<Void> checkUserNotExists(String email) {
    return userRepository.existsByEmail(email)
        .flatMap(exists -> exists 
            ? Mono.error(new UserAlreadyExistsException(email))
            : Mono.empty());
  }

  private Mono<User> createUser(UserData userData) {
    User user = new User();
    user.setName(userData.getName());
    user.setEmail(userData.getEmail());
    user.setCreatedAt(Instant.now());
    return Mono.just(user);
  }

  private Mono<Void> sendWelcomeEmail(User user) {
    return emailService.sendWelcomeEmail(user.getEmail());
  }
}
```

## Best Practices

### 1. Single Responsibility

Each use case should do one thing:

```bash
# Good - Focused use cases
./gradlew generateUseCase --name=CreateUser ...
./gradlew generateUseCase --name=UpdateUser ...
./gradlew generateUseCase --name=DeleteUser ...

# Avoid - Too many responsibilities
./gradlew generateUseCase --name=UserManagement --methods=create:User:...|update:User:...|delete:Boolean:...|sendEmail:Boolean:...
```

### 2. Clear Naming

Use descriptive names that reflect the business action:

```bash
# Good
./gradlew generateUseCase --name=ProcessPayment ...
./gradlew generateUseCase --name=CancelOrder ...
./gradlew generateUseCase --name=SendInvoice ...

# Avoid
./gradlew generateUseCase --name=DoStuff ...
./gradlew generateUseCase --name=Handler ...
```

### 3. Input Validation

Always validate inputs in your use case:

```java
@Override
public User execute(UserData userData) {
  // Validate first
  validateUserData(userData);
  
  // Then process
  // ...
}
```

### 4. Dependency Injection

Inject dependencies through constructor:

```java
public class CreateUserUseCaseImpl implements CreateUserUseCase {

  private final UserRepository userRepository;
  private final EmailService emailService;

  // Constructor injection
  public CreateUserUseCaseImpl(
      UserRepository userRepository,
      EmailService emailService) {
    this.userRepository = userRepository;
    this.emailService = emailService;
  }
}
```

### 5. Error Handling

Handle errors appropriately:

```java
@Override
public User execute(UserData userData) {
  try {
    // Business logic
  } catch (ValidationException e) {
    // Handle validation errors
    throw e;
  } catch (Exception e) {
    // Handle unexpected errors
    throw new UseCaseException("Failed to create user", e);
  }
}
```

## Port Only Generation

If you want to generate only the port interface (useful when implementing manually):

```bash
./gradlew generateUseCase \
  --name=ComplexBusinessLogic \
  --methods=execute:Result:input:ComplexInput \
  --packageName=com.pragma.domain.port.in \
  --generateImpl=false
```

## Next Steps

- [Generating Output Adapters](output-adapters)
- [Generating Input Adapters](input-adapters)
- [Application Layer Best Practices](../architectures/hexagonal#application-layer)
