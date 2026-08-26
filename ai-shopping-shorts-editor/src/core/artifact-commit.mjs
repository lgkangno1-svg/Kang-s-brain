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
  const artifacts = [
    { finalPath: outputPath, stagedPath: stagedVideoPath },
    { finalPath: edlPath, stagedPath: stagedEdlPath },
    { finalPath: qaPath, stagedPath: stagedQaPath }
  ];
  const backups = [];
  const committed = [];

  await writeJson(stagedEdlPath, edlDoc);
  await writeJson(stagedQaPath, qa);

  try {
    for (const artifact of artifacts) {
      if (await exists(artifact.finalPath, fileOps)) {
        const backupPath = stagedSibling(artifact.finalPath, nonce, 'bak');
        await fileOps.copyFile(artifact.finalPath, backupPath);
        backups.push({ finalPath: artifact.finalPath, backupPath });
      }
    }

    for (const artifact of artifacts) {
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
      fileOps.rm(stagedVideoPath, { force: true }),
      fileOps.rm(stagedEdlPath, { force: true }),
      fileOps.rm(stagedQaPath, { force: true }),
      ...backups.map((backup) => fileOps.rm(backup.backupPath, { force: true }))
    ]);
  }
}
