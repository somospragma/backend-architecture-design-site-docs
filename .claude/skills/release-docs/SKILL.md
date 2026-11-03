---
name: release-docs
description: Qué actualizar en la ficha del Pragma Hub y en la documentación cuando un artefacto de Pragma saca una versión. Revisa el README, el changelog, la instalación, el status, el registro y la fecha de revisión, y detecta cambios que rompen compatibilidad. Úsala cuando digan que van a publicar, liberar, sacar o etiquetar una versión, o que ya la publicaron, en el repo del artefacto o en el hub.
---

# Documentación al sacar una versión

Sirve en el repo del artefacto y en el del hub. Pregunta la versión nueva si no la dicen, y lee la diferencia desde el tag anterior (`git log <tag-anterior>..HEAD`, `git diff`) para saber qué cambió de verdad.

## 1. Clasifica el cambio

Con versionado semántico:

- **Mayor** (`2.0.0`): cambia o quita algo público. Hay que decir qué hacer al actualizar.
- **Menor** (`1.5.0`): agrega algo sin romper.
- **Parche** (`1.4.1`): corrige sin cambiar la API.

Si el número que proponen no coincide con lo que encontraste en el diff (por ejemplo, quitaron un método público en un parche), dilo antes de seguir.

## 2. En el repo del artefacto

- [ ] **Changelog:** una sección `## <versión> — AAAA-MM-DD` arriba, con Agregado, Cambiado y Corregido. Cada cambio que rompe compatibilidad, marcado con **Rompe compatibilidad** y con qué hacer.
- [ ] **README:** la versión de la instalación es la nueva, en todas las herramientas de build.
- [ ] Opciones, comandos o inputs nuevos o cambiados están en la tabla de configuración.
- [ ] Los ejemplos siguen funcionando con la versión nueva.
- [ ] Lo nuevo dice "Disponible desde `<versión>`" donde aplique.

## 3. En el hub

Abre `src/content/artifacts/<slug>.md`:

- [ ] **status:**
  - primer release estable: `experimental` o `beta` → `stable`;
  - si se reemplaza por otro artefacto: `deprecated` con `replacedBy` o `deprecationNote`.
  Confírmalo con los owners; no lo cambies por tu cuenta.
- [ ] **registry:** el `id` sigue siendo el mismo (a veces cambian el group o el nombre del paquete).
- [ ] **summary/description:** siguen siendo ciertos.
- [ ] **lastReviewed:** la fecha de hoy.
- [ ] Si es `hosted`: actualiza `changelog.md` y las páginas afectadas en `src/content/docs/artifacts/<slug>/` y su versión en inglés.

Valida con `pnpm build`. Commit: `docs(catalog): update <name> for <versión>`.

## 4. No hagas

- No pongas "la última versión" ni rangos vagos: siempre el número completo.
- No copies el changelog completo en la ficha; la ficha resume, el changelog detalla.
- No publiques el tag ni hagas push sin confirmación.
