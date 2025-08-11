import { promises as fs } from "fs";
import path from "path";

const ROOT = process.cwd();
const DYNAMIC_SEGMENTS = ["impact", "maps", "onboarding"];

async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.isFile()) {
      const unix = p.replace(/\\/g, "/");
      if (/\/app\/.*\.(tsx|ts)$/.test(unix)) yield p;
    }
  }
}

async function main() {
  for await (const file of walk(path.join(ROOT, "app"))) {
    const unix = file.replace(/\\/g, "/");
    const hit = DYNAMIC_SEGMENTS.some(seg => unix.includes(`/app/${seg}/`) || unix.includes(`/app/(${seg})/`));
    if (!hit) continue;

    const src = await fs.readFile(file, "utf8");
    let out = src;

    // Remove generateStaticParams definitions entirely
    out = out.replace(/export\s+async\s+function\s+generateStaticParams\s*\([^)]*\)\s*\{[\s\S]*?\}\s*/g, "");

    // Ensure the literals exist
    if (!/export\s+const\s+dynamic\s*=/.test(out)) {
      out = `export const dynamic = "force-dynamic";\n${out}`;
    }
    if (!/export\s+const\s+fetchCache\s*=/.test(out)) {
      out = `export const fetchCache = "force-no-store";\n${out}`;
    }
    // normalize revalidate
    if (/export\s+const\s+revalidate\s*=/.test(out)) {
      out = out.replace(/export\s+const\s+revalidate\s*=\s*[^;]+;/g, "export const revalidate = 0;");
    } else {
      out = `export const revalidate = 0;\n${out}`;
    }

    if (out !== src) {
      await fs.writeFile(file, out, "utf8");
      console.log("[fix] dynamic route normalized:", unix);
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
