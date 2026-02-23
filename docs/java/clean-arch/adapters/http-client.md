# Adaptador HTTP Client

El adaptador HTTP Client permite consumir APIs REST externas desde tu aplicación con soporte para operaciones reactivas e imperativas.

## Características

- ✅ Métodos HTTP (GET, POST, PUT, DELETE, PATCH)
- ✅ Configuración de timeouts y reintentos
- ✅ Manejo de errores HTTP
- ✅ Logging de requests/responses
- ✅ Soporte reactivo (WebClient) e imperativo (RestTemplate)
- ✅ Tests con WireMock

## Generar el Adaptador

```bash
gradle generateOutputAdapter --name=http-client --type=driven
```

## Paradigmas Disponibles

### Spring Reactive (WebFlux)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-webflux'
```

**Ejemplo de Uso:**
```java
@Component
public class HttpClientAdapter implements ExternalApiClient {
    
    private final WebClient webClient;
    
    public HttpClientAdapter(WebClient webClient) {
        this.webClient = webClient;
    }
    
    @Override
    public Mono<UserDto> getUser(String userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .onStatus(HttpStatusCode::is4xxClientError, response -> 
                Mono.error(new ClientException("User not found"))
            )
            .onStatus(HttpStatusCode::is5xxServerError, response -> 
                Mono.error(new ServerException("External API error"))
            )
            .bodyToMono(UserDto.class)
            .timeout(Duration.ofSeconds(5))
            .retry(3);
    }
    
    @Override
    public Flux<UserDto> getAllUsers() {
        return webClient.get()
            .uri("/users")
            .retrieve()
            .bodyToFlux(UserDto.class);
    }
    
    @Override
    public Mono<UserDto> createUser(CreateUserRequest request) {
        return webClient.post()
            .uri("/users")
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(UserDto.class);
    }
    
    @Override
    public Mono<UserDto> updateUser(String userId, UpdateUserRequest request) {
        return webClient.put()
            .uri("/users/{id}", userId)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(request)
            .retrieve()
            .bodyToMono(UserDto.class);
    }
    
    @Override
    public Mono<Void> deleteUser(String userId) {
        return webClient.delete()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(Void.class);
    }
}
```

### Spring Imperative (MVC)

**Dependencias:**
```gradle
implementation 'org.springframework.boot:spring-boot-starter-web'
```

**Ejemplo de Uso:**
```java
@Component
public class HttpClientAdapter implements ExternalApiClient {
    
    private final RestTemplate restTemplate;
    
    public HttpClientAdapter(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    
    @Override
    public UserDto getUser(String userId) {
        try {
            return restTemplate.getForObject("/users/{id}", UserDto.class, userId);
        } catch (HttpClientErrorException e) {
            throw new ClientException("User not found", e);
        } catch (HttpServerErrorException e) {
            throw new ServerException("External API error", e);
        }
    }
    
    @Override
    public List<UserDto> getAllUsers() {
        ResponseEntity<UserDto[]> response = restTemplate.getForEntity(
            "/users", 
            UserDto[].class
        );
        return Arrays.asList(response.getBody());
    }
    
    @Override
    public UserDto createUser(CreateUserRequest request) {
        return restTemplate.postForObject("/users", request, UserDto.class);
    }
    
    @Override
    public UserDto updateUser(String userId, UpdateUserRequest request) {
        restTemplate.put("/users/{id}", request, userId);
        return getUser(userId);
    }
    
    @Override
    public void deleteUser(String userId) {
        restTemplate.delete("/users/{id}", userId);
    }
}
```

## Configuración

### application.yml

```yaml
http:
  client:
    base-url: https://api.example.com
    timeout: 5000
    max-connections: 100
    connection-timeout: 3000
    read-timeout: 5000
```

### Configuración de WebClient (Reactivo)

```java
@Configuration
public class WebClientConfig {
    
    @Value("${http.client.base-url}")
    private String baseUrl;
    
    @Value("${http.client.timeout:5000}")
    private int timeout;
    
    @Value("${http.client.max-connections:100}")
    private int maxConnections;
    
