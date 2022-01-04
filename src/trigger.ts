import got from 'got'

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
    case 'DeleteNoRelationItem': {
      await queue.add({ type: 'DeleteNoRelationItem' })
      break
    }
    case 'WakeUp': {
      const port = process.env.PORT || '3000'
      const url =
        port === '3000'
          ? `http://localhost:${port}/`
          : `https://amazon-ebook-api.herokuapp.com/`
      await got.get(url)
      break
    }
    default: {
      console.log(`undefined jobType : ${jobType}`)
      break
    }
  }
  process.exit(0)
}

main()
