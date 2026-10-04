// Story Lab sharing: the 📤 dialog (name → QR code + link) and opening a shared link as a remix.
import { QR_LIMIT, SHARE_PREFIX, creditChain, decodeShare, encodeShare, shareCodeFrom } from "./share.js";
import { MAX_NAME, cleanName, fillSeats, loadName, saveName } from "../shared/student.js";
import { qrImage } from "../shared/qr.js";

const $ = (selector) => document.querySelector(selector);

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
    const image = await qrImage(url);
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
    fillSeats(seat, nameInput, t);
    nameInput.maxLength = MAX_NAME;
    nameInput.value = loadName();
    $("#shareResult").hidden = true;
    $("#shareNote").textContent = "";
    dialog.showModal();
  }

  $("#shareButton").addEventListener("click", open);
  $("#shareMake").addEventListener("click", make);
  $("#shareCopy").addEventListener("click", copy);
  return { open };
}

// Reads a #share=… link once, then removes it from the address bar so a refresh does not re-open it.
export async function takeSharedLink() {
  const code = shareCodeFrom(location.hash);
  if (code === null) return null;
  history.replaceState(null, "", location.pathname + location.search);
  return (await decodeShare(code)) ?? { broken: true };
}
