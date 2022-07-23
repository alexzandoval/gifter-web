import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { AppTypography } from 'components/common'
import { URLBuilder } from 'utility'

const urlBuilder = new URLBuilder({ isApiCall: false })

const UserNotSignedIn = () => {
  const location = useLocation()

  const urls = {
    login: urlBuilder.addPath(ROUTES.login.path).redirect(location.pathname).build(),
    register: urlBuilder.addPath(ROUTES.register.path).redirect(location.pathname).build(),
  }

  return (
    <>
      <Typography gutterBottom>
        To join this exchange, <AppTypography bold>log in</AppTypography> or{' '}
        <AppTypography bold>sign up</AppTypography> with a free account.
      </Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          maxWidth: 200,
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 3,
        }}
      >
        <Button variant="contained" component={RouterLink} to={urls.login}>
          Login
        </Button>
        <Button variant="contained" component={RouterLink} to={urls.register}>
          Sign Up
        </Button>
      </Box>
    </>
  )
}

export default UserNotSignedIn
