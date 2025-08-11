import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile() && /\/app\/.*\/page\.tsx$/.test(p.replace(/\\/g, "/"))) yield p;
  }
}

function fixSource(src: string) {
  let out = src;

  // 1) Replace common mistakes: `export const revalidate = { ... }` -> `export const revalidate = 0;`
  out = out.replace(
    /export\s+const\s+revalidate\s*=\s*\{[^}]*\};?/g,
    'export const revalidate = 0;'
  );

  // 2) If someone exported a variable that equals an object, normalize to 0
  // e.g. `const revalidate = { ... }` or `let revalidate = {...}` then `export { revalidate }`
  // Heuristic: if an exported `revalidate` exists and there's an assignment with `{`
  if (/export\s*\{\s*revalidate\s*\}/.test(out) && /\brevalidate\s*=\s*\{/.test(out)) {
    out = out.replace(/\brevalidate\s*=\s*\{[^}]*\};?/g, "revalidate = 0;");
  }

  // 3) Ensure numeric/false only. If someone set `export const revalidate = "force-dynamic"` by mistake, set to 0.
  out = out.replace(
    /export\s+const\s+revalidate\s*=\s*["'`][^"'`]*["'`]\s*;?/g,
    "export const revalidate = 0;"
  );

  return out;
}

async function main() {
  for await (const file of walk(ROOT)) {
    const src = await fs.readFile(file, "utf8");
    const fixed = fixSource(src);
    if (fixed !== src) {
      await fs.writeFile(file, fixed, "utf8");
      console.log("[fix] normalized revalidate in", file);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
