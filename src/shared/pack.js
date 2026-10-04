// JSON → deflate → URL-safe base64, and back. Used by share links and progress codes (no server needed).
async function pipe(bytes, stream) {
  return new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(stream)).arrayBuffer());
}

const toBase64Url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const fromBase64Url = (text) => Uint8Array.from(atob(text.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

export async function pack(data) {
  return toBase64Url(await pipe(new TextEncoder().encode(JSON.stringify(data)), new CompressionStream("deflate-raw")));
}

// Throws on anything that is not a packed value; callers turn that into "this code is broken".
export async function unpack(text) {
  return JSON.parse(new TextDecoder().decode(await pipe(fromBase64Url(text), new DecompressionStream("deflate-raw"))));
}
