# gRPC Entry Point

Adaptador de entrada para servicios gRPC con soporte reactivo e imperativo.

## Overview

- **Reactive**: ReactorStub para operaciones no bloqueantes
- **Imperative**: BlockingStub para operaciones síncronas

## Generar Adaptador

```bash
./gradlew generateInputAdapter \
  --name=User \
  --useCase=CreateUserUseCase \
  --type=grpc \
  --packageName=com.pragma.user.infrastructure.entry-points.grpc
```

## Paradigma Reactivo

### Dependencias

```kotlin
dependencies {
    implementation("net.devh:grpc-server-spring-boot-starter:2.15.0.RELEASE")
    implementation("com.salesforce.servicelibs:reactor-grpc-stub:1.2.4")
}
```

### Proto Definition

```protobuf
syntax = "proto3";

package user;

service UserService {
  rpc CreateUser(CreateUserRequest) returns (UserResponse);
  rpc FindUser(FindUserRequest) returns (UserResponse);
  rpc FindAllUsers(Empty) returns (stream UserResponse);
}

message CreateUserRequest {
  string name = 1;
  string email = 2;
}

message FindUserRequest {
  string id = 1;
}

message UserResponse {
  string id = 1;
  string name = 2;
  string email = 3;
}

message Empty {}
```

### Service Implementation

```java
@GrpcService
public class UserGrpcService extends ReactorUserServiceGrpc.UserServiceImplBase {
    
    private final CreateUserUseCase createUserUseCase;
    private final FindUserUseCase findUserUseCase;
    
    @Override
    public Mono<UserResponse> createUser(Mono<CreateUserRequest> request) {
        return request
            .map(this::toUserData)
            .flatMap(createUserUseCase::execute)
            .map(this::toResponse);
    }
    
    @Override
    public Mono<UserResponse> findUser(Mono<FindUserRequest> request) {
        return request
            .map(FindUserRequest::getId)
            .flatMap(findUserUseCase::execute)
            .map(this::toResponse);
    }
    
    @Override
    public Flux<UserResponse> findAllUsers(Mono<Empty> request) {
        return findUserUseCase.executeAll()
            .map(this::toResponse);
    }
}
```

## Paradigma Imperativo

### Service Implementation

```java
@GrpcService
public class UserGrpcService extends UserServiceGrpc.UserServiceImplBase {
    
    private final CreateUserUseCase createUserUseCase;
    private final FindUserUseCase findUserUseCase;
    
    @Override
    public void createUser(CreateUserRequest request, StreamObserver<UserResponse> responseObserver) {
        try {
            User user = createUserUseCase.execute(toUserData(request));
            responseObserver.onNext(toResponse(user));
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.INTERNAL
                .withDescription(e.getMessage())
                .asRuntimeException());
        }
    }
    
    @Override
    public void findUser(FindUserRequest request, StreamObserver<UserResponse> responseObserver) {
        try {
            User user = findUserUseCase.execute(request.getId());
            responseObserver.onNext(toResponse(user));
            responseObserver.onCompleted();
        } catch (Exception e) {
            responseObserver.onError(Status.NOT_FOUND
                .withDescription(e.getMessage())
                .asRuntimeException());
        }
    }
}
```

## Configuration

```yaml
grpc:
  server:
    port: 9090
    max-inbound-message-size: 4MB
    enable-reflection: true
```

## Testing

```java
@SpringBootTest
@DirtiesContext
class UserGrpcServiceTest {
    
    @GrpcClient("inProcess")
    private UserServiceBlockingStub stub;
    
    @Test
    void shouldCreateUser() {
        CreateUserRequest request = CreateUserRequest.newBuilder()
            .setName("John")
            .setEmail("john@example.com")
            .build();
        
        UserResponse response = stub.createUser(request);
        
        assertThat(response.getName()).isEqualTo("John");
    }
}
```

## Learn More

- [gRPC Java](https://grpc.io/docs/languages/java/)
- [gRPC Spring Boot Starter](https://yidongnan.github.io/grpc-spring-boot-starter/)
