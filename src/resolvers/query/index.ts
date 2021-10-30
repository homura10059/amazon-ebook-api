import { Resolvers } from '../../types/generated/graphql'
import jobs from './jobs'
import users from './users'

export type QueryResolver = NonNullable<Resolvers['Query']>
const query: QueryResolver = {
  users: users.users,
  job: jobs.job
}

export default query
