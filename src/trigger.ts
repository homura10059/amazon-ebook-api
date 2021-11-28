import { scanAllItems } from './domain/services/items'
import { notifyAllUsers } from './domain/services/notifications'

const main = async () => {
  const jobType = process.env.JOB_TYPE
  console.log(jobType)
  switch (jobType) {
    case 'ScanAllItems': {
      await scanAllItems()
      break
    }
    case 'NotifyAllUsers': {
      await notifyAllUsers()
      break
    }
    default: {
      console.log(jobType)
      break
    }
  }
  process.exit(0)
}

main()
