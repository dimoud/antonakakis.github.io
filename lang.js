// ── LANGUAGE TOGGLE ──
let currentLang = 'el';

const elBtn = document.getElementById('lang-el');
const enBtn = document.getElementById('lang-en');
elBtn.classList.add('active');

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang === 'el' ? 'el' : 'en';

  // toggle active state on flag buttons
  elBtn.classList.toggle('active', lang === 'el');
  enBtn.classList.toggle('active', lang === 'en');

  // translate all elements with data-el / data-en
  document.querySelectorAll('[data-el][data-en]').forEach(el => {
    const text = lang === 'el' ? el.dataset.el : el.dataset.en;
    // headings that contain <em> use innerHTML, others use textContent
    if (text.includes('<em>')) {
      el.innerHTML = text;
    } else {
      // decode HTML entities for textContent
      const tmp = document.createElement('span');
      tmp.innerHTML = text;
      el.textContent = tmp.textContent;
    }
  });

  // translate placeholders
  document.querySelectorAll('[data-placeholder-el][data-placeholder-en]').forEach(el => {
    el.placeholder = lang === 'el' ? el.dataset.placeholderEl : el.dataset.placeholderEn;
  });

  // re-label gallery items
  if (typeof galleryImages !== 'undefined') {
    galleryImages.forEach((img, i) => {
      img.label = lang === 'el' ? `Έργο ${i + 1}` : `Project ${i + 1}`;
    });
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter && typeof buildGallery === 'function') {
      buildGallery(activeFilter.dataset.filter);
    }
  }
}

document.getElementById('lang-toggle').addEventListener('click', () => {
  applyLang(currentLang === 'el' ? 'en' : 'el');
});
