import { normalizeState } from './state.js';

export const STORAGE_KEY = 'brandbook-draft';

/**
 * Все методы возвращают { ok, message, ... }, а не выбрасывают ошибки.
 * При блокировке localStorage приложение продолжает работать в памяти.
 */
export function readDraft() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, data: null, message: 'Открыты демоданные. Автосохранение доступно.' };
    const decoded = JSON.parse(raw);
    if (!decoded || typeof decoded !== 'object' || Array.isArray(decoded)) {
      return { ok: false, data: null, message: 'Черновик повреждён. Открыты демоданные; перезапишите черновик кнопкой «Сохранить».' };
    }
    return { ok: true, data: normalizeState(decoded), message: 'Черновик восстановлен из этого браузера.' };
  } catch (error) {
    return { ok: false, data: null, message: 'Не удалось прочитать сохранение. Работаем с демоданными; сохранение может быть недоступно.' };
  }
}

export function saveDraft(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
    return { ok: true, message: 'Черновик сохранён в этом браузере.' };
  } catch (error) {
    return { ok: false, message: 'Браузер запретил сохранение. Изменения работают до обновления страницы, но не сохраняются.' };
  }
}

export function resetDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true, message: 'Черновик удалён. Демоданные восстановлены.' };
  } catch (error) {
    return { ok: false, message: 'Демоданные восстановлены только на экране: браузер не разрешил удалить сохранение.' };
  }
}