    @Bean
    public WebClient webClient() {
        HttpClient httpClient = HttpClient.create()
            .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, timeout)
            .responseTimeout(Duration.ofMillis(timeout))
            .doOnConnected(conn -> 
                conn.addHandlerLast(new ReadTimeoutHandler(timeout, TimeUnit.MILLISECONDS))
                    .addHandlerLast(new WriteTimeoutHandler(timeout, TimeUnit.MILLISECONDS))
            );
        
        return WebClient.builder()
            .baseUrl(baseUrl)
            .clientConnector(new ReactorClientHttpConnector(httpClient))
            .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
            .filter(logRequest())
            .filter(logResponse())
            .build();
    }
    
    private ExchangeFilterFunction logRequest() {
        return ExchangeFilterFunction.ofRequestProcessor(clientRequest -> {
            log.info("Request: {} {}", clientRequest.method(), clientRequest.url());
            clientRequest.headers().forEach((name, values) -> 
                values.forEach(value -> log.debug("{}: {}", name, value))
            );
            return Mono.just(clientRequest);
        });
    }
    
    private ExchangeFilterFunction logResponse() {
        return ExchangeFilterFunction.ofResponseProcessor(clientResponse -> {
            log.info("Response status: {}", clientResponse.statusCode());
            return Mono.just(clientResponse);
        });
    }
}
```

### Configuración de RestTemplate (Imperativo)

```java
@Configuration
public class RestTemplateConfig {
    
    @Value("${http.client.base-url}")
    private String baseUrl;
    
    @Value("${http.client.connection-timeout:3000}")
    private int connectionTimeout;
    
    @Value("${http.client.read-timeout:5000}")
    private int readTimeout;
    
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
            .rootUri(baseUrl)
            .setConnectTimeout(Duration.ofMillis(connectionTimeout))
            .setReadTimeout(Duration.ofMillis(readTimeout))
            .errorHandler(new CustomResponseErrorHandler())
            .interceptors(new LoggingInterceptor())
            .build();
    }
}
```

### Error Handler Personalizado

```java
public class CustomResponseErrorHandler implements ResponseErrorHandler {
    
    @Override
    public boolean hasError(ClientHttpResponse response) throws IOException {
        return response.getStatusCode().is4xxClientError() || 
               response.getStatusCode().is5xxServerError();
    }
    
    @Override
    public void handleError(ClientHttpResponse response) throws IOException {
        if (response.getStatusCode().is4xxClientError()) {
            throw new ClientException(
                "Client error: " + response.getStatusCode()
            );
        } else if (response.getStatusCode().is5xxServerError()) {
            throw new ServerException(
                "Server error: " + response.getStatusCode()
            );
        }
    }
}
```

### Logging Interceptor

```java
public class LoggingInterceptor implements ClientHttpRequestInterceptor {
    
    private static final Logger log = LoggerFactory.getLogger(LoggingInterceptor.class);
    
    @Override
    public ClientHttpResponse intercept(
        HttpRequest request, 
        byte[] body, 
        ClientHttpRequestExecution execution
    ) throws IOException {
        logRequest(request, body);
        ClientHttpResponse response = execution.execute(request, body);
        logResponse(response);
        return response;
    }
    
    private void logRequest(HttpRequest request, byte[] body) {
        log.info("Request: {} {}", request.getMethod(), request.getURI());
        if (body.length > 0) {
            log.debug("Request body: {}", new String(body, StandardCharsets.UTF_8));
        }
    }
    
    private void logResponse(ClientHttpResponse response) throws IOException {
        log.info("Response status: {}", response.getStatusCode());
    }
}
```

## Tests con WireMock

```java
@SpringBootTest
@AutoConfigureWireMock(port = 0)
class HttpClientAdapterTest {
    
    @Autowired
    private HttpClientAdapter adapter;
    
    @Test
    void shouldGetUser() {
        // Given
        stubFor(get(urlEqualTo("/users/1"))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("{\"id\":\"1\",\"name\":\"John Doe\"}")
            )
        );
        
        // When
        UserDto user = adapter.getUser("1").block();
        
        // Then
        assertThat(user.getId()).isEqualTo("1");
        assertThat(user.getName()).isEqualTo("John Doe");
        
