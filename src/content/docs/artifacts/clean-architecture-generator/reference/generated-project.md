---
title: El proyecto generado
description: Qué trae un proyecto recién creado, sus versiones, sus tareas de calidad y las reglas de arquitectura que verifica.
sidebar:
  order: 10
---

Esto es lo que deja `initCleanArch` con las plantillas `v1.0.1`. Las versiones cambian con cada tag de plantillas; las del proyecto están en `gradle/libs.versions.toml`.

## Versiones

| Pieza | Versión |
|---|---|
| Java | `21` |
| Gradle (wrapper) | `8.14.1` |
| Spring Boot | `4.0.9` |
| MapStruct | `1.6.3` |
| Lombok | `1.18.36` |
| ArchUnit | `1.3.0` |
| springdoc-openapi | `2.8.6` |

## Archivos

| Archivo | Qué es |
|---|---|
| `build.gradle.kts` | Plugins de Java, Spring Boot, JaCoCo, PIT, SonarQube, OWASP Dependency-Check y el propio generador. |
| `main.gradle` | Configuración de las herramientas de calidad. |
| `gradle/libs.versions.toml` | Catálogo de versiones, generado desde las plantillas. |
| `settings.gradle.kts` | El proyecto y sus módulos. |
| `src/main/resources/application.yml` | Nombre de la aplicación, apagado ordenado, logs estructurados y Actuator con `health`, `info` y `prometheus`. |
| `<Proyecto>Application.java` | La clase principal de Spring Boot. |
| `Dockerfile` y `.dockerignore` | Imagen de producción en tres etapas (ver abajo). |
| `README.md` | Cómo construir, correr y probar el proyecto, y las tareas del generador. |
| `lombok.config`, `gradle.properties`, `.gitignore` | Configuración del build y del repositorio. |

## Calidad

| Herramienta | Tarea | Umbral |
|---|---|---|
| JaCoCo | `./gradlew jacocoTestCoverageVerification` | 85 % de líneas. No corre con `build`: agrégala a tu pipeline. |
| PIT | `./gradlew pitest` | 20 % de mutaciones detectadas. |
| OWASP Dependency-Check | `./gradlew dependencyCheckAnalyze` | Falla con CVSS 7.0 o más. Las excepciones van en `owasp-suppressions.xml`. |
| SonarQube | `./gradlew sonar` | Lee `SONAR_TOKEN`, `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY` y `SONAR_HOST_URL` (por defecto, SonarCloud). |

PIT y Dependency-Check tardan varios minutos. Para un build rápido en local: `./gradlew build -x pitest -x dependencyCheckAnalyze`.

## Docker

```bash
docker build -t order-service .
docker run -p 8080:8080 order-service
```

1. Compila el jar con Gradle `8.14.1` y JDK 21. Quita la línea del plugin generador, que no hace falta para compilar.
2. Arma un JRE mínimo con `jlink`.
3. Copia el jar y el JRE a `debian:bookworm-slim`, corre como el usuario `appuser` y expone el puerto `8080` con un `HEALTHCHECK`.

## Pruebas de arquitectura

Están en `src/test/java/<paquete>/architecture/` (en `hexagonal-multi`, en el módulo `infrastructure`; en `hexagonal-multi-granular`, en `app-service`) y corren con `./gradlew test`.

| Clase | Qué verifica |
|---|---|
| `ArchitectureTest` | Las capas de la arquitectura. En hexagonal: solo `config` usa los casos de uso, nadie usa los adaptadores, el modelo no depende de puertos ni casos de uso, los puertos no dependen de casos de uso y cada caso de uso implementa un puerto de entrada. En onion: las dependencias solo apuntan hacia adentro. |
| `DomainPurityTest` | El dominio y la aplicación no usan Spring ni otros frameworks, y el dominio no depende de infraestructura. |
| `AdapterRulesTest` | Los puertos son interfaces, los entry points no usan driven adapters, los driven adapters no llaman a entry points ni a casos de uso, los adaptadores no dependen entre sí y cada driven adapter implementa una interfaz del dominio. |
| `NamingConventionTest` | Sin sufijos técnicos en el dominio, interfaces del dominio con prefijo `I`, puertos de salida con sufijo `Gateway`, casos de uso con sufijo `UseCase` y adaptadores con sufijo `Adapter`. |
| `ImmutabilityTest` | Los campos de los casos de uso y de los adaptadores son `final`. |
| `CodingRulesTest` | Sin `System.out`, sin excepciones genéricas, sin `java.util.logging` y sin ciclos entre paquetes. |
| `FrameworkRulesTest` | Sin inyección por campo; los controladores en `entrypoints` y los repositorios en `drivenadapters`. |
| `ParadigmRulesTest` | En reactivo, sin llamadas bloqueantes (`block()`) ni stack bloqueante. En imperativo, sin el stack reactivo. |

Si una versión nueva de las plantillas trae reglas nuevas, `./gradlew validateStructure` las copia al proyecto y las corre.

## Lo que no trae

- Pipeline de CI: escribe el de tu plataforma con `build`, `jacocoTestCoverageVerification`, `pitest`, `dependencyCheckAnalyze` y `sonar`.
- Checkstyle, PMD, SpotBugs o Spotless.
- Pruebas unitarias de casos de uso y adaptadores.
