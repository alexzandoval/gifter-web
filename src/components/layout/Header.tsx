import { MouseEvent, useState } from 'react'
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Theme,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Link,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Brightness7 as SunIcon,
  Brightness3 as MoonIcon,
  Logout,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { Link as RouterLink, useHistory, useLocation } from 'react-router-dom'

import routes from 'constants/routes'
import NavigationDrawer from 'components/layout/NavigationDrawer'
import { useAuth } from 'context/Auth'
import { useColorScheme } from 'context/Theme'

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    display: 'flex',
    [theme.mixins.drawer.visibleBreakpoint]: {
      zIndex: theme.zIndex.drawer + 1,
    },
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.mixins.drawer.visibleBreakpoint]: {
      display: 'none',
    },
  },
}))

const Header = () => {
  const classes = useStyles()
  const { user, signOut } = useAuth()
  const history = useHistory()
  const location = useLocation()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const { colorScheme, toggleColorScheme } = useColorScheme()

  const isLogin = location.pathname === routes.login.path
  const isSignUp = location.pathname === routes.register.path

  const handleAvatarClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
  }

  const handleCloseProfileMenu = () => {
    setAnchorEl(null)
  }

  const handleProfileClick = () => {
    history.push(routes.account.path)
    handleCloseProfileMenu()
  }

  const handleDrawerToggle = () => {
    setIsDrawerOpen((prev) => !prev)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
            size="large"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Header
          </Typography>
          <div className={classes.grow} />
          {user ? (
            <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ width: 32, height: 32 }} src={user.photoURL || ''} />
            </IconButton>
          ) : (
            <>
              {!isLogin && (
                <Link
                  sx={{ marginRight: 1 }}
                  color="inherit"
                  underline="hover"
                  component={RouterLink}
                  to={routes.login.path}
                >
                  Login
                </Link>
              )}
              {!isSignUp && !isLogin && '/'}
              {!isSignUp && (
                <Link
                  sx={{ marginLeft: 1 }}
                  color="inherit"
                  underline="hover"
                  component={RouterLink}
                  to={routes.register.path}
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
          <IconButton color="inherit" onClick={toggleColorScheme} size="large">
            {colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        DrawerProps={{
          open: isDrawerOpen,
          onClose: handleDrawerClose,
        }}
        onClose={handleDrawerClose}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseProfileMenu}
        onClick={handleCloseProfileMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
        <MenuItem>My Gift Exchanges</MenuItem>
        <MenuItem>My Wishlists</MenuItem>
        <Divider />
        <MenuItem onClick={signOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  )
}

export default Header
