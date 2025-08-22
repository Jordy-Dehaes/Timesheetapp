import { findRule } from './rules.js';

export let parsedEvents = [];

export function handleParse() {
  console.log('Parse button clicked');
  const text = document.getElementById('summary').value;
  parsedEvents = parseSummary(text);
  renderCategorization();
}

export function parseSummary(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
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
      let durationRaw = '0';
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
          title = parts.join(' ');
        }
      }
      const date = dayToDate(currentDay);
      const duration = parseDuration(durationRaw);
      events.push({
        id: 'evt-' + idCounter++,
        title: title.trim(),
        date,
        start,
        end,
        duration,
        category: findRule(title)?.category || '',
        project: findRule(title)?.project || '',
        task: findRule(title)?.task || '',
        raw: line
      });
    }
  }
  if (events.length === 0) {
    console.warn('No events parsed. Check input format:', lines);
  }
  return events;
}

function parseDuration(str) {
  str = str.toLowerCase().trim();
  if (/^\d+(\.\d+)?h$/.test(str)) {
    return parseFloat(str.replace('h', ''));
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
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const idx = days.indexOf(dayAbbrev);
  const date = new Date(monday);
  date.setDate(monday.getDate() + idx);
  return date.toISOString().slice(0, 10);
}

function renderCategorization() {
  const section = document.getElementById('categorization');
  section.style.display = 'block';
  const table = document.getElementById('eventsTable');
  table.innerHTML = '<tr><th>Date</th><th>Title</th><th>Duration</th><th>Category</th><th>Project</th><th>Task</th></tr>';
  parsedEvents.forEach((evt, idx) => {
    const row = document.createElement('tr');
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

export function initParser() {
  document.getElementById('parseBtn').addEventListener('click', handleParse);
}

if (typeof window !== 'undefined') {
  window.updateEvent = updateEvent;
}
