// 🔮 The answer buttons shown in place of the quick-add chips while a predict mission is open.
import { choiceText, choicesOf } from "./predict.js";
import { t } from "./i18n.js";

export function createPredictUI({ bar, quick }) {
  const state = { mission: null, choice: null, missed: false };

  function render() {
    bar.replaceChildren();
    const question = document.createElement("p");
    question.className = "predict-question";
    question.textContent = t(state.mission.ask.type === "cell" ? "askCell" : "askSay");
    const row = document.createElement("div");
    row.className = "predict-choices";
    row.setAttribute("role", "group");
    choicesOf(state.mission).forEach((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "predict-choice";
      button.textContent = choiceText(choice);
      button.setAttribute("aria-pressed", String(state.choice !== null && choiceText(choice) === choiceText(state.choice)));
      button.addEventListener("click", () => {
        state.choice = choice;
        render();
      });
      row.append(button);
    });
    bar.append(question, row);
  }

  return {
    // A new mission starts fresh; Start over keeps the miss so a second try earns ⭐⭐.
    show(mission) {
      if (state.mission !== mission) state.missed = false;
      Object.assign(state, { mission, choice: null });
      bar.hidden = false;
      quick.hidden = true;
      render();
    },
    hide() {
      state.mission = null;
      bar.hidden = true;
      quick.hidden = false;
    },
    reveal(choice) {
      Object.assign(state, { choice, missed: true });
      render();
    },
    markMiss() { state.missed = true; },
    get choice() { return state.choice; },
    get missed() { return state.missed; },
  };
}
