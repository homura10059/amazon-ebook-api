import Bull from 'bull'
import throng from 'throng'

import { scanAllItems, scanItem } from './domain/services/items'
import { scanWishList } from './domain/services/wishLists'
import { queue } from './lib/queue'
import { JobData } from './types/queue'

const workers = process.env.WEB_CONCURRENCY || 2
const maxJobsPerWorker = 10

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
      case 'ScanWishList': {
        await scanWishList(data.wishListId)
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
