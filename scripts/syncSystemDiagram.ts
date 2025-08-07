import { execSync } from 'child_process';
import { hasDiagramChanged } from './hasDiagramChanged';

const DOT_PATH = 'docs/system-diagram.dot';
const PNG_PATH = 'docs/system-diagram.png';

try {
  execSync(`dot -Tpng ${DOT_PATH} -o ${PNG_PATH}`);
} catch (err) {
  console.error('Failed to render system diagram:', err);
  process.exit(1);
}

if (hasDiagramChanged()) {
  execSync(`git add ${PNG_PATH}`);
  execSync("git commit -m 'chore: update system diagram' --no-verify");
  console.log('System diagram updated and committed.');
} else {
  execSync(`git checkout -- ${PNG_PATH}`);
  console.log('System diagram unchanged.');
}
