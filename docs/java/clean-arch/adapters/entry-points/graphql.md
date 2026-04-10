# GraphQL Entry Point

Adaptador de entrada para exponer APIs GraphQL con soporte para paradigmas reactivo e imperativo.

## Overview

El adaptador GraphQL proporciona una API GraphQL usando Spring for GraphQL:
- **Reactive**: Resolvers con `Mono&lt;T&gt;`, `Flux&lt;T&gt;` para operaciones no bloqueantes
- **Imperative**: Resolvers con tipos síncronos para operaciones tradicionales

## Generar Adaptador

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase,FindUserUseCase \
  --type=graphql \
  --packageName=com.pragma.user.infrastructure.entry-points.graphql
```

## Paradigma Reactivo

### Dependencias

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("com.graphql-java:graphql-java-extended-scalars:20.0")
}
```

### Configuración

```yaml
spring:
  graphql:
    graphiql:
      enabled: true
      path: /graphiql
    path: /graphql
    schema:
      printer:
        enabled: true
```

### Código Generado

```java
// Schema (schema.graphqls)
type Query {
    findUser(id: ID!): User
    findAllUsers: [User!]!
}

type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
}

type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
}

input CreateUserInput {
    name: String!
    email: String!
}

input UpdateUserInput {
    name: String
    email: String
}

// Controller
@Controller
public class UserGraphQLController {
    
    private final CreateUserUseCase createUserUseCase;
    private final FindUserUseCase findUserUseCase;
    
    @QueryMapping
    public Mono<User> findUser(@Argument String id) {
        return findUserUseCase.execute(id);
    }
    
    @QueryMapping
    public Flux<User> findAllUsers() {
        return findUserUseCase.executeAll();
    }
    
    @MutationMapping
    public Mono<User> createUser(@Argument CreateUserInput input) {
        return createUserUseCase.execute(input.toUserData());
    }
    
    @MutationMapping
    public Mono<User> updateUser(@Argument String id, @Argument UpdateUserInput input) {
        return updateUserUseCase.execute(id, input.toUserData());
    }
    
    @MutationMapping
    public Mono<Boolean> deleteUser(@Argument String id) {
        return deleteUserUseCase.execute(id)
            .thenReturn(true);
    }
}
```

## Paradigma Imperativo

### Dependencias

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-graphql")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("com.graphql-java:graphql-java-extended-scalars:20.0")
}
```

### Código Generado

```java
@Controller
public class UserGraphQLController {
    
    private final CreateUserUseCase createUserUseCase;
    private final FindUserUseCase findUserUseCase;
    
    @QueryMapping
    public User findUser(@Argument String id) {
        return findUserUseCase.execute(id);
    }
    
    @QueryMapping
    public List<User> findAllUsers() {
        return findUserUseCase.executeAll();
    }
    
    @MutationMapping
    public User createUser(@Argument CreateUserInput input) {
        return createUserUseCase.execute(input.toUserData());
    }
    
    @MutationMapping
    public User updateUser(@Argument String id, @Argument UpdateUserInput input) {
        return updateUserUseCase.execute(id, input.toUserData());
    }
    
    @MutationMapping
    public Boolean deleteUser(@Argument String id) {
        deleteUserUseCase.execute(id);
        return true;
    }
}
```

## Características Avanzadas

### Subscriptions (Reactive)

```java
@Controller
public class UserGraphQLController {
    
    @SubscriptionMapping
    public Flux<User> userCreated() {
        return userEventPublisher.subscribe()
            .filter(event -> event.getType() == EventType.CREATED)
            .map(Event::getUser);
    }
}
```

Schema:
```graphql
type Subscription {
    userCreated: User!
}
```

### DataLoader (Batch Loading)

```java
@Configuration
public class DataLoaderConfiguration {
    
