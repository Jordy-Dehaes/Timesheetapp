let parsedEvents = [];
let rules = JSON.parse(localStorage.getItem("rules") || "[]");

function handleParse() {
  const text = document.getElementById("summary").value;
  parsedEvents = parseSummary(text);
  renderCategorization();
}

function parseSummary(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);
  const events = [];
  let idCounter = 1;
  const regex = /^(\w{3})\s+(\d{2}:\d{2})-(\d{2}:\d{2})\s+(.+?)\s+\(([\d\.]+)h\)$/;

  for (const line of lines) {
    const match = line.match(regex);
    if (match) {
      const [, day, start, end, title, duration] = match;
      const date = dayToDate(day);
      events.push({
        id: "evt-" + idCounter++,
        title: title.trim(),
        date,
        start,
        end,
        duration: parseFloat(duration),
        category: findRule(title)?.category || "",
        project: findRule(title)?.project || "",
        task: findRule(title)?.task || ""
      });
    }
  }
  return events;
}

function dayToDate(dayAbbrev) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const idx = days.indexOf(dayAbbrev);
  const date = new Date(monday);
  date.setDate(monday.getDate() + idx);
  return date.toISOString().slice(0, 10);
}

function findRule(title) {
  return rules.find(r => r.pattern === title);
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
  // Save new rules for unmapped titles
  parsedEvents.forEach(evt => {
    if (!findRule(evt.title)) {
      rules.push({ pattern: evt.title, category: evt.category, project: evt.project, task: evt.task });
    }
  });
  localStorage.setItem("rules", JSON.stringify(rules));

  const section = document.getElementById("timesheetSection");
  section.style.display = "block";
  const div = document.getElementById("timesheet");

  // Build simple summary table
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
