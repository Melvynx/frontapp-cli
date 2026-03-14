import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const channelsResource = new Command("channels")
  .description("Manage channels");

// -- LIST --
channelsResource
  .command("list")
  .description("List all channels")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli channels list\n  frontapp-cli channels list --limit 50\n  frontapp-cli channels list --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get("/channels", params)) as {
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
channelsResource
  .command("get")
  .description("Get a specific channel by ID")
  .argument("<id>", "Channel ID (e.g. cha_abc123)")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli channels get cha_abc123\n  frontapp-cli channels get cha_abc123 --json",
  )
  .action(async (id: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(`/channels/${id}`);
      output(data, { format: opts.format });
    } catch (err) {
      handleError(err);
    }
  });
