// QR codes for share links and progress codes. The library is only fetched the first time it is needed;
// without it (offline) callers still show the link or code as text.
const QR_SCRIPT = "https://unpkg.com/qrcode-generator@1.4.4/qrcode.js";
// A QR code (byte mode, low error correction) holds about 2,900 characters; leave room for the page address.
export const QR_LIMIT = 2600;

let qrReady = null;
export function loadQr() {
  qrReady ??= new Promise((resolve) => {
    if (typeof qrcode !== "undefined") return resolve(true);
    const tag = Object.assign(document.createElement("script"), { src: QR_SCRIPT });
    tag.onload = () => resolve(true);
    tag.onerror = () => { qrReady = null; resolve(false); };
    document.head.append(tag);
  });
  return qrReady;
}

// A data: URL image of the QR code, or null when it is too long or the library is missing.
export async function qrImage(text) {
  if (text.length > QR_LIMIT || !(await loadQr())) return null;
  try {
    const qr = qrcode(0, "L");
    qr.addData(text);
    qr.make();
    return qr.createDataURL(6, 4);
  } catch {
    return null;
  }
}
