import { queue } from '../../lib/queue'
import { MutationResolver } from './index'

const notify: MutationResolver['notify'] = async (
  parent,
  args,
  _context,
  _info
) => {
  const job = await queue.add({ type: 'Notify', userId: args.userId })
  return {
    jobId: job.id.toString()
  }
}

export default { notify }
