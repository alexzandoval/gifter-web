import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import useApi from 'hooks/useApi'
import { Wishlist } from 'ts/api'

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const { getWishlists } = useApi()

  useEffect(() => {
    getWishlists().then(setWishlists)
  }, [getWishlists])

  return (
    <>
      <Typography variant="h1">My Wishlists</Typography>
      <List>
        {wishlists.map((wishlist) => (
          <ListItem>
            <ListItemText>{wishlist.name}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default Wishlists
