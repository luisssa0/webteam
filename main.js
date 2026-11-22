import { PALETTES, DEMO_STATE, createBrandStore } from './state.js';
import { readDraft, saveDraft, resetDraft } from './storage.js';
import { mountBrief } from './sections/brief.js';
import { mountColors } from './sections/colors.js';
import { mountTypography } from './sections/typography.js';
import { mountMockups } from './sections/mockups.js';

const status = document.querySelector('#storage-status');
const saved = readDraft();
const store = createBrandStore(saved.data ?? DEMO_STATE);
let persistent = saved.ok;

function showStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle('storage-status--error', isError);
}
showStatus(saved.message, !saved.ok);

function applyTheme(state) {
  const palette = PALETTES[state.paletteId];
  const root = document.documentElement;
  const variables = {
    '--bg': palette.background,
    '--text': palette.text,
    '--accent': palette.accent,
    '--accent-text': palette.accentText,
    '--surface': palette.surface,
    '--line': palette.border
  };
  for (const [key, value] of Object.entries(variables)) root.style.setProperty(key, value);
  document.querySelectorAll('[data-brand-slogan]').forEach(node => {
    node.textContent = state.slogan;
  });
}

// Четыре независимых модуля. Каждый получает ТОЛЬКО один и тот же store.
mountBrief(document.querySelector('#brief-root'), store);
mountColors(document.querySelector('#colors-root'), store);
mountTypography(document.querySelector('#type-root'), store);
mountMockups(document.querySelector('#mockups-root'), store);

store.subscribe((state) => {
  applyTheme(state);
  if (persistent) {
    const result = saveDraft(state); // автосохранение любого обновления
    if (!result.ok) {
      persistent = false;
      showStatus(result.message, true);
    }
  }
});

document.querySelector('#save-draft').addEventListener('click', () => {
  const result = saveDraft(store.getState());
  persistent = result.ok;
  showStatus(result.message, !result.ok);
});

document.querySelector('#reset-draft').addEventListener('click', () => {
  if (!window.confirm('Вернуть исходные демоданные ERROR 404?')) return;
  // Сначала отключаем автосохранение, иначе replace() мгновенно запишет демо обратно.
  persistent = false;
  const result = resetDraft();
  store.replace(DEMO_STATE);
  // После успешного сброса следующие правки будут снова автоматически сохраняться.
  persistent = result.ok;
  showStatus(result.message, !result.ok);
});

// Только системный диалог браузера: никакого сервера или передачи данных.
document.querySelector("#print-brandbook").addEventListener("click", () => window.print());
