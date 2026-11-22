/**
 * Общие договорённости команды — редактировать совместно, не внутри модулей.
 * Все значения из формы и localStorage проходят через normalizeState().
 */

export const PALETTES = Object.freeze({
  infrared: {
    id: 'infrared', name: '01 / INFRARED', caption: 'Чёрный × огненно-красный',
    background: '#090909', text: '#F7F5F0', accent: '#FF4B2B',
    accentText: '#090909', surface: '#191919', border: '#414141'
  },
  acid: {
    id: 'acid', name: '02 / ACID SIGNAL', caption: 'Чёрный × кислотный лайм',
    background: '#090A09', text: '#F7F7F1', accent: '#D6FF2F',
    accentText: '#090A09', surface: '#1B1D18', border: '#42473A'
  },
  crimson: {
    id: 'crimson', name: '03 / RED ROOM', caption: 'Бордовый × яркий коралл',
    background: '#24070C', text: '#FFF6F2', accent: '#FF7652',
    accentText: '#24070C', surface: '#3E1118', border: '#794147'
  }
});

export const FONTS = Object.freeze({
  unbounded: { id: 'unbounded', name: 'Unbounded', family: '"Unbounded", Arial, sans-serif' },
  plex: { id: 'plex', name: 'IBM Plex Mono', family: '"IBM Plex Mono", Consolas, monospace' }
});

export const LAYOUTS = Object.freeze({
  offset: { id: 'offset', name: 'Смещение' },
  stacked: { id: 'stacked', name: 'Строгие блоки' }
});

// Демоданные согласованы для четырёх разделов; их легко заменить перед защитой.
export const DEMO_STATE = Object.freeze({
  name: 'ERROR 404',
  slogan: 'Нормальность переоценена.',
  audience: 'Основатели брендов, маркетологи и арт-директора 27–37 лет',
  goal: 'Превращать смелые и даже абсурдные идеи в заметные бренды.',
  character: 'Дерзкий · интеллектуальный · независимый',
  paletteId: 'infrared',
  fontId: 'unbounded',
  fontSize: 72,
  fontWeight: 700,
  layoutId: 'offset',
  previewText: 'НЕ ИЩЕМ\nНОРМАЛЬНОЕ.'
});

const TEXT_FIELDS = ['name', 'slogan', 'audience', 'goal', 'character', 'previewText'];
const FONT_WEIGHTS = [400, 500, 600, 700];
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export function normalizeState(candidate = {}) {
  const source = candidate && typeof candidate === 'object' && !Array.isArray(candidate) ? candidate : {};
  const result = { ...DEMO_STATE };
  for (const key of TEXT_FIELDS) {
    if (hasOwn(source, key) && typeof source[key] === 'string') {
      result[key] = source[key].slice(0, 500);
    }
  }
  if (hasOwn(PALETTES, source.paletteId)) result.paletteId = source.paletteId;
  if (hasOwn(FONTS, source.fontId)) result.fontId = source.fontId;
  if (hasOwn(LAYOUTS, source.layoutId)) result.layoutId = source.layoutId;

  const size = Number(source.fontSize);
  if (Number.isFinite(size)) result.fontSize = Math.max(32, Math.min(132, Math.round(size)));
  const weight = Number(source.fontWeight);
  if (FONT_WEIGHTS.includes(weight)) result.fontWeight = weight;
  return result;
}

/**
 * Единый store: разделы не читают localStorage напрямую.
 * subscribe(render) автоматически обновляет превью после изменения данных.
 */
export function createBrandStore(initialState = DEMO_STATE) {
  let current = normalizeState(initialState);
  const listeners = new Set();

  function emit() {
    const snapshot = getState();
    for (const callback of listeners) callback(snapshot);
  }
  function getState() { return { ...current }; }
  function update(patch) {
    current = normalizeState({ ...current, ...patch });
    emit();
  }
  function replace(nextState) {
    current = normalizeState(nextState);
    emit();
  }
  function subscribe(callback) {
    listeners.add(callback);
    callback(getState());
    return () => listeners.delete(callback);
  }
  return { getState, update, replace, subscribe };
}
