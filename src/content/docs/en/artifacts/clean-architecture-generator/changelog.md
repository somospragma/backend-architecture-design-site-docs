---
title: Changelog
description: Clean Architecture Generator changes by version.
sidebar:
  order: 99
---

This changelog is for the plugin. The templates have their own versions, in the [templates repository tag list](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates/tags).

## 1.1.1 — 2026-11-11

### Fixed

- The plugin generates with the GitHub templates. It downloads the tag's zip once, stores it in `~/.cleanarch/templates-cache/archives/` and reads it from disk. Version `1.1.0` looked for the files outside the `templates/` folder and couldn't list an adapter's files, so it failed when creating the project and when generating adapters.
- An already downloaded tag is used offline if you pin it with `templates.version`.

## 1.1.0 — 2026-11-11

Don't use it: it can't generate with the GitHub templates. Update to `1.1.1`.

### Changed

- **Templates come from the latest `v1.x.y` tag**, not from the `main` branch of the templates repository. A new or fixed template arrives with the next tag, without updating the plugin.
- The plugin rejects templates with a `schemaVersion` it doesn't understand, with a message that says what to do.
- Updated dependencies: FreeMarker `2.3.35`, jackson-databind `2.22.4`, logback-classic `1.5.38`, snakeyaml `2.7` and slf4j `2.0.20`.

### Added

- `templates.version` pins a templates tag.
- `templates.branch` reads a templates branch.

### Upgrading from 1.0.x

**Breaking:** plugin `1.0.x` read the templates `main` branch, which is no longer compatible with it. Change the plugin version to `1.1.1` in `build.gradle.kts`.
