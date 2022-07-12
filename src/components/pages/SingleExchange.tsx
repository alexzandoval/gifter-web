import { useEffect, useState } from 'react'
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Theme,
  Typography,
} from '@mui/material'
import { makeStyles } from '@mui/styles'
import { Box } from '@mui/system'
import { format } from 'date-fns'
import { useHistory, useParams } from 'react-router-dom'

import { ROUTES } from 'appConstants'
import { Centered, Loader } from 'components/common'
import { useAuth } from 'context/Auth'
import Api from 'services/Api'
import { Exchange } from 'ts/types'
import useNotification from 'hooks/useNotification'

type ExchangeParams = {
  id: string
}

const useStyles = makeStyles((theme: Theme) => ({
  subheader: {
    color: theme.palette.text.secondary,
  },
  bold: {
    fontWeight: 'bold',
  },
  propertyHeader: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  informationSection: {
    marginBottom: theme.spacing(2),
  },
}))

const SingleExchange = () => {
  const classes = useStyles()
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const deleteWasSuccessful = await Api.exchanges.delete(exchange.id)
        if (deleteWasSuccessful) {
          history.push(ROUTES.exchanges.path)
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
    throw new Error('Not implemented')
  }

  let description = null
  let date = null
  let budget = null
  let numberOfDraws = null

  if (exchange) {
    if (exchange.date) {
      date = (
        <Typography className={classes.subheader}>
          Exchange happening on{' '}
          <span className={classes.bold}>{format(new Date(exchange.date), 'MMMM d, yyyy')}</span>
        </Typography>
      )
    }
    if (exchange.description) {
      description = (
        <Box className={classes.informationSection}>
          <Typography className={classes.propertyHeader}>Description</Typography>
          <Typography>{exchange.description}</Typography>
        </Box>
      )
    }
    if (exchange.budget) {
      budget = (
        <Box className={classes.informationSection}>
          <Typography className={classes.propertyHeader}>Gift Budget</Typography>
          <Typography>${exchange.budget}</Typography>
        </Box>
      )
    }
    if (exchange.numberOfDraws) {
      numberOfDraws = (
        <Box className={classes.informationSection}>
          <Typography className={classes.propertyHeader}>Number of Draws</Typography>
          <Typography className={classes.subheader}>
            This is the number of people you will need to buy a gift for
          </Typography>
          <Typography>{exchange.numberOfDraws}</Typography>
        </Box>
      )
    }
  }

  return (
    <>
      <Typography variant="h3">{exchange?.name}</Typography>
      {date}
      <Loader
        loading={exchangeLoading}
        loader={
          <Centered horizontal vertical>
            <CircularProgress />
          </Centered>
        }
      >
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Gift Exchange Information
        </Typography>
        {description}
        {budget}
        {numberOfDraws}
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
    </>
  )
}

export default SingleExchange
