// =============================================
// READING PROGRESS BAR
// =============================================
const progressBar = document.getElementById('reading-progress');

function updateProgress() {
  const doc = document.documentElement;
  const scrollTop = window.scrollY;
  const scrollHeight = doc.scrollHeight - doc.clientHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });

// =============================================
// BACK TO TOP
// =============================================
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// =============================================
// NAVIGATION
// =============================================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

hamburger?.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// =============================================
// NAV ACTIVE STATE
// =============================================
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    }
  });
}, { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' });

sections.forEach(s => activeObserver.observe(s));

// =============================================
// SCROLL REVEAL
// =============================================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal') || [])];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), Math.min(idx * 70, 350));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// =============================================
// COUNTER ANIMATION
// =============================================
function animateCounter(el, target, duration = 1400) {
  const start = performance.now();
  function step(ts) {
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(target * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

const heroSection = document.getElementById('hero');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num[data-target]').forEach(el =>
        animateCounter(el, parseInt(el.dataset.target), 1500)
      );
      const matchNum = document.querySelector('.match-num[data-target]');
      if (matchNum) animateCounter(matchNum, parseInt(matchNum.dataset.target), 1800);
      const bar = document.querySelector('.match-bar[data-width]');
      if (bar) setTimeout(() => bar.style.width = bar.dataset.width + '%', 300);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

if (heroSection) statsObserver.observe(heroSection);

// =============================================
// HERO PARALLAX
// =============================================
const heroBgImg = document.querySelector('.hero-bg-image img');
if (heroBgImg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBgImg.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    }
  }, { passive: true });
}

// =============================================
// 90-DAY TABS
// =============================================
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    tabPanels.forEach(panel => {
      const isTarget = panel.id === target;
      panel.classList.toggle('active', isTarget);
      // Re-trigger any reveal animations inside the newly active panel
      if (isTarget) {
        panel.querySelectorAll('.tab-item').forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 60);
        });
      }
    });
  });
});

// =============================================
// SMOOTH SCROLL
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
