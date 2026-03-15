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