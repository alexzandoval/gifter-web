import { Box, Divider, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

import SocialProviderButton from 'components/auth/SocialProviderButton'
import routes from 'constants/routes'
import { useAuth } from 'context/Auth'
import EmailAuth from 'components/auth/EmailAuth'

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
        }}
      >
        <EmailAuth type="signIn" />
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
      </Box>
    </Box>
  )
}

export default Login
