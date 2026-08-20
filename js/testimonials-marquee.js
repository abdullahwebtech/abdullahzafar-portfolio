// Testimonials Dual-Row Reverse Marquee with Drag
// Updated with more testimonials and premium UI/UX

const testimonialsData = [
    {
        id: 1,
        quote: "Abdullah built our clinic website and made the whole process very easy. Patients now find us online before visiting, which has helped us manage appointments better. The site works well on mobile, and he responds quickly whenever we need help.",
        name: "Dr. Hassan Ahmed",
        title: "Medical Practitioner",
        avatar: "https://i.pravatar.cc/150?img=12"
    },
    {
        id: 2,
        quote: "We needed a proper online presence for our textile business. Abdullah created a clean catalog site that shows our products clearly. International buyers can now browse everything before contacting us.",
        name: "Bilal Khan",
        title: "CEO, Textile Export Company",
        avatar: "https://i.pravatar.cc/150?img=13"
    },
    {
        id: 3,
        quote: "The website loads fast and looks professional. Parents check our academy details online before calling, which saves time for everyone. Abdullah kept everything simple and delivered on schedule.",
        name: "Fahad Malik",
        title: "Academy Director",
        avatar: "https://i.pravatar.cc/150?img=33"
    },
    {
        id: 4,
        quote: "Our shop was only on Instagram before. Abdullah set up a proper website with WhatsApp ordering, and now customers can browse products anytime. The site works smoothly, and he trained us to update it ourselves.",
        name: "Ayesha Iqbal",
        title: "Retail Shop Owner",
        avatar: "https://i.pravatar.cc/150?img=45"
    },
    {
        id: 5,
        quote: "Abdullah handled our website migration without any downtime. He explained everything clearly and made sure all our old pages still worked. The new site is faster, and we haven't had any technical problems since launch.",
        name: "Umar Farooq",
        title: "Service Business Owner",
        avatar: "https://i.pravatar.cc/150?img=59"
    },
    {
        id: 6,
        quote: "I was looking for a local developer who understood the Faisalabad market. Abdullah delivered a website that actually works for our business. Clients find us through Google now, and the inquiry form makes it easy for them to reach us.",
        name: "Sarah Nadeem",
        title: "Business Consultant",
        avatar: "https://i.pravatar.cc/150?img=47"
    },
    {
        id: 7,
        quote: "The property listing site works exactly as we needed. Buyers can filter locations and view details before contacting us. It's straightforward, mobile-friendly, and easier to manage than we expected.",
        name: "Ahmed Raza",
        title: "Real Estate Agent",
        avatar: "https://i.pravatar.cc/150?img=68"
    },
    {
        id: 8,
        quote: "Working with Abdullah was seamless. He understood our requirements quickly and delivered a beautiful e-commerce store that converts visitors into customers. The checkout process is smooth and secure.",
        name: "Zainab Ali",
        title: "E-commerce Store Owner",
        avatar: "https://i.pravatar.cc/150?img=43"
    },
    {
        id: 9,
        quote: "Our restaurant website looks amazing! The online menu is easy to update, and we've seen a significant increase in reservations since launch. Abdullah's attention to detail made all the difference.",
        name: "Hassan Mahmood",
        title: "Restaurant Owner",
        avatar: "https://i.pravatar.cc/150?img=52"
    },
    {
        id: 10,
        quote: "Abdullah created a stunning portfolio website for my photography business. The gallery loads fast, looks professional, and clients love browsing through my work. Highly recommend his services!",
        name: "Maria Khan",
        title: "Professional Photographer",
        avatar: "https://i.pravatar.cc/150?img=38"
    },
    {
        id: 11,
        quote: "The law firm website Abdullah built for us establishes credibility and makes it easy for potential clients to reach us. The case study section is particularly well done. Excellent work!",
        name: "Adnan Tariq",
        title: "Senior Partner, Law Firm",
        avatar: "https://i.pravatar.cc/150?img=60"
    },
    {
        id: 12,
        quote: "Abdullah developed a custom booking system for our salon that integrates perfectly with our website. Customers can book appointments online, and it has reduced phone calls significantly.",
        name: "Fatima Noor",
        title: "Salon Owner",
        avatar: "https://i.pravatar.cc/150?img=32"
    },
    {
        id: 13,
        quote: "The e-learning platform Abdullah created for our institute is intuitive and works perfectly. Students can access courses easily, and the payment integration is seamless. We've had zero technical issues.",
        name: "Imran Siddiqui",
        title: "Education Institute Director",
        avatar: "https://i.pravatar.cc/150?img=51"
    },
    {
        id: 14,
        quote: "Abdullah redesigned our corporate website with a modern look that matches our brand. The content management system he set up allows us to update news and announcements ourselves without any hassle.",
        name: "Nadia Rehman",
        title: "Corporate Communications Manager",
        avatar: "https://i.pravatar.cc/150?img=44"
    },
    {
        id: 15,
        quote: "Our charity organization needed a donation portal, and Abdullah delivered exactly what we required. The site clearly explains our mission, and donors find it easy to contribute online.",
        name: "Khalid Hussain",
        title: "NGO Founder",
        avatar: "https://i.pravatar.cc/150?img=56"
    },
    {
        id: 16,
        quote: "The gym website Abdullah built includes a class schedule, membership plans, and an inquiry form. Members check timings online before visiting, which has streamlined our front desk operations.",
        name: "Sana Malik",
        title: "Fitness Center Owner",
        avatar: "https://i.pravatar.cc/150?img=41"
    },
    {
        id: 17,
        quote: "Abdullah created an impressive portfolio site for my architectural firm. The project gallery showcases our designs beautifully, and potential clients often mention how professional the website looks.",
        name: "Arslan Ahmed",
        title: "Principal Architect",
        avatar: "https://i.pravatar.cc/150?img=57"
    },
    {
        id: 18,
        quote: "We run a wholesale business, and Abdullah built a catalog website that our retailers use daily. Product details are clear, ordering is straightforward, and the site loads quickly even with hundreds of items.",
        name: "Tariq Mahmood",
        title: "Wholesale Business Owner",
        avatar: "https://i.pravatar.cc/150?img=14"
    },
    {
        id: 19,
        quote: "Abdullah helped us launch our online coaching platform. The course structure is logical, video integration works smoothly, and students report a great learning experience. Very satisfied with the result.",
        name: "Hina Aslam",
        title: "Online Course Instructor",
        avatar: "https://i.pravatar.cc/150?img=48"
    },
    {
        id: 20,
        quote: "The event management website Abdullah designed for us showcases our past events with stunning galleries. Clients book directly through the contact form, and we've noticed an uptick in inquiries.",
        name: "Faisal Raza",
        title: "Event Management Company Owner",
        avatar: "https://i.pravatar.cc/150?img=69"
    }
];

