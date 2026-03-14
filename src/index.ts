#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { conversationsResource } from "./resources/conversations.js";
import { inboxesResource } from "./resources/inboxes.js";
import { messagesResource } from "./resources/messages.js";
import { contactsResource } from "./resources/contacts.js";
import { tagsResource } from "./resources/tags.js";
import { teammatesResource } from "./resources/teammates.js";
import { channelsResource } from "./resources/channels.js";
import { accountsResource } from "./resources/accounts.js";
import { eventsResource } from "./resources/events.js";
import { commentsResource } from "./resources/comments.js";
import { draftsResource } from "./resources/drafts.js";

const program = new Command();

program
  .name("frontapp-cli")
  .description("CLI for the Front API - manage conversations, inboxes, messages, contacts, tags, teammates, channels, accounts, events, and comments")
  .version("0.2.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

program.addCommand(authCommand);
program.addCommand(conversationsResource);
program.addCommand(inboxesResource);
program.addCommand(messagesResource);
program.addCommand(contactsResource);
program.addCommand(tagsResource);
program.addCommand(teammatesResource);
program.addCommand(channelsResource);
program.addCommand(accountsResource);
program.addCommand(eventsResource);
program.addCommand(commentsResource);
program.addCommand(draftsResource);

program.parse();
