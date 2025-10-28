// ==UserScript==
// @name         RealNex Split-View (Ironclad Hijack by cremattsd)
// @namespace    https://matty-realnex
// @version      3.7.8-Canary-Debug4
// @description  Lock to 1 property window (RNX_RIGHT) for #key= links; refresh on each click. Debug for Canary by Matty Smith (cremattsd).
// @match        *://*.realnex.com/*
// @run-at       document-start
// @allFrames    true
// @grant        none
// @author       Matty Smith (cremattsd)
// ==/UserScript==

(function () {
  'use strict';

  // Loud start with Canary force-check
  try {
    console.log('Script BOOTING - Checking Canary...');
    const isCanary = navigator.userAgent.includes('Chrome Canary') || navigator.userAgent.includes('Chromium');
    console.log('Detected as:', isCanary ? 'Canary' : 'regular');
  } catch (bootErr) {
    setTimeout(() => alert('Script load failed: ' + bootErr), 0);
  }

  const TARGET = 'RNX_RIGHT';
  const ORIGIN = location.origin;
  const KEY_RE = /#key=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;
  const isCanary = navigator.userAgent.includes('Chrome Canary') || navigator.userAgent.includes('Chromium');

  console.log('Vars set in ' + (isCanary ? 'Canary' : 'regular') + ': TARGET=' + TARGET + ', ORIGIN=' + ORIGIN);

  const abs = (h) => {
    try {
      const fullUrl = h.startsWith('/') ? `${ORIGIN}${h}` : h;
      const result = new URL(fullUrl, ORIGIN).href;
      console.log('Abs URL in ' + (isCanary ? 'Canary' : 'regular') + ':', h, '->', result);
      return result;
    } catch (e) {
      console.error('URL parse fail in ' + (isCanary ? 'Canary' : 'regular') + ':', h, e);
      alert('URL parse crashed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
      return h || '';
    }
  };

  const isPropertyUrl = (url) => {
    try {
      console.log('Testing URL in ' + (isCanary ? 'Canary' : 'regular') + ':', url);
      const u = new URL(url, ORIGIN);
      const isProp = u.pathname === '/property' && KEY_RE.test(u.hash);
      console.log('Is property link in ' + (isCanary ? 'Canary' : 'regular') + '?', isProp);
      return isProp;
    } catch (e) {
      console.error('Property check crashed in ' + (isCanary ? 'Canary' : 'regular') + ':', e);
      alert('Property check failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
      return false;
    }
  };

  // Name the current window as contacts (RNX_LEFT)
  try {
    window.name = 'RNX_LEFT';
    console.log('Named window RNX_LEFT in ' + (isCanary ? 'Canary' : 'regular'));
  } catch (e) {
    console.error('RNX_LEFT name fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e);
    alert('RNX_LEFT naming failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
  }
  document.addEventListener('DOMContentLoaded', () => {
    try {
      window.name = 'RNX_LEFT';
      console.log('DOM loaded, RNX_LEFT set in ' + (isCanary ? 'Canary' : 'regular'));
    } catch (e) {
      console.error('DOM RNX_LEFT fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e);
      alert('DOM RNX_LEFT failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
    }
  });

  // Name property pages as RNX_RIGHT
  if (location.pathname.toLowerCase().startsWith('/property') && KEY_RE.test(location.hash)) {
    try {
      window.name = TARGET;
      console.log('Named window RNX_RIGHT in ' + (isCanary ? 'Canary' : 'regular'));
    } catch (e) {
      console.error('RNX_RIGHT name fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e);
      alert('RNX_RIGHT naming failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
    }
    document.addEventListener('DOMContentLoaded', () => {
      try {
        window.name = TARGET;
        console.log('DOM loaded, RNX_RIGHT set in ' + (isCanary ? 'Canary' : 'regular'));
      } catch (e) {
        console.error('DOM RNX_RIGHT fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e);
        alert('DOM RNX_RIGHT failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
      }
    });
  }

  function routeToRight(url, specs) {
    console.log('Routing to right in ' + (isCanary ? 'Canary' : 'regular') + ' with:', url);
    let w;
    try {
      w = window.open('', TARGET); // Try reuse
      if (!w || w.closed) {
        console.warn('Reuse failed in ' + (isCanary ? 'Canary' : 'regular') + ', creating new:', TARGET);
        w = window.open(abs(url), TARGET, specs || 'noopener,noreferrer,width=1400,height=1000');
        if (!w || w.closed) {
          console.error('Window creation bombed in ' + (isCanary ? 'Canary' : 'regular') + ':', url);
          alert('Window failed in ' + (isCanary ? 'Canary' : 'regular') + ' — ensure pop-ups are allowed for crm.realnex.com! 😂');
          return null;
        }
      }
    } catch (openErr) {
      console.error('Window open failed in ' + (isCanary ? 'Canary' : 'regular') + ':', openErr);
      alert('Window open crashed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + openErr);
      return null;
    }

    try {
      console.log('Navigating in ' + (isCanary ? 'Canary' : 'regular') + ' to:', abs(url));
      const currentKey = w.location.hash.match(KEY_RE)?.[0];
      const newKey = abs(url).match(KEY_RE)?.[0];
      if (w.location.href !== abs(url) || !currentKey || currentKey !== newKey) {
        w.location.href = abs(url);
      } else {
        w.location.reload();
      }
      w.focus();
      setTimeout(() => {
        try {
          if (!w.document.body.innerHTML) {
            console.error('Content not loaded in ' + (isCanary ? 'Canary' : 'regular') + ':', abs(url));
            alert('Content failed in ' + (isCanary ? 'Canary' : 'regular') + ' — check console or session! 😂');
            w.location.href = abs(url); // Retry
          } else {
            console.log('Content loaded in ' + (isCanary ? 'Canary' : 'regular') + ':', abs(url));
          }
        } catch (contentErr) {
          console.error('Content check failed in ' + (isCanary ? 'Canary' : 'regular') + ':', contentErr);
          alert('Content check crashed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + contentErr);
        }
      }, 2000); // Extended to 2000ms for Canary
    } catch (e) {
      console.error('Navigation error in ' + (isCanary ? 'Canary' : 'regular') + ':', e);
      alert('Navigation crashed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
    }
    return w;
  }

  function lockOpen(ctx, label) {
    console.log('Locking open in ' + (isCanary ? 'Canary' : 'regular') + ' for:', label);
    if (!ctx) {
      console.warn('No context in ' + (isCanary ? 'Canary' : 'regular') + ' for:', label);
      return;
    }
    try {
      const original = ctx.open;
      const hijack = function (url, name, specs) {
        const absUrl = abs(url);
        if (absUrl && isPropertyUrl(absUrl)) {
          const win = routeToRight(absUrl, specs);
          if (win) console.debug('[RNX] Routed via ' + (isCanary ? 'Canary ' : '') + label, '→ RNX_RIGHT:', absUrl);
          return win;
        }
        return original.apply(this, arguments);
      };
      try { delete ctx.open; } catch (e) { console.error('Delete open failed in ' + (isCanary ? 'Canary' : 'regular') + ':', e); }
      Object.defineProperty(ctx, 'open', {
        value: hijack,
        writable: false,
        configurable: false
      });
    } catch (e) {
      console.error('LockOpen fail in ' + (isCanary ? 'Canary' : 'regular') + ' for:', label, e);
      alert('LockOpen crashed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e);
    }
  }

  // Patch early with safety
  console.log('Patching windows in ' + (isCanary ? 'Canary' : 'regular'));
  lockOpen(window, 'window');
  try { if (parent && parent !== window && parent.origin === ORIGIN) lockOpen(parent, 'parent'); } catch (e) { console.error('Parent lock fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e); alert('Parent patch failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e); }
  try { if (top && top !== window && top.origin === ORIGIN) lockOpen(top, 'top'); } catch (e) { console.error('Top lock fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e); alert('Top patch failed in ' + (isCanary ? 'Canary' : 'regular') + ': ' + e); }

  // Reassert periodically
  const reassert = () => {
    console.log('Reasserting in ' + (isCanary ? 'Canary' : 'regular'));
    try { if (window.open.name !== 'hijack') lockOpen(window, 'window@tick'); } catch (e) { console.error('Reassert window tick fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e); }
    try { if (parent && parent !== window && parent.origin === ORIGIN && parent.open.name !== 'hijack') lockOpen(parent, 'parent@tick'); } catch (e) { console.error('Reassert parent tick fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e); }
    try { if (top && top !== window && top.origin === ORIGIN && top.open.name !== 'hijack') lockOpen(top, 'top@tick'); } catch (e) { console.error('Reassert top tick fail in ' + (isCanary ? 'Canary' : 'regular') + ':', e); }
  };
  const i1 = setInterval(reassert, 50);
  document.addEventListener('DOMContentLoaded', () => {
    reassert();
    console.log('DOM loaded, reasserted in ' + (isCanary ? 'Canary' : 'regular'));
    clearInterval(i1);
  });

  // Hijack links
  document.addEventListener('click', (e) => {
    console.log('Click caught in ' + (isCanary ? 'Canary' : 'regular') + ', target:', e.target);
    const link = e.target.closest('a[href]');
    if (link) {
      console.log('Link found in ' + (isCanary ? 'Canary' : 'regular') + ':', link.href);
    }
    if (link && isPropertyUrl(abs(link.href))) {
      console.log('Property link hit in ' + (isCanary ? 'Canary' : 'regular') + ':', link.href);
      e.preventDefault();
      routeToRight(abs(link.href));
    }
  }, true);
})();
