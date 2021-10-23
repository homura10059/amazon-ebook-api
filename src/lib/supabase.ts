import { createClient } from '@supabase/supabase-js'

import { SERVICE_KEY, SUPABASE_URL } from './constsnts'

export const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
