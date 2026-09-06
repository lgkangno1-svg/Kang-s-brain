import test from 'node:test';
import assert from 'node:assert/strict';
import { beginProjectMutation, beginProjectMutationWithFreshSnapshot, endProjectMutation } from '../src/core/project-mutation.mjs';

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

test('fresh snapshot is read only after the mutation token is owned', async () => {
  const active = new Map();
  let storedProject = { videos: ['old.mp4'], revision: 1 };
  const staleSnapshot = structuredClone(storedProject);

  storedProject = { videos: ['old.mp4', 'new.mp4'], revision: 2 };

  let sawOwnershipDuringRead = false;
  const claimed = await beginProjectMutationWithFreshSnapshot(active, 'project-1', 'run', async () => {
    sawOwnershipDuringRead = active.has('project-1');
    return structuredClone(storedProject);
  });

  assert.ok(claimed);
  assert.equal(sawOwnershipDuringRead, true);
  assert.deepEqual(staleSnapshot.videos, ['old.mp4']);
  assert.deepEqual(claimed.project.videos, ['old.mp4', 'new.mp4']);
  assert.equal(claimed.project.revision, 2);
  endProjectMutation(active, 'project-1', claimed.token);
});

test('fresh snapshot helper releases ownership when the read fails', async () => {
  const active = new Map();

  await assert.rejects(
    beginProjectMutationWithFreshSnapshot(active, 'project-1', 'replace', async () => {
      throw new Error('read failed');
    }),
    /read failed/
  );

  assert.equal(active.has('project-1'), false);
});
