import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const contactsResource = new Command("contacts")
  .description("Manage contacts");

// -- LIST --
contactsResource
  .command("list")
  .description("List contacts")
  .option("--limit <n>", "Max results per page")
  .option("--page-token <token>", "Pagination token for next page")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli contacts list\n  frontapp-cli contacts list --limit 50 --json",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.limit) params.limit = opts.limit;
      if (opts.pageToken) params.page_token = opts.pageToken;

      const data = (await client.get("/contacts", params)) as {
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
contactsResource
  .command("get")
  .description("Get a specific contact by ID")
  .argument("<id>", "Contact ID (e.g. crd_abc123)")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  frontapp-cli contacts get crd_abc123\n  frontapp-cli contacts get crd_abc123 --json",
  )
  .action(async (id: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(`/contacts/${id}`);
      output(data, { format: opts.format });
    } catch (err) {
      handleError(err);
    }
  });

// -- CREATE --
contactsResource
  .command("create")
  .description("Create a new contact")
  .requiredOption("--name <name>", "Contact display name")
  .option("--email <email>", "Contact email address")
  .option("--phone <phone>", "Contact phone number")
  .addHelpText(
    "after",
    '\nExamples:\n  frontapp-cli contacts create --name "John Doe" --email john@example.com\n  frontapp-cli contacts create --name "Jane" --email jane@example.com --phone "+1234567890"',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const handles: { handle: string; source: string }[] = [];
      if (opts.email) handles.push({ handle: opts.email as string, source: "email" });
      if (opts.phone) handles.push({ handle: opts.phone as string, source: "phone" });

      const body: Record<string, unknown> = {
        name: opts.name as string,
      };
      if (handles.length > 0) body.handles = handles;

      const data = await client.post("/contacts", body);
      output(data ?? { created: true }, {  });
    } catch (err) {
      handleError(err);
    }
  });
