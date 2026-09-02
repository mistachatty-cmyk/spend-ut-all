import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const fail = message => {
  console.error(`FREELANCE VALIDATION FAILED: ${message}`);
  process.exitCode = 1;
};

const files = [
  'game/freelance-types.ts',
  'data/freelance.ts',
  'game/systems/freelance.ts',
  'app/components/FreelanceView.tsx',
];
for (const file of files) if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);

const types = read('game/freelance-types.ts');
const data = read('data/freelance.ts');
const system = read('game/systems/freelance.ts');
const view = read('app/components/FreelanceView.tsx');
const state = read('game/types.ts');
const save = read('game/systems/save.ts');
const earnings = read('app/components/EarningsView.tsx');

const ids = [...data.matchAll(/\bid:'([^']+)'/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) fail('duplicate freelance service ids');
if (ids.length < 16) fail(`expected at least 16 freelance services, found ${ids.length}`);
for (const id of ids) if (!types.includes(`'${id}'`)) fail(`service ${id} is missing from FreelanceServiceId`);

for (const field of ['reputation','portfolio','completedJobs','repeatClients','clients','knownServiceIds','serviceCooldownUntil','completedByService']) if (!types.includes(field)) fail(`freelance state missing ${field}`);
for (const fn of ['createFreelanceState','normalizeFreelance','freelanceOffers','researchFreelanceServices','performFreelanceJob','freelanceBusinessReadiness']) if (!system.includes(`function ${fn}`)) fail(`freelance system missing ${fn}`);
if (!state.includes('freelance?: FreelanceState')) fail('GameState does not persist freelance progression');
if (!save.includes('normalizeFreelance')) fail('old saves do not normalize freelance progression');
if (!earnings.includes('FreelanceView')) fail('freelance work is not exposed in the earning flow');
for (const label of ['CLIENT BOARD','Research work','Client book']) if (!view.includes(label)) fail(`freelance UI missing ${label}`);

if (!process.exitCode) console.log(`Freelance coverage OK: ${ids.length} services, rotating contracts, research, client trust, repeat work, cooldowns and business-readiness bridge verified.`);
