import { FC } from 'react'
import { Home as HomeIcon, Info as InfoIcon, Login as LoginIcon } from '@mui/icons-material'
import { RouteProps } from 'react-router-dom'
import SignInWithEmail from 'components/pages/SignInWithEmail'
import SignUpWithEmail from 'components/pages/SignUpWithEmail'
import About from 'components/pages/About'
import Home from 'components/pages/Home'
import Login from 'components/pages/Login'
import PageNotFound from 'components/pages/PageNotFound'
import Register from 'components/pages/Register'
import Account from 'components/pages/Account'

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
  emailLogin: {
    path: '/login/email',
    Component: SignInWithEmail,
    publicOnlyRoute: true,
  },
  login: {
    path: '/login',
    Component: Login,
    publicOnlyRoute: true,
    nav: {
      label: 'Login',
      Icon: LoginIcon,
    },
  },
  emailRegister: {
    path: '/register/email',
    Component: SignUpWithEmail,
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

export default routes
