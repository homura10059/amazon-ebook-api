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

export const scanItem = async (id: string) => {
  const item = await fetchItem(id)

  const scraped = await scrapeItem(item.url)

  await supabase
    .from<definitions['items']>('items')
    .update({ title: scraped.title, scrapedAt: scraped.scrapedAt })
    .eq('id', id)

  await supabase
    .from<definitions['itemHistories']>('itemHistories')
    .insert([{ itemId: id, ...scraped.history }])
}
