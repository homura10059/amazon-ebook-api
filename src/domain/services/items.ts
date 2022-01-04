import { notifyError } from '../../lib/discord'
import { queue } from '../../lib/queue'
import { supabase } from '../../lib/supabase'
import { definitions } from '../../types/supabase'
import { scrapeItem } from '../repositories/items'

export const fetchItem = async (id: string): Promise<definitions['items']> => {
  const { data: items, error } = await supabase
    .from<definitions['items']>('items')
    .select('*')
    .eq('id', id)

  if (error || items?.length !== 1) {
    throw error
  }
  return items[0]
}

export const updateItem = async (item: { id: string; url: string }) => {
  const url = new URL(item.url)
  url.searchParams.append('language', 'ja_JP')
  const scraped = await scrapeItem(url.toString())

  await supabase
    .from<definitions['items']>('items')
    .update({
      title: scraped.title,
      scrapedAt: scraped.scrapedAt,
      thumbnailUrl: scraped.thumbnailUrl
    })
    .eq('id', item.id)

  if (Object.values(scraped.history).every(x => x === undefined)) {
    await notifyError(new Error(`all value is undefined on ${item.url}`))
  } else {
    await supabase
      .from<definitions['itemHistories']>('itemHistories')
      .insert([{ itemId: item.id, ...scraped.history }])
  }
}

export const scanItem = async (id: string) => {
  try {
    const item = await fetchItem(id)
    await updateItem(item)
  } catch (e) {
    console.log(e)
  }
}

export const scanAllItems = async () => {
  console.log('scanAllItems')
  const { data: items, error } = await supabase
    .from<definitions['items']>('items')
    .select('*')

  if (error || !items) {
    throw error
  }

  await Promise.allSettled(
    items.map(item => queue.add({ type: 'ScanItem', itemId: item.id }))
  )
}

type Item2WishList = definitions['items'] & {
  wishLists_to_items: definitions['wishLists_to_items'][]
}
export const deleteNoRelationItem = async () => {
  console.log('deleteNoRelationItem')
  const { data: items, error } = await supabase
    .from<Item2WishList>('items')
    .select('*, wishLists_to_items(*)')

  if (error || !items) {
    throw error
  }

  const deleteTarget = items.filter(
    item => item.wishLists_to_items.length === 0
  )

  await supabase
    .from<definitions['items']>('items')
    .delete()
    .in(
      'id',
      deleteTarget.map(item => item.id)
    )
}
