import { useEffect, useState } from 'react'
import { Button, CircularProgress, List, ListItem, ListItemText, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useHistory, useParams } from 'react-router-dom'

import { ROUTES } from 'appConstants'
import { Centered, Loader } from 'components/common'
import { useAuth } from 'context/Auth'
import Api from 'services/Api'
import { Exchange } from 'ts/types'
import useNotification from 'hooks/useNotification'
import ExchangeInformationSummary from 'components/exchanges/utility/ExchangeInformationSummary'

type ExchangeParams = {
  id: string
}

const SingleExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true)
  const [exchangeUpdating, setExchangeUpdating] = useState<boolean>(false)
  const history = useHistory()
  const { user } = useAuth()
  const notify = useNotification()
  const isOrganizer = user?.uid === exchange?.organizer?.uid

  useEffect(() => {
    const fetchExchange = async () => {
      try {
        setExchangeLoading(true)
        const fetchedExchange = await Api.exchanges.get(id)
        setExchange(fetchedExchange)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching exchange ::', e)
        notify.error('Error occurred while getting exchange information, please try again later.', {
          redirect: ROUTES.exchanges.path,
        })
      } finally {
        setExchangeLoading(false)
      }
    }

    fetchExchange()
  }, [id, history, notify])

  const handleDeleteExchange = async () => {
    if (exchange) {
      try {
        setExchangeUpdating(true)
        const deleteWasSuccessful = await Api.exchanges.delete(exchange.id)
        if (deleteWasSuccessful) {
          notify.success('Exchange was successfully deleted.', { redirect: ROUTES.exchanges.path })
        } else {
          notify.error('Delete was not successful. Please try again later.')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error deleting exchange ::', error)
        notify.error('Error occurred while deleting exchange, please try again later.')
      } finally {
        setExchangeUpdating(false)
      }
    }
  }

  // TODO Implement
  const handleEditExchange = async () => {
    notify.error('Not implemented')
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
      {exchange && <ExchangeInformationSummary exchange={exchange} onUpdate={setExchange} />}
      <Typography variant="h5" sx={{ marginTop: 4 }}>
        Participants in this exchange
      </Typography>
      <List>
        {exchange?.participants.map((participant) => {
          const userRoles = []
          const isYou = user?.uid === participant.user?.uid
          if (isYou) userRoles.push('You')
          const participantIsOrganizer = participant.user?.uid === exchange?.organizer?.uid
          if (participantIsOrganizer) userRoles.push('Organizer')

          return (
            <ListItem key={participant.id}>
              <ListItemText>
                {participant.name}
                {userRoles.length > 0 && ` (${userRoles.join(', ')})`}
              </ListItemText>
            </ListItem>
          )
        })}
      </List>
      {isOrganizer && (
        <Box sx={{ display: 'flex', justifyContent: 'space-around', maxWidth: 300 }}>
          <Button onClick={handleEditExchange} variant="contained" disabled={exchangeUpdating}>
            Edit
          </Button>
          <Button
            onClick={handleDeleteExchange}
            variant="contained"
            color="error"
            disabled={exchangeUpdating}
          >
            Delete
          </Button>
        </Box>
      )}
    </Loader>
  )
}

export default SingleExchange
