// ===================================
// CONTACT PAGE — INTERACTIONS
// ===================================

document.addEventListener('DOMContentLoaded', function () {

    // ── Web3Forms Config ──
    const WEB3FORMS_KEY = '06375459-1d3a-48b4-b4da-b5685a59dade';

    // ── Scroll Reveal ──
    const revealEls = document.querySelectorAll('.contact-reveal-up');
    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        revealEls.forEach(el => revealObserver.observe(el));
    }

    // ── Project Type Toggle + Conditional URL Field ──
    const typeBtns = document.querySelectorAll('.contact-type-btn');
    const projectTypeHidden = document.getElementById('contact-project-type');
    const projectTypeField = document.getElementById('contact-project-type-field');
    const urlFieldGroup = document.getElementById('contact-url-group');

    function updateUrlFieldVisibility(selectedType) {
        if (!urlFieldGroup) return;
        const showUrl = (selectedType === 'Performance Optimization' || selectedType === 'Migration & Support' || selectedType === 'Boost Website DA/DR');
        urlFieldGroup.style.display = showUrl ? 'block' : 'none';
    }

    typeBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            typeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const selectedType = this.dataset.type;
            if (projectTypeHidden) projectTypeHidden.value = selectedType;
            if (projectTypeField) projectTypeField.value = selectedType;
            updateUrlFieldVisibility(selectedType);
        });
    });

    if (projectTypeHidden) {
        updateUrlFieldVisibility(projectTypeHidden.value);
    }

    // ── Process Connector Line ──
    const connector = document.querySelector('.contact-process-connector');
    if (connector) {
        new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) connector.classList.add('visible');
        }, { threshold: 0.3 }).observe(connector);
    }

    // ── Contact Forms (Contact Page & Landing Page) ──
    const contactForms = document.querySelectorAll('#contact-page-form, #contact-form');
    contactForms.forEach(contactForm => {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Sync project type
            if (projectTypeHidden && projectTypeField) {
                projectTypeField.value = projectTypeHidden.value;
            }

            const submitBtn = contactForm.querySelector('.contact-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(contactForm);
            if (!formData.get('access_key')) {
                formData.append('access_key', WEB3FORMS_KEY);
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    const formContainer = document.getElementById('contact-form-container');
                    const successEl = document.getElementById('contact-success');
                    if (result.success) {
                        if (formContainer) formContainer.style.display = 'none';
                        if (successEl) {
                            successEl.style.display = 'block';
                            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        contactForm.reset();
                    } else {
                        alert(result.message || 'Something went wrong. Please try again or email directly to 4malikabdullah@gmail.com');
                    }
                })
                .catch(error => {
                    console.error('Form submission notice:', error);
                    alert('Could not submit form. Please email directly to 4malikabdullah@gmail.com or info@abdullahzafar.me');
                })
                .finally(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    });

});
