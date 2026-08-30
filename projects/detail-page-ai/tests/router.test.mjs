import test from 'node:test';
import assert from 'node:assert/strict';
import { choosePromptRoute, PROMPT_ROUTES } from '../src/orchestration/prompt-router.mjs';

test('sparse input uses direct conversion master', () => {
  assert.equal(choosePromptRoute({ confirmedEvidenceCount: 1, differentiatedFactsCount: 1, descriptionLength: 120 }), PROMPT_ROUTES.DIRECT_CONVERSION);
});

test('rich proof/story input uses TED autofill + master V3', () => {
  assert.equal(choosePromptRoute({ confirmedEvidenceCount: 2, differentiatedFactsCount: 2, hasProofDocument: true, descriptionLength: 700 }), PROMPT_ROUTES.TED_GOLDEN_CIRCLE);
});
