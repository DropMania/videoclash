import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cgkbkwhwnxoksqtvputh.supabase.co'
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNna2Jrd2h3bnhva3NxdHZwdXRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUyMzkyMDMsImV4cCI6MTk4MDgxNTIwM30.u0x-NlX-dl7v2BF_X5TL3p74pO6WaRpcDF3QzX9r0OU'
export default createClient(supabaseUrl, supabaseKey)
