# Seguridad

## Reportar una vulnerabilidad

No abras un issue público. Usa el reporte privado de GitHub:

1. Ve a la pestaña **Security** de este repositorio.
2. Elige **Report a vulnerability**.
3. Describe qué encontraste, cómo reproducirlo y qué impacto tiene.

Solo el equipo que mantiene el hub ve el reporte. Respondemos en un plazo de 5 días hábiles.

## Qué cubre

| Dónde está el problema | Dónde se reporta |
|---|---|
| El sitio del hub o este repositorio (una dependencia vulnerable, un secreto publicado, un enlace que lleva a un sitio malicioso) | Aquí, con el reporte privado. |
| Un artefacto del catálogo | En el repositorio del artefacto, con su propio `SECURITY.md` o reporte privado. Si no tiene canal o no responde, repórtalo aquí. |
| Una ficha que expone datos de clientes o información interna | Aquí, con el reporte privado. La ficha se retira mientras se revisa. |

## Secretos publicados por error

Si ves un token, contraseña o llave en el repositorio, repórtalo de inmediato por el canal privado. No lo copies en el reporte: basta con el archivo y la línea. El owner debe revocarlo; borrarlo del repositorio no basta.
