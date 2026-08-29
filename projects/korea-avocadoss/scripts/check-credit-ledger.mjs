import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, '..', 'src', 'lib', 'credits', 'ledger.ts');
const source = readFileSync(sourcePath, 'utf8');
const transpiled = ts.transpileModule(source, {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, strict: true},
  fileName: sourcePath,
  reportDiagnostics: true,
});
const errors = (transpiled.diagnostics ?? []).filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
assert.equal(errors.length, 0, `TypeScript transpile diagnostics: ${errors.map((item) => item.messageText).join('; ')}`);

const runtimeModule = {exports: {}};
const execute = new Function('exports', 'module', 'require', '__filename', '__dirname', transpiled.outputText);
execute(runtimeModule.exports, runtimeModule, require, sourcePath, path.dirname(sourcePath));
const {createEmptyWallet, applyWalletCommand, getWalletBalance, assertWalletInvariants} = runtimeModule.exports;

let state = createEmptyWallet('wallet-test');
let result = applyWalletCommand(state, {type: 'grant', amount: 100, idempotencyKey: 'grant-1', source: 'verified_payment', reference: 'payment-order-1'});
state = result.state;
assert.deepEqual(getWalletBalance(state), {available: 100, reserved: 0, spent: 0, totalGranted: 100});
const grantReplay = applyWalletCommand(state, {type: 'grant', amount: 100, idempotencyKey: 'grant-1', source: 'verified_payment', reference: 'payment-order-1'});
assert.equal(grantReplay.replayed, true);
assert.equal(grantReplay.state.entries.length, 1);
assert.throws(() => applyWalletCommand(state, {type: 'grant', amount: 101, idempotencyKey: 'grant-1', source: 'verified_payment', reference: 'payment-order-1'}), /Idempotency key conflict/);

result = applyWalletCommand(state, {type: 'reserve', amount: 30, idempotencyKey: 'reserve-1', usageId: 'usage-1', feature: 'hanbok.premium'});
state = result.state;
const reservationId = result.entry.id;
assert.deepEqual(getWalletBalance(state), {available: 70, reserved: 30, spent: 0, totalGranted: 100});
assert.throws(() => applyWalletCommand(state, {type: 'reserve', amount: 71, idempotencyKey: 'reserve-too-big', usageId: 'usage-2', feature: 'color.vision'}), /Insufficient available credits/);

result = applyWalletCommand(state, {type: 'capture', reservationEntryId: reservationId, amount: 20, idempotencyKey: 'capture-1', usageId: 'usage-1'});
state = result.state;
const captureId = result.entry.id;
assert.deepEqual(getWalletBalance(state), {available: 70, reserved: 10, spent: 20, totalGranted: 100});

result = applyWalletCommand(state, {type: 'release', reservationEntryId: reservationId, idempotencyKey: 'release-1', reason: 'unused-reserve'});
state = result.state;
assert.deepEqual(getWalletBalance(state), {available: 80, reserved: 0, spent: 20, totalGranted: 100});
assert.throws(() => applyWalletCommand(state, {type: 'capture', reservationEntryId: reservationId, amount: 1, idempotencyKey: 'capture-after-close', usageId: 'usage-1'}), /already closed/);

result = applyWalletCommand(state, {type: 'refund', captureEntryId: captureId, amount: 5, idempotencyKey: 'refund-1', reason: 'partial-service-refund'});
state = result.state;
assert.deepEqual(getWalletBalance(state), {available: 85, reserved: 0, spent: 15, totalGranted: 100});
assert.throws(() => applyWalletCommand(state, {type: 'refund', captureEntryId: captureId, amount: 16, idempotencyKey: 'refund-too-big', reason: 'invalid'}), /exceeds unrefunded/);

result = applyWalletCommand(state, {type: 'refund', captureEntryId: captureId, idempotencyKey: 'refund-2', reason: 'final-service-refund'});
state = result.state;
assert.deepEqual(getWalletBalance(state), {available: 100, reserved: 0, spent: 0, totalGranted: 100});
const refundReplay = applyWalletCommand(state, {type: 'refund', captureEntryId: captureId, idempotencyKey: 'refund-2', reason: 'final-service-refund'});
assert.equal(refundReplay.replayed, true);
assert.equal(refundReplay.state.entries.length, state.entries.length);
assert.deepEqual(assertWalletInvariants(state), {available: 100, reserved: 0, spent: 0, totalGranted: 100});
assert.throws(() => applyWalletCommand(createEmptyWallet('empty'), {type: 'reserve', amount: 1, idempotencyKey: 'negative-prevention', usageId: 'usage-empty', feature: 'culture.saju'}), /Insufficient available credits/);

console.log('Credit ledger checks passed: immutable entries, idempotent replay/conflict, reserve/capture/release/refund, no-negative-balance invariants.');
