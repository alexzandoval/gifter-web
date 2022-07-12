import { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { format } from 'date-fns'
import { Link as RouterLink } from 'react-router-dom'

import { ROUTES } from 'appConstants'
import { Centered, Loader } from 'components/common'
import { useAuth } from 'context/Auth'
import useNotification from 'hooks/useNotification'
import Api from 'services/Api'
import { Exchange } from 'ts/types'

const Exchanges = () => {
  const [exchangesLoading, setExchangesLoading] = useState<boolean>(true)
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const { user } = useAuth()
  const notify = useNotification()

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        setExchangesLoading(true)
        const fetchedExchanges = await Api.exchanges.getAll()
        setExchanges(fetchedExchanges)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching exchanges list ::', e)
        notify.error('Error occurred while getting your exchanges, please try again later.', {
          redirect: ROUTES.home.path,
        })
      } finally {
        setExchangesLoading(false)
      }
    }

    fetchExchanges()
  }, [notify])

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h1">My Exchanges</Typography>
      </Box>
      <Loader
        loading={exchangesLoading}
        loader={
          <Centered horizontal vertical>
            <CircularProgress />
          </Centered>
        }
      >
        <Button
          startIcon={<Add />}
          color="inherit"
          component={RouterLink}
          to={ROUTES.createExchange.path}
        >
          Create new exchange
        </Button>
        <List>
          {exchanges.map((exchange) => {
            const secondaryText = (
              <Box component="span" display="flex" flexDirection="column" alignItems="flex-start">
                {exchange.organizer?.uid === user?.uid && (
                  <Chip size="small" component="span" label="Organizer" />
                )}
                {exchange.date && (
                  <Typography component="span">{format(new Date(exchange.date), 'PPP')}</Typography>
                )}
                {exchange.budget && (
                  <Typography component="span">{`$${exchange.budget}`}</Typography>
                )}
              </Box>
            )
            return (
              <ListItem key={exchange.id}>
                <ListItemButton component={RouterLink} to={ROUTES.singleExchange.id(exchange.id)}>
                  <ListItemText
                    primary={exchange.name}
                    primaryTypographyProps={{ variant: 'h6' }}
                    secondary={secondaryText}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Loader>
    </>
  )
}

export default Exchanges
