# generateUseCase

Genera un caso de uso con su interfaz de puerto (port) e implementación, incluyendo métodos con parámetros y tipos de retorno.

:::info Casos de Uso
Los casos de uso representan la lógica de negocio de la aplicación. Definen las operaciones que la aplicación puede realizar y orquestan el flujo entre el dominio y los adaptadores.
:::

## Sintaxis

```bash
./gradlew generateUseCase \
  --name=<NombreCasoDeUso> \
  --methods=<metodo1:TipoRetorno:param1:Tipo1|metodo2:TipoRetorno> \
  --packageName=<paquete> \
  [--generatePort=<true|false>] \
  [--generateImpl=<true|false>]
```

## Parámetros

| Parámetro | Requerido | Descripción | Valor por Defecto |
|-----------|-----------|-------------|-------------------|
| `--name` | Sí | Nombre del caso de uso (PascalCase) | - |
| `--methods` | Sí | Definiciones de métodos | - |
| `--packageName` | Sí | Paquete para la interfaz port | - |
| `--generatePort` | No | Generar interfaz port | `true` |
| `--generateImpl` | No | Generar implementación | `true` |

## Formato de Métodos

Los métodos se especifican con el siguiente formato:

```
nombreMetodo:TipoRetorno:param1:Tipo1:param2:Tipo2
```

### Componentes del Formato

- **`nombreMetodo`**: Nombre del método (camelCase)
- **`TipoRetorno`**: Tipo de retorno del método (puede ser `Mono`, `Flux`, o tipos simples)
- **`param1:Tipo1`**: Parámetros del método (opcional)

### Múltiples Métodos

Separa múltiples métodos con `|`:

```
create:User:data:UserData|findById:User:id:String|delete:Boolean:id:String
```

### Métodos sin Parámetros

Para métodos sin parámetros, omite la parte de parámetros:

```
findAll:List
```

## Ejemplos

### Caso de Uso Simple

```bash
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.test.domain.port.in
```

**Archivos generados:**

```
domain/port/in/
└── CreateUserUseCase.java

application/usecase/
└── CreateUserUseCaseImpl.java
```

**Interfaz Port (CreateUserUseCase.java):**

```java
package com.pragma.test.domain.port.in;

import reactor.core.publisher.Mono;

public interface CreateUserUseCase {
    Mono<User> execute(UserData userData);
}
```

**Implementación (CreateUserUseCaseImpl.java):**

```java
package com.pragma.test.application.usecase;

import com.pragma.test.domain.port.in.CreateUserUseCase;
import com.pragma.test.domain.port.out.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class CreateUserUseCaseImpl implements CreateUserUseCase {
    
    private final UserRepository userRepository;
    
    @Override
    public Mono<User> execute(UserData userData) {
        // TODO: Implementar lógica de negocio
        User user = User.builder()
            .name(userData.getName())
            .email(userData.getEmail())
            .build();
        
        return userRepository.save(user);
    }
}
```

### Caso de Uso con Múltiples Métodos

```bash
./gradlew generateUseCase \
  --name=ProductManagement \
  --methods=create:Product:data:ProductData|update:Product:id:String:data:ProductData|delete:Boolean:id:String|findById:Product:id:String|findAll:List \
  --packageName=com.pragma.test.domain.port.in
```

**Interfaz Port (ProductManagementUseCase.java):**

```java
package com.pragma.test.domain.port.in;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ProductManagementUseCase {
    Mono<Product> create(ProductData data);
    Mono<Product> update(String id, ProductData data);
    Mono<Boolean> delete(String id);
    Mono<Product> findById(String id);
    Flux<Product> findAll();
}
```

**Implementación (ProductManagementUseCaseImpl.java):**

