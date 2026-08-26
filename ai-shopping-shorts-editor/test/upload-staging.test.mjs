import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { createUploadPaths, publishStagedUpload } from '../src/core/upload-staging.mjs';

test('createUploadPaths uses hidden unique staging and unique final names', () => {
  const a = createUploadPaths('/tmp/inputs', '01-', 'clip.mp4', 'token-a');
  const b = createUploadPaths('/tmp/inputs', '01-', 'clip.mp4', 'token-b');
  assert.equal(path.basename(a.stagedPath), '.upload-token-a.part');
  assert.equal(path.basename(a.finalPath), '01-token-a-clip.mp4');
  assert.notEqual(a.finalPath, b.finalPath);
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
