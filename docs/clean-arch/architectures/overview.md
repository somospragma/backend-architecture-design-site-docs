# Arquitecturas Disponibles

Esta guía proporciona una visión general de todas las arquitecturas soportadas por el plugin de Clean Architecture. Cada arquitectura ofrece diferentes niveles de modularidad y complejidad, permitiéndote elegir la que mejor se adapte a las necesidades de tu proyecto.

## Comparación de Arquitecturas

| Característica | Hexagonal Single | Hexagonal Multi | Hexagonal Multi Granular | Onion Single |
|----------------|------------------|-----------------|--------------------------|--------------|
| **Módulos Gradle** | 1 | 3 | Múltiples (dinámico) | 1 |
| **Complejidad** | Baja | Media | Alta | Baja |
| **Tamaño de Proyecto** | Pequeño a Mediano | Mediano a Grande | Grande a Empresarial | Pequeño a Mediano |
| **Separación de Capas** | Por paquetes | Por módulos | Por módulos granulares | Por paquetes |
| **Tiempo de Build** | Rápido | Medio | Más lento | Rápido |
| **Reutilización** | Limitada | Buena | Excelente | Limitada |
| **Curva de Aprendizaje** | Baja | Media | Alta | Media |
| **Ideal para Equipos** | 1-3 desarrolladores | 3-8 desarrolladores | 8+ desarrolladores | 1-5 desarrolladores |
| **Patrón Principal** | Ports & Adapters | Ports & Adapters | Ports & Adapters | Capas Concéntricas |

## ¿Cuándo Usar Cada Arquitectura?

### Hexagonal Single Module
**Ideal para:**
- Proyectos pequeños a medianos
- Equipos pequeños (1-3 desarrolladores)
- Microservicios simples
- Prototipos y MVPs
- Proyectos con requisitos de build rápido

**Ventajas:**
- Configuración simple
- Build rápido
- Fácil de entender y mantener
- Menos overhead de configuración

**Desventajas:**
- Difícil reutilizar componentes en otros proyectos
- Todas las dependencias se compilan juntas
- Puede volverse difícil de mantener en proyectos grandes

### Hexagonal Multi Module
**Ideal para:**
- Proyectos medianos a grandes
- Equipos de 3-8 desarrolladores
- Aplicaciones con lógica de negocio compleja
- Proyectos que requieren separación clara de responsabilidades
- Cuando necesitas reutilizar el dominio en múltiples aplicaciones

**Ventajas:**
- Separación clara entre dominio, aplicación e infraestructura
- Posibilidad de reutilizar módulos de dominio
- Builds incrementales más eficientes
- Mejor organización para equipos medianos

**Desventajas:**
- Configuración más compleja que single module
- Overhead de gestión de dependencias entre módulos
- Puede ser excesivo para proyectos pequeños

### Hexagonal Multi Module Granular
**Ideal para:**
- Proyectos grandes y empresariales
- Equipos grandes (8+ desarrolladores)
- Arquitecturas de microservicios complejas
- Proyectos con múltiples adaptadores reutilizables
- Cuando necesitas máxima flexibilidad y reutilización

**Ventajas:**
- Máxima modularidad y reutilización
- Cada adaptador es independiente
- Ideal para desarrollo en paralelo
- Facilita la creación de librerías compartidas
- Mejor aislamiento de cambios

**Desventajas:**
- Configuración muy compleja
- Builds más lentos
- Requiere experiencia en gestión de módulos
- Puede ser abrumador para equipos pequeños

### Onion Single Module
**Ideal para:**
- Proyectos que prefieren el patrón de capas concéntricas
- Equipos familiarizados con DDD (Domain-Driven Design)
- Aplicaciones con dominio rico y complejo
- Proyectos que priorizan la independencia del dominio
- Cuando quieres enfatizar las reglas de negocio

