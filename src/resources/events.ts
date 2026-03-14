import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const eventsResource = new Command("events")
  .description("Manage conversation events");

// -- LIST --
eventsResource
  .command("list")
  .description("List events for a conversation")
  .argument("<conversation_id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli events list cnv_abc123\n  frontapp-cli events list cnv_abc123 --limit 50\n  frontapp-cli events list cnv_abc123 --json",
  )
  .action(async (conversationId: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get(`/conversations/${conversationId}/events`, params)) as {
        _results: unknown[];
      };
      output(data._results, {
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err);
    }
  });
