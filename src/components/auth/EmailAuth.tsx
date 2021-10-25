import { TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAuth } from 'context/Auth'
import { FC } from 'react'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'
import SocialProviderButton from './SocialProviderButton'

interface Props {
  type: 'signIn' | 'signUp'
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

const EmailAuth: FC<Props> = ({ type }) => {
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
    if (inputErrors.message) return inputErrors.message
    if (inputErrors.type === 'required') {
      return `${label} is required`
    }
    return ''
  }

  console.log(errors)
  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isNewSignUp) {
      console.log('signing up', data)
    } else {
      console.log('signing in', data)
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <TextField
        type="email"
        variant="filled"
        label="Email"
        error={Boolean(errors.email)}
        helperText={getErrorMessage(errors.email, 'Email')}
        inputProps={{
          ...register('email', {
            required: true,
            pattern: {
              value: /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/,
              message: 'Please enter a valid email address',
            },
          }),
        }}
      />
      <TextField
        type="password"
        variant="filled"
        label="Password"
        error={Boolean(errors.password)}
        helperText={getErrorMessage(errors.password, 'Password')}
        inputProps={{ ...register('password', { required: true }) }}
      />
      {isNewSignUp && (
        <TextField
          type="password"
          variant="filled"
          label="Confirm Password"
          error={Boolean(errors.confirmPassword)}
          helperText={getErrorMessage(errors.confirmPassword, 'Confirm Password')}
          inputProps={{
            ...register('confirmPassword', {
              required: true,
              validate: (value) => value === watch('password') || 'Passwords must match',
            }),
          }}
        />
      )}
      <SocialProviderButton provider="email" type="submit">
        Sign in with Email
      </SocialProviderButton>
    </form>
  )
}

export default EmailAuth
