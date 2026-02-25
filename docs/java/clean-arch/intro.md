# Introducción a Clean Architecture

Bienvenido a la documentación del **Generador de Arquitectura Limpia**!

## ¿Qué es Clean Architecture?

Clean Architecture (Arquitectura Limpia) es un patrón de diseño de software que promueve la separación de responsabilidades y la independencia de frameworks, bases de datos y tecnologías externas. El objetivo principal es crear sistemas que sean:

- **Independientes de frameworks**: La lógica de negocio no depende de bibliotecas externas
- **Testables**: Las reglas de negocio se pueden probar sin UI, base de datos o servicios externos
- **Independientes de la UI**: La interfaz de usuario puede cambiar sin afectar el negocio
- **Independientes de la base de datos**: Puedes cambiar de Oracle a MongoDB sin afectar las reglas de negocio
- **Independientes de agentes externos**: Las reglas de negocio no saben nada del mundo exterior

## Principios Fundamentales

### 1. La Regla de Dependencia

**Las dependencias del código fuente solo pueden apuntar hacia adentro.** Nada en un círculo interno puede saber algo sobre un círculo externo. En particular, el nombre de algo declarado en un círculo externo no debe ser mencionado por el código en un círculo interno.

```
┌─────────────────────────────────────┐
│     Frameworks & Drivers            │  ← Capa Externa
│  (Web, DB, UI, Devices)             │
├─────────────────────────────────────┤
│     Interface Adapters              │
│  (Controllers, Gateways, Presenters)│
├─────────────────────────────────────┤
│     Application Business Rules      │
│  (Use Cases)                        │
├─────────────────────────────────────┤
│     Enterprise Business Rules       │  ← Capa Interna
│  (Entities)                         │
└─────────────────────────────────────┘
```

### 2. Separación de Responsabilidades

Cada capa tiene una responsabilidad específica:

- **Dominio**: Contiene las entidades y reglas de negocio fundamentales
- **Aplicación**: Orquesta el flujo de datos y coordina las operaciones
- **Infraestructura**: Implementa los detalles técnicos (bases de datos, APIs, frameworks)

### 3. Inversión de Dependencias

Las capas internas definen interfaces (puertos) que las capas externas implementan (adaptadores). Esto permite que el dominio permanezca independiente de los detalles de implementación.

## ¿Qué es el Generador de Arquitectura Limpia?

El Generador de Arquitectura Limpia es un plugin de Gradle que automatiza la creación de proyectos siguiendo los principios de Clean Architecture. Te permite:

- Generar estructuras de proyecto completas con la arquitectura correcta
- Crear entidades, casos de uso y adaptadores con comandos simples
- Mantener la separación de responsabilidades automáticamente
- Enfocarte en la lógica de negocio en lugar del código repetitivo

## Características Principales

- 🏗️ **Múltiples Arquitecturas**: Hexagonal (Puertos y Adaptadores), Onion
- 🚀 **Múltiples Frameworks**: Spring Boot (Reactivo e Imperativo)
- ⚡ **Reactivo e Imperativo**: Soporte completo para ambos paradigmas con 10 adaptadores cada uno
- 📦 **Generadores de Componentes**: Genera entidades, casos de uso y adaptadores bajo demanda
- 🎯 **Mejores Prácticas**: Sigue los principios de arquitectura limpia desde el inicio
- 🔄 **Operaciones CRUD**: Operaciones CRUD auto-generadas para adaptadores
- 🗺️ **Integración MapStruct**: Generación automática de mapeadores
- 🧪 **Listo para Pruebas**: Código generado preparado para testing
- 🌐 **10 Adaptadores Disponibles**: REST, GraphQL, gRPC, SQS, Redis, MongoDB, PostgreSQL, HTTP Client, DynamoDB
- 📚 **Documentación Completa**: Guías detalladas y ejemplos de código

## Arquitecturas Soportadas

### Arquitectura Hexagonal (Puertos y Adaptadores)

