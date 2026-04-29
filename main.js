// ── NAV SCROLL ──
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── HAMBURGER / MOBILE DRAWER ──
const hamburger = document.getElementById('hamburger');
const drawer = document.getElementById('mobile-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerClose = document.getElementById('drawer-close');

function openDrawer() { drawer.classList.add('open'); drawerOverlay.classList.add('open'); }
function closeDrawer() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }

hamburger.addEventListener('click', openDrawer);
drawerClose.addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

// ── HERO SLIDESHOW ──
const slides = document.querySelectorAll('.hero-slide');
let current = 0;
setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 4000);

// ── GALLERY DATA ──
const galleryImages = Array.from({ length: 26 }, (_, i) => ({
  src: `https://antonakakis-kataskevastiki.gr/projects/project-${String(i + 1).padStart(2, '0')}.jpg`,
  label: `Έργο ${i + 1}`,
  category: i % 3 === 0 ? 'construction' : 'renovation',
}));

// ── LIGHTBOX STATE ──
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCounter = document.getElementById('lightbox-counter');
let lbImages = [], lbIndex = 0;

function openLightbox(imgs, idx) {
  lbImages = imgs;
  lbIndex = idx;
  lightboxImg.src = imgs[idx].src;
  lightboxCounter.textContent = `${idx + 1} / ${imgs.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(dir) {
  lbIndex = (lbIndex + dir + lbImages.length) % lbImages.length;
  lightboxImg.src = lbImages[lbIndex].src;
  lightboxCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
document.getElementById('lightbox-prev').addEventListener('click', () => lbNav(-1));
document.getElementById('lightbox-next').addEventListener('click', () => lbNav(1));
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbNav(-1);
  if (e.key === 'ArrowRight') lbNav(1);
});

// ── REVEAL ON SCROLL ──
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible)');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

// ── GALLERY BUILD ──
const gallery = document.getElementById('gallery');

function buildGallery(filter) {
  gallery.innerHTML = '';
  const imgs = filter === 'all' ? galleryImages : galleryImages.filter(g => g.category === filter);
  imgs.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `
      <img src="${img.src}" alt="${img.label}" loading="lazy" />
      <div class="gallery-item-overlay">
        <span class="gallery-item-label">${img.label}</span>
      </div>
    `;
    item.addEventListener('click', () => openLightbox(imgs, idx));
    gallery.appendChild(item);
  });
  observeReveal();
}

buildGallery('all');

// ── FILTER BUTTONS ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildGallery(btn.dataset.filter);
  });
});

// ── COUNT UP ANIMATION ──
function countUp(el) {
  const target = +el.dataset.target;
  if (!target) return;
  let count = 0;
  const step = Math.ceil(target / 60);
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + (target === 24 ? '/7' : '+');
    if (count >= target) clearInterval(timer);
  }, 30);
}

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target);
      counterIO.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach(el => counterIO.observe(el));

// ── HERO SCROLL CTA ──
document.querySelector('.hero-scroll').addEventListener('click', () => {
  document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
});

// Initial reveal pass
observeReveal();