// Create testimonial card HTML
function createTestimonialCard(testimonial) {
    return `
        <div class="testimonial-card-modern" data-id="${testimonial.id}">
            <div class="quote-mark">"</div>
            <p class="testimonial-text">${testimonial.quote}</p>
            <div class="testimonial-footer">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="testimonial-avatar" loading="lazy">
                <div class="testimonial-author-info">
                    <h4 class="testimonial-author-name">${testimonial.name}</h4>
                    <p class="testimonial-author-title">${testimonial.title}</p>
                </div>
            </div>
        </div>
    `;
}

// Initialize marquee rows
function initializeMarquee() {
    const topRow = document.getElementById('marquee-top');
    const bottomRow = document.getElementById('marquee-bottom');
    
    if (!topRow || !bottomRow) return;
    
    // Split testimonials for two rows (10 each)
    const firstHalf = testimonialsData.slice(0, 10);
    const secondHalf = testimonialsData.slice(10, 20);
    
    // Create cards for each row - OCTUPLE (8 copies) for absolute guarantee no gaps
    const topHTML = [
        ...firstHalf, ...firstHalf, ...firstHalf, ...firstHalf,
        ...firstHalf, ...firstHalf, ...firstHalf, ...firstHalf
    ].map(createTestimonialCard).join('');
    
    const bottomHTML = [
        ...secondHalf, ...secondHalf, ...secondHalf, ...secondHalf,
        ...secondHalf, ...secondHalf, ...secondHalf, ...secondHalf
    ].map(createTestimonialCard).join('');
    
    topRow.innerHTML = topHTML;
    bottomRow.innerHTML = bottomHTML;
}

