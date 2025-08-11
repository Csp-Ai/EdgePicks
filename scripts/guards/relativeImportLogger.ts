import { Project } from 'ts-morph';
import path from 'path';

const project = new Project({ tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'), skipAddingFilesFromTsConfig: true });
const files = project.addSourceFilesAtPaths([
  'components/**/*.{ts,tsx}',
  'app/**/*.{ts,tsx}'
]);

const pattern = /^((\.\.\/){2,}lib\/)/;
const hits: { file: string; spec: string }[] = [];

for (const sf of files) {
  for (const imp of sf.getImportDeclarations()) {
    const spec = imp.getModuleSpecifier().getLiteralText();
    if (pattern.test(spec)) {
      hits.push({ file: sf.getFilePath(), spec });
    }
  }
}

if (hits.length) {
  console.log('Relative ../../lib imports found:');
  hits.forEach(h => console.log(` - ${h.file} -> ${h.spec}`));
}
