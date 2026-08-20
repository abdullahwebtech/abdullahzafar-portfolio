// ===================================
// CANONICAL URL NORMALIZATION (SEO)
// Redirect /index.html to /
// ===================================
(function () {
    if (window.location.pathname.endsWith('/index.html') || window.location.pathname === '/index.html') {
        const cleanPath = window.location.pathname.replace(/\/index\.html$/, '/') + window.location.search + window.location.hash;
        if (window.location.protocol.startsWith('http')) {
            window.history.replaceState(null, '', cleanPath);
        }
    }
})();

// ===================================
// LOADING SCREEN
// ===================================
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 2000);
    }
});

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===================================
// STATS COUNTER ANIMATION
// ===================================
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateCounter(counter);
                }
            });
        }
    });
}, observerOptions);

const statsRow = document.querySelector('.stats-row');
if (statsRow) {
    statsObserver.observe(statsRow);
}

// ===================================
// SERVICES ACCORDION
// ===================================
const serviceItems = document.querySelectorAll('.service-item');

serviceItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all items
        serviceItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
    });
});

// ===================================
// FAQ ACCORDION (Global robust handler)
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.contact-faq-btn');
        if (!btn) return;

        e.preventDefault();
        const item = btn.closest('.contact-faq-item');
        if (!item) return;

        const isOpen = item.classList.contains('open') || item.classList.contains('active');
        const parentList = item.closest('.contact-faq-list') || document;
        
        // Close siblings within the same FAQ list
        parentList.querySelectorAll('.contact-faq-item').forEach(i => {
            i.classList.remove('open');
            i.classList.remove('active');
        });

        // Toggle current item
        if (!isOpen) {
            item.classList.add('open');
            item.classList.add('active');
        }
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    scrollObserver.observe(section);
});

// ===================================
// MOBILE NAVIGATION
// ===================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Redundant handler removed. Using Web3Forms handler below.

// ===================================
// TESTIMONIALS CAROUSEL
// ===================================
const testimonialsTrack = document.querySelector('.testimonials-track');
const testimonialCards = document.querySelectorAll('.testimonials-track .testimonial-card');
const testimonialDots = document.querySelectorAll('.testimonials-nav .dot');
const testimonialPrev = document.querySelector('.testimonials-prev');
const testimonialNext = document.querySelector('.testimonials-next');
let testimonialSlide = 0;
// Calculate items based on screen size
function getCardsPerView() {
    return window.innerWidth <= 768 ? 1 : 2;
}

let totalTestimonialSlides;
let testimonialAutoplay = null;
const testimonialGap = 24;

function setTestimonialCardWidths() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider || testimonialCards.length === 0) return;
    const containerWidth = slider.offsetWidth;
    const currentCardsPerView = getCardsPerView();
    totalTestimonialSlides = Math.ceil(testimonialCards.length / currentCardsPerView);
    // On mobile, cardWidth is container width since gap is not needed between cards shown concurrently
    const cardWidth = currentCardsPerView === 1 
        ? containerWidth 
        : (containerWidth - testimonialGap) / currentCardsPerView;
    
    testimonialCards.forEach(card => {
        card.style.width = cardWidth + 'px';
    });
}

function goToTestimonialSlide(index) {
    if (index < 0) index = totalTestimonialSlides - 1;
    if (index >= totalTestimonialSlides) index = 0;
    testimonialSlide = index;

    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;
    
    const containerWidth = slider.offsetWidth;
    const currentCardsPerView = getCardsPerView();
    // Shift is cardWidth + gap. If 1 card per view, the shift is containerWidth + gap to move completely to next card
    const cardWidth = currentCardsPerView === 1 
        ? containerWidth 
        : (containerWidth - testimonialGap) / currentCardsPerView;
    
    // Shift amount per slide index
    const shiftPx = testimonialSlide * (cardWidth + testimonialGap) * currentCardsPerView;
    testimonialsTrack.style.transform = `translateX(-${shiftPx}px)`;

    testimonialDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === testimonialSlide);
    });
}

function startTestimonialAutoplay() {
    stopTestimonialAutoplay();
    testimonialAutoplay = setInterval(() => {
        goToTestimonialSlide(testimonialSlide + 1);
    }, 5000);
}

function stopTestimonialAutoplay() {
    if (testimonialAutoplay) {
        clearInterval(testimonialAutoplay);
        testimonialAutoplay = null;
    }
}

if (testimonialsTrack && testimonialCards.length > 0) {
    // Set card widths on load
    setTestimonialCardWidths();

    // Recalculate on resize
    window.addEventListener('resize', () => {
        setTestimonialCardWidths();
        goToTestimonialSlide(testimonialSlide);
    });

    // Arrow navigation
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToTestimonialSlide(testimonialSlide - 1);
            startTestimonialAutoplay();
        });
    }
    if (testimonialNext) {
        testimonialNext.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            goToTestimonialSlide(testimonialSlide + 1);
            startTestimonialAutoplay();
        });
    }

    // Dot navigation
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Only navigate if the dot corresponds to a valid page
            if (index < totalTestimonialSlides) {
                goToTestimonialSlide(index);
                startTestimonialAutoplay();
            }
        });
    });

    // Hover pause
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopTestimonialAutoplay);
        sliderContainer.addEventListener('mouseleave', startTestimonialAutoplay);
    }

    // Start autoplay
    startTestimonialAutoplay();
}

// ===================================
// NAVBAR SCROLL EFFECT
// ===================================
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 100) {
        navbar.classList.add('navbar--scrolled');
    } else {
        navbar.classList.remove('navbar--scrolled');
    }
});

// ===================================
// SKILL ITEMS HOVER EFFECT
// ===================================
const skillItems = document.querySelectorAll('.skill-item');

skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        skillItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Set default active skill (Shopify)
if (skillItems.length > 1) {
    skillItems[1].classList.add('active');
}

// ===================================
// FACEBOOK PIXEL (as per blueprint)
// ===================================
!function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
        n.callMethod ?
            n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s)
}(window, document, 'script',
    'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '1226578982613125');
fbq('track', 'PageView');

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// CONSOLE MESSAGE
// ===================================
console.log('%c👋 Hi there! Looking for a WordPress or Shopify developer?', 'font-size: 16px; color: #7c3aed; font-weight: bold;');
console.log('%cLet\'s work together: info@abdullahzafar.me', 'font-size: 14px; color: #a855f7;');

// ===================================
// HOMEPAGE CONTACT FORM logic moved to js/contact.js