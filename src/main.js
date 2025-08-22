import "./tailwind.css";
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

// Bind UI actions
document.getElementById("parseBtn").addEventListener("click", handleParse);
document.getElementById("generateBtn").addEventListener("click", generateTimesheet);
document.getElementById("exportCsvBtn").addEventListener("click", exportCSV);
document.getElementById("addRuleBtn").addEventListener("click", addRule);

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
