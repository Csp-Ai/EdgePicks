import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();

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

function normalize(src: string) {
  let out = src;

  // Remove any re-exports of `revalidate`
  out = out.replace(/export\s*\{\s*revalidate\s*(?:as\s+\w+)?\s*\}\s*from\s*["'][^"']*["'];?\s*/g, "");

  // Replace object/string/identifier assignments with literal 0
  out = out.replace(/export\s+const\s+revalidate\s*=\s*\{[^}]*\};?/g, "export const revalidate = 0;");
  out = out.replace(/export\s+const\s+revalidate\s*=\s*["'`][^"'`]*["'`]\s*;?/g, "export const revalidate = 0;");
  out = out.replace(/export\s+const\s+revalidate\s*=\s*[A-Za-z_$][\w.$]*\s*;?/g, "export const revalidate = 0;");

  // If someone exported a variable later: normalize those too
  out = out.replace(/\brevalidate\s*=\s*\{[^}]*\};?/g, "revalidate = 0;");
  out = out.replace(/\brevalidate\s*=\s*["'`][^"'`]*["'`]\s*;?/g, "revalidate = 0;");
  out = out.replace(/\brevalidate\s*=\s*[A-Za-z_$][\w.$]*\s*;?/g, "revalidate = 0;");

  // Ensure dynamic + fetchCache defaults exist once.
  const hasRevalidate = /export\s+const\s+revalidate\s*=\s*(?:\d+|false)\s*;/.test(out);
  if (hasRevalidate) {
    if (!/export\s+const\s+dynamic\s*=/.test(out)) {
      out = `export const dynamic = "force-dynamic";\n` + out;
    }
    if (!/export\s+const\s+fetchCache\s*=/.test(out)) {
      out = `export const fetchCache = "force-no-store";\n` + out;
    }
  }

  return out;
}

async function main() {
  for await (const file of walk(path.join(ROOT, "app"))) {
    const src = await fs.readFile(file, "utf8");
    const fixed = normalize(src);
    if (fixed !== src) {
      await fs.writeFile(file, fixed, "utf8");
      console.log("[fix] normalized revalidate/dynamic in", file);
    }
  }
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
