import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { cleanupStaleUploadParts, createUploadPaths, publishStagedUpload } from '../src/core/upload-staging.mjs';

test('createUploadPaths uses hidden unique staging and unique final names', () => {
  const a = createUploadPaths('/tmp/inputs', '01-', 'clip.mp4', 'token-a');
  const b = createUploadPaths('/tmp/inputs', '01-', 'clip.mp4', 'token-b');
  assert.equal(path.basename(a.stagedPath), '.upload-token-a.part');
  assert.equal(path.basename(a.finalPath), '01-token-a-clip.mp4');
  assert.notEqual(a.finalPath, b.finalPath);
});

test('cleanupStaleUploadParts removes only old tool-owned staging files', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-upload-cleanup-'));
  const oldPart = path.join(dir, '.upload-old-token.part');
  const freshPart = path.join(dir, '.upload-fresh-token.part');
  const userPart = path.join(dir, 'customer-video.part');
  const finalMedia = path.join(dir, '01-token-clip.mp4');
  await Promise.all([
    fs.writeFile(oldPart, 'old'),
    fs.writeFile(freshPart, 'fresh'),
    fs.writeFile(userPart, 'user'),
    fs.writeFile(finalMedia, 'final')
  ]);
  const now = Date.now();
  const oldTime = new Date(now - (25 * 60 * 60 * 1000));
  const freshTime = new Date(now - (60 * 60 * 1000));
  await fs.utimes(oldPart, oldTime, oldTime);
  await fs.utimes(freshPart, freshTime, freshTime);
  await fs.utimes(userPart, oldTime, oldTime);
  await fs.utimes(finalMedia, oldTime, oldTime);

  const removed = await cleanupStaleUploadParts({ fs, inputsDir: dir, now });

  assert.deepEqual(removed, [oldPart]);
  await assert.rejects(fs.stat(oldPart), { code: 'ENOENT' });
  assert.equal(await fs.readFile(freshPart, 'utf8'), 'fresh');
  assert.equal(await fs.readFile(userPart, 'utf8'), 'user');
  assert.equal(await fs.readFile(finalMedia, 'utf8'), 'final');
  await fs.rm(dir, { recursive: true, force: true });
});

test('cleanupStaleUploadParts validates age policy', async () => {
  await assert.rejects(
    cleanupStaleUploadParts({ fs, inputsDir: '/tmp', minAgeMs: -1 }),
    /minAgeMs must be a non-negative finite number/
  );
});

test('publishStagedUpload opportunistically removes old staging debris', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-upload-publish-cleanup-'));
  const stalePath = path.join(dir, '.upload-stale-token.part');
  const stagedPath = path.join(dir, '.upload-current-token.part');
  const finalPath = path.join(dir, '01-current-token-clip.mp4');
  await fs.writeFile(stalePath, 'stale');
  await fs.writeFile(stagedPath, 'current');
  const oldTime = new Date(Date.now() - (25 * 60 * 60 * 1000));
  await fs.utimes(stalePath, oldTime, oldTime);

  await publishStagedUpload({ fs, stagedPath, finalPath, persist: async () => {} });

  await assert.rejects(fs.stat(stalePath), { code: 'ENOENT' });
  assert.equal(await fs.readFile(finalPath, 'utf8'), 'current');
  await fs.rm(dir, { recursive: true, force: true });
});

test('publishStagedUpload removes published file when metadata persistence fails', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-upload-'));
  const stagedPath = path.join(dir, '.upload-test.part');
  const finalPath = path.join(dir, '01-test-clip.mp4');
  await fs.writeFile(stagedPath, 'partial-complete-upload');

  await assert.rejects(
    publishStagedUpload({
      fs,
      stagedPath,
      finalPath,
      persist: async () => { throw new Error('project.json write failed'); }
    }),
    /project\.json write failed/
  );
  await assert.rejects(fs.stat(stagedPath), { code: 'ENOENT' });
  await assert.rejects(fs.stat(finalPath), { code: 'ENOENT' });
  await fs.rm(dir, { recursive: true, force: true });
});

test('publishStagedUpload keeps final file after persistence succeeds', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-upload-'));
  const stagedPath = path.join(dir, '.upload-test.part');
  const finalPath = path.join(dir, '01-test-clip.mp4');
  await fs.writeFile(stagedPath, 'complete-upload');
  let persisted = null;

  const result = await publishStagedUpload({
    fs,
    stagedPath,
    finalPath,
    persist: async (file) => { persisted = file; }
  });

  assert.equal(result, finalPath);
  assert.equal(persisted, finalPath);
  assert.equal(await fs.readFile(finalPath, 'utf8'), 'complete-upload');
  await assert.rejects(fs.stat(stagedPath), { code: 'ENOENT' });
  await fs.rm(dir, { recursive: true, force: true });
});
