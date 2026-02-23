# Guía de Despliegue - GitHub Pages

Este documento explica cómo desplegar la documentación en GitHub Pages.

## 🚀 Despliegue Automático

El sitio se despliega automáticamente a GitHub Pages cada vez que se hace push a la rama `main`.

### Configuración Inicial (Solo una vez)

1. **Habilitar GitHub Pages en el repositorio:**
   - Ve a: `Settings` → `Pages`
   - En "Source", selecciona: `GitHub Actions`
   - Guarda los cambios

2. **Verificar permisos del workflow:**
   - Ve a: `Settings` → `Actions` → `General`
   - En "Workflow permissions", selecciona: `Read and write permissions`
   - Marca: `Allow GitHub Actions to create and approve pull requests`
   - Guarda los cambios

### Proceso de Despliegue

Cada vez que hagas push a `main`:

```bash
git add .
git commit -m "docs: actualizar documentación"
git push origin main
```

El workflow automáticamente:
1. ✅ Instala dependencias con pnpm
2. ✅ Ejecuta `pnpm build`
3. ✅ Despliega a GitHub Pages
4. ✅ El sitio estará disponible en: https://somospragma.github.io/backend-architecture-design-site-docs/

### Verificar el Despliegue

1. Ve a la pestaña `Actions` en GitHub
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Cuando termine (✅ verde), el sitio estará actualizado
4. Visita: https://somospragma.github.io/backend-architecture-design-site-docs/

## 🔧 Despliegue Manual

Si necesitas desplegar manualmente:

1. Ve a: `Actions` → `Deploy to GitHub Pages`
2. Click en `Run workflow`
3. Selecciona la rama `main`
4. Click en `Run workflow`

## 🧪 Probar Localmente Antes de Desplegar

```bash
# Instalar dependencias
pnpm install

# Desarrollo (con hot reload)
pnpm start

# Build de producción (igual que GitHub Actions)
pnpm build

# Servir el build localmente
pnpm serve
```

## 📝 Estructura del Workflow

El archivo `.github/workflows/deploy.yml` contiene:

```yaml
on:
  push:
    branches:
      - main  # Se ejecuta en cada push a main
  workflow_dispatch:  # Permite ejecución manual
```

### Jobs:

1. **build**: Compila el sitio con Docusaurus
   - Instala Node.js 20
   - Instala pnpm 10
   - Cachea dependencias
   - Ejecuta `pnpm build`
   - Sube artifact

2. **deploy**: Despliega a GitHub Pages
   - Descarga artifact
   - Despliega usando `actions/deploy-pages@v4`

## 🌐 URLs

- **Producción**: https://somospragma.github.io/backend-architecture-design-site-docs/
- **Desarrollo local**: http://localhost:3000

## 🔍 Troubleshooting

### El sitio no se actualiza

1. Verifica que el workflow terminó exitosamente (✅ verde)
2. Espera 1-2 minutos para que GitHub Pages actualice
3. Limpia caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
4. Verifica que GitHub Pages esté habilitado en Settings

### Error en el workflow

1. Ve a `Actions` y click en el workflow fallido
2. Revisa los logs para ver el error
3. Errores comunes:
   - **Build failed**: Revisa errores de compilación con `pnpm build` localmente
   - **Permission denied**: Verifica permisos en Settings → Actions
   - **404 en assets**: Verifica que `baseUrl` esté configurado correctamente

### Assets no cargan (404)

Si los CSS/JS no cargan, verifica en `docusaurus.config.js`:

```javascript
url: 'https://somospragma.github.io',
baseUrl: '/backend-architecture-design-site-docs/',  // Debe terminar en /
```

## 📦 Configuración de Docusaurus

Archivo: `docusaurus.config.js`

```javascript
const config = {
  url: 'https://somospragma.github.io',
  baseUrl: '/backend-architecture-design-site-docs/',
  organizationName: 'somospragma',
  projectName: 'backend-architecture-design-site-docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
};
```

## 🔄 Actualizar Documentación

### Workflow típico:

```bash
# 1. Crear rama para cambios
git checkout -b docs/actualizar-seccion

# 2. Hacer cambios en docs/
# Editar archivos .md

# 3. Probar localmente
pnpm start

# 4. Commit y push
git add .
git commit -m "docs: actualizar sección X"
git push origin docs/actualizar-seccion

# 5. Crear Pull Request a main
# Revisar cambios en GitHub

# 6. Merge a main
# El despliegue se ejecuta automáticamente
```

## 📊 Monitoreo

- **Status del sitio**: https://github.com/somospragma/backend-architecture-design-site-docs/deployments
- **Workflows**: https://github.com/somospragma/backend-architecture-design-site-docs/actions
- **GitHub Pages settings**: https://github.com/somospragma/backend-architecture-design-site-docs/settings/pages

## 🎯 Dominio Personalizado (Opcional)

Si quieres usar un dominio personalizado (ej: `docs.pragma.com.co`):

1. Agrega un archivo `static/CNAME` con tu dominio:
   ```
   docs.pragma.com.co
   ```

2. Configura DNS en tu proveedor:
   ```
   CNAME docs.pragma.com.co somospragma.github.io
   ```

3. Actualiza `docusaurus.config.js`:
   ```javascript
   url: 'https://docs.pragma.com.co',
   baseUrl: '/',
   ```

4. En GitHub Settings → Pages, agrega el dominio personalizado

## 📄 Licencia

Este sitio de documentación está bajo Apache License 2.0, igual que el proyecto principal.
