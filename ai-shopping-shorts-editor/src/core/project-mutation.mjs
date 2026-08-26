export function beginProjectMutation(activeMutations, id, kind) {
  if (activeMutations.has(id)) return null;

  const token = {
    kind,
    startedAt: new Date().toISOString()
  };
  activeMutations.set(id, token);
  return token;
}

export function endProjectMutation(activeMutations, id, token) {
  if (activeMutations.get(id) === token) activeMutations.delete(id);
}
