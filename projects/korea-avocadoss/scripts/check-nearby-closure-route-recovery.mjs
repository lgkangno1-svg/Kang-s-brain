import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const core=readFileSync(path.join(root,'src/lib/travel/gyeongbokgung-nearby-core.ts'),'utf8');
const directLeg="{fromId:'gwanghwamun',toId:'insadong',minutes:15";
assert.equal(core.split(directLeg).length-1,1);
assert.match(core,/This direct leg is used when the optional information-center stop is closed or omitted\./);
assert.match(core,/if\(date&&nearbyStopAvailabilityAt\(base,date,720\)==='closed'\)continue;/);
assert.match(core,/const leg=nearbyWalkingLeg\(previousId,base\.id\);/);
assert.match(core,/fromId:'info',toId:'insadong',minutes:15/);
assert.equal((core.match(/fromId:'gwanghwamun',toId:'info',minutes:5/g)??[]).length,1);
assert.doesNotMatch(core,/fetch\s*\(/);
assert.doesNotMatch(core,/openai|openrouter|anthropic/i);
console.log('Nearby closure route recovery contracts passed.');
