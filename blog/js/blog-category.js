// =============================================
// PUBLIC CATEGORY ARCHIVE — Fetch Category & Posts
// =============================================

document.addEventListener('DOMContentLoaded', async () => {
    const slug = getCategorySlug();
    if (!slug) {
        showCat404('Category Not Found', 'No category slug was provided in the URL.');
        return;
    }

    await loadCategoryAndPosts(slug);
});

function getCategorySlug() {
    const urlParams = new URLSearchParams(window.location.search);
    const querySlug = urlParams.get('slug');
    if (querySlug) return querySlug;

    // Path fallback: /blog/category/some-slug
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const catIndex = pathParts.indexOf('category');
    if (catIndex !== -1 && pathParts[catIndex + 1]) {
        return pathParts[catIndex + 1].replace('.html', '');
    }
    return null;
}

async function loadCategoryAndPosts(slug) {
    const container = document.getElementById('categoryPostsContainer');

    try {
        // 1. Fetch Category Details
        const { data: cat, error: catError } = await supabase
            .from('categories')
            .select('*')
            .eq('slug', slug)
            .single();

        if (catError || !cat) {
            showCat404('Category Not Found', `The category "${slug}" does not exist.`);
            return;
        }

        // Set SEO Meta
        const seoTitle = cat.seo_title || `${cat.name} Articles | Abdullah Zafar Blog`;
        const seoDesc = cat.seo_desc || cat.description || `Read all articles and guides in ${cat.name}.`;
        document.title = seoTitle;

        let descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) descMeta.content = seoDesc;

        let canonicalMeta = document.getElementById('canonicalMeta');
        if (canonicalMeta) canonicalMeta.href = `https://www.abdullahzafar.me/blog/category.html?slug=${cat.slug}`;

        // Header content
        document.getElementById('catTitle').textContent = cat.name;
        document.getElementById('catBreadcrumb').textContent = cat.name;
        if (cat.description) {
            document.getElementById('catDesc').textContent = cat.description;
        } else {
            document.getElementById('catDesc').style.display = 'none';
        }

        // 2. Fetch Category Posts
        const { data: posts, error: postsError } = await supabase
            .from('posts')
            .select(`
                id, title, slug, excerpt, featured_image, featured_image_alt,
                published_at, content
            `)
            .eq('category_id', cat.id)
            .eq('status', 'published')
            .is('deleted_at', null)
            .lte('published_at', new Date().toISOString())
            .order('published_at', { ascending: false });

        if (postsError) throw postsError;

        if (!posts || posts.length === 0) {
            container.innerHTML = `
                <div class="blog-empty">
                    <h3>No articles in this category yet</h3>
                    <p>Check back soon for new guides and tutorials in ${cat.name}.</p>
                    <a href="/blog/" class="btn btn-primary" style="margin-top:16px;display:inline-flex">Browse All Articles</a>
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'posts-grid';

        posts.forEach(post => {
            const card = document.createElement('article');
            card.className = 'post-card';
            const pubDate = formatPublicDate(post.published_at);
            const readTime = calculateReadingTime(post.content || '');

            const imageMarkup = post.featured_image ? `
                <div class="post-card-image">
                    <img src="${escapeHtml(post.featured_image)}" alt="${escapeHtml(post.featured_image_alt || post.title)}" loading="lazy">
                </div>
            ` : '';

            card.innerHTML = `
                <a href="/blog/${post.slug}" style="text-decoration:none;color:inherit;display:contents">
                    ${imageMarkup}
                    <div class="post-card-body">
                        <div class="post-card-meta">
                            <span class="post-cat-badge">${escapeHtml(cat.name)}</span>
                            <span class="post-date">${pubDate}</span>
                            <span style="font-size:12px;color:var(--gray)">• ${readTime} min read</span>
                        </div>
                        <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
                        <p class="post-card-excerpt">${escapeHtml(post.excerpt || '')}</p>
                        <div class="post-card-footer">
                            <div class="post-author">
                                <div class="post-author-avatar">AZ</div>
                                <span>Abdullah Zafar</span>
                            </div>
                            <span class="post-read-link">Read Article →</span>
                        </div>
                    </div>
                </a>
            `;
            grid.appendChild(card);
        });

        container.innerHTML = '';
        container.appendChild(grid);

    } catch (err) {
        console.error('[BlogCategory] Load error:', err);
        showCat404('Error Loading Category', 'Failed to retrieve articles at this time.');
    }
}

function showCat404(title, msg) {
    document.title = `${title} | Abdullah Zafar`;
    const container = document.getElementById('categoryPostsContainer');
    container.innerHTML = `
        <div class="blog-empty">
            <h2 style="color:var(--coral-red)">${escapeHtml(title)}</h2>
            <p>${escapeHtml(msg)}</p>
            <a href="/blog/" class="btn btn-primary" style="margin-top:16px;display:inline-flex">← Return to Blog</a>
        </div>
    `;
    document.getElementById('catTitle').textContent = title;
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
