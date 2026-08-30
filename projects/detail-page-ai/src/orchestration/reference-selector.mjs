const ROLE_BONUS = Object.freeze({
  product_full: 0.22,
  product_closeup: 0.20,
  cross_section: 0.20,
  packaging: 0.16,
  delivery: 0.12,
  farm: 0.10,
  proof_document: 0.18,
  review_capture: 0.14,
  design_reference: 0.05,
  unknown: 0,
});

function scoreReference(file) {
  const quality = Number(file.qualityScore ?? 0);
  const identity = Number(file.productIdentityScore ?? 0);
  const usefulness = Number(file.usefulnessScore ?? 0);
  const roleBonus = ROLE_BONUS[file.role] ?? 0;
  return quality * 0.35 + identity * 0.35 + usefulness * 0.30 + roleBonus;
}

/**
 * Selects a small diverse set of references. Similar images can share duplicateGroupId.
 */
export function selectReferences(files, maxCount) {
  const eligible = (files ?? [])
    .filter((file) => file && file.usable !== false)
    .map((file) => ({ ...file, _score: scoreReference(file) }))
    .sort((a, b) => b._score - a._score);

  const selected = [];
  const duplicateGroups = new Set();
  const selectedRoles = new Set();

  for (const file of eligible) {
    if (selected.length >= maxCount) break;
    if (file.duplicateGroupId && duplicateGroups.has(file.duplicateGroupId)) continue;
    if (selectedRoles.has(file.role)) continue;
    selected.push(file);
    if (file.duplicateGroupId) duplicateGroups.add(file.duplicateGroupId);
    selectedRoles.add(file.role);
  }

  for (const file of eligible) {
    if (selected.length >= maxCount) break;
    if (selected.some((picked) => picked.id === file.id)) continue;
    if (file.duplicateGroupId && duplicateGroups.has(file.duplicateGroupId)) continue;
    selected.push(file);
    if (file.duplicateGroupId) duplicateGroups.add(file.duplicateGroupId);
  }

  return selected.map(({ _score, ...file }) => file);
}
