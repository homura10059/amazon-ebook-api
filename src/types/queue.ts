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

export type JobData = ScanAllItems | ScanItem | ScanAllWishLists | ScanWishList
export type JobType = Pick<JobData, 'type'>['type']
