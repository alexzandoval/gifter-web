/* eslint-disable no-console */
import { Dispatch, FC, ReactNode, SetStateAction, useState } from 'react'
import { Box, Button, Divider, TextField, Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { AuthError, UserCredential } from 'firebase/auth'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'
import { useHistory } from 'react-router-dom'

import SocialProviderButton from 'components/auth/SocialProviderButton'
import routes from 'constants/routes'
import { useAuth } from 'context/Auth'
import { SocialProvider } from 'ts/enums'
import { handleAuthError } from 'utility/auth'

export interface Props {
  type: 'signIn' | 'signUp'
}

type AuthFormValues = {
  email: string
  password: string
  confirmPassword: string
}

const useStyles = makeStyles((theme: Theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTextField-root': {
      marginBottom: theme.spacing(2),
    },
  },
  submitErrorText: {
    marginBottom: theme.spacing(2),
  },
}))

const AuthForm: FC<Props> = ({ type }) => {
  const classes = useStyles()
  const history = useHistory()
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
  } = useAuth()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormValues>()
  const [emailIsLoading, setEmailIsLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)
  const [isAppleLoading, setIsAppleLoading] = useState<boolean>(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | ReactNode>('')

  const isNewSignUp = type === 'signUp'
  const formIsLoading = emailIsLoading || isGoogleLoading || isAppleLoading || isFacebookLoading

  const handleToggleSignIn = () => {
    history.push(isNewSignUp ? routes.login.path : routes.register.path)
  }

  const getErrorMessage = (inputErrors: FieldError | undefined, label: string): string => {
    if (!inputErrors) return ''
    const { message, type: errorType } = inputErrors
    if (message) return message
    if (errorType === 'required') {
      return `${label} is required`
    }
    return ''
  }

  const handleSignInWithProvider = async (
    setIsLoading: Dispatch<SetStateAction<boolean>>,
    handleSignIn: () => Promise<UserCredential>,
  ) => {
    try {
      setIsLoading(true)
      setError('')
      const result = await handleSignIn()
      console.log(result)
    } catch (e) {
      console.log(`Error authenticating with provider`, e)
      setError(handleAuthError(e as AuthError))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignInWithEmail: SubmitHandler<AuthFormValues> = async (data) => {
    let handleSignIn
    if (isNewSignUp) {
      handleSignIn = () => signUpWithEmail(data.email, data.password)
    } else {
      handleSignIn = () => signInWithEmail(data.email, data.password)
    }
    handleSignInWithProvider(setEmailIsLoading, handleSignIn)
  }

  const handleSignInWithGoogle = () =>
    handleSignInWithProvider(setIsGoogleLoading, signInWithGoogle)

  const handleSignInWithApple = () => handleSignInWithProvider(setIsAppleLoading, signInWithApple)

  const handleSignInWithFacebook = () =>
    handleSignInWithProvider(setIsFacebookLoading, signInWithFacebook)

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
        <form className={classes.form} onSubmit={handleSubmit(handleSignInWithEmail)} noValidate>
          {error && <Typography className={classes.submitErrorText}>{error}</Typography>}
          <TextField
            type="email"
            disabled={formIsLoading}
            label="Email"
            variant="filled"
            error={Boolean(errors.email)}
            helperText={getErrorMessage(errors.email, 'Email')}
            inputProps={{
              ...register('email', {
                required: 'Please enter a valid email address',
                pattern: {
                  value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
                  message: 'Please enter a valid email address',
                },
              }),
            }}
          />
          <TextField
            type="password"
            disabled={formIsLoading}
            label="Password"
            variant="filled"
            error={Boolean(errors.password)}
            helperText={getErrorMessage(errors.password, 'Password')}
            inputProps={{
              ...register('password', {
                required: 'Please enter a password',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              }),
            }}
          />
          {isNewSignUp && (
            <TextField
              type="password"
              disabled={formIsLoading}
              label="Confirm Password"
              variant="filled"
              error={Boolean(errors.confirmPassword)}
              helperText={getErrorMessage(errors.confirmPassword, 'Confirm Password')}
              inputProps={{
                ...register('confirmPassword', {
                  validate: (value) => value === watch('password') || 'Passwords must match',
                }),
              }}
            />
          )}
          <SocialProviderButton
            loading={emailIsLoading}
            disabled={formIsLoading}
            provider={SocialProvider.EMAIL}
            type="submit"
          >
            {isNewSignUp ? 'Sign up with Email' : 'Sign in with Email'}
          </SocialProviderButton>
        </form>
        <Box>
          <Divider>OR</Divider>
        </Box>
        <SocialProviderButton
          loading={isGoogleLoading}
          disabled={formIsLoading}
          provider={SocialProvider.GOOGLE}
          onClick={handleSignInWithGoogle}
        >
          Continue with Google
        </SocialProviderButton>
        <SocialProviderButton
          loading={isAppleLoading}
          disabled={formIsLoading}
          provider={SocialProvider.APPLE}
          onClick={handleSignInWithApple}
        >
          Continue with Apple
        </SocialProviderButton>
        <SocialProviderButton
          loading={isFacebookLoading}
          disabled={formIsLoading}
          provider={SocialProvider.FACEBOOK}
          onClick={handleSignInWithFacebook}
        >
          Continue with Facebook
        </SocialProviderButton>
        <Button sx={{ textTransform: 'none' }} onClick={handleToggleSignIn}>
          {isNewSignUp ? 'Already have an account? Login.' : "Don't have an account? Sign Up."}
        </Button>
      </Box>
    </Box>
  )
}

export default AuthForm
