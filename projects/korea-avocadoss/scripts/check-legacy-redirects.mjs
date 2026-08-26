import { readFile } from 'node:fs/promises';

const redirects = JSON.parse(
  await readFile(new URL('../config/legacy-redirects.json', import.meta.url), 'utf8'),
);

const origin = process.env.REDIRECT_CHECK_ORIGIN ?? 'http://127.0.0.1:3100';

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(new URL('/en', origin), { redirect: 'manual' });
      if (response.status === 200) return;
      lastError = new Error(`Expected /en to return 200 while waiting, got ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Production server did not become ready: ${lastError?.message ?? 'unknown error'}`);
}

await waitForServer();

for (const rule of redirects) {
  if (rule.permanent !== true) {
    throw new Error(`Legacy rule ${rule.source} must remain permanent`);
  }

  const response = await fetch(new URL(rule.source, origin), { redirect: 'manual' });
  if (response.status !== 308) {
    throw new Error(`${rule.source}: expected 308, got ${response.status}`);
  }

  const location = response.headers.get('location');
  if (!location) {
    throw new Error(`${rule.source}: missing Location header`);
  }

  const target = new URL(location, origin);
  if (target.pathname !== rule.destination) {
    throw new Error(`${rule.source}: expected ${rule.destination}, got ${target.pathname}`);
  }

  const destinationResponse = await fetch(new URL(rule.destination, origin), { redirect: 'manual' });
  if (destinationResponse.status !== 200) {
    throw new Error(`${rule.destination}: expected canonical destination 200, got ${destinationResponse.status}`);
  }
}

const queryProbe = new URL('/color?utm_source=legacy-check&ref=old-link', origin);
const queryResponse = await fetch(queryProbe, { redirect: 'manual' });
const queryLocation = queryResponse.headers.get('location');
if (queryResponse.status !== 308 || !queryLocation) {
  throw new Error(`Query preservation probe: expected 308 with Location, got ${queryResponse.status}`);
}

const queryTarget = new URL(queryLocation, origin);
if (
  queryTarget.pathname !== '/en/color' ||
  queryTarget.searchParams.get('utm_source') !== 'legacy-check' ||
  queryTarget.searchParams.get('ref') !== 'old-link'
) {
  throw new Error(`Query preservation probe failed: ${queryTarget.pathname}${queryTarget.search}`);
}

console.log(`Legacy redirect verification passed for ${redirects.length} deterministic mappings plus query preservation.`);
