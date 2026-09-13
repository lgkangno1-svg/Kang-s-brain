import { promises as fs } from 'node:fs';
import path from 'node:path';
import { writeJson } from './utils.mjs';

function stagedSibling(filePath, nonce, label = 'tmp') {
  const ext = path.extname(filePath);
  const stem = path.basename(filePath, ext);
  return path.join(path.dirname(filePath), `.${stem}.${nonce}.${label}${ext}`);
}

async function exists(filePath, fileOps = fs) {
  try {
    await fileOps.stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

async function commitArtifactSet({ stagedArtifacts, nonce, fileOps = fs }) {
  const backups = [];
  const committed = [];

  try {
    for (const artifact of stagedArtifacts) {
      if (await exists(artifact.finalPath, fileOps)) {
        const backupPath = stagedSibling(artifact.finalPath, nonce, 'bak');
        await fileOps.copyFile(artifact.finalPath, backupPath);
        backups.push({ finalPath: artifact.finalPath, backupPath });
      }
    }

    for (const artifact of stagedArtifacts) {
      await fileOps.rename(artifact.stagedPath, artifact.finalPath);
      committed.push(artifact.finalPath);
    }
  } catch (error) {
    for (const finalPath of committed.reverse()) {
      await fileOps.rm(finalPath, { force: true }).catch(() => {});
    }
    for (const backup of backups) {
      await fileOps.copyFile(backup.backupPath, backup.finalPath).catch(() => {});
    }
    throw error;
  } finally {
    await Promise.allSettled([
      ...stagedArtifacts.map((artifact) => fileOps.rm(artifact.stagedPath, { force: true })),
      ...backups.map((backup) => fileOps.rm(backup.backupPath, { force: true }))
    ]);
  }
}

export async function commitReplacementArtifacts({
  stagedVideoPath,
  outputPath,
  edlPath,
  qaPath,
  edlDoc,
  qa,
  nonce = `${process.pid}-${Date.now()}`,
  fileOps = fs
}) {
  const stagedEdlPath = stagedSibling(edlPath, nonce);
  const stagedQaPath = stagedSibling(qaPath, nonce);

  await writeJson(stagedEdlPath, edlDoc);
  await writeJson(stagedQaPath, qa);

  await commitArtifactSet({
    stagedArtifacts: [
      { finalPath: outputPath, stagedPath: stagedVideoPath },
      { finalPath: edlPath, stagedPath: stagedEdlPath },
      { finalPath: qaPath, stagedPath: stagedQaPath }
    ],
    nonce,
    fileOps
  });
}

export async function commitRunArtifacts({
  stagedVideoPath,
  outputPath,
  beatsPath,
  segmentsPath,
  edlPath,
  qaPath,
  beats,
  segments,
  edlDoc,
  qa,
  nonce = `${process.pid}-${Date.now()}`,
  fileOps = fs
}) {
  const stagedBeatsPath = stagedSibling(beatsPath, nonce);
  const stagedSegmentsPath = stagedSibling(segmentsPath, nonce);
  const stagedEdlPath = stagedSibling(edlPath, nonce);
  const stagedQaPath = stagedSibling(qaPath, nonce);

  await Promise.all([
    writeJson(stagedBeatsPath, beats),
    writeJson(stagedSegmentsPath, segments),
    writeJson(stagedEdlPath, edlDoc),
    writeJson(stagedQaPath, qa)
  ]).catch(async (error) => {
    await Promise.allSettled([
      fs.rm(stagedBeatsPath, { force: true }),
      fs.rm(stagedSegmentsPath, { force: true }),
      fs.rm(stagedEdlPath, { force: true }),
      fs.rm(stagedQaPath, { force: true }),
      fs.rm(stagedVideoPath, { force: true })
    ]);
    throw error;
  });

  await commitArtifactSet({
    stagedArtifacts: [
      { finalPath: outputPath, stagedPath: stagedVideoPath },
      { finalPath: beatsPath, stagedPath: stagedBeatsPath },
      { finalPath: segmentsPath, stagedPath: stagedSegmentsPath },
      { finalPath: edlPath, stagedPath: stagedEdlPath },
      { finalPath: qaPath, stagedPath: stagedQaPath }
    ],
    nonce,
    fileOps
  });
}
