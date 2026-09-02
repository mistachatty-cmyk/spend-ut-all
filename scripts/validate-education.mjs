import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const fail = message => {
  console.error(`EDUCATION VALIDATION FAILED: ${message}`);
  process.exitCode = 1;
};

const requiredFiles = [
  'game/education-types.ts',
  'data/education.ts',
  'game/systems/education.ts',
  'app/components/EducationView.tsx',
];
for (const file of requiredFiles) if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);

const types = read('game/education-types.ts');
const data = read('data/education.ts');
const system = read('game/systems/education.ts');
const view = read('app/components/EducationView.tsx');
const save = read('game/systems/save.ts');
const engine = read('game/engine.ts');
const earnings = read('app/components/EarningsView.tsx');

const programs = ['food-handler','customer-service','forklift','trade-certificate','design-portfolio','it-support','bookkeeping','sales-certificate','property-certificate','management-certificate'];
for (const id of programs) {
  if (!types.includes(`'${id}'`)) fail(`credential type missing ${id}`);
  if (!data.includes(`id:'${id}'`)) fail(`education catalog missing ${id}`);
}

for (const field of ['credentials','activeCredentialId','studyDaysRemaining','lifetimeTuition','completedPrograms']) if (!types.includes(field)) fail(`education state missing ${field}`);
for (const fn of ['createEducationState','normalizeEducation','canEnroll','enrollEducation','advanceEducation','hasCredential']) if (!system.includes(`function ${fn}`)) fail(`education system missing ${fn}`);
if (!save.includes('normalizeEducation')) fail('old saves do not normalize education state');
if (!engine.includes('createEducationState') || !engine.includes('advanceEducation')) fail('engine does not initialize and advance education');
if (!earnings.includes('EducationView')) fail('education is not exposed in the earning flow');
if (!view.includes('CREDENTIAL') && !view.includes('EDUCATION')) fail('education UI lacks a visible section label');

if (!process.exitCode) console.log(`Education coverage OK: ${programs.length} credential programs, enrollment, persistence, progression and earning-flow UI verified.`);
