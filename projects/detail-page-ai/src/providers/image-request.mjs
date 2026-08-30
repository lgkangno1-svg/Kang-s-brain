/**
 * Provider-neutral request contract. Production adapter will target OpenAI GPT-Image-2.
 * API keys and proprietary master prompt bodies must stay server-side and out of this public repository.
 */
export function createImageRequest({ order, page, prompt, references = [] }) {
  if (!prompt?.trim()) throw new Error('prompt is required');
  return Object.freeze({
    provider: 'openai',
    model: 'gpt-image-2',
    quality: order.output.imageQuality,
    prompt: prompt.trim(),
    page,
    referenceIds: references.map((reference) => reference.id),
    retryLimit: order.output.maxRetriesPerFailedAsset,
  });
}
