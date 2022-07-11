import { ReactNode, useEffect, useState } from 'react'
import { CalendarToday } from '@mui/icons-material'
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import { format } from 'date-fns'
import { useHistory, useParams } from 'react-router-dom'

import { ROUTES } from 'appConstants'
import { Centered, Loader, Title } from 'components/common'
import UserNotPartOfExchange from 'components/exchanges/join/UserNotPartOfExchange'
import UserNotSignedIn from 'components/exchanges/join/UserNotSignedIn'
import AllSpotsTakenInExchange from 'components/exchanges/join/AllSpotsTakenInExchange'
import { useAuth } from 'context/Auth'
import Api from 'services/Api'
import { Exchange } from 'ts/types'

type ExchangeParams = {
  id: string
}

const JoinExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true)
  const history = useHistory()
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

  const organizerName = exchange?.participants?.find(
    (p) => p.user?.uid === exchange?.organizer.uid,
  )?.name

  const userIsAlreadyJoined =
    user &&
    (exchange?.participants.some((p) => p.user && p.user.uid === user.uid) ||
      exchange?.organizer.uid === user.uid)

  const unclaimedParticipants = exchange?.participants?.filter((p) => !p.user)

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

  const getExchangeInformation = (currentExchange: Exchange) => (
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
    history.push(ROUTES.singleExchange.id(id))
    return null
  }

  let cardContent = <UserNotSignedIn />

  if (user && exchange) {
    if (unclaimedParticipants && unclaimedParticipants.length > 0) {
      cardContent = (
        <UserNotPartOfExchange
          exchange={exchange}
          unclaimedParticipants={unclaimedParticipants}
          onSubmit={setExchange}
        />
      )
    } else {
      cardContent = <AllSpotsTakenInExchange organizerName={organizerName} />
    }
  }

  return (
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
                {organizerName || 'You were'} invited you to join {exchange.name}!
              </Title>
              <Typography gutterBottom>{exchange.description}</Typography>
              {cardContent}
            </CardContent>
          </Card>
          {getExchangeInformation(exchange)}
        </>
      )}
    </Loader>
  )
}

export default JoinExchange
