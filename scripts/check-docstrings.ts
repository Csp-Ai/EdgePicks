import fs from 'fs';
import path from 'path';
import ts from 'typescript';

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const res = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(res);
    if (entry.isFile() && (res.endsWith('.ts') || res.endsWith('.tsx'))) return [res];
    return [];
  });
}

const componentsDir = path.join(process.cwd(), 'components');
const files = walk(componentsDir);

const missing: { file: string; name: string }[] = [];

files.forEach((file) => {
  const text = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);

  sourceFile.forEachChild((node) => {
    if (isExportedComponent(node)) {
      if (!hasJSDoc(node, text)) {
        const name = getName(node);
        missing.push({ file, name });
      }
    }
  });
});

if (missing.length > 0) {
  console.error('Missing TSDoc comments for public components:');
  missing.forEach(({ file, name }) => {
    console.error(`- ${path.relative(process.cwd(), file)}: ${name}`);
  });
  process.exit(1);
} else {
  console.log('All public components have TSDoc.');
}

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false;
  return ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function isExportedComponent(node: ts.Node): boolean {
  if (!hasExportModifier(node)) return false;
  if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
    const name = node.name?.text;
    return !!name && /^[A-Z]/.test(name);
  }
  if (ts.isVariableStatement(node)) {
    return node.declarationList.declarations.some((d) => {
      return ts.isIdentifier(d.name) && /^[A-Z]/.test(d.name.text);
    });
  }
  return false;
}

function hasJSDoc(node: ts.Node, text: string): boolean {
  const ranges = (ts as any).getJSDocCommentRanges(node, text);
  return !!ranges && ranges.length > 0;
}

function getName(node: ts.Node): string {
  if (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) {
    return node.name?.text ?? '<default>';
  }
  if (ts.isVariableStatement(node)) {
    const d = node.declarationList.declarations.find(
      (dec) => ts.isIdentifier(dec.name) && /^[A-Z]/.test(dec.name.text)
    );
    if (d && ts.isIdentifier(d.name)) return d.name.text;
  }
  return '<unknown>';
}
