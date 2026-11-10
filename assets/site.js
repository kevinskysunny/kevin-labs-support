(() => {
  const key = 'ksicSupportLanguage';
  const select = document.querySelector('#language');
  if (!select) return;
  const supported = ['en', 'zh', 'ja', 'ko', 'de', 'fr', 'es', 'pt'];
  const allowed = ['system', ...supported];
  const names = { en:'English', zh:'中文', ja:'日本語', ko:'한국어', de:'Deutsch', fr:'Français', es:'Español', pt:'Português' };
  const langLabels = { en:'Language', zh:'语言', ja:'言語', ko:'언어', de:'Sprache', fr:'Langue', es:'Idioma', pt:'Idioma' };
  const htmlLangTags = { en:'en', zh:'zh-Hans', ja:'ja', ko:'ko', de:'de', fr:'fr', es:'es', pt:'pt' };
  const messages = /* ui-copy:start */{
  "en": {
    "copy": "Copy email",
    "copied": "Email copied",
    "copyFailed": "Copy failed. Select and copy this address:",
    "close": "Dismiss",
    "fallback": "This page is available in English. Your language preference is kept for other pages.",
    "feedback": "Support request",
    "greeting": "Hello Kevin,",
    "prompt": "Question or issue:",
    "appVersion": "App and version",
    "systemVersion": "macOS version",
    "device": "Device",
    "contact": "Contact support",
    "auto": "Automatic",
    "englishFallback": "Opens in English",
    "storeOpen": "Open in Mac App Store ↗",
    "storeWeb": "View on web",
    "storeRegion": "Store country or region",
    "storeChoose": "Choose a region",
    "storeView": "View app ↗",
    "mailApp": "Open mail app",
    "mailFallback": "If your mail app did not open, copy the address or use Gmail on the web.",
    "mailWeb": "Open Web Gmail"
  },
  "zh": {
    "copy": "复制邮箱",
    "copied": "邮箱已复制",
    "copyFailed": "复制失败，请选中并复制此地址：",
    "close": "关闭提示",
    "fallback": "本页暂以英文显示，其他页面会保留你的语言选择。",
    "feedback": "使用反馈",
    "greeting": "你好 Kevin，",
    "prompt": "问题或建议：",
    "appVersion": "应用与版本",
    "systemVersion": "macOS 版本",
    "device": "设备",
    "contact": "联系支持",
    "auto": "跟随系统",
    "englishFallback": "以英文打开",
    "storeOpen": "在 Mac App Store 打开 ↗",
    "storeWeb": "在网页查看",
    "storeRegion": "商店国家或地区",
    "storeChoose": "选择地区",
    "storeView": "查看应用 ↗",
    "mailApp": "用邮件应用打开",
    "mailFallback": "如果邮件应用未打开，可复制邮箱或使用网页版 Gmail。",
    "mailWeb": "在网页版 Gmail 打开"
  },
  "ja": {
    "copy": "メールアドレスをコピー",
    "copied": "メールアドレスをコピーしました",
    "copyFailed": "コピーできませんでした。このアドレスを選択してコピーしてください：",
    "close": "閉じる",
    "fallback": "このページは英語で表示されます。他のページでは選択した言語を維持します。",
    "feedback": "サポート依頼",
    "greeting": "Kevin さん、こんにちは。",
    "prompt": "ご質問・問題：",
    "appVersion": "アプリ名とバージョン",
    "systemVersion": "macOS バージョン",
    "device": "デバイス",
    "contact": "サポートに連絡",
    "auto": "システム設定",
    "englishFallback": "英語で開きます",
    "storeOpen": "Mac App Store で開く ↗",
    "storeWeb": "Web で見る",
    "storeRegion": "ストアの国または地域",
    "storeChoose": "地域を選択",
    "storeView": "アプリを見る ↗",
    "mailApp": "メールアプリで開く",
    "mailFallback": "メールアプリが開かない場合は、アドレスをコピーするか、Web 版 Gmail をご利用ください。",
    "mailWeb": "Web 版 Gmail で開く"
  },
  "ko": {
    "copy": "이메일 복사",
    "copied": "이메일을 복사했습니다",
    "copyFailed": "복사하지 못했습니다. 주소를 선택해 복사하세요:",
    "close": "닫기",
    "fallback": "이 페이지는 영어로 표시됩니다. 다른 페이지에서는 선택한 언어가 유지됩니다.",
    "feedback": "지원 요청",
    "greeting": "Kevin님, 안녕하세요.",
    "prompt": "질문 또는 문제:",
    "appVersion": "앱 및 버전",
    "systemVersion": "macOS 버전",
    "device": "기기",
    "contact": "지원 문의",
    "auto": "시스템 설정",
    "englishFallback": "영어로 열림",
    "storeOpen": "Mac App Store에서 열기 ↗",
    "storeWeb": "웹에서 보기",
    "storeRegion": "스토어 국가 또는 지역",
    "storeChoose": "지역 선택",
    "storeView": "앱 보기 ↗",
    "mailApp": "메일 앱에서 열기",
    "mailFallback": "메일 앱이 열리지 않으면 주소를 복사하거나 웹 Gmail을 사용하세요.",
    "mailWeb": "웹 Gmail에서 열기"
  },
  "de": {
    "copy": "E-Mail kopieren",
    "copied": "E-Mail-Adresse kopiert",
    "copyFailed": "Kopieren fehlgeschlagen. Bitte diese Adresse markieren und kopieren:",
    "close": "Schließen",
    "fallback": "Diese Seite ist auf Englisch verfügbar. Ihre Sprachwahl bleibt für andere Seiten erhalten.",
    "feedback": "Supportanfrage",
    "greeting": "Hallo Kevin,",
    "prompt": "Frage oder Problem:",
    "appVersion": "App und Version",
    "systemVersion": "macOS-Version",
    "device": "Gerät",
    "contact": "Support kontaktieren",
    "auto": "Systemsprache",
    "englishFallback": "Öffnet auf Englisch",
    "storeOpen": "Im Mac App Store öffnen ↗",
    "storeWeb": "Im Web ansehen",
    "storeRegion": "Land oder Region des Stores",
    "storeChoose": "Region wählen",
    "storeView": "App ansehen ↗",
    "mailApp": "Mail-App öffnen",
    "mailFallback": "Falls sich die Mail-App nicht öffnet, kopieren Sie die Adresse oder nutzen Sie Gmail im Web.",
    "mailWeb": "Gmail im Web öffnen"
  },
  "fr": {
    "copy": "Copier l’adresse",
    "copied": "Adresse e-mail copiée",
    "copyFailed": "Échec de la copie. Sélectionnez et copiez cette adresse :",
    "close": "Fermer",
    "fallback": "Cette page est disponible en anglais. Votre choix de langue est conservé pour les autres pages.",
    "feedback": "Demande d’assistance",
    "greeting": "Bonjour Kevin,",
    "prompt": "Question ou problème :",
    "appVersion": "App et version",
    "systemVersion": "Version de macOS",
    "device": "Appareil",
    "contact": "Contacter l’assistance",
    "auto": "Langue système",
    "englishFallback": "S’ouvre en anglais",
    "storeOpen": "Ouvrir dans le Mac App Store ↗",
    "storeWeb": "Voir sur le Web",
    "storeRegion": "Pays ou région du Store",
    "storeChoose": "Choisir une région",
    "storeView": "Voir l’app ↗",
    "mailApp": "Ouvrir l’app de messagerie",
    "mailFallback": "Si l’app de messagerie ne s’ouvre pas, copiez l’adresse ou utilisez Gmail sur le Web.",
    "mailWeb": "Ouvrir Gmail sur le Web"
  },
  "es": {
    "copy": "Copiar correo",
    "copied": "Correo copiado",
    "copyFailed": "No se pudo copiar. Selecciona y copia esta dirección:",
    "close": "Cerrar",
    "fallback": "Esta página está disponible en inglés. Tu idioma se conserva para las demás páginas.",
    "feedback": "Solicitud de soporte",
    "greeting": "Hola Kevin:",
    "prompt": "Pregunta o problema:",
    "appVersion": "App y versión",
    "systemVersion": "Versión de macOS",
    "device": "Dispositivo",
    "contact": "Contactar con soporte",
    "auto": "Idioma del sistema",
    "englishFallback": "Se abre en inglés",
    "storeOpen": "Abrir en Mac App Store ↗",
    "storeWeb": "Ver en la web",
    "storeRegion": "País o región de la tienda",
    "storeChoose": "Elegir región",
    "storeView": "Ver app ↗",
    "mailApp": "Abrir app de correo",
    "mailFallback": "Si no se abre tu app de correo, copia la dirección o usa Gmail en la web.",
    "mailWeb": "Abrir Gmail en la web"
  },
  "pt": {
    "copy": "Copiar e-mail",
    "copied": "E-mail copiado",
    "copyFailed": "Não foi possível copiar. Selecione e copie este endereço:",
    "close": "Fechar",
    "fallback": "Esta página está disponível em inglês. Seu idioma será mantido nas outras páginas.",
    "feedback": "Pedido de suporte",
    "greeting": "Olá Kevin,",
    "prompt": "Dúvida ou problema:",
    "appVersion": "App e versão",
    "systemVersion": "Versão do macOS",
    "device": "Dispositivo",
    "contact": "Contatar suporte",
    "auto": "Idioma do sistema",
    "englishFallback": "Abre em inglês",
    "storeOpen": "Abrir na Mac App Store ↗",
    "storeWeb": "Ver na web",
    "storeRegion": "País ou região da loja",
    "storeChoose": "Escolher região",
    "storeView": "Ver app ↗",
    "mailApp": "Abrir app de e-mail",
    "mailFallback": "Se o app de e-mail não abrir, copie o endereço ou use o Gmail na web.",
    "mailWeb": "Abrir Gmail na web"
  }
}/* ui-copy:end */;
  for (const code of supported) {
    if (![...select.options].some(option => option.value === code)) {
      const option = document.createElement('option');
      option.value = code; option.textContent = names[code]; select.append(option);
    }
  }
  let preference = 'system';
  try {
    let saved = localStorage.getItem(key);
    if (!saved) {
      const old = localStorage.getItem('volmixSiteLanguage');
      saved = old === 'zh-Hans' ? 'zh' : old;
    }
    if (allowed.includes(saved)) preference = saved;
  } catch (_) {}
  const requested = new URLSearchParams(location.search).get('lang');
  if (allowed.includes(requested)) { preference = requested; try { localStorage.setItem(key, preference); } catch (_) {} }
  function resolveLang() {
    if (preference !== 'system') return preference;
    for (const candidate of navigator.languages || [navigator.language || 'en']) {
      const code = String(candidate).toLowerCase().split('-')[0];
      if (supported.includes(code)) return code;
    }
    return 'en';
  }
  const productHosts = new Set(['kevinlabs.app', 'support.kevinlabs.app', 'nextmirror.kevinlabs.app', 'barnest.kevinlabs.app', 'smoothcast.kevinlabs.app', 'mindcharge.kevinlabs.app', 'macpulse.kevinlabs.app']);
  let toastTimeout;
  let toast;
  let toastOrigin;
  function dismissToast() {
    clearTimeout(toastTimeout);
    const restoreFocus = toast?.contains(document.activeElement);
    if (toast) { toast.hidden = true; toast.replaceChildren(); }
    if (restoreFocus && toastOrigin?.isConnected) toastOrigin.focus({ preventScroll:true });
    toastOrigin = null;
  }
  function showToast(email, copied, mailUrl = null) {
    dismissToast();
    toastOrigin = document.activeElement;
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'site-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
      document.body.append(toast);
    }
    const lang = resolveLang(), copy = messages[lang];
    toast.lang = htmlLangTags[lang];
    const text = document.createElement('span');
    text.textContent = `${mailUrl ? copy.mailFallback : copied ? copy.copied : copy.copyFailed} ${email}`;
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = copy.close;
    close.addEventListener('click', dismissToast);
    toast.append(text);
    if (mailUrl) {
      const actions = document.createElement('div'); actions.className = 'mail-fallback-actions';
      const copyButton = document.createElement('button');
      copyButton.type = 'button'; copyButton.className = 'copy-email';
      copyButton.dataset.email = email; copyButton.textContent = copy.copy;
      const web = document.createElement('a');
      const destination = new URL('https://mail.google.com/mail/');
      destination.search = new URLSearchParams({ view:'cm', fs:'1', to:email, su:mailUrl.searchParams.get('subject') || '', body:mailUrl.searchParams.get('body') || '' });
      web.href = destination.href; web.target = '_blank'; web.rel = 'noopener'; web.textContent = copy.mailWeb;
      actions.append(copyButton, web); toast.append(actions);
    }
    toast.append(close); toast.hidden = false; toast.classList.add('show');
    // Failure remains available for manual selection until explicitly dismissed.
    if (copied) toastTimeout = setTimeout(dismissToast, 6000);
  }
  function legacyCopy(text) {
    const previous = document.activeElement;
    const input = document.createElement('textarea');
    input.value = text; input.setAttribute('readonly','');
    input.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.append(input); input.select(); input.setSelectionRange(0,text.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) {}
    input.remove(); previous?.focus({ preventScroll:true });
    return copied;
  }
  async function copyEmail(email) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(email); return true; } catch (_) {}
    }
    return legacyCopy(email);
  }
  function localizeContact(lang) {
    const copy = messages[lang];
    const section = document.querySelector(`main section[data-lang="${lang}"]`);
    const product = section?.querySelector('.product-identity strong')?.textContent.trim() || 'Kevin Labs';
    const subject = `[${product}] ${copy.feedback}`;
    const body = `${copy.greeting}\n\n${copy.prompt}\n\n\n${copy.appVersion}:\n${copy.systemVersion}:\n${copy.device}:\n`;
    for (const link of document.querySelectorAll('a[href^="mailto:"]')) {
      const email = new URL(link.href).pathname;
      const url = new URL(`mailto:${email}`);
      url.searchParams.set('subject', subject); url.searchParams.set('body', body);
      link.href = url.href;
      let button = link.nextElementSibling;
      if (!button?.matches('button.copy-email')) {
        button = document.createElement('button');
        button.type = 'button'; button.className = 'copy-email button-outline';
        link.after(button);
      }
      button.dataset.email = email;
      button.textContent = copy.copy;
    }
    for (const link of document.querySelectorAll('a[href*="mail.google.com/mail/"]')) {
      const url = new URL(link.href);
      url.searchParams.set('su', subject); url.searchParams.set('body', body);
      link.href = url.href;
    }
    for (const heading of document.querySelectorAll('.callout-content h3')) {
      // Each translated section keeps static fallback copy; runtime matches the selected content.
      if (heading.closest('[data-lang]')?.dataset.lang === lang) heading.textContent = copy.contact;
    }
  }
  const storeRegions = /* store-regions:start */["ae","af","ag","ai","al","am","ao","ar","at","au","az","ba","bb","be","bf","bg","bh","bj","bm","bn","bo","br","bs","bt","bw","by","bz","ca","cd","cg","ch","ci","cl","cm","cn","co","cr","cv","cy","cz","de","dk","dm","do","dz","ec","ee","eg","es","fi","fj","fm","fr","ga","gb","gd","ge","gh","gm","gr","gt","gw","gy","hk","hn","hr","hu","id","ie","il","in","iq","is","it","jm","jo","jp","ke","kg","kh","kn","kr","kw","ky","kz","la","lb","lc","lk","lr","lt","lu","lv","ly","ma","md","me","mg","mk","ml","mm","mn","mo","mr","ms","mt","mu","mv","mw","mx","my","mz","na","ne","ng","ni","nl","no","np","nr","nz","om","pa","pe","pg","ph","pk","pl","pt","pw","py","qa","ro","rs","ru","rw","sa","sb","sc","se","sg","si","sk","sl","sn","sr","st","sv","sz","tc","td","th","tj","tm","tn","to","tr","tt","tw","tz","ua","ug","us","uy","uz","vc","ve","vg","vn","vu","xk","ye","za","zm","zw"]/* store-regions:end */;
  let storeRegion = '';
  try { const saved = localStorage.getItem('kevinLabsStoreRegion'); if (storeRegions.includes(saved)) storeRegion = saved; } catch (_) {}
  function localizeStore(lang) {
    const copy = messages[lang];
    const displayNames = new Intl.DisplayNames([htmlLangTags[lang]], { type:'region' });
    for (const link of document.querySelectorAll('.store-native')) link.textContent = copy.storeOpen;
    for (const details of document.querySelectorAll('.store-web')) {
      details.querySelector('summary').textContent = copy.storeWeb;
      const controls = details.querySelector('.store-region-controls');
      if (!controls.firstChild) {
        const label = document.createElement('label'), caption = document.createElement('span'), picker = document.createElement('select');
        label.append(caption, picker); controls.append(label);
        picker.addEventListener('change', () => {
          storeRegion = picker.value;
          try { localStorage.setItem('kevinLabsStoreRegion', storeRegion); } catch (_) {}
          localizeStore(resolveLang());
        });
      }
      controls.hidden = false;
      controls.querySelector('span').textContent = copy.storeRegion;
      const picker = controls.querySelector('select');
      if (picker.dataset.lang !== lang) {
        picker.replaceChildren(new Option(copy.storeChoose, ''), ...storeRegions.map(region => new Option(displayNames.of(region.toUpperCase()), region)).sort((a,b)=>a.text.localeCompare(b.text,htmlLangTags[lang])));
        picker.dataset.lang = lang;
      }
      picker.value = storeRegion;
      const web = details.querySelector('.store-web-link');
      web.textContent = copy.storeView;
      web.hidden = !storeRegion;
      // UI language, IP location and Apple Account storefront are different things.
      // Only an explicit selection changes the HTTPS storefront; never force CN/US.
      if (storeRegion) web.href = `https://apps.apple.com/${storeRegion}/app/id${details.dataset.storeId}?mt=12&ct=ksic_website`;
    }
  }
  function render() {
    const requestedLang = resolveLang();
    const lang = document.querySelector(`main section[data-lang="${requestedLang}"]`) ? requestedLang : 'en';
    document.documentElement.lang = htmlLangTags[lang];
    document.querySelectorAll('[data-lang]').forEach(node => { node.hidden = node.dataset.lang !== lang; });
    for (const link of document.querySelectorAll('a[href]')) {
      const destination = new URL(link.getAttribute('href'), location.href);
      if (link.hasAttribute('data-direct-action')) continue;
      if (!['http:','https:'].includes(destination.protocol)) continue;
      const sameOrigin = destination.origin === location.origin;
      if (sameOrigin && destination.pathname === location.pathname && destination.hash) continue;
      const isDocument = destination.pathname.endsWith('.html') || destination.pathname.endsWith('/');
      if ((sameOrigin && isDocument) || (productHosts.has(destination.hostname) && !sameOrigin)) {
        if (destination.hostname === 'macpulse.kevinlabs.app') {
          const page = destination.pathname.endsWith('/support') || destination.searchParams.get('to') === 'support' ? 'support' : '';
          destination.pathname = '/lang/' + (preference === 'system' ? 'auto' : preference);
          destination.searchParams.set('to', page);
          destination.searchParams.delete('lang'); link.href = destination.href;
          continue;
        }
        // MindCharge currently supports six manual languages. Preserve auto mode.
        const productLanguage = { system:'system', en:'en', zh:'zh-Hans', ja:'ja', de:'de', fr:'fr', es:'es' };
        destination.searchParams.delete('lang');
        if (destination.hostname === 'mindcharge.kevinlabs.app' && destination.pathname === '/' && preference !== 'system') destination.pathname = '/i18n/' + (productLanguage[preference] || 'en') + '/index.html';
        link.href = destination.href;
        if (destination.hostname === 'mindcharge.kevinlabs.app') {
          let note = link.querySelector('.link-language-note');
          if (['ko','pt'].includes(requestedLang)) {
            if (!note) { note = document.createElement('span'); note.className = 'link-language-note'; link.append(note); }
            note.textContent = messages[requestedLang].englishFallback;
            link.hreflang = 'en';
          } else { note?.remove(); link.removeAttribute('hreflang'); }
        }
      }
    }
    select.value = preference;
    select.setAttribute('aria-label', langLabels[requestedLang]);
    select.title = langLabels[requestedLang];
    if (select.options[0]) select.options[0].textContent = messages[requestedLang].auto;
    let notice = document.querySelector('.language-fallback');
    if (requestedLang !== lang) {
      if (!notice) { notice = document.createElement('p'); notice.className = 'language-fallback'; document.querySelector('main').prepend(notice); }
      notice.lang = htmlLangTags[requestedLang]; notice.textContent = messages[requestedLang].fallback;
    } else notice?.remove();
    localizeContact(lang);
    localizeStore(requestedLang);
    dismissToast();
    const heading = sectionHeading(lang);
    if (heading) document.title = heading.textContent.replace(/\s+/g,' ').trim() + ' — Kevin Labs';
  }
  function sectionHeading(lang) { return document.querySelector(`main section[data-lang="${lang}"] h1`); }
  select.addEventListener('change', () => {
    preference = select.value;
    try { localStorage.setItem(key, preference); } catch (_) {}
    const url = new URL(location.href); url.searchParams.delete('lang');
    history.replaceState(null, '', url); render();
  });
  window.addEventListener('languagechange', () => { if (preference === 'system') render(); });
  document.addEventListener('click', event => {
    const mailLink = event.target.closest('a[href^="mailto:"]');
    if (mailLink) {
      // Browsers cannot report whether an external mail handler opened.
      // Keep native navigation and offer an immediate, honest fallback without auto-copying or opening a second destination.
      const mailUrl = new URL(mailLink.href);
      showToast(mailUrl.pathname, false, mailUrl);
      return;
    }
    const target = event.target.closest('button.copy-email');
    if (!target) return;
    const email = target.dataset.email;
    // A language switch while clipboard work is pending must not revive stale feedback.
    const mode = preference;
    copyEmail(email).then(copied => { if (mode === preference) showToast(email, copied); });
  });
  render();
})();

