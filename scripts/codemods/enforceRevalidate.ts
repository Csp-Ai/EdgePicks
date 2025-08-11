import { Project, SyntaxKind } from 'ts-morph';
import { diffLines } from 'diff';
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

for (const sourceFile of files) {
  const original = sourceFile.getFullText();
  let changed = false;

  // rename default import named `dynamic` from next/dynamic to avoid conflicts
  sourceFile.getImportDeclarations().forEach(id => {
    const def = id.getDefaultImport();
    if (def && def.getText() === 'dynamic' && id.getModuleSpecifierValue() === 'next/dynamic') {
      def.rename('nextDynamic');
      changed = true;
    }
  });

  sourceFile.getExportDeclarations().forEach(ed => {
    let remove = false;
    if (ed.getNamedExports().some(ne => ne.getName() === 'revalidate')) remove = true;
    else if (ed.isNamespaceExport()) {
      const target = ed.getModuleSpecifierSourceFile();
      if (target && target.getExportSymbols().some(s => s.getName() === 'revalidate')) remove = true;
    }
    if (remove) { ed.remove(); changed = true; }
  });

  let value = '0 as const';
  const existing = sourceFile.getVariableDeclaration('revalidate');
  if (existing) {
    const init = existing.getInitializer();
    if (init && isLiteral(init)) value = init.getText();
    existing.getVariableStatement()?.remove();
  }

  ['dynamic', 'fetchCache'].forEach(name => {
    const decl = sourceFile.getVariableDeclaration(name);
    if (decl) { decl.getVariableStatement()?.remove(); changed = true; }
  });

  const imports = sourceFile.getImportDeclarations();
  const insertIndex = imports.length ? sourceFile.getStatements().indexOf(imports[imports.length-1]) + 1 : 0;
  sourceFile.insertStatements(insertIndex, `export const revalidate = ${value};\nexport const dynamic = "force-dynamic";\nexport const fetchCache = "force-no-store";`);

  const newText = sourceFile.getFullText();
  if (original !== newText) {
    const diff = diffLines(original, newText);
    console.log(`Diff for ${sourceFile.getFilePath()}`);
    diff.forEach(part => {
      const symbol = part.added ? '+' : part.removed ? '-' : ' ';
      part.value.split('\n').forEach(line => line && console.log(symbol + line));
    });
    sourceFile.saveSync();
  }
}
