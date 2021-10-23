import dotenv from 'dotenv'

dotenv.config()

export const APOLLO_SERVER_PORT = process.env.PORT ?? '4000'

export const SUPABASE_KEY = process.env.SUPABASE_KEY ?? ''
export const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
