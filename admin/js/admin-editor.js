// =============================================
// ADMIN BLOG EDITOR — Quill, Image Upload, SEO Engine
// =============================================

let quill;
let currentPostId = null;
let isSlugManuallyEdited = false;

(async () => {
    // 1. Auth Guard
    const auth = await AdminAuth.check();
    if (!auth) return;

    // 2. Initialize Quill
    initQuill();

    // 3. Load Categories
    await loadCategories();

    // 4. Check for Edit Mode
    const urlParams = new URLSearchParams(window.location.search);
    currentPostId = urlParams.get('id');

    if (currentPostId) {
        document.getElementById('pageHeading').textContent = 'Edit Blog Post';
        document.title = 'Edit Post — CMS Admin';
        await loadPostData(currentPostId);
    }

    // 5. Setup Listeners
    setupEventListeners();
    runSeoAudit();
})();

function initQuill() {
    quill = new Quill('#quillEditor', {
        modules: {
            toolbar: '#quillToolbar'
        },
        theme: 'snow',
        placeholder: 'Write your comprehensive, SEO-optimized article here…'
    });

    // Handle Custom Toolbar Buttons
    document.getElementById('customYoutubeBtn').addEventListener('click', () => {
        openModal('youtubeModal');
    });

    document.getElementById('customCalloutBtn').addEventListener('click', () => {
        insertCalloutBox();
    });

    // Content Image Upload
    const contentImageInput = document.getElementById('contentImageFileInput');
    document.getElementById('customImageBtn').addEventListener('click', (e) => {
        e.preventDefault();
        contentImageInput.click();
    });

    contentImageInput.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            Toast.info('Uploading image to Supabase Storage…');
            const url = await uploadImage(file, 'posts');
            
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
            quill.setSelection(range.index + 1);
            Toast.success('Image inserted');
            runSeoAudit();
        } catch (err) {
            console.error('[Editor] Image upload error:', err);
            Toast.error(err.message || 'Image upload failed');
        } finally {
            contentImageInput.value = '';
        }
    });

    // Run SEO audit whenever text changes
    quill.on('text-change', debounce(() => {
        runSeoAudit();
    }, 400));
}

function insertCalloutBox() {
    const range = quill.getSelection(true);
    const text = '💡 Key Takeaway: Enter critical insight or summary note here.';
    quill.insertText(range.index, text + '\n', { blockquote: true });
    quill.setSelection(range.index + text.length + 1);
}

// Modal helper
window.openModal = function(modalId) {
    document.getElementById(modalId).classList.add('active');
};
window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.remove('active');
};

async function loadCategories() {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('id, name')
            .order('name');

        if (error) throw error;

        const select = document.getElementById('postCategory');
        if (data) {
            data.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                select.appendChild(opt);
            });
        }
    } catch (err) {
        console.error('[Editor] Categories error:', err);
    }
}

async function loadPostData(id) {
    try {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !post) throw error || new Error('Post not found');

        document.getElementById('postTitle').value = post.title || '';
        document.getElementById('postExcerpt').value = post.excerpt || '';
        document.getElementById('postSlug').value = post.slug || '';
        isSlugManuallyEdited = true;

        if (post.content) {
            quill.root.innerHTML = post.content;
        }

        document.getElementById('postStatus').value = post.status || 'draft';
        if (post.status === 'scheduled') {
            document.getElementById('scheduledDateWrap').style.display = 'block';
            if (post.scheduled_at) {
                const d = new Date(post.scheduled_at);
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                document.getElementById('scheduledAt').value = d.toISOString().slice(0, 16);
            }
        }

        document.getElementById('postCategory').value = post.category_id || '';

        // Featured Image
        if (post.featured_image) {
            setFeaturedImagePreview(post.featured_image);
        }
        document.getElementById('featuredImageAlt').value = post.featured_image_alt || '';

        // SEO Fields
        document.getElementById('focusKeyword').value = post.focus_keyword || '';
        document.getElementById('seoTitle').value = post.seo_title || '';
        document.getElementById('seoDesc').value = post.seo_desc || '';
        document.getElementById('canonicalUrl').value = post.canonical_url || '';
        document.getElementById('robotsDirective').value = post.robots_directive || 'index, follow';

        updateCounters();
        updateSerpPreview();
        runSeoAudit();

    } catch (err) {
        console.error('[Editor] Load post error:', err);
        Toast.error('Failed to load post for editing.');
    }
}

function setFeaturedImagePreview(url) {
    document.getElementById('featuredImageUrl').value = url;
    const preview = document.getElementById('featuredPreview');
    const placeholder = document.getElementById('featuredPlaceholder');
    const actions = document.getElementById('featuredActions');
    const dropZone = document.getElementById('featuredDropZone');

    preview.src = url;
    preview.style.display = 'block';
    placeholder.style.display = 'none';
    actions.style.display = 'flex';
    dropZone.classList.add('has-image');
}

