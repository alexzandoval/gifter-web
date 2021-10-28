import { api } from 'context/Auth'
import { useCallback } from 'react'
import { CreateWishlistDto, Wishlist, WishlistWithItems } from 'ts/api'

const useApi = () => {
  const getWishlists = useCallback(async (): Promise<Wishlist[]> => {
    const result = await api.get<Wishlist[]>('/wishlist')
    return result.data
  }, [])

  const getSingleWishlist = useCallback(async (id: string): Promise<WishlistWithItems> => {
    const result = await api.get<WishlistWithItems>(`/wishlist/${id}`)
    return result.data
  }, [])

  const postWishlist = useCallback(async (wishlist: CreateWishlistDto): Promise<Wishlist> => {
    const result = await api.post<Wishlist>('/wishlist', wishlist)
    return result.data
  }, [])

  return { getWishlists, getSingleWishlist, postWishlist }
}

export default useApi
