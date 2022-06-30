import { useEffect, useState } from 'react'
import { Delete } from '@mui/icons-material'
import {
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { Link as RouterLink, useHistory, useLocation, useParams } from 'react-router-dom'

import Centered from 'components/shared/Centered'
import Loader from 'components/shared/Loader'
import routes from 'constants/routes'
import Api from 'services/Api'
import { Exchange } from 'ts/api'
import { useAuth } from 'context/Auth'
import URLBuilder from 'utility/URLBuilder'

type ExchangeParams = {
  id: string
}

const urlBuilder = new URLBuilder({ isApiCall: false })

// TODO: Cases to handle
// ❌ 1. User is not logged in => Show exchange information and prompt them to login with redirect to this page
// ❌ 2. User is logged in and not part of the exchange already => Show Dropper for them to claim their spot, then redirect to Exchange page
// ✅ 3. User is logged in and already joined => Redirect to exchange page
// ❌ 4. All participant slots are taken => Show message that exchange is full and to contact the organizer
// ✅ 5. User is logged in and is the organizer => Redirect to exchange page

const JoinExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true)
  const [exchangeDeleting, setExchangeDeleting] = useState<boolean>(false)
  const history = useHistory()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const fetchExchange = async () => {
      try {
        setExchangeLoading(true)
        const fetchedExchange = await Api.exchanges.joinExchange(id)
        // const fetchedExchange = await Api.exchanges.get(id)
        console.log('fetchedExchange', fetchedExchange)
        setExchange(fetchedExchange)
      } catch (e) {
        // TODO: Handle error
        console.log('Error fetching exchange join information', e)
        // history.push(routes.exchanges.path)
      } finally {
        setExchangeLoading(false)
      }
    }

    fetchExchange()
  }, [id, history])

  const urls = {
    login: urlBuilder.addPath(routes.login.path).redirect(location.pathname).build(),
    register: urlBuilder.addPath(routes.register.path).redirect(location.pathname).build(),
  }
  const organizerName = exchange?.participants.find(
    (p) => p.user?.uid === exchange?.organizer.uid,
  )?.name
  const userIsAlreadyJoined =
    user &&
    (exchange?.participants.some((p) => p.user && p.user.uid === user.uid) ||
      exchange?.organizer.uid === user.uid)

  const getExchangeContent = (currentExchange: Exchange) => <>{currentExchange.name}</>

  if (userIsAlreadyJoined) {
    history.push(routes.singleExchange.id(id))
    return null
  }

  return (
    <>
      <Loader
        loading={exchangeLoading}
        loader={
          <Centered horizontal vertical>
            <CircularProgress />
          </Centered>
        }
      >
        {exchange && (
          <Card raised>
            <CardContent>
              <Typography variant="h6">
                {organizerName} invited you to join {exchange.name}!
              </Typography>
              <Typography>{exchange.description}</Typography>
              {user ? (
                getExchangeContent(exchange)
              ) : (
                <>
                  <Typography>
                    To join this exchange log in or sign up for a free account.
                  </Typography>
                  <Button variant="contained" component={RouterLink} to={urls.login}>
                    Login
                  </Button>
                  <Button variant="contained" component={RouterLink} to={urls.register}>
                    Sign Up
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </Loader>
    </>
  )
}

export default JoinExchange
