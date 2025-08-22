import { initNavigation } from './navigation.js';
import { initParser, parseSummary } from './parser.js';
import { initTimesheet } from './timesheet.js';
import { initRules } from './rules.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initParser();
  initTimesheet();
  initRules();
  console.log('app.js loaded');
});

export { parseSummary };