window.removeFeaturedImage = function() {
    document.getElementById('featuredImageUrl').value = '';
    document.getElementById('featuredFileInput').value = '';
    const preview = document.getElementById('featuredPreview');
    const placeholder = document.getElementById('featuredPlaceholder');
    const actions = document.getElementById('featuredActions');
    const dropZone = document.getElementById('featuredDropZone');

    preview.src = '';
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    actions.style.display = 'none';
    dropZone.classList.remove('has-image');
    runSeoAudit();
};

function setupEventListeners() {
    const titleInput = document.getElementById('postTitle');
    const slugInput = document.getElementById('postSlug');
    const focusKeywordInput = document.getElementById('focusKeyword');
    const seoTitleInput = document.getElementById('seoTitle');
    const seoDescInput = document.getElementById('seoDesc');
    const statusSelect = document.getElementById('postStatus');

    // Title to Slug generator
    titleInput.addEventListener('input', () => {
        if (!isSlugManuallyEdited) {
            slugInput.value = generateSlug(titleInput.value);
            document.querySelector('#slugPreview span').textContent = slugInput.value;
        }
        updateSerpPreview();
        runSeoAudit();
    });

    slugInput.addEventListener('input', () => {
        isSlugManuallyEdited = true;
        slugInput.value = generateSlug(slugInput.value);
        document.querySelector('#slugPreview span').textContent = slugInput.value;
        updateSerpPreview();
        runSeoAudit();
    });

    focusKeywordInput.addEventListener('input', debounce(runSeoAudit, 300));

    seoTitleInput.addEventListener('input', () => {
        updateCounters();
        updateSerpPreview();
        runSeoAudit();
    });

    seoDescInput.addEventListener('input', () => {
        updateCounters();
        updateSerpPreview();
        runSeoAudit();
    });

    statusSelect.addEventListener('change', () => {
        const isScheduled = statusSelect.value === 'scheduled';
        document.getElementById('scheduledDateWrap').style.display = isScheduled ? 'block' : 'none';
    });

    // Featured Image Upload
    document.getElementById('featuredFileInput').addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            Toast.info('Uploading featured image…');
            const url = await uploadImage(file, 'featured');
            setFeaturedImagePreview(url);
            Toast.success('Featured image uploaded');
            runSeoAudit();
        } catch (err) {
            console.error('[Editor] Featured image error:', err);
            Toast.error(err.message || 'Failed to upload featured image.');
        }
    });

    // YouTube Embed Confirm
    document.getElementById('confirmYoutubeBtn').addEventListener('click', () => {
        const url = document.getElementById('ytVideoUrl').value.trim();
        const videoId = extractYouTubeId(url);

        if (!videoId) {
            Toast.error('Please enter a valid YouTube video URL (youtube.com or youtu.be)');
            return;
        }

        const embedHtml = `
            <div class="yt-embed-wrap" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px">
                <iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
            </div>
            <p><br></p>
        `;

        const range = quill.getSelection(true);
        quill.clipboard.dangerouslyPasteHTML(range.index, embedHtml);
        closeModal('youtubeModal');
        document.getElementById('ytVideoUrl').value = '';
        Toast.success('YouTube embed added');
    });

    // Save Draft Button
    document.getElementById('saveDraftBtn').addEventListener('click', () => {
        savePost('draft');
    });

    // Publish Button
    document.getElementById('publishBtn').addEventListener('click', () => {
        const currentStatus = document.getElementById('postStatus').value;
        savePost(currentStatus === 'scheduled' ? 'scheduled' : 'published');
    });

    // Preview Button
    document.getElementById('previewBtn').addEventListener('click', async () => {
        const slug = document.getElementById('postSlug').value.trim();
        if (!slug) {
            Toast.error('Please enter a title and slug before previewing.');
            return;
        }
        // Save as draft first if unsaved
        await savePost('draft', true);
        window.open(`/blog/post.html?slug=${slug}&preview=true`, '_blank');
    });
}

function extractYouTubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
}

function updateCounters() {
    const seoTitle = document.getElementById('seoTitle').value;
    const seoDesc = document.getElementById('seoDesc').value;

    const titleCountEl = document.getElementById('seoTitleCount');
    const descCountEl = document.getElementById('seoDescCount');

    // Title counter
    const tLen = seoTitle.length;
    titleCountEl.textContent = `${tLen} / 60 chars`;
    titleCountEl.className = 'char-counter ' + (tLen >= 45 && tLen <= 65 ? 'good' : (tLen > 65 ? 'over' : 'warn'));

    // Desc counter
    const dLen = seoDesc.length;
    descCountEl.textContent = `${dLen} / 160 chars`;
    descCountEl.className = 'char-counter ' + (dLen >= 130 && dLen <= 165 ? 'good' : (dLen > 165 ? 'over' : 'warn'));
}

