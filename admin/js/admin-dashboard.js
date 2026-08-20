// =============================================
// ADMIN DASHBOARD — Stats + Recent Posts
// =============================================

(async () => {
    // Auth check — must be admin
    const auth = await AdminAuth.check();
    if (!auth) return;

    await loadDashboard();
})();

async function loadDashboard() {
    await Promise.all([loadStats(), loadRecentPosts()]);
}

async function loadStats() {
    try {
        // Fetch all non-deleted posts in parallel with categories
        const [postsResult, categoriesResult] = await Promise.all([
            supabase
                .from('posts')
                .select('status', { count: 'exact' })
                .is('deleted_at', null),
            supabase
                .from('categories')
                .select('id', { count: 'exact' })
        ]);

        const posts = postsResult.data || [];
        const total = posts.length;
        const published  = posts.filter(p => p.status === 'published').length;
        const draft      = posts.filter(p => p.status === 'draft').length;
        const scheduled  = posts.filter(p => p.status === 'scheduled').length;
        const categories = categoriesResult.count || 0;

        document.getElementById('statTotal').textContent     = total;
        document.getElementById('statPublished').textContent = published;
        document.getElementById('statDraft').textContent     = draft;
        document.getElementById('statScheduled').textContent = scheduled;
        document.getElementById('statCategories').textContent = categories;

    } catch (err) {
        console.error('[Dashboard] Stats error:', err);
    }
}

async function loadRecentPosts() {
    const wrap = document.getElementById('recentPostsWrap');

    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                id, title, slug, status, created_at, updated_at, published_at,
                categories(name)
            `)
            .is('deleted_at', null)
            .order('updated_at', { ascending: false })
            .limit(8);

        if (error) throw error;

        if (!posts || posts.length === 0) {
            wrap.innerHTML = `
                <div class="empty-state">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <h3>No posts yet</h3>
                    <p>Create your first blog post to get started.</p>
                    <a href="/admin/editor.html" class="btn btn-primary" style="margin-top:16px;display:inline-flex">Write First Post</a>
                </div>`;
            return;
        }

        wrap.innerHTML = `
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="recentPostsTbody"></tbody>
                </table>
            </div>`;

        const tbody = document.getElementById('recentPostsTbody');
        posts.forEach(post => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <a href="/admin/editor.html?id=${post.id}" class="table-title-link" title="${post.title}">
                        ${truncate(post.title, 60)}
                    </a>
                </td>
                <td style="font-size:13px;color:var(--slate-gray)">${post.categories?.name || '—'}</td>
                <td>${statusBadge(post.status)}</td>
                <td style="font-size:13px;color:var(--gray);white-space:nowrap">${formatDate(post.updated_at)}</td>
                <td>
                    <div class="table-actions">
                        <a href="/admin/editor.html?id=${post.id}" class="btn btn-ghost btn-sm" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </a>
                        ${post.status === 'published' ? `<a href="/blog/${post.slug}" target="_blank" class="btn btn-ghost btn-sm" title="View">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>` : ''}
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('[Dashboard] Recent posts error:', err);
        wrap.innerHTML = '<p style="padding:20px;color:var(--gray);font-size:13.5px">Failed to load posts.</p>';
    }
}
