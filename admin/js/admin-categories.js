// =============================================
// ADMIN CATEGORIES — CRUD & Live Validation
// =============================================

let isSlugManual = false;

(async () => {
    // 1. Auth Guard
    const auth = await AdminAuth.check();
    if (!auth) return;

    // 2. Load Categories
    await loadCategories();
    setupEventListeners();
})();

async function loadCategories() {
    const wrap = document.getElementById('categoriesTableWrap');
    wrap.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';

    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select(`
                id, name, slug, description, seo_title, seo_desc, created_at,
                posts(count)
            `)
            .order('name');

        if (error) throw error;

        if (!categories || categories.length === 0) {
            wrap.innerHTML = `
                <div class="empty-state" style="padding:40px 20px">
                    <p style="color:var(--gray)">No categories created yet. Use the form on the left to add your first category.</p>
                </div>`;
            return;
        }

        wrap.innerHTML = `
            <div class="admin-table-wrap">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Slug</th>
                            <th>Posts</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="categoriesTbody"></tbody>
                </table>
            </div>`;

        const tbody = document.getElementById('categoriesTbody');
        categories.forEach(cat => {
            const tr = document.createElement('tr');
            const postCount = cat.posts?.[0]?.count || 0;

            tr.innerHTML = `
                <td>
                    <strong style="font-weight:600;color:var(--charcoal-black)">${escapeHtml(cat.name)}</strong>
                    ${cat.description ? `<p style="font-size:12px;color:var(--gray);margin-top:2px">${escapeHtml(truncate(cat.description, 50))}</p>` : ''}
                </td>
                <td><code style="font-size:12px;background:var(--surface-gray);padding:2px 6px;border-radius:4px">${escapeHtml(cat.slug)}</code></td>
                <td><span class="badge badge-published">${postCount} posts</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" title="Edit" onclick='editCategory(${JSON.stringify(cat)})'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <a href="/blog/category.html?slug=${cat.slug}" target="_blank" class="btn btn-ghost btn-sm" title="View Archive">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        </a>
                        <button class="btn btn-ghost btn-sm" style="color:var(--coral-red)" title="Delete" onclick="deleteCategory('${cat.id}', '${escapeHtml(cat.name)}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>`;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('[Categories] Error loading categories:', err);
        wrap.innerHTML = '<p style="padding:20px;color:var(--coral-red);font-size:13.5px">Failed to load categories.</p>';
    }
}

function setupEventListeners() {
    const nameInput = document.getElementById('catName');
    const slugInput = document.getElementById('catSlug');
    const form = document.getElementById('categoryForm');
    const cancelBtn = document.getElementById('cancelCatBtn');

    nameInput.addEventListener('input', () => {
        if (!isSlugManual) {
            slugInput.value = generateSlug(nameInput.value);
            document.querySelector('.form-hint span').textContent = slugInput.value;
        }
    });

    slugInput.addEventListener('input', () => {
        isSlugManual = true;
        slugInput.value = generateSlug(slugInput.value);
        document.querySelector('.form-hint span').textContent = slugInput.value;
    });

    cancelBtn.addEventListener('click', () => {
        resetForm();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const id = document.getElementById('categoryId').value;
        const name = nameInput.value.trim();
        const slug = slugInput.value.trim();
        const description = document.getElementById('catDesc').value.trim();
        const seo_title = document.getElementById('catSeoTitle').value.trim();
        const seo_desc = document.getElementById('catSeoDesc').value.trim();

        if (!name || !slug) {
            Toast.error('Name and Slug are required');
            return;
        }

        const saveBtn = document.getElementById('saveCatBtn');
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';

        try {
            // Slug unique check
            let slugCheck = supabase
                .from('categories')
                .select('id')
                .eq('slug', slug);

            if (id) {
                slugCheck = slugCheck.neq('id', id);
            }

            const { data: existing } = await slugCheck;
            if (existing && existing.length > 0) {
                throw new Error(`The slug "${slug}" is already used by another category.`);
            }

            const payload = {
                name,
                slug,
                description,
                seo_title,
                seo_desc,
                updated_at: new Date().toISOString()
            };

            if (id) {
                // Update
                const { error } = await supabase
                    .from('categories')
                    .update(payload)
                    .eq('id', id);

                if (error) throw error;
                Toast.success('Category updated successfully');
            } else {
                // Insert
                payload.created_at = new Date().toISOString();
                const { error } = await supabase
                    .from('categories')
                    .insert(payload);

                if (error) throw error;
                Toast.success('Category created successfully');
            }

            resetForm();
            await loadCategories();

        } catch (err) {
            console.error('[Categories] Save error:', err);
            Toast.error(err.message || 'Failed to save category.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Category';
        }
    });
}

window.editCategory = function(cat) {
    document.getElementById('categoryId').value = cat.id;
    document.getElementById('catName').value = cat.name;
    document.getElementById('catSlug').value = cat.slug;
    document.getElementById('catDesc').value = cat.description || '';
    document.getElementById('catSeoTitle').value = cat.seo_title || '';
    document.getElementById('catSeoDesc').value = cat.seo_desc || '';

    isSlugManual = true;
    document.querySelector('.form-hint span').textContent = cat.slug;

    document.getElementById('formTitle').textContent = 'Edit Category';
    document.getElementById('saveCatBtn').textContent = 'Update Category';
    document.getElementById('cancelCatBtn').style.display = 'inline-flex';

    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.deleteCategory = async function(id, name) {
    const confirmed = await confirmDialog(`Are you sure you want to delete category <strong>"${name}"</strong>? Posts in this category will become uncategorized.`, 'Delete Category', true);
    if (!confirmed) return;

    try {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;

        Toast.success('Category deleted');
        await loadCategories();
    } catch (err) {
        console.error('[Categories] Delete error:', err);
        Toast.error(err.message || 'Failed to delete category.');
    }
};

function resetForm() {
    document.getElementById('categoryId').value = '';
    document.getElementById('catName').value = '';
    document.getElementById('catSlug').value = '';
    document.getElementById('catDesc').value = '';
    document.getElementById('catSeoTitle').value = '';
    document.getElementById('catSeoDesc').value = '';

    isSlugManual = false;
    document.querySelector('.form-hint span').textContent = 'technical-seo';

    document.getElementById('formTitle').textContent = 'Add New Category';
    document.getElementById('saveCatBtn').textContent = 'Save Category';
    document.getElementById('cancelCatBtn').style.display = 'none';
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
