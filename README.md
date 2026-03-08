# frontapp-cli

CLI for the frontapp API. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install <user>/frontapp-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add <user>/frontapp-cli
```

## Usage

```bash
frontapp-cli auth set "your-token"
frontapp-cli auth test
frontapp-cli --help
```

## Resources

Run `frontapp-cli --help` to see available resources.

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
