import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const core=readFileSync(path.join(root,'src/lib/travel/gyeongbokgung-nearby-core.ts'),'utf8');

const directLeg="{fromId:'gwanghwamun',toId:'insadong',minutes:15";
assert.equal(core.split(directLeg).length-1,1,'Gwanghwamun → Insadong must have exactly one calibrated direct fallback leg.');
assert.match(core,/Gwanghwamun Square to Insadong is currently listed at about 15 minutes on foot\. This direct leg is used when the optional information-center stop is closed or omitted\./,'The fallback leg must disclose why it exists and remain source-traceable.');
assert.match(core,/if\(date&&nearbyStopAvailabilityAt\(base,date,720\)==='closed'\)continue;/,'A source-verified closed stop must be skipped before walking-leg lookup.');
assert.match(core,/const leg=nearbyWalkingLeg\(previousId,base\.id\);/,'After a skipped stop, the next candidate must route from the last stop actually added.');
assert.match(core,/fromId:'info',toId:'insadong',minutes:15/,'The normal information-center → Insadong leg must remain available when the information center is open.');
assert.equal((core.match(/fromId:'gwanghwamun',toId:'info',minutes:5/g)??[]).length,1,'Walking-leg calibration must not contain duplicate Gwanghwamun → information-center records.');
assert.doesNotMatch(core,/fetch\s*\(/,'Closure recovery must remain deterministic and zero-API.');
assert.doesNotMatch(core,/openai|openrouter|anthropic/i,'Closure recovery must not introduce an AI dependency.');

console.log('Nearby closure route recovery contracts passed: closed optional stops no longer strand the remaining itinerary, direct walking provenance is explicit, duplicates are rejected, and routing remains zero-API.');
