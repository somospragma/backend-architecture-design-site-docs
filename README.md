# Pragma Libs Documentation

Official documentation site for Pragma's enterprise libraries and tools.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build
```

## 🎨 Branding

### Colors (Pragma Brand)
- **Primary Purple**: `#6429CD` (Pantone 2090 c)
- **Black**: `#1D1D1B` (Pantone 419 c)
- **White**: `#FFFFFF`
- **Secondary Purples**:
  - Dark: `#330072` (Pantone 2685 c)
  - Medium: `#440099` (Pantone Violeta c)
  - Light: `#531DBC` (Pantone 2098 c)

### Assets
- Logos: `static/img/pragma-logo.svg`, `pragma-logo-white.svg`
- Icons: `static/img/pragma-icon.svg`, `pragma-icon-white.svg`, `pragma-icon-dark.svg`
- Feature icons: `static/img/icons/`

## 📚 Available Libraries

### Clean Architecture Generator
A Gradle plugin for generating clean architecture projects with support for:
- Hexagonal and Onion architectures
- Spring Boot and Quarkus frameworks
- Reactive and Imperative paradigms

[View Documentation →](docs/clean-arch/intro.md)

## 🏗️ Project Structure

```
.
├── docs/                          # Documentation content
│   ├── intro.md                  # Main landing page
│   └── clean-arch/               # Clean Architecture Generator docs
│       ├── intro.md
│       ├── getting-started/
│       ├── guides/
│       └── reference/
├── src/
│   ├── components/               # React components
│   ├── css/                      # Custom styles
│   └── pages/                    # Custom pages
├── static/                       # Static assets
│   └── img/                      # Images and icons
├── docusaurus.config.js          # Docusaurus configuration
└── sidebars.js                   # Sidebar configuration
```

## 🚀 Deployment

El sitio se despliega automáticamente a GitHub Pages cuando se hace push a `main`.

**URL de producción:** https://somospragma.github.io/backend-architecture-design-site-docs/

### Despliegue Automático

Cada push a `main` ejecuta el workflow de GitHub Actions que:
1. Instala dependencias
2. Ejecuta `pnpm build`
3. Despliega a GitHub Pages

Ver [DEPLOYMENT.md](DEPLOYMENT.md) para más detalles.

### Configuración Inicial

1. Habilitar GitHub Pages en `Settings` → `Pages`
2. Seleccionar "Source": `GitHub Actions`
3. Verificar permisos en `Settings` → `Actions` → `General`

## 🛠️ Built With

- [Docusaurus](https://docusaurus.io/) - Documentation framework
- [React](https://reactjs.org/) - UI library
- [pnpm](https://pnpm.io/) - Package manager

## 📝 Licencia

Este proyecto está licenciado bajo la **Apache License 2.0** - ver el archivo [LICENSE](LICENSE) para más detalles.

```
Copyright 2025 Pragma S.A. and Contributors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0
```

### ¿Qué puedes hacer con este proyecto?

- ✅ Usar en proyectos personales y comerciales
- ✅ Modificar y crear obras derivadas
- ✅ Distribuir copias originales o modificadas
- ✅ Hacer fork y evolucionar el proyecto
- ✅ Usar en tu empresa sin restricciones

### ¿Qué debes hacer?

- 📋 Mantener los avisos de copyright y licencia
- 📋 Incluir el archivo [NOTICE](NOTICE) en distribuciones
- 📋 Documentar cambios significativos realizados
- 📋 Dar atribución al proyecto original

Ver [NOTICE](NOTICE) para información de atribución.
