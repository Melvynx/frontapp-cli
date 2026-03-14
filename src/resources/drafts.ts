import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const draftsResource = new Command("drafts")
  .description("Manage drafts in conversations");

// -- LIST --
draftsResource
  .command("list")
  .description("List drafts for a conversation")
  .argument("<conversation-id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli drafts list cnv_abc123\n  frontapp-cli drafts list cnv_abc123 --json",
  )
  .action(async (conversationId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get(
        `/conversations/${conversationId}/drafts`,
        params,
      )) as { _results: unknown[] };
      output(data._results, {
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err);
    }
  });

// -- CREATE --
draftsResource
  .command("create")
  .description("Create a draft reply for a conversation")
  .argument("<conversation-id>", "Conversation ID (e.g. cnv_abc123)")
  .requiredOption("--body <body>", "Draft body (HTML supported)")
  .option("--subject <subject>", "Email subject line")
  .option("--to <recipients>", "Comma-separated recipient email addresses (overrides default)")
  .option("--cc <recipients>", "Comma-separated CC email addresses")
  .option("--bcc <recipients>", "Comma-separated BCC email addresses")
  .option("--channel-id <id>", "Channel ID to send from (e.g. cha_abc123)")
  .option("--mode <mode>", "Draft mode: shared (default) or private", "shared")
  .addHelpText(
    "after",
    '\nExamples:\n  frontapp-cli drafts create cnv_abc123 --body "Thanks for reaching out!"\n  frontapp-cli drafts create cnv_abc123 --body "<p>Hello</p>" --subject "Re: Your inquiry"',
  )
  .action(async (conversationId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {
        body: opts.body as string,
        mode: (opts.mode as string) ?? "shared",
      };

      if (opts.subject) body.subject = opts.subject;
      if (opts.channelId) body.channel_id = opts.channelId;
      if (opts.to) body.to = (opts.to as string).split(",").map((e) => e.trim());
      if (opts.cc) body.cc = (opts.cc as string).split(",").map((e) => e.trim());
      if (opts.bcc) body.bcc = (opts.bcc as string).split(",").map((e) => e.trim());

      // Front API: POST /conversations/{id}/drafts
      const data = await client.post(`/conversations/${conversationId}/drafts`, body);
      output(data ?? { draft_created: true, conversation_id: conversationId }, {});
    } catch (err) {
      handleError(err);
    }
  });

// -- DELETE --
draftsResource
  .command("delete")
  .description("Delete a draft")
  .argument("<draft-id>", "Draft message ID (e.g. msg_abc123)")
  .option("--version <version>", "Draft version to delete")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli drafts delete msg_abc123",
  )
  .action(async (draftId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.version) params.version = opts.version;

      await client.delete(`/drafts/${draftId}`);
      output({ deleted: true, draft_id: draftId }, {});
    } catch (err) {
      handleError(err);
    }
  });
