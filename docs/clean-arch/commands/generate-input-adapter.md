# generateInputAdapter

Genera un adaptador de entrada (entry point) para exponer la funcionalidad de la aplicación a través de REST APIs, GraphQL, gRPC, WebSockets, etc.

:::info Terminología
En arquitectura limpia, los adaptadores de entrada se llaman **entry points** porque son los puntos de entrada a la aplicación. Se ubican en `infrastructure/entry-points/` o `infrastructure/adapter/in/` según la arquitectura.
:::

## Sintaxis

```bash
./gradlew generateInputAdapter \
  --name=<NombreAdaptador> \
  --useCase=<NombreCasoDeUso> \
  --endpoints=<endpoint1|endpoint2> \
  --packageName=<paquete> \
  [--type=<tipoAdaptador>]
```

## Parámetros

| Parámetro | Requerido | Descripción | Valor por Defecto |
|-----------|-----------|-------------|-------------------|
| `--name` | Sí | Nombre del adaptador | - |
| `--useCase` | Sí | Caso de uso a inyectar | - |
| `--endpoints` | Sí | Definiciones de endpoints | - |
| `--packageName` | Sí | Paquete completo | - |
| `--type` | No | Tipo de adaptador | `rest` |

## Tipos de Adaptadores

### rest
Entry point REST API con Spring WebFlux (reactivo).

**Dependencias incluidas:**
- `spring-boot-starter-webflux`
- Soporte para JSON con Jackson
- Validación con Bean Validation

**Características:**
- Endpoints reactivos con `Mono` y `Flux`
- Anotaciones Spring Web (`@RestController`, `@GetMapping`, etc.)
- Manejo de errores HTTP
- Validación de entrada

### graphql
Entry point GraphQL resolver (próximamente).

**Características planeadas:**
- Resolvers con Spring GraphQL
- Subscriptions reactivas
- DataLoader para N+1 queries

### grpc
Entry point gRPC service (próximamente).

**Características planeadas:**
- Servicios gRPC con Protocol Buffers
- Streaming bidireccional
- Interceptores para autenticación

### websocket
Entry point WebSocket handler (próximamente).

**Características planeadas:**
- Handlers WebSocket reactivos
- Broadcast de mensajes
- Gestión de sesiones

## Formato de Endpoints

Los endpoints se especifican con el siguiente formato:

```
/ruta:METODO:metodoUseCase:TipoRetorno:param1:TIPOPARAM:Tipo1:param2:TIPOPARAM:Tipo2
```

### Componentes del Formato

- **`/ruta`**: Ruta del endpoint (ej., `/users`, `/products/{id}`)
- **`METODO`**: Método HTTP (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`)
- **`metodoUseCase`**: Método del caso de uso a invocar
- **`TipoRetorno`**: Tipo de retorno del endpoint
- **`param1:TIPOPARAM:Tipo1`**: Parámetros del endpoint

### Tipos de Parámetros

| Tipo | Anotación Spring | Descripción |
|------|------------------|-------------|
| `PATH` | `@PathVariable` | Variable en la ruta del endpoint |
| `BODY` | `@RequestBody` | Cuerpo de la petición (JSON) |
| `QUERY` | `@RequestParam` | Parámetro de query string |
| `HEADER` | `@RequestHeader` | Encabezado HTTP |

### Múltiples Endpoints

Separa múltiples endpoints con `|`:

```
/users:POST:create:User:data:BODY:UserRequest|/users/{id}:GET:findById:User:id:PATH:String
```

## Ejemplos

### Entry Point Simple

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --endpoints="/users:POST:execute:User:userData:BODY:UserData" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

**Archivo generado (UserController.java):**

```java
@RestController
@RequestMapping("/users")
public class UserController {
    
    private final CreateUserUseCase createUserUseCase;
    
    public UserController(CreateUserUseCase createUserUseCase) {
        this.createUserUseCase = createUserUseCase;
    }
    
    @PostMapping
    public Mono<ResponseEntity<User>> createUser(
        @RequestBody @Valid UserData userData
    ) {
        return createUserUseCase.execute(userData)
            .map(user -> ResponseEntity.status(HttpStatus.CREATED).body(user))
            .onErrorResume(this::handleError);
    }
    
    private Mono<ResponseEntity<User>> handleError(Throwable error) {
        // Manejo de errores
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }
}
```

### Entry Point con Múltiples Endpoints

```bash
./gradlew generateInputAdapter \
  --name=Product \
  --useCase=ProductUseCase \
  --endpoints="/products:POST:create:Product:productData:BODY:ProductRequest|/products/{id}:GET:findById:Product:id:PATH:String|/products:GET:findAll:List" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

**Archivo generado (ProductController.java):**

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    
    private final ProductUseCase productUseCase;
    
    public ProductController(ProductUseCase productUseCase) {
        this.productUseCase = productUseCase;
    }
    
    @PostMapping
    public Mono<ResponseEntity<Product>> createProduct(
        @RequestBody @Valid ProductRequest productData
    ) {
        return productUseCase.create(productData)
            .map(product -> ResponseEntity.status(HttpStatus.CREATED).body(product))
            .onErrorResume(this::handleError);
    }
    
    @GetMapping("/{id}")
    public Mono<ResponseEntity<Product>> findProductById(
        @PathVariable String id
    ) {
        return productUseCase.findById(id)
            .map(ResponseEntity::ok)
            .defaultIfEmpty(ResponseEntity.notFound().build())
            .onErrorResume(this::handleError);
    }
    
    @GetMapping
    public Mono<ResponseEntity<List<Product>>> findAllProducts() {
        return productUseCase.findAll()
            .collectList()
            .map(ResponseEntity::ok)
            .onErrorResume(this::handleError);
    }
    
    private <T> Mono<ResponseEntity<T>> handleError(Throwable error) {
        // Manejo de errores
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }
}
```

### Entry Point con Parámetros de Query

```bash
./gradlew generateInputAdapter \
  --name=Order \
  --useCase=OrderUseCase \
  --endpoints="/orders:GET:search:List:status:QUERY:String:userId:QUERY:String" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

