# REST Entry Point

Generate a REST API controller entry point with reactive Spring WebFlux endpoints.

## Overview

The REST entry point handles HTTP requests and delegates to use cases. It's ideal for:
- RESTful APIs
- Microservices
- Public APIs
- Mobile/Web backends

## Command

```bash
./gradlew generateInputAdapter \
  --name=<ControllerName> \
  --useCase=<UseCaseName> \
  --endpoints=<endpoint1|endpoint2> \
  --packageName=<package> \
  --type=rest
```

:::info Terminology
In clean architecture, input adapters are called **entry points** because they are the entry points to the application. They are located in `infrastructure/entry-points/`.
:::

## Parameters

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `--name` | Yes | Controller name | `User`, `Product`, `Order` |
| `--useCase` | Yes | Use case to inject | `CreateUserUseCase`, `ProductUseCase` |
| `--endpoints` | Yes | Endpoint definitions | See format below |
| `--packageName` | Yes | Full package path | `com.pragma.infrastructure.entry-points.rest` |
| `--type` | No | Must be `rest` | `rest` (default) |

## Endpoint Format

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

Separate with `|`:
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
  --packageName=com.pragma.user.infrastructure.entry-points.rest \
  --type=rest
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
  --endpoints="/products:POST:create:Product:data:BODY:ProductRequest|/products/{id}:GET:findById:Product:id:PATH:String|/products:GET:findAll:List|/products/{id}:PUT:update:Product:id:PATH:String:data:BODY:ProductRequest|/products/{id}:DELETE:delete:Boolean:id:PATH:String" \
  --packageName=com.pragma.ecommerce.infrastructure.entry-points.rest \
  --type=rest
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
      @RequestBody ProductRequest data) {
    return productUseCase.create(data)
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

  @PutMapping("/products/{id}")
  public Mono<ResponseEntity<Product>> update(
      @PathVariable String id,
      @RequestBody ProductRequest data) {
    return productUseCase.update(id, data)
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
  --endpoints="/orders:GET:search:List:status:QUERY:String:userId:QUERY:String:page:QUERY:Integer" \
  --packageName=com.pragma.order.infrastructure.entry-points.rest \
  --type=rest
```

**Generated Controller:**

```java
@RestController
@RequestMapping("/api")
public class OrderController {

  private final OrderUseCase orderUseCase;

  @GetMapping("/orders")
  public Mono<ResponseEntity<List>> search(
      @RequestParam String status,
      @RequestParam String userId,
      @RequestParam Integer page) {
    return orderUseCase.search(status, userId, page)
        .map(result -> ResponseEntity.ok(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

## Customization

### 1. Add Validation

```java
@RestController
@RequestMapping("/api")
@Validated
public class UserController {

  @PostMapping("/users")
  public Mono<ResponseEntity<User>> execute(
      @Valid @RequestBody CreateUserRequest request) {
    return createUserUseCase.execute(request)
        .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result));
  }

}
```

**Request DTO with Validation:**

```java
public class CreateUserRequest {

  @NotBlank(message = "Name is required")
  @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
  private String name;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  @Min(value = 18, message = "Age must be at least 18")
  @Max(value = 120, message = "Age must be less than 120")
  private Integer age;

  // Getters and Setters
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
        .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result))
        .onErrorResume(ValidationException.class, e -> 
            Mono.just(ResponseEntity.badRequest().build()))
        .onErrorResume(UserAlreadyExistsException.class, e -> 
            Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).build()))
        .onErrorResume(Exception.class, e -> 
            Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()));
  }

}
```

### 3. Add OpenAPI Documentation

```java
@RestController
@RequestMapping("/api")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

  @PostMapping("/users")
  @Operation(
      summary = "Create a new user",
      description = "Creates a new user in the system with the provided data"
  )
  @ApiResponses(value = {
      @ApiResponse(
          responseCode = "201",
          description = "User created successfully",
          content = @Content(schema = @Schema(implementation = UserResponse.class))
      ),
      @ApiResponse(
          responseCode = "400",
          description = "Invalid input data",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class))
      ),
      @ApiResponse(
          responseCode = "409",
          description = "User already exists",
          content = @Content(schema = @Schema(implementation = ErrorResponse.class))
      )
  })
  public Mono<ResponseEntity<UserResponse>> execute(
      @RequestBody @Parameter(description = "User data") CreateUserRequest request) {
    return createUserUseCase.execute(request)
        .map(mapper::toResponse)
        .map(response -> ResponseEntity.status(HttpStatus.CREATED).body(response));
  }

}
```

### 4. Add Security

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

  @GetMapping("/users/{id}")
  @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
  public Mono<ResponseEntity<User>> findById(
      @PathVariable String id,
      @AuthenticationPrincipal Mono<UserDetails> userDetails) {
    return userDetails
        .flatMap(user -> createUserUseCase.findById(id))
        .map(result -> ResponseEntity.ok(result));
  }

}
```

### 5. Add Logging

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
        .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result))
        .defaultIfEmpty(ResponseEntity.notFound().build());
  }

}
```

### 6. Add Response Headers

```java
@PostMapping("/users")
public Mono<ResponseEntity<User>> execute(
      @RequestBody UserData userData) {
  return createUserUseCase.execute(userData)
      .map(user -> ResponseEntity
          .status(HttpStatus.CREATED)
          .header("Location", "/api/users/" + user.getId())
          .header("X-Request-Id", UUID.randomUUID().toString())
          .body(user));
}
```

## DTOs (Data Transfer Objects)

### Request DTO

```java
package com.pragma.user.infrastructure.entry-points.rest.dto;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonProperty;

public class CreateUserRequest {

  @NotBlank(message = "Name is required")
  @Size(min = 2, max = 100)
  private String name;

  @NotBlank(message = "Email is required")
  @Email(message = "Email must be valid")
  private String email;

  @Min(value = 18, message = "Age must be at least 18")
  @Max(value = 120)
  private Integer age;

  @JsonProperty("phone_number")
  @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
  private String phoneNumber;

  // Getters and Setters
}
```

### Response DTO

```java
package com.pragma.user.infrastructure.entry-points.rest.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;

public class UserResponse {

  private String id;
  private String name;
  private String email;
  private Integer age;

  @JsonProperty("phone_number")
  private String phoneNumber;

  @JsonProperty("created_at")
  private Instant createdAt;

  @JsonProperty("updated_at")
  private Instant updatedAt;

  // Getters and Setters
}
```

### DTO Mapper

```java
package com.pragma.user.infrastructure.entry-points.rest.mapper;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserDtoMapper {

  UserData toUserData(CreateUserRequest request);
  
  UserResponse toResponse(User user);
  
  List<UserResponse> toResponseList(List<User> users);
}
```

## Global Error Handler

```java
package com.pragma.infrastructure.entry-points.rest.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalErrorHandler {

  @ExceptionHandler(ValidationException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleValidationException(
      ValidationException ex) {
    ErrorResponse error = ErrorResponse.builder()
        .code("VALIDATION_ERROR")
        .message(ex.getMessage())
        .status(HttpStatus.BAD_REQUEST.value())
        .timestamp(Instant.now())
        .build();
    
    return Mono.just(ResponseEntity.badRequest().body(error));
  }

  @ExceptionHandler(WebExchangeBindException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleBindException(
      WebExchangeBindException ex) {
    String errors = ex.getBindingResult()
        .getFieldErrors()
        .stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining(", "));
    
    ErrorResponse error = ErrorResponse.builder()
        .code("VALIDATION_ERROR")
        .message(errors)
        .status(HttpStatus.BAD_REQUEST.value())
        .timestamp(Instant.now())
        .build();
    
    return Mono.just(ResponseEntity.badRequest().body(error));
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleNotFoundException(
      ResourceNotFoundException ex) {
    ErrorResponse error = ErrorResponse.builder()
        .code("NOT_FOUND")
        .message(ex.getMessage())
        .status(HttpStatus.NOT_FOUND.value())
        .timestamp(Instant.now())
        .build();
    
    return Mono.just(ResponseEntity.status(HttpStatus.NOT_FOUND).body(error));
  }

  @ExceptionHandler(ConflictException.class)
  public Mono<ResponseEntity<ErrorResponse>> handleConflictException(
      ConflictException ex) {
    ErrorResponse error = ErrorResponse.builder()
        .code("CONFLICT")
        .message(ex.getMessage())
        .status(HttpStatus.CONFLICT.value())
        .timestamp(Instant.now())
        .build();
    
    return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).body(error));
  }

  @ExceptionHandler(Exception.class)
  public Mono<ResponseEntity<ErrorResponse>> handleGenericException(
      Exception ex) {
    ErrorResponse error = ErrorResponse.builder()
        .code("INTERNAL_ERROR")
        .message("An unexpected error occurred")
        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
        .timestamp(Instant.now())
        .build();
    
    return Mono.just(ResponseEntity
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(error));
  }

}
```

### Error Response DTO

```java
@Data
@Builder
public class ErrorResponse {
  private String code;
  private String message;
  private int status;
  private Instant timestamp;
  private Map<String, String> details;
}
```

## Testing

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
    CreateUserRequest request = new CreateUserRequest("John", "john@example.com", 25);
    User expectedUser = new User("1", "John", "john@example.com", 25);
    
    when(createUserUseCase.execute(any())).thenReturn(Mono.just(expectedUser));

    // When & Then
    webTestClient.post()
        .uri("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(request)
        .exchange()
        .expectStatus().isOk()
        .expectBody()
        .jsonPath("$.id").isEqualTo("1")
        .jsonPath("$.name").isEqualTo("John")
        .jsonPath("$.email").isEqualTo("john@example.com");
  }

  @Test
  void shouldReturnBadRequestWhenValidationFails() {
    // Given
    CreateUserRequest request = new CreateUserRequest("", "invalid-email", 15);

    // When & Then
    webTestClient.post()
        .uri("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(request)
        .exchange()
        .expectStatus().isBadRequest();
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
    CreateUserRequest request = new CreateUserRequest("John", "john@example.com", 25);
    
    String userId = webTestClient.post()
        .uri("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .bodyValue(request)
        .exchange()
        .expectStatus().isCreated()
        .expectBody(UserResponse.class)
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

### 1. Use DTOs, Not Domain Entities

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

### 2. Use Proper HTTP Status Codes

```java
// 201 Created for POST
ResponseEntity.status(HttpStatus.CREATED).body(result)

// 204 No Content for DELETE
ResponseEntity.noContent().build()

// 404 Not Found
ResponseEntity.notFound().build()

// 400 Bad Request
ResponseEntity.badRequest().body(error)

// 409 Conflict
ResponseEntity.status(HttpStatus.CONFLICT).body(error)
```

### 3. Version Your API

```java
@RestController
@RequestMapping("/api/v1/users")
public class UserController {
  // ...
}
```

### 4. Use Pagination

```java
@GetMapping("/users")
public Mono<ResponseEntity<PageResponse<UserResponse>>> findAll(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size) {
  return userUseCase.findAll(page, size)
      .map(result -> ResponseEntity.ok(result));
}
```

### 5. Add CORS Configuration

```java
@Configuration
public class WebConfig {

  @Bean
  public CorsWebFilter corsWebFilter() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:3000"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(List.of("*"));
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    
    return new CorsWebFilter(source);
  }
}
```

## Next Steps

- [GraphQL Resolver](graphql) (Coming soon)
- [gRPC Service](grpc) (Coming soon)
- [Entry Points Overview](../../generators/input-adapters)
- [API Documentation](../../guides/api-documentation)