**Ventajas:**
- Dominio completamente independiente
- Reglas de dependencia muy claras
- Excelente para DDD
- Fácil de testear el dominio de forma aislada
- Build rápido (single module)

**Desventajas:**
- Curva de aprendizaje para quienes no conocen Onion
- Puede requerir más interfaces que Hexagonal
- Limitada reutilización (single module)

## Estructura de Directorios

### Hexagonal Single Module
```
my-project/
├── src/main/java/com/example/
│   ├── domain/
│   │   ├── model/              # Entidades y objetos de valor
│   │   ├── port/
│   │   │   ├── in/             # Puertos de entrada (use cases)
│   │   │   └── out/            # Puertos de salida (repositories)
│   ├── application/
│   │   └── usecase/            # Implementación de use cases
│   └── infrastructure/
│       ├── entry-points/
│       │   └── rest/           # Controladores REST
│       ├── driven-adapters/    # Adaptadores de salida
│       └── config/             # Configuración
```

### Hexagonal Multi Module
```
my-project/
├── domain/                     # Módulo de dominio
│   └── src/main/java/
│       ├── model/
│       └── port/
├── application/                # Módulo de aplicación
│   └── src/main/java/
│       └── usecase/
└── infrastructure/             # Módulo de infraestructura
    └── src/main/java/
        ├── entry-points/
        ├── driven-adapters/
        └── config/
```

### Hexagonal Multi Module Granular
```
my-project/
├── domain/
│   ├── model/                  # Módulo: entidades
│   ├── ports/                  # Módulo: interfaces
│   └── usecase/                # Módulo: use cases
├── application/
│   └── app-service/            # Módulo: aplicación principal
└── infrastructure/
    ├── entry-points/
    │   ├── rest-api/           # Módulo: API REST
    │   └── messaging/          # Módulo: mensajería
    └── driven-adapters/
        ├── mongodb/            # Módulo: adaptador MongoDB
        └── redis/              # Módulo: adaptador Redis
```

### Onion Single Module
```
my-project/
├── src/main/java/com/example/
│   ├── core/
│   │   ├── domain/             # Capa más interna: entidades
│   │   └── application/
│   │       ├── service/        # Use cases y servicios
│   │       └── port/           # Interfaces de puertos
│   └── infrastructure/
│       ├── adapter/
│       │   ├── in/             # Adaptadores de entrada
│       │   └── out/            # Adaptadores de salida
│       └── config/             # Configuración
```

## Reglas de Dependencia

### Hexagonal Architecture
En la arquitectura hexagonal, las dependencias fluyen hacia el dominio:
- **Dominio**: No depende de nada (núcleo puro)
- **Aplicación**: Depende solo del dominio
- **Infraestructura**: Depende del dominio y la aplicación

### Onion Architecture
En la arquitectura Onion, las dependencias apuntan hacia el centro:
- **Core/Domain**: Capa más interna, sin dependencias externas
- **Core/Application**: Depende solo del dominio
- **Infrastructure**: Capa más externa, depende de las capas internas

## Migración Entre Arquitecturas

Aunque cada arquitectura tiene su propia estructura, el plugin facilita la migración:

1. **Single → Multi Module**: Separar paquetes en módulos Gradle
2. **Multi → Multi Granular**: Extraer adaptadores a módulos independientes
3. **Hexagonal ↔ Onion**: Reorganizar paquetes según el patrón elegido

> **Nota**: La migración entre arquitecturas requiere refactorización manual. El plugin no proporciona comandos automáticos de migración.

## Próximos Pasos

- [Hexagonal Single Module](./hexagonal-single.md) - Guía detallada
- [Hexagonal Multi Module](./hexagonal-multi.md) - Guía detallada
- [Hexagonal Multi Module Granular](./hexagonal-multi-granular.md) - Guía detallada
- [Onion Single Module](./onion-single.md) - Guía detallada
- [Comenzar un Proyecto](../getting-started/first-project.md) - Tutorial paso a paso
