/* eslint-disable no-console */
import { useState } from 'react'
import { Box, Button, TextField, Typography } from '@mui/material'

import { useAuth } from 'context/Auth'
import Api from 'services/Api'

const Test = () => {
  const { user } = useAuth()
  const [wishlistName, setWishlistName] = useState('')

  const handleSubmitWishlist = async () => {
    const newWishlist = await Api.wishlists.create({ name: wishlistName })
    console.log(newWishlist)
  }

  const handleFetchWishlists = async () => {
    const wishlists = await Api.wishlists.getAll()
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