La Arquitectura Hexagonal, también conocida como Puertos y Adaptadores, organiza el código en tres capas principales:

- **Dominio**: Entidades y lógica de negocio pura
- **Puertos**: Interfaces que definen contratos (entrada y salida)
- **Adaptadores**: Implementaciones concretas de los puertos

**Variantes disponibles:**
- **Hexagonal Single Module**: Todo en un solo módulo Gradle
- **Hexagonal Multi Module**: Separación en módulos domain, application, infrastructure
- **Hexagonal Multi Module Granular**: Máxima granularidad con módulos separados por tipo de adaptador

### Arquitectura Onion (Cebolla)

La Arquitectura Onion organiza el código en capas concéntricas donde las dependencias apuntan hacia el centro:

- **Core/Domain**: Entidades y objetos de valor (centro de la cebolla)
- **Core/Application**: Servicios de aplicación y puertos
- **Infrastructure**: Adaptadores de entrada y salida

**Variantes disponibles:**
- **Onion Single Module**: Todo en un solo módulo con estructura de carpetas clara
- **Onion Multi Module**: Separación en módulos core y infrastructure

## ¿Cuándo Usar Cada Arquitectura?

### Usa Hexagonal Single Module cuando:
- ✅ Estás comenzando un proyecto nuevo y quieres simplicidad
- ✅ Tu equipo es pequeño (1-3 desarrolladores)
- ✅ El dominio de negocio es relativamente simple
- ✅ Quieres los beneficios de Clean Architecture sin la complejidad de múltiples módulos
- ✅ Necesitas iteración rápida y despliegues frecuentes

### Usa Hexagonal Multi Module cuando:
- ✅ Tu proyecto está creciendo y necesitas mejor organización
- ✅ Tienes múltiples equipos trabajando en diferentes partes
- ✅ Quieres compilación incremental y builds más rápidos
- ✅ Necesitas reutilizar el dominio en múltiples aplicaciones
- ✅ Quieres forzar la separación de responsabilidades a nivel de módulo

### Usa Hexagonal Multi Module Granular cuando:
- ✅ Tienes un sistema grande y complejo
- ✅ Múltiples equipos necesitan trabajar independientemente
- ✅ Quieres máxima flexibilidad para reemplazar adaptadores
- ✅ Necesitas desplegar adaptadores de forma independiente
- ✅ El dominio es complejo y requiere aislamiento estricto

### Usa Onion Single Module cuando:
- ✅ Prefieres la metáfora de capas concéntricas
- ✅ Quieres una estructura de carpetas muy clara y visual
- ✅ Tu equipo está familiarizado con Onion Architecture
- ✅ Necesitas un proyecto simple pero bien estructurado
- ✅ Valoras la claridad conceptual sobre la modularización

### Usa Onion Multi Module cuando:
- ✅ Prefieres Onion pero necesitas separación física de módulos
- ✅ Quieres aislar el core de la infraestructura a nivel de módulo
- ✅ Necesitas reutilizar el core en múltiples contextos
- ✅ Tu equipo prefiere la filosofía Onion con beneficios de modularización

## Tecnologías Soportadas

### Frameworks
- **Spring Boot 3.x**: Con WebFlux (reactivo) o Spring MVC (imperativo)
- **Quarkus**: Próximamente

### Bases de Datos y Cachés
- **Redis**: Adaptador de caché reactivo
- **MongoDB**: Adaptador de base de datos de documentos
- **PostgreSQL**: Adaptador reactivo R2DBC
- **Más**: DynamoDB, MySQL (próximamente)

### Adaptadores de Entrada
- **REST API**: Controladores Spring WebFlux
- **GraphQL**: Próximamente
- **gRPC**: Próximamente
- **WebSocket**: Próximamente

## Ejemplo Rápido

