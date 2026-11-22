import { LAYOUTS } from '../state.js';

/** Участник №4: макеты. TODO: экспорт/печать, дополнительные форматы, финальные композиции. */
export function mountMockups(root, store) {
  root.innerHTML = `
    <div class="mockups-top">
      <span class="eyebrow">LIVE APPLICATIONS / NOT FINAL ARTWORK</span>
      <fieldset class="layout-switch">
        <legend>Композиция</legend>
        ${Object.values(LAYOUTS).map(l => `<label><input type="radio" name="layout" value="${l.id}" /> ${l.name}</label>`).join('')}
      </fieldset>
    </div>
    <section class="print-summary" aria-label="Бриф для печати">
      <p class="print-kicker">ERROR 404 / BRAND GUIDELINES / 2026</p>
      <h2 class="print-title" data-print-name></h2>
      <p class="print-slogan" data-print-slogan></p>
      <div class="print-facts">
        <div><h3>Аудитория</h3><p data-print-audience></p></div>
        <div><h3>Цель</h3><p data-print-goal></p></div>
        <div><h3>Характер</h3><p data-print-character></p></div>
        <div><h3>Визуальная система</h3><p data-print-style></p></div>
      </div>
      <p class="print-note">Учебный интерактивный брендбук. Печатная версия сформирована в браузере.</p>
    </section>
    <div class="mockups-grid" data-layout-container>
      <article class="poster" aria-label="Черновой постер агентства">
        <span class="poster-top"><span>INDEPENDENT AGENCY</span><span>EST. 2026 ↗</span></span>
        <span class="poster-super" aria-hidden="true">404</span>
        <div class="poster-title" data-mock-brand></div>
        <div class="poster-bottom"><span data-mock-slogan></span><span>NOT FOUND ≠ NOT POSSIBLE</span></div>
      </article>
      <article class="social-card" aria-label="Черновой макет для социальных сетей">
        <div class="social-top"><span>ERR / SYSTEM 404</span><span>✳</span></div>
        <div class="social-center"><span>ПЛОХАЯ<br />ИДЕЯ?</span><strong>ОТЛИЧНО.</strong></div>
        <div class="social-bottom"><span data-mock-character></span><span>© 2026</span></div>
      </article>
    </div>
    <p class="form-note">Это две рабочие заготовки: плакат и social card. Команда добавит реальные кейсы, изображения и финальную адаптацию.</p>`;
  root.querySelectorAll('[name="layout"]').forEach(input => {
    input.addEventListener('change', () => store.update({ layoutId: input.value }));
  });
  store.subscribe(state => {
    root.querySelectorAll('[name="layout"]').forEach(input => { input.checked = input.value === state.layoutId; });
    const canvas = root.querySelector('[data-layout-container]');
    canvas.dataset.layout = state.layoutId;
    root.querySelector('[data-mock-brand]').textContent = state.name;
    root.querySelector('[data-mock-slogan]').textContent = state.slogan;
    root.querySelector('[data-mock-character]').textContent = state.character;
    root.querySelector('[data-print-name]').textContent = state.name;
    root.querySelector('[data-print-slogan]').textContent = state.slogan;
    root.querySelector('[data-print-audience]').textContent = state.audience;
    root.querySelector('[data-print-goal]').textContent = state.goal;
    root.querySelector('[data-print-character]').textContent = state.character;
    root.querySelector('[data-print-style]').textContent =
      `Палитра: ${state.paletteId} · Шрифт: ${state.fontId} · Композиция: ${LAYOUTS[state.layoutId].name}`;
  });
}
