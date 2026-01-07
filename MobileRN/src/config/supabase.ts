import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto'; // Must be at the very top

const SUPABASE_URL = 'https://dvcresexxauxkdpalsri.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ktBgVQf5dErPAw7dVVifgQ_w274YKjz';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
