// supabase.js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://mtjnwuwodblvicglpfct.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_b6mUvpgx-2hqic4o1RZUcA_d0wjRvBa';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);