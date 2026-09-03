// =============================================
// ADMIN SETTINGS — Verifications, Meta & Robots.txt
// =============================================

(async () => {
    // 1. Auth Guard
    const auth = await AdminAuth.check();
    if (!auth) return;

    // 2. Setup Tabs
    initTabs();

    // 3. Load Saved Settings
    await loadSettings();

    // 4. Setup Form Submission
    setupForm();
})();

function initTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const panels = document.querySelectorAll('.settings-tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetId = tab.getAttribute('data-tab');
            document.getElementById(targetId)?.classList.add('active');
        });
    });
}

async function loadSettings() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('key, value');

        if (error) throw error;

        const settings = {};
        if (data) {
            data.forEach(item => {
                settings[item.key] = item.value || '';
            });
        }

        // Populate fields
        document.getElementById('gscVerification').value = settings.gsc_verification || '';
        document.getElementById('bingVerification').value = settings.bing_verification || '';
        document.getElementById('ga4Id').value = settings.ga4_id || '';
        document.getElementById('gtmId').value = settings.gtm_id || '';
        document.getElementById('fbPixelId').value = settings.fb_pixel_id || '';
        document.getElementById('customHeadHtml').value = settings.custom_head_html || '';

        document.getElementById('siteName').value = settings.site_name || 'Abdullah Zafar';
        document.getElementById('siteUrl').value = settings.site_url || 'https://www.abdullahzafar.me';
        document.getElementById('authorName').value = settings.author_name || 'Abdullah Zafar';
        document.getElementById('authorEmail').value = settings.author_email || '4malikabdullah@gmail.com';
        document.getElementById('defaultOgImage').value = settings.default_og_image || '';

        document.getElementById('robotsContent').value = settings.robots_custom_rules || `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /blog/post.html?*preview=true\n\nSitemap: https://www.abdullahzafar.me/sitemap.xml`;

    } catch (err) {
        console.error('[Settings] Load error:', err);
        Toast.error('Failed to load settings from Supabase.');
    }
}

function setupForm() {
    const form = document.getElementById('settingsForm');
    const saveBtn = document.getElementById('saveSettingsBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving Settings…';

        const keysToSave = {
            gsc_verification: document.getElementById('gscVerification').value.trim(),
            bing_verification: document.getElementById('bingVerification').value.trim(),
            ga4_id: document.getElementById('ga4Id').value.trim(),
            gtm_id: document.getElementById('gtmId').value.trim(),
            fb_pixel_id: document.getElementById('fbPixelId').value.trim(),
            custom_head_html: document.getElementById('customHeadHtml').value.trim(),

            site_name: document.getElementById('siteName').value.trim(),
            site_url: document.getElementById('siteUrl').value.trim(),
            author_name: document.getElementById('authorName').value.trim(),
            author_email: document.getElementById('authorEmail').value.trim(),
            default_og_image: document.getElementById('defaultOgImage').value.trim(),

            robots_custom_rules: document.getElementById('robotsContent').value.trim()
        };

        try {
            const upsertPayload = Object.entries(keysToSave).map(([key, value]) => ({
                key,
                value,
                updated_at: new Date().toISOString()
            }));

            const { error } = await supabase
                .from('site_settings')
                .upsert(upsertPayload, { onConflict: 'key' });

            if (error) throw error;

            Toast.success('All settings saved and active immediately across the site!');

        } catch (err) {
            console.error('[Settings] Save error:', err);
            Toast.error(err.message || 'Failed to save settings.');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save All Settings';
        }
    });
}

// Robots.txt Presets
window.setRobotsPreset = function(type) {
    const textarea = document.getElementById('robotsContent');
    if (type === 'standard') {
        textarea.value = `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /blog/post.html?*preview=true\n\nSitemap: https://www.abdullahzafar.me/sitemap.xml`;
    } else if (type === 'blockAdmin') {
        textarea.value = `User-agent: *\nDisallow: /admin/\nDisallow: /admin/*\nDisallow: /*preview=true\nAllow: /\n\nSitemap: https://www.abdullahzafar.me/sitemap.xml`;
    }
    Toast.info('Robots preset loaded into editor');
};

// Download robots.txt
window.downloadRobotsTxt = function() {
    const content = document.getElementById('robotsContent').value;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    Toast.success('robots.txt downloaded');
};
