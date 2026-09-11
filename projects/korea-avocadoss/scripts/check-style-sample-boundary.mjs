import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const samplesPath = path.join(root, 'src/lib/looks/samples.ts');
const viewPath = path.join(root, 'src/features/looks/sample-view.tsx');

const samples = fs.readFileSync(samplesPath, 'utf8');
const view = fs.readFileSync(viewPath, 'utf8');

const fail = (message) => {
  console.error(`Style sample boundary check failed: ${message}`);
  process.exit(1);
};

for (const forbidden of [
  'Couple,',
  'couple desiring',
  'royal couple fitting',
  'Kenji & Mai',
  'Elena & David',
]) {
  if (samples.includes(forbidden)) {
    fail(`public v1 sample still models multiple adults: ${forbidden}`);
  }
}

if (!samples.includes('V1 is a one-adult SKU')) {
  fail('sample fixture does not document the one-adult v1 invariant');
}

for (const required of [
  'Sample Persona: Elena (Solo Traveler',
  'Sample Persona: Chloe (Solo Traveler',
  'Sample Persona: Kenji (Solo Traveler',
]) {
  if (!samples.includes(required)) {
    fail(`missing one-adult sample persona contract: ${required}`);
  }
}

for (const forbidden of [
  'provided to paid clients',
  'Start Your Custom Style Consultation ($12 USD)',
  'Guaranteed maximum impact',
  'instant matched royal couple fitting',
]) {
  if (view.includes(forbidden) || samples.includes(forbidden)) {
    fail(`public sample makes an unavailable or unsupported paid claim: ${forbidden}`);
  }
}

for (const required of [
  'fictitious one-adult public demonstration of the planned',
  '<strong>My Korea Look</strong> stylebook',
  'paid checkout and private delivery are not available',
  'Planned launch price: $12.00 USD',
  'Start the Free Style Preview',
  'not live routing or crowd information',
]) {
  if (!view.includes(required)) {
    fail(`missing truthful prelaunch boundary copy: ${required}`);
  }
}

console.log('Style sample single-adult/prelaunch boundary: OK');
