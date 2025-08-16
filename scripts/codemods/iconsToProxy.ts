import fs from 'node:fs'; import path from 'node:path';
function run(dir:string){ for(const f of fs.readdirSync(dir)){ if(f==='node_modules'||f.startsWith('.next')) continue;
 const p = path.join(dir,f); const s=fs.statSync(p);
 if(s.isDirectory()) run(p); else if(/\.(tsx?|jsx?)$/.test(f)){
  let t = fs.readFileSync(p,'utf8'); if(t.includes("from 'lucide-react'")){
    t = t.replace(/from\s+['\"]lucide-react['\"]/g, "from '@/icons'");
    fs.writeFileSync(p,t);
 }}}}
run(process.cwd());
console.log('✅ lucide imports now go through @/icons');
