// Runs Story Lab scripts. Several scripts can run at once (like Scratch): "when Run", clicks and messages.
import { play } from "./sound.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const STEP_LIMIT = 400;

export function createRuntime({ workspace, stage, onStatus }) {
  let generation = 0;
  const running = new Map();

  const hats = (type, field, value) => workspace.getTopBlocks(true)
    .filter((block) => block.type === type && block.isEnabled() && (!field || block.getFieldValue(field) === value));

  async function chain(block, ctx) {
    while (block && ctx.gen === generation) {
      ctx.steps += 1;
      if (ctx.steps > STEP_LIMIT) {
        onStatus("stepLimit");
        return;
      }
      if (block.isEnabled()) await exec(block, ctx);
      block = block.getNextBlock();
    }
  }

  async function exec(block, ctx) {
    const f = (name) => block.getFieldValue(name);
    const inner = () => block.getInputTargetBlock("DO");
    switch (block.type) {
      case "story_say": return stage.say(f("ACTOR"), f("TEXT"), Number(f("SECONDS")));
      case "story_think": return stage.say(f("ACTOR"), f("TEXT"), Number(f("SECONDS")), "think");
      case "story_move": return stage.move(f("ACTOR"), f("DIR"), Number(f("DIST")));
      case "story_goto": return stage.goto(f("ACTOR"), f("SPOT"));
      case "story_jump": return stage.jump(f("ACTOR"));
      case "story_spin": return stage.spin(f("ACTOR"));
      case "story_turn": return stage.turn(f("ACTOR"));
      case "story_feel": return stage.feel(f("ACTOR"), f("FEEL"));
      case "story_size": return stage.size(f("ACTOR"), f("SIZE"));
      case "story_visibility": return stage.visible(f("ACTOR"), f("ACTION") === "show");
      case "story_background": return stage.setScene(f("SCENE"));
      case "story_sound":
        play(f("SOUND"));
        return sleep(250);
      case "story_wait": return sleep(Number(f("SECONDS")) * 1000);
      case "story_broadcast":
        hats("story_when_receive", "MSG", f("MSG")).forEach(start);
        return sleep(50);
      case "story_repeat":
        for (let i = 0; i < Number(f("TIMES")) && ctx.gen === generation; i += 1) await chain(inner(), ctx);
        return undefined;
      case "story_forever":
        while (ctx.gen === generation) {
          await chain(inner(), { ...ctx, steps: 0 });
          await sleep(60);
        }
        return undefined;
      case "story_set_score": return stage.setScore(Number(f("N")));
      case "story_change_score": return stage.changeScore(Number(f("N")));
      case "story_if_score":
        if (stage.score === Number(f("N"))) await chain(inner(), ctx);
        return undefined;
      case "story_say_score": return stage.say(f("ACTOR"), String(stage.score), 2);
      default: return undefined;
    }
  }

  // Tapping a character again while its click script is still running is ignored (no pile-ups).
  function start(hat) {
    const ctx = { gen: generation, steps: 0 };
    running.set(hat.id, ctx);
    return chain(hat.getNextBlock(), ctx).finally(() => {
      if (running.get(hat.id) === ctx) running.delete(hat.id);
    });
  }

  return {
    get busy() { return running.size > 0; },
    async run() {
      generation += 1;
      running.clear();
      stage.reset();
      const scripts = hats("story_start");
      if (!scripts.length) return false;
      await Promise.all(scripts.map(start));
      return true;
    },
    click(actorId) {
      const all = hats("story_when_clicked", "ACTOR", actorId);
      const idle = all.filter((hat) => !running.has(hat.id));
      return { found: all.length > 0, finished: Promise.all(idle.map(start)) };
    },
    stop() {
      generation += 1;
      running.clear();
      stage.hideBubbles();
    },
  };
}
