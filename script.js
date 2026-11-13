const body = document.body;

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.textContent = open ? '×' : '☰';
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}

// Dark mode
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('lumora-theme');
if (savedTheme === 'dark') body.classList.add('dark');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('lumora-theme', body.classList.contains('dark') ? 'dark' : 'light');
  });
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Portfolio: dynamic JSON rendering + filters + lightbox
const portfolioGrid = document.getElementById('portfolioGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');

const fallbackPortfolio = [
  {title:"Golden Hour", category:"portrait", label:"Portrait / Editorial", image:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85"},
  {title:"Quiet Mountains", category:"travel", label:"Travel / Landscape", image:"https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85"},
  {title:"The Vow", category:"wedding", label:"Love / Wedding", image:"https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85"},
  {title:"After Rain", category:"travel", label:"Travel / Editorial", image:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"},
  {title:"Stillness", category:"portrait", label:"Portrait / Fine Art", image:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=85"},
  {title:"Wild Coast", category:"travel", label:"Travel / Sri Lanka", image:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85"},
  {title:"Crafted", category:"brand", label:"Brand / Campaign", image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=85"},
  {title:"Blue Hour", category:"portrait", label:"Portrait / Contemporary", image:"https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1200&q=85"},
  {title:"The Table", category:"brand", label:"Brand / Hospitality", image:"https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85"}
];

let portfolio = fallbackPortfolio;

async function loadPortfolio() {
  if (!portfolioGrid) return;
  try {
    const response = await fetch('data/portfolio.json');
    if (response.ok) portfolio = await response.json();
  } catch (_) {}
  renderPortfolio('all');
}

function renderPortfolio(filter) {
  if (!portfolioGrid) return;
  portfolioGrid.innerHTML = '';
  portfolio.filter(item => filter === 'all' || item.category === filter).forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'portfolio-item reveal';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" loading="lazy">
      <div class="portfolio-caption"><span>${item.title}</span><span>${item.label}</span></div>`;
    card.addEventListener('click', () => openLightbox(item));
    portfolioGrid.appendChild(card);
    requestAnimationFrame(() => card.classList.add('visible'));
  });
}

function openLightbox(item) {
  if (!lightbox) return;
  lightboxImage.src = item.image;
  lightboxImage.alt = item.title;
  lightboxCaption.textContent = `${item.title} · ${item.label}`;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    renderPortfolio(button.dataset.filter);
  });
});
loadPortfolio();

// Contact form validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const project = document.getElementById('project').value;
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('formStatus');

    if (!name || !email || !project || !message) {
      status.textContent = 'Please complete all required fields.';
      status.className = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = 'Please enter a valid email address.';
      status.className = 'form-status error';
      return;
    }
    status.textContent = 'Thank you — your enquiry has been prepared successfully.';
    status.className = 'form-status success';
    contactForm.reset();
  });
}
