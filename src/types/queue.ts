type ScanAllItems = {
  type: 'ScanAllItems'
}

type ScanItem = {
  type: 'ScanItem'
  itemId: string
}

type ScanAllWishLists = {
  type: 'ScanAllWishLists'
}

type ScanWishList = {
  type: 'ScanWishList'
  wishListId: string
}

type Notify = {
  type: 'Notify'
  userId: string
}

type NotifyAllUsers = {
  type: 'NotifyAllUsers'
}

export type JobData =
  | ScanAllItems
  | ScanItem
  | ScanAllWishLists
  | ScanWishList
  | Notify
  | NotifyAllUsers
export type JobType = Pick<JobData, 'type'>['type']
