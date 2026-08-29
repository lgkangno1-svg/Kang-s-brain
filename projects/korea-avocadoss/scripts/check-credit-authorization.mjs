import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import ts from 'typescript';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const sourcePath = path.join(here, '..', 'src', 'lib', 'credits', 'authorization.ts');
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
const {authorizeWalletCommand} = runtimeModule.exports;

const ownership = {walletId: 'wallet-1', accountId: 'acct-owner'};
const account = {kind: 'account', accountId: 'acct-owner'};
const stranger = {kind: 'account', accountId: 'acct-other'};
const paymentWebhook = {kind: 'system', role: 'payment_webhook', auditId: 'evt-payment-1'};
const featureExecutor = {kind: 'system', role: 'feature_executor', auditId: 'job-usage-1'};
const promotionService = {kind: 'system', role: 'promotion_service', auditId: 'promo-1'};
const supportAdmin = {kind: 'system', role: 'support_admin', auditId: 'admin-1'};

const reserve = {type: 'reserve', amount: 10, idempotencyKey: 'reserve-1', usageId: 'usage-1', feature: 'hanbok.premium'};
assert.equal(authorizeWalletCommand(ownership, account, reserve).actorKind, 'account');
assert.throws(() => authorizeWalletCommand(ownership, stranger, reserve), /does not own wallet/);
assert.throws(() => authorizeWalletCommand(ownership, featureExecutor, reserve), /account owner required/);

const verifiedGrant = {type: 'grant', amount: 100, idempotencyKey: 'grant-pay-1', source: 'verified_payment', reference: 'order-1'};
assert.equal(authorizeWalletCommand(ownership, paymentWebhook, verifiedGrant).authority, 'payment_webhook:evt-payment-1');
assert.throws(() => authorizeWalletCommand(ownership, account, verifiedGrant), /System authority required/);
assert.throws(() => authorizeWalletCommand(ownership, supportAdmin, verifiedGrant), /requires payment_webhook/);

const promoGrant = {type: 'grant', amount: 5, idempotencyKey: 'grant-promo-1', source: 'promotion', reference: 'campaign-1'};
assert.equal(authorizeWalletCommand(ownership, promotionService, promoGrant).actorKind, 'system');
assert.throws(() => authorizeWalletCommand(ownership, paymentWebhook, promoGrant), /requires promotion_service/);

const adminGrant = {type: 'grant', amount: 5, idempotencyKey: 'grant-admin-1', source: 'admin', reference: 'case-1'};
assert.equal(authorizeWalletCommand(ownership, supportAdmin, adminGrant).actorKind, 'system');

const capture = {type: 'capture', reservationEntryId: 'credit-2', amount: 10, idempotencyKey: 'capture-1', usageId: 'usage-1'};
assert.equal(authorizeWalletCommand(ownership, featureExecutor, capture).actorKind, 'system');
assert.throws(() => authorizeWalletCommand(ownership, account, capture), /System authority required/);
assert.throws(() => authorizeWalletCommand(ownership, paymentWebhook, capture), /feature_executor or support_admin required/);

const release = {type: 'release', reservationEntryId: 'credit-2', idempotencyKey: 'release-1', reason: 'job-failed'};
assert.equal(authorizeWalletCommand(ownership, featureExecutor, release).actorKind, 'system');

const refund = {type: 'refund', captureEntryId: 'credit-3', idempotencyKey: 'refund-1', reason: 'service-refund'};
assert.equal(authorizeWalletCommand(ownership, supportAdmin, refund).actorKind, 'system');
assert.throws(() => authorizeWalletCommand(ownership, paymentWebhook, refund), /feature_executor or support_admin required/);

assert.throws(() => authorizeWalletCommand({walletId: '', accountId: 'acct-owner'}, account, reserve), /ownership.walletId is required/);
assert.throws(() => authorizeWalletCommand(ownership, {kind: 'system', role: 'feature_executor', auditId: ''}, capture), /actor.auditId is required/);

console.log('Credit authorization checks passed: wallet ownership, trusted grant sources, server-only capture/release/refund, and auditable system actor boundaries.');
