import { cp, access } from "node:fs/promises";
await access(new URL("../docs/index.html", import.meta.url));
await cp(
  new URL("../docs", import.meta.url),
  new URL("../dist/docs", import.meta.url),
  { recursive: true },
);
