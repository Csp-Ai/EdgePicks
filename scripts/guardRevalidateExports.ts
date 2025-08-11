import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const BAD = [] as string[];

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && /\/app\/.*\/page\.tsx$/.test(p.replace(/\\/g, "/"))) yield p;
  }
}

async function main() {
  for await (const file of walk(ROOT)) {
    const src = await fs.readFile(file, "utf8");
    // If the file exports 'revalidate', ensure it's a number or false literal.
    const hasExport = /export\s+const\s+revalidate\s*=/.test(src) || /export\s*\{\s*revalidate\s*\}/.test(src);
    if (hasExport) {
      // Quick checks for obvious non-literals:
      if (/\brevalidate\s*=\s*\{/.test(src) || /\brevalidate\s*=\s*["'`]/.test(src)) {
        BAD.push(file);
        continue;
      }
    }
  }

  if (BAD.length) {
    console.error("[guard] Invalid 'revalidate' export in:");
    for (const f of BAD) console.error(" -", f);
    console.error("Revalidate must be a non-negative number or false. Example: `export const revalidate = 0;`");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
