import { FC } from 'react'
import { Home as HomeIcon, Info as InfoIcon, Science } from '@mui/icons-material'
import { RouteProps } from 'react-router-dom'
import About from 'components/pages/About'
import Home from 'components/pages/Home'
import Login from 'components/pages/Login'
import PageNotFound from 'components/pages/PageNotFound'
import Register from 'components/pages/Register'
import Account from 'components/pages/Account'
import Test from 'components/pages/Test'
import Wishlists from 'components/pages/Wishlists'

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

const routes: { [name: string]: Route } = {
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
  wishlists: {
    path: '/wishlists',
    Component: Wishlists,
    protectedRoute: true,
    nav: {
      label: 'My Wishlists',
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
