import { parseSummary } from './parser.js';
import { rules, findRule, renderRules } from './rules.js';

export let parsedEvents = [];

export function showSection(id) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  if (id === "paste") document.getElementById("pasteSection").style.display = "block";
  if (id === "timesheet") document.getElementById("timesheetSection").style.display = "block";
  if (id === "rules") {
    document.getElementById("rulesSection").style.display = "block";
    renderRules();
  }
}

export function handleParse() {
  const text = document.getElementById("summary").value;
  parsedEvents = parseSummary(text, rules);
  renderCategorization();
}

export function renderCategorization() {
  const section = document.getElementById("categorization");
  section.classList.remove("hidden");
  const table = document.getElementById("eventsTable");
  table.innerHTML = "<tr><th>Date</th><th>Title</th><th>Duration</th><th>Category</th><th>Project</th><th>Task</th></tr>";

  parsedEvents.forEach((evt, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${evt.date}</td>
      <td>${evt.title}</td>
      <td>${evt.duration}h</td>
      <td><input class="text-black" value="${evt.category}" onchange="updateEvent(${idx}, 'category', this.value)"></td>
      <td><input class="text-black" value="${evt.project}" onchange="updateEvent(${idx}, 'project', this.value)"></td>
      <td><input class="text-black" value="${evt.task}" onchange="updateEvent(${idx}, 'task', this.value)"></td>
    `;
    table.appendChild(row);
  });
}

export function updateEvent(i, field, value) {
  parsedEvents[i][field] = value;
}

export function generateTimesheet() {
  // Save new rules for unmapped titles
  parsedEvents.forEach(evt => {
    if (!findRule(evt.title)) {
      rules.push({ pattern: evt.title, category: evt.category, project: evt.project, task: evt.task });
    }
  });
  localStorage.setItem("rules", JSON.stringify(rules));

  const section = document.getElementById("timesheetSection");
  section.classList.remove("hidden");
  const div = document.getElementById("timesheet");

  // Build simple summary table
  let html = "<table><tr><th>Task</th><th>Date</th><th>Duration</th></tr>";
  parsedEvents.forEach(evt => {
    html += `<tr><td>${evt.task}</td><td>${evt.date}</td><td>${evt.duration}h</td></tr>`;
  });
  html += "</table>";
  div.innerHTML = html;
}

export function exportCSV() {
  const header = ["Date","Title","Duration","Category","Project","Task"];
  const rows = parsedEvents.map(e => [e.date, e.title, e.duration, e.category, e.project, e.task]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "timesheet.csv";
  a.click();
}

export default { showSection, handleParse, renderCategorization, updateEvent, generateTimesheet, exportCSV };
