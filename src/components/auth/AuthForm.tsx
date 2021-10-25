import { FC } from 'react'
import { Box, Divider, Link, Typography } from '@mui/material'
import { useHistory, Link as RouterLink } from 'react-router-dom'

import SocialProviderButton from 'components/auth/SocialProviderButton'
import routes from 'constants/routes'
import { useAuth } from 'context/Auth'
import EmailAuth from 'components/auth/EmailAuth'

export interface Props {
  type: 'signIn' | 'signUp'
}

const AuthForm: FC<Props> = ({ type }) => {
  const history = useHistory()
  const { signInWithGoogle, signInWithFacebook } = useAuth()
  const isNewSignUp = type === 'signUp'

  const handleSignInWithEmail = () => history.push(routes.emailLogin.path)

  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithGoogle()
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  const handleSignInWithFacebook = async () => {
    try {
      const result = await signInWithFacebook()
      console.log(result)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4,
          width: 400,
          maxWidth: '100%',
          '& > *': { marginBottom: 3, width: '100%' },
          '& .MuiButton-root': { marginBottom: 3 },
        }}
      >
        <Typography sx={{ marginBottom: 4 }} variant="h2">
          {isNewSignUp ? 'Sign Up' : 'Login'}
        </Typography>
        <EmailAuth type={type} />
        <Box>
          <Divider>OR</Divider>
        </Box>
        <SocialProviderButton provider="google" onClick={handleSignInWithGoogle}>
          Continue with Google
        </SocialProviderButton>
        <SocialProviderButton provider="apple">Continue with Apple</SocialProviderButton>
        <SocialProviderButton provider="facebook" onClick={handleSignInWithFacebook}>
          Continue with Facebook
        </SocialProviderButton>
        <Typography>
          {isNewSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Link to={isNewSignUp ? routes.login.path : routes.register.path} component={RouterLink}>
            {isNewSignUp ? 'Login' : 'Sign Up'}
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}

export default AuthForm
