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

export async function beginProjectMutationWithFreshSnapshot(activeMutations, id, kind, readProject) {
  const token = beginProjectMutation(activeMutations, id, kind);
  if (!token) return null;

  try {
    const project = await readProject();
    return { token, project };
  } catch (error) {
    endProjectMutation(activeMutations, id, token);
    throw error;
  }
}
