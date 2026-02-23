# Guía para Contribuidores

¡Gracias por tu interés en contribuir al Backend Architecture Design Generator! Esta guía te ayudará a empezar.

## 📚 Documentación para Contribuidores

### Primeros Pasos

- **[Overview](./overview.md)** - Visión general del proyecto y cómo contribuir
- **[Development Setup](./development-setup.md)** - Configurar tu entorno de desarrollo
- **[Developer Mode](./developer-mode.md)** - Trabajar con templates localmente

### Sistema de Templates

- **[Template System](./template-system.md)** - Cómo funciona el sistema de templates
- **[Testing Templates](./testing-templates.md)** - Probar templates localmente
- **[Modifying Templates](./modifying-templates.md)** - Modificar templates existentes
- **[Contributing Templates](./contributing-templates.md)** - Contribuir nuevos templates

### Agregar Nuevas Funcionalidades

- **[Adding Adapter](./adding-adapter.md)** - Agregar un nuevo adaptador
- **[Adding Architecture](./adding-architecture.md)** - Agregar una nueva arquitectura
- **[Adding Command](./adding-command.md)** - Agregar un nuevo comando Gradle

## 🚀 Inicio Rápido

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/backend-architecture-design-archetype-generator-core.git
cd backend-architecture-design-archetype-generator-core
```

### 2. Configurar Entorno

```bash
# Verificar Java 21
java -version

# Compilar el proyecto
./gradlew build

# Ejecutar tests
./gradlew test
```

### 3. Hacer Cambios

```bash
# Crear una rama para tu feature
git checkout -b feature/mi-nueva-funcionalidad

# Hacer cambios
# ...

# Commit
git add .
git commit -m "feat: agregar nueva funcionalidad"

# Push
git push origin feature/mi-nueva-funcionalidad
```

### 4. Crear Pull Request

1. Ve a tu fork en GitHub
2. Click en "Pull Request"
3. Describe tus cambios
4. Espera revisión

## 📋 Convenciones

### Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: agregar soporte para PostgreSQL
fix: corregir generación de entidades
docs: actualizar README
test: agregar tests para validators
refactor: mejorar estructura de packages
```

### Código

- Seguir convenciones de Java
- Usar nombres descriptivos
- Agregar JavaDoc a métodos públicos
- Mantener métodos pequeños y enfocados
- Escribir tests para nuevas funcionalidades

### Templates

- Usar FreeMarker correctamente
- Documentar variables disponibles
- Probar con diferentes configuraciones
- Seguir estructura de packages

## 🤝 Tipos de Contribuciones

### 🐛 Reportar Bugs

Abre un [issue](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues) con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Versión del plugin
- Logs relevantes

### ✨ Proponer Features

Abre un [issue](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues) con:
- Descripción de la funcionalidad
- Casos de uso
- Ejemplos de cómo se usaría
- Beneficios para usuarios

### 📝 Mejorar Documentación

- Corregir typos
- Agregar ejemplos
- Clarificar instrucciones
- Traducir contenido

### 🔧 Contribuir Código

- Implementar nuevos adaptadores
- Agregar soporte para frameworks
- Mejorar generadores existentes
- Optimizar rendimiento

## 📖 Recursos

### Repositorios

- [Core](https://github.com/somospragma/backend-architecture-design-archetype-generator-core) - Plugin Gradle
- [Templates](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates) - Templates Freemarker
- [Docs](https://github.com/somospragma/backend-architecture-design-site-docs) - Documentación

### Tecnologías

- [Gradle](https://gradle.org/) - Build tool
- [FreeMarker](https://freemarker.apache.org/) - Template engine
- [Spring Boot](https://spring.io/projects/spring-boot) - Framework
- [Docusaurus](https://docusaurus.io/) - Documentation

### Comunidad

- [Discussions](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/discussions) - Preguntas y discusiones
- [Issues](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues) - Bugs y features

## 📄 Licencia

Este proyecto está licenciado bajo Apache License 2.0. Al contribuir, aceptas que tus contribuciones se licencien bajo los mismos términos.

Ver [LICENSE](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/blob/main/LICENSE) para más detalles.

## 🙏 Agradecimientos

Gracias a todos los [contribuidores](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/graphs/contributors) que han ayudado a mejorar este proyecto.

## 💬 ¿Necesitas Ayuda?

- Lee la [documentación completa](../)
- Busca en [issues existentes](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/issues)
- Pregunta en [Discussions](https://github.com/somospragma/backend-architecture-design-archetype-generator-core/discussions)
- Revisa las [guías para contribuidores](./overview.md)
