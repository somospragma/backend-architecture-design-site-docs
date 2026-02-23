# Contributing to Clean Architecture Generator

Welcome! This guide will help you contribute to the project.

## 🚀 Quick Start

**Want to contribute templates?** (Most common)

👉 **[Contributing Templates Guide](./contributing-templates.md)** - No need to touch the core plugin!

**Want to add new features?**

1. [Development Setup](./development-setup.md)
2. Choose what to add:
   - [New Architecture](./adding-architecture.md)
   - [New Command](./adding-command.md)
   - [New Adapter](./adding-adapter.md)

## 📋 What Can You Contribute?

### 1. Templates (Easiest - Start Here!)

Improve or add new templates without modifying the core plugin.

**Examples:**
- Add MongoDB adapter
- Add Kafka adapter
- Improve entity template with Lombok
- Add validation annotations

**Guide:** [Contributing Templates](./contributing-templates.md) ⭐

### 2. New Architectures

Add support for new architectural patterns.

**Examples:**
- Onion Architecture
- Vertical Slice Architecture
- Modular Monolith

**Guide:** [Adding Architecture](./adding-architecture.md)

### 3. New Commands

Extend the plugin with new Gradle tasks.

**Examples:**
- Generate DTOs
- Generate Mappers
- Generate Tests

**Guide:** [Adding Command](./adding-command.md)

### 4. New Adapters

Add support for new technologies.

**Examples:**
- PostgreSQL adapter
- Kafka adapter
- gRPC adapter

**Guide:** [Adding Adapter](./adding-adapter.md)

### 5. Documentation

Improve docs, add examples, create tutorials.

### 6. Bug Fixes

Fix issues, improve error messages, enhance validation.

## 🏗️ Project Structure

```
java-archetype-generator/
├── backend-architecture-design-archetype-generator-core/
│   └── src/main/java/com/pragma/archetype/
│       ├── domain/              # Domain models and ports
│       ├── application/         # Use cases and generators
│       └── infrastructure/      # Adapters (Gradle tasks, etc.)
│
├── backend-architecture-design-archetype-generator-templates/
│   └── templates/
│       ├── architectures/       # Architecture definitions
│       └── frameworks/          # Framework-specific templates
│
└── backend-architecture-design-site-docs/
    └── docs/                    # Documentation
```

## 🎯 Contribution Workflow

### For Templates (No Core Changes)

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#6429CD','primaryTextColor':'#fff','primaryBorderColor':'#440099','lineColor':'#6429CD','secondaryColor':'#8f5ae0','tertiaryColor':'#c5aaf1','textColor':'#1D1D1B','mainBkg':'#6429CD','secondBkg':'#8f5ae0','tertiaryBkg':'#c5aaf1','nodeBorder':'#440099','clusterBkg':'#f5f0ff','clusterBorder':'#6429CD','edgeLabelBackground':'#ffffff','edgeLabelText':'#1D1D1B'}}}%%
graph LR
    A[Fork Templates Repo] --> B[Clone Your Fork]
    B --> C[Create Branch]
    C --> D[Edit Templates]
    D --> E[Configure .cleanarch.yml]
    E --> F[Test Locally]
    F --> G[Push & PR]
    
    style A fill:#8f5ae0,stroke:#440099,color:#fff
    style D fill:#6429CD,stroke:#440099,color:#fff
    style F fill:#c5aaf1,stroke:#6429CD,color:#1D1D1B
    style G fill:#440099,stroke:#330072,color:#fff
```

```bash
# 1. Fork on GitHub
# https://github.com/somospragma/backend-architecture-design-archetype-generator-templates

# 2. Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/backend-architecture-design-archetype-generator-templates.git

# 3. Create branch
git checkout -b feature/add-mongodb-adapter

# 4. Make changes to templates

# 5. Configure .cleanarch.yml in test project
templates:
  mode: developer
  localPath: /absolute/path/to/templates
  cache: false

# 6. Test with local templates
./gradlew initCleanArch --packageName=com.example.test

# 7. Push and create PR
git push origin feature/add-mongodb-adapter
```

### For Core Changes

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'primaryColor':'#6429CD','primaryTextColor':'#fff','primaryBorderColor':'#440099','lineColor':'#6429CD','secondaryColor':'#8f5ae0','tertiaryColor':'#c5aaf1','textColor':'#1D1D1B','mainBkg':'#6429CD','secondBkg':'#8f5ae0','tertiaryBkg':'#c5aaf1','nodeBorder':'#440099','clusterBkg':'#f5f0ff','clusterBorder':'#6429CD','edgeLabelBackground':'#ffffff','edgeLabelText':'#1D1D1B'}}}%%
graph LR
    A[Fork Core Repo] --> B[Clone Your Fork]
    B --> C[Create Branch]
    C --> D[Make Changes]
    D --> E[Build & Publish]
    E --> F[Test]
    F --> G[Push & PR]
    
    style A fill:#8f5ae0,stroke:#440099,color:#fff
    style D fill:#6429CD,stroke:#440099,color:#fff
    style E fill:#531DBC,stroke:#440099,color:#fff
    style G fill:#440099,stroke:#330072,color:#fff
```

```bash
# 1. Fork on GitHub
# https://github.com/somospragma/backend-architecture-design-archetype-generator-core

# 2. Clone YOUR fork
git clone https://github.com/YOUR-USERNAME/backend-architecture-design-archetype-generator-core.git

# 3. Create branch
git checkout -b feature/add-new-command

# 4. Make changes

# 5. Build and publish locally
./gradlew clean build publishToMavenLocal -x test

# 6. Test in a project

# 7. Push and create PR
git push origin feature/add-new-command
```

## 📝 Contribution Guidelines

### Code Style

- Follow Java naming conventions
- Use meaningful names
- Add JavaDoc for public APIs
- Keep methods small and focused

### Commit Messages

Use conventional commits:

```
feat: add MongoDB adapter support
fix: correct package name resolution
docs: update architecture guide
test: add tests for entity generator
```

### Testing

- Test your changes thoroughly
- Verify generated code compiles
- Test end-to-end scenarios

### Documentation

- Update relevant docs
- Add examples
- Include configuration samples

## 🤝 Getting Help

- **Questions?** [GitHub Discussions](https://github.com/somospragma/backend-architecture-design/discussions)
- **Bug Report?** [GitHub Issues](https://github.com/somospragma/backend-architecture-design/issues)
- **Need Guidance?** Check existing PRs or ask in discussions

## 📜 Code of Conduct

Be respectful and constructive. We're building this together!

## 🎉 Thank You!

Your contributions make this project better for everyone!
