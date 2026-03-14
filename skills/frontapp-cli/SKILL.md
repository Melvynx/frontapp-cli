---
name: frontapp
description: "Manage Front (shared inbox) via CLI - conversations, inboxes, messages, contacts, tags, teammates, channels, accounts, events, comments. Use when user mentions 'front', 'frontapp', 'shared inbox', 'team inbox', 'customer email', 'support inbox', 'help@', 'reply to customer', 'check front', 'front conversations', or wants to read/send/manage customer communications."
category: customer-communication
---

# frontapp-cli

Front shared inbox CLI. Read conversations, reply to customers, manage contacts, and monitor team activity.

## Setup

```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle frontapp
npx api2cli link frontapp
```

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
frontapp-cli auth set "your-front-api-token"
frontapp-cli auth test
```

**Important:** Front uses company-specific API URLs (e.g., `companyname.api.frontapp.com`). The base URL is configured in `src/lib/config.ts`.

## When to Use

- **Check inbox**: "any new emails in Front?" → `conversations list --status open`
- **Read a conversation**: user shares a ticket/conversation → `conversations get <id>` + `messages list <id>`
- **Reply to customer**: "reply to this email" → `messages reply <cnv-id> --body "..."`
- **Send new email**: "email this person from Front" → `messages send <channel-id> --to email --body "..."`
- **Internal notes**: "add a note" → `comments create <cnv-id> --body "..."`
- **Find a contact**: "who is this person?" → `contacts list` or `contacts get <id>`
- **Check team**: "who's on the team?" → `teammates list`
- **See channels**: "what email addresses do we have?" → `channels list`

## Common Workflows

### Triage inbox
```bash
# Get open conversations
frontapp-cli conversations list --status open --json

# Read a specific conversation
frontapp-cli messages list cnv_abc123 --json

# Reply
frontapp-cli messages reply cnv_abc123 --body "Thanks for reaching out..." --json

# Archive
frontapp-cli conversations update cnv_abc123 --status archived --json
```

### Send outbound email
```bash
# Find the right channel (email address to send from)
frontapp-cli channels list --json

# Send from that channel
frontapp-cli messages send cha_xyz --to customer@example.com --subject "Hello" --body "<p>Your message</p>" --json
```

### Monitor activity
```bash
# Recent conversations
frontapp-cli conversations list --limit 10 --json

# Activity timeline for a conversation
frontapp-cli events list cnv_abc123 --json
```

## Resources

### conversations
| Command | Description |
|---------|-------------|
| `conversations list [--status open\|archived] [--limit N]` | List conversations |
| `conversations get <id>` | Get conversation details |
| `conversations update <id> --status archived` | Archive conversation |
| `conversations update <id> --assignee user@email.com` | Assign to teammate |
| `conversations update <id> --assignee none` | Unassign |
| `conversations update <id> --tags billing,urgent` | Set tags |

### inboxes
| Command | Description |
|---------|-------------|
| `inboxes list` | List all inboxes |
| `inboxes get <id>` | Get inbox details |
| `inboxes conversations <id> [--status open]` | List conversations in inbox |

### messages
| Command | Description |
|---------|-------------|
| `messages list <cnv-id> [--limit N]` | List messages in conversation |
| `messages send <channel-id> --to email --body "text"` | Send new message |
| `messages send <channel-id> --to a@b.com --subject "Hi" --body "<p>HTML</p>"` | Send with subject + HTML |
| `messages reply <cnv-id> --body "text"` | Reply to conversation |
| `messages reply <cnv-id> --body "note" --type note` | Add internal note via reply |

### contacts
| Command | Description |
|---------|-------------|
| `contacts list [--limit N]` | List contacts |
| `contacts get <id>` | Get contact details |
| `contacts create --name "Name" --email email` | Create contact |
| `contacts create --name "Name" --email email --phone "+1234"` | Create with phone |

### tags
| Command | Description |
|---------|-------------|
| `tags list` | List all tags |

### teammates
| Command | Description |
|---------|-------------|
| `teammates list` | List team members |
| `teammates get <id>` | Get teammate details |

### channels
| Command | Description |
|---------|-------------|
| `channels list` | List all channels (email/SMS addresses) |
| `channels get <id>` | Get channel details |

### accounts
| Command | Description |
|---------|-------------|
| `accounts list` | List connected accounts |
| `accounts get <id>` | Get account details |

### events
| Command | Description |
|---------|-------------|
| `events list <cnv-id>` | Activity timeline for a conversation |

### comments
| Command | Description |
|---------|-------------|
| `comments list <cnv-id>` | List internal notes |
| `comments create <cnv-id> --body "text"` | Add internal note |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`, `--fields <cols>`, `--limit N`, `--page-token <token>`

## Output Format

With `--json`, responses return: `{ "_results": [...], "_pagination": { "next": "..." } }`

Front uses `_results` (not `data`) for list responses. Pagination via `_pagination.next` URL or `--page-token`.
