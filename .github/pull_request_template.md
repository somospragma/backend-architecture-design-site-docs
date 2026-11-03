## Qué cambia

<!-- Una o dos frases. Si cierra un issue: Closes #123 -->

## Tipo de cambio

- [ ] Ficha nueva
- [ ] Actualización de una ficha
- [ ] Documentación `hosted`
- [ ] Marca o tema (colores, logos, tipografía)
- [ ] Sitio (páginas, componentes, configuración, CI)

## Checklist

### Si agrega o cambia una ficha

- [ ] Cumple los [criterios de entrada](https://github.com/somospragma/backend-architecture-design-site-docs/blob/main/CONTRIBUTING.md#criterios-de-entrada): repo accesible, README con instalación y ejemplo, licencia, owners reales.
- [ ] No tiene secretos, URLs internas ni datos de clientes.
- [ ] El `kind` sigue la regla de CONTRIBUTING (cómo se usa) y la primera disciplina es la principal.
- [ ] `summary` está en español y en inglés.
- [ ] `lastReviewed` tiene la fecha de hoy.
- [ ] `pnpm build` pasa en local (valida el schema).

### Si toca colores o marca

- [ ] Los colores cambiaron solo en `src/styles/tokens.json`.
- [ ] `pnpm check:contrast` pasa.
- [ ] Revisé el sitio en modo claro y oscuro.

### Si agrega o cambia páginas

- [ ] La página existe en español y en inglés.
- [ ] Sigue la [guía de estilo](https://somospragma.github.io/backend-architecture-design-site-docs/guides/style/).
