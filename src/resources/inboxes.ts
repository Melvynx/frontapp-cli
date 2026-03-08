import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const inboxesResource = new Command("inboxes")
  .description("Manage inboxes");

// -- LIST --
inboxesResource
  .command("list")
  .description("List all inboxes")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli inboxes list\n  frontapp-cli inboxes list --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const data = (await client.get("/inboxes")) as { _results: unknown[] };
      output(data._results, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- GET --
inboxesResource
  .command("get")
  .description("Get a specific inbox by ID")
  .argument("<id>", "Inbox ID (e.g. inb_abc123)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli inboxes get inb_abc123\n  frontapp-cli inboxes get inb_abc123 --json",
  )
  .action(async (id: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(`/inboxes/${id}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- CONVERSATIONS --
inboxesResource
  .command("conversations")
  .description("List conversations in an inbox")
  .argument("<id>", "Inbox ID (e.g. inb_abc123)")
  .option("--status <status>", "Filter by status: open, archived, deleted, spam")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli inboxes conversations inb_abc123\n  frontapp-cli inboxes conversations inb_abc123 --status open --limit 10\n  frontapp-cli inboxes conversations inb_abc123 --json",
  )
  .action(async (id: string, opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get(`/inboxes/${id}/conversations`, params)) as {
        _results: unknown[];
      };

      let results = data._results as Record<string, unknown>[];
      if (opts.status) {
        results = results.filter((c) => c.status === opts.status);
      }

      output(results, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
