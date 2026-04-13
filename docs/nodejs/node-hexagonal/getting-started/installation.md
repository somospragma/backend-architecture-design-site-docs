# Instalación

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 18+** — [Descargar](https://nodejs.org/en/)
- **npm**, **pnpm** o **yarn** — Gestor de paquetes
- **Docker** — [Descargar](https://www.docker.com/get-started) (necesario para ejecución local con SAM)
- **AWS SAM CLI** — [Instalar](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- **Git** — [Descargar](https://git-scm.com/)

## Opción 1: Instalación Automática (Recomendada)

Ejecuta el script interactivo que clona el repositorio, elimina el historial de Git e instala las dependencias:

```bash
bash <(curl -s https://raw.githubusercontent.com/jhonGriGi/node-hexagonal-archetype/refs/heads/main/install-script.bash)
```

El script te ofrecerá dos opciones:

1. **Install with example code**: Clona el proyecto completo con el CRUD de productos de ejemplo
2. **Install structure**: Genera solo la estructura base vacía con las configuraciones

### Instalación con código de ejemplo

Al elegir esta opción, el script te pedirá:
- Carpeta destino (usa `.` para la carpeta actual)
- Remote origin de Git (opcional)
- Gestor de paquetes (npm, pnpm o yarn)

### Instalación solo estructura

Al elegir esta opción, se genera:
- Estructura de carpetas de arquitectura limpia
- Archivos de configuración (`tsconfig.json`, `eslint.config.mjs`, `jest.config.ts`, `template.yaml`, `samconfig.toml`)
- Dependencias base instaladas
- Logger, Builder y utilidades base

## Opción 2: Instalación Manual

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/jhonGriGi/node-hexagonal-archetype.git mi-proyecto
cd mi-proyecto
```

### Paso 2: Eliminar el historial de Git

```bash
# Linux/macOS
rm -rf .git

# Windows PowerShell
Remove-Item -Path ".git" -Recurse -Force
```

### Paso 3: Inicializar nuevo repositorio

```bash
git init
git fetch
```

### Paso 4: Configurar remote (opcional)

```bash
git remote add origin <url-de-tu-repositorio>
```

### Paso 5: Instalar dependencias

```bash
npm install
```

## Verificar la Instalación

Compila el proyecto para verificar que todo está correcto:

```bash
npm run compile
```

Ejecuta los tests:

```bash
npm run test
```

Deberías ver la salida de Jest con los tests pasando y el reporte de cobertura.

## Variables de Entorno

El proyecto requiere variables de entorno para la conexión a base de datos. Crea un archivo `env.json` basándote en `env.example.json`:

| Variable | Descripción |
|----------|-------------|
| `POWERTOOLS_SERVICE_NAME` | Nombre del servicio para logs y métricas |
| `POWERTOOLS_METRICS_NAMESPACE` | Namespace para métricas de CloudWatch |
| `USER_DB` | Usuario de la base de datos |
| `PASSWORD_DB` | Contraseña de la base de datos |
| `HOST_DB` | Host de la base de datos |
| `PORT_DB` | Puerto de la base de datos |
| `DATABASE_DB` | Nombre de la base de datos |

:::info Nota
Estas variables se configuran en `template.yaml` para el despliegue en AWS y se pasan como parámetros de CloudFormation.
:::

## Próximos Pasos

- [Guía de Inicio Rápido](quick-start) — Ejecuta y despliega tu primera Lambda
- [Estructura del Proyecto](../reference/project-structure) — Entiende la organización del código
