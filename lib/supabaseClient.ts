import { createClient } from '@supabase/supabase-js';

// @ts-ignore - Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// @ts-ignore - Vite environment variables
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client if credentials are missing (for development without Supabase)
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are not set. Q&A features will be disabled.');
  console.warn('To enable Q&A features, create a .env.local file with:');
  console.warn('  VITE_SUPABASE_URL=your_supabase_url');
  console.warn('  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key');
  
  // Create a mock client that returns empty results
  const createMockQuery = () => ({
    select: (columns?: string) => ({
      order: (column: string, options?: { ascending: boolean }) => ({
        eq: (column: string, value: any) => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          then: async (callback: any) => callback({ data: [], error: null })
        }),
        then: async (callback: any) => callback({ data: [], error: null })
      }),
      eq: (column: string, value: any) => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        then: async (callback: any) => callback({ data: [], error: null })
      }),
      then: async (callback: any) => callback({ data: [], error: null })
    }),
    insert: async (data: any) => ({ data: null, error: { message: 'Supabase not configured' } })
  });

  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: (callback?: any) => {
        if (callback) callback('SIGNED_OUT', null);
        return { data: { subscription: { unsubscribe: () => {} } } };
      }
    },
    from: (table: string) => createMockQuery()
  };
} else {
  try {
    // Validate key format
    if (supabaseAnonKey.startsWith('sb_secret_')) {
      console.error('❌ ERROR: You are using a SECRET key in the client! This is a security risk!');
      console.error('❌ Secret keys should NEVER be used in browser/client code.');
      console.error('❌ Please use the ANON (public) key from Supabase Dashboard > Settings > API');
      console.error('❌ The anon key should start with "eyJ" (JWT token) or "sb_publishable_"');
      throw new Error('Invalid key type: Secret keys cannot be used in client applications');
    }
    
    // Validate that we have a proper anon key
    const isValidAnonKey = supabaseAnonKey.startsWith('eyJ') || 
                          supabaseAnonKey.startsWith('sb_publishable_') ||
                          supabaseAnonKey.length > 50; // Fallback for other formats
    
    if (!isValidAnonKey) {
      console.warn('⚠️ WARNING: The API key format looks unusual. Make sure you are using the ANON (public) key, not the SECRET key.');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: 'pkce' // Use PKCE flow for better security
      }
    });
    
    console.log('✅ Supabase client initialized successfully');
    console.log('📍 URL:', supabaseUrl);
    console.log('🔑 Key type:', supabaseAnonKey.startsWith('eyJ') ? 'JWT (anon)' : supabaseAnonKey.startsWith('sb_publishable_') ? 'Publishable (anon) ✅' : 'Unknown format');
    console.log('🔑 Key preview:', supabaseAnonKey.substring(0, 20) + '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 10));
    
    // Test connection with better error handling
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.warn('⚠️ Supabase connection test failed:', error.message);
        console.warn('💡 This might be normal if no user is logged in');
      } else {
        console.log('✅ Supabase connection test passed');
        if (data.session) {
          console.log('👤 Active session found for user:', data.session.user.email);
        }
      }
    }).catch((err) => {
      console.warn('⚠️ Supabase connection test error:', err.message);
    });
  } catch (error: any) {
    console.error('❌ Failed to initialize Supabase client:', error.message);
    // Don't throw - allow app to continue with mock client
    console.warn('⚠️ Falling back to mock Supabase client');
  }
}

export { supabase };

