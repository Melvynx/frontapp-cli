import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const commentsResource = new Command("comments")
  .description("Manage conversation comments");

// -- LIST --
commentsResource
  .command("list")
  .description("List comments for a conversation")
  .argument("<conversation_id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli comments list cnv_abc123\n  frontapp-cli comments list cnv_abc123 --limit 50\n  frontapp-cli comments list cnv_abc123 --json",
  )
  .action(async (conversationId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get(`/conversations/${conversationId}/comments`, params)) as {
        _results: unknown[];
      };
      output(data._results, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- CREATE --
commentsResource
  .command("create")
  .description("Create a comment on a conversation")
  .argument("<conversation_id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--body <text>", "Comment body text (required)")
  .option("--author <id>", "Author teammate ID (optional)")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    '\nExamples:\n  frontapp-cli comments create cnv_abc123 --body "Internal note"\n  frontapp-cli comments create cnv_abc123 --body "Follow up needed" --author tea_123',
  )
  .action(async (conversationId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      if (!opts.body) {
        throw new Error("--body is required");
      }

      const body: Record<string, unknown> = {
        body: opts.body,
      };

      if (opts.author) {
        body.author_id = opts.author;
      }

      const data = await client.post(`/conversations/${conversationId}/comments`, body);
      output(data ?? { created: true, conversation_id: conversationId }, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
