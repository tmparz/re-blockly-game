// The student's name or seat number, typed once and shared by Story Lab sharing and progress codes.
const NAME_KEY = "blocky-story-name";
export const MAX_NAME = 16;
export const SEATS = 35;

export const cleanName = (name) => String(name ?? "").replace(/\s+/g, " ").trim().slice(0, MAX_NAME);
export const loadName = () => { try { return localStorage.getItem(NAME_KEY) ?? ""; } catch { return ""; } };
export const saveName = (name) => { try { localStorage.setItem(NAME_KEY, name); } catch { /* storage blocked */ } };

// Fills a <select> with "Seat no." plus seats 1–35; picking one copies it into the name box.
export function fillSeats(select, input, t) {
  select.innerHTML = "";
  select.append(new Option(t("shareSeat"), ""));
  for (let n = 1; n <= SEATS; n += 1) select.append(new Option(t("seatNo", { n }), t("seatNo", { n })));
  select.onchange = () => { if (select.value) input.value = select.value; };
}
