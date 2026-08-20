// =============================================
// ADMIN UTILITIES — shared across all admin pages
// =============================================

// Toast notification system
const Toast = {
    container: null,

    init() {
        if (this.container) return;
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        document.body.appendChild(this.container);
    },

    show(message, type = 'info', duration = 3500) {
        this.init();
        const toast = document.createElement('div');
        const icons = {
            success: '✓',
            error: '✕',
            info: 'ℹ'
        };
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span style="font-weight:700">${icons[type] || 'ℹ'}</span> <span>${message}</span>`;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(20px)';
            toast.style.transition = 'all 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success(msg) { this.show(msg, 'success'); },
    error(msg)   { this.show(msg, 'error', 5000); },
    info(msg)    { this.show(msg, 'info'); }
};

// Format date for display
function formatDate(dateStr, opts = {}) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date)) return '—';
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        ...opts
    });
}

// Truncate text
function truncate(str, n = 80) {
    if (!str) return '';
    return str.length > n ? str.slice(0, n) + '…' : str;
}

// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

// Status badge HTML
function statusBadge(status) {
    const map = {
        published: '<span class="badge badge-published">Published</span>',
        draft:     '<span class="badge badge-draft">Draft</span>',
        scheduled: '<span class="badge badge-scheduled">Scheduled</span>'
    };
    return map[status] || `<span class="badge badge-draft">${status}</span>`;
}

// Debounce
function debounce(fn, delay = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

// Confirm dialog (returns Promise<boolean>)
function confirmDialog(message, confirmText = 'Confirm', danger = false) {
    return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px`;
        overlay.innerHTML = `
            <div style="background:#fff;border-radius:16px;padding:28px;max-width:400px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.2)">
                <h3 style="font-family:Poppins,sans-serif;font-size:17px;font-weight:600;margin-bottom:10px;color:#151619">Confirm Action</h3>
                <p style="font-size:14px;color:#50576b;margin-bottom:24px;line-height:1.6">${message}</p>
                <div style="display:flex;gap:10px;justify-content:flex-end">
                    <button id="_cancel" style="padding:9px 18px;border-radius:8px;border:1.5px solid #e2e8f0;background:#fff;font-family:Inter,sans-serif;font-size:13.5px;cursor:pointer">Cancel</button>
                    <button id="_confirm" style="padding:9px 18px;border-radius:8px;border:none;background:${danger ? '#ff5147' : '#26916c'};color:#fff;font-family:Inter,sans-serif;font-size:13.5px;font-weight:600;cursor:pointer">${confirmText}</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.querySelector('#_cancel').onclick = () => { overlay.remove(); resolve(false); };
        overlay.querySelector('#_confirm').onclick = () => { overlay.remove(); resolve(true); };
    });
}

// Sidebar active state
function setSidebarActive() {
    const path = window.location.pathname;
    document.querySelectorAll('.sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const linkPath = new URL(href, window.location.origin).pathname;
        const isActive = path === linkPath || (path !== '/admin/' && path !== '/admin/index.html' && path.startsWith(linkPath.replace('.html', '')) && href !== '/admin/');
        link.classList.toggle('active', isActive);
    });
}

// Upload image to Supabase Storage
async function uploadImage(file, folder = 'content') {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed.');
    }
    if (file.size > maxSize) {
        throw new Error('Image must be smaller than 5MB.');
    }

    const ext = file.name.split('.').pop().toLowerCase();
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filename, file, { contentType: file.type, upsert: false });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filename);

    return urlData.publicUrl;
}

// Initialize mobile sidebar toggle
function initMobileSidebar() {
    const hamburger = document.querySelector('.topbar-hamburger');
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:99;display:none';
    document.body.appendChild(overlay);

    hamburger?.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.style.display = sidebar.classList.contains('open') ? 'block' : 'none';
    });
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    });
}

// Run on every admin page load
document.addEventListener('DOMContentLoaded', () => {
    setSidebarActive();
    initMobileSidebar();
});
