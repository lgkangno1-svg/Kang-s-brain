import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const root = resolve(import.meta.dirname, '..');
const docs = resolve(root, 'docs');

const read = (name) => readFile(resolve(docs, name), 'utf8');
const write = (name, value) => writeFile(resolve(docs, name), value);

const replaceOrFail = (source, pattern, replacement, label) => {
  const next = source.replace(pattern, replacement);
  if (next === source) throw new Error(`Unable to update ${label}; expected source marker not found.`);
  return next;
};

let roadmap = await read('IMPLEMENTATION_ROADMAP.md');
roadmap = replaceOrFail(
  roadmap,
  '## Step 2 — Internationalized routing and language selector ← in progress',
  '## Step 2 — Internationalized routing and language selector ✅',
  'roadmap Step 2 status'
);
roadmap = replaceOrFail(
  roadmap,
  /#### Step 2C-7 — next slice: supply-chain reproducibility \+ Step 2 gate closure[\s\S]*?\n\n\*\*Step 2 gate:\*\*/,
  `#### Step 2C-7 — supply-chain reproducibility + Step 2 gate closure ✅\n- generated a real npm v3 lockfile in trusted GitHub Actions with lifecycle scripts disabled;\n- deterministic policy requires package.json/root-lock parity, HTTPS npm registry origins and sha512 integrity;\n- reviewed lock graph contains 106 package entries with no missing license metadata; runtime pins remain exact and dev ranges remain intentionally range-based because the committed lockfile freezes the resolved versions;\n- temporary branch-only write permission used only to materialize the generated lockfile was removed before merge; final CI is back to read-only contents permission with persisted checkout credentials disabled;\n- CI now uses frozen \`npm ci --ignore-scripts --no-audit --no-fund\`;\n- PR #9 workflow run \`33069835102\` passed lockfile policy, frozen install, all P0 i18n contracts, Next.js production build, generated document-language checks and deterministic legacy redirect/query-preservation checks;\n- no runtime dependency, application AI call, customer-data transfer, wallet/payment behavior or UI behavior was added.\n\n**Step 2 gate:**`,
  'roadmap Step 2C-7 block'
);
await write('IMPLEMENTATION_ROADMAP.md', roadmap);

let handoff = await read('PROJECT_HANDOFF.md');
handoff = replaceOrFail(handoff, /\*\*Current phase:\*\*.*$/m, '**Current phase:** Step 3 — Saju deterministic cultural core', 'handoff phase');
handoff = replaceOrFail(handoff, /\*\*Last completed implementation slice on main:\*\*.*$/m, '**Last completed implementation slice:** Step 2C-7 — supply-chain reproducibility / Step 2 closure', 'handoff completed slice');
handoff = replaceOrFail(handoff, /\*\*Open implementation PR:\*\*.*$/m, '**Implementation PR:** #9 — Step 2C-7 final frozen-install gate', 'handoff PR');
handoff = replaceOrFail(handoff, /\*\*Exact next implementation slice:\*\*.*$/m, '**Exact next implementation slice:** Step 3A — deterministic Saju calculation/input contracts before narrative AI or major UI work.', 'handoff next slice');
if (!handoff.includes('- Step 2C-7 ✅')) {
  handoff = replaceOrFail(
    handoff,
    '- Step 2C-6 ✅ shadowed legacy UI removed safely.',
    '- Step 2C-6 ✅ shadowed legacy UI removed safely.\n- Step 2C-7 ✅ real npm lockfile committed; read-only CI uses frozen `npm ci`; full Step 2 executable gate green.',
    'handoff completed-roadmap bullet'
  );
}
handoff = replaceOrFail(
  handoff,
  /## 7\. Current Step 2C-7 state[\s\S]*?\n\n## 8\./,
  `## 7. Step 2C-7 completion evidence\nStep 2C-7 was rebased from the latest main in PR #9 after the Gemini Live planning merge so newer policy work was preserved.\n\nThe previously blocked GitHub Actions path recovered. A trusted Node 22 Actions run generated a real npm lockfile with lifecycle scripts disabled. The lockfile policy passed before commit. The reviewed graph has 106 package entries; all resolved tarballs use HTTPS \`registry.npmjs.org\`, all resolved packages have sha512 integrity, root manifest specifiers match \`package.json\`, and no package entry is missing license metadata. Runtime dependencies remain exactly pinned; dev dependency ranges are retained because the committed lockfile freezes their concrete versions and future updates should be deliberate lockfile reviews.\n\nA temporary PR-branch-only write job was used solely to materialize the generated lockfile after normal connector upload limitations. It was conditioned on the same repository, exact trusted branch and repository owner actor, and was removed immediately after the lockfile commit. The final workflow is again \`contents: read\`, SHA-pinned official actions, no persisted checkout credentials and no repository secrets.\n\nFinal PR #9 workflow run \`33069835102\` succeeded with: lockfile policy → frozen \`npm ci --ignore-scripts --no-audit --no-fund\` → P0 localization contracts → Next.js production build/TypeScript → generated document languages → deterministic 308 legacy redirects and query preservation. This is build/CI evidence, not production deployment evidence.\n\n## 8.`,
  'handoff Step 2C-7 section'
);
handoff = replaceOrFail(
  handoff,
  /## 10\. Exact next action — Step 2C-7 only[\s\S]*?\n\n## 11\./,
  `## 10. Exact next action — Step 3A only\n1. Inspect fresh main/recent commits/open PRs before editing.\n2. Re-run the GitHub + Hugging Face discovery gate for deterministic Saju/calendar libraries and reference implementations.\n3. Implement deterministic birth-input types for exact time, rough time band and unknown time; never infer a missing hour.\n4. Define deterministic calendar/timezone conversion boundaries and request birth city/timezone only when genuinely needed.\n5. Keep raw birth date/time/city/name/account identifiers out of any LLM payload and logs.\n6. Add unit/fixture coverage for boundary dates, time bands and unknown-time reduced scope before narrative AI.\n7. Do not introduce paid narrative AI until deterministic structures and privacy boundaries are proven.\n8. Before substantial user-facing Step 3 UI work, re-check Stitch MCP and use it first when actually available.\n\n## 11.`,
  'handoff next-action section'
);
await write('PROJECT_HANDOFF.md', handoff);

