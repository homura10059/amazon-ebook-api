import { supabase } from '../../lib/supabase'
import { definitions } from '../../types/supabase'
import { scrapeWishList } from '../repositories/wishLists'

export const fetchWishList = async (
  id: string
): Promise<definitions['wishLists']> => {
  const { data: wishLists, error } = await supabase
    .from<definitions['wishLists']>('wishLists')
    .select('*')
    .eq('id', id)

  if (error || wishLists?.length !== 1) {
    throw error
  }
  return wishLists[0]
}

export const updateWishList = async (wishList: { id: string; url: string }) => {
  const scraped = await scrapeWishList(wishList.url)

  await supabase
    .from<definitions['wishLists']>('wishLists')
    .update({ title: scraped.title, scrapedAt: scraped.scrapedAt })
    .eq('id', wishList.id)

  const { data: items, error } = await supabase
    .from<definitions['items']>('items')
    .upsert(
      scraped.itemUrlList.map(url => ({ url })),
      { onConflict: 'url', ignoreDuplicates: true }
    )

  if (error || !items) {
    return
  }

  await supabase
    .from<definitions['wishLists_to_items']>('wishLists_to_items')
    .delete()
    .eq('wishListId', wishList.id)

  await supabase
    .from<definitions['wishLists_to_items']>('wishLists_to_items')
    .upsert(items.map(item => ({ wishListId: wishList.id, itemId: item.id })))
}

export const scanWishList = async (id: string) => {
  try {
    const wishList = await fetchWishList(id)
    await updateWishList(wishList)
  } catch (e) {
    console.log(e)
  }
}

export const scanAllWishLists = async () => {
  const { data: wishLists, error } = await supabase
    .from<definitions['wishLists']>('wishLists')
    .select('id')
  if (error || wishLists === null) return
  await Promise.all(wishLists.map(({ id }) => scanWishList(id)))
}
