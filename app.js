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
  let currentDay = null;

  // Detect day-only line like "Mon"
  const dayRegex = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/i;

  // Detect meeting line: "09:15-09:45 Title (duration)"
  const meetingRegex = /^(\d{1,2}:\d{2})-(\d{1,2}:\d{2})\s+(.+?)\s+\((.+)\)$/;

  for (const line of lines) {
    if (dayRegex.test(line)) {
      currentDay = line.slice(0,3); // Normalize to Mon/Tue/…
      continue;
    }

    const match = line.match(meetingRegex);
    if (match && currentDay) {
      const [, start, end, title, durationRaw] = match;
      const date = dayToDate(currentDay);
      const duration = parseDuration(durationRaw);

      events.push({
        id: "evt-" + idCounter++,
        title: title.trim(),
        date,
        start,
        end,
        duration,
        category: findRule(title)?.category || "",
        project: findRule(title)?.project || "",
        task: findRule(title)?.task || "",
        raw: line
      });
    }
  }

  // Debug: if nothing parsed, log lines for inspection
  if (events.length === 0) {
    console.warn("No events parsed. Check input format:", lines);
  }

  return events;
}

// More flexible duration parser
function parseDuration(str) {
  str = str.toLowerCase().trim();

  if (str.endsWith("h")) return parseFloat(str);
  if (str.includes("hour")) {
    const hm = str.match(/(\\d+)\\s*hour[s]?\\s*(\\d+)?/);
    if (hm) return parseInt(hm[1],10) + (hm[2]?parseInt(hm[2],10)/60:0);
  }
  if (str.includes("min")) {
    const m = str.match(/(\\d+)/);
    if (m) return parseInt(m[1],10)/60;
  }
  if (str.endsWith("m")) return parseInt(str,10)/60;
  const f = parseFloat(str);
  return isNaN(f) ? 0 : f;
}



// Convert various duration formats to hours (float)
function parseDuration(str) {
  str = str.toLowerCase().trim();

  // 1. Simple numbers with h
  if (/^\d+(\.\d+)?h$/.test(str)) {
    return parseFloat(str.replace("h", ""));
  }

  // 2. Hours + optional minutes
  const hm = str.match(/(\d+)\s*hour[s]?\s*(\d+)?\s*min/);
  if (hm) {
    const hours = parseInt(hm[1], 10);
    const mins = hm[2] ? parseInt(hm[2], 10) : 0;
    return hours + mins / 60;
  }

  // 3. Hours only
  const h = str.match(/(\d+)\s*hour[s]?/);
  if (h) {
    return parseInt(h[1], 10);
  }

  // 4. Minutes only
  const m = str.match(/(\d+)\s*m(in(ute)?s?)?/);
  if (m) {
    return parseInt(m[1], 10) / 60;
  }

  // 5. Fallback: try to parse as number
  const f = parseFloat(str);
  if (!isNaN(f)) return f;

  return 0; // default if unknown
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
