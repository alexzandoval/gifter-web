import { FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import routes from 'constants/routes'
import { useAuth } from 'context/Auth'

const PublicOnlyRoute: FC<RouteProps> = (props) => {
  const { user, authInitialized } = useAuth()
  const { children, ...other } = props

  if (!authInitialized) return null

  return <Route {...other}>{!user ? children : <Redirect to={routes.account.path} />}</Route>
}

export default PublicOnlyRoute
