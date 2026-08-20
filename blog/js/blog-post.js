// =============================================
// PUBLIC SINGLE BLOG POST — Fetch, Render, TOC & Schema
// =============================================

let currentPost = null;

document.addEventListener('DOMContentLoaded', async () => {
    const slug = getPostSlug();
    const urlParams = new URLSearchParams(window.location.search);
    const isPreview = urlParams.get('preview') === 'true';

    if (!slug) {
        show404('Article Not Found', 'The URL does not specify a valid blog post slug.');
        return;
    }

    await loadPost(slug, isPreview);
});

function getPostSlug() {
    const urlParams = new URLSearchParams(window.location.search);
    const querySlug = urlParams.get('slug');
    if (querySlug) return querySlug;

    // Path fallback: /blog/post-slug or /blog/post-slug/
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length >= 2 && pathParts[0] === 'blog') {
        const lastPart = pathParts[1];
        if (lastPart !== 'index.html' && lastPart !== 'post.html' && lastPart !== 'category.html' && lastPart !== 'category') {
            return lastPart.replace('.html', '');
        }
    }
    return null;
}

async function loadPost(slug, isPreview) {
    const articleEl = document.getElementById('articleBody');

    try {
        let query = supabase
            .from('posts')
            .select(`
                id, title, slug, excerpt, content, featured_image, featured_image_alt,
                status, focus_keyword, seo_title, seo_desc, canonical_url,
                og_title, og_desc, og_image, robots_directive,
                published_at, created_at, updated_at, category_id,
                categories(id, name, slug)
            `)
            .eq('slug', slug)
            .is('deleted_at', null);

        if (!isPreview) {
            query = query
                .eq('status', 'published')
                .lte('published_at', new Date().toISOString());
        }

        const { data: post, error } = await query.single();

        if (error || !post) {
            show404('Article Not Found', 'This post might be a draft, deleted, or does not exist.');
            return;
        }

        currentPost = post;

        // 1. Populate SEO Meta & Headings
        injectPostSeo(post);

        // 2. Populate Header
        document.getElementById('postMainTitle').textContent = post.title;
        document.getElementById('breadcrumbTitle').textContent = post.title;

        if (post.excerpt) {
            document.getElementById('postLeadExcerpt').textContent = post.excerpt;
        } else {
            document.getElementById('postLeadExcerpt').style.display = 'none';
        }

        const cat = post.categories;
        const catBadge = document.getElementById('postCatBadge');
        const breadcrumbCat = document.getElementById('breadcrumbCat');

        if (cat) {
            catBadge.textContent = cat.name;
            breadcrumbCat.textContent = cat.name;
            breadcrumbCat.href = `/blog/category.html?slug=${cat.slug}`;
        } else {
            catBadge.textContent = 'General';
            breadcrumbCat.textContent = 'General';
            breadcrumbCat.href = '/blog/';
        }

        document.getElementById('postPubDate').textContent = formatPublicDate(post.published_at || post.created_at);
        document.getElementById('postReadTime').textContent = `• ${calculateReadingTime(post.content || '')} min read`;

        // 3. Featured Image
        if (post.featured_image) {
            const imgWrap = document.getElementById('featuredImageWrap');
            const imgEl = document.getElementById('postFeaturedImage');
            imgEl.src = post.featured_image;
            imgEl.alt = post.featured_image_alt || post.title;
            imgWrap.style.display = 'block';
        }

        // 4. Sanitize and Inject Article HTML
        const cleanHtml = DOMPurify.sanitize(post.content || '', {
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target']
        });
        articleEl.innerHTML = cleanHtml;

        // 5. Generate Table of Contents (TOC)
        generateTableOfContents();

        // 6. Generate Structured Data Schema (JSON-LD)
        injectSchema(post);

        // 7. Load Related Posts
        if (post.category_id) {
            loadRelatedPosts(post.category_id, post.id);
        }

    } catch (err) {
        console.error('[BlogPost] Error loading post:', err);
        show404('Error Loading Article', 'Unable to retrieve the requested article at this time.');
    }
}

function injectPostSeo(post) {
    const title = post.seo_title || post.title;
    const desc = post.seo_desc || post.excerpt || '';
    const canonical = post.canonical_url || `https://abdullahzafar.me/blog/${post.slug}`;
    const ogImage = post.og_image || post.featured_image || 'https://abdullahzafar.me/Web%20developer%20in%20Faisalabad%20-%20Abdullah%20zafar.webp';
    const robots = post.robots_directive || 'index, follow';

    // Title & Meta
    document.title = `${title} | Abdullah Zafar`;
    
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.content = desc;

    let robotsMeta = document.getElementById('robotsMeta') || document.querySelector('meta[name="robots"]');
    if (robotsMeta) robotsMeta.content = robots;

    let canonicalMeta = document.getElementById('canonicalMeta') || document.querySelector('link[rel="canonical"]');
    if (canonicalMeta) canonicalMeta.href = canonical;

    // Open Graph
    setOgMeta('og:title', post.og_title || title);
    setOgMeta('og:description', post.og_desc || desc);
    setOgMeta('og:url', canonical);
    setOgMeta('og:image', ogImage);
}

