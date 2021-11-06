import { queue } from '../../lib/queue'
import { MutationResolver } from './index'

const scanWishList: MutationResolver['scanWishList'] = async (
  parent,
  args,
  _context,
  _info
) => {
  const job = await queue.add({ type: 'ScanWishList', wishListId: args.id })
  return {
    jobId: job.id.toString()
  }
}

const scanAllWishLists: MutationResolver['scanAllWishLists'] = async () => {
  const job = await queue.add({ type: 'ScanAllWishLists' })
  return {
    jobId: job.id.toString()
  }
}

export default { scanWishList, scanAllWishLists }
