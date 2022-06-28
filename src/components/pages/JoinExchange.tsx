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
import { useAuth } from 'context/Auth'

type ExchangeParams = {
  id: string
}

const JoinExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()
  const [exchangeLoading, setExchangeLoading] = useState<boolean>(true)
  const [exchangeDeleting, setExchangeDeleting] = useState<boolean>(false)
  const history = useHistory()
  const { user } = useAuth()

  console.log(exchange)

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

export default JoinExchange
