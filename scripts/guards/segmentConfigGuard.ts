import path from 'path';
import { Project, SyntaxKind, Node, Expression, VariableDeclaration } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), 'tsconfig.node.json'),
  skipAddingFilesFromTsConfig: true,
});

const files = project.addSourceFilesAtPaths('app/**/*.{ts,tsx}');
const componentFiles = project.addSourceFilesAtPaths('components/**/*.tsx');

function isLiteralNumberOrFalse(expr: Expression | undefined): boolean {
  if (!expr) return false;
  if (Node.isNumericLiteral(expr)) return true;
  if (Node.isPrefixUnaryExpression(expr)) {
    return Node.isNumericLiteral(expr.getOperand());
  }
  if (expr.getKind() === SyntaxKind.FalseKeyword) return true;
  if (Node.isAsExpression(expr)) return isLiteralNumberOrFalse(expr.getExpression());
  return false;
}

function getNumber(expr: Expression | undefined): number | undefined {
  if (!expr) return undefined;
  if (Node.isNumericLiteral(expr)) return Number(expr.getLiteralText());
  if (Node.isPrefixUnaryExpression(expr)) {
    const op = expr.getOperand();
    if (Node.isNumericLiteral(op)) return -Number(op.getLiteralText());
  }
  if (Node.isAsExpression(expr)) return getNumber(expr.getExpression());
  return undefined;
}

function getString(expr: Expression | undefined): string | undefined {
  if (!expr) return undefined;
  if (Node.isStringLiteral(expr) || Node.isNoSubstitutionTemplateLiteral(expr)) {
    return expr.getLiteralText();
  }
  if (Node.isAsExpression(expr)) return getString(expr.getExpression());
  return undefined;
}

type ExportName = 'revalidate' | 'dynamic' | 'fetchCache' | 'runtime';

const productExtras = [
  'agent-interface',
  'agents',
  'leaderboard',
  'logs',
  'predictions',
  'maps',
  'onboarding',
  'toast-demo',
];

function isMarketing(filePath: string): boolean {
  return filePath.startsWith('app/(marketing)/') || filePath.startsWith('app/about/');
}

function isProduct(filePath: string): boolean {
  if (filePath.startsWith('app/(product)/')) return true;
  return productExtras.some((dir) => filePath.startsWith(`app/${dir}/`));
}

function isRouteEntry(filePath: string): boolean {
  const base = path.basename(filePath);
  return base === 'page.tsx' || base === 'layout.tsx' || base === 'route.ts';
}

const violations: Record<string, string[]> = {};
const warnings: Record<string, string[]> = {};

function record(file: string, decl: VariableDeclaration | undefined, expected: string) {
  const found = decl ? decl.getText() : '(missing)';
  const diff = `- ${found}\n+ ${expected}`;
  (violations[file] ??= []).push(diff);
}

function fail(file: string, msg: string) {
  (violations[file] ??= []).push(msg);
}

