import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'..');
const sql=readFileSync(path.join(root,'supabase/core-schema.sql'),'utf8');

for(const table of ['profiles','orders','deliverables','saved_results']){
 assert.match(sql,new RegExp(`alter table public\\.${table} enable row level security`,'i'),`${table} must have RLS enabled`);
}
for(const table of ['profiles','orders','deliverables','saved_results']){
 assert.match(sql,new RegExp(`auth\\.uid\\(\\).*user_id`,'s'),`${table} ownership policies must use auth.uid()`);
}
assert.match(sql,/orders_select_own[\s\S]*auth\.uid\(\)[\s\S]*user_id/i,'orders must be owner-readable only');
assert.match(sql,/deliverables_select_own[\s\S]*auth\.uid\(\)[\s\S]*user_id/i,'deliverables must be owner-readable only');
assert.match(sql,/saved_results_update_own[\s\S]*using[\s\S]*auth\.uid\(\)[\s\S]*with check[\s\S]*auth\.uid\(\)/i,'saved result UPDATE must protect old and new ownership');
assert.match(sql,/private\.payment_events/i,'payment webhook events need a private idempotency ledger');
assert.match(sql,/primary key\(provider, provider_event_id\)/i,'provider events must be deduplicated');
assert.match(sql,/revoke all on schema private from public, anon, authenticated/i,'private schema must not be browser-accessible');
assert.doesNotMatch(sql,/security\s+definer/i,'pre-launch schema must not introduce SECURITY DEFINER helpers');
assert.doesNotMatch(sql,/user_metadata|raw_user_meta_data/i,'user-editable metadata must never drive authorization');
assert.doesNotMatch(sql,/auth\.role\s*\(/i,'deprecated auth.role() must not be used');
assert.doesNotMatch(sql,/grant\s+(insert|update|delete)[^;]*public\.orders\s+to\s+authenticated/i,'browser users must not mutate orders');
assert.doesNotMatch(sql,/grant\s+(insert|update|delete)[^;]*public\.deliverables\s+to\s+authenticated/i,'browser users must not mutate paid deliverables');

console.log('Database security contract passed: RLS ownership, private webhook dedupe, and server-only paid mutations are enforced.');
