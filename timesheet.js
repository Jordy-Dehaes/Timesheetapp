import { parsedEvents } from './parser.js';
import { rules, findRule } from './rules.js';

export function generateTimesheet() {
  parsedEvents.forEach(evt => {
    if (!findRule(evt.title)) {
      rules.push({ pattern: evt.title, category: evt.category, project: evt.project, task: evt.task });
    }
  });
  localStorage.setItem('rules', JSON.stringify(rules));

  const section = document.getElementById('timesheetSection');
  section.style.display = 'block';
  const div = document.getElementById('timesheet');

  let html = '<table><tr><th>Task</th><th>Date</th><th>Duration</th></tr>';
  parsedEvents.forEach(evt => {
    html += `<tr><td>${evt.task}</td><td>${evt.date}</td><td>${evt.duration}h</td></tr>`;
  });
  html += '</table>';
  div.innerHTML = html;
}

export function exportCSV() {
  const header = ['Date','Title','Duration','Category','Project','Task'];
  const rows = parsedEvents.map(e => [e.date, e.title, e.duration, e.category, e.project, e.task]);
  const csv = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'timesheet.csv';
  a.click();
}

export function initTimesheet() {
  document.getElementById('generateBtn').addEventListener('click', generateTimesheet);
  document.getElementById('exportBtn').addEventListener('click', exportCSV);
}
