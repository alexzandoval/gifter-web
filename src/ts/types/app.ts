import { FC } from 'react'
import { RouteProps } from 'react-router-dom'

export type Route = {
  Component: FC
  path: string
  props?: RouteProps
  publicOnlyRoute?: boolean
  protectedRoute?: boolean
  nav?: {
    label: string
    Icon?: FC
  }
}

export type ResourceId = string | number

export type IdRoute = Route & {
  id: (id: ResourceId) => string
}

export type AppRoutes = {
  home: Route
  about: Route
  account: Route
  singleWishlist: IdRoute
  wishlists: Route
  joinExchange: IdRoute
  singleExchange: IdRoute
  createExchange: Route
  exchanges: Route
  login: Route
  register: Route
  test: Route
  notFound: Route
}

export type ServerValidationError = {
  error: string
  message: string[]
  statusCode: number
}