```bash
# 1. Inicializar proyecto
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.pragma.payment

# 2. Generar entidad
./gradlew generateEntity \
  --name=Payment \
  --fields=amount:BigDecimal,currency:String,status:PaymentStatus \
  --packageName=com.pragma.payment.domain.model

# 3. Generar caso de uso
./gradlew generateUseCase \
  --name=ProcessPayment \
  --methods=execute:PaymentResult:payment:Payment \
  --packageName=com.pragma.payment.domain.port.in

# 4. Generar adaptador Redis
./gradlew generateOutputAdapter \
  --name=PaymentRepository \
  --entity=Payment \
  --type=redis \
  --packageName=com.pragma.payment.infrastructure.driven-adapters.redis

# 5. Generar controlador REST
./gradlew generateInputAdapter \
  --name=Payment \
  --useCase=ProcessPaymentUseCase \
  --endpoints="/payments:POST:execute:PaymentResult:payment:BODY:Payment" \
  --packageName=com.pragma.payment.infrastructure.entry-points.rest
```

## Beneficios de Clean Architecture

### Independencia
Tu lógica de negocio no depende de frameworks, UI o bases de datos. Puedes cambiar cualquiera de estos sin afectar las reglas de negocio fundamentales.

### Testabilidad
Las reglas de negocio se pueden probar sin necesidad de la UI, base de datos o cualquier elemento externo. Esto hace que las pruebas sean más rápidas y confiables.

### Flexibilidad
Es fácil cambiar frameworks, bases de datos o UI. Si decides migrar de MongoDB a PostgreSQL, solo cambias el adaptador, no la lógica de negocio.

### Mantenibilidad
La clara separación de responsabilidades hace que el código sea más fácil de entender y mantener. Cada capa tiene un propósito específico.

### Escalabilidad
El código bien organizado escala mejor con tu equipo. Múltiples desarrolladores pueden trabajar en diferentes capas sin conflictos.

## Capas de la Arquitectura

### Capa de Dominio
- **Entidades**: Objetos de negocio fundamentales que encapsulan las reglas de negocio más generales
- **Puertos**: Interfaces que definen contratos (entrada y salida)
- **Lógica de Negocio**: Reglas de negocio puras sin dependencias externas

**Ejemplo:**
```java
// Entidad
public class Payment {
    private final PaymentId id;
    private final Money amount;
    private PaymentStatus status;
    
    public void process() {
        if (status != PaymentStatus.PENDING) {
            throw new InvalidPaymentStateException();
        }
        this.status = PaymentStatus.PROCESSING;
    }
}

// Puerto de salida
public interface PaymentRepository {
    Mono<Payment> save(Payment payment);
    Mono<Payment> findById(PaymentId id);
}
```

### Capa de Aplicación
- **Casos de Uso**: Reglas de negocio específicas de la aplicación
- **Orquestación**: Coordina el flujo entre dominio e infraestructura
- **Servicios de Aplicación**: Implementan los casos de uso

**Ejemplo:**
```java
@UseCase
public class ProcessPaymentUseCase {
    private final PaymentRepository repository;
    private final PaymentGateway gateway;
    
    public Mono<PaymentResult> execute(Payment payment) {
        return Mono.just(payment)
            .doOnNext(Payment::process)
            .flatMap(repository::save)
            .flatMap(gateway::processPayment)
            .map(PaymentResult::from);
    }
}
```

### Capa de Infraestructura
- **Adaptadores de Entrada**: Controladores REST, resolvers GraphQL, consumidores de mensajes
- **Adaptadores de Salida**: Repositorios de base de datos, adaptadores de caché, clientes de APIs externas
- **Configuración**: Configuración específica del framework

**Ejemplo:**
```java
// Adaptador de entrada (REST)
@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final ProcessPaymentUseCase useCase;
    
    @PostMapping
    public Mono<PaymentResponse> process(@RequestBody PaymentRequest request) {
        return useCase.execute(request.toPayment())
            .map(PaymentResponse::from);
    }
}

// Adaptador de salida (Redis)
@Repository
public class RedisPaymentRepository implements PaymentRepository {
    private final ReactiveRedisTemplate<String, Payment> template;
    
    @Override
    public Mono<Payment> save(Payment payment) {
        return template.opsForValue()
            .set(payment.getId().toString(), payment)
            .thenReturn(payment);
    }
}
```

