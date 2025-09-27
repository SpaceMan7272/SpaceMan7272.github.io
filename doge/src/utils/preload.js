const preloaders = new Map();

export function initPreload(path, fn) {
  if (typeof fn === 'function') preloaders.set(path, fn);
}

export function preload(path) {
  const fn = preloaders.get(path);
  try {
    if (fn) {
      const p = fn();
      if (p && typeof p.then === 'function') {
        p.catch(() => {});
      }
    }
  } catch {}
}

if (typeof window !== 'undefined') {
  window.__routePreload = { preload, initPreload };
}