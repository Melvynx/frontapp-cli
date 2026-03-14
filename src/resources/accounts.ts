import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const accountsResource = new Command("accounts")
  .description("Manage accounts");

// -- LIST --
accountsResource
  .command("list")
  .description("List all accounts")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli accounts list\n  frontapp-cli accounts list --limit 50\n  frontapp-cli accounts list --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get("/accounts", params)) as {
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
accountsResource
  .command("get")
  .description("Get a specific account by ID")
  .argument("<id>", "Account ID (e.g. acc_abc123)")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli accounts get acc_abc123\n  frontapp-cli accounts get acc_abc123 --json",
  )
  .action(async (id: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(`/accounts/${id}`);
      output(data, { format: opts.format });
    } catch (err) {
      handleError(err);
    }
  });
