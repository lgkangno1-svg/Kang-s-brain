import test from 'node:test';
import assert from 'node:assert/strict';
import { beginProjectMutation, endProjectMutation } from '../src/core/project-mutation.mjs';

test('same-project upload/run/replace mutations are mutually exclusive', () => {
  const active = new Map();

  const upload = beginProjectMutation(active, 'project-1', 'upload:video');
  const run = beginProjectMutation(active, 'project-1', 'run');
  const replace = beginProjectMutation(active, 'project-1', 'replace');

  assert.ok(upload);
  assert.equal(run, null);
  assert.equal(replace, null);
  assert.equal(active.get('project-1'), upload);
});

test('ending a mutation only releases the token that still owns the project', () => {
  const active = new Map();
  const first = beginProjectMutation(active, 'project-1', 'upload:srt');

  endProjectMutation(active, 'project-1', first);
  assert.equal(active.has('project-1'), false);

  const second = beginProjectMutation(active, 'project-1', 'run');
  assert.ok(second);

  endProjectMutation(active, 'project-1', first);
  assert.equal(active.get('project-1'), second);
});

test('different projects can mutate independently', () => {
  const active = new Map();

  const first = beginProjectMutation(active, 'project-1', 'upload:video');
  const second = beginProjectMutation(active, 'project-2', 'run');

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
});
