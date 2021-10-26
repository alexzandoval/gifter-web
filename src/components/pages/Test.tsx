/* eslint-disable no-console */
import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

import { useAuth } from 'context/Auth'
import useApi from 'hooks/useApi'

const Test = () => {
  const { user } = useAuth()
  const { getWishlists, postWishlist } = useApi()
  const [wishlistName, setWishlistName] = useState('')

  const handleSubmitWishlist = async () => {
    const newWishlist = await postWishlist({ name: wishlistName })
    console.log(newWishlist)
  }

  const handleFetchWishlists = async () => {
    const wishlists = await getWishlists()
    console.log(wishlists)
  }

  return (
    <>
      <Typography variant="h1">TEST</Typography>
      <TextField
        label="Wishlist Name"
        value={wishlistName}
        onChange={(e) => setWishlistName(e.target.value)}
      />
      <Button onClick={handleSubmitWishlist}>Submit</Button>
      <Button onClick={handleFetchWishlists}>Get Wishlists</Button>
      <Box sx={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }} component="pre">
        {JSON.stringify(user, null, 2)}
      </Box>
    </>
  )
}

export default Test
