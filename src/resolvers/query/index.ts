import { Resolvers } from '../../types/generated/graphql'
import users from './users'

export type QueryResolver = NonNullable<Resolvers['Query']>
const query: QueryResolver = {
  users
}

export default query
