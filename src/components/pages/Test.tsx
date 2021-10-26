/* eslint-disable no-console */
import { Box, Button, TextField, Typography } from '@mui/material'

import { useAuth } from 'context/Auth'
import { useState } from 'react'

const Test = () => {
  const { user, api } = useAuth()
  const [wishlistName, setWishlistName] = useState('')

  const handleSubmitWishlist = async () => {
    const result = await api.post('/wishlist', { name: wishlistName })
    console.log(result.data)
  }

  const handleFetchWishlists = async () => {
    const result = await api.get('/wishlist')
    console.log(result.data)
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
