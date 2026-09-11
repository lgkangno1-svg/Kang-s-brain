import path from 'node:path';
import { randomUUID } from 'node:crypto';

const STAGED_UPLOAD_RE = /^\.upload-[a-zA-Z0-9_-]+\.part$/;
export const DEFAULT_STALE_UPLOAD_AGE_MS = 24 * 60 * 60 * 1000;

export function createUploadPaths(inputsDir, prefix, name, token = randomUUID()) {
  const safeToken = String(token).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  if (!safeToken) throw new Error('Upload token must contain a safe character.');
  return {
    stagedPath: path.join(inputsDir, `.upload-${safeToken}.part`),
    finalPath: path.join(inputsDir, `${prefix}${safeToken}-${name}`)
  };
}

export async function cleanupStaleUploadParts({ fs, inputsDir, now = Date.now(), minAgeMs = DEFAULT_STALE_UPLOAD_AGE_MS }) {
  if (!Number.isFinite(minAgeMs) || minAgeMs < 0) throw new Error('minAgeMs must be a non-negative finite number.');
  const removed = [];
  let entries;
  try {
    entries = await fs.readdir(inputsDir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return removed;
    throw error;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !STAGED_UPLOAD_RE.test(entry.name)) continue;
    const file = path.join(inputsDir, entry.name);
    let stat;
    try {
      stat = await fs.stat(file);
    } catch (error) {
      if (error?.code === 'ENOENT') continue;
      throw error;
    }
    if (now - stat.mtimeMs < minAgeMs) continue;
    await fs.rm(file, { force: true });
    removed.push(file);
  }
  return removed;
}

export async function publishStagedUpload({ fs, stagedPath, finalPath, persist }) {
  let renamed = false;
  try {
    // Maintenance must never make a valid upload fail. Age + exact tool-owned
    // filename matching protect fresh/current staging files and user media.
    await cleanupStaleUploadParts({ fs, inputsDir: path.dirname(stagedPath) }).catch(() => {});
    await fs.rename(stagedPath, finalPath);
    renamed = true;
    await persist(finalPath);
    return finalPath;
  } catch (error) {
    await fs.rm(stagedPath, { force: true }).catch(() => {});
    if (renamed) await fs.rm(finalPath, { force: true }).catch(() => {});
    throw error;
  }
}
