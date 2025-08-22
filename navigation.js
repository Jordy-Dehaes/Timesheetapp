import { renderRules } from './rules.js';

function showSection(id) {
  document.querySelectorAll('section').forEach(sec => (sec.style.display = 'none'));
  if (id === 'paste') {
    document.getElementById('pasteSection').style.display = 'block';
  }
  if (id === 'timesheet') {
    document.getElementById('timesheetSection').style.display = 'block';
  }
  if (id === 'rules') {
    document.getElementById('rulesSection').style.display = 'block';
    renderRules();
  }
}

export function initNavigation() {
  document.getElementById('navPaste').addEventListener('click', () => showSection('paste'));
  document.getElementById('navTimesheet').addEventListener('click', () => showSection('timesheet'));
  document.getElementById('navRules').addEventListener('click', () => showSection('rules'));
}
