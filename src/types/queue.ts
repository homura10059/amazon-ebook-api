type ScanAllItems = {
  type: 'ScanAllItems'
}

type ScanItem = {
  type: 'ScanItem'
  itemId: string
}

export type JobData = ScanAllItems | ScanItem
