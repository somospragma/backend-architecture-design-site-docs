# Generating Entry Points

Learn how to generate entry points like REST controllers, GraphQL resolvers, and message consumers.

## Overview

Entry points handle incoming requests from external sources (HTTP, GraphQL, gRPC, message queues) and delegate to use cases. They are the entry points to your application.

:::info Terminology
In clean architecture, input adapters are called **entry points** because they are the entry points to the application. They are located in `infrastructure/entry-points/`.
:::

## Basic Usage

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData" \
  --packageName=com.pragma.infrastructure.entry-points.rest
```

## Parameters

### Required Parameters

- **--name**: Adapter name (e.g., `User`, `Product`, `Order`)
- **--useCase**: Use case to inject and call
- **--endpoints**: Endpoint definitions (see format below)
- **--packageName**: Full package name for the controller

### Optional Parameters

- **--type**: Adapter type (default: `rest`)
  - `rest`: REST API controller
  - `graphql`: GraphQL resolver (coming soon)
  - `grpc`: gRPC service (coming soon)
  - `websocket`: WebSocket handler (coming soon)

## Endpoint Format

Endpoints are defined as:
```
/path:METHOD:useCaseMethod:ReturnType:param1:PARAMTYPE:Type1:param2:PARAMTYPE:Type2
```

### Components

- **path**: URL path (e.g., `/users`, `/products/{id}`)
- **METHOD**: HTTP method (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`)
- **useCaseMethod**: Method name in the use case
- **ReturnType**: Return type of the endpoint
- **parameters**: List of parameters with their types

### Parameter Types

- **PATH**: Path variable (`@PathVariable`)
- **BODY**: Request body (`@RequestBody`)
- **QUERY**: Query parameter (`@RequestParam`)

### Multiple Endpoints

Separate multiple endpoints with `|`:
```
/users:POST:create:User:data:BODY:UserData|/users/{id}:GET:findById:User:id:PATH:String
```

## Examples

### Simple POST Endpoint

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest
```

**Generated Controller:**

```java
package com.pragma.user.infrastructure.entry-points.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
public class UserController {

  private final CreateUserUseCase createUserUseCase;

  public UserController(CreateUserUseCase createUserUseCase) {
    this.createUserUseCase = createUserUseCase;
  }

