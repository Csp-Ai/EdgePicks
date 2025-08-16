import { globby } from "globby";
import fs from "node:fs/promises";

async function main() {
  const files = await globby([
    "**/*.{ts,tsx,js,jsx}",
    "!node_modules/**",
    "!.next/**",
    "!dist/**",
    "!scripts/guards/imageResponseImportGuard.ts",
  ]);

  const offenders: string[] = [];
  await Promise.all(
    files.map(async (f) => {
      const src = await fs.readFile(f, "utf8");
      if (src.includes("ImageResponse") && src.includes(`from "next/server"`)) {
        offenders.push(f);
      }
    })
  );

  if (offenders.length) {
    console.error(
      "\n[image-response-guard] Found forbidden imports of ImageResponse from 'next/server':"
    );
    offenders.forEach((f) => console.error(" -", f));
    console.error(
      "Fix: import { ImageResponse } from 'next/og' instead.\n"
    );
    process.exit(1);
  } else {
    console.log("[image-response-guard] OK");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
