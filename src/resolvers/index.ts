import { Resolvers } from '../types/generated/graphql'
import Mutation from './mutation'
import Query from './query'

const resolvers: Resolvers = {
  Query,
  Mutation
}

export default resolvers
