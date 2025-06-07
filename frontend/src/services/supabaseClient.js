import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Get current logged-in user
export function getCurrentUser() {
  return supabase.auth.user();
}

// Insert a row with user_id linked to logged-in user
export async function insertUserData(tableName, dataObject) {
  const user = getCurrentUser();
  if (!user) throw new Error('User not logged in');

  // Add user_id to the data
  const dataToInsert = {
    ...dataObject,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from(tableName)
    .insert([dataToInsert]);

  if (error) {
    throw error;
  }
  return data;
}

// Fetch only data belonging to logged-in user
export async function fetchUserData(tableName) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('User not logged in');
  }

  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    throw error;
  }
  return data;
}
