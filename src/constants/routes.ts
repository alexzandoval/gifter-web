import { Home as HomeIcon, Info as InfoIcon } from '@mui/icons-material'

import About from '@Components/pages/About'
import Account from '@Components/pages/Account'
import CreateExchange from '@Components/pages/CreateExchange'
import Exchanges from '@Components/pages/Exchanges'
import Home from '@Components/pages/Home'
import Login from '@Components/pages/Login'
import PageNotFound from '@Components/pages/PageNotFound'
import Register from '@Components/pages/Register'
import SingleExchange from '@Components/pages/SingleExchange'
import SingleWishlist from '@Components/pages/SingleWishlist'
import Wishlists from '@Components/pages/Wishlists'
import JoinExchange from '@Components/pages/JoinExchange'
import { AppRoutes, ResourceId } from '@Types'

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
  // 404 route, must be last
  notFound: {
    path: '*',
    Component: PageNotFound,
  },
}

export default ROUTES
