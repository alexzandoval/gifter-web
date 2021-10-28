import { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

import useApi from 'hooks/useApi'
import { WishlistWithItems } from 'ts/api'

type WishlistParams = {
  id: string
}

const SingleWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistWithItems | null>(null)
  const { getSingleWishlist } = useApi()
  const { id } = useParams<WishlistParams>()

  useEffect(() => {
    getSingleWishlist(id).then(setWishlist)
  }, [getSingleWishlist, id])

  return (
    <>
      <Typography variant="h1">{wishlist?.name}</Typography>
      <List>
        {wishlist?.items.map((item) => (
          <ListItem key={item.id}>
            <ListItemText>{item.content}</ListItemText>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export default SingleWishlist
