# Adaptador DynamoDB

El adaptador DynamoDB proporciona acceso a la base de datos NoSQL de AWS con soporte para operaciones reactivas e imperativas.

## Características

- ✅ Operaciones CRUD completas
- ✅ Query y Scan operations
- ✅ Soporte reactivo (AWS SDK Async)
- ✅ Soporte imperativo (AWS SDK Sync)
- ✅ Enhanced Client para mapeo de objetos
- ✅ Tests con LocalStack Testcontainer

## Generar el Adaptador

```bash
gradle generateOutputAdapter --name=dynamodb --type=driven
```

## Paradigmas Disponibles

### Spring Reactive (WebFlux)

**Dependencias:**
```gradle
implementation platform('software.amazon.awssdk:bom:2.20.0')
implementation 'software.amazon.awssdk:dynamodb-enhanced'
implementation 'software.amazon.awssdk:netty-nio-client'
```

**Ejemplo de Uso:**
```java
@Component
public class DynamoDBAdapter implements UserRepository {
    
    private final DynamoDbAsyncClient dynamoDbClient;
    private final DynamoDbEnhancedAsyncClient enhancedClient;
    private final DynamoDbAsyncTable<UserEntity> table;
    
    public DynamoDBAdapter(
        DynamoDbAsyncClient dynamoDbClient,
        @Value("${aws.dynamodb.table-name}") String tableName
    ) {
        this.dynamoDbClient = dynamoDbClient;
        this.enhancedClient = DynamoDbEnhancedAsyncClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build();
        this.table = enhancedClient.table(
            tableName, 
            TableSchema.fromBean(UserEntity.class)
        );
    }
    
    @Override
    public Mono<User> save(User user) {
        UserEntity entity = UserEntity.from(user);
        return Mono.fromFuture(table.putItem(entity))
            .thenReturn(user)
            .onErrorMap(DynamoDbException.class, e -> 
                new DatabaseException("Failed to save user", e)
            );
    }
    
    @Override
    public Mono<User> findById(String id) {
        Key key = Key.builder().partitionValue(id).build();
        return Mono.fromFuture(table.getItem(key))
            .map(UserEntity::toDomain)
            .onErrorMap(DynamoDbException.class, e -> 
                new DatabaseException("Failed to get user", e)
            );
    }
    
    @Override
    public Flux<User> findAll() {
        return Flux.from(table.scan().items())
            .map(UserEntity::toDomain)
            .onErrorMap(DynamoDbException.class, e -> 
                new DatabaseException("Failed to scan users", e)
            );
    }
    
    @Override
    public Mono<Void> deleteById(String id) {
        Key key = Key.builder().partitionValue(id).build();
        return Mono.fromFuture(table.deleteItem(key))
            .then()
            .onErrorMap(DynamoDbException.class, e -> 
                new DatabaseException("Failed to delete user", e)
            );
    }
    
    @Override
    public Flux<User> findByEmail(String email) {
        QueryConditional queryConditional = QueryConditional
            .keyEqualTo(Key.builder().partitionValue(email).build());
        
        return Flux.from(table.index("email-index")
                .query(queryConditional)
                .flatMapIterable(page -> page.items()))
            .map(UserEntity::toDomain);
    }
}
```

### Spring Imperative (MVC)

**Dependencias:**
```gradle
implementation platform('software.amazon.awssdk:bom:2.20.0')
implementation 'software.amazon.awssdk:dynamodb-enhanced'
```

**Ejemplo de Uso:**
```java
@Component
public class DynamoDBAdapter implements UserRepository {
    
    private final DynamoDbClient dynamoDbClient;
    private final DynamoDbEnhancedClient enhancedClient;
    private final DynamoDbTable<UserEntity> table;
    
    public DynamoDBAdapter(
        DynamoDbClient dynamoDbClient,
        @Value("${aws.dynamodb.table-name}") String tableName
    ) {
        this.dynamoDbClient = dynamoDbClient;
        this.enhancedClient = DynamoDbEnhancedClient.builder()
            .dynamoDbClient(dynamoDbClient)
            .build();
        this.table = enhancedClient.table(
            tableName, 
            TableSchema.fromBean(UserEntity.class)
        );
    }
    
    @Override
    public User save(User user) {
        try {
            UserEntity entity = UserEntity.from(user);
            table.putItem(entity);
            return user;
        } catch (DynamoDbException e) {
            throw new DatabaseException("Failed to save user", e);
        }
    }
    
    @Override
    public Optional<User> findById(String id) {
        try {
            Key key = Key.builder().partitionValue(id).build();
            UserEntity entity = table.getItem(key);
            return Optional.ofNullable(entity)
                .map(UserEntity::toDomain);
        } catch (DynamoDbException e) {
            throw new DatabaseException("Failed to get user", e);
        }
    }
    
    @Override
    public List<User> findAll() {
        try {
            return table.scan().items().stream()
                .map(UserEntity::toDomain)
                .collect(Collectors.toList());
        } catch (DynamoDbException e) {
            throw new DatabaseException("Failed to scan users", e);
        }
    }
    
    @Override
    public void deleteById(String id) {
        try {
            Key key = Key.builder().partitionValue(id).build();
            table.deleteItem(key);
        } catch (DynamoDbException e) {
            throw new DatabaseException("Failed to delete user", e);
        }
    }
}
```

