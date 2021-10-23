import { supabase } from '../../lib/supabase'
import { definitions } from '../../types/supabase'
import { QueryResolver } from './index'

const users: QueryResolver['users'] = async () => {
  const { data: users, error } = await supabase
    .from<definitions['users']>('users')
    .select('*')

  if (error) return []
  return users
}

export default users
