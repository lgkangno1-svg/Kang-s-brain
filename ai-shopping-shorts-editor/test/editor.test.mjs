import test from 'node:test';
import assert from 'node:assert/strict';
import { buildEdl, buildRenderArgs, chooseJudgeReplacement, validateEdl } from '../src/core/editor.mjs';

test('fallback editor keeps choosing the best remaining eligible scene', async () => {
  const beats = [
    { id: 'b1', start: 0, end: 1, duration: 1, text: '첫 장면' },
    { id: 'b2', start: 1, end: 2, duration: 1, text: '두 번째 장면' }
  ];
  const segments = [
    { id: 's1', sourceId: 'V1', sourcePath: '/tmp/v1.mp4', start: 0, end: 2, duration: 2, visualQuality: 10, productVisibility: 10 },
    { id: 's2', sourceId: 'V2', sourcePath: '/tmp/v2.mp4', start: 0, end: 2, duration: 2, visualQuality: 9, productVisibility: 9 },
    { id: 's3', sourceId: 'V3', sourcePath: '/tmp/v3.mp4', start: 0, end: 2, duration: 2, visualQuality: 1, productVisibility: 1 }
  ];

  const edl = await buildEdl({ beats, segments, apiKey: '', settings: {}, usage: {}, workDir: '/tmp' });

  assert.deepEqual(edl.map((clip) => clip.segmentId), ['s1', 's2']);
});

test('quality judge replacement skips segments already occupied by another beat', () => {
  const clip = { segmentId: 's1', sourceId: 'V1', alternatives: ['s2', 's3', 's4'] };
  const beat = { id: 'b1', duration: 1.5 };
  const segments = new Map([
    ['s2', { id: 's2', sourceId: 'V2', duration: 2.0 }],
    ['s3', { id: 's3', sourceId: 'V3', duration: 1.0 }],
    ['s4', { id: 's4', sourceId: 'V4', duration: 2.0 }]
  ]);

  const replacement = chooseJudgeReplacement(clip, beat, segments, new Set(['s2']));

  assert.equal(replacement?.id, 's4');
});

test('EDL validation rejects source/program duration mismatches before render', () => {
  const result = validateEdl([
    {
      beatId: 'b1', segmentId: 's1', sourceId: 'V1',
      programStart: 0, programEnd: 1.5,
      sourceStart: 2, sourceEnd: 3
    }
  ], new Map([['V1', { duration: 10 }]]));

  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /source\/program duration mismatch/);
});

test('renderer pins output duration to the EDL timeline instead of shortest TTS input', () => {
  const edl = [
    { sourcePath: '/tmp/v1.mp4', sourceStart: 0, sourceEnd: 1, programStart: 0, programEnd: 1 },
    { sourcePath: '/tmp/v2.mp4', sourceStart: 0, sourceEnd: 1.4, programStart: 1, programEnd: 2.4 }
  ];

  const args = buildRenderArgs({ edl, outputPath: '/tmp/out.mp4', ttsPath: '/tmp/short-tts.wav' });
  const durationIndex = args.indexOf('-t');

  assert.equal(args.includes('-shortest'), false);
  assert.equal(args[durationIndex + 1], '2.4');
  assert.equal(args.includes('/tmp/short-tts.wav'), true);
});
