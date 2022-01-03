import { Browser, Page } from 'puppeteer'
import url from 'url'

import { unique } from '../../lib/arrays'
import { getUnixTimeNow } from '../../lib/dates'
import { getBrowser, getHrefList, getText, scrape } from '../../lib/scraper'
import { WISH_LIST_NAME } from '../models/selector'

const filteredLink = (
  protocol: string,
  host: string,
  links: string[]
): string[] => {
  const uniqueLinks = unique(links)
  const hrefs = uniqueLinks
    .filter((href: string) => href.includes('?coliid'))
    .filter((href: string) => href.includes('&ref'))
    .map((href: string) => href.replace('/-/en/dp', '/dp'))
    .map((href: string) => href.split('?')[0])
  return hrefs.map(href => `${protocol}//${host}${href}`)
}

const getScrapedWishListFromPage = async (page: Page) => {
  const title = await getText(page, WISH_LIST_NAME)
  const links = await getHrefList(page, 'a')

  const parsedUrl = url.parse(page.url())
  const protocol = parsedUrl.protocol || 'https:'
  const host = parsedUrl.host || 'www.amazon.co.jp'
  const itemUrlList = filteredLink(protocol, host, links)

  return {
    url: page.url(),
    title: title,
    scrapedAt: getUnixTimeNow(),
    itemUrlList
  }
}

const getScrapedWishList = async (browser: Browser, url: string) => {
  console.log('start scrapeUrl:' + url)
  const page = await scrape(browser, url)
  const wishList = await getScrapedWishListFromPage(page)
  await page.close()
  console.log('end scrapeUrl:' + url)
  return wishList
}

export const scrapeWishList = async (url: string) => {
  const browser = await getBrowser()
  return getScrapedWishList(browser, url)
}
