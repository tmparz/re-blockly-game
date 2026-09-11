import { runtime } from "./runtime.js";
import { t } from "./i18n.js";

export function nextProgramId() {
  runtime.programIdCounter += 1;
  return `p${runtime.programIdCounter}`;
}

export function cloneProgramItem(item) {
  return {
    id: item.id || nextProgramId(),
    type: item.type,
    times: item.times,
    condition: item.condition,
    children: (item.children || []).map(cloneProgramItem),
    elseChildren: (item.elseChildren || []).map(cloneProgramItem),
  };
}

export function childSequences(item) {
  return [item.children || [], item.elseChildren || []];
}

export function targetParts(id) {
  if (id !== "root" && id.endsWith(":else")) {
    return { itemId: id.slice(0, -5), branch: "else" };
  }
  return { itemId: id, branch: "then" };
}

export function countProgramBlocks(sequence = runtime.programStructure) {
  return sequence.reduce(
    (total, item) =>
      total + 1 + countProgramBlocks(item.children || []) + countProgramBlocks(item.elseChildren || []),
    0,
  );
}

export function findProgramItem(id, sequence = runtime.programStructure) {
  const { itemId } = targetParts(id);
  for (const item of sequence) {
    if (item.id === itemId) {
      return item;
    }
    for (const childSequence of childSequences(item)) {
      const child = findProgramItem(itemId, childSequence);
      if (child) {
        return child;
      }
    }
  }
  return null;
}

export function findProgramParentId(id, sequence = runtime.programStructure, parentId = "root") {
  const { itemId, branch } = targetParts(id);
  for (const item of sequence) {
    if (item.id === itemId) {
      return parentId;
    }
    const childParentId = findProgramParentId(itemId, item.children || [], item.id);
    if (childParentId) {
      return branch === "else" && childParentId === item.id ? `${item.id}:else` : childParentId;
    }
    const elseParentId = findProgramParentId(itemId, item.elseChildren || [], `${item.id}:else`);
    if (elseParentId) {
      return elseParentId;
    }
  }
  return null;
}

export function getTargetSequence() {
  if (runtime.selectedContainerId === "root") {
    return runtime.programStructure;
  }
  const { branch } = targetParts(runtime.selectedContainerId);
  const target = findProgramItem(runtime.selectedContainerId);
  if (!target) {
    runtime.selectedContainerId = "root";
    return runtime.programStructure;
  }
  if (target.type === "if_else_condition" && branch === "else") {
    target.elseChildren ||= [];
    return target.elseChildren;
  }
  if (!("children" in target)) {
    runtime.selectedContainerId = "root";
    return runtime.programStructure;
  }
  return target.children;
}

export function getTargetLabel() {
  if (runtime.selectedContainerId === "root") {
    return t("addToRoot");
  }
  const { branch } = targetParts(runtime.selectedContainerId);
  const target = findProgramItem(runtime.selectedContainerId);
  if (!target) {
    runtime.selectedContainerId = "root";
    return t("addToRoot");
  }
  if (target.type === "repeat_times") {
    return t("addToRepeat", { times: target.times || 1 });
  }
  if (target.type === "while_loop") {
    return t("addToWhile");
  }
  return branch === "else" ? t("addToElse") : t("addToIf");
}

export function removeProgramItem(id, sequence = runtime.programStructure) {
  const index = sequence.findIndex((item) => item.id === id);
  if (index >= 0) {
    sequence.splice(index, 1);
    return true;
  }
  return sequence.some(
    (item) => removeProgramItem(id, item.children || []) || removeProgramItem(id, item.elseChildren || []),
  );
}
