import { ReactNode, useEffect, useState } from 'react'
import { CalendarToday } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import Title from 'components/shared/Title'
import { format } from 'date-fns'
import LoadingButton from 'components/shared/LoadingButton'
import AppTypography from 'components/shared/AppTypography'

type ExchangeParams = {
  id: string
}

const urlBuilder = new URLBuilder({ isApiCall: false })

// TODO: Cases to handle
// ✅ 1. User is not logged in => Show exchange information and prompt them to login with redirect to this page
// ❌ 2. User is logged in and not part of the exchange already => Show Dropper for them to claim their spot, then redirect to Exchange page
// ✅ 3. User is logged in and already joined => Redirect to exchange page
// ❌ 4. All participant slots are taken => Show message that exchange is full and to contact the organizer
// ✅ 5. User is logged in and is the organizer => Redirect to exchange page

const JoinExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true)
  const [joinExchangeLoading, setJoinExchangeLoading] = useState<boolean>(false)
  const [selectedParticipant, setSelectedParticipant] = useState<string>('')
  const history = useHistory()
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const fetchExchange = async () => {
      try {
        setExchangeLoading(true)
        const fetchedExchange = await Api.exchanges.getJoinExchangeInformation(id)
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
  const organizerName = exchange?.participants?.find(
    (p) => p.user?.uid === exchange?.organizer.uid,
  )?.name
  const userIsAlreadyJoined =
    user &&
    (exchange?.participants.some((p) => p.user && p.user.uid === user.uid) ||
      exchange?.organizer.uid === user.uid)

  const handleSelectParticipant = (event: SelectChangeEvent) => {
    setSelectedParticipant(event.target.value as string)
  }

  const getExchangeInformationPiece = (title: ReactNode, content: ReactNode) => (
    <>
      <Title type="sub">{title}</Title>
      <Typography
        variant="body1"
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {content}
      </Typography>
    </>
  )

  const handleJoinExchange = async () => {
    try {
      setJoinExchangeLoading(true)
      const updatedExchange = await Api.exchanges.postJoinExchange(id, selectedParticipant)
      // const fetchedExchange = await Api.exchanges.get(id)
      console.log('updatedExchange', updatedExchange)
      setExchange(updatedExchange)
    } catch (e) {
      // TODO: Handle error
      console.log('Error joining exchange', e)
      // history.push(routes.exchanges.path)
    } finally {
      setJoinExchangeLoading(false)
    }
  }

  const getExchangeContent = (currentExchange: Exchange) => (
    <Box mt={4}>
      {getExchangeInformationPiece('Exchange Name', currentExchange.name)}
      {currentExchange.description &&
        getExchangeInformationPiece('Description', currentExchange.description)}
      {currentExchange.date &&
        getExchangeInformationPiece('Date of Exchange', [
          <CalendarToday key="calendar-icon" sx={{ marginRight: 1 }} />,
          format(new Date(currentExchange.date), 'PPP'),
        ])}
      {currentExchange.budget &&
        getExchangeInformationPiece('Gift Budget', `$${currentExchange.budget}`)}
    </Box>
  )

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
          <>
            <Card raised sx={{ maxWidth: 500 }}>
              <CardContent>
                <Title mb={3}>
                  {organizerName} invited you to join {exchange.name}!
                </Title>
                <Typography gutterBottom>{exchange.description}</Typography>
                {user ? (
                  <>
                    <Typography gutterBottom>
                      To join this exchange, <AppTypography bold>select your name</AppTypography>{' '}
                      below and hit <AppTypography bold>join</AppTypography>.
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        maxWidth: 300,
                        marginTop: 2,
                        marginBottom: 2,
                      }}
                    >
                      <FormControl variant="filled" sx={{ minWidth: 200 }}>
                        <InputLabel id="select-participant-label">Select Your Name</InputLabel>
                        <Select
                          labelId="select-participant-label"
                          value={selectedParticipant}
                          label="Select your name..."
                          onChange={handleSelectParticipant}
                        >
                          {exchange.participants
                            .filter((p) => !p.user)
                            .map((p) => (
                              <MenuItem key={p.name} value={p.name}>
                                {p.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                      <LoadingButton
                        loading={joinExchangeLoading}
                        disabled={joinExchangeLoading || !selectedParticipant}
                        variant="contained"
                        onClick={handleJoinExchange}
                      >
                        Join
                      </LoadingButton>
                    </Box>

                    <Typography>
                      Don't see your name in the list? Check with the organizer,{' '}
                      <AppTypography bold>{organizerName}</AppTypography>, so they can add you.
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography gutterBottom>
                      To join this exchange, <AppTypography bold>log in</AppTypography> or{' '}
                      <AppTypography bold>sign up</AppTypography> with a free account.
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        maxWidth: 200,
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        marginTop: 3,
                      }}
                    >
                      <Button variant="contained" component={RouterLink} to={urls.login}>
                        Login
                      </Button>
                      <Button variant="contained" component={RouterLink} to={urls.register}>
                        Sign Up
                      </Button>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
            {getExchangeContent(exchange)}
          </>
        )}
      </Loader>
    </>
  )
}

export default JoinExchange
