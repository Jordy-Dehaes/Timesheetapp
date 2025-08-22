import {
  handleParse,
  renderCategorization,
  updateEvent,
  generateTimesheet,
  exportCSV,
} from "./ui.js";
import { addRule, updateRule, deleteRule } from "./rules.js";
import { initNavigation } from "./navigation.js";

initNavigation();

// Expose functions for inline handlers
Object.assign(window, {
  handleParse,
  renderCategorization,
  updateEvent,
  generateTimesheet,
  exportCSV,
  addRule,
  updateRule,
  deleteRule,
});
