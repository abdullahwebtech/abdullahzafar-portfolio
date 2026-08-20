// =============================================
// PUBLIC BLOG SUPABASE CLIENT & HEAD INJECTOR
// Anon key only — safe for public client bundle
// =============================================

const SUPABASE_URL = 'https://hvnfsdidfbzakmdffwic.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmZzZGlkZmJ6YWttZGZmd2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTAyMDYsImV4cCI6MjEwMjcyNjIwNn0.OBBJx_ycK_3dt9lN0dIfhHkCvK-btga8I_fGmyPU9lM';

if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    const _createClient = window.supabase.createClient;
    window.supabase = _createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window.sbPublicClient = window.supabase;
}

var supabase = window.supabase || window.sbPublicClient;

// Inject verified tracking & webmaster tags from site_settings
async function injectSiteSettings() {
    try {
        if (!supabase) return;
        const { data: settings } = await supabase
            .from('site_settings')
            .select('key, value');

        if (!settings) return;

        const map = {};
        settings.forEach(s => map[s.key] = s.value);

        // 1. Google Search Console Verification
        if (map.gsc_verification) {
            let meta = document.querySelector('meta[name="google-site-verification"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'google-site-verification';
                document.head.appendChild(meta);
            }
            meta.content = map.gsc_verification;
        }

        // 2. Bing Webmaster Tools
        if (map.bing_verification) {
            let meta = document.querySelector('meta[name="msvalidate.01"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'msvalidate.01';
                document.head.appendChild(meta);
            }
            meta.content = map.bing_verification;
        }

        // 3. Google Analytics 4 (GA4)
        if (map.ga4_id && !window._ga4_injected) {
            window._ga4_injected = true;
            const gtagScript = document.createElement('script');
            gtagScript.async = true;
            gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${map.ga4_id}`;
            document.head.appendChild(gtagScript);

            const inlineScript = document.createElement('script');
            inlineScript.textContent = `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${map.ga4_id}');
            `;
            document.head.appendChild(inlineScript);
        }

        // 4. Google Tag Manager (GTM)
        if (map.gtm_id && !window._gtm_injected) {
            window._gtm_injected = true;
            const gtmScript = document.createElement('script');
            gtmScript.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${map.gtm_id}');`;
            document.head.appendChild(gtmScript);
        }

    } catch (err) {
        console.warn('[SiteSettings] Could not inject settings:', err);
    }
}

// Format date helper
function formatPublicDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

// Run settings injector on load
document.addEventListener('DOMContentLoaded', injectSiteSettings);