for (const sourceFile of files) {
  const filePath = path.relative(process.cwd(), sourceFile.getFilePath());
  const exported: Partial<Record<ExportName, VariableDeclaration>> = {};

  for (const ed of sourceFile.getExportDeclarations()) {
    const specs = ed.getNamedExports();
    for (const spec of specs) {
      const name = spec.getName();
      const alias = spec.getAliasNode()?.getText();
      if (name === 'revalidate' || alias === 'revalidate') {
        fail(
          filePath,
          'revalidate must be declared as a literal in this file; re-exports are forbidden.'
        );
      }
    }
    if (ed.isNamespaceExport()) {
      const target = ed.getModuleSpecifierSourceFile();
      if (target && target.getExportSymbols().some((s) => s.getName() === 'revalidate')) {
        fail(
          filePath,
          'revalidate must be declared as a literal in this file; re-exports are forbidden.'
        );
      } else {
        (warnings[filePath] ??= []).push(
          `export * from '${ed.getModuleSpecifierValue()}' may hide revalidate; avoid wildcard exports in routes.`
        );
      }
    }
  }

  for (const stmt of sourceFile.getVariableStatements()) {
    if (!stmt.hasExportKeyword()) continue;
    for (const decl of stmt.getDeclarations()) {
      const name = decl.getName() as ExportName;
      if (['revalidate', 'dynamic', 'fetchCache', 'runtime'].includes(name)) {
        exported[name] = decl;
      }
    }
  }

  const routeFile = isRouteEntry(filePath);
  const marketing = routeFile && isMarketing(filePath);
  const product = routeFile && isProduct(filePath);

  const revalidateDecl = exported.revalidate;
  if (revalidateDecl) {
    const init = revalidateDecl.getInitializer();
    if (!isLiteralNumberOrFalse(init)) {
      const kind = Node.isAsExpression(init)
        ? init.getExpression().getKindName()
        : init?.getKindName();
      fail(
        filePath,
        `Found revalidate as ${kind} — use a numeric literal (e.g., export const revalidate = 60 as const;).`
      );
    }
  }

  const fetchDecl = exported.fetchCache;
  if (fetchDecl) {
    const fetch = getString(fetchDecl.getInitializer());
    if (fetch === 'default') {
      record(filePath, fetchDecl, '// remove fetchCache export');
    } else {
      (warnings[filePath] ??= []).push(
        `export const fetchCache = '${fetch ?? '<unknown>'}';`
      );
    }
  }

  if (marketing) {
    const val = getNumber(revalidateDecl?.getInitializer());
    if (val !== 60) {
      record(filePath, revalidateDecl, 'export const revalidate = 60 as const;');
    }
    const dynamicDecl = exported.dynamic;
    const dyn = getString(dynamicDecl?.getInitializer());
    if (dyn !== 'auto') {
      record(filePath, dynamicDecl, "export const dynamic = 'auto';");
    }
    const runtimeDecl = exported.runtime;
    const runtime = getString(runtimeDecl?.getInitializer());
    if (runtime === 'edge') {
      record(filePath, runtimeDecl, '// runtime removed for static ISR');
    }
  } else if (product) {
    const val = getNumber(revalidateDecl?.getInitializer());
    if (val !== 0) {
      record(filePath, revalidateDecl, 'export const revalidate = 0 as const;');
    }
    const dynamicDecl = exported.dynamic;
    const dyn = getString(dynamicDecl?.getInitializer());
    if (dyn !== 'force-dynamic') {
      record(filePath, dynamicDecl, "export const dynamic = 'force-dynamic';");
    }
  }
}

for (const sourceFile of componentFiles) {
  const filePath = path.relative(process.cwd(), sourceFile.getFilePath());

  for (const ed of sourceFile.getExportDeclarations()) {
    if (ed.isNamespaceExport()) {
      (warnings[filePath] ??= []).push(
        `export * from '${ed.getModuleSpecifierValue()}' may hide revalidate; avoid wildcard exports in components.`
      );
    }
  }

  for (const stmt of sourceFile.getVariableStatements()) {
    if (!stmt.hasExportKeyword()) continue;
    for (const decl of stmt.getDeclarations()) {
      const name = decl.getName();
      if (name === 'fetchCache') {
        const fetch = getString(decl.getInitializer());
        (warnings[filePath] ??= []).push(
          `export const fetchCache = '${fetch ?? '<unknown>'}';`
        );
      } else if (name === 'revalidate' && !isLiteralNumberOrFalse(decl.getInitializer())) {
        (warnings[filePath] ??= []).push(
          'revalidate should be a literal in components.'
        );
      }
    }
  }
}

if (Object.keys(violations).length) {
  console.error('Segment config violations:');
  for (const [file, diffs] of Object.entries(violations)) {
    console.error(`\n${file}`);
    for (const d of diffs) {
      console.error(d);
    }
  }
  process.exit(1);
}

if (Object.keys(warnings).length) {
  console.warn('Segment config warnings:');
  for (const [file, diffs] of Object.entries(warnings)) {
    console.warn(`\n${file}`);
    for (const d of diffs) {
      console.warn(d);
    }
  }
}
