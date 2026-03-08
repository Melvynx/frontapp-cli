import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const messagesResource = new Command("messages")
  .description("Manage messages in conversations");

// -- LIST --
messagesResource
  .command("list")
  .description("List messages in a conversation")
  .argument("<conversation-id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli messages list cnv_abc123\n  frontapp-cli messages list cnv_abc123 --limit 5 --json",
  )
  .action(async (conversationId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get(
        `/conversations/${conversationId}/messages`,
        params,
      )) as { _results: unknown[] };
      output(data._results, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- SEND --
messagesResource
  .command("send")
  .description("Send a new message from a channel")
  .argument("<channel-id>", "Channel ID (e.g. cha_abc123)")
  .requiredOption("--to <recipients>", "Comma-separated recipient email addresses")
  .requiredOption("--body <body>", "Message body (HTML supported)")
  .option("--subject <subject>", "Email subject line")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  frontapp-cli messages send cha_abc123 --to user@example.com --body "Hello!"\n  frontapp-cli messages send cha_abc123 --to a@b.com,c@d.com --subject "Hi" --body "<p>Hello</p>"',
  )
  .action(async (channelId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const to = (opts.to as string).split(",").map((e) => e.trim());

      const body: Record<string, unknown> = {
        to,
        body: opts.body as string,
      };
      if (opts.subject) body.subject = opts.subject;

      const data = await client.post(`/channels/${channelId}/messages`, body);
      output(data ?? { sent: true }, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- REPLY --
messagesResource
  .command("reply")
  .description("Reply to a conversation")
  .argument("<conversation-id>", "Conversation ID (e.g. cnv_abc123)")
  .requiredOption("--body <body>", "Reply body (HTML supported)")
  .option("--type <type>", "Reply type: reply, note", "reply")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  frontapp-cli messages reply cnv_abc123 --body "Thanks for reaching out!"\n  frontapp-cli messages reply cnv_abc123 --body "Internal note" --type note',
  )
  .action(async (conversationId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const replyType = (opts.type as string) ?? "reply";

      const body: Record<string, unknown> = {
        body: opts.body as string,
        type: replyType,
      };

      const endpoint = replyType === "note"
        ? `/conversations/${conversationId}/comments`
        : `/conversations/${conversationId}/messages`;

      const payload = replyType === "note"
        ? { body: opts.body as string }
        : body;

      const data = await client.post(endpoint, payload);
      output(data ?? { replied: true, conversation_id: conversationId, type: replyType }, {
        json: !!opts.json,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
