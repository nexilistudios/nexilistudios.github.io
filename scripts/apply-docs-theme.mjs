import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const start = "/* Nexilis website theme start */";
const end = "/* Nexilis website theme end */";
const fonts = '@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap");';

export async function applyDocsTheme(docsDirectory) {
  const cssPath = resolve(docsDirectory, "doxygen.css");
  const theme = (await readFile(resolve(root, "styles/doxygen-theme.css"), "utf8")).trimEnd();
  let css = await readFile(cssPath, "utf8");

  // Reapplying after a generated docs update must not stack old theme versions.
  const startIndex = css.indexOf(start);
  if (startIndex !== -1) {
    const endIndex = css.indexOf(end, startIndex);
    if (endIndex === -1) throw new Error(`Missing theme end marker in ${cssPath}`);
    css = css.slice(0, startIndex) + css.slice(endIndex + end.length);
  }
  css = css.trimEnd() + "\n";
  if (!css.includes(fonts)) css = fonts + "\n" + css;
  await writeFile(cssPath, `${css}\n${start}\n${theme}\n${end}\n`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await applyDocsTheme(resolve(process.argv[2] || resolve(root, "docs")));
}
