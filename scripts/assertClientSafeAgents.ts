import { promises as fs } from "fs";
import path from "path";

async function main() {
  const pagePath = path.join(process.cwd(), "app", "agent-interface", "page.tsx");
  const src = await fs.readFile(pagePath, "utf8");
  if (src.includes("agents:") && src.match(/run\s*:\s*\(/)) {
    console.error("[guard] Detected a likely function in agents props. Keep props data-only.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

