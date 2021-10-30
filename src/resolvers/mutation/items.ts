import { queue } from '../../lib/queue'
import { MutationResolver } from './index'

const scanItem: MutationResolver['scanItem'] = async (
  parent,
  args,
  _context,
  _info
) => {
  const job = await queue.add({ type: 'ScanItem', itemId: args.id })
  return {
    jobId: job.id.toString()
  }
}

const scanAllItems: MutationResolver['scanAllItems'] = async () => {
  const job = await queue.add({ type: 'ScanAllItems' })
  return {
    jobId: job.id.toString()
  }
}

export default { scanItem, scanAllItems }
