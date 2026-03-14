# frontapp-cli

CLI for the Front API. Made with [api2cli.dev](https://api2cli.dev).

Version 0.2.0 - Now includes teammates, channels, accounts, events, and comments resources.

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

- **conversations** - Manage customer conversations
- **inboxes** - Manage team inboxes
- **messages** - Send and reply to messages
- **contacts** - Manage customer contacts
- **tags** - Manage conversation tags
- **teammates** - View team members
- **channels** - Manage email/SMS channels
- **accounts** - Manage connected accounts
- **events** - View conversation activity timeline
- **comments** - Add and view internal notes

Run `frontapp-cli <resource> --help` for detailed command options.

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
