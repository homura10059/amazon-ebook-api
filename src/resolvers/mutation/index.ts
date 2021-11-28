import { Resolvers } from '../../types/generated/graphql'
import items from './items'
import notifications from './notifications'
import wishLists from './wishLists'
export type MutationResolver = NonNullable<Resolvers['Mutation']>

const mutation: MutationResolver = {
  scanItem: items.scanItem,
  scanAllItems: items.scanAllItems,
  scanWishList: wishLists.scanWishList,
  scanAllWishLists: wishLists.scanAllWishLists,
  notify: notifications.notify
}

export default mutation