let discovery = await read('OPEN_SOURCE_DISCOVERY.md');
if (!discovery.includes('## 2026-08-27 — Step 2C-7 npm supply-chain reproducibility')) {
  const marker = 'This is the required discovery record before material feature implementation/revision. Search first, then adopt only when commercial license, maintenance, privacy, quality, runtime cost, latency, browser/mobile fit, multilingual suitability, provenance, security and margin justify it.\n\n';
  const entry = `## 2026-08-27 — Step 2C-7 npm supply-chain reproducibility\n\n### GitHub / npm review\nRechecked npm lockfile/\`npm ci\` behavior and the maintained \`lirantal/lockfile-lint\` project (Apache-2.0; active in August 2026). \`lockfile-lint\` is relevant, but adding another dependency only to validate this small lockfile would expand the supply-chain surface. A dependency-free in-repo validator covers the required root-manifest parity, registry-origin and integrity checks.\n\nA real npm v3 lockfile was generated in trusted GitHub Actions with lifecycle scripts disabled and then reviewed. The resolved graph contains 106 package entries. Direct runtime versions remain exact: Next.js 16.3.3, next-intl 4.13.4, React/React DOM 19.2.0. Resolved dev versions include TypeScript 5.9.3, @types/node 22.20.1, @types/react 19.2.18 and @types/react-dom 19.2.5. All resolved tarballs use HTTPS npm registry URLs and sha512 integrity; no package entry lacks license metadata. Optional Sharp/libvips platform packages account for LGPL metadata and caniuse-lite carries CC-BY-4.0; no new package was added by this slice.\n\n**Decision:** adopt the generated/validated npm lockfile plus frozen \`npm ci --ignore-scripts\`; keep the small in-repo policy validator; reject an additional lockfile-lint runtime/dev dependency for now. Keep direct dev ranges as-is because the committed lockfile freezes concrete versions; update them only through deliberate reviewed lockfile changes.\n\n### Hugging Face review\nThe installed Hugging Face model-search action was attempted again for software supply-chain/security candidates and returned a tool-not-found error. Earlier reviewed vulnerability/code-analysis models cannot generate or prove npm's concrete dependency graph and would add inference/provenance risk.\n\n**Decision:** no model/dataset/Space adoption. Dependency resolution and integrity are deterministic package-manager/security-policy tasks, not ML tasks.\n\n### Executable evidence / security\nPR #9 final workflow run \`33069835102\` passed lockfile policy, frozen npm install, P0 localization contracts, production build, document-language verification and legacy redirect checks. The temporary trusted-branch write permission used solely to commit the generated lockfile was removed before merge; final CI returns to \`contents: read\`, full-SHA official actions, no persisted checkout credentials and no repository secrets.\n\nApplication AI calls: **0**. Runtime dependencies added: **0**. Customer data transfer: **0**. Incremental supplier inference cost: **0**.\n\n### Sources reviewed\n- https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json\n- https://docs.npmjs.com/cli/v11/commands/npm-ci\n- https://github.com/lirantal/lockfile-lint\n- Hugging Face model search attempted; connector returned tool-not-found in this run\n\n`;
  if (!discovery.includes(marker)) throw new Error('Discovery insertion marker not found.');
  discovery = discovery.replace(marker, marker + entry);
}
await write('OPEN_SOURCE_DISCOVERY.md', discovery);

console.log('Step 2 closure docs updated deterministically.');
