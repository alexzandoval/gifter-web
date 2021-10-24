import { useState } from 'react'
import { AppBar, IconButton, Toolbar, Typography, Theme, Avatar } from '@mui/material'
import {
  Menu as MenuIcon,
  Brightness7 as SunIcon,
  Brightness3 as MoonIcon,
} from '@mui/icons-material'
import { makeStyles } from '@mui/styles'
import { useHistory } from 'react-router-dom'

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
  const { user } = useAuth()
  const history = useHistory()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { colorScheme, toggleColorScheme } = useColorScheme()

  const handleAvatarClick = () => {
    history.push(routes.account.path)
  }

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen)
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
          {user && (
            <IconButton onClick={handleAvatarClick}>
              <Avatar sx={{ width: 32, height: 32 }} src={user.photoURL || ''} />
            </IconButton>
          )}
          <IconButton color="inherit" onClick={toggleColorScheme} size="large">
            {colorScheme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <NavigationDrawer
        DrawerProps={{
          open: isDrawerOpen,
          onClose: () => setIsDrawerOpen(false),
        }}
      />
    </>
  )
}

export default Header
