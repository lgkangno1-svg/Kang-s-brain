import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const locales = ["en", "zh-CN", "ja", "zh-TW", "vi", "th"];

function flatten(value, prefix = "", output = new Map()) {
  if (typeof value === "string") {
    output.set(prefix, value);
    return output;
  }

  if (!value || Array.isArray(value) || typeof value !== "object") {
    throw new Error(`Invalid message value at ${prefix || "<root>"}`);
  }

  for (const [key, child] of Object.entries(value)) {
    flatten(child, prefix ? `${prefix}.${key}` : key, output);
  }
  return output;
}

const dictionaries = new Map();
for (const locale of locales) {
  const path = resolve(root, "messages", `${locale}.json`);
  const raw = await readFile(path, "utf8");
  dictionaries.set(locale, flatten(JSON.parse(raw)));
}

const reference = dictionaries.get("en");
const referenceKeys = new Set(reference.keys());
let failed = false;

for (const locale of locales) {
  const messages = dictionaries.get(locale);
  const keys = new Set(messages.keys());
  const missing = [...referenceKeys].filter((key) => !keys.has(key));
  const extra = [...keys].filter((key) => !referenceKeys.has(key));
  const blank = [...messages.entries()]
    .filter(([, value]) => value.trim().length === 0)
    .map(([key]) => key);

  if (missing.length || extra.length || blank.length) {
    failed = true;
    console.error(`\n[${locale}] message parity failed`);
    if (missing.length) console.error(`  missing: ${missing.join(", ")}`);
    if (extra.length) console.error(`  extra: ${extra.join(", ")}`);
    if (blank.length) console.error(`  blank: ${blank.join(", ")}`);
  }
}

if (failed) process.exit(1);
console.log(`Message parity OK: ${locales.length} locales, ${referenceKeys.size} leaf keys each.`);
