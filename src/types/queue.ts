type ScanItem = {
  type: 'ScanItem'
  itemId: string
}

type ScanWishList = {
  type: 'ScanWishList'
  wishListId: string
}

type Notify = {
  type: 'Notify'
  userId: string
}

const simpleJobType = [
  'DeleteNoRelationItem',
  'NotifyAllUsers',
  'ScanAllItems',
  'ScanAllWishLists'
] as const
type SimpleJob = {
  type: typeof simpleJobType[number]
}
export type JobData = ScanItem | ScanWishList | Notify | SimpleJob
export type JobType = Pick<JobData, 'type'>['type']
