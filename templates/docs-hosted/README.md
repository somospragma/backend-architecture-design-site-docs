# Documentación hosted

Estructura para un artefacto con `docs.mode: hosted`. Copia esta carpeta a:

- `src/content/docs/artifacts/<slug>/` para español (obligatorio).
- `src/content/docs/en/artifacts/<slug>/` para inglés. Si falta una página en inglés, Starlight muestra la de español con un aviso.

No copies este README. Las páginas aparecen solas en la barra lateral del área del artefacto, en el orden de `sidebar.order`.

| Archivo | Qué va |
|---|---|
| `index.md` | Introducción: qué es, cuándo usarlo y cuándo no. |
| `quick-start.md` | De cero a funcionando en menos de 10 minutos. |
| `guides/` | Una página por tarea ("Cómo configurar X"). |
| `reference/` | Opciones, API, comandos. Completa y sin narrativa. |
| `faq.md` | Preguntas que se repiten. |
| `changelog.md` | Cambios por versión, la más nueva arriba. |
