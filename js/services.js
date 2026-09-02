// Services Section Interactive Component
const servicesData = [
    {
        id: 0,
        number: "01",
        title: "WordPress Website Development",
        badge: "Best for: clinics, academies, service businesses, consultants, and local shops",
        description: `<p>A WordPress developer builds, customizes, and maintains WordPress websites for local and remote businesses. That covers site structure, responsive design, forms, performance, basic SEO, and ongoing maintenance.</p>
                     <p>I choose the setup based on how you'll use the site. If you need simple content editing, I keep the build lightweight. If you need more visual control over layout, I build with Elementor instead. Either way, you get contact forms, WhatsApp click to chat, and a Google Maps location built in.</p>
                     <p><a href="/wordpress-developer-in-faisalabad" class="service-detail-btn">Explore WordPress Services <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></p>`,
        icon: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>`,
        bgColor: "#ff5147"
    },
    {
        id: 1,
        number: "02",
        title: "Shopify and E-Commerce Development",
        badge: "Best for: textile and garment brands, retailers, and shops already selling through Instagram or WhatsApp",
        description: `<p>A Shopify developer builds and customizes online stores, including product pages, collections, navigation, payment options, and store performance.</p>
                     <p>I build Shopify stores with clear collections, product pages, and mobile-friendly navigation. I add cash on delivery and other payment options, plus performance work to keep pages fast. For businesses already selling through Instagram or WhatsApp, the goal is simple. Give customers a proper way to browse products and place an order, instead of a comment thread.</p>
                     <p><a href="/shopify-developer-in-faisalabad" class="service-detail-btn">Explore Shopify Services <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></p>`,
        icon: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>`,
        bgColor: "#ff5147"
    },
    {
        id: 2,
        number: "03",
        title: "Custom Next.js & Web App Development",
        badge: "Best for: startups, SaaS products, custom portals & high-speed platforms",
        description: `<p>Custom web applications, dashboards, and scalable SaaS platforms built with Next.js App Router, React, and TypeScript for sub-second performance.</p>
                     <p>I build secure authentication, database architecture, third-party API integrations, and headless storefronts tailored to your exact product requirements.</p>
                     <p><a href="/nextjs-developer-in-faisalabad" class="service-detail-btn">Explore Next.js Services <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></p>`,
        icon: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>`,
        bgColor: "#ff5147"
    },
    {
        id: 3,
        number: "04",
        title: "Landing Pages and Funnel Websites",
        badge: "Best for: ad campaigns for clinics, academies, real estate listings, and service businesses",
        description: `<p>A landing page built around one goal converts better than a generic homepage. A strong headline, real proof you're trustworthy, and one clear call to action make the biggest difference here.</p>
                     <p>Every page includes structured conversion elements, click-to-WhatsApp, fast mobile loading, and direct lead capture forms.</p>`,
        icon: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>`,
        bgColor: "#ff5147"
    },
    {
        id: 4,
        number: "05",
        title: "Search Engine Optimization (SEO)",
        badge: "Best for: clinics, academies, textile businesses, exporters & local shops",
        description: `<p>I help clinics, academies, textile businesses, and exporters get found on Google, so more of the right people call, message, or walk in.</p>
                     <p>My job is simple: fix what's holding your site back, build up what's working, and explain the results in plain terms, not jargon. Covering on-page, technical audits, Google Business Profile, and local rankings across Faisalabad.</p>
                     <p><a href="/seo-expert-in-faisalabad" class="service-detail-btn">Explore SEO Services <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a></p>`,
        icon: `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>`,
        bgColor: "#ff5147"
    }
];

let currentServiceIndex = 0;

function updateServiceCard(index) {
    const service = servicesData[index];
    const card = document.getElementById('service-card');
    
    // Add transition class
    card.style.opacity = '0.5';
    card.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        document.getElementById('service-icon').innerHTML = service.icon;
        document.getElementById('service-title').textContent = service.title;
        const badgeElement = document.getElementById('service-badge');
        badgeElement.textContent = service.badge;
        badgeElement.style.display = service.badge ? 'inline-block' : 'none';
        document.getElementById('service-description').innerHTML = service.description;
        card.style.background = `linear-gradient(135deg, ${service.bgColor}15 0%, ${service.bgColor}08 100%)`;
        
        // Update active state in list
        document.querySelectorAll('.service-list-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Restore card
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    }, 200);
    
    currentServiceIndex = index;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Service list items click
    document.querySelectorAll('.service-list-item').forEach((item) => {
        item.addEventListener('click', () => {
            const serviceIndex = parseInt(item.getAttribute('data-service'));
            updateServiceCard(serviceIndex);
        });
    });
    
    // Previous button
    document.getElementById('prev-service').addEventListener('click', () => {
        const prevIndex = currentServiceIndex > 0 ? currentServiceIndex - 1 : servicesData.length - 1;
        updateServiceCard(prevIndex);
    });
    
    // Next button
    document.getElementById('next-service').addEventListener('click', () => {
        const nextIndex = currentServiceIndex < servicesData.length - 1 ? currentServiceIndex + 1 : 0;
        updateServiceCard(nextIndex);
    });
    
    // Initialize first service
    updateServiceCard(0);
});
