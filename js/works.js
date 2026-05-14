// ===================================
// WORKS PAGE - FILTER & PAGINATION
// ===================================

const ITEMS_PER_PAGE = 6;
let currentPage = 1;
let currentFilter = 'all';

const filterTabs = document.querySelectorAll('.filter-tab');
const allCards = Array.from(document.querySelectorAll('.work-card'));
const paginationPrev = document.querySelector('.pagination-prev');
const paginationNext = document.querySelector('.pagination-next');
const paginationCurrent = document.querySelector('.pagination-current');
const paginationTotal = document.querySelector('.pagination-total');
const paginationControls = document.querySelector('.pagination-controls');

// Get filtered cards based on current filter
function getFilteredCards() {
    if (currentFilter === 'all') return allCards;
    return allCards.filter(card => {
        const category = card.getAttribute('data-category');
        return category.includes(currentFilter);
    });
}

// Calculate total pages for current filter
function getTotalPages() {
    const filteredCards = getFilteredCards();
    return Math.max(1, Math.ceil(filteredCards.length / ITEMS_PER_PAGE));
}

// Show/hide cards based on current page and filter
function renderCards() {
    const filteredCards = getFilteredCards();
    const totalPages = getTotalPages();

    // Ensure current page is valid
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Hide all cards first
    allCards.forEach(card => {
        card.style.display = 'none';
        card.classList.remove('show');
    });

    // Show only cards for the current page within the filtered set
    filteredCards.forEach((card, index) => {
        if (index >= startIndex && index < endIndex) {
            card.style.display = 'block';
            card.classList.add('show');
        }
    });

    // Update pagination UI
    paginationCurrent.textContent = currentPage;
    paginationTotal.textContent = totalPages;

    // Update button states
    paginationPrev.disabled = currentPage <= 1;
    paginationNext.disabled = currentPage >= totalPages;

    // Show/hide pagination based on total pages
    if (totalPages <= 1) {
        paginationControls.style.display = 'none';
    } else {
        paginationControls.style.display = 'flex';
    }
}

// Filter tab click handler
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update filter and reset to page 1
        currentFilter = tab.getAttribute('data-filter');
        currentPage = 1;
        renderCards();

        // Smooth scroll to grid
        document.querySelector('.works-grid-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Pagination click handlers
paginationPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderCards();
        document.querySelector('.works-grid-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

paginationNext.addEventListener('click', () => {
    if (currentPage < getTotalPages()) {
        currentPage++;
        renderCards();
        document.querySelector('.works-grid-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});

// Initial render
renderCards();

// Smooth scroll for anchor links
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
