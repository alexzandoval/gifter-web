import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import Api from 'services/Api'
import { Exchange } from 'ts/api'

type ExchangeParams = {
  id: string
}

const SingleExchange = () => {
  const [exchange, setExchange] = useState<Exchange | null>(null)
  const { id } = useParams<ExchangeParams>()

  useEffect(() => {
    Api.exchanges.get(id).then(setExchange)
  }, [id])

  return (
    <>
      <Typography variant="h1">{exchange?.name}</Typography>
      <List>
        {exchange?.participants?.map((participant) => (
          <ListItem key={participant.uid}>
            <ListItemText>{participant.email}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SingleExchange
