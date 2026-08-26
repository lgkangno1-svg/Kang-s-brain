import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const source = await readFile(resolve(root, "src", "features", "quick-help", "data.ts"), "utf8");
const messages = JSON.parse(await readFile(resolve(root, "messages", "en.json"), "utf8"));

function hasPath(object, path) {
  return path.split(".").reduce((value, segment) => {
    if (!value || typeof value !== "object") return undefined;
    return value[segment];
  }, object) !== undefined;
}

const keyPattern = /(?:titleKey|answerKey|labelKey):\s*["']([^"']+)["']/g;
const referencedKeys = new Set([...source.matchAll(keyPattern)].map((match) => match[1]));
const missing = [...referencedKeys].filter((key) => !hasPath(messages.QuickHelp, key));

if (!referencedKeys.size) {
  console.error("Quick Help key check failed: no message-key references were found in data.ts");
  process.exit(1);
}

if (missing.length) {
  console.error("Quick Help key check failed. Missing English message keys:");
  for (const key of missing) console.error(`  - QuickHelp.${key}`);
  process.exit(1);
}

console.log(`Quick Help key check OK: ${referencedKeys.size} referenced keys exist in the English schema.`);
