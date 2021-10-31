import throng from 'throng'

import { scanItem } from './domain/services/items'
import { queue } from './lib/queue'

const workers = process.env.WEB_CONCURRENCY || 2
const maxJobsPerWorker = 50

function start() {
  queue.process(maxJobsPerWorker, async job => {
    const data = job.data
    switch (data.type) {
      case 'ScanItem': {
        await scanItem(data.itemId)
        break
      }
      default: {
        console.log(data)
        break
      }
    }
  })
}

throng({ workers, start })
