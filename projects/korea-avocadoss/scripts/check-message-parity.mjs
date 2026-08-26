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

function isMessageObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeMessages(...sources) {
  const output = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      const current = output[key];
      output[key] = isMessageObject(current) && isMessageObject(value)
        ? mergeMessages(current, value)
        : value;
    }
  }
  return output;
}

async function loadLocale(locale) {
  const core = JSON.parse(await readFile(resolve(root, "messages", `${locale}.json`), "utf8"));
  const publicCopy = JSON.parse(await readFile(resolve(root, "messages", "public", `${locale}.json`), "utf8"));
  const hanbok = JSON.parse(await readFile(resolve(root, "messages", "hanbok", `${locale}.json`), "utf8"));
  const credits = JSON.parse(await readFile(resolve(root, "messages", "credits", `${locale}.json`), "utf8"));
  return flatten(mergeMessages(core, publicCopy, hanbok, credits));
}

const dictionaries = new Map();
for (const locale of locales) dictionaries.set(locale, await loadLocale(locale));

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
