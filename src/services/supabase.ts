import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'cropcare_supabase_url';
const STORAGE_KEY_KEY = 'cropcare_supabase_anon_key';

export const getStoredSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  return {
    url: localUrl || envUrl,
    key: localKey || envKey,
  };
};

export const saveStoredSupabaseConfig = (url: string, key: string) => {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  clientInstance = null; // reset client
};

let clientInstance: SupabaseClient | null = null;

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getStoredSupabaseConfig();
  return Boolean(
    url && 
    key && 
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    key.length > 20
  );
};

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!clientInstance && isSupabaseConfigured()) {
    const { url, key } = getStoredSupabaseConfig();
    try {
      clientInstance = createClient(url, key);
    } catch (e) {
      console.warn('Supabase initialization failed:', e);
      clientInstance = null;
    }
  }
  return clientInstance;
};

/**
 * Test connectivity by querying the fields table
 */
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; rowCount?: number }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase URL or Anon Key is missing or invalid.' };
  }

  try {
    const { data, error, count } = await client
      .from('fields')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (error) {
      return { success: false, message: `Database error: ${error.message} (Code: ${error.code})` };
    }

    return { 
      success: true, 
      message: `Connected successfully! Found ${data?.length ?? 0} fields in database table 'fields'.`,
      rowCount: data?.length ?? 0
    };
  } catch (err: any) {
    return { success: false, message: `Connection failed: ${err?.message || 'Network error'}` };
  }
};
