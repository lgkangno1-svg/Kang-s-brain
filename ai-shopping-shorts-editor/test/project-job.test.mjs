import test from 'node:test';
import assert from 'node:assert/strict';
import { beginProjectJob, abandonProjectJob } from '../src/core/project-job.mjs';

test('project job claim is synchronous and rejects a concurrent run/replace claim', () => {
  const jobs = new Map();

  const first = beginProjectJob(jobs, 'project-1', '요청 확인');
  const second = beginProjectJob(jobs, 'project-1', '컷 교체 요청 확인');

  assert.ok(first);
  assert.equal(first.running, true);
  assert.equal(jobs.get('project-1'), first);
  assert.equal(second, null);
});

test('abandoning setup releases only the state that still owns the project slot', () => {
  const jobs = new Map();
  const first = beginProjectJob(jobs, 'project-1', '요청 확인');

  abandonProjectJob(jobs, 'project-1', first);
  assert.equal(jobs.has('project-1'), false);

  const replacement = beginProjectJob(jobs, 'project-1', '재시도');
  assert.ok(replacement);

  abandonProjectJob(jobs, 'project-1', first);
  assert.equal(jobs.get('project-1'), replacement);
});

test('different projects can run independently', () => {
  const jobs = new Map();

  const first = beginProjectJob(jobs, 'project-1', '시작');
  const second = beginProjectJob(jobs, 'project-2', '시작');

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first, second);
});
