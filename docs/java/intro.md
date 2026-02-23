# Librerías y Herramientas Java

Colección de librerías y herramientas para desarrollo backend con Java, enfocadas en arquitecturas limpias, mejores prácticas y productividad.

## 🏗️ Generadores de Arquitectura

### Clean Architecture Generator

**Generador de arquetipos para arquitecturas limpias en Java**

Plugin de Gradle que genera proyectos completos con arquitectura hexagonal u onion, siguiendo principios de Clean Architecture y Domain-Driven Design.

**Características principales:**
- ✅ Generación de proyectos con arquitectura hexagonal (single, multi, multi-granular) u onion
- ✅ Soporte para paradigma reactivo (Spring WebFlux) e imperativo (Spring MVC)
- ✅ Generadores de componentes: entidades, casos de uso, adaptadores
- ✅ Adaptadores listos para usar: REST, MongoDB, Redis, PostgreSQL, Kafka
- ✅ Templates personalizables con FreeMarker
- ✅ Validación de estructura y configuración

**Casos de uso:**
- Iniciar proyectos nuevos con arquitectura limpia
- Estandarizar estructura de microservicios
- Generar código boilerplate automáticamente
- Mantener consistencia en equipos de desarrollo

**Tecnologías:**
- Spring Boot 3.x
- Spring WebFlux (reactivo) / Spring MVC (imperativo)
- Gradle 8.x
- Java 21+

[Ver documentación completa →](./clean-arch/intro.md)

---

## 📚 Próximas Librerías

### Validation Framework (Próximamente)

Framework de validación declarativa para Java con soporte para validaciones complejas y mensajes personalizados.

**Características planeadas:**
- Validaciones declarativas con anotaciones
- Validaciones cross-field
- Validaciones asíncronas
- Integración con Bean Validation

### Event Sourcing Library (Próximamente)

Librería para implementar Event Sourcing y CQRS en aplicaciones Java.

**Características planeadas:**
- Event Store
- Snapshots
- Projections
- Saga pattern

### API Gateway Toolkit (Próximamente)

Herramientas para construir API Gateways con Spring Cloud Gateway.

**Características planeadas:**
- Rate limiting
- Circuit breaker
- Request/Response transformation
- Authentication/Authorization

---

## 🎯 Filosofía

Todas nuestras librerías Java siguen estos principios:

1. **Clean Architecture**: Separación clara de responsabilidades
2. **Domain-Driven Design**: El dominio es el centro
3. **SOLID**: Principios de diseño orientado a objetos
4. **Testeable**: Fácil de probar con tests unitarios e integración
5. **Productividad**: Reducir código boilerplate
6. **Estándares**: Seguir convenciones de la comunidad Java

## 🚀 Inicio Rápido

### Clean Architecture Generator

```bash
# 1. Agregar plugin a build.gradle.kts
plugins {
    id("com.pragma.archetype-generator") version "0.1.15-SNAPSHOT"
}

# 2. Inicializar proyecto
./gradlew initCleanArch \
  --architecture=hexagonal-single \
  --paradigm=reactive \
  --framework=spring \
  --package=com.example.myapp

# 3. Generar componentes
./gradlew generateEntity --name=User --fields=name:String,email:String
./gradlew generateUseCase --name=CreateUser --methods=execute:User:userData:UserData
./gradlew generateOutputAdapter --name=UserRepository --entity=User --type=mongodb
```

[Ver guía completa →](./clean-arch/getting-started/quick-start.md)

## 📖 Recursos

### Documentación
- [Clean Architecture Generator](./clean-arch/intro.md)
- [Guías y Tutoriales](./clean-arch/getting-started/first-project.md)
- [Referencia de API](./clean-arch/reference/commands.md)

### Repositorios
- [Clean Arch Generator - Core](https://github.com/somospragma/backend-architecture-design-archetype-generator-core)
- [Clean Arch Generator - Templates](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates)

### Comunidad
- [GitHub Discussions](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/discussions)
- [Issues](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues)

## 🤝 Contribuir

¿Quieres contribuir a nuestras librerías Java?

- [Guía para Contribuidores](./clean-arch/contributors/index.md)
- [Desarrollo Local](./clean-arch/contributors/development-setup.md)
- [Agregar Funcionalidades](./clean-arch/contributors/adding-adapter.md)

## 📄 Licencia

Todas las librerías están licenciadas bajo **Apache License 2.0**.

- ✅ Uso comercial permitido
- ✅ Modificación y distribución permitida
- ✅ Protección de patentes
- 📋 Requiere atribución

Ver [LICENSE](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/blob/main/LICENSE) para más detalles.

## 🗺️ Roadmap

### Q1 2026 (Actual)
- ✅ Clean Architecture Generator v0.1
- ✅ Soporte para Spring Reactive
- ✅ Adaptadores: REST, MongoDB, Redis, PostgreSQL

### Q2 2026
- 🚧 Soporte para Spring Imperative
- 🚧 Adaptadores: Kafka, REST Client
- 🔜 Validation Framework v0.1

### Q3 2026
- 🔜 Soporte para Quarkus Reactive
- 🔜 Adaptadores: GraphQL, gRPC
- 🔜 Event Sourcing Library v0.1

### Q4 2026
- 🔜 API Gateway Toolkit v0.1
- 🔜 Soporte para Quarkus Imperative

---

## 💬 Soporte

¿Necesitas ayuda?

- 📖 [Documentación](./clean-arch/intro.md)
- 💬 [Discussions](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/discussions)
- 🐛 [Reportar Bug](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues)
