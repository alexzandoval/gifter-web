import { FC } from 'react'
import { Home as HomeIcon, Info as InfoIcon, Science } from '@mui/icons-material'
import { RouteProps } from 'react-router-dom'

import About from 'components/pages/About'
import Account from 'components/pages/Account'
import CreateExchange from 'components/pages/CreateExchange'
import Exchanges from 'components/pages/Exchanges'
import Home from 'components/pages/Home'
import Login from 'components/pages/Login'
import PageNotFound from 'components/pages/PageNotFound'
import Register from 'components/pages/Register'
import SingleExchange from 'components/pages/SingleExchange'
import SingleWishlist from 'components/pages/SingleWishlist'
import Test from 'components/pages/Test'
import Wishlists from 'components/pages/Wishlists'
import { ResourceId } from 'ts/types'

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

export type IdRoute = Route & {
  id: (id: ResourceId) => string
}

export type Routes = {
  home: Route
  about: Route
  account: Route
  singleWishlist: IdRoute
  wishlists: Route
  singleExchange: IdRoute
  createExchange: Route
  exchanges: Route
  login: Route
  register: Route
  test: Route
  notFound: Route
}

const routes: Routes = {
  home: {
    path: '/',
    Component: Home,
    props: {
      exact: true,
    },
    nav: {
      label: 'Home',
      Icon: HomeIcon,
    },
  },
  about: {
    path: '/about',
    Component: About,
    nav: {
      label: 'About',
      Icon: InfoIcon,
    },
  },
  account: {
    path: '/account',
    Component: Account,
    protectedRoute: true,
  },
  singleWishlist: {
    path: '/wishlists/:id',
    id: (id: ResourceId) => `/wishlists/${id}`,
    Component: SingleWishlist,
    protectedRoute: true,
  },
  wishlists: {
    path: '/wishlists',
    Component: Wishlists,
    protectedRoute: true,
    nav: {
      label: 'My Wishlists',
    },
  },
  singleExchange: {
    path: '/exchanges/:id',
    id: (id: ResourceId) => `/exchanges/${id}`,
    Component: SingleExchange,
    protectedRoute: true,
  },
  createExchange: {
    path: '/create-exchange',
    Component: CreateExchange,
    protectedRoute: true,
  },
  exchanges: {
    path: '/exchanges',
    Component: Exchanges,
    protectedRoute: true,
    nav: {
      label: 'My Exchanges',
    },
  },
  login: {
    path: '/login',
    Component: Login,
    publicOnlyRoute: true,
  },
  register: {
    path: '/register',
    Component: Register,
    publicOnlyRoute: true,
  },
  test: {
    path: '/test',
    Component: Test,
    nav: {
      label: 'Test',
      Icon: Science,
    },
  },
  // 404 route, must be last
  notFound: {
    path: '*',
    Component: PageNotFound,
  },
}

export default routes
