import { Project, SyntaxKind } from 'ts-morph';
import path from 'path';

const project = new Project({ tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'), skipAddingFilesFromTsConfig: true });
const files = project.addSourceFilesAtPaths([
  'app/**/page.ts',
  'app/**/page.tsx',
  'app/**/layout.ts',
  'app/**/layout.tsx',
]);

function isLiteral(node: any): boolean {
  if (!node) return false;
  const kind = node.getKind();
  if (kind === SyntaxKind.NumericLiteral || kind === SyntaxKind.FalseKeyword) return true;
  if (kind === SyntaxKind.AsExpression) {
    const expr = node.getFirstChild();
    const k = expr?.getKind();
    return k === SyntaxKind.NumericLiteral || k === SyntaxKind.FalseKeyword;
  }
  return false;
}

const bad: string[] = [];
for (const sourceFile of files) {
  const filePath = sourceFile.getFilePath();
  sourceFile.getExportDeclarations().forEach(ed => {
    if (ed.getNamedExports().some(ne => ne.getName() === 'revalidate')) {
      bad.push(filePath);
      return;
    }
    if (ed.isNamespaceExport()) {
      const target = ed.getModuleSpecifierSourceFile();
      if (target && target.getExportSymbols().some(s => s.getName() === 'revalidate')) {
        bad.push(filePath);
      }
    }
  });
  const decl = sourceFile.getVariableDeclaration('revalidate');
  if (!decl || !isLiteral(decl.getInitializer())) {
    bad.push(filePath);
  }
}

if (bad.length) {
  console.error('Invalid revalidate export in:');
  bad.forEach(f => console.error(' - ' + f));
  process.exit(1);
}
