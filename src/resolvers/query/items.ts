import { queue } from '../../lib/queue'
import { QueryResolver } from './index'

const scanAllItems: QueryResolver['scanAllItems'] = async () => {
  const job = await queue.add({ type: 'ScanAllItems' })
  return {
    jobId: job.id.toString()
  }
}

export default {
  scanAllItems
}
