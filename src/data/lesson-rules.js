// Requirements name the skill being practised, not an exact reference solution.
export function lessonRequirements(level) {
  if (level.practice) return level.practice;
  if (["for", "nested_for", "advanced_for"].includes(level.stage)) return ["repeat_times"];
  if (["while", "while_advanced"].includes(level.stage)) return ["while_loop"];
  if (level.stage === "if") {
    return [level.blocks.includes("if_else_condition") ? "if_else_condition" : "if_condition"];
  }
  return [];
}

export function missingPractice(level, usedTypes = new Set()) {
  return lessonRequirements(level).filter((type) => !usedTypes.has(type));
}