```java
package com.pragma.test.application.usecase;

import com.pragma.test.domain.port.in.ProductManagementUseCase;
import com.pragma.test.domain.port.out.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class ProductManagementUseCaseImpl implements ProductManagementUseCase {
    
    private final ProductRepository productRepository;
    
    @Override
    public Mono<Product> create(ProductData data) {
        // TODO: Implementar lógica de creación
        Product product = Product.builder()
            .name(data.getName())
            .price(data.getPrice())
            .build();
        
        return productRepository.save(product);
    }
    
    @Override
    public Mono<Product> update(String id, ProductData data) {
        // TODO: Implementar lógica de actualización
        return productRepository.findById(id)
            .flatMap(product -> {
                product.setName(data.getName());
                product.setPrice(data.getPrice());
                return productRepository.save(product);
            });
    }
    
    @Override
    public Mono<Boolean> delete(String id) {
        // TODO: Implementar lógica de eliminación
        return productRepository.deleteById(id)
            .thenReturn(true);
    }
    
    @Override
    public Mono<Product> findById(String id) {
        return productRepository.findById(id);
    }
    
    @Override
    public Flux<Product> findAll() {
        return productRepository.findAll();
    }
}
```

### Solo Interfaz Port (Sin Implementación)

```bash
./gradlew generateUseCase \
  --name=PaymentProcessor \
  --methods=process:PaymentResult:payment:Payment \
  --packageName=com.pragma.test.domain.port.in \
  --generateImpl=false
```

Este comando genera solo la interfaz port, útil cuando:
- Quieres implementar la lógica manualmente
- Tienes múltiples implementaciones del mismo port
- Estás definiendo contratos antes de la implementación

### Caso de Uso con Tipos Complejos

```bash
./gradlew generateUseCase \
  --name=OrderProcessing \
  --methods=createOrder:Order:orderData:OrderRequest:userId:String|calculateTotal:BigDecimal:orderId:String|applyDiscount:Order:orderId:String:discountCode:String \
  --packageName=com.pragma.test.domain.port.in
```

**Interfaz generada:**

```java
public interface OrderProcessingUseCase {
    Mono<Order> createOrder(OrderRequest orderData, String userId);
    Mono<BigDecimal> calculateTotal(String orderId);
    Mono<Order> applyDiscount(String orderId, String discountCode);
}
```

### Caso de Uso con Tipos Reactivos Explícitos

```bash
./gradlew generateUseCase \
  --name=NotificationService \
  --methods=sendNotification:Mono<Void>:notification:Notification|sendBatch:Flux<NotificationResult>:notifications:List<Notification> \
  --packageName=com.pragma.test.domain.port.in
```

## Resolución de Rutas por Arquitectura

El plugin coloca automáticamente los casos de uso en la ubicación correcta según la arquitectura:

| Arquitectura | Ruta del Port | Ruta de la Implementación |
|--------------|---------------|---------------------------|
| `hexagonal-single` | `domain/port/in/` | `application/usecase/` |
| `hexagonal-multi` | `domain/src/main/java/{package}/port/in/` | `application/src/main/java/{package}/usecase/` |
| `hexagonal-multi-granular` | `ports/src/main/java/{package}/in/` | `usecase/src/main/java/{package}/` |
| `onion-single` | `core/application/port/` | `core/application/service/` |

## Tipos Reactivos

El plugin genera automáticamente tipos reactivos apropiados:

### Mono&lt;T&gt;
Para operaciones que retornan un solo elemento:

```java
Mono<User> findById(String id);
Mono<Boolean> delete(String id);
Mono<Void> sendNotification(Notification notification);
```

### Flux&lt;T&gt;
Para operaciones que retornan múltiples elementos:

```java
Flux<Product> findAll();
Flux<Order> findByUserId(String userId);
Flux<Event> streamEvents();
```

### Tipos Simples
Para operaciones síncronas (menos común en arquitecturas reactivas):

```java
String generateId();
boolean isValid(String input);
```

## Inyección de Dependencias

Las implementaciones generadas usan inyección por constructor con Lombok:

```java
@Service
@RequiredArgsConstructor
public class CreateUserUseCaseImpl implements CreateUserUseCase {
    
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ValidationService validationService;
    
    // Métodos...
}
```

## Patrones de Implementación

### Validación de Entrada

