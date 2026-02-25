# Testing en Docusaurus

## ¿Por qué no hay pruebas unitarias?

Docusaurus es un generador de sitios estáticos enfocado en documentación. A diferencia de aplicaciones tradicionales, los proyectos de Docusaurus típicamente **no requieren pruebas unitarias** porque:

### 1. Contenido Estático
- Los archivos Markdown son contenido, no código ejecutable
- No hay lógica de negocio que probar
- El contenido se valida visualmente

### 2. Build como Validación
El comando `pnpm run build` actúa como validación:
- ✅ Verifica sintaxis MDX
- ✅ Detecta enlaces rotos
- ✅ Valida estructura de archivos
- ✅ Compila componentes React
- ✅ Genera sitio estático

### 3. Componentes Personalizados
Si agregas componentes React personalizados en `src/components/`, entonces sí deberías agregar tests:

```bash
# Instalar dependencias de testing
pnpm add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Crear tests
src/components/MyComponent.test.tsx
```

## Validación Actual

### Build Validation
```bash
pnpm run build
```
Este comando valida:
- Sintaxis MDX correcta
- Enlaces internos válidos
- Configuración correcta
- Compilación de componentes

### Link Checking
```bash
# El build ya incluye link checking
# Warnings sobre enlaces rotos aparecen en el output
```

### Visual Testing
```bash
# Levantar servidor de desarrollo
pnpm run start

# Revisar visualmente en http://localhost:3000
```

## Exclusión de Cobertura

Si integras con SonarQube o herramientas de análisis de código:

### sonar-project.properties
```properties
# Excluir archivos de documentación
sonar.exclusions=\
  docs/**,\
  blog/**,\
  static/**,\
  build/**,\
  .docusaurus/**,\
  node_modules/**

# Solo incluir componentes personalizados
sonar.sources=src/components

# Excluir de cobertura
sonar.coverage.exclusions=\
  docs/**,\
  blog/**,\
  static/**,\
  **/*.md,\
  **/*.mdx
```

## Testing de Componentes (Opcional)

Si decides agregar componentes React personalizados:

### 1. Instalar dependencias
```bash
pnpm add -D \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jest \
  jest-environment-jsdom \
  @types/jest
```

### 2. Configurar Jest (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/**/*.stories.{ts,tsx}',
    '!src/components/**/index.{ts,tsx}',
  ],
};
```

### 3. Agregar script de test
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 4. Ejemplo de test
```typescript
// src/components/MyButton.test.tsx
import { render, screen } from '@testing-library/react';
import MyButton from './MyButton';

describe('MyButton', () => {
  it('renders button with text', () => {
    render(<MyButton>Click me</MyButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Recomendaciones

### Para Proyectos de Documentación Pura
- ❌ No agregar tests unitarios
- ✅ Usar `pnpm run build` como validación
- ✅ Revisar visualmente con `pnpm run start`
- ✅ Configurar CI/CD para ejecutar build

### Para Proyectos con Componentes Personalizados
- ✅ Agregar tests para componentes React
- ✅ Configurar Jest + Testing Library
- ✅ Mantener cobertura >80% en componentes
- ❌ No testear archivos Markdown

## CI/CD Pipeline

```yaml
# .github/workflows/docs.yml
name: Documentation

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build documentation
        run: pnpm run build
      
      - name: Deploy to GitHub Pages
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## Conclusión

Para un proyecto de documentación con Docusaurus:
- **No se necesitan pruebas unitarias** para archivos Markdown
- **El build es la validación** principal
- **Solo agregar tests** si tienes componentes React personalizados
- **Excluir documentación** de análisis de cobertura en SonarQube
