// Small Quest Lab UI helpers: failure messages and the in-page confirm dialog.
import { BLOCK_LABELS } from "./blocks.js";
import { t } from "./i18n.js";

const show = (value) => (Array.isArray(value) ? `[${value.join(", ")}]` : value);

export function describeFailure(evaluation, mission) {
  if (evaluation.reason === "require") {
    return t("require", { block: BLOCK_LABELS[evaluation.op](), n: evaluation.n });
  }
  if (evaluation.reason === "tooManyBlocks") return t("tooManyBlocks", { count: evaluation.blocks, max: mission.maxBlocks });
  const failed = evaluation.maps[evaluation.failedIndex];
  const multi = mission.maps.length > 1 && evaluation.failedIndex != null;
  const prefix = multi ? t("failedOnMap", { n: evaluation.failedIndex + 1 }) : "";
  return prefix + t(evaluation.reason, { n: mission.win?.exactGems, want: show(failed?.want), said: show(failed?.said) });
}

// In-page confirm: window.confirm() is silently suppressed in iframes and some tablet/classroom browsers.
export function askConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `<div class="confirm-box" role="alertdialog" aria-modal="true"><p></p><div class="confirm-actions"><button type="button" class="btn btn-soft" data-ok="0"></button><button type="button" class="btn btn-warm" data-ok="1"></button></div></div>`;
    overlay.querySelector("p").textContent = message;
    overlay.querySelector('[data-ok="0"]').textContent = t("cancel");
    overlay.querySelector('[data-ok="1"]').textContent = t("ok");
    const close = (ok) => {
      overlay.remove();
      resolve(ok);
    };
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close(false);
      const ok = event.target.closest("[data-ok]")?.dataset.ok;
      if (ok != null) close(ok === "1");
    });
    document.body.append(overlay);
    overlay.querySelector('[data-ok="1"]').focus();
  });
}
