import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(here, '..');

function loadTsModule(relativePath) {
  const fullPath = path.join(projectRoot, relativePath);
  const source = readFileSync(fullPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true},
    fileName: fullPath,
    reportDiagnostics: true,
  });
  const errors = (transpiled.diagnostics ?? []).filter((item) => item.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `Transpile error in ${relativePath}: ${errors.map((e) => e.messageText).join('; ')}`);
  const runtimeModule = {exports: {}};
  const execute = new Function('exports', 'module', 'require', '__filename', '__dirname', transpiled.outputText);
  execute(runtimeModule.exports, runtimeModule, require, fullPath, path.dirname(fullPath));
  return runtimeModule.exports;
}

const hanbokLib = loadTsModule('src/features/hanbok/hanbok-visual-library.ts');
const bridge = loadTsModule('src/features/hanbok/personal-color-bridge.ts');
const {HANBOK_STYLE_CATEGORIES, isValidHanbokStyle} = hanbokLib;
const {hanbokColorForUndertone, isPersonalColorUndertone} = bridge;

console.log('--- Testing Hanbok Visual Library & Contracts ---');

// 1. Exactly 3 style categories
assert.equal(HANBOK_STYLE_CATEGORIES.length, 3, 'Must have exactly 3 style categories');
const categoryIds = HANBOK_STYLE_CATEGORIES.map((c) => c.id);
assert.deepEqual(categoryIds, ['princess-prince', 'queen-king', 'royal'], 'Categories must be exact required IDs');

// 2. Each category has valid feminine and masculine references
for (const cat of HANBOK_STYLE_CATEGORIES) {
  assert.ok(cat.name, `${cat.id} has name`);
  assert.ok(cat.badge, `${cat.id} has badge`);

  assert.ok(cat.feminineRef.title, `${cat.id} feminine title`);
  assert.ok(cat.feminineRef.imageUrl.startsWith('https://'), `${cat.id} feminine imageUrl`);
  assert.ok(cat.feminineRef.sourceUrl.startsWith('https://'), `${cat.id} feminine sourceUrl`);
  assert.ok(cat.feminineRef.sourceLabel, `${cat.id} feminine sourceLabel`);
  assert.ok(cat.feminineRef.license, `${cat.id} feminine license`);
  assert.ok(cat.feminineRef.credit, `${cat.id} feminine credit`);

  assert.ok(cat.masculineRef.title, `${cat.id} masculine title`);
  assert.ok(cat.masculineRef.imageUrl.startsWith('https://'), `${cat.id} masculine imageUrl`);
  assert.ok(cat.masculineRef.sourceUrl.startsWith('https://'), `${cat.id} masculine sourceUrl`);
  assert.ok(cat.masculineRef.sourceLabel, `${cat.id} masculine sourceLabel`);
  assert.ok(cat.masculineRef.license, `${cat.id} masculine license`);
  assert.ok(cat.masculineRef.credit, `${cat.id} masculine credit`);

  assert.ok(['jadeIvory', 'roseNavy', 'moonBlue'].includes(cat.matcherPreset.color));
  assert.ok(['romantic', 'elegant', 'royal', 'minimal', 'kdrama'].includes(cat.matcherPreset.mood));
  assert.ok(['photoFirst', 'balanced', 'walking'].includes(cat.matcherPreset.comfort));
}

// 3. Style validation helper works
assert.equal(isValidHanbokStyle('princess-prince'), true);
assert.equal(isValidHanbokStyle('queen-king'), true);
assert.equal(isValidHanbokStyle('royal'), true);
assert.equal(isValidHanbokStyle('invalid-style'), false);
assert.equal(isValidHanbokStyle(null), false);
assert.equal(isValidHanbokStyle(undefined), false);

// 4. Browser-local Personal Color bridge is deterministic and bounded to the matcher palette contract.
assert.equal(isPersonalColorUndertone('warm'), true);
assert.equal(isPersonalColorUndertone('neutral'), true);
assert.equal(isPersonalColorUndertone('cool'), true);
assert.equal(isPersonalColorUndertone('invalid'), false);
assert.equal(hanbokColorForUndertone('warm'), 'jadeIvory');
assert.equal(hanbokColorForUndertone('neutral'), 'roseNavy');
assert.equal(hanbokColorForUndertone('cool'), 'moonBlue');

// 5. Cross-feature URL contract: Personal Color carries explicit undertone into Hanbok,
// and style selection preserves it before scrolling to the matcher.
const colorScannerSource = readFileSync(path.join(projectRoot, 'src/features/color/color-scanner.tsx'), 'utf8');
const visualSource = readFileSync(path.join(projectRoot, 'src/features/hanbok/hanbok-visual-inspiration.tsx'), 'utf8');
const matcherSource = readFileSync(path.join(projectRoot, 'src/features/hanbok/hanbok-matcher.tsx'), 'utf8');
assert.match(colorScannerSource, /\/hanbok\?undertone=/, 'Personal Color must deep-link its undertone to Hanbok');
assert.match(visualSource, /matcherQuery\.set\('undertone'/, 'Hanbok style cards must preserve Personal Color undertone');
assert.match(matcherSource, /hanbokColorForUndertone\(undertoneParam\)/, 'Matcher must consume the explicit Personal Color bridge');

console.log('✓ Hanbok visual, style-preset, and Personal Color bridge contract tests passed!');
