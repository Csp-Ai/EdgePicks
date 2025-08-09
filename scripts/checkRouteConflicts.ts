import fs from 'fs';
import path from 'path';

const repo = process.cwd();
const pagesDir = path.join(repo, 'pages');
const appDir = path.join(repo, 'app');
const archiveDir = path.join(repo, 'archive', 'pages');

const DRY_RUN = process.env.CONFLICT_GUARD_DRY_RUN === '1';
const CI = process.env.CI === '1';

function exists(p: string) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function listFiles(root: string, exts = ['.tsx', '.jsx']) {
  const out: string[] = [];
  if (!exists(root)) return out;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (exts.some(e => entry.name.endsWith(e))) out.push(full);
    }
  };
  walk(root);
  return out;
}

// Normalize file path to a route key like "/leaderboard" or "/"
function toRouteFromPages(file: string) {
  // Skip API + framework files
  const rel = path.relative(pagesDir, file).replace(/\\/g, '/');
  if (rel.startsWith('api/')) return null;
  if (['_app.tsx','_document.tsx','_error.tsx','_app.jsx','_document.jsx','_error.jsx'].some(n => rel.endsWith(n))) return null;

  // pages/index.tsx -> "/"
  // pages/foo.tsx   -> "/foo"
  // pages/foo/bar.tsx -> "/foo/bar"
  const noExt = rel.replace(/\.(t|j)sx$/, '');
  return '/' + (noExt === 'index' ? '' : noExt);
}

function toRouteFromApp(file: string) {
  // app/(group)/foo/page.tsx -> "/foo"
  const rel = path.relative(appDir, file).replace(/\\/g, '/');
  if (!rel.endsWith('/page.tsx') && !rel.endsWith('/page.jsx')) return null;
  const noPage = rel.replace(/\/page\.(t|j)sx$/, '');
  // strip route groups `(group)`
  const noGroups = noPage.replace(/\/\([^\/]+\)/g, '');
  return '/' + (noGroups === '' ? '' : noGroups);
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function moveSafely(src: string, destDir: string) {
  ensureDir(destDir);
  const base = path.basename(src);
  const dest = path.join(destDir, base);
  // Avoid overwrite: add numeric suffix if needed
  let finalDest = dest;
  let i = 1;
  while (exists(finalDest)) {
    const ext = path.extname(base);
    const stem = path.basename(base, ext);
    finalDest = path.join(destDir, `${stem}.${i}${ext}`);
    i++;
  }
  if (DRY_RUN) {
    console.log(`[dry-run] Would move: ${src} -> ${finalDest}`);
    return;
  }
  fs.renameSync(src, finalDest);
  // GitHub Actions annotation (warning)
  if (CI) {
    console.warn(`::warning file=${src},title=Route conflict auto-archived::Moved to ${path.relative(repo, finalDest)}`);
  } else {
    console.log(`Moved ${src} -> ${finalDest}`);
  }
}

function main() {
  const pagesFiles = listFiles(pagesDir);
  const appFiles = listFiles(appDir);

  const pageRoutes = new Map<string, string[]>(); // route -> files
  const appRoutes = new Set<string>();

  for (const f of pagesFiles) {
    const r = toRouteFromPages(f);
    if (r) {
      const arr = pageRoutes.get(r) ?? [];
      arr.push(f);
      pageRoutes.set(r, arr);
    }
  }
  for (const f of appFiles) {
    const r = toRouteFromApp(f);
    if (r) appRoutes.add(r);
  }

  const conflicts = Array.from(pageRoutes.entries())
    .filter(([r]) => appRoutes.has(r));

  if (conflicts.length === 0) {
    console.log('[route-guard] No conflicts found.');
    return;
  }

  console.log(`[route-guard] Conflicts detected for routes: ${conflicts.map(([r]) => r).join(', ')}`);

  // Archive each conflicting pages/* file to archive/pages/<same path structure>
  for (const [, files] of conflicts) {
    for (const src of files) {
      const rel = path.relative(pagesDir, src);
      const destDir = path.join(archiveDir, path.dirname(rel));
      moveSafely(src, destDir);
    }
  }
}

main();
