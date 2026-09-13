import { createHash, randomUUID } from 'node:crypto';
import { createReadStream, promises as fs } from 'node:fs';
import path from 'node:path';

export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const round3 = (n) => Math.round(n * 1000) / 1000;
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const projectId = () => `${Date.now().toString(36)}-${randomUUID().slice(0, 8)}`;
export const sha256Text = (text) => createHash('sha256').update(String(text)).digest('hex');

export async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export function safeFilename(input) {
  const base = path.basename(String(input || 'file.bin'));
  return base.replace(/[^a-zA-Z0-9._()\-가-힣]/g, '_').slice(0, 180) || 'file.bin';
}

export function parseByteRange(rangeHeader, size) {
  if (!rangeHeader) return null;
  if (!Number.isSafeInteger(size) || size < 0) throw new Error('Invalid resource size.');
  const match = /^bytes=(\d*)-(\d*)$/.exec(String(rangeHeader).trim());
  if (!match || (!match[1] && !match[2]) || size === 0) return { satisfiable: false };

  let start; let end;
  if (match[1]) {
    start = Number(match[1]);
    end = match[2] ? Number(match[2]) : size - 1;
  } else {
    const suffixLength = Number(match[2]);
    if (!Number.isSafeInteger(suffixLength) || suffixLength <= 0) return { satisfiable: false };
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  }

  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= size) return { satisfiable: false };
  end = Math.min(end, size - 1);
  return { satisfiable: true, start, end };
}

export async function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    const hash = createHash('sha256');
    const stream = createReadStream(filePath);
    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(hash.digest('hex')));
  });
}

export async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch {
    return fallback;
  }
}

export async function writeJson(filePath, value) {
  await ensureDir(path.dirname(filePath));
  const tempPath = `${filePath}.${process.pid}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(tempPath, JSON.stringify(value, null, 2));
    await fs.rename(tempPath, filePath);
  } finally {
    await fs.rm(tempPath, { force: true }).catch(() => {});
  }
}

export function extractJson(text) {
  if (typeof text !== 'string') throw new Error('Model response was not text.');
  const trimmed = text.trim();
  try { return JSON.parse(trimmed); } catch {}
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()); } catch {}
  }
  const firstArray = trimmed.indexOf('[');
  const lastArray = trimmed.lastIndexOf(']');
  if (firstArray >= 0 && lastArray > firstArray) {
    try { return JSON.parse(trimmed.slice(firstArray, lastArray + 1)); } catch {}
  }
  const firstObj = trimmed.indexOf('{');
  const lastObj = trimmed.lastIndexOf('}');
  if (firstObj >= 0 && lastObj > firstObj) {
    try { return JSON.parse(trimmed.slice(firstObj, lastObj + 1)); } catch {}
  }
  throw new Error('Could not parse JSON from model response.');
}
