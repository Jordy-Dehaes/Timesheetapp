import test from 'node:test';
import assert from 'node:assert';

// Polyfill minimal localStorage before importing modules
global.localStorage = {
  getItem: () => null,
  setItem: () => {}
};

const { parseSummary } = await import('../src/parser.js');


const sampleDay = 'Mon';

function wrap(text) {
  return `${sampleDay}\n${text}`;
}

test('parses hyphen with parentheses', () => {
  const events = parseSummary(wrap('09:00-10:00 Standup (1h)'));
  assert.strictEqual(events.length, 1);
  const evt = events[0];
  assert.strictEqual(evt.start, '09:00');
  assert.strictEqual(evt.end, '10:00');
  assert.strictEqual(evt.title, 'Standup');
  assert.strictEqual(evt.duration, 1);
});

test('parses en dash separator', () => {
  const events = parseSummary(wrap('09:00–10:00 Planning (1h)'));
  assert.strictEqual(events.length, 1);
  const evt = events[0];
  assert.strictEqual(evt.start, '09:00');
  assert.strictEqual(evt.end, '10:00');
  assert.strictEqual(evt.title, 'Planning');
  assert.strictEqual(evt.duration, 1);
});

test('parses hyphen without parentheses', () => {
  const events = parseSummary(wrap('09:00-09:30 Sync 30m'));
  assert.strictEqual(events.length, 1);
  const evt = events[0];
  assert.strictEqual(evt.start, '09:00');
  assert.strictEqual(evt.end, '09:30');
  assert.strictEqual(evt.title, 'Sync');
  assert.strictEqual(evt.duration, 0.5);
});

test('parses "to" separator without parentheses', () => {
  const events = parseSummary(wrap('10:00 to 11:00 Review 1h'));
  assert.strictEqual(events.length, 1);
  const evt = events[0];
  assert.strictEqual(evt.start, '10:00');
  assert.strictEqual(evt.end, '11:00');
  assert.strictEqual(evt.title, 'Review');
  assert.strictEqual(evt.duration, 1);
});
