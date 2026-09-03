# Jazib Rehman Portfolio Website

A pixel-perfect, production-ready personal portfolio website for WordPress & Shopify developer Jazib Rehman, built strictly following the comprehensive blueprint specifications.

## 🎨 Design Features

- **Dark Theme**: Navy-black background (#0d0d12) with purple/violet accent (#7c3aed)
- **Two-Tone Headings**: Signature style with white + purple split headings
- **Dramatic Footer**: Stunning purple-to-pink gradient footer
- **Loading Animation**: Letter-by-letter "LOADING" animation on every page
- **Smooth Animations**: Scroll-triggered fade-ins, counter animations, and transitions
- **Responsive Design**: Mobile-first approach with breakpoints at 768px and 1024px

## 📁 Project Structure

```
jazibrehman-website/
├── index.html                 # Homepage
├── css/
│   ├── styles.css            # Main stylesheet
│   ├── portfolio-page.css    # Portfolio inner page styles
│   └── blog.css              # Blog page styles
├── js/
│   ├── main.js               # Main JavaScript
│   └── portfolio-page.js     # Portfolio page scripts
├── assets/
│   ├── images/               # Project images, avatars, blog images
│   │   └── README.md         # Image requirements guide
│   └── icons/                # Skill icons (SVG)
│       └── README.md         # Icon requirements guide
├── portfolios/
│   └── oxygen-pharmacy.html  # Sample portfolio project page
├── blog/
│   └── index.html            # Blog archive page
└── README.md                 # This file
```

## 🚀 Features Implemented

### Homepage Sections
1. ✅ **Hero Section** - Two-column layout with profile image and CTA
2. ✅ **Stats Counter** - Animated counters (5+ years, 50+ projects, 25+ clients, 18+ stores)
3. ✅ **Services Accordion** - Interactive accordion with 4 services
4. ✅ **Portfolio Grid** - 2-column project showcase
5. ✅ **Resume Section** - Two-column Experience & Education
6. ✅ **Skills Grid** - Icon-based skill display with percentages
7. ✅ **Testimonials Slider** - Auto-rotating testimonial cards
8. ✅ **Blog Section** - Latest blog posts preview
9. ✅ **FAQ Accordion** - Expandable Q&A section
10. ✅ **Contact Form** - Service selection, name, email, message fields
11. ✅ **Footer** - Gradient background with 3-column layout

### Inner Pages
- ✅ **Portfolio Project Page** - Full-width hero banner, project details, image gallery, scrolling marquee
- ✅ **Blog Archive Page** - Vertical list of blog posts with images

### Interactive Elements
- ✅ Loading screen animation
- ✅ Smooth scroll navigation
- ✅ Stats counter animation on scroll
- ✅ Service accordion toggle
- ✅ FAQ accordion toggle
- ✅ Testimonials auto-slider
- ✅ Navbar scroll effect
- ✅ Mobile hamburger menu
- ✅ Form submission handling
- ✅ Facebook Pixel integration

## 🎯 Design Specifications

### Color Palette
- **Background**: #0d0d12 (dark navy-black)
- **Cards**: #13131f / #16162a
- **Active/Highlight**: #1e1b4b
- **Accent Purple**: #7c3aed → #a855f7
- **Text Primary**: #ffffff
- **Text Secondary**: #8b8b9a
- **Text Muted**: #6b6b80

### Typography
- **Font Family**: Inter (Google Fonts)
- **Hero Title**: 42px, weight 800
- **Section Titles**: 32px, weight 700
- **Body Text**: 14px, weight 400
- **Two-tone pattern**: First word white, key word purple

### Layout
- **Max Content Width**: 860px (centered)
- **Section Padding**: 100px top/bottom
- **Card Padding**: 24px
- **Grid Gaps**: 12-20px

## 📦 Installation & Setup

1. **Clone or download** this repository
2. **Add images** to `assets/images/` (see assets/images/README.md for requirements)
3. **Add icons** to `assets/icons/` (see assets/icons/README.md for requirements)
4. **Open index.html** in a web browser

### Required Assets

#### Images Needed:
- Portfolio project screenshots (800x600px recommended)
- Blog post featured images (600x400px recommended)
- Testimonial avatars (200x200px square)
- Hero background for portfolio pages

#### Icons Needed (SVG):
- WordPress logo
- Shopify logo
- Elementor logo
- WooCommerce logo
- UI/UX icon
- Cloudflare logo

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## ⚡ Performance Features

- Lazy loading for images
- Optimized animations with CSS transforms
- Minimal JavaScript dependencies
- Efficient CSS with CSS variables
- Intersection Observer for scroll animations

## 🔧 Customization

### Changing Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
    --bg-primary: #0d0d12;
    --accent-purple: #7c3aed;
    /* ... other variables */
}
```

### Modifying Content
- **Homepage**: Edit `index.html`
- **Services**: Update `.service-item` sections
- **Portfolio**: Add new cards in `.portfolio-grid`
- **Resume**: Modify `.resume-card` entries
- **Skills**: Update `.skill-item` elements

### Adding New Portfolio Pages
1. Copy `portfolios/oxygen-pharmacy.html`
2. Rename and update content
3. Add corresponding images
4. Link from homepage portfolio grid

## 📧 Contact Information

- **Email**: 4malikabdullah@gmail.com | info@abdullahzafar.me
- **Phone**: +92 325 6574681
- **Location**: Bahria Town, Lahore, Pakistan

## 🎓 Credits

- **Design & Development**: Based on jazibrehman.com blueprint
- **Fonts**: Inter by Google Fonts
- **Icons**: Brand logos from respective companies

## 📄 License

© ALL RIGHTS RESERVED BY JAZIB REHMAN

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Replace all placeholder images with actual project images
- [ ] Add all skill icons (SVG format)
- [ ] Test all forms and ensure backend integration
- [ ] Verify all internal links work correctly
- [ ] Test on multiple devices and browsers
- [ ] Optimize all images for web (compress)
- [ ] Add Google Analytics tracking code
- [ ] Configure Facebook Pixel with correct ID
- [ ] Set up contact form backend (PHP/Node.js)
- [ ] Add SSL certificate (HTTPS)
- [ ] Test page load speed (aim for <3s)
- [ ] Verify SEO meta tags on all pages
- [ ] Test mobile navigation thoroughly
- [ ] Check accessibility (ARIA labels, alt text)

## 🐛 Known Issues / TODO

- Contact form needs backend integration
- Portfolio and blog pages need actual content
- Mobile menu animation can be enhanced
- Add more portfolio project pages
- Create individual blog post pages
- Add social media links
- Implement actual testimonial rotation logic
- Add portfolio filtering by category

## 💡 Future Enhancements

- Add dark/light mode toggle
- Implement blog search functionality
- Add portfolio filtering and sorting
- Create admin panel for content management
- Add newsletter subscription
- Implement live chat widget
- Add case study pages for major projects
- Create downloadable resume PDF
- Add project timeline visualization
- Implement client logo carousel

---

**Built with ❤️ following the complete jazibrehman.com blueprint**
