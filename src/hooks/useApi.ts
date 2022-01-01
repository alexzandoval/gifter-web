import { api } from 'context/Auth'
import { useCallback } from 'react'
import { CreateWishlistDto, Exchange, Wishlist, WishlistItem, WishlistWithItems } from 'ts/api'

const useApi = () => {
  const getWishlists = useCallback(async (): Promise<Wishlist[]> => {
    const result = await api.get<Wishlist[]>('/wishlists')
    return result.data
  }, [])

  const getSingleWishlist = useCallback(async (id: string): Promise<WishlistWithItems> => {
    const result = await api.get<WishlistWithItems>(`/wishlists/${id}`)
    return result.data
  }, [])

  const createWishlist = useCallback(async (wishlist: CreateWishlistDto): Promise<Wishlist> => {
    const result = await api.post<Wishlist>('/wishlists', wishlist)
    return result.data
  }, [])

  const addItemToWishlist = useCallback(
    async (wishlistId: number, content: string): Promise<WishlistItem> => {
      const result = await api.post<WishlistItem>(`/wishlists/${wishlistId}/items`, {
        content,
      })
      return result.data
    },
    [],
  )

  const getExchanges = useCallback(async (): Promise<Exchange[]> => {
    const result = await api.get<Exchange[]>('/exchanges')
    return result.data
  }, [])

  const getSingleExchange = useCallback(async (id: string): Promise<Exchange> => {
    const result = await api.get<Exchange>(`/exchanges/${id}`)
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
