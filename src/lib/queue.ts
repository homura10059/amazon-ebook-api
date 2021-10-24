import Queue from 'bull'

import { JobData } from '../types/queue'
import { REDIS_URL } from './constsnts'

export const queue = new Queue<JobData>('work', REDIS_URL)
