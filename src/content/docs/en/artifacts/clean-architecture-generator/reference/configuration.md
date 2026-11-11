---
title: Configuration
description: Every .cleanarch.yml key, its default value and who writes it.
sidebar:
  order: 7
---

`.cleanarch.yml` lives at the project root. `initCleanArch` writes the `project` and `architecture` sections; you write the `templates` section, if you need it. Keep the file under version control with the project: the generation commands read it.

## Full example

```yaml
project:
  name: order-service
  basePackage: com.example.orders
  pluginVersion: 1.1.1
  createdAt: '2026-11-11T10:30:00'
architecture:
  type: hexagonal-multi
  paradigm: reactive
  framework: spring
  adaptersAsModules: false
templates:
  version: v1.0.1
```

## project

| Key | Type | What it is |
|---|---|---|
| `name` | text | Project name: `rootProject.name` or the folder name. |
| `basePackage` | text | The `--package` of `initCleanArch`. Every generated package starts with it. |
| `pluginVersion` | text | Version of the plugin that last generated. The adapter commands update it when you use another version. |
| `createdAt` | ISO date and time | When the project was created. |

`name` and `basePackage` are required: without them, the commands fail with a message that shows an example.

## architecture

| Key | Type | Values |
|---|---|---|
| `type` | text | `hexagonal-single`, `hexagonal-multi`, `hexagonal-multi-granular`, `onion-single` |
| `paradigm` | text | `reactive`, `imperative` |
| `framework` | text | `spring` |
| `adaptersAsModules` | boolean | `true` in `hexagonal-multi-granular`. The architecture decides it; don't change it. |

Don't change `type` or `paradigm` in an existing project: the already generated code doesn't move, and new commands would generate into a different structure.

## templates

All keys are optional. Read [how to control the templates version](../../guides/template-versions/) for the use cases.

| Key | Type | Default | What it does |
|---|---|---|---|
| `version` | text | the latest `v1.x.y` tag | Pins a templates tag, for example `v1.0.1`. |
| `branch` | text | | Reads a branch instead of a tag. If `version` is also set, `version` wins. |
| `repository` | URL | `https://github.com/somospragma/backend-architecture-design-archetype-generator-templates` | Templates repository. To use a fork, it must be on GitHub. |
| `mode` | text | `production` | `developer` (or `local`) reads the templates from `localPath`. Any other value reads them from GitHub. |
| `localPath` | path | | `templates/` folder of a local copy of the repository. Only used with `mode: developer`. Use an absolute path. |
| `cache` | boolean | `true` | With `false`, the plugin doesn't store on disk what it downloads file by file. Tags downloaded as a zip are always stored. |

## Files the plugin creates

| Path | What it is |
|---|---|
| `.cleanarch.yml` | This configuration. |
| `.cleanarch/backups/<id>/` | Copies of `application.yml` and `build.gradle.kts` before generating each adapter. You can delete them and add them to `.gitignore`. |
| `~/.cleanarch/templates-cache/` | Templates cache, shared by all your projects. `updateTemplates` and `clearTemplateCache` delete it. |
