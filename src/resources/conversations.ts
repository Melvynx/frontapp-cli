import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const conversationsResource = new Command("conversations")
  .description("Manage conversations");

// -- LIST --
conversationsResource
  .command("list")
  .description("List conversations")
  .option("--status <status>", "Filter by status: open, archived, deleted, spam")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli conversations list\n  frontapp-cli conversations list --status open --limit 25\n  frontapp-cli conversations list --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;
      if (opts.status) params.q = `[{"field":"statuses","value":["${opts.status}"],"type":"inclusion"}]`;

      const data = (await client.get("/conversations", params)) as {
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

// -- GET --
conversationsResource
  .command("get")
  .description("Get a specific conversation by ID")
  .argument("<id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli conversations get cnv_abc123\n  frontapp-cli conversations get cnv_abc123 --json",
  )
  .action(async (id: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(`/conversations/${id}`);
      output(data, { format: opts.format });
    } catch (err) {
      handleError(err);
    }
  });

// -- UPDATE --
conversationsResource
  .command("update")
  .description("Update a conversation")
  .argument("<id>", "Conversation ID (e.g. cnv_abc123)")
  .option("--status <status>", "New status: open, archived, deleted, spam")
  .option("--assignee <email>", "Assignee email (use 'none' to unassign)")
  .option("--tags <tags>", "Comma-separated tag names to set")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli conversations update cnv_abc123 --status archived\n  frontapp-cli conversations update cnv_abc123 --assignee user@example.com\n  frontapp-cli conversations update cnv_abc123 --tags billing,urgent",
  )
  .action(async (id: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.status) body.status = opts.status;
      if (opts.assignee) {
        body.assignee_id = opts.assignee === "none" ? "" : opts.assignee;
      }
      if (opts.tags) body.tag_ids = (opts.tags as string).split(",");

      const data = await client.patch(`/conversations/${id}`, body);
      output(data ?? { updated: true, id }, {  });
    } catch (err) {
      handleError(err);
    }
  });
