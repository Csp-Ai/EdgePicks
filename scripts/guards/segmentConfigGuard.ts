import path from 'path';
import { Project, SyntaxKind, Node, Expression } from 'ts-morph';

const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), 'tsconfig.node.json'),
  skipAddingFilesFromTsConfig: true,
});

const files = project.addSourceFilesAtPaths('app/**/*.{ts,tsx}');

interface Violation {
  file: string;
  export: string;
  hint: string;
}

function isNumberOrFalse(expr: Expression | undefined): boolean {
  if (!expr) return false;
  const kind = expr.getKind();
  if (kind === SyntaxKind.FalseKeyword) return true;
  if (kind === SyntaxKind.NumericLiteral || kind === SyntaxKind.PrefixUnaryExpression) return true;
  if (kind === SyntaxKind.AsExpression) {
    return isNumberOrFalse((expr as any).getExpression());
  }
  return false;
}

function getString(expr: Expression | undefined): string | undefined {
  if (!expr) return undefined;
  if (Node.isStringLiteral(expr) || Node.isNoSubstitutionTemplateLiteral(expr)) {
    return expr.getLiteralText();
  }
  if (expr.getKind() === SyntaxKind.AsExpression) {
    return getString((expr as any).getExpression());
  }
  return undefined;
}

const validDynamic = ['auto', 'error', 'force-dynamic', 'force-static'];
const validFetchCache = ['default', 'only-cache', 'only-no-store', 'force-no-store'];

const violations: Violation[] = [];

for (const sourceFile of files) {
  const filePath = path.relative(process.cwd(), sourceFile.getFilePath());
  for (const stmt of sourceFile.getVariableStatements()) {
    if (!stmt.hasExportKeyword()) continue;
    for (const decl of stmt.getDeclarations()) {
      const name = decl.getName();
      const init = decl.getInitializer();
      if (name === 'revalidate') {
        if (!isNumberOrFalse(init)) {
          violations.push({ file: filePath, export: 'revalidate', hint: 'must be a number or false' });
        }
      } else if (name === 'dynamic') {
        const val = getString(init);
        if (!val || !validDynamic.includes(val)) {
          violations.push({ file: filePath, export: 'dynamic', hint: `must be one of ${validDynamic.join(', ')}` });
        }
      } else if (name === 'fetchCache') {
        const val = getString(init);
        if (!val || !validFetchCache.includes(val)) {
          violations.push({ file: filePath, export: 'fetchCache', hint: `must be one of ${validFetchCache.join(', ')}` });
        }
      } else if (name === 'runtime') {
        const val = getString(init);
        if (val === 'edge' && filePath.includes('(marketing)')) {
          violations.push({ file: filePath, export: 'runtime', hint: 'edge runtime disabled on marketing pages' });
        }
      }
    }
  }
}

if (violations.length) {
  console.error('Segment config violations');
  console.table(violations);
  process.exit(1);
}
