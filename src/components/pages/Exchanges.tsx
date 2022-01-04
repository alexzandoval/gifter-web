import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Api from 'services/Api'
import { Exchange } from 'ts/api'
import routes from 'constants/routes'
import { Add } from '@mui/icons-material'
import NewExchangeDialog from 'components/exchanges/NewExchangeDialog'

const Exchanges = () => {
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [newExchangeDialogOpen, setNewExchangeDialogOpen] = useState<boolean>(true)

  useEffect(() => {
    Api.exchanges.getAll().then(setExchanges)
  }, [])

  const handleOpenNewExchangeDialog = () => {
    setNewExchangeDialogOpen(true)
  }

  const handleCloseNewExchangeDialog = () => {
    setNewExchangeDialogOpen(false)
  }

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
        <IconButton size="large" onClick={handleOpenNewExchangeDialog}>
          <Add />
        </IconButton>
      </Box>
      <Button startIcon={<Add />} color="inherit" onClick={handleOpenNewExchangeDialog}>
        Create new exchange
      </Button>
      <NewExchangeDialog open={newExchangeDialogOpen} onClose={handleCloseNewExchangeDialog} />
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
