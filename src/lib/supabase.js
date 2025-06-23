import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pflsvyacqrudvpnrzyfq.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbHN2eWFjcXJ1ZHZwbnJ6eWZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2OTkxMTcsImV4cCI6MjA2NjI3NTExN30.EWG0u1A7Oa3IYPsgAGConKqKrEBE3xOXTrlzqpkUTtE'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase