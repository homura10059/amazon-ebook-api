import dotenv from 'dotenv'

dotenv.config()

export const APOLLO_SERVER_PORT = process.env.PORT ?? '4000'

export const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
export const SERVICE_KEY = process.env.SERVICE_KEY ?? ''

export const REDIS_URL = process.env.REDIS_URL ?? 'redis://127.0.0.1:6379'

export const ALERT_WEB_HOOK_URL = process.env.ALERT_WEB_HOOK_URL ?? ''
