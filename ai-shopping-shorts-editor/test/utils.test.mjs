import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { parseByteRange, readJson, writeJson } from '../src/core/utils.mjs';

test('parseByteRange accepts normal, open-ended, and suffix ranges', () => {
  assert.deepEqual(parseByteRange('bytes=0-99', 1000), { satisfiable: true, start: 0, end: 99 });
  assert.deepEqual(parseByteRange('bytes=100-', 1000), { satisfiable: true, start: 100, end: 999 });
  assert.deepEqual(parseByteRange('bytes=-100', 1000), { satisfiable: true, start: 900, end: 999 });
  assert.deepEqual(parseByteRange('bytes=0-9999', 1000), { satisfiable: true, start: 0, end: 999 });
});

test('parseByteRange rejects malformed or unsatisfiable ranges', () => {
  for (const header of ['bytes=1000-', 'bytes=20-10', 'bytes=abc-def', 'bytes=0-1,4-5', 'bytes=-0']) {
    assert.deepEqual(parseByteRange(header, 1000), { satisfiable: false });
  }
  assert.deepEqual(parseByteRange('bytes=0-0', 0), { satisfiable: false });
});

test('writeJson preserves the previous file when replacement serialization fails', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-json-'));
  const filePath = path.join(dir, 'state.json');
  try {
    await writeJson(filePath, { version: 1, stable: true });
    await assert.rejects(() => writeJson(filePath, { version: 2, unsupported: 1n }), /BigInt/);
    assert.deepEqual(await readJson(filePath), { version: 1, stable: true });
    assert.deepEqual(await fs.readdir(dir), ['state.json']);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
