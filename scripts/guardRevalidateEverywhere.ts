import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const bad: string[] = [];

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) {
      const unix = p.replace(/\\/g, "/");
      if (/\/app\/.*\/(page|layout)\.tsx$/.test(unix)) yield p;
    }
  }
}

async function main() {
  for await (const f of walk(path.join(ROOT, "app"))) {
    const src = await fs.readFile(f, "utf8");

    // Detect any non-literal revalidate or re-exports
    const hasReExport = /export\s*\{\s*revalidate\s*(?:as\s+\w+)?\s*\}\s*from\s*["'][^"']*["']/.test(src);
    const badLiteral =
      /export\s+const\s+revalidate\s*=\s*\{/.test(src) ||
      /export\s+const\s+revalidate\s*=\s*["'`]/.test(src) ||
      /export\s+const\s+revalidate\s*=\s*[A-Za-z_$][\w.$]*/.test(src); // identifier

    if (hasReExport || badLiteral) bad.push(f);
  }

  if (bad.length) {
    console.error("[guard] Invalid `revalidate` export detected in:");
    for (const f of bad) console.error(" -", f);
    console.error("Use: `export const revalidate = 0;` or `export const revalidate = false;`");
    process.exit(1);
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
