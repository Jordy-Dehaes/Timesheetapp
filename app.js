import './style.css';
import { parseSummary, findRule } from './parser.js';

console.log("app.js loaded");

let parsedEvents = [];
let rules = JSON.parse(localStorage.getItem("rules") || "[]");

function showSection(id, btn) {
  document.querySelectorAll("section").forEach(sec => sec.style.display = "none");
  if (id === "paste") document.getElementById("pasteSection").style.display = "block";
  if (id === "timesheet") document.getElementById("timesheetSection").style.display = "block";
  if (id === "rules") {
    document.getElementById("rulesSection").style.display = "block";
    renderRules();
  }

  document.querySelectorAll(".nav__button").forEach(button => {
    button.classList.remove("active");
    button.removeAttribute("aria-current");
  });
  if (btn) {
    btn.classList.add("active");
    btn.setAttribute("aria-current", "page");
  }
}
function handleParse() {
  console.log("Parse button clicked");
  const text = document.getElementById("summary").value;
  parsedEvents = parseSummary(text, rules);
  renderCategorization();

}

function renderCategorization() {
  const section = document.getElementById("categorization");
  section.style.display = "block";
  const table = document.getElementById("eventsTable");
  table.innerHTML = "<tr><th>Date</th><th>Title</th><th>Duration</th><th>Category</th><th>Project</th><th>Task</th></tr>";

  parsedEvents.forEach((evt, idx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${evt.date}</td>
      <td>${evt.title}</td>
      <td>${evt.duration}h</td>
      <td><input value="${evt.category}" onchange="updateEvent(${idx}, 'category', this.value)"></td>
      <td><input value="${evt.project}" onchange="updateEvent(${idx}, 'project', this.value)"></td>
      <td><input value="${evt.task}" onchange="updateEvent(${idx}, 'task', this.value)"></td>
    `;
    table.appendChild(row);
  });
}

function updateEvent(i, field, value) {
  parsedEvents[i][field] = value;
}

function generateTimesheet() {
  parsedEvents.forEach(evt => {
    if (!findRule(evt.title, rules)) {
      rules.push({ pattern: evt.title, category: evt.category, project: evt.project, task: evt.task });

    }
  });
  localStorage.setItem("rules", JSON.stringify(rules));

  const section = document.getElementById("timesheetSection");
  section.style.display = "block";
  const div = document.getElementById("timesheet");
  let html = "<table><tr><th>Task</th><th>Date</th><th>Duration</th></tr>";
  parsedEvents.forEach(evt => {
    html += `<tr><td>${evt.task}</td><td>${evt.date}</td><td>${evt.duration}h</td></tr>`;
  });
  html += "</table>";
  div.innerHTML = html;
}

function exportCSV() {
  const header = ["Date","Title","Duration","Category","Project","Task"];
  const rows = parsedEvents.map(e => [e.date, e.title, e.duration, e.category, e.project, e.task]);
  const csv = [header, ...rows].map(r => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "timesheet.csv";
  a.click();
}

function renderRules() {
  const table = document.getElementById("rulesTable");
  table.innerHTML = "<tr><th>Pattern</th><th>Category</th><th>Project</th><th>Task</th><th>Actions</th></tr>";

  rules.forEach((r, idx) => {
    const row = document.createElement("tr");
@@ -217,30 +90,39 @@ function renderRules() {
      <td><input value="${r.project}" onchange="updateRule(${idx}, 'project', this.value)"></td>
      <td><input value="${r.task}" onchange="updateRule(${idx}, 'task', this.value)"></td>
      <td><button onclick="deleteRule(${idx})">Delete</button></td>
    `;
    table.appendChild(row);
  });
}

function updateRule(i, field, value) {
  rules[i][field] = value;
  localStorage.setItem("rules", JSON.stringify(rules));
}

function deleteRule(i) {
  rules.splice(i, 1);
  localStorage.setItem("rules", JSON.stringify(rules));
  renderRules();
}

function addRule() {
  rules.push({ pattern: "", category: "", project: "", task: "" });
  localStorage.setItem("rules", JSON.stringify(rules));
  renderRules();
}

if (typeof window !== "undefined") {
  Object.assign(window, {
    showSection,
    handleParse,
    renderCategorization,
    updateEvent,
    generateTimesheet,
    exportCSV,
    renderRules,
    updateRule,
    deleteRule,
    addRule
  });
}
