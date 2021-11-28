import { queue } from './lib/queue'

const main = async () => {
  const jobType = process.env.JOB_TYPE
  console.log(jobType)
  switch (jobType) {
    case 'ScanAllItems': {
      await queue.add({ type: 'ScanAllItems' })
      break
    }
    case 'ScanAllWishList': {
      await queue.add({ type: 'ScanAllWishLists' })
      break
    }
    case 'NotifyAllUsers': {
      await queue.add({ type: 'NotifyAllUsers' })
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
