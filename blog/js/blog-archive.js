// =============================================
// PUBLIC BLOG ARCHIVE — Fetch, Search, Filter, Render
// =============================================

let currentPage = 1;
const POSTS_PER_PAGE = 9;
let activeCategory = '';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', async () => {
    await loadCategories();
    await loadPosts();
    setupListeners();
});

async function loadCategories() {
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug')
            .order('name');

        if (error) throw error;

        const tabsContainer = document.getElementById('categoryFilterTabs');
        if (categories && categories.length > 0) {
            categories.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'cat-filter-btn';
                btn.textContent = cat.name;
                btn.setAttribute('data-category', cat.id);
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    activeCategory = cat.id;
                    currentPage = 1;
                    loadPosts();
                });
                tabsContainer.appendChild(btn);
            });
        }
    } catch (err) {
        console.warn('[Blog] Categories load error:', err);
    }
}

async function loadPosts() {
    const container = document.getElementById('postsContainer');
    const paginationEl = document.getElementById('blogPagination');
    container.innerHTML = `
        <div class="blog-loading">
            <div class="spinner"></div>
            <p>Loading latest articles…</p>
        </div>
    `;

    try {
        let query = supabase
            .from('posts')
            .select(`
                id, title, slug, excerpt, featured_image, featured_image_alt,
                published_at, content, category_id,
                categories(name, slug)
            `, { count: 'exact' })
            .eq('status', 'published')
            .is('deleted_at', null)
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (activeCategory) {
            query = query.eq('category_id', activeCategory);
        }

        if (searchQuery) {
            query = query.ilike('title', `%${searchQuery}%`);
        }

        const from = (currentPage - 1) * POSTS_PER_PAGE;
        const to = from + POSTS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data: posts, count, error } = await query;

        if (error) throw error;

        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="blog-empty">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" style="margin:0 auto 16px;color:var(--gray)"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                    <h3>No articles published yet</h3>
                    <p>Check back soon for new guides, strategies, and case studies.</p>
                </div>
            `;
            paginationEl.style.display = 'none';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'posts-grid';

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card';

            const catName = post.categories?.name || 'General';
            const catSlug = post.categories?.slug || '';
            const pubDate = formatPublicDate(post.published_at);
            const readTime = calculateReadingTime(post.content || '');

            const imageMarkup = post.featured_image ? `
                <div class="post-card-image">
                    <img src="${escapeHtml(post.featured_image)}" alt="${escapeHtml(post.featured_image_alt || post.title)}" loading="lazy">
                </div>
            ` : `
                <div class="post-card-image">
                    <div class="post-card-image-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
                    </div>
                </div>
            `;

            card.innerHTML = `
                <a href="/blog/${post.slug}" style="text-decoration:none;color:inherit;display:contents">
                    ${imageMarkup}
                    <div class="post-card-body">
                        <div class="post-card-meta">
                            <span class="post-cat-badge">${escapeHtml(catName)}</span>
                            <span class="post-date">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>
                                ${pubDate}
                            </span>
                            <span style="font-size:12px;color:var(--gray)">• ${readTime} min read</span>
                        </div>
                        <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
                        <p class="post-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
                        <div class="post-card-footer">
                            <div class="post-author">
                                <div class="post-author-avatar">AZ</div>
                                <span>Abdullah Zafar</span>
                            </div>
                            <span class="post-read-link">
                                Read Article 
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </span>
                        </div>
                    </div>
                </a>
            `;

            grid.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(grid);

        renderPagination(count);

    } catch (err) {
        console.error('[Blog] Load posts error:', err);
        container.innerHTML = `
            <div class="blog-empty">
                <h3>Failed to load articles</h3>
                <p>Please refresh the page or try again in a few moments.</p>
            </div>
        `;
    }
}

function renderPagination(totalCount) {
    const paginationEl = document.getElementById('blogPagination');
    const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

    if (totalPages <= 1) {
        paginationEl.style.display = 'none';
        return;
    }

    paginationEl.style.display = 'flex';
    paginationEl.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; loadPosts(); window.scrollTo({ top: 400, behavior: 'smooth' }); };
    paginationEl.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; loadPosts(); window.scrollTo({ top: 400, behavior: 'smooth' }); };
        paginationEl.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; loadPosts(); window.scrollTo({ top: 400, behavior: 'smooth' }); };
    paginationEl.appendChild(nextBtn);
}

function setupListeners() {
    const searchInput = document.getElementById('blogSearchInput');
    let timeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            searchQuery = e.target.value.trim();
            currentPage = 1;
            loadPosts();
        }, 350);
    });

    const allBtn = document.querySelector('.cat-filter-btn[data-category=""]');
    allBtn.addEventListener('click', () => {
        document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
        allBtn.classList.add('active');
        activeCategory = '';
        currentPage = 1;
        loadPosts();
    });
}

function calculateReadingTime(html) {
    const text = html.replace(/<[^>]+>/g, '');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
