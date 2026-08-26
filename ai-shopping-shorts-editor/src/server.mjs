import http from 'node:http';
import { promises as fs, createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline as streamPipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { projectId, ensureDir, safeFilename, parseByteRange, writeJson, readJson } from './core/utils.mjs';
import { runProject, replaceClipAndRerender, resolveSettings } from './core/pipeline.mjs';
import { beginProjectJob, abandonProjectJob } from './core/project-job.mjs';
import { beginProjectMutation, endProjectMutation } from './core/project-mutation.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(__dirname, 'public');
const WORKSPACE = path.resolve(process.env.SHORTS_WORKSPACE || path.join(ROOT, 'workspace'));
const PORT = Number(process.env.PORT || 4317);
const jobs = new Map();
const activeMutations = new Map();
await ensureDir(WORKSPACE);

const json = (res, status, body) => {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'content-length': data.length });
  res.end(data);
};

async function bodyBuffer(req, max = 3 * 1024 * 1024 * 1024) {
  const chunks = []; let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if (total > max) throw new Error('Request body too large.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
async function bodyJson(req) { const buf = await bodyBuffer(req, 5 * 1024 * 1024); return buf.length ? JSON.parse(buf.toString('utf8')) : {}; }
function projectDir(id) { return path.join(WORKSPACE, safeFilename(id)); }
function mime(file) { return file.endsWith('.html') ? 'text/html; charset=utf-8' : file.endsWith('.js') ? 'text/javascript; charset=utf-8' : file.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/octet-stream'; }

async function sendFile(req, res, filePath, contentType) {
  const stat = await fs.stat(filePath);
  const range = parseByteRange(req.headers.range, stat.size);
  if (req.headers.range && !range?.satisfiable) {
    res.writeHead(416, { 'content-range': `bytes */${stat.size}`, 'accept-ranges': 'bytes' });
    res.end();
    return;
  }
  if (range?.satisfiable) {
    const { start, end } = range;
    res.writeHead(206, { 'content-type': contentType, 'content-length': end - start + 1, 'content-range': `bytes ${start}-${end}/${stat.size}`, 'accept-ranges': 'bytes' });
    createReadStream(filePath, { start, end }).pipe(res); return;
  }
  res.writeHead(200, { 'content-type': contentType, 'content-length': stat.size, 'accept-ranges': 'bytes' });
  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const parts = url.pathname.split('/').filter(Boolean);

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname.startsWith('/assets/'))) {
      const rel = url.pathname === '/' ? 'index.html' : url.pathname.replace(/^\/assets\//, '');
      const file = path.join(PUBLIC, rel);
      return await sendFile(req, res, file, mime(file));
    }

    if (req.method === 'POST' && url.pathname === '/api/projects') {
      const id = projectId(); const dir = projectDir(id);
      await ensureDir(path.join(dir, 'inputs'));
      await writeJson(path.join(dir, 'project.json'), { id, createdAt: new Date().toISOString(), videos: [], script: '' });
      return json(res, 201, { id });
    }

    if (parts[0] === 'api' && parts[1] === 'projects' && parts[2]) {
      const id = parts[2]; const dir = projectDir(id); const projectPath = path.join(dir, 'project.json');
      const project = await readJson(projectPath, null);
      if (!project) return json(res, 404, { error: 'Project not found' });

      if (req.method === 'POST' && parts[3] === 'upload') {
        const kind = url.searchParams.get('kind'); const name = safeFilename(url.searchParams.get('name') || `${kind}.bin`);
        if (!['video', 'tts', 'srt'].includes(kind)) return json(res, 400, { error: 'Invalid kind' });
        const mutation = beginProjectMutation(activeMutations, id, `upload:${kind}`);
        if (!mutation) return json(res, 409, { error: 'Project is busy' });
        const prefix = kind === 'video' ? `${String(project.videos.length + 1).padStart(2, '0')}-` : `${kind}-`;
        const out = path.join(dir, 'inputs', prefix + name);
        const maxBytes = kind === 'video' ? 8 * 1024 * 1024 * 1024 : 1024 * 1024 * 1024;
        let bytes = 0;
        const limiter = new Transform({ transform(chunk, enc, cb) { bytes += chunk.length; if (bytes > maxBytes) cb(new Error('Upload exceeds size limit.')); else cb(null, chunk); } });
        try {
          try { await streamPipeline(req, limiter, createWriteStream(out, { flags: 'wx' })); } catch (error) { await fs.rm(out, { force: true }); throw error; }
          if (kind === 'video') project.videos.push(out); else project[`${kind}Path`] = out;
          await writeJson(projectPath, project);
          return json(res, 200, { ok: true, path: path.basename(out), bytes });
        } finally {
          endProjectMutation(activeMutations, id, mutation);
        }
      }

      if (req.method === 'POST' && parts[3] === 'run') {
        const mutation = beginProjectMutation(activeMutations, id, 'run');
        if (!mutation) return json(res, 409, { error: 'Project is busy' });
        const state = beginProjectJob(jobs, id, '요청 확인');
        if (!state) {
          endProjectMutation(activeMutations, id, mutation);
          return json(res, 409, { error: 'Project is already running' });
        }
        let payload;
        try {
          payload = await bodyJson(req);
          project.script = payload.script || '';
          project.settings = resolveSettings(payload.settings || {});
          await writeJson(projectPath, project);
        } catch (error) {
          abandonProjectJob(jobs, id, state);
          endProjectMutation(activeMutations, id, mutation);
          throw error;
        }
        state.status = '시작';
        state.updatedAt = new Date().toISOString();
        const setStatus = (status) => { state.status = status; state.logs.push({ at: new Date().toISOString(), message: status }); state.updatedAt = new Date().toISOString(); };
        runProject({
          projectDir: dir, videoPaths: project.videos, script: project.script,
          srtPath: project.srtPath, ttsPath: project.ttsPath,
          apiKey: payload.apiKey || process.env.OPENCODE_GO_API_KEY || '',
          settings: project.settings, onStatus: setStatus
        }).then((result) => {
          state.running = false; state.result = { qa: result.qa, apiUsage: result.apiUsage }; state.status = '완료'; state.updatedAt = new Date().toISOString();
          endProjectMutation(activeMutations, id, mutation);
        }).catch((error) => {
          state.running = false; state.error = error.stack || error.message; state.status = '실패'; state.updatedAt = new Date().toISOString();
          endProjectMutation(activeMutations, id, mutation);
        });
        return json(res, 202, { ok: true });
      }

      if (req.method === 'GET' && parts[3] === 'status') return json(res, 200, jobs.get(id) || { running: false, status: '대기', logs: [], result: null });
      if (req.method === 'GET' && parts[3] === 'edl') return json(res, 200, await readJson(path.join(dir, 'work', 'edl.json'), { clips: [] }));
      if (req.method === 'GET' && parts[3] === 'segments') return json(res, 200, await readJson(path.join(dir, 'work', 'segments.json'), []));
      if (req.method === 'POST' && parts[3] === 'replace') {
        const mutation = beginProjectMutation(activeMutations, id, 'replace');
        if (!mutation) return json(res, 409, { error: 'Project is busy' });
        const state = beginProjectJob(jobs, id, '컷 교체 요청 확인');
        if (!state) {
          endProjectMutation(activeMutations, id, mutation);
          return json(res, 409, { error: 'Project is already running' });
        }
        let payload;
        try {
          payload = await bodyJson(req);
        } catch (error) {
          abandonProjectJob(jobs, id, state);
          endProjectMutation(activeMutations, id, mutation);
          throw error;
        }
        state.status = '컷 교체 준비';
        state.updatedAt = new Date().toISOString();
        const setStatus = (status) => { state.status = status; state.logs.push({ at: new Date().toISOString(), message: status }); state.updatedAt = new Date().toISOString(); };
        replaceClipAndRerender({ projectDir: dir, project, beatId: payload.beatId, segmentId: payload.segmentId, onStatus: setStatus })
          .then((result) => {
            state.running = false; state.result = { qa: result.qa }; state.status = '완료'; state.updatedAt = new Date().toISOString();
            endProjectMutation(activeMutations, id, mutation);
          })
          .catch((error) => {
            state.running = false; state.error = error.stack || error.message; state.status = '실패'; state.updatedAt = new Date().toISOString();
            endProjectMutation(activeMutations, id, mutation);
          });
        return json(res, 202, { ok: true, apiCallsAdded: 0 });
      }
      if (req.method === 'GET' && parts[3] === 'qa') return json(res, 200, await readJson(path.join(dir, 'output', 'qa.json'), {}));
      if (req.method === 'GET' && parts[3] === 'video') return await sendFile(req, res, path.join(dir, 'output', 'shorts.mp4'), 'video/mp4');
    }

    json(res, 404, { error: 'Not found' });
  } catch (error) {
    json(res, 500, { error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`AI Shopping Shorts Editor: http://127.0.0.1:${PORT}`);
  console.log(`Workspace: ${WORKSPACE}`);
});
