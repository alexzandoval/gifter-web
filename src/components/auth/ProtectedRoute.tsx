import routes from 'constants/routes'
import { useAuth } from 'context/Auth'
import { FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

const ProtectedRoute: FC<RouteProps> = (props) => {
  const { user, authInitialized } = useAuth()
  const { children, ...other } = props

  if (!authInitialized) return null

  return <Route {...other}>{user ? children : <Redirect to={routes.login.path} />}</Route>
}

export default ProtectedRoute
