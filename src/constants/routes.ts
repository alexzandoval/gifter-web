import { FC } from 'react'
import { Home as HomeIcon, Info as InfoIcon } from '@mui/icons-material'
import { RouteProps } from 'react-router-dom'
import About from 'components/pages/About'
import Home from 'components/pages/Home'
import PageNotFound from 'components/pages/PageNotFound'

export type Route = {
  Component: FC
  path: string
  props?: RouteProps
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
  // 404 route, must be last
  notFound: {
    path: '*',
    Component: PageNotFound,
  },
}

export default routes
