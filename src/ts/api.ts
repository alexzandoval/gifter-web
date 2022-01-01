export interface User {
  uid: string
  email: string
  username: string
  photoUrl: string
}

export interface CreateWishlistDto {
  name: string
}

export interface Wishlist extends CreateWishlistDto {
  id: number
  userId: string
}

export interface WishlistItem {
  id: number
  content: string
  wishlistId: number
}

export interface WishlistWithItems extends Wishlist {
  items: WishlistItem[]
}

export interface Exchange {
  id: number
  participants: User[]
  organizerId: string
  name: string
  date: Date
  budget: number
}
