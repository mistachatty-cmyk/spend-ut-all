import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const intake = resolve(process.env.AI_STUDIO_INTAKE_DIR || '../intake');
const markerPath = resolve(root, '.ai-studio-source-sha');
const current = execFileSync('git', ['-C', intake, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
const previous = existsSync(markerPath) ? readFileSync(markerPath, 'utf8').trim() : '';

const allowedRoots = ['app/', 'components/', 'data/', 'game/', 'integrations/', 'lib/', 'public/', 'scripts/', 'types/'];
const allowedRootFiles = new Set([
  'package.json', 'tsconfig.json', 'next.config.js', 'next.config.mjs', 'next.config.ts',
  'postcss.config.js', 'postcss.config.mjs', 'tailwind.config.js', 'tailwind.config.ts',
  'eslint.config.js', 'eslint.config.mjs'
]);
const blocked = new Set([
  'AI_BUILD_INTAKE.md', 'handoff-manifest.json', 'scripts/verify-handoff.mjs',
  '.ai-studio-source-sha'
]);
const isAllowed = path => !blocked.has(path)
  && !path.startsWith('.github/')
  && (allowedRoots.some(root => path.startsWith(root)) || allowedRootFiles.has(path));

let changedPaths = [];
if (previous && previous !== current) {
  try {
    changedPaths = execFileSync('git', ['-C', intake, 'diff', '--name-only', previous, current], { encoding: 'utf8' })
      .split('\n').map(value => value.trim()).filter(Boolean);
  } catch {
    changedPaths = execFileSync('git', ['-C', intake, 'ls-tree', '-r', '--name-only', current], { encoding: 'utf8' })
      .split('\n').map(value => value.trim()).filter(Boolean);
  }
} else if (!previous) {
  changedPaths = execFileSync('git', ['-C', intake, 'ls-tree', '-r', '--name-only', current], { encoding: 'utf8' })
    .split('\n').map(value => value.trim()).filter(Boolean);
}

const imported = [];
for (const path of changedPaths.filter(isAllowed)) {
  const source = resolve(intake, path);
  const destination = resolve(root, path);
  if (existsSync(source)) {
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { recursive: true });
  } else if (existsSync(destination)) {
    rmSync(destination, { recursive: true, force: true });
  }
  imported.push(path);
}

writeFileSync(markerPath, current + '\n');
const changed = previous !== current;
const summary = [
  '# Google AI Studio intake',
  '',
  `Source: mistachatty-cmyk/Spend-it-all-secondary-@${current}`,
  `Previous: ${previous || 'initial import'}`,
  `Imported paths: ${imported.length}`,
  '',
  ...imported.map(path => `- ${path}`)
].join('\n');
writeFileSync(resolve(root, '.git/ai-studio-sync-summary.md'), summary + '\n');

if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `changed=${changed}\nsource_sha=${current}\nimported=${imported.length}\n`, { flag: 'a' });
}
console.log(summary);
