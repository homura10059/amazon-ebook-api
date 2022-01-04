import Bull from 'bull'
import throng from 'throng'

import {
  deleteNoRelationItem,
  scanAllItems,
  scanItem
} from './domain/services/items'
import { notify, notifyAllUsers } from './domain/services/notifications'
import { scanAllWishLists, scanWishList } from './domain/services/wishLists'
import { queue } from './lib/queue'
import { JobData } from './types/queue'

const workers = process.env.WEB_CONCURRENCY || 2
const maxJobsPerWorker = 2

const worker = async (job: Bull.Job<JobData>) => {
  try {
    const data = job.data
    console.log(`[start] ${data.type}: ${job.id}`)
    switch (data.type) {
      case 'ScanItem': {
        await scanItem(data.itemId)
        break
      }
      case 'ScanAllItems': {
        await scanAllItems()
        break
      }
      case 'ScanAllWishLists': {
        await scanAllWishLists()
        break
      }
      case 'ScanWishList': {
        await scanWishList(data.wishListId)
        break
      }
      case 'DeleteNoRelationItem': {
        await deleteNoRelationItem()
        break
      }
      case 'Notify': {
        await notify(data.userId)
        break
      }
      case 'NotifyAllUsers': {
        await notifyAllUsers()
        break
      }
      default: {
        console.log(data)
        break
      }
    }
    console.log(`[end] ${data.type}: ${job.id}`)
  } catch (e) {
    console.log(e)
    await job.discard()
  }
}

const start = () => {
  queue.process(maxJobsPerWorker, worker)
}

throng({ workers, start })
