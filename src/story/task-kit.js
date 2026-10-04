// Shared tools for Story Lab tasks: build starter/example code, and read a workspace to check goals live.
export const HATS = new Set(["story_start", "story_when_clicked", "story_when_receive"]);
export const MOTION = new Set(["story_move", "story_jump", "story_spin", "story_turn", "story_goto"]);
export const DEFAULT_WORDS = new Set(["Hello!", "你好！"]);

// ---- tiny builders for starter code and examples ----
export const chainOf = (list) => list.reduceRight((next, block) => (next ? { ...block, next: { block: next } } : block), null);
export const B = (type, fields = {}, body) => (body ? { type, fields, inputs: { DO: { block: chainOf(body) } } } : { type, fields });
export const script = (hat, ...body) => (body.length ? { ...hat, next: { block: chainOf(body) } } : hat);
export const state = (...scripts) => ({ blocks: { languageVersion: 0, blocks: scripts.map((s, i) => ({ ...s, x: 24, y: 24 + i * 200 })) } });
export const start = B("story_start");
export const clicked = (actor) => B("story_when_clicked", { ACTOR: actor });
export const say = (actor, text, seconds = 2) => B("story_say", { ACTOR: actor, TEXT: text, SECONDS: String(seconds) });
export const act = (type, actor, fields = {}) => B(type, { ACTOR: actor, ...fields });

// ---- reading a workspace ----
export function flatten(block, out = []) {
  while (block) {
    out.push(block);
    if (block.inputs?.DO?.block) flatten(block.inputs.DO.block, out);
    block = block.next?.block;
  }
  return out;
}

export function analyze(saved) {
  const tops = saved?.blocks?.blocks ?? [];
  return tops.filter((b) => HATS.has(b.type)).map((hat) => ({ type: hat.type, fields: hat.fields ?? {}, body: flatten(hat.next?.block) }));
}

export const field = (block, name, fallback) => block.fields?.[name] ?? fallback;
export const actorOf = (block) => field(block, "ACTOR", "cat");
export const scriptsOf = (scripts, type, test = () => true) => scripts.filter((s) => s.type === type && test(s));
export const bodyOf = (list) => list.flatMap((s) => s.body);
export const says = (block, actor) => block.type === "story_say" && (!actor || actorOf(block) === actor);
export const innerOf = (block) => flatten(block.inputs?.DO?.block);
export const startBody = (scripts) => bodyOf(scriptsOf(scripts, "story_start"));
export const clickBody = (scripts, actor) => bodyOf(scriptsOf(scripts, "story_when_clicked", (s) => actorOf(s) === actor));
export const goal = (en, zh, test) => ({ text: { en, zh }, test });

// Remixed projects (opened from a share code) get one extra goal: credit the original author on stage.
// ctx.remixOf is the credit chain, newest first.
export const CREDIT_GOAL = {
  ...goal("📝 Credit the author: a character says their name", "📝 標示原作者：讓角色說出原作者的名字",
    (s, ctx) => bodyOf(s).some((b) => (b.type === "story_say" || b.type === "story_think")
      && field(b, "TEXT", "").includes(ctx.remixOf[0]))),
  remixOnly: true,
};

export const goalsFor = (task, ctx = {}) => task.goals.filter((g) => !g.remixOnly || ctx.remixOf?.length);

export function checkGoals(task, saved, ctx = {}) {
  const scripts = analyze(saved);
  return goalsFor(task, ctx).map((g) => Boolean(g.test(scripts, ctx)));
}
