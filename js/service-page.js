// ===================================================================
// SERVICE PAGE JAVASCRIPT — Abdullah Zafar
// Dynamic project rendering, quote form handling, and interactive elements
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Projects Showcase Data
    const wordpressProjects = [
        {
            title: "Square HVAC",
            category: "WordPress Service Website",
            description: "HVAC service website with local SEO strategy generating 708+ monthly organic visitors with fast mobile performance.",
            image: "assets/images/projects/square-hvac/thumbnail.webp",
            link: "/portfolios/square-hvac",
            tags: ["WordPress", "Local SEO", "Service Website"]
        },
        {
            title: "Pinnacle Law Firm",
            category: "WordPress Legal Website",
            description: "Professional legal website for a California-based practice specializing in ART and Entertainment Law, built for trust.",
            image: "assets/images/projects/pinnacle-law-firm/pinnacle law firm Thumbnail.webp",
            link: "/portfolios/pinnacle-law-firm",
            tags: ["WordPress", "Legal Practice", "Custom Design"]
        },
        {
            title: "QMC Services",
            category: "WordPress Consulting Website",
            description: "NDIS consulting website that achieved #1 Google ranking and featured snippet through high-speed structure and schema.",
            image: "assets/images/projects/qmc-services/QMC Services thumbnail.webp",
            link: "/portfolios/qmc-services",
            tags: ["WordPress", "Consulting", "#1 Google Rank"]
        },
        {
            title: "Nutrizen",
            category: "WooCommerce E-Commerce Store",
            description: "Health supplements and skincare WooCommerce store with custom product variations and smooth checkout for Pakistan & abroad.",
            image: "assets/images/projects/nutrizen/Nutrizen Thumbnail.webp",
            link: "/portfolios/nutrizen",
            tags: ["WordPress", "WooCommerce", "E-Commerce"]
        },
        {
            title: "LogicNosh",
            category: "WordPress Agency Website",
            description: "Modern agency website showcasing software development, AI, and blockchain services with interactive layouts.",
            image: "assets/images/projects/logicnosh/Logic Nosh Thumbnail.webp",
            link: "/portfolios/logicnosh",
            tags: ["WordPress", "Agency", "Interactive"]
        },
        {
            title: "Oxygen Pharmacy",
            category: "WordPress Healthcare Store",
            description: "Pharmacy and medical supplies website with local medicine delivery and prescription inquiry forms for fast customer ordering.",
            image: "assets/images/projects/oxygen-pharmacy/Oxygen Pharmacy Thumbnail.webp",
            link: "/portfolios/oxygen-pharmacy",
            tags: ["WordPress", "Healthcare", "Local Delivery"]
        }
    ];

    const shopifyProjects = [
        {
            title: "Oxygen Pharmacy",
            category: "Shopify E-commerce",
            description: "Pharmaceutical marketplace with advanced inventory management, prescription handling, and conversion-focused checkout.",
            image: "assets/images/projects/oxygen-pharmacy/oxygenpharmacy.com.pk thumbnail.webp",
            link: "/portfolios/oxygen-pharmacy",
            tags: ["Shopify", "E-commerce", "Healthcare"]
        }
    ];

    // Dynamic Arrays: When projects are added, their sections/categories automatically appear
    const nextjsProjects = [
        // Add Next.js projects here as they launch; section will automatically appear
    ];

    const seoProjects = [
        // Add dedicated SEO case studies here as they launch; section will automatically appear
    ];

    const projectsContainer = document.getElementById('serviceProjectsGrid');
    if (projectsContainer) {
        const serviceType = projectsContainer.getAttribute('data-service') || 'wordpress';
        let projectList = wordpressProjects;
        if (serviceType === 'shopify') {
            projectList = shopifyProjects;
        } else if (serviceType === 'nextjs') {
            projectList = nextjsProjects;
        } else if (serviceType === 'seo') {
            projectList = seoProjects;
        }

        const projectSection = projectsContainer.closest('section');

        // Dynamically hide if 0 projects, un-hide and render if >= 1 project
        if (projectList.length === 0) {
            if (projectSection) {
                projectSection.style.display = 'none';
            } else {
                projectsContainer.style.display = 'none';
            }
        } else {
            if (projectSection) {
                projectSection.style.display = '';
            }
            projectsContainer.style.display = '';
            const displayProjects = projectList.slice(0, 4);
            
            projectsContainer.innerHTML = displayProjects.map(project => `
                <a href="${project.link}" class="service-project-card">
                    <div class="service-project-media">
                        <img src="${project.image}" alt="${project.title} - ${project.category}" loading="lazy">
                        <div class="service-project-overlay">
                            <span class="service-project-view-btn">View Project →</span>
                        </div>
                    </div>
                    <div class="service-project-info">
                        <span class="service-project-category">${project.category}</span>
                        <h3 class="service-project-title">${project.title}</h3>
                        <p class="service-project-desc">${project.description}</p>
                        <div class="service-project-tags">
                            ${project.tags.map(tag => `<span class="service-project-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </a>
            `).join('');
        }
    }

    // 2. Lead Quote Form Submission Handling
    const quoteForm = document.getElementById('serviceQuoteForm');
    const quoteSuccess = document.getElementById('serviceQuoteSuccess');

    if (quoteForm && quoteSuccess) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = quoteForm.querySelector('.service-form-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending Request...';
            submitBtn.disabled = true;

            // Form data collection
            const formData = new FormData(quoteForm);
            if (!formData.get('access_key')) {
                formData.append('access_key', 'b560614f-4d62-4d5d-a3a5-a6b0bf9a4c41');
            }
            if (!formData.get('to_email')) {
                formData.append('to_email', 'info@abdullahzafar.me');
            }
            
            // Post via fetch to Web3Forms endpoint
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                quoteForm.style.display = 'none';
                quoteSuccess.classList.add('active');
            })
            .catch(error => {
                console.error('Submission notice:', error);
                quoteForm.style.display = 'none';
                quoteSuccess.classList.add('active');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }



    // 4. Smooth Anchor Scrolling for #quote
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});
