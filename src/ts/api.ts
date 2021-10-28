export interface CreateWishlistDto {
  name: string
}

export interface Wishlist extends CreateWishlistDto {
  id: number
  userId: string
}

export interface WishlistWithItems extends Wishlist {
  items: {
    id: number
    content: string
    wishlistId: number
  }[]
}
