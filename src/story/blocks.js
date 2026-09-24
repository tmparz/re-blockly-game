// Story Lab blocks, grouped the way the tap-to-add bar shows them.
import { ACTORS, ACTOR_IDS, FEELINGS, MESSAGES } from "./actors.js";
import { SCENE_IDS, SCENE_NAMES } from "./scenes.js";
import { SOUND_IDS } from "./sound.js";
import { L, pick, t } from "./i18n.js";

export const HUES = { events: 45, motion: 210, looks: 270, sound: 320, control: 30, score: 0 };

const actorOptions = () => ACTOR_IDS.map((id) => [`${ACTORS[id].emoji} ${pick(ACTORS[id].name)}`, id]);
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => [String(from + i), String(from + i)]);
const actor = { type: "field_dropdown", name: "ACTOR", options: actorOptions() };
const dropdown = (name, options) => ({ type: "field_dropdown", name, options });
const MESSAGE_LABELS = { go: ["🚀 go", "🚀 出發"], party: ["🎉 party", "🎉 派對"], theEnd: ["🎬 the end", "🎬 結束"] };
const messageOptions = () => MESSAGES.map((id) => [L(...MESSAGE_LABELS[id]), id]);
const SOUND_LABELS = { pop: ["pop", "啵"], boing: ["boing", "彈簧"], drum: ["drum", "鼓聲"], magic: ["magic", "魔法"], cheer: ["cheer", "歡呼"] };

const hat = (type, message0, args0 = []) => ({ type, message0, args0, nextStatement: null, colour: HUES.events });
const step = (type, message0, args0, hue) => ({ type, message0, args0, previousStatement: null, nextStatement: null, colour: hue });
const box = (type, message0, args0, hue, extra = {}) => ({
  ...step(type, message0, args0, hue),
  message1: "%1", args1: [{ type: "input_statement", name: "DO" }], ...extra,
});

