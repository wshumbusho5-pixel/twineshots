// Supabase Configuration
// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://wljrwgkykrrxblazonei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndsanJ3Z2t5a3JyeGJsYXpvbmVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyMjg3MTksImV4cCI6MjA4OTgwNDcxOX0.PK1ai1Acfpzqrk1Ns7Hemwbo4KPxU6pflGKiDw_5_jM';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
