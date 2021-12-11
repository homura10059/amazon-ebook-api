import format from 'date-fns/format'
import { ja } from 'date-fns/locale'

import { sliceByNumber } from '../../lib/arrays'
import { getUnixTimeNow } from '../../lib/dates'
import * as discord from '../../lib/discord'
import { supabase } from '../../lib/supabase'
import { definitions } from '../../types/supabase'

type Item = {
  id: string
  url: string
  scrapedAt: number
  title: string
}
type User = {
  id: string
  notification: {
    userId: string
    serviceType: string
    webhookUrl: string
  }[]
  users_to_wishLists: {
    userId: string
    wishListId: string
    wishLists: {
      id: string
      url: string
      scrapedAt: number
      title: string
      wishLists_to_items: {
        wishListId: string
        itemId: string
        items: Item
      }[]
    }[]
  }[]
}

const getUser = async (id: string) => {
  const { data, error } = await supabase
    .from<User>('users')
    .select(
      `
      id,
      notification (
        userId,
        serviceType,
        webhookUrl
      ),
      users_to_wishLists (
        userId,
        wishListId,
        wishLists (
          id,
          url,
          scrapedAt,
          title,
          wishLists_to_items (
            wishListId,
            itemId,
            items (
              id,
              url,
              scrapedAt,
              title
            )
          )
        )
      )
    `
    )
    .eq('id', id)
  if (error) throw error
  return data ? data[0] : null
}

const COLOR = {
  red: parseInt('ff0000', 16),
  yellow: parseInt('ffff00', 16),
  green: parseInt('008000', 16),
  gray: parseInt('808080', 16)
} as const

const convertColorFrom = (
  history: definitions['itemHistories'],
  discountRateThreshold = 20,
  pointsRateThreshold = 20
): number => {
  const dRate = history.discountRate ?? 0
  const pRate = history.pointsRate ?? 0
  if (!(dRate >= discountRateThreshold || pRate >= pointsRateThreshold)) {
    return COLOR.gray
  }

  if (dRate >= 35 || pRate >= 35) {
    return COLOR.red
  }

  if (dRate >= 30 || pRate >= 30) {
    return COLOR.yellow
  }

  return COLOR.green
}

const convertEmbedsFrom = (
  item: Item,
  history: definitions['itemHistories']
): discord.Embed | null => {
  const color = convertColorFrom(history)
  if (color === COLOR.gray) return null

  return {
    title: `${item.title}`,
    url: `${item.url}`,
    color: color,
    fields: [
      {
        name: '金額',
        value: history.price ? `¥${history.price}` : '----',
        inline: true
      },
      {
        name: '値引き率',
        value: history.discountRate ? `${history.discountRate}%` : '----',
        inline: true
      },
      {
        name: 'ポイント還元率',
        value: history.pointsRate ? `${history.pointsRate}%` : '----',
        inline: true
      },
      {
        name: '更新日',
        value: format(
          new Date(history.scrapedAt * 1000),
          'yyyy/MM/dd HH:mm:ss',
          { locale: ja }
        ),
        inline: true
      }
    ]
  }
}

const Millis_14Days = 14 * 24 * 60 * 60 * 1000
const createEmbed = async (item: Item): Promise<discord.Embed | null> => {
  const { data, error } = await supabase
    .from<definitions['itemHistories']>('itemHistories')
    .select(`*`)
    .eq('itemId', item.id)
    .gte('scrapedAt', getUnixTimeNow() - Millis_14Days)

  if (error) throw error
  if (!data) throw new Error('undefined item')
  const sorted = data.sort((a, b) => b.scrapedAt - a.scrapedAt)

  const latest = sorted[0]
  return convertEmbedsFrom(item, latest)
}

export const notify = async (id: string) => {
  const user = await getUser(id)
  if (!user) throw new Error('undefined user')
  const items = user.users_to_wishLists
    .flatMap(x => x.wishLists)
    .flatMap(x => x.wishLists_to_items)
    .flatMap(x => x.items)
  const embeds = await Promise.all(items.map(createEmbed))
  const result = embeds.filter(
    (embed): embed is discord.Embed => embed !== null
  )
  console.log(result)
  if (result.length === 0) {
    console.log('no items for notify')
    return
  }
  const slices = sliceByNumber(result, 10)
  await Promise.all(
    slices.map(slice => {
      discord.notify({
        webhookUrl: user.notification[0].webhookUrl,
        body: {
          content: `セール情報です！`,
          embeds: slice
        }
      })
    })
  )
}

export const notifyAllUsers = async () => {
  const { data, error } = await supabase.from<User>('users').select(`id`)
  if (error || data === null) {
    return
  }
  await Promise.all(data.map(d => notify(d.id)))
}
