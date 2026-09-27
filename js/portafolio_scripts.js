document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* HEADER — fondo al hacer scroll */
const header = document.getElementById('siteHeader');
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* MENÚ MÓVIL */
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

function setMenu(open) {
  navMenu.classList.toggle('open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}
navToggle.addEventListener('click', function() {
  setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
});
navMenu.querySelectorAll('a').forEach(function(a) {
  a.addEventListener('click', function() { setMenu(false); });
});

/* ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE */
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (!entry.isIntersecting) return;
    navLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

document.querySelectorAll('main section[id]').forEach(function(s) { sectionObserver.observe(s); });

/* APARICIÓN AL HACER SCROLL */
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.section-title, .about > *, .exp-card, .service, .skills, .project, .contact, .stat')
  .forEach(function(el) {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

/* CONTADORES DE CIFRAS */
function formatNumber(n) {
  return n.toLocaleString('es-CO');
}
function animateCount(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  if (reduceMotion) { el.textContent = formatNumber(target) + suffix; return; }
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = formatNumber(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(function(el) { countObserver.observe(el); });

/* PESTAÑAS DE SKILLS */
const tabs = Array.from(document.querySelectorAll('.skills-tabs [role="tab"]'));

function selectTab(tab) {
  tabs.forEach(function(t) {
    const selected = t === tab;
    t.setAttribute('aria-selected', String(selected));
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !selected;
  });
}
tabs.forEach(function(tab, i) {
  tab.addEventListener('click', function() { selectTab(tab); });
  tab.addEventListener('keydown', function(e) {
    let next = null;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
    if (next) { e.preventDefault(); selectTab(next); next.focus(); }
  });
});

/* LIGHTBOX DE LA FOTO */
const lightbox = document.getElementById('lightbox');
const photoBtn = document.getElementById('photoBtn');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox() {
  lightbox.hidden = false;
  lightboxClose.focus();
}
function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  photoBtn.focus();
}
photoBtn.addEventListener('click', openLightbox);
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeLightbox(); setMenu(false); }
});

/* FORMULARIO DE CONTACTO (Formspree) */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const btn = contactForm.querySelector('.btn-send');
  const btnHTML = btn.innerHTML;
  const note = document.getElementById('formNote');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Enviando…';
    note.className = 'form-note';
    note.textContent = '';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        note.textContent = '¡Mensaje enviado! Te respondo pronto.';
        note.classList.add('ok');
        contactForm.reset();
      } else {
        note.textContent = 'Algo salió mal. Escríbeme directo a dchcampo@gmail.com';
        note.classList.add('error');
      }
    } catch {
      note.textContent = 'Error de conexión. Intenta de nuevo.';
      note.classList.add('error');
    }
    btn.disabled = false;
    btn.innerHTML = btnHTML;
  });
}

/* AÑO DEL FOOTER */
document.getElementById('year').textContent = new Date().getFullYear();
