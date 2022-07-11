import { FC } from 'react'
import { Route, RouteProps } from 'react-router-dom'

import { useAuth } from 'context/Auth'

const PublicRoute: FC<RouteProps> = (props) => {
  const { authInitialized } = useAuth()
  const { children, ...other } = props

  if (!authInitialized) return null

  return <Route {...other}>{children}</Route>
}

export default PublicRoute