function updateSerpPreview() {
    const title = document.getElementById('seoTitle').value.trim() || document.getElementById('postTitle').value.trim() || 'Blog Post Title';
    const slug = document.getElementById('postSlug').value.trim() || 'post-slug';
    const desc = document.getElementById('seoDesc').value.trim() || document.getElementById('postExcerpt').value.trim() || 'Meta description snippet will appear here as users see it in Google search results.';

    document.getElementById('serpTitle').textContent = `${title} | Abdullah Zafar`;
    document.getElementById('serpUrl').textContent = `https://www.abdullahzafar.me/blog/${slug}`;
    document.getElementById('serpDesc').textContent = desc;
}

// Live On-Page SEO Engine
function runSeoAudit() {
    const keyword = document.getElementById('focusKeyword').value.trim().toLowerCase();
    const title = document.getElementById('postTitle').value.trim();
    const slug = document.getElementById('postSlug').value.trim().toLowerCase();
    const seoTitle = document.getElementById('seoTitle').value.trim();
    const seoDesc = document.getElementById('seoDesc').value.trim();
    const featuredImg = document.getElementById('featuredImageUrl').value;
    const featuredAlt = document.getElementById('featuredImageAlt').value.trim();
    const htmlContent = quill ? quill.root.innerHTML : '';
    const textContent = quill ? quill.getText() : '';

    const checks = [];

    // 1. Keyword checks
    if (keyword) {
        // Keyword in Title
        const inTitle = title.toLowerCase().includes(keyword) || seoTitle.toLowerCase().includes(keyword);
        checks.push({
            pass: inTitle,
            text: inTitle ? `Focus keyword found in Title` : `Focus keyword "${keyword}" missing from Title`
        });

        // Keyword in Slug
        const inSlug = slug.includes(generateSlug(keyword));
        checks.push({
            pass: inSlug,
            text: inSlug ? `Focus keyword found in URL Slug` : `Focus keyword missing from URL Slug`
        });

        // Keyword in Meta Description
        const inDesc = seoDesc.toLowerCase().includes(keyword);
        checks.push({
            pass: inDesc,
            text: inDesc ? `Focus keyword found in Meta Description` : `Focus keyword missing from Meta Description`
        });

        // Keyword in First Paragraph
        const firstP = textContent.slice(0, 300).toLowerCase();
        const inIntro = firstP.includes(keyword);
        checks.push({
            pass: inIntro,
            text: inIntro ? `Focus keyword appears in article introduction` : `Focus keyword not found in intro paragraph`
        });
    } else {
        checks.push({
            pass: false,
            warn: true,
            text: `No focus keyword specified (recommended for SEO guidance)`
        });
    }

    // 2. Title & Desc Length Checks
    const tLen = (seoTitle || title).length;
    const tOk = tLen >= 40 && tLen <= 65;
    checks.push({
        pass: tOk,
        text: tOk ? `SEO Title length is optimal (${tLen} chars)` : `SEO Title length (${tLen} chars) — aim for 50–60 chars`
    });

    const dLen = seoDesc.length;
    const dOk = dLen >= 120 && dLen <= 165;
    checks.push({
        pass: dOk,
        text: dOk ? `Meta Description length is optimal (${dLen} chars)` : (dLen === 0 ? `Meta Description is missing` : `Meta Description length (${dLen} chars) — aim for 150–160 chars`)
    });

    // 3. Featured Image & Alt
    if (featuredImg) {
        const hasAlt = featuredAlt.length > 3;
        checks.push({
            pass: hasAlt,
            text: hasAlt ? `Featured image has descriptive alt text` : `Featured image is missing alt text`
        });
    } else {
        checks.push({
            pass: false,
            text: `Featured image is not set`
        });
    }

    // 4. Content Structure Checks
    const hasH2 = htmlContent.includes('<h2');
    checks.push({
        pass: hasH2,
        text: hasH2 ? `Article uses Subheadings (H2/H3)` : `No subheadings (H2) found in article`
    });

    // 5. Internal / External Links
    const hasLinks = htmlContent.includes('<a href=');
    checks.push({
        pass: hasLinks,
        text: hasLinks ? `Content contains contextual links` : `No internal/external links found in article`
    });

    // 6. Word Count
    const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
    const wordOk = wordCount >= 300;
    checks.push({
        pass: wordOk,
        text: wordOk ? `Content length: ${wordCount} words` : `Short content: ${wordCount} words (recommend 600+ words)`
    });

    // Render Checklist
    const listEl = document.getElementById('seoChecklist');
    listEl.innerHTML = checks.map(c => {
        const iconClass = c.pass ? 'pass' : (c.warn ? 'warn' : 'fail');
        const iconChar = c.pass ? '✓' : (c.warn ? '!' : '✕');
        return `
            <li class="seo-check-item">
                <span class="seo-check-icon ${iconClass}">${iconChar}</span>
                <span>${escapeHtml(c.text)}</span>
            </li>
        `;
    }).join('');
}

