export function beginProjectJob(jobs, id, status) {
  if (jobs.get(id)?.running) return null;

  const state = {
    running: true,
    status,
    logs: [],
    error: null,
    result: null,
    updatedAt: new Date().toISOString()
  };
  jobs.set(id, state);
  return state;
}

export function abandonProjectJob(jobs, id, state) {
  if (jobs.get(id) === state) jobs.delete(id);
}
