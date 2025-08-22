export function initNavigation() {
  const tabs = [
    { btn: "#tab-paste", sec: "#pasteSection" },
    { btn: "#tab-timesheet", sec: "#timesheetSection" },
    { btn: "#tab-rules", sec: "#rulesSection" },
  ];
  const set = (active) => {
    tabs.forEach(({ btn, sec }) => {
      const b = document.querySelector(btn),
        s = document.querySelector(sec);
      const on = active === sec;
      b.setAttribute("aria-selected", on ? "true" : "false");
      s.classList.toggle("hidden", !on);
    });
  };
  tabs.forEach(({ btn, sec }) => {
    document.querySelector(btn).addEventListener("click", () => set(sec));
  });
  set("#pasteSection");
}
