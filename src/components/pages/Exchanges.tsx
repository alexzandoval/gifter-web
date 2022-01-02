import { useEffect, useState } from 'react'
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Api from 'services/Api'
import { Exchange } from 'ts/api'
import routes from 'constants/routes'

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([])

  useEffect(() => {
    Api.exchanges.getAll().then(setExchanges)
  }, [])

  return (
    <>
      <Typography variant="h1">My Exchanges</Typography>
      <List>
        {exchanges.map((exchange) => (
          <ListItem key={exchange.id}>
            <ListItemButton component={RouterLink} to={routes.singleExchange.id(exchange.id)}>
              <ListItemText>{exchange.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Exchanges
