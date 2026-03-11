const articles = window.MATC_ARTICLES || [];
const currentYear = new Date().getFullYear();
const isEnglish = document.documentElement.lang === 'en';
const cookieKey = 'mammeandthecity_cookie_consent_v1';

const formatDate = (value) => {
  const date = new Date(value);
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
};

const iconSet = {
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm9.5 2A1.5 1.5 0 1 0 18 5.5 1.5 1.5 0 0 0 16.5 4ZM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5Zm0 2a3 3 0 1 1-3 3 3 3 0 0 1 3-3Z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.8l.4-3h-3.2V9.2c0-.9.3-1.6 1.7-1.6H17V4.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4V11H7.5v3h2.8v8Z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.6 19.3c0-.8 0-2 .3-2.9l1.5-6.4s-.4-.8-.4-2c0-1.8 1-3.1 2.3-3.1 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.8-1 4.4-.3 1.3.6 2.3 1.8 2.3 2.2 0 3.7-2.8 3.7-6.1 0-2.5-1.7-4.3-4.8-4.3-3.5 0-5.7 2.6-5.7 5.6 0 1 .3 1.8.8 2.4.2.2.2.3.1.5l-.3 1.1c-.1.3-.3.4-.6.3-1.7-.7-2.5-2.7-2.5-4.8 0-3.6 3-7.8 9-7.8 4.9 0 8.1 3.5 8.1 7.2 0 4.9-2.7 8.6-6.6 8.6-1.3 0-2.6-.7-3-1.5l-.8 3.1c-.3 1.1-.8 2.2-1.2 3A10 10 0 1 0 12 2Z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3c.2 1.8 1.2 3.3 2.8 4.1.9.4 1.8.6 2.7.6V10c-1.5 0-2.9-.4-4.1-1.1v6.3a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v2.6a2.7 2.7 0 1 0 1.8 2.5V3Z"/></svg>'
};

const buildCard = (article) => `
  <article class="article-card reveal">
    <a href="${article.url}">
      <figure>
        <img src="${article.image}" alt="${article.alt}" width="1200" height="800" loading="lazy" />
      </figure>
      <div class="article-card-content">
        <div class="card-meta">${article.category}</div>
        <h3>${article.title}</h3>
        <div class="meta-row">
          <span>${formatDate(article.date)}</span>
          <span>${article.author}</span>
          <span>${article.readingTime} lettura</span>
        </div>
        <p>${article.excerpt}</p>
        <span class="reading-pill">${article.readingTime}</span>
      </div>
    </a>
  </article>
`;

const buildTrending = (article) => `
  <a class="trending-item" href="${article.url}">
    <span class="trending-tag">${article.category}</span>
    <h3>${article.title}</h3>
    <p>${article.excerpt}</p>
  </a>
`;

const renderFeatured = () => {
  const slot = document.querySelector('[data-featured-article]');
  if (!slot) return;
  const article = articles.find((item) => item.featured) || articles[0];
  if (!article) return;
  slot.innerHTML = `
    <img src="${article.image}" alt="${article.alt}" width="1200" height="800" fetchpriority="high" />
    <div class="hero-copy">
      <span class="hero-kicker">Articolo principale • ${article.category}</span>
      <h1>${article.title}</h1>
      <p>${article.excerpt}</p>
      <a class="btn btn-primary" href="${article.url}">Leggi l articolo</a>
    </div>
  `;
};

const renderCollection = (selector, list) => {
  const slot = document.querySelector(selector);
  if (!slot) return;
  slot.innerHTML = list.map(buildCard).join('');
};

const renderCategoryStreams = () => {
  document.querySelectorAll('[data-category-stream]').forEach((slot) => {
    const category = slot.dataset.category;
    const limit = Number(slot.dataset.limit || '2');
    const filtered = articles.filter((item) => item.category === category).slice(0, limit);
    slot.innerHTML = filtered.map(buildCard).join('');
  });
};

const renderArchives = () => {
  document.querySelectorAll('[data-archive-grid]').forEach((slot) => {
    const category = slot.dataset.archiveGrid;
    const filtered = articles.filter((item) => item.category === category);
    slot.innerHTML = filtered.map(buildCard).join('');
  });
};

