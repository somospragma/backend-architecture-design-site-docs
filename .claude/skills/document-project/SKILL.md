---
name: document-project
description: Documentar un proyecto de Pragma (librería, plugin, plantilla, herramienta o automatización, en cualquier lenguaje) para que pueda entrar al Pragma Hub. Escribe o corrige el README con la plantilla oficial y, si hace falta, arma la estructura de documentación hosted (introducción, inicio rápido, guías, referencia, FAQ, changelog). Úsala dentro del repo del artefacto cuando pidan documentarlo, mejorar su README, prepararlo para el hub o revisar si su documentación cumple. Se puede copiar a cualquier repo.
---

# Documentar un proyecto para el Pragma Hub

Esta skill se usa **dentro del repo del artefacto**, no en el hub. Puedes copiar esta carpeta a `.claude/skills/` de cualquier proyecto.

Plantillas oficiales (si hay red, léelas; si no, usa la estructura de abajo):

- README: `https://raw.githubusercontent.com/somospragma/backend-architecture-design-site-docs/main/templates/README.template.md`
- Docs hosted: `https://github.com/somospragma/backend-architecture-design-site-docs/tree/main/templates/docs-hosted`
- Guía de estilo: `https://somospragma.github.io/backend-architecture-design-site-docs/guides/style/`

## 1. Entiende el proyecto antes de escribir

Lee el código, no lo inventes:

- Manifiesto: `build.gradle(.kts)`, `pom.xml`, `package.json`, `pyproject.toml`, `*.csproj`, `pubspec.yaml`, `action.yml`. De ahí salen el nombre publicado, la versión y las versiones de lenguaje soportadas.
- Punto de entrada público: la API, los comandos del CLI, los inputs de la action, las propiedades de configuración con sus valores por defecto.
- Pruebas y ejemplos existentes: son la mejor fuente para el uso rápido.
- `LICENSE` y `CODEOWNERS`.

Si un dato no está en el repo (owners, dónde se publica), pregúntalo. No lo adivines.

## 2. Escribe el README

Secciones en este orden. Todas obligatorias salvo las marcadas:

1. **Título y una frase:** qué resuelve y para quién.
2. **Instalación:** la dependencia o el comando exacto con la versión actual, por cada herramienta de build que soporte.
3. **Uso rápido:** el ejemplo mínimo que funciona al copiar y pegar, con imports. Después, qué resultado se ve.
4. **Configuración:** tabla con opción, valor por defecto y qué hace. Todas las opciones públicas.
5. **Compatibilidad** (opcional): versiones de lenguaje, framework o plataforma.
6. **Contribución:** cómo correr las pruebas y proponer cambios.
7. **Licencia:** el identificador SPDX y enlace a `LICENSE`.
8. **Owners:** usuarios o equipo de GitHub que responden por el artefacto.

Si ya hay un README, conserva lo que esté bien y reordénalo. No borres información útil.

## 3. ¿Hace falta documentación hosted?

Basta con el README (modo `indexed`) si el artefacto se explica en una página. Propón `hosted` si tiene varias tareas distintas, mucha configuración o una referencia larga.

Para `hosted`, arma esta estructura. Va en el repo del hub, en `src/content/docs/artifacts/<slug>/` (y en `en/artifacts/<slug>/` para inglés), o en una carpeta `docs/hub/` del artefacto lista para copiar:

| Archivo | Qué va | `sidebar.order` |
|---|---|---|
| `index.md` | Qué es, cuándo usarlo y cuándo no. | 1 |
| `quick-start.md` | De cero a funcionando en menos de 10 minutos. | 2 |
| `guides/<tarea>.md` | Una página por tarea: "Cómo configurar X". | por guía |
| `reference/<tema>.md` | Opciones, API, comandos. Completa, sin narrativa. | por tema |
| `faq.md` | Preguntas que se repiten. | 90 |
| `changelog.md` | Cambios por versión, la más nueva arriba. | 99 |

Cada página lleva frontmatter con `title`, `description` y `sidebar.order`.

## 4. Revisa antes de terminar

- [ ] Cada ejemplo compila o corre tal cual. Si puedes, pruébalo.
- [ ] Cada bloque de código declara su lenguaje.
- [ ] Las versiones van completas (`1.4.0`) y coinciden con el manifiesto.
- [ ] No hay secretos, tokens, URLs internas, nombres ni datos de clientes. Usa `example.com`, `my-app`, `dev-user`.
- [ ] Frases cortas, segunda persona, voz activa. Títulos en forma de frase.
- [ ] Los enlaces dicen a dónde llevan.

## 5. Siguiente paso

Al terminar, di cómo se clasificaría en el hub para que la ficha salga rápido:

- **Tipo**, cómo se usa: `library` (dependencia), `plugin` (dentro de otra herramienta), `template` (para empezar un proyecto), `tool` (se ejecuta) o `automation` (corre en el pipeline).
- **Disciplina principal:** `backend`, `frontend`, `mobile`, `data`, `ai`, `quality`, `integration`, `cloudops`, `devsecops` o `dx`.
- **Lenguajes y tecnologías** que encontraste en el manifiesto.

Cuando el README esté listo, el artefacto puede entrar al hub con una ficha. En el repo del hub, la skill `add-artifact` la crea y arma el PR.
