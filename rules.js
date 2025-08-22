export let rules = JSON.parse(localStorage.getItem('rules') || '[]');

export function findRule(title) {
  for (const r of rules) {
    try {
      const re = new RegExp(r.pattern, 'i');
      if (re.test(title)) return r;
    } catch (e) {
      if (r.pattern === title) return r;
    }
  }
  return null;
}

export function renderRules() {
  const table = document.getElementById('rulesTable');
  table.innerHTML = "<tr><th>Pattern</th><th>Category</th><th>Project</th><th>Task</th><th>Actions</th></tr>";

  rules.forEach((r, idx) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input value="${r.pattern}" onchange="updateRule(${idx}, 'pattern', this.value)"></td>
      <td><input value="${r.category}" onchange="updateRule(${idx}, 'category', this.value)"></td>
      <td><input value="${r.project}" onchange="updateRule(${idx}, 'project', this.value)"></td>
      <td><input value="${r.task}" onchange="updateRule(${idx}, 'task', this.value)"></td>
      <td><button onclick="deleteRule(${idx})">Delete</button></td>
    `;
    table.appendChild(row);
  });
}

export function updateRule(i, field, value) {
  rules[i][field] = value;
  localStorage.setItem('rules', JSON.stringify(rules));
}

export function deleteRule(i) {
  rules.splice(i, 1);
  localStorage.setItem('rules', JSON.stringify(rules));
  renderRules();
}

export function addRule() {
  rules.push({ pattern: '', category: '', project: '', task: '' });
  localStorage.setItem('rules', JSON.stringify(rules));
  renderRules();
}

export function initRules() {
  document.getElementById('addRuleBtn').addEventListener('click', addRule);
}

// expose for inline handlers in browser
if (typeof window !== 'undefined') {
  window.updateRule = updateRule;
  window.deleteRule = deleteRule;
}
