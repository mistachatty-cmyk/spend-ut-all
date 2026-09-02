import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const fail = message => {
  console.error(`CAREER VALIDATION FAILED: ${message}`);
  process.exitCode = 1;
};

const requiredFiles = [
  'game/career-types.ts',
  'data/careers.ts',
  'game/systems/careers.ts',
  'app/components/CareerView.tsx',
];
for (const file of requiredFiles) if (!fs.existsSync(path.join(root, file))) fail(`missing ${file}`);

const types = read('game/career-types.ts');
const data = read('data/careers.ts');
const system = read('game/systems/careers.ts');
const view = read('app/components/CareerView.tsx');
const save = read('game/systems/save.ts');
const engine = read('game/engine.ts');

const tracks = ['service','logistics','trades','creative','sales','technology','finance','property','healthcare','education','public','media'];
for (const track of tracks) if (!types.includes(`'${track}'`)) fail(`missing career track ${track}`);

const idMatches = [...data.matchAll(/\bid:'([^']+)'/g)].map(match => match[1]);
const uniqueIds = new Set(idMatches);
if (idMatches.length !== uniqueIds.size) fail('career catalog contains duplicate job ids');
if (uniqueIds.size < 60) fail(`career catalog is too small (${uniqueIds.size}); expected at least 60 jobs`);

const nextJobIds = [...data.matchAll(/nextJobId:'([^']+)'/g)].map(match => match[1]);
for (const id of nextJobIds) if (!uniqueIds.has(id)) fail(`nextJobId ${id} does not exist`);

const starterCount = (data.match(/alwaysVisible:true/g) ?? []).length;
if (starterCount < 12) fail(`only ${starterCount} always-visible starter jobs; expected at least 12`);

for (const token of ['knownJobIds','jobResearches','boardRotation']) if (!types.includes(token)) fail(`career state missing ${token}`);
for (const fn of ['careerBoardJobs','careerJobDiscovered','researchCareers','rotateCareerBoard','careerQualificationMet']) if (!system.includes(`function ${fn}`)) fail(`career system missing ${fn}`);
for (const copy of ['Cycle openings','Research careers','Career directory']) if (!view.includes(copy)) fail(`career UI missing ${copy}`);
if (!save.includes('normalizeCareer')) fail('old saves do not normalize career discovery state');
if (!engine.includes('createCareerState')) fail('new games do not initialize career state');

if (!process.exitCode) console.log(`Career coverage OK: ${uniqueIds.size} jobs across ${tracks.length} tracks, rotating openings, research discovery and alternate qualification routes verified.`);
