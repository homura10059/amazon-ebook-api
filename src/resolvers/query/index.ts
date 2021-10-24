import { Resolvers } from '../../types/generated/graphql'
import items from './items'
import jobs from './jobs'
import users from './users'

export type QueryResolver = NonNullable<Resolvers['Query']>
const query: QueryResolver = {
  users: users.users,
  scanAllItems: items.scanAllItems,
  job: jobs.job
}

export default query