function setOgMeta(property, content) {
    let el = document.querySelector(`meta[property="${property}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
    }
    el.content = content;
}

function generateTableOfContents() {
    const articleEl = document.getElementById('articleBody');
    const headings = articleEl.querySelectorAll('h2, h3');
    const tocList = document.getElementById('tocList');
    const tocWidget = document.getElementById('tocWidget');

    if (!headings || headings.length < 2) {
        tocWidget.style.display = 'none';
        return;
    }

    tocList.innerHTML = '';
    headings.forEach((h, index) => {
        const text = h.textContent.trim();
        const id = h.id || `section-${index + 1}`;
        h.id = id;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.className = `toc-link ${h.tagName.toLowerCase() === 'h3' ? 'toc-h3' : ''}`;
        a.href = `#${id}`;
        a.textContent = text;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    tocWidget.style.display = 'block';
}

function injectSchema(post) {
    const canonical = post.canonical_url || `https://abdullahzafar.me/blog/${post.slug}`;
    const pubDate = post.published_at || post.created_at;
    const modDate = post.updated_at || pubDate;

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BlogPosting",
                "@id": `${canonical}#article`,
                "isPartOf": {
                    "@type": "Blog",
                    "@id": "https://abdullahzafar.me/blog/",
                    "name": "Abdullah Zafar Blog"
                },
                "headline": post.title,
                "description": post.seo_desc || post.excerpt,
                "url": canonical,
                "datePublished": pubDate,
                "dateModified": modDate,
                "mainEntityOfPage": canonical,
                "inLanguage": "en-US",
                "image": post.featured_image ? {
                    "@type": "ImageObject",
                    "url": post.featured_image
                } : undefined,
                "author": {
                    "@type": "Person",
                    "name": "Abdullah Zafar",
                    "url": "https://abdullahzafar.me"
                },
                "publisher": {
                    "@type": "Person",
                    "name": "Abdullah Zafar",
                    "url": "https://abdullahzafar.me"
                }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonical}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://abdullahzafar.me"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Blog",
                        "item": "https://abdullahzafar.me/blog/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": post.categories?.name || "General",
                        "item": post.categories?.slug ? `https://abdullahzafar.me/blog/category.html?slug=${post.categories.slug}` : "https://abdullahzafar.me/blog/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 4,
                        "name": post.title
                    }
                ]
            }
        ]
    };

    const scriptEl = document.getElementById('schemaPlaceholder');
    if (scriptEl) {
        scriptEl.textContent = JSON.stringify(schema, null, 2);
    }
}

async function loadRelatedPosts(categoryId, excludeId) {
    try {
        const { data: posts } = await supabase
            .from('posts')
            .select(`
                id, title, slug, excerpt, featured_image, featured_image_alt, published_at,
                categories(name)
            `)
            .eq('status', 'published')
            .eq('category_id', categoryId)
            .neq('id', excludeId)
            .is('deleted_at', null)
            .lte('published_at', new Date().toISOString())
            .limit(3);

        if (!posts || posts.length === 0) return;

        const section = document.getElementById('relatedSection');
        const grid = document.getElementById('relatedGrid');
        grid.innerHTML = '';

        posts.forEach(p => {
            const card = document.createElement('article');
            card.className = 'post-card';
            card.innerHTML = `
                <a href="/blog/${p.slug}" style="text-decoration:none;color:inherit;display:contents">
                    ${p.featured_image ? `
                        <div class="post-card-image">
                            <img src="${p.featured_image}" alt="${p.featured_image_alt || p.title}" loading="lazy">
                        </div>
                    ` : ''}
                    <div class="post-card-body">
                        <span class="post-cat-badge">${p.categories?.name || 'Article'}</span>
                        <h3 class="post-card-title" style="font-size:15px">${p.title}</h3>
                        <p class="post-card-excerpt" style="font-size:13px">${p.excerpt || ''}</p>
                    </div>
                </a>
            `;
            grid.appendChild(card);
        });

        section.style.display = 'block';

    } catch (err) {
        console.warn('[BlogPost] Related posts error:', err);
    }
}

function show404(title, message) {
    document.title = `${title} | Abdullah Zafar`;
    const header = document.getElementById('postHeader');
    header.innerHTML = `
        <div class="container" style="padding:40px 0 60px">
            <h1 class="post-h1" style="color:var(--coral-red)">${escapeHtml(title)}</h1>
            <p class="post-excerpt-lead" style="color:rgba(255,255,255,0.7)">${escapeHtml(message)}</p>
            <div style="margin-top:24px">
                <a href="/blog/" class="btn btn-primary" style="display:inline-flex">← Return to Blog Archive</a>
            </div>
        </div>
    `;
    document.getElementById('featuredImageWrap').style.display = 'none';
    document.getElementById('articleBody').innerHTML = '';
    document.getElementById('tocWidget').style.display = 'none';
}

// Share Functions
window.shareTwitter = function() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
};

window.shareLinkedIn = function() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
};

window.copyPostLink = function() {
    navigator.clipboard.writeText(window.location.href);
    alert('Article link copied to clipboard!');
};

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
