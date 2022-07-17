import { ReactNode } from 'react'
import { Link } from '@mui/material'
import { AuthError, AuthErrorCodes } from 'firebase/auth'
import { Link as RouterLink } from 'react-router-dom'

import { AUTH_PROVIDERS, ROUTES } from 'appConstants'

export const handleAuthError = (authError: AuthError): ReactNode => {
  switch (authError.code) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return (
        <>
          Email is already in use, did you mean to{' '}
          <Link to={ROUTES.login.path} component={RouterLink}>
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
    case AuthErrorCodes.NEED_CONFIRMATION:
      const availableProviders = (
        authError.customData as any
      )?._tokenResponse?.verifiedProvider?.map((provider: string) => {
        // eslint-disable-next-line no-restricted-syntax, @typescript-eslint/no-unused-vars
        for (const [_key, PROVIDER] of Object.entries(AUTH_PROVIDERS)) {
          if (PROVIDER.ID === provider) return PROVIDER.NAME
        }
        return null
      })
      if (availableProviders?.length > 0) {
        return (
          <>
            This account is already linked with the following providers:{' '}
            {availableProviders.join(', ')}.
            <br />
            Sign in with one of them to continue.
          </>
        )
      }
      return 'This account is already linked with another provider. Sign in with it to continue.'
    default:
      return 'Something went wrong, try again later.'
  }
}
