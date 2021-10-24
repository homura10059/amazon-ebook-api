import { Resolvers } from '../../types/generated/graphql'

export type MutationResolver = NonNullable<Resolvers['Mutation']>

const mutation: MutationResolver = {}

export default mutation