## Entidad DynamoDB

```java
@DynamoDbBean
public class UserEntity {
    
    private String id;
    private String name;
    private String email;
    private Integer age;
    private Long createdAt;
    
    @DynamoDbPartitionKey
    @DynamoDbAttribute("PK")
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    @DynamoDbAttribute("name")
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    @DynamoDbSecondaryPartitionKey(indexNames = "email-index")
    @DynamoDbAttribute("email")
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    @DynamoDbAttribute("age")
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    @DynamoDbAttribute("createdAt")
    public Long getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }
    
    public static UserEntity from(User user) {
        UserEntity entity = new UserEntity();
        entity.setId(user.getId());
        entity.setName(user.getName());
        entity.setEmail(user.getEmail());
        entity.setAge(user.getAge());
        entity.setCreatedAt(System.currentTimeMillis());
        return entity;
    }
    
    public User toDomain() {
        return new User(id, name, email, age);
    }
}
```

## Configuración

### application.yml

```yaml
aws:
  dynamodb:
    region: us-east-1
    table-name: users
    # ADVERTENCIA: No almacenes credenciales de AWS en control de versiones
    # Usa IAM roles, variables de entorno o AWS Secrets Manager en producción
    endpoint: http://localhost:8000  # Solo para desarrollo local
```

### Configuración del Cliente (Reactivo)

```java
@Configuration
public class DynamoDBConfig {
    
    @Value("${aws.dynamodb.region}")
    private String region;
    
    @Value("${aws.dynamodb.endpoint:}")
    private String endpoint;
    
    @Bean
    public DynamoDbAsyncClient dynamoDbAsyncClient() {
        DynamoDbAsyncClientBuilder builder = DynamoDbAsyncClient.builder()
            .region(Region.of(region))
            .httpClientBuilder(NettyNioAsyncHttpClient.builder()
                .maxConcurrency(100)
                .connectionTimeout(Duration.ofSeconds(5))
                .readTimeout(Duration.ofSeconds(30))
            );
        
        // Solo para desarrollo local con LocalStack
        if (endpoint != null && !endpoint.isEmpty()) {
            builder.endpointOverride(URI.create(endpoint));
        }
        
        return builder.build();
    }
}
```

### Configuración del Cliente (Imperativo)

```java
@Configuration
public class DynamoDBConfig {
    
    @Value("${aws.dynamodb.region}")
    private String region;
    
    @Value("${aws.dynamodb.endpoint:}")
    private String endpoint;
    
    @Bean
    public DynamoDbClient dynamoDbClient() {
        DynamoDbClientBuilder builder = DynamoDbClient.builder()
            .region(Region.of(region));
        
        // Solo para desarrollo local con LocalStack
        if (endpoint != null && !endpoint.isEmpty()) {
            builder.endpointOverride(URI.create(endpoint));
        }
        
        return builder.build();
    }
}
```

## Tests con LocalStack

