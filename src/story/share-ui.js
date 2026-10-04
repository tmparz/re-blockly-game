// Story Lab sharing: the 📤 dialog (name → QR code + link) and opening a shared link as a remix.
import { MAX_NAME, QR_LIMIT, SHARE_PREFIX, cleanName, creditChain, decodeShare, encodeShare, shareCodeFrom } from "./share.js";

const NAME_KEY = "blocky-story-name";
const QR_SCRIPT = "https://unpkg.com/qrcode-generator@1.4.4/qrcode.js";
const SEATS = 35;
const $ = (selector) => document.querySelector(selector);

const loadName = () => { try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; } };
const saveName = (name) => { try { localStorage.setItem(NAME_KEY, name); } catch { /* storage blocked */ } };

// The QR library is only fetched the first time someone shares; without it the link still works.
let qrReady = null;
function loadQr() {
  qrReady ??= new Promise((resolve) => {
    if (typeof qrcode !== "undefined") return resolve(true);
    const tag = Object.assign(document.createElement("script"), { src: QR_SCRIPT });
    tag.onload = () => resolve(true);
    tag.onerror = () => { qrReady = null; resolve(false); };
    document.head.append(tag);
  });
  return qrReady;
}

function drawQr(url) {
  try {
    const qr = qrcode(0, "L");
    qr.addData(url);
    qr.make();
    return qr.createDataURL(6, 4);
  } catch {
    return null; // too long for one QR code
  }
}

// "🔁 Remixed from A's project · before that: B, C"
export function remixLine(chain, t) {
  if (!chain?.length) return "";
  const earlier = chain.length > 1 ? ` · ${t("remixEarlier", { names: chain.slice(1).join("、") })}` : "";
  return `🔁 ${t("remixOf", { name: chain[0] })}${earlier}`;
}

export function createShareUI({ t, current }) {
  const dialog = $("#shareDialog");
  const nameInput = $("#shareName");
  const seat = $("#shareSeat");

  function fillSeats() {
    seat.innerHTML = "";
    seat.append(new Option(t("shareSeat"), ""));
    for (let n = 1; n <= SEATS; n += 1) seat.append(new Option(t("seatNo", { n }), t("seatNo", { n })));
  }

  async function make() {
    const name = cleanName(nameInput.value);
    if (!name) {
      $("#shareNote").textContent = t("shareNeedName");
      nameInput.focus();
      return;
    }
    saveName(name);
    const { task, code, remixOf } = current();
    const packed = await encodeShare({ task, code, authors: creditChain(name, remixOf) });
    const url = `${location.origin}${location.pathname}${SHARE_PREFIX}${packed}`;
    $("#shareLink").value = url;
    $("#shareResult").hidden = false;
    const image = url.length <= QR_LIMIT && (await loadQr()) ? drawQr(url) : null;
    $("#shareQr").hidden = !image;
    if (image) $("#shareQr").src = image;
    $("#shareNote").textContent = image ? t("shareScan") : t(url.length > QR_LIMIT ? "shareTooLong" : "shareNoQr");
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText($("#shareLink").value);
    } catch {
      $("#shareLink").select();
      document.execCommand?.("copy");
    }
    $("#shareNote").textContent = t("shareCopied");
  }

  function open() {
    fillSeats();
    nameInput.maxLength = MAX_NAME;
    nameInput.value = loadName();
    $("#shareResult").hidden = true;
    $("#shareNote").textContent = "";
    dialog.showModal();
  }

  $("#shareButton").addEventListener("click", open);
  $("#shareMake").addEventListener("click", make);
  $("#shareCopy").addEventListener("click", copy);
  seat.addEventListener("change", () => { if (seat.value) nameInput.value = seat.value; });
  return { open };
}

// Reads a #share=… link once, then removes it from the address bar so a refresh does not re-open it.
export async function takeSharedLink() {
  const code = shareCodeFrom(location.hash);
  if (code === null) return null;
  history.replaceState(null, "", location.pathname + location.search);
  return (await decodeShare(code)) ?? { broken: true };
}
