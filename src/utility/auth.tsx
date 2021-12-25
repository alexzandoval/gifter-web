import { Link } from '@mui/material'
import routes from 'constants/routes'
import { AuthError, AuthErrorCodes } from 'firebase/auth'
import { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

// eslint-disable-next-line import/prefer-default-export
export const handleAuthError = (authError: AuthError): ReactNode => {
  switch (authError.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return (
        <>
          Email is already in use, did you mean to{' '}
          <Link to={routes.login.path} component={RouterLink}>
            sign in?
          </Link>
          {'\n'}
          You may have also already created an account with a different provider like Google, Apple,
          or Facebook.
        </>
      )
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Invalid email, verify that the correct email was entered.'
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Invalid password, please try again.'
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'Password must be at least 6 characters.'
    case AuthErrorCodes.USER_DISABLED:
      return 'Your account has been disabled, please contact support.'
    case AuthErrorCodes.POPUP_BLOCKED:
      return 'Popup was blocked, please allow popups for this site in order to sign in.'
    default:
      return 'Something went wrong, try again later.'
  }
}
