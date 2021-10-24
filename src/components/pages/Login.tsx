import { Box, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

import SocialProviderButton from 'components/auth/SocialProviderButton'
import routes from 'constants/routes'
import { useAuth } from 'context/Auth'

const Login = () => {
  const history = useHistory()
  const { signInWithGoogle, signInWithFacebook } = useAuth()

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
    <>
      <Typography variant="h1">Login</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 4,
          '& .MuiButton-root': { marginBottom: 4, width: 300, maxWidth: '100%' },
        }}
      >
        <SocialProviderButton provider="email" onClick={handleSignInWithEmail}>
          Sign in with Email
        </SocialProviderButton>
        <SocialProviderButton provider="google" onClick={handleSignInWithGoogle}>
          Continue with Google
        </SocialProviderButton>
        <SocialProviderButton provider="apple">Continue with Apple</SocialProviderButton>
        <SocialProviderButton provider="facebook" onClick={handleSignInWithFacebook}>
          Continue with Facebook
        </SocialProviderButton>
      </Box>
    </>
  )
}

export default Login
