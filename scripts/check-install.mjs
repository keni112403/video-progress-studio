import {existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = ['SKILL.md','package.json','package-lock.json','tsconfig.json','src/index.tsx','src/progress.tsx','src/burger.tsx','src/playground.tsx','scripts/export.mjs','scripts/prepare_subtitles.py','examples/demo.json','examples/smoke.json','examples/sample.srt','references/configuration.md','references/installation.md','previews/gallery.png'];
let failed = false;
for (const path of required) {
  if (!existsSync(resolve(root,path))) { console.error(`Missing file: ${path}`); failed = true; }
}
for (const [name,args] of [['npm',['--version']],['python3',['--version']],['ffmpeg',['-version']],['ffprobe',['-version']]]) {
  const result = spawnSync(process.platform === 'win32' && name === 'npm' ? 'npm.cmd' : name,args,{encoding:'utf8'});
  if (result.error || result.status !== 0) { console.error(`Unavailable: ${name}`); failed = true; }
  else console.log(`${name}: available`);
}
if (!existsSync(resolve(root,'node_modules/@remotion/cli/remotion-cli.js'))) {
  console.error('Dependencies missing. Run npm ci in a complete working copy.'); failed = true;
}
console.log(`Node.js: ${process.version}`);
console.log('This check does not verify browser rendering or persistent skill installation. Follow references/installation.md for the smoke test.');
process.exitCode = failed ? 1 : 0;
