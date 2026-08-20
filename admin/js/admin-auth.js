// =============================================
// ADMIN AUTH GUARD
// Must be loaded on EVERY admin page
// Redirects to login if not authenticated admin
// =============================================

const AdminAuth = {

    // Current authenticated user + profile
    currentUser: null,
    currentProfile: null,

    // Check auth and enforce admin role
    async check() {
        try {
            // 1. Verify active Supabase session (JWT validation)
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                this._redirectToLogin();
                return null;
            }

            // 2. Verify user has an admin_profiles record with admin role
            // This is the SECURITY BOUNDARY — RLS enforces this at DB level too
            const { data: profile, error: profileError } = await supabase
                .from('admin_profiles')
                .select('id, email, role, name')
                .eq('id', user.id)
                .single();

            if (profileError || !profile || profile.role !== 'admin') {
                // Valid session but not an admin — sign out + redirect
                await supabase.auth.signOut();
                this._redirectToLogin('not_admin');
                return null;
            }

            this.currentUser = user;
            this.currentProfile = profile;

            // 3. Update UI with admin name/email
            this._updateUI(profile);

            return { user, profile };

        } catch (err) {
            console.error('[AdminAuth] Auth check error:', err);
            this._redirectToLogin();
            return null;
        }
    },

    // First-run: auto-create admin_profile if auth user exists but no profile yet
    async setupFirstRun(user) {
        const { data: existing } = await supabase
            .from('admin_profiles')
            .select('id')
            .eq('id', user.id)
            .single();

        if (!existing) {
            const { error } = await supabase
                .from('admin_profiles')
                .insert({
                    id: user.id,
                    email: user.email,
                    role: 'admin',
                    name: 'Abdullah Zafar'
                });

            if (error) {
                // Profile creation failed — may need manual SQL insert
                console.error('[AdminAuth] Could not auto-create profile:', error.message);
                return false;
            }
        }
        return true;
    },

    // Sign out
    async signOut() {
        await supabase.auth.signOut();
        window.location.href = '/admin/login.html';
    },

    // Redirect to login
    _redirectToLogin(reason) {
        const url = reason
            ? `/admin/login.html?reason=${reason}`
            : '/admin/login.html';
        window.location.replace(url);
    },

    // Update admin name in sidebar
    _updateUI(profile) {
        const nameEls = document.querySelectorAll('[data-admin-name]');
        const emailEls = document.querySelectorAll('[data-admin-email]');
        nameEls.forEach(el => el.textContent = profile.name || 'Admin');
        emailEls.forEach(el => el.textContent = profile.email || '');
    }
};

// Logout button handler (attaches to all elements with data-logout)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-logout]').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            await AdminAuth.signOut();
        });
    });
});
