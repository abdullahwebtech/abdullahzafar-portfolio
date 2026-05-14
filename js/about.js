// ===================================
// ABOUT PAGE — ANIMATIONS
// ===================================

// ── Scroll Reveal ──
document.querySelectorAll('.about-reveal, .about-reveal-up').forEach(el => {
    new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) e.target.classList.add('visible');
        });
    }, { threshold: 0.1 }).observe(el);
});

// ── Stats Counter ──
document.querySelectorAll('.about-stat-num').forEach(el => {
    new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !el.classList.contains('counted')) {
            el.classList.add('counted');
            const target = +el.dataset.target;
            let cur = 0;
            const step = target / (1400 / 16);
            const t = setInterval(() => {
                cur += step;
                if (cur >= target) { cur = target; clearInterval(t); }
                el.textContent = Math.floor(cur);
            }, 16);
        }
    }, { threshold: 0.5 }).observe(el);
});

// ── Skill Bars ──
const aboutSkills = document.querySelector('.about-skills');
if (aboutSkills) {
    new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.about-skill-fill').forEach((bar, i) => {
                setTimeout(() => {
                    bar.style.width = bar.dataset.width + '%';
                }, i * 110);
            });
        }
    }, { threshold: 0.3 }).observe(aboutSkills);
}

// ── Timeline Spine Fill ──
const aboutSpine = document.querySelector('.about-timeline-spine-fill');
const aboutTlWrap = document.querySelector('.about-timeline-wrap');
if (aboutSpine && aboutTlWrap) {
    window.addEventListener('scroll', () => {
        const rect = aboutTlWrap.getBoundingClientRect();
        const scrolled = Math.max(0, window.innerHeight - rect.top);
        const pct = Math.min(100, (scrolled / (aboutTlWrap.offsetHeight + window.innerHeight)) * 200);
        aboutSpine.style.height = pct + '%';
    });
}