**Archivo generado (OrderController.java):**

```java
@RestController
@RequestMapping("/orders")
public class OrderController {
    
    private final OrderUseCase orderUseCase;
    
    public OrderController(OrderUseCase orderUseCase) {
        this.orderUseCase = orderUseCase;
    }
    
    @GetMapping
    public Mono<ResponseEntity<List<Order>>> searchOrders(
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String userId
    ) {
        return orderUseCase.search(status, userId)
            .collectList()
            .map(ResponseEntity::ok)
            .onErrorResume(this::handleError);
    }
    
    private <T> Mono<ResponseEntity<T>> handleError(Throwable error) {
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }
}
```

### Entry Point con Path Variables y Body

```bash
./gradlew generateInputAdapter \
  --name=Payment \
  --useCase=PaymentUseCase \
  --endpoints="/payments/{orderId}:POST:processPayment:PaymentResult:orderId:PATH:String:paymentData:BODY:PaymentRequest" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

**Archivo generado (PaymentController.java):**

```java
@RestController
@RequestMapping("/payments")
public class PaymentController {
    
    private final PaymentUseCase paymentUseCase;
    
    public PaymentController(PaymentUseCase paymentUseCase) {
        this.paymentUseCase = paymentUseCase;
    }
    
    @PostMapping("/{orderId}")
    public Mono<ResponseEntity<PaymentResult>> processPayment(
        @PathVariable String orderId,
        @RequestBody @Valid PaymentRequest paymentData
    ) {
        return paymentUseCase.processPayment(orderId, paymentData)
            .map(result -> ResponseEntity.status(HttpStatus.CREATED).body(result))
            .onErrorResume(this::handleError);
    }
    
    private Mono<ResponseEntity<PaymentResult>> handleError(Throwable error) {
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
    }
}
```

### Entry Point CRUD Completo

```bash
./gradlew generateInputAdapter \
  --name=Customer \
  --useCase=CustomerUseCase \
  --endpoints="/customers:POST:create:Customer:data:BODY:CustomerRequest|/customers/{id}:GET:findById:Customer:id:PATH:String|/customers:GET:findAll:List|/customers/{id}:PUT:update:Customer:id:PATH:String:data:BODY:CustomerRequest|/customers/{id}:DELETE:delete:Void:id:PATH:String" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest \
  --type=rest
