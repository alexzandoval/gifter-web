import { api } from 'context/Auth'
import { useCallback } from 'react'
import { CreateWishlistDto, Exchange, Wishlist, WishlistItem, WishlistWithItems } from 'ts/api'
import URLBuilder from 'utility/URLBuilder'

const urlBuilder = new URLBuilder()

const useApi = () => {
  const getWishlists = useCallback(async (): Promise<Wishlist[]> => {
    const result = await api.get<Wishlist[]>(urlBuilder.wishlists().build())
    return result.data
  }, [])

  const getSingleWishlist = useCallback(async (wishlistId: string): Promise<WishlistWithItems> => {
    const result = await api.get<WishlistWithItems>(urlBuilder.wishlists(wishlistId).build())
    return result.data
  }, [])

  const createWishlist = useCallback(async (wishlist: CreateWishlistDto): Promise<Wishlist> => {
    const result = await api.post<Wishlist>(urlBuilder.wishlists().build(), wishlist)
    return result.data
  }, [])

  const addItemToWishlist = useCallback(
    async (wishlistId: number, content: string): Promise<WishlistItem> => {
      const result = await api.post<WishlistItem>(
        urlBuilder.wishlists(wishlistId).items().build(),
        {
          content,
        },
      )
      return result.data
    },
    [],
  )

  const getExchanges = useCallback(async (): Promise<Exchange[]> => {
    const result = await api.get<Exchange[]>(urlBuilder.exchanges().build())
    return result.data
  }, [])

  const getSingleExchange = useCallback(async (id: string): Promise<Exchange> => {
    const result = await api.get<Exchange>(urlBuilder.exchanges(id).build())
    return result.data
  }, [])

  return {
    getWishlists,
    getSingleWishlist,
    createWishlist,
    addItemToWishlist,
    getExchanges,
    getSingleExchange,
  }
}

export default useApi
