import { Button, TextField, Theme, Typography } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { useAuth } from 'context/Auth'
import { FC } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

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
    maxWidth: 600,
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
      <Button type="submit" variant="contained" size="large" sx={{ maxWidth: 300 }}>
        Submit
      </Button>
    </form>
  )
}

export default EmailAuth
