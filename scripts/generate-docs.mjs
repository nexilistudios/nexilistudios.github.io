import { readFile, writeFile, mkdir, rm, rename, readdir, cp } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  process.env.NEXILIS_SOURCE || resolve(root, "../nexilis"),
);
const version = (await readFile(resolve(source, "VERSION.txt"), "utf8")).trim();
const temporary = resolve(root, ".doxygen-tmp");
await mkdir(temporary, { recursive: true });
const quote = (value) => `"${value.replaceAll('"', '\\"')}"`;
const config = `
PROJECT_NAME = Nexilis
PROJECT_NUMBER = ${quote(version)}
PROJECT_BRIEF = "Native C++ and C# multiplayer API"
OUTPUT_DIRECTORY = ${quote(temporary)}
INPUT = ${quote(resolve(source, "nexilis/include"))} ${quote(resolve(source, "bindings/csharp/Nexilis"))} ${quote(resolve(source, "README.md"))} ${quote(resolve(source, "docs"))} ${quote(resolve(source, "bindings/README.md"))}
USE_MDFILE_AS_MAINPAGE = ${quote(resolve(source, "README.md"))}
FILE_PATTERNS = *.hh *.h *.hpp *.cs *.md
RECURSIVE = YES
EXTRACT_ALL = YES
EXTRACT_PRIVATE = NO
EXTRACT_STATIC = NO
FULL_PATH_NAMES = NO
GENERATE_HTML = YES
HTML_OUTPUT = html
GENERATE_LATEX = NO
HAVE_DOT = NO
SOURCE_BROWSER = YES
INLINE_SOURCES = NO
QUIET = YES
WARN_IF_UNDOCUMENTED = NO
WARN_LOGFILE = ${quote(resolve(temporary, "warnings.log"))}
HTML_COLORSTYLE = AUTO_LIGHT
DISABLE_INDEX = NO
GENERATE_TREEVIEW = YES
SEARCHENGINE = YES
`;
const configPath = resolve(temporary, "Doxyfile");
await writeFile(configPath, config);
const result = spawnSync("doxygen", [configPath], { stdio: "inherit" });
if (result.error) throw result.error;
if (result.status !== 0) throw new Error(`Doxygen failed (${result.status})`);
const mainPagePath = resolve(temporary, "html/index.html");
const mainPage = await readFile(mainPagePath, "utf8");
await writeFile(
  mainPagePath,
  mainPage.replace(
    /\[(?:LICENSE|LICENCE)\]\((?:LICENSE|https:\/\/github\.com\/NexilisLib\/nexilis\/blob\/main\/LICENSE)\)/g,
    '<a href="https://github.com/NexilisLib/nexilis/blob/main/LICENSE">LICENSE</a>',
  ),
);
await readFile(
  resolve(temporary, "html/classNexilis_1_1Util_1_1NexilisClient.html"),
);
// Keep the site's existing documentation styles when refreshing API content.
const currentDocs = resolve(root, "docs");
async function preserveCss(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) await preserveCss(path);
    else if (entry.isFile() && entry.name.endsWith(".css")) {
      const destination = resolve(temporary, "html", relative(currentDocs, path));
      await mkdir(dirname(destination), { recursive: true });
      await cp(path, destination);
    }
  }
}
await preserveCss(currentDocs);
const revision = spawnSync("git", ["-C", source, "rev-parse", "HEAD"], {
  encoding: "utf8",
});
const status = spawnSync("git", ["-C", source, "status", "--porcelain"], {
  encoding: "utf8",
});
await writeFile(
  resolve(temporary, "html/source-version.json"),
  JSON.stringify(
    {
      version,
      revision: revision.stdout?.trim(),
      includesLocalChanges: Boolean(status.stdout?.trim()),
      generatedAt: new Date().toISOString(),
    },
    null,
    2,
  ) + "\n",
);
await rm(resolve(root, "docs"), { recursive: true, force: true });
await rename(resolve(temporary, "html"), resolve(root, "docs"));
console.log(
  `Generated native and C# documentation from ${source} (${version}). Warnings: .doxygen-tmp/warnings.log`,
);
