import { queue } from '../../lib/queue'
import { QueryResolver } from './index'

const job: QueryResolver['job'] = async (parent, args, _context, _info) => {
  const job = await queue.getJob(args.id)
  if (job === null) return null

  const state = await job.getState()
  const progress = job.progress()
  const reason = job.failedReason ?? null
  return {
    id: args.id,
    state,
    progress,
    reason
  }
}

export default { job }
