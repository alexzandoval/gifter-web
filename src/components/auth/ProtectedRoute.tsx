import { FC, useEffect, useState } from 'react'
import { Redirect, Route, RouteProps, useLocation } from 'react-router-dom'

import { ROUTES } from '@Constants'
import { useAuth } from '@Context/Auth'
import { URLBuilder } from '@Utility'

const urlBuilder = new URLBuilder({ isApiCall: false })

const ProtectedRoute: FC<RouteProps> = (props) => {
  const { user, authInitialized } = useAuth()
  const { children, ...other } = props
  const location = useLocation()
  const [redirectUrl, setRedirectUrl] = useState<string>(ROUTES.login.path)

  useEffect(() => {
    setRedirectUrl(urlBuilder.addPath(ROUTES.login.path).redirect(location.pathname).build())
  }, [location.pathname])

  if (!authInitialized) return null

  return <Route {...other}>{user ? children : <Redirect to={redirectUrl} />}</Route>
}

export default ProtectedRoute
