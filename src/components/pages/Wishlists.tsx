import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

import useApi from 'hooks/useApi'
import { Wishlist } from 'ts/api'

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const { getWishlists } = useApi()
  const history = useHistory()

  useEffect(() => {
    getWishlists().then(setWishlists)
  }, [getWishlists])

  return (
    <>
      <Typography variant="h1">My Wishlists</Typography>
      <List>
        {wishlists.map((wishlist) => (
          <ListItem key={wishlist.id} onClick={() => history.push(`/wishlists/${wishlist.id}`)}>
            <ListItemText>{wishlist.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Wishlists
