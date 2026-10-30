(() => {
  const key = 'ksicSupportLanguage';
  const select = document.querySelector('#language');
  if (!select) return;

  const supported = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'pt'];
  const allowed = ['system', ...supported];
  const names = {
    en: 'English',
    zh: '中文',
    ja: '日本語',
    ko: '한국어',
    de: 'Deutsch',
    fr: 'Français',
    es: 'Español',
    pt: 'Português'
  };
  const autoLabels = {
    zh: '跟随系统（自动）',
    en: 'Follow system (automatic)',
    ja: 'システム設定に従う（自動）',
    ko: '시스템 설정 따르기 (자동)',
    de: 'Systemstandard (automatisch)',
    fr: 'Système par défaut (automatique)',
    es: 'Seguir el sistema (automático)',
    pt: 'Seguir o sistema (automático)'
  };
  const langLabels = {
    zh: '语言',
    en: 'Language',
    ja: '言語',
    ko: '언어',
    de: 'Sprache',
    fr: 'Langue',
    es: 'Idioma',
    pt: 'Idioma'
  };
  const htmlLangTags = {
    zh: 'zh-Hans',
    ja: 'ja',
    ko: 'ko',
    de: 'de',
    fr: 'fr',
    es: 'es',
    pt: 'pt',
    en: 'en'
  };

  // Ensure all supported options exist in the select dropdown across all pages
  const existingValues = Array.from(select.options).map(o => o.value);
  for (const code of supported) {
    if (!existingValues.includes(code)) {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = names[code];
      select.append(opt);
    }
  }

  let preference = 'system';
  try {
    let saved = localStorage.getItem(key);
    if (!saved) {
      const old = localStorage.getItem('volmixSiteLanguage');
      if (old === 'zh-Hans') saved = 'zh';
      else if (old) saved = old;
    }
    if (allowed.includes(saved)) preference = saved;
  } catch (_) {}

  const requested = new URLSearchParams(location.search).get('lang');
  if (allowed.includes(requested)) preference = requested;

  function resolveLang() {
    if (preference !== 'system') return preference;
    const languages = navigator.languages || [navigator.language || 'en'];
    for (const candidate of languages) {
      const code = String(candidate).toLowerCase().split('-')[0];
      if (supported.includes(code)) return code;
    }
    return 'en';
  }

  function render() {
    let lang = resolveLang();
    // Graceful fallback if a subpage only has en/zh sections
    if (!document.querySelector(`main section[data-lang="${lang}"]`)) {
      lang = lang === 'zh' ? 'zh' : 'en';
    }

    document.documentElement.lang = htmlLangTags[lang] || 'en';

    document.querySelectorAll('[data-lang]').forEach(node => {
      node.hidden = node.dataset.lang !== lang;
    });

    // Preserve the user's explicit language mode across product origins.
    document.querySelectorAll('a[href]').forEach(link => {
      const destination = new URL(link.getAttribute('href'), location.href);
      if (destination.hostname === 'smoothcast.kevinlabs.app') {
        destination.searchParams.set('lang', preference);
        link.href = destination.href;
      }
    });
    select.value = preference;
    select.setAttribute('aria-label', langLabels[lang] || 'Language');
    if (select.options[0]) {
      select.options[0].textContent = autoLabels[lang] || 'Follow system (automatic)';
    }

    const heading = document.querySelector(`main section[data-lang="${lang}"] h1`);
    if (heading) {
      document.title = heading.textContent.replace(/\s+/g, ' ').trim() + ' — Kevin Labs';
    }
  }

  select.addEventListener('change', () => {
    preference = select.value;
    try {
      localStorage.setItem(key, preference);
    } catch (_) {}
    const url = new URL(location.href);
    url.searchParams.delete('lang');
    history.replaceState(null, '', url);
    render();
  });

  window.addEventListener('languagechange', () => {
    if (preference === 'system') render();
  });


  let toastTimeout = null;
  function showToast(email, copied) {
    let toast = document.querySelector('.site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'site-toast';
      document.body.appendChild(toast);
    }
    const isZh = document.documentElement.lang.startsWith('zh');
    const gmail = `<a href="https://mail.google.com/mail/?view=cm&fs=1&to=${email}" target="_blank" rel="noopener">${isZh ? '在网页版 Gmail 打开 ↗' : 'Open in Web Gmail ↗'}</a>`;
    const msg = copied
      ? (isZh
        ? `<span>✓ 邮箱已自动复制：<strong>${email}</strong></span>${gmail}`
        : `<span>✓ Email copied: <strong>${email}</strong></span>${gmail}`)
      : (isZh
        ? `<span>⚠ 自动复制失败，请手动复制：<strong>${email}</strong></span>${gmail}`
        : `<span>⚠ Auto-copy failed, please copy manually: <strong>${email}</strong></span>${gmail}`);
    toast.innerHTML = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 6000);
  }

  // Legacy fallback for non-secure contexts (e.g. file:// local preview),
  // where navigator.clipboard is unavailable.
  function legacyCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none;';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (_) {}
    ta.remove();
    return ok;
  }

  function copyEmail(email) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(email).then(() => true).catch(() => legacyCopy(email));
    }
    return Promise.resolve(legacyCopy(email));
  }

  // Handle copy-email and ANY mailto link across the entire site
  document.addEventListener('click', (e) => {
    const copyTarget = e.target.closest('.copy-email');
    if (copyTarget) {
      const email = copyTarget.textContent.trim();
      copyEmail(email).then((ok) => showToast(email, ok));
      return;
    }

    const mailLink = e.target.closest('a[href^="mailto:"]');
    if (mailLink) {
      const href = mailLink.getAttribute('href') || '';
      const email = href.replace(/^mailto:/, '').split('?')[0] || 'support@kevinlabs.app';
      copyEmail(email).then((ok) => showToast(email, ok));
    }
  });

  render();
})();
