import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://rgbzqnbegozpcgdnfxfy.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnpxbmJlZ296cGNnZG5meGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDg3NjYsImV4cCI6MjA5MDEyNDc2Nn0.qs6RH_rBXf46jbqFcl3IdJut4Ss9FP9ucregSBayI7c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
