// Share codes: a Story Lab project packed into a URL hash, so iPads can swap work by QR code with no server.
// Payload: { v, task, authors, code } — authors is the credit chain, newest first, at most 3 generations.
export const SHARE_PREFIX = "#share=";
export const MAX_AUTHORS = 3;
export const MAX_NAME = 16;
// A QR code (byte mode, low error correction) holds about 2,900 characters; leave room for the page address.
export const QR_LIMIT = 2600;

export const cleanName = (name) => String(name ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_NAME);

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

async function pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}

const toBase64Url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromBase64Url = (text) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

export async function encodeShare({ task, authors, code }) {
  const json = JSON.stringify({ v: 1, task, authors: authors.slice(0, MAX_AUTHORS).map(cleanName), code: slim(code) });
  return toBase64Url(await pipe(new TextEncoder().encode(json), new CompressionStream("deflate-raw")));
}

// Returns null for anything that is not a valid share code, so a broken link never crashes the page.
export async function decodeShare(text) {
  try {
    const json = new TextDecoder().decode(await pipe(fromBase64Url(text), new DecompressionStream("deflate-raw")));
    const data = JSON.parse(json);
    if (data?.v !== 1 || typeof data.task !== "string" || !Array.isArray(data.code?.blocks?.blocks)) return null;
    const authors = Array.isArray(data.authors) ? data.authors.map(cleanName).filter(Boolean).slice(0, MAX_AUTHORS) : [];
    return { task: data.task, authors, code: data.code };
  } catch {
    return null;
  }
}

export const shareCodeFrom = (hash) => (hash.startsWith(SHARE_PREFIX) ? hash.slice(SHARE_PREFIX.length) : null);
