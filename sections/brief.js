/** Участник №1: бриф. TODO: история агентства, tone of voice, ценности. */
export function mountBrief(root, store) {
  root.innerHTML = `
    <div class="brief-grid">
      <div class="panel panel--editor">
        <span class="eyebrow">EDIT / BRAND CORE</span>
        <form class="brief-form" autocomplete="off">
          <label>Название бренда<input name="name" type="text" maxlength="80" placeholder="ERROR 404" /></label>
          <label>Слоган<input name="slogan" type="text" maxlength="120" placeholder="Нормальность переоценена." /></label>
          <label>Аудитория<textarea name="audience" rows="2" maxlength="300"></textarea></label>
          <label>Цель<textarea name="goal" rows="3" maxlength="400"></textarea></label>
          <label>Характер (3 слова)<input name="character" type="text" maxlength="160" /></label>
        </form>
        <p class="form-note">Изменения отправляются в общий state. Можно перейти в другие разделы — они сразу получат новые значения.</p>
      </div>
      <div class="manifesto-card">
        <span class="micro">AGENCY MANIFESTO / 001</span>
        <div class="manifesto-headline">ПЛОХО<br /><span>НЕ ЗНАЧИТ</span><br />СКУЧНО.</div>
        <div class="manifesto-bottom">
          <span data-brief-name></span>
          <span data-brief-character></span>
        </div>
        <div class="manifesto-star" aria-hidden="true">✳</div>
      </div>
    </div>`;

  const form = root.querySelector('.brief-form');
  const fields = ['name', 'slogan', 'audience', 'goal', 'character'];
  const inputs = Object.fromEntries(fields.map(key => [key, form.elements.namedItem(key)]));

  form.addEventListener('input', event => {
    const key = event.target.name;
    if (fields.includes(key)) store.update({ [key]: event.target.value });
  });
  store.subscribe(state => {
    fields.forEach(key => {
      // Не трогаем значение в активном поле: курсор не прыгает при вводе.
      if (document.activeElement !== inputs[key]) inputs[key].value = state[key];
    });
    root.querySelector('[data-brief-name]').textContent = state.name;
    root.querySelector('[data-brief-character]').textContent = state.character;
  });
}
