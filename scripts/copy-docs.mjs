import { cp, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { applyDocsTheme } from "./apply-docs-theme.mjs";
await access(new URL("../docs/index.html", import.meta.url));
await cp(
  new URL("../docs", import.meta.url),
  new URL("../dist/docs", import.meta.url),
  { recursive: true },
);
await applyDocsTheme(fileURLToPath(new URL("../dist/docs", import.meta.url)));
