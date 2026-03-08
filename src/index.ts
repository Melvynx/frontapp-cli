#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { conversationsResource } from "./resources/conversations.js";
import { inboxesResource } from "./resources/inboxes.js";
import { messagesResource } from "./resources/messages.js";
import { contactsResource } from "./resources/contacts.js";
import { tagsResource } from "./resources/tags.js";

const program = new Command();

program
  .name("frontapp-cli")
  .description("CLI for the Front API - manage conversations, inboxes, messages, contacts, and tags")
  .version("0.1.0")
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

program.parse();
