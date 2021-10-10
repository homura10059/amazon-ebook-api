import { Resolvers } from '../../types/generated/graphql'
import { getUser } from './users'

const query: Resolvers['Query'] = {
  getUser
}

export default query
