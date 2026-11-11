---
title: The generated project
description: What a newly created project includes, its versions, its quality tasks and the architecture rules it checks.
sidebar:
  order: 10
---

This is what `initCleanArch` leaves with the `v1.0.1` templates. The versions change with each templates tag; the project's are in `gradle/libs.versions.toml`.

## Versions

| Piece | Version |
|---|---|
| Java | `21` |
| Gradle (wrapper) | `8.14.1` |
| Spring Boot | `4.0.9` |
| MapStruct | `1.6.3` |
| Lombok | `1.18.36` |
| ArchUnit | `1.3.0` |
| springdoc-openapi | `2.8.6` |

## Files

| File | What it is |
|---|---|
| `build.gradle.kts` | Java, Spring Boot, JaCoCo, PIT, SonarQube and OWASP Dependency-Check plugins, plus the generator itself. |
| `main.gradle` | Configuration of the quality tools. |
| `gradle/libs.versions.toml` | Version catalog, generated from the templates. |
| `settings.gradle.kts` | The project and its modules. |
| `src/main/resources/application.yml` | Application name, graceful shutdown, structured logs and Actuator with `health`, `info` and `prometheus`. |
| `<Project>Application.java` | The Spring Boot main class. |
| `Dockerfile` and `.dockerignore` | Three-stage production image (see below). |
| `README.md` | How to build, run and test the project, and the generator tasks. |
| `lombok.config`, `gradle.properties`, `.gitignore` | Build and repository configuration. |

## Quality

| Tool | Task | Threshold |
|---|---|---|
| JaCoCo | `./gradlew jacocoTestCoverageVerification` | 85 % line coverage. It doesn't run with `build`: add it to your pipeline. |
| PIT | `./gradlew pitest` | 20 % of mutations detected. |
| OWASP Dependency-Check | `./gradlew dependencyCheckAnalyze` | Fails with CVSS 7.0 or higher. Exceptions go in `owasp-suppressions.xml`. |
| SonarQube | `./gradlew sonar` | Reads `SONAR_TOKEN`, `SONAR_ORGANIZATION`, `SONAR_PROJECT_KEY` and `SONAR_HOST_URL` (SonarCloud by default). |

PIT and Dependency-Check take several minutes. For a fast local build: `./gradlew build -x pitest -x dependencyCheckAnalyze`.

## Docker

```bash
docker build -t order-service .
docker run -p 8080:8080 order-service
```

1. Builds the jar with Gradle `8.14.1` and JDK 21. It removes the generator plugin line, which isn't needed to compile.
2. Assembles a minimal JRE with `jlink`.
3. Copies the jar and the JRE to `debian:bookworm-slim`, runs as the `appuser` user and exposes port `8080` with a `HEALTHCHECK`.

## Architecture tests

They are in `src/test/java/<package>/architecture/` (in `hexagonal-multi`, in the `infrastructure` module; in `hexagonal-multi-granular`, in `app-service`) and run with `./gradlew test`.

| Class | What it checks |
|---|---|
| `ArchitectureTest` | The architecture layers. In hexagonal: only `config` uses the use cases, nobody uses the adapters, the model doesn't depend on ports or use cases, ports don't depend on use cases and each use case implements an input port. In onion: dependencies only point inwards. |
| `DomainPurityTest` | The domain and the application don't use Spring or other frameworks, and the domain doesn't depend on infrastructure. |
| `AdapterRulesTest` | Ports are interfaces, entry points don't use driven adapters, driven adapters don't call entry points or use cases, adapters don't depend on each other and each driven adapter implements a domain interface. |
| `NamingConventionTest` | No technical suffixes in the domain, domain interfaces with the `I` prefix, output ports with the `Gateway` suffix, use cases with the `UseCase` suffix and adapters with the `Adapter` suffix. |
| `ImmutabilityTest` | The fields of use cases and adapters are `final`. |
| `CodingRulesTest` | No `System.out`, no generic exceptions, no `java.util.logging` and no cycles between packages. |
| `FrameworkRulesTest` | No field injection; controllers in `entrypoints` and repositories in `drivenadapters`. |
| `ParadigmRulesTest` | In reactive, no blocking calls (`block()`) or blocking stack. In imperative, no reactive stack. |

If a new templates version brings new rules, `./gradlew validateStructure` copies them into the project and runs them.

## What it doesn't include

- A CI pipeline: write the one for your platform with `build`, `jacocoTestCoverageVerification`, `pitest`, `dependencyCheckAnalyze` and `sonar`.
- Checkstyle, PMD, SpotBugs or Spotless.
- Unit tests for use cases and adapters.
