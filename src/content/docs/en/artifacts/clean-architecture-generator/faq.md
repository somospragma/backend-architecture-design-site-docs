---
title: FAQ
description: Answers to the most common questions about Clean Architecture Generator.
sidebar:
  order: 90
---

## Can I use it in an existing project?

Not to create it: `initCleanArch` requires an empty folder. If your project already follows one of the architectures, you can write `.cleanarch.yml` by hand with the `project` and `architecture` sections (read the [configuration reference](../reference/configuration/)) and use the generation commands. Check that your packages match the ones the architecture expects.

## Do I have to update the plugin to get new templates?

No. Plugin `1.x` reads the latest `v1.x.y` templates tag on every generation. You only update the plugin to get changes in the plugin itself or to move to a new major. Read [how to control the templates version](../guides/template-versions/).

## Does already generated code change when new templates come out?

No. Templates only affect what you generate from then on. To bring in new ArchUnit rules, run `./gradlew validateStructure`.

## Can I change the architecture or the paradigm later?

Not with the plugin. Create a new project with the architecture you want, generate the same components and move your logic.

## Can I remove the plugin from the generated project?

Yes. The generated code doesn't depend on the plugin to compile or run; the Dockerfile already removes it. If you remove it from `build.gradle.kts`, you lose the generation commands.

## Do I need an internet connection?

To generate, yes, unless you pin `templates.version` to a tag you already downloaded or use local templates. Read [how to work offline](../guides/template-versions/#how-to-work-offline). Building the generated project doesn't need the templates repository.

## Can I use my own templates?

Yes. Fork the templates repository on GitHub and point `templates.repository` to it, or use `mode: developer` with a local copy. To get your change to everyone, open a pull request to the [templates repository](https://github.com/somospragma/backend-architecture-design-archetype-generator-templates): it has the guide for adding architectures and adapters.

## What known issues does version 1.1.1 have?

- `generateUseCase` always generates the same skeleton (`execute`, `findById`, `findAll`, `update`, `delete` on `Object`), regardless of `--methods`.
- The `rest` adapter always publishes a CRUD at `/api/v1/<name>s`, regardless of `--endpoints`.
- Input adapters need `--useCase`, even though the task doesn't require it: without it, `scheduled` fails to generate.
- `listComponents` doesn't find all components in `hexagonal-multi-granular` or in `onion-single`.
- No test classes are generated for use cases or adapters.

## What happened to version 1.1.0?

`1.1.0` can't generate with the GitHub templates: it looks for the files outside the `templates/` folder and can't list an adapter's files. Use `1.1.1`.
