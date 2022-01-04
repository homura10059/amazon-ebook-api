import { Browser, Page } from 'puppeteer'

import { getUnixTimeInSec } from '../../lib/dates'
import { getBrowser, getImageUrl, getText, scrape } from '../../lib/scraper'
import { PRICE, REAL_PRICE, THUMBNAIL, TITLE } from '../models/selector'

const priceRegex = /\d{1,3}(,\d{3})*/
const pointsRegex = /\d{1,3}(,\d{3})*pt/

const isStringArray = (x: unknown[]): x is string[] =>
  x.every(t => typeof t === 'string')

const convertRegExpExecArrayToNumber = (exp: RegExpExecArray | null) =>
  exp && exp.length > 0
    ? parseInt(exp[0].trim().replace(',', ''), 10)
    : undefined

const getPriceAndPoints = async (page: Page, xpath: string) => {
  try {
    const elms = await page.$x(xpath)
    const parents = await Promise.all(elms.map(elm => elm.$x('..')))
    const handles = await Promise.all(
      parents.flat().map(x => x.getProperty('textContent'))
    )
    const texts = await Promise.all(handles.map(handle => handle.jsonValue()))
    if (!isStringArray(texts)) {
      return {
        price: undefined,
        points: undefined
      }
    }
    const text = texts.join().trim()
    const price = priceRegex.exec(text)
    const points = pointsRegex.exec(text)
    return {
      price: convertRegExpExecArrayToNumber(price),
      points: convertRegExpExecArrayToNumber(points)
    }
  } catch (e) {
    console.log(e)
    return {
      price: undefined,
      points: undefined
    }
  }
}

const getRealPrice = async (page: Page) => {
  const priceStr = await getText(page, REAL_PRICE).catch(_e => undefined)
  if (priceStr === undefined) return undefined
  const price = priceRegex.exec(priceStr)
  return convertRegExpExecArrayToNumber(price)
}

const rate = (denominntor?: number, numerator?: number) => {
  if (!denominntor || !numerator) {
    return undefined
  }
  return Math.round((denominntor / numerator) * 100)
}

const calcDiscount = (price?: number, realPrice?: number) => {
  if (!price || !realPrice) {
    return undefined
  }
  const delta = realPrice - price
  return delta < 0 ? undefined : delta
}

export const scrapeItemWishBrowser = async (browser: Browser, url: string) => {
  const page = await scrape(browser, url)
  const scrapedAt = getUnixTimeInSec(new Date(Date.now()))

  const { price, points } = await getPriceAndPoints(page, PRICE)
  const realPrice = await getRealPrice(page)
  const thumbnailUrl = await getImageUrl(page, THUMBNAIL)
  const discount = calcDiscount(price, realPrice)
  const history = {
    scrapedAt,
    price,
    points,
    pointsRate: rate(points, price),
    discount,
    discountRate: rate(discount, realPrice)
  }

  const item = {
    url,
    title: await getText(page, TITLE),
    scrapedAt,
    thumbnailUrl,
    history
  }
  await page.close()

  return item
}

export const scrapeItem = async (url: string) => {
  console.log('start scrapeUrl:' + url)
  const browser = await getBrowser()
  const data = await scrapeItemWishBrowser(browser, url)
  console.log('end scrapeUrl:' + url)
  return data
}
