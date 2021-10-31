import { Browser, Page } from 'puppeteer'

import { getUnixTimeInSec } from '../../lib/dates'
import { getBrowser, getText, scrape } from '../../lib/scraper'
import {
  POINTS,
  POINTS_RATE,
  PRICE,
  SAVING,
  TITLE
} from '../models/cssSelector'

const priceRegex = /\d{1,3}(,\d{3})*/
const percentageRegex = /\d{1,3}/

const getPrice = async (page: Page) => {
  const priceStr = await getText(page, PRICE)
  const price = priceRegex.exec(priceStr)
  return price && price.length > 0
    ? parseInt(price[0].trim().replace(',', ''), 10)
    : undefined
}

const getSaving = async (page: Page) => {
  return getText(page, SAVING).then((saving: string) => {
    const discount = priceRegex.exec(saving)
    const discountPer = percentageRegex.exec(saving.split('(')[1])
    return {
      discount:
        discount && discount.length > 0
          ? parseInt(discount[0].trim().replace(',', ''), 10)
          : undefined,
      discountRate:
        discountPer && discountPer.length > 0
          ? parseInt(discountPer[0], 10)
          : undefined
    }
  })
}

const getPoints = async (page: Page) => {
  const pointsStr = await getText(page, POINTS)
  const points = priceRegex.exec(pointsStr)
  return points && points.length > 0
    ? parseInt(points[0].trim().replace(',', ''), 10)
    : undefined
}

const getPointsRate = async (page: Page) =>
  getText(page, POINTS_RATE)
    .then((pointsPerStr: string) => {
      const surrounded = pointsPerStr.split('(')
      const pointsPer =
        surrounded && surrounded.length > 1
          ? surrounded[1].split(')')
          : undefined
      return pointsPer && pointsPer.length > 0 ? pointsPer[0] : ''
    })
    .then((pointsPerStr: string) => {
      const pointsPer = percentageRegex.exec(pointsPerStr)
      return pointsPer && pointsPer.length > 0
        ? parseInt(pointsPer[0], 10)
        : undefined
    })

export const scrapeItemWishBrowser = async (browser: Browser, url: string) => {
  const page = await scrape(browser, url)
  const scrapedAt = getUnixTimeInSec(new Date(Date.now()))

  const saving = await getSaving(page)

  const history = {
    scrapedAt,
    price: await getPrice(page),
    points: await getPoints(page),
    pointsRate: await getPointsRate(page),
    ...saving
  }

  const item = {
    url,
    title: await getText(page, TITLE),
    scrapedAt,
    history
  }
  await page.close()

  return item
}

export const scrapeItem = async (url: string) => {
  const browser = await getBrowser()
  return scrapeItemWishBrowser(browser, url)
}
