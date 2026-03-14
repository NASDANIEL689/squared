/* ============================================================
   SQUARED — script.js
   Handles: sticky nav, mobile menu, carousel scroll
   ============================================================ */

// -- Sticky nav shadow on scroll --
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// -- Mobile burger menu --
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
  // Animate burger lines
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
    spans[1].style.cssText = 'opacity:0';
    spans[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => s.removeAttribute('style'));
  }
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.removeAttribute('style'));
  });
});

// -- "What We Do" carousel scroll --
const carousel = document.querySelector('.what__carousel');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
if (carousel && prevBtn && nextBtn) {
  const getScrollAmount = () => Math.max(280, Math.floor(carousel.clientWidth * 0.75));

  const syncCarouselButtons = () => {
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    const atStart = carousel.scrollLeft <= 2;
    const atEnd = carousel.scrollLeft >= maxScroll - 2;

    prevBtn.classList.toggle('is-disabled', atStart);
    nextBtn.classList.toggle('is-disabled', atEnd);
    prevBtn.setAttribute('aria-disabled', String(atStart));
    nextBtn.setAttribute('aria-disabled', String(atEnd));
  };

  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  carousel.addEventListener('scroll', syncCarouselButtons, { passive: true });
  window.addEventListener('resize', syncCarouselButtons);
  syncCarouselButtons();
}

// -- Scroll-reveal: fade in sections as they enter the viewport --
const revealTargets = document.querySelectorAll(
  '.why__card, .what__card, .pricing__card, .preview__img, .hero__inner, .cta-banner__inner'
);

const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target); // fire once
    }
  });
}, observerOpts);

revealTargets.forEach((el, i) => {
  // Stagger by sibling index within the same parent
  const siblings = Array.from(el.parentElement.children);
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 60}ms`;
  el.classList.add('reveal-init');
  observer.observe(el);
});

// Inject CSS for reveal animation programmatically (keeps JS self-contained)
const style = document.createElement('style');
style.textContent = `
  .reveal-init {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .55s ease, transform .55s ease;
  }
  .reveal-init.revealed {
    opacity: 1;
    transform: none;
  }
`;
document.head.appendChild(style);
