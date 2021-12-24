import { FC, useState } from 'react'
import { Box, Divider, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import EmailAuth from 'components/auth/EmailAuth'
import SocialProviderButton from 'components/auth/SocialProviderButton'
import routes from 'constants/routes'
import { useAuth } from 'context/Auth'

export interface Props {
  type: 'signIn' | 'signUp'
}

const AuthForm: FC<Props> = ({ type }) => {
  const { signInWithGoogle, signInWithApple, signInWithFacebook } = useAuth()
  const [emailIsLoading, setEmailIsLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [isAppleLoading, setIsAppleLoading] = useState<boolean>(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false)
  const isNewSignUp = type === 'signUp'
  const formIsLoading = emailIsLoading || isGoogleLoading || isAppleLoading || isFacebookLoading

  const handleSignInWithGoogle = async () => {
    try {
      setIsGoogleLoading(true)
      const result = await signInWithGoogle()
      console.log(result)
    } catch (e) {
      console.log(e)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleSignInWithApple = async () => {
    try {
      setIsAppleLoading(true)
      const result = await signInWithApple()
      console.log(result)
    } catch (e) {
      console.log(e)
    } finally {
      setIsAppleLoading(false)
    }
  }

  const handleSignInWithFacebook = async () => {
    try {
      setIsFacebookLoading(true)
      const result = await signInWithFacebook()
      console.log(result)
    } catch (e) {
      console.log(e)
    } finally {
      setIsFacebookLoading(false)
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
        <EmailAuth
          type={type}
          disabled={formIsLoading}
          isLoading={emailIsLoading}
          setIsLoading={setEmailIsLoading}
        />
        <Box>
          <Divider>OR</Divider>
        </Box>
        <SocialProviderButton
          loading={isGoogleLoading}
          disabled={formIsLoading}
          provider="google"
          onClick={handleSignInWithGoogle}
        >
          Continue with Google
        </SocialProviderButton>
        <SocialProviderButton
          loading={isAppleLoading}
          disabled={formIsLoading}
          provider="apple"
          onClick={handleSignInWithApple}
        >
          Continue with Apple
        </SocialProviderButton>
        <SocialProviderButton
          loading={isFacebookLoading}
          disabled={formIsLoading}
          provider="facebook"
          onClick={handleSignInWithFacebook}
        >
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
