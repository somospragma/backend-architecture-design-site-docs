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

## 🛠️ Built With

- [Docusaurus](https://docusaurus.io/) - Documentation framework
- [React](https://reactjs.org/) - UI library
- [pnpm](https://pnpm.io/) - Package manager

## 📝 License

Copyright © 2026 Pragma. All rights reserved.