        verify(getRequestedFor(urlEqualTo("/users/1")));
    }
    
    @Test
    void shouldHandleNotFound() {
        // Given
        stubFor(get(urlEqualTo("/users/999"))
            .willReturn(aResponse().withStatus(404))
        );
        
        // When & Then
        assertThatThrownBy(() -> adapter.getUser("999").block())
            .isInstanceOf(ClientException.class)
            .hasMessageContaining("User not found");
    }
    
    @Test
    void shouldRetryOnServerError() {
        // Given
        stubFor(get(urlEqualTo("/users/1"))
            .inScenario("Retry")
            .whenScenarioStateIs(STARTED)
            .willReturn(aResponse().withStatus(500))
            .willSetStateTo("First Retry")
        );
        
        stubFor(get(urlEqualTo("/users/1"))
            .inScenario("Retry")
            .whenScenarioStateIs("First Retry")
            .willReturn(aResponse()
                .withStatus(200)
                .withBody("{\"id\":\"1\",\"name\":\"John Doe\"}")
            )
        );
        
        // When
        UserDto user = adapter.getUser("1").block();
        
        // Then
        assertThat(user).isNotNull();
        verify(2, getRequestedFor(urlEqualTo("/users/1")));
    }
}
```

## Características Avanzadas

### Circuit Breaker con Resilience4j

```gradle
implementation 'io.github.resilience4j:resilience4j-reactor:2.0.0'
```

```java
@Component
public class ResilientHttpClientAdapter implements ExternalApiClient {
    
    private final WebClient webClient;
    private final CircuitBreaker circuitBreaker;
    
    public ResilientHttpClientAdapter(
        WebClient webClient,
        CircuitBreakerRegistry circuitBreakerRegistry
    ) {
        this.webClient = webClient;
        this.circuitBreaker = circuitBreakerRegistry
            .circuitBreaker("externalApi");
    }
    
    @Override
    public Mono<UserDto> getUser(String userId) {
        return webClient.get()
            .uri("/users/{id}", userId)
            .retrieve()
            .bodyToMono(UserDto.class)
            .transformDeferred(CircuitBreakerOperator.of(circuitBreaker))
            .onErrorResume(CallNotPermittedException.class, e -> 
                Mono.error(new ServiceUnavailableException("Circuit breaker is open"))
            );
    }
}
```

### Rate Limiting

```java
@Component
public class RateLimitedHttpClientAdapter implements ExternalApiClient {
    
    private final WebClient webClient;
    private final RateLimiter rateLimiter;
    
    public RateLimitedHttpClientAdapter(
        WebClient webClient,
        RateLimiterRegistry rateLimiterRegistry
    ) {
        this.webClient = webClient;
        this.rateLimiter = rateLimiterRegistry.rateLimiter("externalApi");
    }
    
    @Override
    public Mono<UserDto> getUser(String userId) {
        return Mono.fromCallable(() -> rateLimiter.acquirePermission())
            .flatMap(permitted -> {
                if (!permitted) {
                    return Mono.error(new RateLimitExceededException());
                }
                return webClient.get()
                    .uri("/users/{id}", userId)
                    .retrieve()
                    .bodyToMono(UserDto.class);
            });
    }
}
```

## Mejores Prácticas

1. **Timeouts Apropiados**: Siempre configura timeouts para evitar bloqueos
2. **Reintentos Inteligentes**: Usa reintentos solo para errores transitorios (5xx)
3. **Circuit Breaker**: Implementa circuit breaker para servicios externos
4. **Logging**: Registra requests/responses para debugging
5. **Manejo de Errores**: Mapea errores HTTP a excepciones de dominio
6. **Connection Pooling**: Configura pool de conexiones apropiado
7. **Headers de Seguridad**: Incluye tokens de autenticación cuando sea necesario

## Recursos Adicionales

- [Spring WebClient Documentation](https://docs.spring.io/spring-framework/reference/web/webflux-webclient.html)
- [RestTemplate Documentation](https://docs.spring.io/spring-framework/reference/integration/rest-clients.html)
- [WireMock Documentation](https://wiremock.org/docs/)
- [Resilience4j Documentation](https://resilience4j.readme.io/)
