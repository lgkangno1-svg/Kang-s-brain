export const CUSTOMER_FIRST_PRECEDENCE = Object.freeze([
  'uploaded_ground_truth',
  'customer_confirmed_text',
  'customer_selected_options',
  'purchased_plan_contract',
  'safe_inference',
  'master_prompt_defaults',
  'internal_style_randomization',
]);

export function buildPromptContext(order, { route, selectedReferences = [], facts = {} } = {}) {
  const productFacts = { ...facts };

  if (order.specification) productFacts.specification = order.specification;
  else delete productFacts.specification;

  if (order.salePrice) productFacts.salePrice = order.salePrice;
  else delete productFacts.salePrice;

  return Object.freeze({
    route,
    precedence: CUSTOMER_FIRST_PRECEDENCE,
    product: Object.freeze({
      name: order.productName,
      category: order.category,
      description: order.productDescription,
      facts: Object.freeze(productFacts),
    }),
    customerDirection: Object.freeze({
      mainVisualStyle: order.mainVisualStyle,
      modelShotCount: order.modelShotCount,
      tone: order.tone,
      copyMood: order.copyMood,
      infoDensity: order.infoDensity,
      highlightPoints: order.highlightPoints,
      thumbnailStyle: order.thumbnailStyle,
      mustInclude: order.mustInclude,
      mustExclude: order.mustExclude,
    }),
    output: order.output,
    references: Object.freeze(selectedReferences),
    hardRules: Object.freeze([
      'Do not invent missing specification, price, origin, certification, test result, rating, sales count, health efficacy, or review data.',
      'If optional customer data is missing, omit that sales axis and replace it with a supported axis; never show [information required] in the final image.',
      'Uploaded real product material overrides generated product appearance.',
      'Customer-selected style overrides conflicting master-prompt defaults.',
      'All customer-visible output is a sales-conversion detail page; internal prompt route is never exposed.',
    ]),
  });
}
