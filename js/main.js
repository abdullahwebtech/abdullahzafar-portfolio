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
// LOADING SCREEN (Fast & Non-blocking)
// ===================================
const hideLoadingScreen = () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 300);
    }
};

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    hideLoadingScreen();
} else {
    document.addEventListener('DOMContentLoaded', hideLoadingScreen);
    window.addEventListener('load', hideLoadingScreen);
}
// Instant safety fallback
setTimeout(hideLoadingScreen, 200);

// ===================================
// SMOOTH SCROLL
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href.startsWith('#')) return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
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
// MOBILE NAVIGATION & DRAWER
// ===================================
const initMobileNavigation = () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navDropdown = document.querySelector('.nav-item-dropdown');

    if (!hamburger || !navLinks) return;

    // Ensure mobile drawer contains actions (Socials + CTA)
    if (!navLinks.querySelector('.mobile-drawer-actions')) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'mobile-drawer-actions';
        actionsDiv.innerHTML = `
            <div class="mobile-socials">
                <a href="https://www.linkedin.com/in/abdullah-zafar-9029a020a/" target="_blank" class="social-icon" aria-label="LinkedIn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                </a>
                <a href="https://wa.link/6keeko" target="_blank" class="social-icon" aria-label="WhatsApp">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                </a>
            </div>
            <a href="contact.html" class="mobile-cta-btn">Contact Me!</a>
        `;
        navLinks.appendChild(actionsDiv);
    }

    const toggleMenu = (open) => {
        const shouldOpen = open !== undefined ? open : !navLinks.classList.contains('active');
        if (shouldOpen) {
            navLinks.classList.add('active');
            hamburger.classList.add('active');
            document.body.classList.add('nav-open');
        } else {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
            document.body.classList.remove('nav-open');
            if (navDropdown) navDropdown.classList.remove('mobile-open');
        }
    };

    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // Mobile dropdown toggle
    if (navDropdown) {
        const dropdownTrigger = navDropdown.querySelector('a');
        if (dropdownTrigger) {
            dropdownTrigger.addEventListener('click', (e) => {
                if (window.innerWidth <= 991) {
                    e.preventDefault();
                    e.stopPropagation();
                    navDropdown.classList.toggle('mobile-open');
                }
            });
        }
    }

    // Close menu when clicking link inside (except dropdown trigger)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navDropdown && link === navDropdown.querySelector('a') && window.innerWidth <= 991) {
                return;
            }
            toggleMenu(false);
        });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar') && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });

    // Reset on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 991 && navLinks.classList.contains('active')) {
            toggleMenu(false);
        }
    });
};

document.addEventListener('DOMContentLoaded', initMobileNavigation);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initMobileNavigation();
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