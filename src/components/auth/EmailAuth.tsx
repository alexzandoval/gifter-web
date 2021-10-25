import { TextField, Theme } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAuth } from 'context/Auth'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
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

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    if (isNewSignUp) {
      console.log('signing up', data)
    } else {
      console.log('signing in', data)
    }
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit(handleFormSubmit)}>
      <TextField type="email" variant="filled" label="Email" {...register('email')} />
      <TextField type="password" variant="filled" label="Password" {...register('password')} />
      {isNewSignUp && (
        <TextField
          type="password"
          variant="filled"
          label="Confirm Password"
          {...register('confirmPassword')}
        />
      )}
      <SocialProviderButton provider="email">Sign in with Email</SocialProviderButton>
    </form>
  )
}

export default EmailAuth
