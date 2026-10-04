// Share codes: a Story Lab project packed into a URL hash, so iPads can swap work by QR code with no server.
// Payload: { v, task, authors, code } — authors is the credit chain, newest first, at most 3 generations.
import { pack, unpack } from "../shared/pack.js";
import { cleanName } from "../shared/student.js";

export { cleanName, MAX_NAME } from "../shared/student.js";
export { QR_LIMIT } from "../shared/qr.js";
export const SHARE_PREFIX = "#share=";
export const MAX_AUTHORS = 3;

// The next credit chain: the sharer goes first, then whoever they remixed. Re-sharing your own work adds nothing new.
export function creditChain(name, remixOf = []) {
  const me = cleanName(name);
  const earlier = remixOf.map(cleanName).filter(Boolean);
  const chain = me && me !== earlier[0] ? [me, ...earlier] : earlier;
  return chain.slice(0, MAX_AUTHORS);
}

// Blockly makes new ids on load and only needs rough positions, so drop ids and round x/y to keep links short.
export function slim(value) {
  if (Array.isArray(value)) return value.map(slim);
  if (!value || typeof value !== "object") return value;
  const out = {};
  for (const [key, item] of Object.entries(value)) {
    if (key === "id") continue;
    out[key] = (key === "x" || key === "y") && typeof item === "number" ? Math.round(item) : slim(item);
  }
  return out;
}

export async function encodeShare({ task, authors, code }) {
  return pack({ v: 1, task, authors: authors.slice(0, MAX_AUTHORS).map(cleanName), code: slim(code) });
}

// Returns null for anything that is not a valid share code, so a broken link never crashes the page.
export async function decodeShare(text) {
  try {
    const data = await unpack(text);
    if (data?.v !== 1 || typeof data.task !== "string" || !Array.isArray(data.code?.blocks?.blocks)) return null;
    const authors = Array.isArray(data.authors) ? data.authors.map(cleanName).filter(Boolean).slice(0, MAX_AUTHORS) : [];
    return { task: data.task, authors, code: data.code };
  } catch {
    return null;
  }
}

export const shareCodeFrom = (hash) => (hash.startsWith(SHARE_PREFIX) ? hash.slice(SHARE_PREFIX.length) : null);