  /**
   * POST /users
   */
  @PostMapping("/users")
  public Mono<ResponseEntity<User>> execute(
      @RequestBody UserData userData) {
    return createUserUseCase.execute(userData)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

### CRUD Controller

```bash
./gradlew generateInputAdapter \
  --name=Product \
  --useCase=ProductUseCase \
  --endpoints="/products:POST:create:Product:productData:BODY:ProductRequest|/products/{id}:GET:findById:Product:id:PATH:String|/products:GET:findAll:List|/products/{id}:DELETE:delete:Boolean:id:PATH:String" \
  --packageName=com.pragma.ecommerce.infrastructure.entry-points.rest
```

**Generated Controller:**

```java
@RestController
@RequestMapping("/api")
public class ProductController {

  private final ProductUseCase productUseCase;

  public ProductController(ProductUseCase productUseCase) {
    this.productUseCase = productUseCase;
  }

  @PostMapping("/products")
  public Mono<ResponseEntity<Product>> create(
      @RequestBody ProductRequest productData) {
    return productUseCase.create(productData)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

  @GetMapping("/products/{id}")
  public Mono<ResponseEntity<Product>> findById(
      @PathVariable String id) {
    return productUseCase.findById(id)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

  @GetMapping("/products")
  public Mono<ResponseEntity<List>> findAll() {
    return productUseCase.findAll()
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

  @DeleteMapping("/products/{id}")
  public Mono<ResponseEntity<Boolean>> delete(
      @PathVariable String id) {
    return productUseCase.delete(id)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

### Controller with Query Parameters

```bash
./gradlew generateInputAdapter \
  --name=Order \
  --useCase=OrderUseCase \
  --endpoints="/orders:GET:search:List:status:QUERY:String:userId:QUERY:String" \
  --packageName=com.pragma.order.infrastructure.entry-points.rest
```

**Generated Controller:**

```java
@RestController
@RequestMapping("/api")
public class OrderController {

  private final OrderUseCase orderUseCase;

  public OrderController(OrderUseCase orderUseCase) {
    this.orderUseCase = orderUseCase;
  }

  @GetMapping("/orders")
  public Mono<ResponseEntity<List>> search(
      @RequestParam String status,
      @RequestParam String userId) {
    return orderUseCase.search(status, userId)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

### Controller with Path Variables and Body

```bash
./gradlew generateInputAdapter \
  --name=Payment \
  --useCase=PaymentUseCase \
  --endpoints="/payments/{orderId}:POST:process:PaymentResult:orderId:PATH:String:paymentData:BODY:PaymentRequest" \
  --packageName=com.pragma.payment.infrastructure.entry-points.rest
```

### Update Endpoint (PUT)

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=UpdateUserUseCase \
  --endpoints="/users/{id}:PUT:update:User:id:PATH:String:userData:BODY:UserData" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest
```

## Customizing Controllers

After generation, you can customize the controller:

### 1. Add Validation

```java
@RestController
@RequestMapping("/api")
@Validated
public class UserController {

  @PostMapping("/users")
  public Mono<ResponseEntity<User>> execute(
      @Valid @RequestBody UserData userData) {
    return createUserUseCase.execute(userData)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

### 2. Add Error Handling

```java
@RestController
@RequestMapping("/api")
public class UserController {

  @PostMapping("/users")
  public Mono<ResponseEntity<User>> execute(
      @RequestBody UserData userData) {
    return createUserUseCase.execute(userData)
        .map(result -> ResponseEntity.ok(result))
        .onErrorResume(ValidationException.class, e -> 
            Mono.just(ResponseEntity.badRequest().build()))
        .onErrorResume(UserAlreadyExistsException.class, e -> 
            Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).build()))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

### 3. Add Response Status

```java
@PostMapping("/users")
@ResponseStatus(HttpStatus.CREATED)
public Mono<ResponseEntity<User>> execute(
    @RequestBody UserData userData) {
  return createUserUseCase.execute(userData)
      .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result));
}
```

### 4. Add Documentation (OpenAPI)

```java
@RestController
@RequestMapping("/api")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

  @PostMapping("/users")
  @Operation(summary = "Create a new user", description = "Creates a new user in the system")
  @ApiResponses(value = {
      @ApiResponse(responseCode = "201", description = "User created successfully"),
      @ApiResponse(responseCode = "400", description = "Invalid input"),
      @ApiResponse(responseCode = "409", description = "User already exists")
  })
  public Mono<ResponseEntity<User>> execute(
      @RequestBody @Parameter(description = "User data") UserData userData) {
    return createUserUseCase.execute(userData)
        .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result));
  }

}
```

### 5. Add Security

```java
@RestController
@RequestMapping("/api")
public class UserController {

  @PostMapping("/users")
  @PreAuthorize("hasRole('ADMIN')")
  public Mono<ResponseEntity<User>> execute(
      @RequestBody UserData userData) {
    return createUserUseCase.execute(userData)
        .map(result -> ResponseEntity.ok(result));
  }

}
```

### 6. Add Logging

```java
@RestController
@RequestMapping("/api")
@Slf4j
public class UserController {