## Flujo de Datos

El flujo de datos en Clean Architecture sigue este patrón:

```
1. Request → Adaptador de Entrada (Controller)
2. Adaptador de Entrada → Caso de Uso (Application)
3. Caso de Uso → Entidad (Domain)
4. Caso de Uso → Puerto de Salida (Interface)
5. Adaptador de Salida → Implementación (Database/API)
6. Response ← Adaptador de Entrada
```

**Ejemplo completo:**
```
POST /payments
    ↓
PaymentController (Infrastructure)
    ↓
ProcessPaymentUseCase (Application)
    ↓
Payment.process() (Domain)
    ↓
PaymentRepository.save() (Port)
    ↓
RedisPaymentRepository (Infrastructure)
    ↓
Redis Database
```

## Versión Actual

**Versión**: 0.1.15-SNAPSHOT

**Estado**: Spring Imperative Support Complete ✅
- ✅ Inicialización de proyectos (reactive e imperative)
- ✅ Generación de entidades
- ✅ Generación de casos de uso (reactive e imperative)
- ✅ Generación de adaptadores de salida (Redis, MongoDB, PostgreSQL, HTTP Client, DynamoDB, SQS Producer)
- ✅ Generación de adaptadores de entrada (REST, GraphQL, gRPC, SQS Consumer)
- ✅ Soporte completo para Spring Reactive (WebFlux)
- ✅ Soporte completo para Spring Imperative (MVC)
- ✅ Nomenclatura correcta: `driven-adapters` y `entry-points`
- ✅ 10 adaptadores disponibles en ambos paradigmas

## Comenzando

Elige tu camino:

### 🚀 Inicio Rápido (10 minutos)
Comienza directamente y construye un servicio completo:
- [Guía de Inicio Rápido](getting-started/quick-start)

### 📚 Tutorial Detallado (30 minutos)
Aprende paso a paso con explicaciones:
- [Tutorial del Primer Proyecto](getting-started/first-project)

### 📖 Aprende los Conceptos
Entiende la arquitectura:
- [Arquitectura Hexagonal](architectures/hexagonal)
- [Arquitectura Onion](architectures/onion)
- [Guía de Spring Reactive](guides/frameworks/spring-reactive)

### 🔧 Documentación de Referencia
Consulta comandos específicos:
- [Referencia de Comandos](reference/commands)
- [Generadores de Componentes](guides/generators/entities)

## Comparación de Arquitecturas

| Característica | Hexagonal Single | Hexagonal Multi | Onion Single | Onion Multi |
|----------------|------------------|-----------------|--------------|-------------|
| **Complejidad** | Baja | Media | Baja | Media |
| **Módulos Gradle** | 1 | 3-5 | 1 | 2-3 |
| **Tiempo de Build** | Rápido | Medio | Rápido | Medio |
| **Separación** | Carpetas | Módulos | Carpetas | Módulos |
| **Ideal para** | Proyectos pequeños | Proyectos medianos | Proyectos pequeños | Proyectos medianos |
| **Tamaño de equipo** | 1-3 devs | 3-10 devs | 1-3 devs | 3-10 devs |
| **Curva de aprendizaje** | Baja | Media | Baja | Media |

## Comunidad y Soporte

- **GitHub**: [pragma/clean-arch-generator](https://github.com/pragma)
- **Issues**: Reporta bugs y solicita funcionalidades
- **Discusiones**: Haz preguntas y comparte ideas

## Licencia

Licencia MIT - ¡siéntete libre de usar en tus proyectos!

---

¿Listo para construir microservicios limpios y mantenibles? ¡Comencemos! 🚀
