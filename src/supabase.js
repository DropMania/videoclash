import { createClient } from '@supabase/supabase-js'
import keys from './keys'

export default createClient(keys.supabaseUrl, keys.supabaseKey)
