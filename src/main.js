import { showSection, handleParse, renderCategorization, updateEvent, generateTimesheet, exportCSV } from './ui.js';
import { addRule, updateRule, deleteRule } from './rules.js';

// Expose functions for inline handlers
Object.assign(window, {
  showSection,
  handleParse,
  renderCategorization,
  updateEvent,
  generateTimesheet,
  exportCSV,
  addRule,
  updateRule,
  deleteRule
});