    @Bean
    public BatchLoaderRegistry batchLoaderRegistry(UserRepository repository) {
        return registry -> registry.forTypePair(String.class, User.class)
            .registerMappedBatchLoader((ids, env) -> 
                repository.findByIds(ids)
                    .collectMap(User::getId)
            );
    }
}
```

### Error Handling

```java
@ControllerAdvice
public class GraphQLExceptionHandler {
    
    @GraphQlExceptionHandler
    public GraphQLError handle(UserNotFoundException ex) {
        return GraphQLError.newError()
            .errorType(ErrorType.NOT_FOUND)
            .message(ex.getMessage())
            .build();
    }
    
    @GraphQlExceptionHandler
    public GraphQLError handle(ValidationException ex) {
        return GraphQLError.newError()
            .errorType(ErrorType.BAD_REQUEST)
            .message(ex.getMessage())
            .extensions(Map.of("validationErrors", ex.getErrors()))
            .build();
    }
}
```

## Testing

### Test Reactivo

```java
@GraphQlTest(UserGraphQLController.class)
class UserGraphQLControllerTest {
    
    @Autowired
    private GraphQlTester graphQlTester;
    
    @MockBean
    private FindUserUseCase findUserUseCase;
    
    @Test
    void shouldFindUser() {
        User user = new User("1", "John", "john@example.com", LocalDateTime.now());
        when(findUserUseCase.execute("1")).thenReturn(Mono.just(user));
        
        graphQlTester.document("""
            query {
                findUser(id: "1") {
                    id
                    name
                    email
                }
            }
            """)
            .execute()
            .path("findUser.id").entity(String.class).isEqualTo("1")
            .path("findUser.name").entity(String.class).isEqualTo("John");
    }
    
    @Test
    void shouldCreateUser() {
        User user = new User("1", "John", "john@example.com", LocalDateTime.now());
        when(createUserUseCase.execute(any())).thenReturn(Mono.just(user));
        
        graphQlTester.document("""
            mutation {
                createUser(input: {name: "John", email: "john@example.com"}) {
                    id
                    name
                }
            }
            """)
            .execute()
            .path("createUser.name").entity(String.class).isEqualTo("John");
    }
}
```

### Test Imperativo

```java
@GraphQlTest(UserGraphQLController.class)
class UserGraphQLControllerTest {
    
    @Autowired
    private GraphQlTester graphQlTester;
    
    @MockBean
    private FindUserUseCase findUserUseCase;
    
    @Test
    void shouldFindUser() {
        User user = new User("1", "John", "john@example.com", LocalDateTime.now());
        when(findUserUseCase.execute("1")).thenReturn(user);
        
        graphQlTester.document("""
            query {
                findUser(id: "1") {
                    id
                    name
                    email
                }
            }
            """)
            .execute()
            .path("findUser.id").entity(String.class).isEqualTo("1")
            .path("findUser.name").entity(String.class).isEqualTo("John");
    }
}
```

## Best Practices

### 1. Use Input Types for Mutations

```graphql
# Good
input CreateUserInput {
    name: String!
    email: String!
}

mutation {
    createUser(input: {name: "John", email: "john@example.com"})
}

# Avoid
mutation {
    createUser(name: "John", email: "john@example.com")
}
```

### 2. Implement Pagination

```graphql
type Query {
    findUsers(page: Int!, size: Int!): UserPage!
}

type UserPage {
    content: [User!]!
    totalElements: Int!
    totalPages: Int!
    number: Int!
    size: Int!
}
```

### 3. Use Enums for Fixed Values

```graphql
enum UserStatus {
    ACTIVE
    INACTIVE
    SUSPENDED
}

type User {
    id: ID!
    status: UserStatus!
}
```

### 4. Document Your Schema

```graphql
"""
Represents a user in the system
"""
type User {
    """
    Unique identifier for the user
    """
    id: ID!
    
    """
    Full name of the user
    """
    name: String!
}
```

## Learn More

- [Spring for GraphQL](https://spring.io/projects/spring-graphql)
- [GraphQL Java](https://www.graphql-java.com/)
- [GraphQL Specification](https://spec.graphql.org/)
