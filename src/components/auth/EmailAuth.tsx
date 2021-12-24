import { Dispatch, FC, SetStateAction } from 'react'
import { TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'

import { useAuth } from 'context/Auth'
import { Props as AuthFormProps } from './AuthForm'
import SocialProviderButton from './SocialProviderButton'

interface Props extends AuthFormProps {
  disabled?: boolean
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
}

type FormValues = {
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
}))

const EmailAuth: FC<Props> = ({ type, disabled, isLoading, setIsLoading }) => {
  const classes = useStyles()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>()
  const { signInWithEmail, signUpWithEmail } = useAuth()
  const isNewSignUp = type === 'signUp'

  const getErrorMessage = (inputErrors: FieldError | undefined, label: string): string => {
    if (!inputErrors) return ''
    const { message, type: errorType } = inputErrors
    if (message) return message
    if (errorType === 'required') {
      return `${label} is required`
    }
    return ''
  }

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setIsLoading(true)
      let result
      if (isNewSignUp) {
        result = await signUpWithEmail(data.email, data.password)
      } else {
        result = await signInWithEmail(data.email, data.password)
      }
      console.log(result)
    } catch (e) {
      console.log('Error authenticating with email', e)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <TextField
        type="email"
        disabled={disabled}
        variant="filled"
        label="Email"
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
        disabled={disabled}
        variant="filled"
        label="Password"
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
          disabled={disabled}
          variant="filled"
          label="Confirm Password"
          error={Boolean(errors.confirmPassword)}
          helperText={getErrorMessage(errors.confirmPassword, 'Confirm Password')}
          inputProps={{
            ...register('confirmPassword', {
              validate: (value) => value === watch('password') || 'Passwords must match',
            }),
          }}
        />
      )}
      <SocialProviderButton loading={isLoading} disabled={disabled} provider="email" type="submit">
        {isNewSignUp ? 'Sign up with Email' : 'Sign in with Email'}
      </SocialProviderButton>
    </form>
  )
}

export default EmailAuth