```java
@SpringBootTest
@Testcontainers
class DynamoDBAdapterTest {
    
    @Container
    static LocalStackContainer localstack = new LocalStackContainer(
        DockerImageName.parse("localstack/localstack:latest")
    ).withServices(LocalStackContainer.Service.DYNAMODB);
    
    @DynamicPropertySource
    static void setProperties(DynamicPropertyRegistry registry) {
        registry.add("aws.dynamodb.endpoint", 
            () -> localstack.getEndpointOverride(LocalStackContainer.Service.DYNAMODB));
        registry.add("aws.dynamodb.region", () -> localstack.getRegion());
    }
    
    @Autowired
    private DynamoDBAdapter adapter;
    
    @Autowired
    private DynamoDbClient dynamoDbClient;
    
    @BeforeEach
    void setUp() {
        createTable();
    }
    
    private void createTable() {
        CreateTableRequest request = CreateTableRequest.builder()
            .tableName("users")
            .keySchema(
                KeySchemaElement.builder()
                    .attributeName("PK")
                    .keyType(KeyType.HASH)
                    .build()
            )
            .attributeDefinitions(
                AttributeDefinition.builder()
                    .attributeName("PK")
                    .attributeType(ScalarAttributeType.S)
                    .build(),
                AttributeDefinition.builder()
                    .attributeName("email")
                    .attributeType(ScalarAttributeType.S)
                    .build()
            )
            .globalSecondaryIndexes(
                GlobalSecondaryIndex.builder()
                    .indexName("email-index")
                    .keySchema(
                        KeySchemaElement.builder()
                            .attributeName("email")
                            .keyType(KeyType.HASH)
                            .build()
                    )
                    .projection(Projection.builder()
                        .projectionType(ProjectionType.ALL)
                        .build())
                    .provisionedThroughput(ProvisionedThroughput.builder()
                        .readCapacityUnits(5L)
                        .writeCapacityUnits(5L)
                        .build())
                    .build()
            )
            .provisionedThroughput(ProvisionedThroughput.builder()
                .readCapacityUnits(5L)
                .writeCapacityUnits(5L)
                .build())
            .build();
        
        dynamoDbClient.createTable(request);
    }
    
    @Test
    void shouldSaveAndRetrieveUser() {
        // Given
        User user = new User("1", "John Doe", "john@example.com", 30);
        
        // When
        adapter.save(user).block();
        User retrieved = adapter.findById("1").block();
        
        // Then
        assertThat(retrieved).isEqualTo(user);
    }
}
```

## Operaciones Avanzadas

### Query con Filtros

```java
public Flux<User> findByAgeGreaterThan(int age) {
    Map<String, AttributeValue> expressionValues = Map.of(
        ":age", AttributeValue.builder().n(String.valueOf(age)).build()
    );
    
    QueryConditional queryConditional = QueryConditional
        .sortGreaterThan(Key.builder().sortValue(age).build());
    
    QueryEnhancedRequest request = QueryEnhancedRequest.builder()
        .queryConditional(queryConditional)
        .filterExpression(Expression.builder()
            .expression("age > :age")
            .expressionValues(expressionValues)
            .build())
        .build();
    
    return Flux.from(table.query(request)
            .flatMapIterable(page -> page.items()))
        .map(UserEntity::toDomain);
}
```

### Batch Operations

```java
public Mono<Void> saveBatch(List<User> users) {
    List<UserEntity> entities = users.stream()
        .map(UserEntity::from)
        .collect(Collectors.toList());
    
    WriteBatch.Builder<UserEntity> batchBuilder = WriteBatch.builder(UserEntity.class)
        .mappedTableResource(table);
    
    entities.forEach(batchBuilder::addPutItem);
    
    BatchWriteItemEnhancedRequest request = BatchWriteItemEnhancedRequest.builder()
        .writeBatches(batchBuilder.build())
        .build();
    
    return Mono.fromFuture(enhancedClient.batchWriteItem(request))
        .then();
}
```

### Transacciones

```java
public Mono<Void> transferBalance(String fromId, String toId, int amount) {
    TransactWriteItemsEnhancedRequest request = TransactWriteItemsEnhancedRequest.builder()
        .addUpdateItem(table, TransactUpdateItemEnhancedRequest.builder(UserEntity.class)
            .item(/* from user with reduced balance */)
            .build())
        .addUpdateItem(table, TransactUpdateItemEnhancedRequest.builder(UserEntity.class)
            .item(/* to user with increased balance */)
            .build())
        .build();
    
    return Mono.fromFuture(enhancedClient.transactWriteItems(request))
        .then();
}
```

## Mejores Prácticas

1. **Diseño de Claves**: Diseña partition keys y sort keys cuidadosamente
2. **Índices Secundarios**: Usa GSI/LSI para patrones de consulta adicionales
3. **Batch Operations**: Usa batch para operaciones múltiples
4. **Paginación**: Implementa paginación para scans grandes
5. **Capacity Planning**: Configura capacidad apropiada (on-demand vs provisioned)
6. **Manejo de Errores**: Implementa reintentos para errores transitorios
7. **Costos**: Monitorea costos de lectura/escritura

## Solución de Problemas

### Error de Credenciales

**Problema**: `SdkClientException: Unable to load credentials`

**Solución**: Configura credenciales AWS:
```bash
aws configure
# O usa variables de entorno
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### Tabla No Existe

**Problema**: `ResourceNotFoundException: Cannot do operations on a non-existent table`

**Solución**: Crea la tabla primero:
```bash
aws dynamodb create-table --cli-input-json file://table-definition.json
```

## Recursos Adicionales

- [AWS SDK for Java Documentation](https://docs.aws.amazon.com/sdk-for-java/latest/developer-guide/)
- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/)
- [LocalStack Documentation](https://docs.localstack.cloud/user-guide/aws/dynamodb/)
