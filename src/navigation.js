export function initNavigation() {
  const tabs = [
    { btn: "#tab-paste", sec: "#pasteSection" },
    { btn: "#tab-timesheet", sec: "#timesheetSection" },
    { btn: "#tab-rules", sec: "#rulesSection" },
  ];
  const categorization = document.querySelector("#categorization");
  const eventsTable = document.querySelector("#eventsTable");

  const set = (active) => {
    tabs.forEach(({ btn, sec }) => {
      const b = document.querySelector(btn),
        s = document.querySelector(sec);
      const on = active === sec;
      b.setAttribute("aria-selected", on ? "true" : "false");
      s.classList.toggle("hidden", !on);
    });

    if (active !== "#pasteSection") {
      categorization.classList.add("hidden");
      eventsTable.innerHTML = "";
    } else if (eventsTable.rows.length > 0) {
      categorization.classList.remove("hidden");
    }
  };
  tabs.forEach(({ btn, sec }) => {
    document.querySelector(btn).addEventListener("click", () => set(sec));
  });
  set("#pasteSection");
}