/* Kevin Labs website analytics v1.0.1. No cookies or persistent browser identifier. */
(()=>{
 if(typeof window==='undefined'||typeof document==='undefined'||typeof navigator==='undefined'||typeof document.addEventListener!=='function')return;
 if(window.__kevinProductAnalytics)return;window.__kevinProductAnalytics=true;
 if(navigator.doNotTrack==='1'||navigator.globalPrivacyControl)return;
 const endpoint='https://www.ks-sic.com/api/product-analytics/event';
 const fields=()=>{const q=new URLSearchParams(location.search),clean=v=>/^[a-zA-Z0-9_.-]{1,64}$/.test(v||'')?v:'';return{source:clean(q.get('utm_source')),campaign:clean(q.get('utm_campaign'))}};
 const send=event=>{const body=JSON.stringify({event,path:location.pathname,marketing:fields()});try{if(navigator.sendBeacon&&navigator.sendBeacon(endpoint,body))return;fetch(endpoint,{method:'POST',body,keepalive:true,credentials:'omit'}).catch(()=>{})}catch{}};
 if(document.prerendering){document.addEventListener('prerenderingchange',()=>send('page'),{once:true})}else send('page');
 document.addEventListener('click',event=>{const link=event.target.closest?.('a[href]');if(!link)return;let url;try{url=new URL(link.href,location.href)}catch{return}
 if(url.origin===location.origin||['kevinlabs.app','support.kevinlabs.app','nextmirror.kevinlabs.app','smoothcast.kevinlabs.app','barnest.kevinlabs.app','mindcharge.kevinlabs.app','macpulse.kevinlabs.app'].includes(url.hostname)){const tags=fields();if(tags.source)url.searchParams.set('utm_source',tags.source);if(tags.campaign)url.searchParams.set('utm_campaign',tags.campaign);link.href=url.href}
 if(['apps.apple.com','chromewebstore.google.com','microsoftedge.microsoft.com','addons.mozilla.org'].includes(url.hostname))send('store_click');
 else if(/\.dmg$|\.zip$|\/download(?:s\/|$)|\/releases\/download\//i.test(url.pathname))send('download_click');
 else if(/\/buy(?:\/|$)|checkout/i.test(url.pathname)||url.hash==='#buy')send('buy_click');
 },{capture:true});
})();
