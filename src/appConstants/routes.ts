import { Home as HomeIcon, Info as InfoIcon, Science } from '@mui/icons-material'

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
import JoinExchange from 'components/pages/JoinExchange'
import { AppRoutes, ResourceId } from 'ts/types'

export const ROUTES: AppRoutes = {
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
  joinExchange: {
    path: '/exchanges/join/:id',
    id: (id: ResourceId) => `/exchanges/join/${id}`,
    Component: JoinExchange,
    protectedRoute: false,
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

export default ROUTES