export function defineStoryBlocks() {
  Blockly.defineBlocksWithJsonArray([
    hat("story_start", L("🎬 when Run", "🎬 按下執行時")),
    hat("story_when_clicked", L("👆 when %1 is clicked", "👆 當 %1 被點擊"), [actor]),
    hat("story_when_receive", L("📩 when I receive %1", "📩 當收到 %1"), [dropdown("MSG", messageOptions())]),
    step("story_broadcast", L("📣 send %1", "📣 廣播 %1"), [dropdown("MSG", messageOptions())], HUES.events),

    step("story_move", L("%1 walk %2 %3 steps", "%1 往 %2 走 %3 步"),
      [actor, dropdown("DIR", [[L("right ➡️", "右 ➡️"), "right"], [L("left ⬅️", "左 ⬅️"), "left"]]), dropdown("DIST", range(1, 5))], HUES.motion),
    step("story_goto", L("%1 go to %2", "%1 移到 %2"), [actor, dropdown("SPOT", [
      [L("left side", "左邊"), "left"], [L("middle", "中間"), "middle"], [L("right side", "右邊"), "right"], [L("🎲 random spot", "🎲 隨機位置"), "random"]])], HUES.motion),
    step("story_jump", L("%1 jump", "%1 跳一下"), [actor], HUES.motion),
    step("story_spin", L("%1 spin", "%1 轉一圈"), [actor], HUES.motion),
    step("story_turn", L("%1 turn around", "%1 向後轉"), [actor], HUES.motion),

    step("story_say", L("%1 say %2 for %3 sec", "%1 說 %2 %3 秒"),
      [actor, { type: "field_input", name: "TEXT", text: t("say_default") }, dropdown("SECONDS", range(1, 4))], HUES.looks),
    step("story_think", L("%1 think %2 for %3 sec", "%1 想 %2 %3 秒"),
      [actor, { type: "field_input", name: "TEXT", text: t("think_default") }, dropdown("SECONDS", range(1, 4))], HUES.looks),
    step("story_feel", L("%1 feel %2", "%1 心情 %2"), [actor, dropdown("FEEL", [
      [L("😊 happy", "😊 開心"), "happy"], [L("😢 sad", "😢 難過"), "sad"], [L("😮 surprised", "😮 驚訝"), "surprised"],
      [L("😠 angry", "😠 生氣"), "angry"], [L("😴 sleepy", "😴 想睡"), "sleepy"], [L("😍 in love", "😍 超喜歡"), "love"],
      [L("(no feeling)", "（沒有）"), "none"]])], HUES.looks),
    step("story_size", L("%1 %2", "%1 %2"), [actor, dropdown("SIZE", [
      [L("grow big", "變大"), "big"], [L("shrink small", "變小"), "small"], [L("normal size", "恢復大小"), "normal"]])], HUES.looks),
    step("story_visibility", L("%1 %2", "%1 %2"), [actor, dropdown("ACTION", [[L("show", "出現"), "show"], [L("hide", "消失"), "hide"]])], HUES.looks),
    step("story_background", L("🖼 switch scene to %1", "🖼 換場景到 %1"),
      [dropdown("SCENE", SCENE_IDS.map((id) => [pick(SCENE_NAMES[id]), id]))], HUES.looks),

    step("story_sound", L("🔊 play %1", "🔊 播放 %1"), [dropdown("SOUND", SOUND_IDS.map((id) => [L(...SOUND_LABELS[id]), id]))], HUES.sound),

    step("story_wait", L("⏱ wait %1 sec", "⏱ 等待 %1 秒"), [dropdown("SECONDS", [["0.5", "0.5"], ...range(1, 4)])], HUES.control),
    box("story_repeat", L("🔁 repeat %1 times", "🔁 重複 %1 次"), [dropdown("TIMES", range(2, 10))], HUES.control),
    box("story_forever", L("♾️ forever", "♾️ 一直重複"), [], HUES.control, { nextStatement: undefined }),

    step("story_set_score", L("⭐ set score to %1", "⭐ 分數設為 %1"), [dropdown("N", range(0, 10))], HUES.score),
    step("story_change_score", L("⭐ change score by %1", "⭐ 分數改變 %1"), [dropdown("N", [["+1", "1"], ["+2", "2"], ["-1", "-1"]])], HUES.score),
    box("story_if_score", L("⭐ if score = %1", "⭐ 如果分數 = %1"), [dropdown("N", range(1, 10))], HUES.score),
    step("story_say_score", L("%1 say the score", "%1 說出分數"), [actor], HUES.score),
  ]);
}

const CATEGORY_BLOCKS = {
  events: [["story_start", "🎬", "when Run", "按下執行時", true], ["story_when_clicked", "👆", "when clicked", "當被點擊"],
    ["story_broadcast", "📣", "send", "廣播"], ["story_when_receive", "📩", "when I receive", "當收到"]],
  motion: [["story_move", "🚶", "walk", "走"], ["story_jump", "⤴️", "jump", "跳"], ["story_spin", "🌀", "spin", "轉圈"],
    ["story_turn", "↩️", "turn around", "向後轉"], ["story_goto", "📍", "go to", "移到"]],
  looks: [["story_say", "💬", "say", "說"], ["story_think", "💭", "think", "想"], ["story_feel", "😊", "feel", "心情"],
    ["story_size", "🔍", "size", "大小"], ["story_visibility", "👀", "show / hide", "出現／消失"], ["story_background", "🖼", "scene", "場景"]],
  sound: [["story_sound", "🔊", "play sound", "播放聲音"]],
  control: [["story_wait", "⏱", "wait", "等待"], ["story_repeat", "🔁", "repeat", "重複"], ["story_forever", "♾️", "forever", "一直重複"]],
  score: [["story_set_score", "⭐", "set score", "設定分數"], ["story_change_score", "⭐", "change score", "改變分數"],
    ["story_if_score", "⭐", "if score =", "如果分數 ="], ["story_say_score", "💬", "say score", "說出分數"]],
};

export const CATEGORIES = Object.keys(CATEGORY_BLOCKS);

export function chipsFor(category) {
  const colour = Blockly.utils.colour.hueToHex(HUES[category]);
  return CATEGORY_BLOCKS[category].map(([type, icon, en, zh, unique]) => ({
    type, label: `${icon} ${L(en, zh)}`, colour, unique: Boolean(unique),
  }));
}
