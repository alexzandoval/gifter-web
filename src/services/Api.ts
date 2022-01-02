import { apiAxios } from 'context/Auth'
import { CreateWishlistDto, Exchange, Wishlist, WishlistItem, WishlistWithItems } from 'ts/api'
import { ResourceId } from 'ts/types'
import URLBuilder from '../utility/URLBuilder'

const urlBuilder = new URLBuilder()

const Api = {
  wishlists: {
    create: async (wishlist: CreateWishlistDto): Promise<Wishlist> => {
      const result = await apiAxios.post<Wishlist>(urlBuilder.wishlists().build(), wishlist)
      return result.data
    },
    addItem: async (wishlistId: ResourceId, content: string): Promise<WishlistItem> => {
      const result = await apiAxios.post<WishlistItem>(
        urlBuilder.wishlists(wishlistId).items().build(),
        { content },
      )
      return result.data
    },
    getAll: async (): Promise<Wishlist[]> => {
      const result = await apiAxios.get<Wishlist[]>(urlBuilder.wishlists().build())
      return result.data
    },
    get: async (wishlistId: ResourceId): Promise<WishlistWithItems> => {
      const result = await apiAxios.get<WishlistWithItems>(urlBuilder.wishlists(wishlistId).build())
      return result.data
    },
    rename: async (wishlistId: ResourceId, newName: string): Promise<WishlistWithItems> => {
      const result = await apiAxios.patch<WishlistWithItems>(
        urlBuilder.wishlists(wishlistId).build(),
        { name: newName },
      )
      return result.data
    },
    delete: async (wishlistId: ResourceId): Promise<boolean> => {
      const result = await apiAxios.delete(urlBuilder.wishlists(wishlistId).build())
      if (result.status === 200) {
        return true
      }
      return false
    },
  },
  exchanges: {
    getAll: async (): Promise<Exchange[]> => {
      const result = await apiAxios.get<Exchange[]>(urlBuilder.exchanges().build())
      return result.data
    },
    get: async (id: ResourceId): Promise<Exchange> => {
      const result = await apiAxios.get<Exchange>(urlBuilder.exchanges(id).build())
      return result.data
    },
  },
}

export default Api
