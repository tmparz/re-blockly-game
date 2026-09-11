export function parseXml(text) {
  if (window.Blockly?.utils?.xml?.textToDom) {
    return Blockly.utils.xml.textToDom(text);
  }
  return Blockly.Xml.textToDom(text);
}

export function safeText(text) {
  return String(text).replace(/[&<>"']/g, (char) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return replacements[char];
  });
}
