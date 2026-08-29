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
const {HANBOK_STYLE_CATEGORIES, isValidHanbokStyle} = hanbokLib;

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

// 3. Validation helper works
assert.equal(isValidHanbokStyle('princess-prince'), true);
assert.equal(isValidHanbokStyle('queen-king'), true);
assert.equal(isValidHanbokStyle('royal'), true);
assert.equal(isValidHanbokStyle('invalid-style'), false);
assert.equal(isValidHanbokStyle(null), false);
assert.equal(isValidHanbokStyle(undefined), false);

console.log('✓ Hanbok Visual 3-Category & Matcher contract tests passed!');
