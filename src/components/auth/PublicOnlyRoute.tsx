import { FC } from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

import { ROUTES } from '@Constants'
import { useAuth } from '@Context/Auth'
import useQuery from '@Hooks/useQuery'

const PublicOnlyRoute: FC<RouteProps> = (props) => {
  const { user, authInitialized } = useAuth()
  const { children, ...other } = props
  const redirectUrl = useQuery().get('redirect')

  if (!authInitialized) return null

  return (
    <Route {...other}>
      {!user ? children : <Redirect to={redirectUrl || ROUTES.account.path} />}
    </Route>
  )
}

export default PublicOnlyRoute
