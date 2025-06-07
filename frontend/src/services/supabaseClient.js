import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkmsbhrhmmrbfirkrjzf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbXNiaHJobW1yYmZpcmtyanpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTY1MzksImV4cCI6MjA2NDY3MjUzOX0.H2Es2cmvm3UlzcAqBdpXjwNXbcH_RXvj7kuULyMoFuY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