```java
@Override
public Mono<User> execute(UserData userData) {
    return Mono.just(userData)
        .flatMap(this::validateUserData)
        .map(this::mapToUser)
        .flatMap(userRepository::save);
}

private Mono<UserData> validateUserData(UserData data) {
    if (data.getEmail() == null || !data.getEmail().contains("@")) {
        return Mono.error(new ValidationException("Invalid email"));
    }
    return Mono.just(data);
}
```

### Orquestación de Múltiples Operaciones

```java
@Override
public Mono<Order> createOrder(OrderRequest orderData, String userId) {
    return userRepository.findById(userId)
        .switchIfEmpty(Mono.error(new UserNotFoundException(userId)))
        .flatMap(user -> validateOrder(orderData, user))
        .flatMap(this::calculateOrderTotal)
        .flatMap(orderRepository::save)
        .flatMap(this::sendOrderConfirmation);
}
```

### Manejo de Errores

```java
@Override
public Mono<Product> update(String id, ProductData data) {
    return productRepository.findById(id)
        .switchIfEmpty(Mono.error(new ProductNotFoundException(id)))
        .flatMap(product -> updateProduct(product, data))
        .flatMap(productRepository::save)
        .onErrorResume(ValidationException.class, e -> 
            Mono.error(new BusinessException("Invalid product data", e))
        );
}
```

## Convenciones de Nombres

El plugin aplica convenciones de nombres automáticamente:

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| Interfaz Port | `{Name}UseCase` | `CreateUserUseCase` |
| Implementación | `{Name}UseCaseImpl` | `CreateUserUseCaseImpl` |
| Métodos | camelCase | `execute`, `findById`, `createOrder` |
| Parámetros | camelCase | `userData`, `orderId`, `discountCode` |

## Generación Incremental

Puedes agregar múltiples casos de uso a un proyecto existente:

```bash
# Caso de uso para crear usuarios
./gradlew generateUseCase \
  --name=CreateUser \
  --methods=execute:User:userData:UserData \
  --packageName=com.pragma.test.domain.port.in

# Caso de uso para buscar usuarios
./gradlew generateUseCase \
  --name=FindUser \
  --methods=findById:User:id:String|findByEmail:User:email:String \
  --packageName=com.pragma.test.domain.port.in
```

## Validación

El comando valida:
- ✅ Existe `.cleanarch.yml` en el directorio actual
- ✅ Nombre del caso de uso sigue convenciones Java
- ✅ Formato de métodos es válido
- ✅ Tipos de retorno son válidos
- ✅ Paquete coincide con la estructura del proyecto

## Errores Comunes

### Error: Formato de método inválido

```
Invalid method format: 'execute:User'
Expected format: methodName:ReturnType[:param:Type]*
```

**Solución**: Asegúrate de incluir al menos el nombre del método y el tipo de retorno.

### Error: Nombre de caso de uso inválido

```
Use case name 'create-user' is invalid. Use PascalCase without special characters.
Suggestion: 'CreateUser'
```

**Solución**: Usa PascalCase para el nombre del caso de uso.

### Error: Caso de uso duplicado

```
Use case 'CreateUserUseCase' already exists at domain/port/in/.
Use --force to overwrite or choose a different name.
```

**Solución**: Usa un nombre diferente o agrega `--force` para sobrescribir.

## Pruebas

El plugin genera tests básicos para los casos de uso:

```java
@ExtendWith(MockitoExtension.class)
class CreateUserUseCaseImplTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private CreateUserUseCaseImpl createUserUseCase;
    
    @Test
    void shouldCreateUser() {
        // Given
        UserData userData = new UserData("John", "john@example.com");
        User expectedUser = User.builder()
            .id("1")
            .name("John")
            .email("john@example.com")
            .build();
        
        when(userRepository.save(any(User.class)))
            .thenReturn(Mono.just(expectedUser));
        
        // When
        StepVerifier.create(createUserUseCase.execute(userData))
            // Then
            .expectNext(expectedUser)
            .verifyComplete();
    }
    
    @Test
    void shouldFailWhenRepositoryFails() {
        // Given
        UserData userData = new UserData("John", "john@example.com");
        when(userRepository.save(any(User.class)))
            .thenReturn(Mono.error(new RuntimeException("Database error")));
        
        // When & Then
        StepVerifier.create(createUserUseCase.execute(userData))
            .expectError(RuntimeException.class)
            .verify();
    }
}
```

