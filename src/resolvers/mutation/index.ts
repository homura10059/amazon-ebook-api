import { Resolvers } from '../../types/generated/graphql'
import items from './items'
export type MutationResolver = NonNullable<Resolvers['Mutation']>

const mutation: MutationResolver = {
  scanItem: items.scanItem,
  scanAllItems: items.scanAllItems
}

export default mutation
