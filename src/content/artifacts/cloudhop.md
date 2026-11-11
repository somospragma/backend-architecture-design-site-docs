---
name: cloudhop
summary:
  es: Un alias corto para cada cuenta y rol de AWS. Te loguea con IAM Identity Center solo cuando la sesión venció, sin access keys.
  en: A short alias for every AWS account and role. It signs you in with IAM Identity Center only when the session expired, with no access keys.
description:
  es: Agregas un portal de IAM Identity Center una vez y cloudhop convierte las cuentas y roles que elijas en aliases. Con `cloudhop use` cambias la terminal de cuenta y sigues usando `aws`, Terraform o los SDKs como siempre. Trae una página local para manejar los portales y un servidor MCP para que los asistentes de IA trabajen en tus cuentas.
  en: You add an IAM Identity Center portal once and cloudhop turns the accounts and roles you pick into aliases. With `cloudhop use` you switch the terminal to an account and keep using `aws`, Terraform or the SDKs as usual. It includes a local page to manage portals and an MCP server so AI assistants can work in your accounts.
install: npm install --global cloudhop
kind: tool
disciplines: [cloudops, dx]
languages: [shell]
technologies: [aws, node, terraform]
origin: community
owners: [dayepesb]
repository: https://github.com/dayepesb/cloudhop
registry:
  type: npm
  id: cloudhop
status: stable
license: Apache-2.0
docs:
  mode: indexed
  url: https://dayepesb.github.io/cloudhop/
tags: [aws, sso, iam identity center, credenciales, credentials, cli, perfiles, profiles, mcp]
lastReviewed: 2026-11-11
---
