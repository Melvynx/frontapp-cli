---
name: frontapp
description: "Manage frontapp via CLI - {{RESOURCES_LIST}}. Use when user mentions 'frontapp' or wants to interact with the frontapp API."
category: {{CATEGORY}}
---

# frontapp-cli

## Setup

If `frontapp-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle frontapp
npx api2cli link frontapp
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
frontapp-cli auth set "your-token"
frontapp-cli auth test
```

## Resources

{{RESOURCES_HELP}}

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
