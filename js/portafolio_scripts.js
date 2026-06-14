/* LIGHTBOX */
function openLightbox() {
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLightbox();
});

/* CV DESCARGA */
let cvBlob = null;

document.getElementById('cvInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;
  cvBlob = file;
  document.getElementById('cvMeta').textContent =
    file.name + ' · ' + (file.size / 1024).toFixed(0) + ' KB';
  const s = document.getElementById('cvStatus');
  s.style.display = 'block';
  setTimeout(() => { s.style.display = 'none'; }, 3000);
});

function downloadCV() {
  const a = document.createElement('a');
  a.href = 'document/Hoja-de-Vida-Daniel-Campo.pdf';
  a.download = 'Hoja-de-Vida-Daniel-Campo.pdf';
  a.click();
}

/* SCROLL REVEAL */
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('section, .project-card, .cv-card').forEach(function(el) {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* FORMULARIO — feedback al enviar */
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn-send');
    const note = document.getElementById('formNote');
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        note.textContent = 'Mensaje enviado. Te respondo pronto.';
        note.style.color = '#29e629';
        contactForm.reset();
      } else {
        note.textContent = 'Algo salió mal. Escríbeme directo a dchcampo@gmail.com';
        note.style.color = '#e06060';
      }
    } catch {
      note.textContent = 'Error de red. Intenta de nuevo.';
      note.style.color = '#e06060';
    }
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg> Enviar mensaje';
  });
}
