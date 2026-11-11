---
title: How to control the templates version
description: Use the latest tag, pin one, try a branch or work with local templates and offline.
sidebar:
  order: 5
---

The code the plugin generates comes from the [templates repository](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates), not from the plugin. This guide explains how to decide which version of that repository your project uses.

## Which version it uses by default

Plugin `1.x` uses the highest `v1.x.y` tag of the templates repository. If `v1.0.0`, `v1.2.0` and `v1.2.1` exist, it uses `v1.2.1`.

- It queries the tags on the GitHub API once every 10 minutes per Gradle daemon.
- It downloads the tag's zip only once and stores it in `~/.cleanarch/templates-cache/archives/`. A tag never changes, so later generations read it from there.
- Each command prints the version it used (`Ref: v1.2.1`).

This way, a fixed template reaches you on your next generation without changing the plugin version. A change the plugin doesn't understand bumps the templates `schemaVersion` and is published in the next major (`v2.0.0`), which your `1.x` plugin doesn't read.

## How to pin a version

To make a project always generate the same output, even when new templates come out, add to `.cleanarch.yml`:

```yaml
templates:
  version: v1.0.1
```

The available tags are in the [tag list](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates/tags). To go back to the latest version, delete `version`.

## How to try templates that don't have a tag yet

To try a branch of the templates repository, for example a pull request's:

```yaml
templates:
  branch: feat/kafka-adapter
```

A branch is downloaded again on every build, so you see its latest changes. If you set both `version` and `branch`, `version` wins.

## How to use local templates

If you are changing the templates, point the plugin to your copy of the repository:

```yaml
templates:
  mode: developer
  localPath: /home/dev-user/repos/backend-architecture-design-archetype-generator-templates/templates
```

- `localPath` points to the repository's `templates/` folder, not to its root.
- In `developer` mode the plugin uses neither the network nor the cache: every change to a `.ftl` shows up on the next generation.
- Use an absolute path: a relative one is resolved from the folder the Gradle daemon started in, which isn't always the project's. The folder must exist.

To create a project with local templates, create `.cleanarch.yml` with only the `templates` section before running `initCleanArch`. The plugin keeps it when it writes the rest.

## How to work offline

Without network, the plugin can't check which tag is the latest. Pin one you already downloaded:

1. With a connection, run any generation with `version` pinned, so the tag ends up in the cache.
2. Offline, the plugin reads that tag from `~/.cleanarch/templates-cache/archives/` and doesn't use the network.

If the tag isn't in the cache, the plugin fails and says which tag to pin.

## How to clear the cache

```bash
./gradlew updateTemplates
```

It deletes the templates cache and the memory of the latest tag. The next generation queries GitHub and downloads again. `./gradlew clearTemplateCache` does the same with the on-disk cache and shows how much space it freed.

## If something fails

- **`Cannot read the templates releases of …`**: there was no access to the GitHub API, or its limit of 60 unauthenticated requests per hour was reached. Pin `templates.version`.
- **`… has no templates release v1.x.y for this plugin yet`**: the configured repository has no tags for your major. Set `templates.branch` or use the official repository.
- **`Cannot download templates … (HTTP 404)`**: the tag or branch doesn't exist. Check the name.
- **`Template localPath does not exist`**: the `localPath` path doesn't exist. Use an absolute path.
- **`Templates at … use schema N, but this plugin understands schema 1`**: the templates belong to another major. Use a `v1.x.y` tag or update the plugin to the major the message asks for.