const renderTrending = () => {
  const slot = document.querySelector('[data-trending-list]');
  if (!slot) return;
  const list = articles.filter((item) => item.trending).slice(0, 4);
  slot.innerHTML = list.map(buildTrending).join('');
};

const renderPopular = () => {
  const slot = document.querySelector('[data-popular-grid]');
  if (!slot) return;
  const list = articles.filter((item) => item.popular).slice(0, 4);
  slot.innerHTML = list.map(buildCard).join('');
};

const renderRelated = () => {
  const slot = document.querySelector('[data-related]');
  if (!slot) return;
  const category = slot.dataset.category;
  const current = slot.dataset.current;
  const list = articles.filter((item) => item.category === category && item.slug !== current).slice(0, 3);
  slot.innerHTML = list.map(buildCard).join('');
};

const setupSearch = () => {
  const input = document.querySelector('[data-search-input]');
  const panel = document.querySelector('[data-search-results]');
  if (!input || !panel) return;

  const close = () => panel.classList.remove('is-visible');

  input.addEventListener('input', () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      close();
      panel.innerHTML = '';
      return;
    }
    const matches = articles.filter((item) => (
      item.title.toLowerCase().includes(value) ||
      item.excerpt.toLowerCase().includes(value) ||
      item.category.toLowerCase().includes(value)
    )).slice(0, 5);

    if (!matches.length) {
      panel.innerHTML = '<div class="search-item"><small>Nessun risultato</small><span>Prova con una parola chiave diversa.</span></div>';
      panel.classList.add('is-visible');
      return;
    }

    panel.innerHTML = matches.map((item) => `
      <a class="search-item" href="${item.url}">
        <small>${item.category}</small>
        <strong>${item.title}</strong>
        <span>${item.excerpt}</span>
      </a>
    `).join('');
    panel.classList.add('is-visible');
  });

  document.addEventListener('click', (event) => {
    if (!panel.contains(event.target) && event.target !== input) close();
  });
};

const setupForms = () => {
  document.querySelectorAll('[data-demo-form]').forEach((form) => {
    const feedback = form.querySelector('.form-feedback');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        if (feedback) feedback.textContent = 'Compila i campi richiesti e conferma la privacy.';
        return;
      }
      if (feedback) feedback.textContent = 'Richiesta inviata correttamente. Ti risponderemo al più presto.';
      form.reset();
    });
  });
};

const setupMenu = () => {
  const toggle = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !header || !mobileNav) return;
  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      header.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
};

const setupReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .14, rootMargin: '0px 0px -10% 0px' });
  items.forEach((item) => observer.observe(item));
};

const setYear = () => {
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = currentYear;
  });
};

const createCookieBanner = () => {
  if (localStorage.getItem(cookieKey)) return;
  const banner = document.createElement('div');
  banner.className = 'cookie-banner is-visible';
  banner.innerHTML = `
    <div class="cookie-panel">
      <span class="cookie-topline">Cookie essenziali</span>
      <p class="cookie-copy">Usiamo cookie tecnici per rendere il magazine stabile, veloce e coerente anche su mobile. Maggiori dettagli in <a href="privacy.html">Privacy Policy</a> e <a href="cookie.html">Cookie Policy</a>.</p>
      <div class="cookie-actions">
        <button class="btn btn-outline" type="button" data-cookie="reject">Rifiuta</button>
        <button class="btn btn-primary" type="button" data-cookie="accept">Accetta</button>
      </div>
    </div>
  `;
  const close = (value) => {
    localStorage.setItem(cookieKey, value);
    banner.remove();
  };
  banner.querySelector('[data-cookie="accept"]').addEventListener('click', () => close('accepted'));
  banner.querySelector('[data-cookie="reject"]').addEventListener('click', () => close('rejected'));
  document.body.appendChild(banner);
};

renderFeatured();
renderCollection('[data-latest-grid]', articles.slice(0, 5));
renderPopular();
renderTrending();
renderCategoryStreams();
renderArchives();
renderRelated();
setupSearch();
setupForms();
setupMenu();
setupReveal();
setYear();
createCookieBanner();
