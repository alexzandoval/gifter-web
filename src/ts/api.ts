import { ExclusionParticipant, Rules } from 'components/exchanges/NewExchangeForm'

export interface User {
  uid: string
  email: string
  username: string
  photoUrl: string
}

export interface Participant {
  id: number
  name: string
  exchangeId: number
  excludedDraws: Participant[]
  userId?: string
  wishlistId?: number
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

export interface CreateExchangeDto {
  name: string
  budget?: number
  date?: Date
  addExclusions: Rules['addExclusions']
  numberOfDraws: Rules['numberOfDraws']
  participants: ExclusionParticipant[]
}

export interface Exchange {
  id: number
  name: string
  budget?: number
  date?: string
  numberOfDraws: Rules['numberOfDraws']
  participants: Participant[]
  organizerId: string
}

export type ApiPath = 'check-exclusions'
