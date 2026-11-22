import { FONTS } from '../state.js';

/** Участник №3: типографика. TODO: шкала H1–H4, примеры ошибок, mobile type scale. */
export function mountTypography(root, store) {
  root.innerHTML = `
    <div class="type-grid">
      <div class="panel type-controls">
        <span class="eyebrow">TYPE LAB / EXPERIMENT</span>
        <label>Шрифт
          <select name="fontId">
            ${Object.values(FONTS).map(font => `<option value="${font.id}">${font.name}</option>`).join('')}
          </select>
        </label>
        <label>Размер заголовка <output id="font-size-value">72 px</output>
          <input type="range" name="fontSize" min="32" max="132" step="2" />
        </label>
        <label>Насыщенность
          <select name="fontWeight">
            <option value="400">400 / Regular</option>
            <option value="500">500 / Medium</option>
            <option value="600">600 / Semi Bold</option>
            <option value="700">700 / Bold</option>
          </select>
        </label>
        <label>Текст для превью
          <textarea name="previewText" rows="4" maxlength="200"></textarea>
        </label>
        <p class="form-note">Бесплатные Google Fonts с поддержкой кириллицы. При отсутствии сети — системные замены.</p>
      </div>
      <div class="type-stage" aria-label="Предпросмотр типографики">
        <span class="micro">EXP.03 / TYPOGRAPHY</span>
        <div class="type-sample" data-type-preview></div>
        <div class="type-ruler"><span>ABCDEFGHIJKLMNOPQRSTUVWXYZ</span><span>АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ</span><span>0123456789 / !?@#</span></div>
        <span class="type-stage-icon" aria-hidden="true">↗</span>
      </div>
    </div>`;

  const selectors = {
    fontId: root.querySelector('[name="fontId"]'),
    fontSize: root.querySelector('[name="fontSize"]'),
    fontWeight: root.querySelector('[name="fontWeight"]'),
    previewText: root.querySelector('[name="previewText"]')
  };
  const sample = root.querySelector('[data-type-preview]');
  Object.entries(selectors).forEach(([key, input]) => {
    const eventType = key === 'fontId' || key === 'fontWeight' ? 'change' : 'input';
    input.addEventListener(eventType, () => store.update({ [key]: input.value }));
  });

  store.subscribe(state => {
    for (const [key, input] of Object.entries(selectors)) {
      if (document.activeElement !== input) input.value = state[key];
    }
    sample.textContent = state.previewText;
    sample.style.fontFamily = FONTS[state.fontId].family;
    sample.style.fontSize = `${state.fontSize}px`;
    sample.style.fontWeight = state.fontWeight;
    root.querySelector('#font-size-value').textContent = `${state.fontSize} px`;
  });
}
