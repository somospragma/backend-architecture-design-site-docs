# Adaptador REST Controller

El adaptador REST Controller expone endpoints HTTP REST para tu aplicación, permitiendo que clientes externos interactúen con tus casos de uso.

## Características

- ✅ Endpoints HTTP (GET, POST, PUT, DELETE, PATCH)
- ✅ Validación automática de requests con Bean Validation
- ✅ Manejo centralizado de excepciones
- ✅ Serialización/deserialización JSON automática
- ✅ Soporte reactivo e imperativo
- ✅ Tests con MockMvc o WebTestClient

## Generar el Adaptador

```bash
gradle generateInputAdapter --name=rest --type=driving
```

## Paradigmas Disponibles

### Spring Reactive (WebFlux)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-webflux'
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

**Ejemplo de Uso:**
```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {
    
    private final CreateUserUseCase createUserUseCase;
    private final GetUserUseCase getUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    
    public UserRestController(
        CreateUserUseCase createUserUseCase,
        GetUserUseCase getUserUseCase,
        UpdateUserUseCase updateUserUseCase,
        DeleteUserUseCase deleteUserUseCase
    ) {
        this.createUserUseCase = createUserUseCase;
        this.getUserUseCase = getUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    
    @PostMapping
    public Mono<ResponseEntity<UserResponse>> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        return createUserUseCase.execute(request.toDomain())
            .map(user -> ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.from(user))
            );
    }
    
    @GetMapping("/{id}")
    public Mono<ResponseEntity<UserResponse>> getUser(
        @PathVariable String id
    ) {
        return getUserUseCase.execute(id)
            .map(user -> ResponseEntity.ok(UserResponse.from(user)))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public Flux<UserResponse> getAllUsers() {
        return getUserUseCase.executeAll()
            .map(UserResponse::from);
    }
    
    @PutMapping("/{id}")
    public Mono<ResponseEntity<UserResponse>> updateUser(
        @PathVariable String id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        return updateUserUseCase.execute(id, request.toDomain())
            .map(user -> ResponseEntity.ok(UserResponse.from(user)))
            .defaultIfEmpty(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<Void>> deleteUser(@PathVariable String id) {
        return deleteUserUseCase.execute(id)
            .then(Mono.just(ResponseEntity.noContent().<Void>build()));
    }
}
```

### Spring Imperative (MVC)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-web'
implementation 'org.springframework.boot:spring-boot-starter-validation'
```

**Ejemplo de Uso:**
```java
@RestController
@RequestMapping("/api/users")
public class UserRestController {
    
