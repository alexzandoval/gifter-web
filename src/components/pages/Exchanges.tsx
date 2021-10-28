import { useEffect, useState } from 'react'
import { List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import useApi from 'hooks/useApi'
import { Exchange } from 'ts/api'

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const { getExchanges } = useApi()

  useEffect(() => {
    getExchanges().then(setExchanges)
  }, [getExchanges])

  return (
    <>
      <Typography variant="h1">My Exchanges</Typography>
      <List>
        {exchanges.map((exchange) => (
          <ListItem key={exchange.id}>
            <ListItemButton component={RouterLink} to={`/exchanges/${exchange.id}`}>
              <ListItemText>{exchange.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Exchanges