  @PostMapping("/users")
  public Mono<ResponseEntity<User>> execute(
      @RequestBody UserData userData) {
    log.info("Creating user with email: {}", userData.getEmail());
    
    return createUserUseCase.execute(userData)
        .doOnSuccess(user -> log.info("User created successfully: {}", user.getId()))
        .doOnError(e -> log.error("Failed to create user", e))
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

## Request/Response DTOs

Create DTOs for your endpoints:

### Request DTO

```java
package com.pragma.user.infrastructure.entry-points.rest.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

public class CreateUserRequest {

  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  @Min(value = 18, message = "Age must be at least 18")
  private Integer age;

  // Getters and Setters
}
```

### Response DTO

```java
package com.pragma.user.infrastructure.entry-points.rest.dto;

import java.time.Instant;

public class UserResponse {

  private String id;
  private String name;
  private String email;
  private Integer age;
  private Instant createdAt;

  // Getters and Setters
}
```

### Using DTOs in Controller

```java
@RestController
@RequestMapping("/api")
public class UserController {

  private final CreateUserUseCase createUserUseCase;
  private final UserDtoMapper mapper;

  @PostMapping("/users")
  public Mono<ResponseEntity<UserResponse>> execute(
      @Valid @RequestBody CreateUserRequest request) {
    
    UserData userData = mapper.toUserData(request);
    
    return createUserUseCase.execute(userData)
        .map(mapper::toResponse)
        .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
  }

}
```

## Global Error Handler

Create a global error handler for all controllers:

```java
package com.pragma.infrastructure.entry-points.rest.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import reactor.core.publisher.Mono;

@RestControllerAdvice
public class GlobalErrorHandler {

  @ExceptionHandler(ValidationException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleValidationException(
      ValidationException ex) {
    ErrorResponse error = new ErrorResponse(
        "VALIDATION_ERROR",
        ex.getMessage(),
        HttpStatus.BAD_REQUEST.value()
    );
    return Mono.just(ResponseEntity.badRequest().body(error));
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleNotFoundException(
      ResourceNotFoundException ex) {
    ErrorResponse error = new ErrorResponse(
        "NOT_FOUND",
        ex.getMessage(),
        HttpStatus.NOT_FOUND.value()
    );
    return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(error));
  }

  @ExceptionHandler(Exception.class)
  public Mono<ResponseEntity<ErrorResponse>> handleGenericException(
      Exception ex) {
    ErrorResponse error = new ErrorResponse(
        "INTERNAL_ERROR",
        "An unexpected error occurred",
        HttpStatus.INTERNAL_SERVER_ERROR.value()
    );
    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error));
  }

}
```

## Testing Controllers

### Unit Test

```java
@WebFluxTest(UserController.class)
class UserControllerTest {

  @Autowired
  private WebTestClient webTestClient;

  @MockBean
  private CreateUserUseCase createUserUseCase;

  @Test
  void shouldCreateUser() {
    // Given
    UserData userData = new UserData("John", "john@example.com", 25);
    User expectedUser = new User("1", "John", "john@example.com", 25);
    
    when(createUserUseCase.execute(any())).thenReturn(Mono.just(expectedUser));

    // When & Then
    webTestClient.post()
        .uri("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(userData)
        .exchange()
        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.id").isEqualTo("1")
        .jsonPath("$.name").isEqualTo("John")
        .jsonPath("$.email").isEqualTo("john@example.com");
  }

}
```

### Integration Test

```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {

  @Autowired
  private WebTestClient webTestClient;

  @Test
  void shouldCreateAndRetrieveUser() {
    // Create user
    UserData userData = new UserData("John", "john@example.com", 25);
    
    String userId = webTestClient.post()
        .uri("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(userData)
        .exchange()
        .expectStatus().isOk()
        .expectBody(User.class)
        .returnResult()
        .getResponseBody()
        .getId();

    // Retrieve user
    webTestClient.get()
        .uri("/api/users/" + userId)
        .exchange()
        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.name").isEqualTo("John");
  }

}
```

## Best Practices

### 1. Use DTOs

Don't expose domain entities directly:

```java
// Good
@PostMapping("/users")
public Mono<ResponseEntity<UserResponse>> execute(
    @RequestBody CreateUserRequest request) {
  // ...
}

// Avoid
@PostMapping("/users")
public Mono<ResponseEntity<User>> execute(
    @RequestBody User user) {
  // ...
}
```

### 2. Validate Input

Always validate incoming data:

```java
@PostMapping("/users")
public Mono<ResponseEntity<UserResponse>> execute(
    @Valid @RequestBody CreateUserRequest request) {
  // ...
}
```

### 3. Use Proper HTTP Status Codes

```java
// 201 Created for POST
ResponseEntity.status(HttpStatus.CREATED).body(result)

// 204 No Content for DELETE
ResponseEntity.noContent().build()

// 404 Not Found
ResponseEntity.notFound().build()

// 400 Bad Request for validation errors
ResponseEntity.badRequest().body(error)
```

### 4. Version Your API

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
  // ...
}
```

### 5. Document Your API

Use OpenAPI/Swagger annotations for documentation.

## Complete Example

Here's a complete workflow:

```bash
# 1. Generate entity
./gradlew generateEntity \
  --name=User \
  --fields=name:String,email:String,age:Integer \
  --packageName=com.pragma.user.domain.model

# 2. Generate use case
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.user.domain.port.in

# 3. Generate REST entry point
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData|/users/{id}:GET:findById:User:id:PATH:String" \
  --packageName=com.pragma.user.infrastructure.entry-points.rest

# 4. Customize controller with DTOs, validation, and error handling
```

## Next Steps

- [Testing Controllers](../../testing/controller-testing)
- [API Documentation](../../guides/api-documentation)
- [Security Configuration](../../guides/security)
