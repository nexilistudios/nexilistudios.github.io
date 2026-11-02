import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

const docsRoot = resolve(import.meta.dirname, "docs");

export default defineConfig({
  plugins: [
    svelte(),
    {
      name: "serve-doxygen-html",
      configureServer(server) {
        server.middlewares.use(async (request, response, next) => {
          let pathname: string;
          try {
            pathname = decodeURIComponent(
              new URL(request.url ?? "/", "http://localhost").pathname,
            );
          } catch {
            next();
            return;
          }

          if (!pathname.startsWith("/docs/") || !pathname.endsWith(".html")) {
            next();
            return;
          }

          const file = resolve(docsRoot, pathname.slice("/docs/".length));
          if (!file.startsWith(docsRoot + sep)) {
            next();
            return;
          }

          try {
            const html = await readFile(file);
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.end(html);
          } catch (error) {
            if ((error as NodeJS.ErrnoException).code === "ENOENT") next();
            else next(error);
          }
        });
      },
    },
  ],
  base: "./",
});
