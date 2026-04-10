/* ============================================================
   main.js – Shared utilities, nav, toast, scroll reveal, etc.
   ============================================================ */

// ── Shared helpers ──────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatTime(secs) {
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}
function capitalize(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

// ── Session helpers ──────────────────────────────────────────
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('skillrank_user')); } catch { return null; }
}
function isLoggedIn() { return !!getCurrentUser(); }
function redirectIfNotLoggedIn() {
  if (!isLoggedIn()) { window.location.href = 'login.html'; }
}
function redirectIfLoggedIn() {
  if (isLoggedIn()) { window.location.href = 'dashboard.html'; }
}

// ── Toast notifications ──────────────────────────────────────
(function initToasts() {
  let container = $('#toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
})();

function showToast(message, type = 'info', duration = 3500) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('hide');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

// ── Scroll reveal ────────────────────────────────────────────
function initScrollReveal() {
  const reveals = $$('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}

// ── Hamburger mobile menu ────────────────────────────────────
function initMobileMenu() {
  const ham = $('#hamburger');
  const menu = $('#mobile-menu');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    menu.classList.toggle('open');
    const spans = $$('span', ham);
    if (menu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// ── Mark active nav link ─────────────────────────────────────
function markActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link, .sidebar-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page) { a.classList.add('active'); }
  });
}

// ── Set nav user info ────────────────────────────────────────
function populateNav() {
  const user = getCurrentUser();
  const avatarEl = $('#nav-avatar');
  const sidebarName = $('#sidebar-user-name');
  const sidebarRole = $('#sidebar-user-role');
  if (avatarEl && user) {
    avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();
  }
  if (sidebarName && user) { sidebarName.textContent = user.name || 'User'; }
  if (sidebarRole && user) { sidebarRole.textContent = user.email || ''; }
}

// ── Stats counter animation ──────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g,''), 10);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const step  = Math.max(1, Math.floor(target / 60));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString() + suffix;
    if (current >= target) clearInterval(timer);
  }, 20);
}
function initCounters() {
  const counters = $$('[data-counter]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.done) {
        e.target.dataset.done = '1';
        animateCounter(e.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ── Confetti burst ───────────────────────────────────────────
function launchConfetti() {
  const colors = ['#7c3aed','#06b6d4','#f59e0b','#10b981','#ec4899','#fff'];
  for (let i = 0; i < 80; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}vw;
      top: -20px;
      background: ${colors[Math.floor(Math.random()*colors.length)]};
      width: ${6 + Math.random()*8}px;
      height: ${6 + Math.random()*8}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-duration: ${2 + Math.random()*2}s;
      animation-delay: ${Math.random()*0.8}s;
    `;
    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
  }
}

// ── Sidebar logout ───────────────────────────────────────────
function initLogout() {
  const btns = $$('[data-logout]');
  btns.forEach(b => b.addEventListener('click', () => {
    localStorage.removeItem('skillrank_user');
    showToast('Logged out successfully', 'info');
    setTimeout(() => { window.location.href = 'index.html'; }, 800);
  }));
}

// ── Tooltip setup ────────────────────────────────────────────
function initTooltips() {
  $$('[data-tip]').forEach(el => {
    const tip = document.createElement('div');
    tip.className = 'tooltip-bubble';
    tip.textContent = el.dataset.tip;
    tip.style.cssText = `
      position:absolute;bottom:110%;left:50%;transform:translateX(-50%);
      background:rgba(20,20,35,0.95);border:1px solid var(--glass-border);
      padding:4px 10px;border-radius:6px;font-size:0.75rem;white-space:nowrap;
      pointer-events:none;opacity:0;transition:0.15s;z-index:1000;
    `;
    el.style.position = 'relative';
    el.appendChild(tip);
    el.addEventListener('mouseenter', () => { tip.style.opacity = '1'; });
    el.addEventListener('mouseleave', () => { tip.style.opacity = '0'; });
  });
}

// ── Init all ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  markActiveNav();
  populateNav();
  initScrollReveal();
  initCounters();
  initLogout();
  initTooltips();
});

// expose globally
window.SR = {
  $, $$, showToast, getCurrentUser, isLoggedIn,
  redirectIfNotLoggedIn, redirectIfLoggedIn,
  launchConfetti, formatDate, formatTime, capitalize
};
