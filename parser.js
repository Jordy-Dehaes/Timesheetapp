// Utility functions for parsing timesheet summaries
export function parseSummary(text, rules = []) {
  const lines = text.split("\n").map(l => l.trim()).filter(l => l);
  const events = [];
  let idCounter = 1;
  let currentDay = null;

  const dayRegex = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)$/i;
  const meetingRegex = /^(\d{1,2}:\d{2})\s*(?:-|–|to)\s*(\d{1,2}:\d{2})\s+(.+)$/i;

  for (const line of lines) {
    if (dayRegex.test(line)) {
      currentDay = line.slice(0, 3);
      continue;
    }

    const match = line.match(meetingRegex);
    if (match && currentDay) {
      const [, start, end, rest] = match;
      let title = rest;
      let durationRaw = "0";

      const paren = rest.match(/(.+?)\s*\((.+)\)$/);
      if (paren) {
        title = paren[1];
        durationRaw = paren[2];
      } else {
        const parts = rest.split(/\s+/);
        const potential = parts[parts.length - 1];
        if (parseDuration(potential) > 0) {
          durationRaw = potential;
          parts.pop();
          title = parts.join(" ");
        }
      }

      const date = dayToDate(currentDay);
      const duration = parseDuration(durationRaw);
      const matchedRule = findRule(title, rules) || {};

      events.push({
        id: "evt-" + idCounter++,
        title: title.trim(),
        date,
        start,
        end,
        duration,
        category: matchedRule.category || "",
        project: matchedRule.project || "",
        task: matchedRule.task || "",
        raw: line
      });
    }
  }

  if (events.length === 0) {
    console.warn("No events parsed. Check input format:", lines);
  }

  return events;
}

export function findRule(title, rules = []) {
  for (const r of rules) {
    try {
      const re = new RegExp(r.pattern, "i");
      if (re.test(title)) return r;
    } catch (e) {
      if (r.pattern === title) return r;
    }
  }
  return null;
}

function parseDuration(str) {
  str = str.toLowerCase().trim();

  if (/^\d+(\.\d+)?h$/.test(str)) {
    return parseFloat(str.replace("h", ""));
  }

  const hm = str.match(/(\d+)\s*hour[s]?\s*(\d+)?\s*min/);
  if (hm) {
    const hours = parseInt(hm[1], 10);
    const mins = hm[2] ? parseInt(hm[2], 10) : 0;
    return hours + mins / 60;
  }

  const h = str.match(/(\d+)\s*hour[s]?/);
  if (h) {
    return parseInt(h[1], 10);
  }

  const m = str.match(/(\d+)\s*m(in(ute)?s?)?/);
  if (m) {
    return parseInt(m[1], 10) / 60;
  }

  const f = parseFloat(str);
  if (!isNaN(f)) return f;

  return 0;
}

function dayToDate(dayAbbrev) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const idx = days.indexOf(dayAbbrev);
  const date = new Date(monday);
  date.setDate(monday.getDate() + idx);
  return date.toISOString().slice(0, 10);
}
