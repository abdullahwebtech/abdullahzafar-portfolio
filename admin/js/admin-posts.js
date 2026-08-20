// =============================================
// ADMIN POSTS LIST — Search, Filter, Actions, Pagination
// =============================================

let currentPage = 1;
const PAGE_SIZE = 10;
let totalPostsCount = 0;
let categoriesMap = {};

(async () => {
    // 1. Auth Guard
    const auth = await AdminAuth.check();
    if (!auth) return;

    // 2. Initialize
    await loadCategories();
    await loadPosts();
    setupEventListeners();
})();

async function loadCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name')
            .order('name');
        
        if (error) throw error;

        const select = document.getElementById('categoryFilter');
        if (data) {
            data.forEach(cat => {
                categoriesMap[cat.id] = cat.name;
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                select.appendChild(opt);
            });
        }
    } catch (err) {
        console.error('[Posts] Error loading categories:', err);
    }
}

async function loadPosts() {
    const wrap = document.getElementById('postsTableWrap');
    const paginationEl = document.getElementById('pagination');
    wrap.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

    const search = document.getElementById('searchInput').value.trim();
    const status = document.getElementById('statusFilter').value;
    const categoryId = document.getElementById('categoryFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    try {
        let query = supabase
            .from('posts')
            .select(`
                id, title, slug, status, focus_keyword,
                created_at, updated_at, published_at, scheduled_at,
                category_id, categories(name)
            `, { count: 'exact' })
            .is('deleted_at', null);

        if (search) {
            query = query.ilike('title', `%${search}%`);
        }
        if (status) {
            query = query.eq('status', status);
        }
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        // Sorting
        const ascending = sortBy === 'title';
        query = query.order(sortBy, { ascending: ascending, nullsFirst: false });

        // Pagination
        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);

        const { data: posts, count, error } = await query;

        if (error) throw error;

        totalPostsCount = count || 0;

        if (!posts || posts.length === 0) {
            wrap.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <h3>No posts found</h3>
                    <p>No blog posts match your current search or filters.</p>
                    <a href="/admin/editor.html" class="btn btn-primary" style="margin-top:16px;display:inline-flex">Create New Post</a>
                </div>`;
            paginationEl.style.display = 'none';
            return;
        }

        wrap.innerHTML = `
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Title & Slug</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Dates</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="postsTbody"></tbody>
                </table>
            </div>`;

        const tbody = document.getElementById('postsTbody');
        posts.forEach(post => {
            const tr = document.createElement('tr');
            const catName = post.categories?.name || categoriesMap[post.category_id] || 'Uncategorized';
            
            tr.innerHTML = `
                <td>
                    <a href="/admin/editor.html?id=${post.id}" class="table-title-link" title="${escapeHtml(post.title)}">
                        ${escapeHtml(truncate(post.title, 55))}
                    </a>
                    <div style="font-size:11.5px;color:var(--gray);margin-top:2px;">
                        slug: <code>/${escapeHtml(post.slug)}</code>
                    </div>
                </td>
                <td style="font-size:13px;color:var(--slate-gray)">${escapeHtml(catName)}</td>
                <td>${statusBadge(post.status)}</td>
                <td style="font-size:12px;color:var(--gray);line-height:1.4">
                    <div>Updated: ${formatDate(post.updated_at)}</div>
                    ${post.published_at ? `<div>Pub: ${formatDate(post.published_at)}</div>` : ''}
                    ${post.status === 'scheduled' && post.scheduled_at ? `<div style="color:#d97706">Sched: ${formatDate(post.scheduled_at)}</div>` : ''}
                </td>
                <td>
                    <div class="table-actions">
                        <a href="/admin/editor.html?id=${post.id}" class="btn btn-ghost btn-sm" title="Edit Post">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </a>
                        <button class="btn btn-ghost btn-sm" title="Duplicate Post" onclick="duplicatePost('${post.id}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/></svg>
                        </button>
                        ${post.status === 'published' ? `
                            <a href="/blog/${post.slug}" target="_blank" class="btn btn-ghost btn-sm" title="View Public Post">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                        ` : `
                            <a href="/blog/post.html?slug=${post.slug}&preview=true" target="_blank" class="btn btn-ghost btn-sm" title="Preview Draft">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                            </a>
                        `}
                        <button class="btn btn-ghost btn-sm" style="color:var(--coral-red)" title="Delete Post" onclick="deletePost('${post.id}', '${escapeHtml(post.title)}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });

        renderPagination(count);

    } catch (err) {
        console.error('[Posts] Error loading posts:', err);
        wrap.innerHTML = '<p style="padding:20px;color:var(--coral-red);font-size:13.5px">Failed to load posts list.</p>';
    }
}

function renderPagination(totalCount) {
    const paginationEl = document.getElementById('pagination');
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    if (totalPages <= 1) {
        paginationEl.style.display = 'none';
        return;
    }

    paginationEl.style.display = 'flex';
    paginationEl.innerHTML = '';

    // Prev
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '‹';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => { currentPage--; loadPosts(); };
    paginationEl.appendChild(prevBtn);

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => { currentPage = i; loadPosts(); };
            paginationEl.appendChild(btn);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            const span = document.createElement('span');
            span.textContent = '…';
            span.style.padding = '0 4px';
            span.style.color = 'var(--gray)';
            paginationEl.appendChild(span);
        }
    }

    // Next
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '›';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => { currentPage++; loadPosts(); };
    paginationEl.appendChild(nextBtn);
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(() => {
        currentPage = 1;
        loadPosts();
    }, 350));

    document.getElementById('statusFilter').addEventListener('change', () => {
        currentPage = 1;
        loadPosts();
    });

    document.getElementById('categoryFilter').addEventListener('change', () => {
        currentPage = 1;
        loadPosts();
    });

    document.getElementById('sortFilter').addEventListener('change', () => {
        currentPage = 1;
        loadPosts();
    });
}

// Delete Post (Soft Delete for safety)
window.deletePost = async function(id, title) {
    const confirmed = await confirmDialog(`Are you sure you want to move <strong>"${title}"</strong> to trash?`, 'Delete Post', true);
    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('posts')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id);

        if (error) throw error;

        Toast.success('Post moved to trash');
        await loadPosts();
    } catch (err) {
        console.error('[Posts] Delete error:', err);
        Toast.error(err.message || 'Failed to delete post.');
    }
};

// Duplicate Post
window.duplicatePost = async function(id) {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !post) throw error || new Error('Original post not found');

        const newTitle = `${post.title} (Copy)`;
        const newSlug = `${post.slug}-copy-${Date.now().toString().slice(-4)}`;

        const newPost = {
            title: newTitle,
            slug: newSlug,
            excerpt: post.excerpt,
            content: post.content,
            featured_image: post.featured_image,
            featured_image_alt: post.featured_image_alt,
            status: 'draft',
            category_id: post.category_id,
            seo_title: post.seo_title,
            seo_desc: post.seo_desc,
            focus_keyword: post.focus_keyword,
            canonical_url: '',
            og_title: post.og_title,
            og_desc: post.og_desc,
            og_image: post.og_image,
            robots_directive: post.robots_directive || 'index, follow'
        };

        const { data: inserted, error: insertError } = await supabase
            .from('posts')
            .insert(newPost)
            .select('id')
            .single();

        if (insertError) throw insertError;

        Toast.success('Post duplicated as draft');
        await loadPosts();
    } catch (err) {
        console.error('[Posts] Duplicate error:', err);
        Toast.error(err.message || 'Failed to duplicate post.');
    }
};

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
