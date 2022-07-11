import { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import {
  Box,
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { ROUTES } from 'appConstants'
import { useAuth } from 'context/Auth'
import Api from 'services/Api'
import { Exchange } from 'ts/types'
import { format } from 'date-fns'

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const { user } = useAuth()

  useEffect(() => {
    Api.exchanges.getAll().then(setExchanges)
  }, [])

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
              {exchange.budget && <Typography component="span">{`$${exchange.budget}`}</Typography>}
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
    </>
  )
}

export default Exchanges
