import { FC } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  DrawerProps as DrawerPropTypes,
  useTheme,
  useMediaQuery,
  Toolbar,
  Theme,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import clsx from 'clsx'
import { useLocation } from 'react-router-dom'

import { ROUTES } from 'appConstants'
import { useAuth } from 'context/Auth'
import { AppRoutes } from 'ts/types'
import { renderLink } from 'utility'

interface Props {
  DrawerProps: DrawerPropTypes
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) => ({
  drawerWidth: {
    width: theme.mixins.drawer.width,
    maxWidth: '90vw',
  },
  drawer: {
    flexShrink: 0,
  },
  paper: {
    boxSizing: 'border-box',
    paddingTop: 0,
    [theme.mixins.drawer.hiddenBreakpoint]: {
      paddingTop: theme.mixins.header.height,
    },
  },
}))

const NavigationDrawer: FC<Props> = ({ DrawerProps, onClose }) => {
  const classes = useStyles()
  const { user } = useAuth()
  const theme = useTheme()
  const location = useLocation()
  const isDesktop = useMediaQuery(theme.mixins.drawer.visibleBreakpoint)

  const navItems = Object.keys(ROUTES).map((routeName) => {
    const route = ROUTES[routeName as keyof AppRoutes]
    if (!route.nav || (route.protectedRoute && !user) || (route.publicOnlyRoute && user)) {
      return null
    }
    const { Icon } = route.nav
    const link = renderLink(route.path)
    return (
      <ListItem
        key={route.path}
        button
        component={link}
        onClick={onClose}
        selected={route.path === location.pathname}
      >
        <ListItemIcon>{Icon && <Icon />}</ListItemIcon>
        <ListItemText primary={route.nav.label} />
      </ListItem>
    )
  })

  return (
    <Drawer
      {...DrawerProps}
      variant={isDesktop ? 'permanent' : 'temporary'}
      classes={{
        root: clsx(classes.drawer, classes.drawerWidth),
        paper: clsx(classes.paper, classes.drawerWidth),
      }}
    >
      {isDesktop && <Toolbar />}
      <List>{navItems}</List>
    </Drawer>
  )
}

export default NavigationDrawer
