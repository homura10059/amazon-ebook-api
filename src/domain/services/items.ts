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
  const scraped = await scrapeItem(item.url)

  await supabase
    .from<definitions['items']>('items')
    .update({ title: scraped.title, scrapedAt: scraped.scrapedAt })
    .eq('id', item.id)

  await supabase
    .from<definitions['itemHistories']>('itemHistories')
    .insert([{ itemId: item.id, ...scraped.history }])
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
