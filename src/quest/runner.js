// Plays a program on the board: ▶ Run animates every frame, ⏭ Step shows one frame per tap.
// Both share one session, so Step pauses a running animation and Run continues from the paused step.
import { t } from "./i18n.js";
import { startState } from "./trace.js";

export function createRunner({ workspace, board, trace, evaluateNow, mission, mapIndex, showMap, columns, finish, status, delay }) {
  let session = null;
  let token = 0;
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Forget the current run (another map, Reset, or the code changed).
  function cancel() {
    token += 1;
    session = null;
    trace.clear();
  }

  function begin() {
    const evaluation = evaluateNow();
    if (!evaluation.maps.length) {
      finish(evaluation, null);
      return false;
    }
    const index = evaluation.failedIndex ?? mapIndex();
    showMap(index); // redraws the board and cancels any older session
    session = { evaluation, index, frames: evaluation.maps[index].frames, cursor: 0 };
    trace.load(session.frames, startState(mission(), index), columns(mission(), index));
    return true;
  }

  function advance() {
    const frame = session.frames[session.cursor];
    session.cursor += 1;
    workspace.highlightBlock(frame.id ?? null);
    board.apply(frame);
    trace.show(session.cursor);
  }

  function end() {
    const { evaluation, index } = session;
    session = null; // the trace keeps its rows until the next run
    workspace.highlightBlock(null);
    finish(evaluation, index);
  }

  async function run() {
    if (!session && !begin()) return;
    const mine = ++token;
    status(t("running"));
    while (session.cursor < session.frames.length) {
      advance();
      await sleep(delay());
      if (mine !== token) return; // paused by Step, or cancelled
    }
    end();
  }

  function step() {
    token += 1; // pauses a running animation
    if (!session && !begin()) return;
    if (session.cursor < session.frames.length) advance();
    if (session.cursor >= session.frames.length) {
      end();
      return;
    }
    const depth = trace.hasDepth() ? ` · ${t("depthNow", { n: trace.row(session.cursor).depth })}` : "";
    status(`${t("stepInfo", { n: session.cursor, total: session.frames.length, action: trace.action(session.cursor) })}${depth}`);
  }

  return { run, step, cancel };
}
