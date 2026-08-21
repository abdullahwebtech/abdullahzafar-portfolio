// =============================================
// SUPABASE CLIENT — ADMIN (Anon key only)
// =============================================

const SUPABASE_URL = 'https://hvnfsdidfbzakmdffwic.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2bmZzZGlkZmJ6YWttZGZmd2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNTAyMDYsImV4cCI6MjEwMjcyNjIwNn0.OBBJx_ycK_3dt9lN0dIfhHkCvK-btga8I_fGmyPU9lM';

// Safely initialize Supabase Client from UMD library
if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
    const _createClient = window.supabase.createClient;
    window.supabase = _createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false
        }
    });
    window.sbClient = window.supabase;
} else if (typeof window.supabase === 'undefined' || !window.supabase?.auth) {
    console.error('[Supabase] CDN library not loaded properly or already initialized.');
}

// Global reference
var supabase = window.supabase || window.sbClient;

// Storage bucket name
const STORAGE_BUCKET = 'blog-images';

// Public site URL
const SITE_URL = 'https://www.abdullahzafar.me';