// Save Post Function (Handles Draft, Publish, Schedule)
async function savePost(targetStatus, isSilent = false) {
    const title = document.getElementById('postTitle').value.trim();
    const slug = document.getElementById('postSlug').value.trim();

    if (!title) {
        Toast.error('Post Title is required.');
        document.getElementById('postTitle').focus();
        return;
    }

    if (!slug) {
        Toast.error('URL Slug is required.');
        document.getElementById('postSlug').focus();
        return;
    }

    // Sanitize raw HTML with DOMPurify
    const rawContent = quill.root.innerHTML;
    const cleanContent = DOMPurify.sanitize(rawContent, {
        ADD_TAGS: ['iframe'],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target']
    });

    const excerpt = document.getElementById('postExcerpt').value.trim();
    const featuredImage = document.getElementById('featuredImageUrl').value.trim();
    const featuredImageAlt = document.getElementById('featuredImageAlt').value.trim();
    const categoryId = document.getElementById('postCategory').value || null;
    const focusKeyword = document.getElementById('focusKeyword').value.trim();
    const seoTitle = document.getElementById('seoTitle').value.trim() || title;
    const seoDesc = document.getElementById('seoDesc').value.trim() || excerpt;
    const canonicalUrl = document.getElementById('canonicalUrl').value.trim();
    const robotsDirective = document.getElementById('robotsDirective').value;
    const scheduledAtInput = document.getElementById('scheduledAt').value;

    let scheduledAt = null;
    if (targetStatus === 'scheduled' && scheduledAtInput) {
        scheduledAt = new Date(scheduledAtInput).toISOString();
    }

    const payload = {
        title,
        slug,
        excerpt,
        content: cleanContent,
        featured_image: featuredImage,
        featured_image_alt: featuredImageAlt,
        category_id: categoryId,
        status: targetStatus,
        focus_keyword: focusKeyword,
        seo_title: seoTitle,
        seo_desc: seoDesc,
        canonical_url: canonicalUrl,
        og_title: seoTitle,
        og_desc: seoDesc,
        og_image: featuredImage,
        robots_directive: robotsDirective,
        scheduled_at: scheduledAt,
        updated_at: new Date().toISOString()
    };

    if (targetStatus === 'published') {
        payload.published_at = new Date().toISOString();
    }

    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const publishBtn = document.getElementById('publishBtn');
    saveDraftBtn.disabled = true;
    publishBtn.disabled = true;

    try {
        if (!isSilent) Toast.info('Saving post…');

        // Check Slug Uniqueness
        let slugCheck = supabase
            .from('posts')
            .select('id')
            .eq('slug', slug)
            .is('deleted_at', null);

        if (currentPostId) {
            slugCheck = slugCheck.neq('id', currentPostId);
        }

        const { data: existingSlug } = await slugCheck;
        if (existingSlug && existingSlug.length > 0) {
            throw new Error(`The slug "${slug}" is already in use by another post. Please choose a unique slug.`);
        }

        if (currentPostId) {
            // Update
            const { error } = await supabase
                .from('posts')
                .update(payload)
                .eq('id', currentPostId);

            if (error) throw error;
            if (!isSilent) Toast.success(`Post updated as ${targetStatus}`);
        } else {
            // Insert
            payload.created_at = new Date().toISOString();
            const { data: newPost, error } = await supabase
                .from('posts')
                .insert(payload)
                .select('id')
                .single();

            if (error) throw error;
            currentPostId = newPost.id;
            window.history.replaceState({}, '', `/admin/editor.html?id=${currentPostId}`);
            document.getElementById('pageHeading').textContent = 'Edit Blog Post';
            if (!isSilent) Toast.success(`Post created and saved as ${targetStatus}`);
        }

        document.getElementById('postStatus').value = targetStatus;

    } catch (err) {
        console.error('[Editor] Save error:', err);
        Toast.error(err.message || 'Failed to save post.');
    } finally {
        saveDraftBtn.disabled = false;
        publishBtn.disabled = false;
    }
}
