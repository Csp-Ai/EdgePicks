import { existsSync, writeFileSync, readFileSync } from "fs";
const dst = ".env.local";
if (!existsSync(dst)) {
  const src = ".env.local.example";
  const tpl = readFileSync(src, "utf8");
  writeFileSync(dst, tpl);
  console.log("Created .env.local from example for demo/dev.");
} else {
  console.log(".env.local already exists; no changes.");
}
