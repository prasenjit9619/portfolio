document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const primaryNav = document.getElementById('primaryNav');
  const navMore = document.getElementById('navMore');
  const moreBtn = navMore?.querySelector('.dropdown-toggle');
  const moreMenu = document.getElementById('moreMenu');
  const themeToggle = document.getElementById('themeToggle');
  const navToggle = document.querySelector('.nav-toggle');
  const toTop = document.getElementById('toTop');
  const yearEl = document.getElementById('year');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  /* ---------- YEAR ---------- */
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- THEME ---------- */
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  function applyTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    themeToggle && (themeToggle.textContent = mode === 'dark' ? '☀️' : '🌙');
  }
  function initTheme() {
    const saved = localStorage.getItem('theme');
    // const mode = saved || (prefersDark.matches ? 'dark' : 'light');
    const mode = saved || 'dark';
    applyTheme(mode);
  }
  initTheme();
  prefersDark.addEventListener('change', () => {
    if (!localStorage.getItem('theme')) applyTheme(prefersDark.matches ? 'dark' : 'light');
  });
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  /* ---------- NAV: HAMBURGER ---------- */
  navToggle?.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    body.classList.toggle('nav-open', !expanded);
    closeMore(); // avoid stacked menus
  });

  // Close mobile nav on link click
  primaryNav?.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    if (body.classList.contains('nav-open')) {
      body.classList.remove('nav-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- NAV: MORE DROPDOWN & OVERFLOW MGMT ---------- */
  // Store initial menu items order (top-level LIs, including navMore)
  const originalItems = primaryNav ? Array.from(primaryNav.children).map(li => li) : [];

  function closeMore() {
    if (!navMore) return;
    navMore.classList.remove('open');
    moreBtn?.setAttribute('aria-expanded', 'false');
  }
  function toggleMore(open) {
    if (!navMore) return;
    navMore.classList.toggle('open', open ?? !navMore.classList.contains('open'));
    moreBtn?.setAttribute('aria-expanded', navMore.classList.contains('open') ? 'true' : 'false');
  }

  moreBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMore();
  });

  // Click outside to close
  document.addEventListener('click', (e) => {
    if (!navMore) return;
    if (!navMore.contains(e.target)) closeMore();
  });
  // Escape to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMore();
  });
  // Basic keyboard nav within dropdown
  moreMenu?.addEventListener('keydown', (e) => {
    const items = Array.from(moreMenu.querySelectorAll('a'));
    const idx = items.indexOf(document.activeElement);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      (items[idx + 1] || items[0])?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      (items[idx - 1] || items[items.length - 1])?.focus();
    }
  });

  // Rebuild menus for desktop/mobile
  const DESKTOP_BREAKPOINT = 900;
  function buildMenus() {
    if (!primaryNav || !moreMenu || !navMore) return;

    // Reset to original order (moves any items back from More into the primary)
    originalItems.forEach(li => primaryNav.appendChild(li));
    // Ensure dropdown starts clean/closed
    closeMore();
    // Clear any remnants in the dropdown (should already be empty after reset)
    moreMenu.innerHTML = '';

    const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT;

    if (isDesktop) {
      // Consider only top-level items except the "More" li itself
      const items = Array.from(primaryNav.querySelectorAll(':scope > li')).filter(li => li !== navMore);

      // Keep first 6 visible; move the rest into the More dropdown (move nodes, don't clone)
      const keep = 6;
      const overflow = items.slice(keep);

      overflow.forEach(li => {
        moreMenu.appendChild(li); // MOVE into dropdown
        // No inline display hacks — visibility is controlled by the dropdown's open state + CSS
      });

      // Show/hide More button depending on whether it has items
      navMore.style.display = moreMenu.children.length ? '' : 'none';
    } else {
      // Mobile: show all items in the primary list; hide the More control entirely
      Array.from(primaryNav.children).forEach(li => { li.style.display = ''; });
      navMore.style.display = 'none';
    }
  }

  buildMenus();
  window.addEventListener('resize', debounce(buildMenus, 150));

  /* ---------- SMOOTH SCROLL WITH HEADER OFFSET ---------- */
  function getHeaderOffset() {
    const h = header?.offsetHeight || 0;
    return h - 4; // slight overlap
  }
  function smoothScrollTo(target) {
    const el = document.querySelector(target);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
    window.scrollTo({ top, behavior: 'smooth' });
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || url.hostname !== location.hostname) return;
      e.preventDefault();
      smoothScrollTo(href);
    });
  });

  /* ---------- BACK TO TOP VISIBILITY ---------- */
  const toTopObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        toTop?.classList.add('show');
      } else {
        toTop?.classList.remove('show');
      }
    });
  }, { rootMargin: '-80px 0px 0px 0px', threshold: 0 }) : null;

  // Observe top of page (header placeholder)
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  document.body.prepend(sentinel);
  toTopObserver?.observe(sentinel);

  toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- CONTACT FORM ---------- */
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!contactForm.reportValidity()) return;

    // Honeypot
    const honey = contactForm.querySelector('input[name="website"]');
    if (honey && honey.value.trim() !== '') {
      // Bot: pretend success, do nothing
      showStatus('Thanks! Your message has been received.', true);
      contactForm.reset();
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn?.textContent;
    try {
      btn && (btn.disabled = true, btn.textContent = 'Sending…');
      showStatus('', false);

      const formData = new FormData(contactForm);
      const action = contactForm.getAttribute('action') || '';
      // If you have a backend endpoint, this will work; otherwise will no-op silently due to no-cors/fallback
      let ok = false;
      // if (action) {
      //   const res = await fetch(action, { method: 'POST', body: formData });
      //   ok = res.ok;
      // } 
      if (action) {
        const data = {
          name: contactForm.name.value,
          email: contactForm.email.value,
          message: contactForm.message.value
        };
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (res.ok) {
          const result = await res.json();
          ok = result.ok;
        }
      }
      else {
        // Fallback: simulate success
        await sleep(600);
        ok = true;
      }

      if (ok) {
        showStatus('Thanks! I’ll get back to you within 1–2 business days.', true);
        contactForm.reset();
      } else {
        throw new Error('Network error');
      }
    } catch (err) {
      showStatus('Sorry—something went wrong. Please email me directly at prasenjit9619@gmail.com.', false);
    } finally {
      btn && (btn.disabled = false, btn.textContent = original || 'Send message');
    }
  });

  function showStatus(msg, success) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.classList.remove('success', 'error');
    if (msg) formStatus.classList.add(success ? 'success' : 'error');
  }

  /* ---------- UTILS ---------- */
  function debounce(fn, wait = 150) {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  }
  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
});
