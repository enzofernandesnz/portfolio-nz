/** Owns one effect instance without modifying browser globals. */
export function createEffectScope() {
  let disposed = false;
  const listeners = [], observers = [], cleanups = [];
  const frames = new Set(), timers = new Set();
  const scope = {
    listen(target, type, callback, options) {
      if (disposed) return;
      target.addEventListener(type, callback, options);
      listeners.push(() => target.removeEventListener(type, callback, options));
    },
    observer(Observer, callback, options) {
      const observer = new Observer((...args) => {
        if (!disposed) callback(...args);
      }, options);
      observers.push(observer);
      return observer;
    },
    requestAnimationFrame(callback) {
      if (disposed) return 0;
      const id = window.requestAnimationFrame(time => {
        frames.delete(id);
        if (!disposed) callback(time);
      });
      frames.add(id);
      return id;
    },
    cancelAnimationFrame(id) {
      window.cancelAnimationFrame(id);
      frames.delete(id);
    },
    setTimeout(callback, delay) {
      if (disposed) return 0;
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!disposed) callback();
      }, delay);
      timers.add(id);
      return id;
    },
    clearTimeout(id) {
      window.clearTimeout(id);
      timers.delete(id);
    },
    queueMicrotask(callback) {
      window.queueMicrotask(() => { if (!disposed) callback(); });
    },
    onCleanup(callback) { cleanups.push(callback); },
    preserveAttributes(element, names) {
      const values = names.map(name => [name, element.getAttribute(name)]);
      cleanups.push(() => {
        for (const [name, value] of values) {
          if (value === null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }
      });
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const remove of listeners) remove();
      for (const observer of observers) observer.disconnect();
      for (const id of frames) window.cancelAnimationFrame(id);
      for (const id of timers) window.clearTimeout(id);
      frames.clear(); timers.clear();
      for (const cleanup of cleanups.reverse()) cleanup();
      listeners.length = observers.length = cleanups.length = 0;
    }
  };
  return scope;
}