```

Este comando genera un controlador REST completo con operaciones CRUD:
- `POST /customers` - Crear cliente
- `GET /customers/{id}` - Obtener cliente por ID
- `GET /customers` - Listar todos los clientes
- `PUT /customers/{id}` - Actualizar cliente
- `DELETE /customers/{id}` - Eliminar cliente

## Resolución de Rutas por Arquitectura

El plugin coloca automáticamente los entry points en la ubicación correcta según la arquitectura:

| Arquitectura | Ruta del Entry Point |
|--------------|---------------------|
| `hexagonal-single` | `infrastructure/entry-points/{name}` |
| `hexagonal-multi` | `infrastructure/src/main/java/{package}/entry-points/{name}` |
| `hexagonal-multi-granular` | `entry-points/src/main/java/{package}/{name}` |
| `onion-single` | `infrastructure/adapter/in/{name}` |

## Características del Código Generado

### Programación Reactiva

Todos los endpoints generados usan tipos reactivos:

- **`Mono<T>`**: Para respuestas de un solo elemento
- **`Flux<T>`**: Para respuestas de múltiples elementos (streams)
- **`ResponseEntity<T>`**: Para control completo de la respuesta HTTP

### Validación de Entrada

Los parámetros de tipo `BODY` incluyen validación automática:

```java
@PostMapping
public Mono<ResponseEntity<User>> createUser(
    @RequestBody @Valid UserRequest userData  // @Valid activa validación
) {
    // ...
}
```

### Manejo de Errores

Cada controlador incluye manejo básico de errores:

```java
private <T> Mono<ResponseEntity<T>> handleError(Throwable error) {
    if (error instanceof NotFoundException) {
        return Mono.just(ResponseEntity.notFound().build());
    }
    if (error instanceof ValidationException) {
        return Mono.just(ResponseEntity.badRequest().build());
    }
    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build());
}
```

### Códigos de Estado HTTP

El código generado usa códigos de estado apropiados:

- `201 Created` - Para operaciones POST exitosas
- `200 OK` - Para operaciones GET, PUT exitosas
- `204 No Content` - Para operaciones DELETE exitosas
- `404 Not Found` - Cuando un recurso no existe
- `400 Bad Request` - Para errores de validación
- `500 Internal Server Error` - Para errores inesperados

## Inyección de Dependencias

Los casos de uso se inyectan mediante constructor:

```java
public class UserController {
    
    private final CreateUserUseCase createUserUseCase;
    private final FindUserUseCase findUserUseCase;
    
    public UserController(
        CreateUserUseCase createUserUseCase,
        FindUserUseCase findUserUseCase
    ) {
        this.createUserUseCase = createUserUseCase;
        this.findUserUseCase = findUserUseCase;
    }
}
```

## Generación Incremental

Puedes agregar múltiples entry points a un proyecto existente:

```bash
# Entry point para usuarios
./gradlew generateInputAdapter \
  --name=User \
  --useCase=UserUseCase \
  --endpoints="/users:POST:create:User:data:BODY:UserRequest" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest

# Entry point para productos
./gradlew generateInputAdapter \
  --name=Product \
  --useCase=ProductUseCase \
  --endpoints="/products:GET:findAll:List" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest
```

## Validación

El comando valida:
- ✅ Existe `.cleanarch.yml` en el directorio actual
- ✅ Nombre del adaptador sigue convenciones Java
- ✅ Formato de endpoints es válido
- ✅ Tipos de parámetros son soportados
- ✅ Paquete coincide con la estructura del proyecto

## Errores Comunes

### Error: Formato de endpoint inválido

```
Invalid endpoint format: '/users:POST:create'
Expected format: /path:METHOD:useCaseMethod:ReturnType[:param:TYPE:ParamType]*
```

**Solución**: Asegúrate de incluir todos los componentes requeridos en el formato del endpoint.

### Error: Tipo de parámetro no soportado

```
Parameter type 'COOKIE' is not supported.
Valid types: [PATH, BODY, QUERY, HEADER]
```

**Solución**: Usa uno de los tipos de parámetro soportados.

### Error: Método HTTP inválido

```
HTTP method 'PATCH' is not supported.
Valid methods: [GET, POST, PUT, DELETE]
```

**Solución**: Usa uno de los métodos HTTP soportados.

## Pruebas

El plugin genera tests básicos para los entry points:

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
        UserRequest request = new UserRequest("John", "john@example.com");
        User expectedUser = new User("1", "John", "john@example.com");
        when(createUserUseCase.execute(any())).thenReturn(Mono.just(expectedUser));
        
        // When & Then
        webTestClient.post()
            .uri("/users")
            .bodyValue(request)
            .exchange()
            .expectStatus().isCreated()
            .expectBody(User.class)
            .isEqualTo(expectedUser);
    }
}
```

## Próximos Pasos

Después de generar un entry point:

1. **Personalizar Manejo de Errores**: Implementa lógica específica de manejo de errores
2. **Agregar Documentación**: Usa Swagger/OpenAPI para documentar la API
3. **Implementar Seguridad**: Agrega autenticación y autorización
4. **Escribir Tests**: Completa los tests de integración

## Ver También

- [generateOutputAdapter](generate-output-adapter.md)
- [generateUseCase](generate-use-case.md)
- [Guía de REST APIs](../guides/rest-apis.md)
- [Referencia de Configuración](../reference/configuration.md)
