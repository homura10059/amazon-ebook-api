import { supabase } from '../../lib/supabase'
import { Resolvers } from '../../types/generated/graphql'
import { definitions } from '../../types/supabase'

const query: Resolvers['Query'] = {
  users: async () => {
    const { data: users, error } = await supabase
      .from<definitions['users']>('users')
      .select('*')

    if (error) return []
    return users
  }
}

export default query