// Marquee animation class
class MarqueeAnimation {
    constructor(row) {
        this.row = row;
        this.content = row.querySelector('.marquee-content');
        this.direction = parseInt(row.dataset.direction) || 1;
        this.position = 0;
        this.velocity = 0;
        this.targetVelocity = this.direction * 2.4; // DOUBLED SPEED: was 1.2, now 2.4
        this.isDragging = false;
        this.isPaused = false;
        this.startX = 0;
        this.startPosition = 0;
        this.lastX = 0;
        this.lastTime = Date.now();
        
        this.init();
    }
    
    init() {
        // Mouse events
        this.row.addEventListener('mousedown', this.onDragStart.bind(this));
        document.addEventListener('mousemove', this.onDragMove.bind(this));
        document.addEventListener('mouseup', this.onDragEnd.bind(this));
        
        // Touch events
        this.row.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.onDragEnd.bind(this));
        
        // Pause on hover
        this.row.addEventListener('mouseenter', () => {
            if (!this.isDragging) {
                this.isPaused = true;
            }
        });
        
        this.row.addEventListener('mouseleave', () => {
            this.isPaused = false;
        });
        
        // Start animation
        this.animate();
    }
    
    onDragStart(e) {
        this.isDragging = true;
        this.startX = e.pageX;
        this.lastX = e.pageX;
        this.startPosition = this.position;
        this.velocity = 0;
        this.lastTime = Date.now();
        this.row.style.cursor = 'grabbing';
    }
    
    onTouchStart(e) {
        this.isDragging = true;
        this.startX = e.touches[0].pageX;
        this.lastX = e.touches[0].pageX;
        this.startPosition = this.position;
        this.velocity = 0;
        this.lastTime = Date.now();
    }
    
    onDragMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const currentX = e.pageX;
        const currentTime = Date.now();
        const deltaX = currentX - this.lastX;
        const deltaTime = currentTime - this.lastTime;
        
        // Calculate drag velocity
        if (deltaTime > 0) {
            this.velocity = (deltaX / deltaTime) * 16; // Normalize to 60fps
        }
        
        // Update position based on drag
        this.position = this.startPosition + (currentX - this.startX) * this.direction;
        
        this.lastX = currentX;
        this.lastTime = currentTime;
    }
    
    onTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const currentX = e.touches[0].pageX;
        const currentTime = Date.now();
        const deltaX = currentX - this.lastX;
        const deltaTime = currentTime - this.lastTime;
        
        if (deltaTime > 0) {
            this.velocity = (deltaX / deltaTime) * 16;
        }
        
        this.position = this.startPosition + (currentX - this.startX) * this.direction;
        
        this.lastX = currentX;
        this.lastTime = currentTime;
    }
    
    onDragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.row.style.cursor = 'grab';
        
        // Apply inertia with deceleration
        this.velocity *= this.direction;
    }
    
    animate() {
        if (!this.isDragging && !this.isPaused) {
            // Apply friction/deceleration
            const friction = 0.95;
            this.velocity *= friction;
            
            // Return to base speed gradually
            const returnSpeed = 0.02;
            this.velocity += (this.targetVelocity - this.velocity) * returnSpeed;
            
            // Update position
            this.position += this.velocity;
        }
        
        // BULLETPROOF INFINITE LOOP using modulo operator
        const cardWidth = 420 + 24; // card width + gap (444px)
        const cardsPerSet = 10; // 10 unique cards per row
        const setWidth = cardWidth * cardsPerSet; // One complete set (4440px)
        
        // Use modulo to ensure position is ALWAYS within bounds
        // This handles both positive and negative directions perfectly
        this.position = ((this.position % setWidth) + setWidth) % setWidth;
        
        // Apply transform
        this.content.style.transform = `translateX(${-this.position}px)`;
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeMarquee();
    
    // Initialize animations for both rows
    const topRow = document.querySelector('.marquee-row-top');
    const bottomRow = document.querySelector('.marquee-row-bottom');
    
    if (topRow) {
        const topAnimation = new MarqueeAnimation(topRow);
        // Start from beginning for top row
        topAnimation.position = 0;
    }
    
    if (bottomRow) {
        const bottomAnimation = new MarqueeAnimation(bottomRow);
        // Start from middle for bottom row to create offset effect
        const cardWidth = 420 + 24;
        const cardsPerSet = 10;
        bottomAnimation.position = (cardWidth * cardsPerSet) / 2;
    }
});
