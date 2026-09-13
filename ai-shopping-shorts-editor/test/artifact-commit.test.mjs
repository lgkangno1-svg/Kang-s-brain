import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { commitReplacementArtifacts, commitRunArtifacts } from '../src/core/artifact-commit.mjs';

test('replacement artifact commit restores video, EDL, and QA when a later rename fails', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-artifact-commit-'));
  const outputPath = path.join(dir, 'shorts.mp4');
  const edlPath = path.join(dir, 'edl.json');
  const qaPath = path.join(dir, 'qa.json');
  const stagedVideoPath = path.join(dir, '.shorts.test.tmp.mp4');

  await fs.writeFile(outputPath, 'old-video');
  await fs.writeFile(edlPath, '{"version":"old-edl"}\n');
  await fs.writeFile(qaPath, '{"version":"old-qa"}\n');
  await fs.writeFile(stagedVideoPath, 'new-video');

  const fileOps = {
    stat: (...args) => fs.stat(...args),
    copyFile: (...args) => fs.copyFile(...args),
    rm: (...args) => fs.rm(...args),
    rename: async (from, to) => {
      if (to === edlPath) throw new Error('synthetic EDL rename failure');
      return fs.rename(from, to);
    }
  };

  await assert.rejects(
    commitReplacementArtifacts({
      stagedVideoPath,
      outputPath,
      edlPath,
      qaPath,
      edlDoc: { version: 'new-edl' },
      qa: { version: 'new-qa' },
      nonce: 'test',
      fileOps
    }),
    /synthetic EDL rename failure/
  );

  assert.equal(await fs.readFile(outputPath, 'utf8'), 'old-video');
  assert.equal((await fs.readFile(edlPath, 'utf8')).trim(), '{"version":"old-edl"}');
  assert.equal((await fs.readFile(qaPath, 'utf8')).trim(), '{"version":"old-qa"}');
  const leftovers = (await fs.readdir(dir)).filter((name) => name.includes('.test.'));
  assert.deepEqual(leftovers, []);
  await fs.rm(dir, { recursive: true, force: true });
});

test('replacement artifact commit publishes the staged video and matching JSON together', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-artifact-commit-ok-'));
  const outputPath = path.join(dir, 'shorts.mp4');
  const edlPath = path.join(dir, 'edl.json');
  const qaPath = path.join(dir, 'qa.json');
  const stagedVideoPath = path.join(dir, '.shorts.success.tmp.mp4');

  await fs.writeFile(outputPath, 'old-video');
  await fs.writeFile(edlPath, '{"version":"old-edl"}\n');
  await fs.writeFile(qaPath, '{"version":"old-qa"}\n');
  await fs.writeFile(stagedVideoPath, 'new-video');

  await commitReplacementArtifacts({
    stagedVideoPath,
    outputPath,
    edlPath,
    qaPath,
    edlDoc: { version: 'new-edl' },
    qa: { version: 'new-qa' },
    nonce: 'success'
  });

  assert.equal(await fs.readFile(outputPath, 'utf8'), 'new-video');
  assert.equal(JSON.parse(await fs.readFile(edlPath, 'utf8')).version, 'new-edl');
  assert.equal(JSON.parse(await fs.readFile(qaPath, 'utf8')).version, 'new-qa');
  const leftovers = (await fs.readdir(dir)).filter((name) => name.includes('.success.'));
  assert.deepEqual(leftovers, []);
  await fs.rm(dir, { recursive: true, force: true });
});

test('automatic run artifact commit restores the entire last-known-good result when a later rename fails', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-run-artifact-fail-'));
  const outputPath = path.join(dir, 'shorts.mp4');
  const beatsPath = path.join(dir, 'beats.json');
  const segmentsPath = path.join(dir, 'segments.json');
  const edlPath = path.join(dir, 'edl.json');
  const qaPath = path.join(dir, 'qa.json');
  const stagedVideoPath = path.join(dir, '.shorts.runfail.tmp.mp4');

  const old = {
    [outputPath]: 'old-video',
    [beatsPath]: '{"version":"old-beats"}\n',
    [segmentsPath]: '{"version":"old-segments"}\n',
    [edlPath]: '{"version":"old-edl"}\n',
    [qaPath]: '{"version":"old-qa"}\n'
  };
  for (const [file, content] of Object.entries(old)) await fs.writeFile(file, content);
  await fs.writeFile(stagedVideoPath, 'new-video');

  const fileOps = {
    stat: (...args) => fs.stat(...args),
    copyFile: (...args) => fs.copyFile(...args),
    rm: (...args) => fs.rm(...args),
    rename: async (from, to) => {
      if (to === edlPath) throw new Error('synthetic automatic EDL rename failure');
      return fs.rename(from, to);
    }
  };

  await assert.rejects(
    commitRunArtifacts({
      stagedVideoPath,
      outputPath,
      beatsPath,
      segmentsPath,
      edlPath,
      qaPath,
      beats: { version: 'new-beats' },
      segments: { version: 'new-segments' },
      edlDoc: { version: 'new-edl' },
      qa: { version: 'new-qa' },
      nonce: 'runfail',
      fileOps
    }),
    /synthetic automatic EDL rename failure/
  );

  for (const [file, content] of Object.entries(old)) {
    assert.equal(await fs.readFile(file, 'utf8'), content);
  }
  const leftovers = (await fs.readdir(dir)).filter((name) => name.includes('.runfail.'));
  assert.deepEqual(leftovers, []);
  await fs.rm(dir, { recursive: true, force: true });
});

test('automatic run artifact commit publishes video, beats, segments, EDL, and QA as one matching version', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shorts-run-artifact-ok-'));
  const outputPath = path.join(dir, 'shorts.mp4');
  const beatsPath = path.join(dir, 'beats.json');
  const segmentsPath = path.join(dir, 'segments.json');
  const edlPath = path.join(dir, 'edl.json');
  const qaPath = path.join(dir, 'qa.json');
  const stagedVideoPath = path.join(dir, '.shorts.runok.tmp.mp4');

  for (const file of [outputPath, beatsPath, segmentsPath, edlPath, qaPath]) await fs.writeFile(file, 'old');
  await fs.writeFile(stagedVideoPath, 'new-video');

  await commitRunArtifacts({
    stagedVideoPath,
    outputPath,
    beatsPath,
    segmentsPath,
    edlPath,
    qaPath,
    beats: { version: 'new-beats' },
    segments: { version: 'new-segments' },
    edlDoc: { version: 'new-edl' },
    qa: { version: 'new-qa' },
    nonce: 'runok'
  });

  assert.equal(await fs.readFile(outputPath, 'utf8'), 'new-video');
  assert.equal(JSON.parse(await fs.readFile(beatsPath, 'utf8')).version, 'new-beats');
  assert.equal(JSON.parse(await fs.readFile(segmentsPath, 'utf8')).version, 'new-segments');
  assert.equal(JSON.parse(await fs.readFile(edlPath, 'utf8')).version, 'new-edl');
  assert.equal(JSON.parse(await fs.readFile(qaPath, 'utf8')).version, 'new-qa');
  const leftovers = (await fs.readdir(dir)).filter((name) => name.includes('.runok.'));
  assert.deepEqual(leftovers, []);
  await fs.rm(dir, { recursive: true, force: true });
});
