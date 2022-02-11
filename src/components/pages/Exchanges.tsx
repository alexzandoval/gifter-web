import { useEffect, useState } from 'react'
import { Add } from '@mui/icons-material'
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import routes from 'constants/routes'
import { useAuth } from 'context/Auth'
import Api from 'services/Api'
import { Exchange } from 'ts/api'

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
        to={routes.createExchange.path}
      >
        Create new exchange
      </Button>
      <List>
        {exchanges.map((exchange) => (
          <ListItem key={exchange.id}>
            <ListItemButton component={RouterLink} to={routes.singleExchange.id(exchange.id)}>
              <ListItemText
                primary={exchange.name}
                secondary={exchange.organizerId === user?.uid && 'Organizer'}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Exchanges
