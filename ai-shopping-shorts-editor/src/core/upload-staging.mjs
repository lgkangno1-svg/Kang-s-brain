import path from 'node:path';
import { randomUUID } from 'node:crypto';

export function createUploadPaths(inputsDir, prefix, name, token = randomUUID()) {
  const safeToken = String(token).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  if (!safeToken) throw new Error('Upload token must contain a safe character.');
  return {
    stagedPath: path.join(inputsDir, `.upload-${safeToken}.part`),
    finalPath: path.join(inputsDir, `${prefix}${safeToken}-${name}`)
  };
}

export async function publishStagedUpload({ fs, stagedPath, finalPath, persist }) {
  let renamed = false;
  try {
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
