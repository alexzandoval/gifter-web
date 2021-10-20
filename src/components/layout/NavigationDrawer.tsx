import { FC, forwardRef } from 'react'
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
import makeStyles from '@mui/styles/makeStyles'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'
import clsx from 'clsx'
import routes from 'constants/routes'

interface Props {
  DrawerProps: DrawerPropTypes
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
  },
}))

const NavigationDrawer: FC<Props> = ({ DrawerProps }) => {
  const classes = useStyles()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.mixins.drawer.visibleBreakpoint)

  const renderLink = (to: string) =>
    forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'>>((itemProps, ref) => (
      <RouterLink to={to} ref={ref} {...itemProps} />
    ))

  const navItems = Object.keys(routes).map((routeName) => {
    const route = routes[routeName]
    if (!route.nav) return null // Removing item
    const { Icon } = route.nav
    const link = renderLink(route.path)
    return (
      <ListItem key={route.path} button component={link}>
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
