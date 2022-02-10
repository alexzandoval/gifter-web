import { useEffect, useState } from 'react'
import { Delete } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useHistory, useParams } from 'react-router-dom'

import Centered from 'components/shared/Centered'
import Loader from 'components/shared/Loader'
import routes from 'constants/routes'
import Api from 'services/Api'
import { Exchange } from 'ts/api'

type ExchangeParams = {
  id: string
}

const SingleExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true)
  const [exchangeDeleting, setExchangeDeleting] = useState<boolean>(false)
  const history = useHistory()

  useEffect(() => {
    const fetchExchange = async () => {
      try {
        setExchangeLoading(true)
        const fetchedWishlist = await Api.exchanges.get(id)
        setExchange(fetchedWishlist)
      } catch (e) {
        // TODO: Handle error
        // console.log('Error fetching exchange', e)
        history.push(routes.exchanges.path)
      } finally {
        setExchangeLoading(false)
      }
    }

    fetchExchange()
  }, [id, history])

  const handleDeleteExchange = async () => {
    if (exchange) {
      try {
        setExchangeDeleting(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const deleteWasSuccessful = await Api.exchanges.delete(exchange.id)
        history.push(routes.exchanges.path)
      } catch (error) {
        console.log('Error deleting exchange', error)
      } finally {
        setExchangeDeleting(false)
      }
    }
  }

  return (
    <>
      <Typography variant="h1">{exchange?.name}</Typography>
      <Loader
        loading={exchangeLoading}
        loader={
          <Centered horizontal vertical>
            <CircularProgress />
          </Centered>
        }
      >
        <IconButton onClick={handleDeleteExchange} disabled={exchangeDeleting}>
          <Delete />
        </IconButton>
        <List>
          {exchange?.participants.map((participant) => (
            <ListItem key={participant.id}>
              <ListItemText>{participant.name}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Loader>
    </>
  )
}

export default SingleExchange