## Mejores Prácticas

### 1. Responsabilidad Única

Cada caso de uso debe tener una responsabilidad clara:

```bash
# ✅ Bueno: Casos de uso específicos
./gradlew generateUseCase --name=CreateUser --methods=execute:User:data:UserData
./gradlew generateUseCase --name=UpdateUser --methods=execute:User:id:String:data:UserData
./gradlew generateUseCase --name=DeleteUser --methods=execute:Boolean:id:String

# ❌ Malo: Caso de uso con demasiadas responsabilidades
./gradlew generateUseCase --name=UserManagement --methods=create:User|update:User|delete:Boolean|sendEmail:Void|generateReport:Report
```

### 2. Nombres Descriptivos

Usa nombres que describan claramente la acción:

```bash
# ✅ Bueno
./gradlew generateUseCase --name=ProcessPayment
./gradlew generateUseCase --name=SendOrderConfirmation
./gradlew generateUseCase --name=CalculateShippingCost

# ❌ Malo
./gradlew generateUseCase --name=DoStuff
./gradlew generateUseCase --name=Handler
./gradlew generateUseCase --name=Manager
```

### 3. Parámetros Significativos

Usa nombres de parámetros descriptivos:

```bash
# ✅ Bueno
--methods=processPayment:PaymentResult:orderId:String:paymentMethod:PaymentMethod:amount:BigDecimal

# ❌ Malo
--methods=process:Result:id:String:method:String:amt:BigDecimal
```

### 4. Tipos de Retorno Apropiados

Elige el tipo de retorno correcto según la operación:

```bash
# ✅ Bueno
--methods=findById:User:id:String              # Mono<User> - un elemento
--methods=findAll:List                         # Flux<User> - múltiples elementos
--methods=delete:Boolean:id:String             # Mono<Boolean> - confirmación
--methods=sendNotification:Void:notification   # Mono<Void> - sin retorno

# ❌ Malo
--methods=findAll:User                         # Debería ser List o Flux
--methods=delete:User:id:String                # Debería ser Boolean o Void
```

## Flujo de Trabajo Completo

Ejemplo de creación de un módulo completo:

```bash
# 1. Generar entidad de dominio
./gradlew generateEntity \
  --name=Product \
  --fields=name:String,price:BigDecimal,stock:Integer \
  --packageName=com.pragma.test.domain.model

# 2. Generar caso de uso
./gradlew generateUseCase \
  --name=CreateProduct \
  --methods=execute:Product:productData:ProductData \
  --packageName=com.pragma.test.domain.port.in

# 3. Generar adaptador de salida
./gradlew generateOutputAdapter \
  --name=ProductRepository \
  --entity=Product \
  --type=mongodb \
  --packageName=com.pragma.test.infrastructure.driven-adapters.mongodb

# 4. Generar adaptador de entrada
./gradlew generateInputAdapter \
  --name=Product \
  --useCase=CreateProductUseCase \
  --endpoints="/products:POST:execute:Product:productData:BODY:ProductData" \
  --packageName=com.pragma.test.infrastructure.entry-points.rest
```

## Próximos Pasos

Después de generar un caso de uso:

1. **Implementar Lógica**: Completa la lógica de negocio en la implementación
2. **Agregar Validaciones**: Implementa validaciones de entrada
3. **Manejar Errores**: Agrega manejo de errores específico del dominio
4. **Escribir Tests**: Crea tests unitarios para el caso de uso
5. **Generar Adaptadores**: Crea los adaptadores necesarios para el caso de uso

## Ver También

- [generateEntity](generate-entity.md)
- [generateOutputAdapter](generate-output-adapter.md)
- [generateInputAdapter](generate-input-adapter.md)
- [Guía de Casos de Uso](../guides/use-cases.md)
- [Referencia de Configuración](../reference/configuration.md)
