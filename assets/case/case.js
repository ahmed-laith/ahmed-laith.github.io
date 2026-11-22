// Case-study pages: EN / العربية toggle. A page opens in English unless the
// link carried ?lang=ar (set when the visitor was reading the site in Arabic).
(function () {
  var root = document.documentElement;

  function apply(lang) {
    var ar = lang === 'ar';
    root.setAttribute('lang', ar ? 'ar' : 'en');
    root.setAttribute('dir', ar ? 'rtl' : 'ltr');
    var t = root.getAttribute(ar ? 'data-title-ar' : 'data-title-en');
    if (t) document.title = t;
    document.querySelectorAll('[data-lang-btn]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-btn') === (ar ? 'ar' : 'en')));
    });
  }

  function withLang(href, ar) {
    var hash = '', i = href.indexOf('#');
    if (i >= 0) { hash = href.slice(i); href = href.slice(0, i); }
    href = href.replace(/([?&])lang=ar(&|$)/, function (m, a, b) { return b ? a : ''; }).replace(/[?&]$/, '');
    if (ar) href += (href.indexOf('?') >= 0 ? '&' : '?') + 'lang=ar';
    return href + hash;
  }

  apply(/[?&]lang=ar(&|$)/.test(location.search) ? 'ar' : 'en');

  document.addEventListener('click', function (e) {
    var backBtn = e.target.closest && e.target.closest('.cs-back');
    if (backBtn) {
      try { sessionStorage.setItem('al_return_from_sub', '1'); } catch (err) {}
      if (window.history.length > 1) {
        e.preventDefault();
        window.history.back();
        return;
      }
    }
    var b = e.target.closest && e.target.closest('[data-lang-btn]');
    if (b) {
      var lang = b.getAttribute('data-lang-btn');
      apply(lang);
      try { history.replaceState(null, '', withLang(location.pathname + location.search, lang === 'ar') + location.hash); } catch (err) {}
      try { localStorage.setItem('al-lang', lang); } catch (err) {}
      return;
    }
    // links inside the site carry the language over
    var a = e.target.closest && e.target.closest('a[data-keep-lang]');
    if (a) a.setAttribute('href', withLang(a.getAttribute('href'), root.getAttribute('lang') === 'ar'));
  });
})();
