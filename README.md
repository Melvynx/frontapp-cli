# frontapp-cli

CLI for the Front API - manage conversations, inboxes, messages, contacts, and tags. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install Melvynx/frontapp-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add Melvynx/frontapp-cli
```

## Auth

```bash
frontapp-cli auth set <token>       # Save your API token
frontapp-cli auth show              # Display current token (masked)
frontapp-cli auth show --raw        # Display full unmasked token
frontapp-cli auth remove            # Delete the saved token
frontapp-cli auth test              # Verify your token works
```

## Resources

### conversations

```bash
# List conversations
frontapp-cli conversations list
frontapp-cli conversations list --status open --limit 25

# Get a conversation
frontapp-cli conversations get cnv_abc123

# Update a conversation
frontapp-cli conversations update cnv_abc123 --status archived
frontapp-cli conversations update cnv_abc123 --assignee user@example.com
frontapp-cli conversations update cnv_abc123 --tags billing,urgent
```

| Action | Flags |
|--------|-------|
| `list` | `--status <open\|archived\|deleted\|spam>` `--limit <n>` `--page-token <token>` `--fields <cols>` |
| `get <id>` | |
| `update <id>` | `--status <status>` `--assignee <email>` `--tags <tags>` |

### inboxes

```bash
# List inboxes
frontapp-cli inboxes list

# Get an inbox
frontapp-cli inboxes get inb_abc123

# List conversations in an inbox
frontapp-cli inboxes conversations inb_abc123 --status open --limit 10
```

| Action | Flags |
|--------|-------|
| `list` | `--fields <cols>` |
| `get <id>` | |
| `conversations <id>` | `--status <status>` `--limit <n>` `--page-token <token>` `--fields <cols>` |

### messages

```bash
# List messages in a conversation
frontapp-cli messages list cnv_abc123 --limit 5

# Send a new message from a channel
frontapp-cli messages send cha_abc123 --to user@example.com --body "Hello!"
frontapp-cli messages send cha_abc123 --to a@b.com,c@d.com --subject "Hi" --body "<p>Hello</p>"

# Reply to a conversation
frontapp-cli messages reply cnv_abc123 --body "Thanks for reaching out!"
frontapp-cli messages reply cnv_abc123 --body "Internal note" --type note
```

| Action | Flags |
|--------|-------|
| `list <conversation-id>` | `--limit <n>` `--page-token <token>` `--fields <cols>` |
| `send <channel-id>` | `--to <recipients>` `--body <body>` `--subject <subject>` |
| `reply <conversation-id>` | `--body <body>` `--type <reply\|note>` |

### contacts

```bash
# List contacts
frontapp-cli contacts list --limit 50

# Get a contact
frontapp-cli contacts get crd_abc123

# Create a contact
frontapp-cli contacts create --name "John Doe" --email john@example.com
frontapp-cli contacts create --name "Jane" --email jane@example.com --phone "+1234567890"
```

| Action | Flags |
|--------|-------|
| `list` | `--limit <n>` `--page-token <token>` `--fields <cols>` |
| `get <id>` | |
| `create` | `--name <name>` `--email <email>` `--phone <phone>` |

### tags

```bash
frontapp-cli tags list
frontapp-cli tags list --json
```

| Action | Flags |
|--------|-------|
| `list` | `--fields <cols>` |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
