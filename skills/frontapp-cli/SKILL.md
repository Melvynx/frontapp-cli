---
name: frontapp
description: "Manage Front via CLI - conversations, inboxes, messages, contacts, tags. Use when user mentions 'frontapp', 'front', 'team inbox', 'customer conversations', 'shared inbox', or wants to interact with the Front API."
category: customer-communication
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

### conversations

| Command | Description |
|---------|-------------|
| `frontapp-cli conversations list --json` | List all conversations |
| `frontapp-cli conversations list --status open --json` | Filter conversations by status |
| `frontapp-cli conversations list --limit 25 --json` | Limit results per page |
| `frontapp-cli conversations list --page-token <token> --json` | Paginate conversations |
| `frontapp-cli conversations list --fields id,subject,status --json` | Select specific columns |
| `frontapp-cli conversations get <id> --json` | Get conversation details |
| `frontapp-cli conversations update <id> --status archived --json` | Update conversation status |
| `frontapp-cli conversations update <id> --assignee user@example.com --json` | Assign conversation |
| `frontapp-cli conversations update <id> --assignee none --json` | Remove assignment |
| `frontapp-cli conversations update <id> --tags billing,urgent --json` | Set conversation tags |

### inboxes

| Command | Description |
|---------|-------------|
| `frontapp-cli inboxes list --json` | List all inboxes |
| `frontapp-cli inboxes list --fields id,name --json` | Select specific columns |
| `frontapp-cli inboxes get <id> --json` | Get inbox details |
| `frontapp-cli inboxes conversations <id> --json` | List conversations in inbox |
| `frontapp-cli inboxes conversations <id> --status open --json` | Filter inbox conversations |
| `frontapp-cli inboxes conversations <id> --limit 10 --json` | Limit inbox results |
| `frontapp-cli inboxes conversations <id> --page-token <token> --json` | Paginate inbox conversations |

### messages

| Command | Description |
|---------|-------------|
| `frontapp-cli messages list <cnv-id> --json` | List messages in conversation |
| `frontapp-cli messages list <cnv-id> --limit 5 --json` | Limit message results |
| `frontapp-cli messages list <cnv-id> --page-token <token> --json` | Paginate messages |
| `frontapp-cli messages list <cnv-id> --fields id,body,author_id --json` | Select columns |
| `frontapp-cli messages send <cha-id> --to user@example.com --body "Hello!" --json` | Send message from channel |
| `frontapp-cli messages send <cha-id> --to a@b.com,c@d.com --subject "Hi" --body "<p>Content</p>" --json` | Send with subject |
| `frontapp-cli messages reply <cnv-id> --body "Thanks!" --json` | Reply to conversation |
| `frontapp-cli messages reply <cnv-id> --body "Internal note" --type note --json` | Add internal note |

### contacts

| Command | Description |
|---------|-------------|
| `frontapp-cli contacts list --json` | List all contacts |
| `frontapp-cli contacts list --limit 50 --json` | Limit contact results |
| `frontapp-cli contacts list --page-token <token> --json` | Paginate contacts |
| `frontapp-cli contacts list --fields id,name,email --json` | Select specific columns |
| `frontapp-cli contacts get <id> --json` | Get contact details |
| `frontapp-cli contacts create --name "John Doe" --email john@example.com --json` | Create contact |
| `frontapp-cli contacts create --name "Jane" --email jane@example.com --phone "+1234567890" --json` | Create with phone |

### tags

| Command | Description |
|---------|-------------|
| `frontapp-cli tags list --json` | List all tags |
| `frontapp-cli tags list --fields id,name --json` | Select specific columns |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