    private final CreateUserUseCase createUserUseCase;
    private final GetUserUseCase getUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    
    public UserRestController(
        CreateUserUseCase createUserUseCase,
        GetUserUseCase getUserUseCase,
        UpdateUserUseCase updateUserUseCase,
        DeleteUserUseCase deleteUserUseCase
    ) {
        this.createUserUseCase = createUserUseCase;
        this.getUserUseCase = getUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
    }
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
        @Valid @RequestBody CreateUserRequest request
    ) {
        User user = createUserUseCase.execute(request.toDomain());
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(UserResponse.from(user));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable String id) {
        return getUserUseCase.execute(id)
            .map(user -> ResponseEntity.ok(UserResponse.from(user)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public List<UserResponse> getAllUsers() {
        return getUserUseCase.executeAll()
            .stream()
            .map(UserResponse::from)
            .collect(Collectors.toList());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
        @PathVariable String id,
        @Valid @RequestBody UpdateUserRequest request
    ) {
        return updateUserUseCase.execute(id, request.toDomain())
            .map(user -> ResponseEntity.ok(UserResponse.from(user)))
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        deleteUserUseCase.execute(id);
        return ResponseEntity.noContent().build();
    }
}
```

## DTOs (Data Transfer Objects)

### Request DTO

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
    
    // Getters, setters, constructors
    
    public User toDomain() {
        return new User(null, name, email, age);
    }
}
```

### Response DTO

```java
public class UserResponse {
    
    private String id;
    private String name;
    private String email;
    private Integer age;
    private LocalDateTime createdAt;
    
    // Getters, setters, constructors
    
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getAge(),
            user.getCreatedAt()
        );
    }
}
```

## Manejo de Excepciones

### Exception Handler Global

```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(
        UserNotFoundException ex
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            LocalDateTime.now()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(
        MethodArgumentNotValidException ex
    ) {
        List<FieldError> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> new FieldError(
                error.getField(),
                error.getDefaultMessage()
            ))
            .collect(Collectors.toList());
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed",
            errors,
            LocalDateTime.now()
        );
        
        return ResponseEntity.badRequest().body(response);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(
        Exception ex
    ) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            "An unexpected error occurred",
            LocalDateTime.now()
        );
        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(error);
    }
}
```

### Error Response DTOs

```java
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    
    // Constructor, getters, setters
}

public class ValidationErrorResponse extends ErrorResponse {
    private List<FieldError> errors;
    
    // Constructor, getters, setters
}

public class FieldError {
    private String field;
    private String message;
    
    // Constructor, getters, setters
}
```

## Configuración

### application.yml

```yaml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  mvc:
    throw-exception-if-no-handler-found: true
  web:
    resources:
      add-mappings: false
  jackson:
    serialization:
      write-dates-as-timestamps: false
    deserialization:
      fail-on-unknown-properties: false
```

## Tests

### Tests con MockMvc (Imperativo)

```java
@WebMvcTest(UserRestController.class)
class UserRestControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CreateUserUseCase createUserUseCase;
    
    @MockBean
    private GetUserUseCase getUserUseCase;
    
    @Test
    void shouldCreateUser() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest(
            "John Doe", 
            "john@example.com", 
            30
        );
        User user = new User("1", "John Doe", "john@example.com", 30);
        
        when(createUserUseCase.execute(any())).thenReturn(user);
        
        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").value("1"))
            .andExpect(jsonPath("$.name").value("John Doe"))
            .andExpect(jsonPath("$.email").value("john@example.com"));
    }
    
    @Test
    void shouldReturnNotFoundWhenUserDoesNotExist() throws Exception {
        // Given
        when(getUserUseCase.execute("999")).thenReturn(Optional.empty());
        
        // When & Then
        mockMvc.perform(get("/api/users/999"))
            .andExpect(status().isNotFound());
    }
}
```

### Tests con WebTestClient (Reactivo)

```java
@WebFluxTest(UserRestController.class)
class UserRestControllerTest {
    
    @Autowired
    private WebTestClient webTestClient;
    
    @MockBean
    private CreateUserUseCase createUserUseCase;
    
    @MockBean
    private GetUserUseCase getUserUseCase;
    
    @Test
    void shouldCreateUser() {
        // Given
        CreateUserRequest request = new CreateUserRequest(
            "John Doe", 
            "john@example.com", 
            30
        );
        User user = new User("1", "John Doe", "john@example.com", 30);
        
        when(createUserUseCase.execute(any())).thenReturn(Mono.just(user));
        
        // When & Then
        webTestClient.post()
            .uri("/api/users")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .exchange()
            .expectStatus().isCreated()
            .expectBody()
            .jsonPath("$.id").isEqualTo("1")
            .jsonPath("$.name").isEqualTo("John Doe")
            .jsonPath("$.email").isEqualTo("john@example.com");
    }
}
```

## Mejores Prácticas

1. **Versionado de API**: Usa versionado en tus endpoints
   ```java
   @RequestMapping("/api/v1/users")
   ```

2. **HATEOAS**: Incluye links en las respuestas
   ```java
   public class UserResponse extends RepresentationModel<UserResponse> {
       // Agrega links con add(linkTo(...))
   }
   ```

3. **Paginación**: Implementa paginación para listas grandes
   ```java
   @GetMapping
   public Page<UserResponse> getAllUsers(Pageable pageable) {
       return getUserUseCase.executeAll(pageable)
           .map(UserResponse::from);
   }
   ```

4. **CORS**: Configura CORS para aplicaciones frontend
   ```java
   @Configuration
   public class CorsConfig {
       @Bean
       public WebMvcConfigurer corsConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void addCorsMappings(CorsRegistry registry) {
                   registry.addMapping("/api/**")
                       .allowedOrigins("http://localhost:3000")
                       .allowedMethods("GET", "POST", "PUT", "DELETE");
               }
           };
       }
   }
   ```

5. **Documentación con OpenAPI**: Agrega Swagger/OpenAPI
   ```gradle
   implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.0.0'
   ```

## Recursos Adicionales

- [Spring Web MVC Documentation](https://docs.spring.io/spring-framework/reference/web/webmvc.html)
- [Spring WebFlux Documentation](https://docs.spring.io/spring-framework/reference/web/webflux.html)
- [Bean Validation Specification](https://beanvalidation.org/2.0/spec/)
