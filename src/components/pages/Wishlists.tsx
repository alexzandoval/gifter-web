import { FormEvent, useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import useApi from 'hooks/useApi'
import { Wishlist } from 'ts/api'
import { Add, Close } from '@mui/icons-material'
import Loader from 'components/shared/Loader'

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [inAddMode, setInAddMode] = useState<boolean>(false)
  const [newWishlistName, setNewWishlistName] = useState<string>('')
  const [newWishlistError, setNewWishlistError] = useState<string>('')
  const [wishlistsLoading, setWishlistsLoading] = useState<boolean>(false)
  const [newWishlistIsLoading, setNewWishlistIsLoading] = useState<boolean>(false)
  const { getWishlists, postWishlist } = useApi()

  const handleUpdateNewWishlistName = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.currentTarget
    setNewWishlistName(value)
    if (newWishlistError && value.length > 0) {
      setNewWishlistError('')
    }
  }

  const handleEnterAddMode = () => {
    setInAddMode(true)
  }

  const handleLeaveAddMode = () => {
    setInAddMode(false)
    setNewWishlistName('')
    setNewWishlistError('')
  }

  const handleAddNewWishlist = async (e: FormEvent) => {
    e.preventDefault()
    if (newWishlistName.length === 0) {
      setNewWishlistError('Wishlist name cannot be empty')
      return
    }
    try {
      setNewWishlistIsLoading(true)
      const newWishlist = await postWishlist({ name: newWishlistName })
      setWishlists((prev) => [...prev, newWishlist])
    } finally {
      handleLeaveAddMode()
      setNewWishlistIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        setWishlistsLoading(true)
        const fetchedWishlists = await getWishlists()
        setWishlists(fetchedWishlists)
      } finally {
        setWishlistsLoading(false)
      }
    }

    fetchWishlists()
  }, [getWishlists])

  return (
    <>
      <Typography variant="h1">My Wishlists</Typography>
      <List sx={{ marginTop: 4 }}>
        <Loader
          loading={wishlistsLoading}
          loader={
            <Box sx={{ marginLeft: 8 }}>
              <CircularProgress />
            </Box>
          }
        >
          {wishlists.map((wishlist) => (
            <ListItem key={wishlist.id}>
              <ListItemButton component={RouterLink} to={`/wishlists/${wishlist.id}`}>
                <ListItemText>{wishlist.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </Loader>
        <ListItem>
          {inAddMode ? (
            <form onSubmit={handleAddNewWishlist}>
              <TextField
                variant="standard"
                size="small"
                label="New Wishlist Name"
                disabled={newWishlistIsLoading || wishlistsLoading}
                sx={{ marginLeft: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Loader loading={newWishlistIsLoading}>
                        <IconButton size="small" onClick={handleLeaveAddMode}>
                          <Close fontSize="inherit" />
                        </IconButton>
                      </Loader>
                    </InputAdornment>
                  ),
                }}
                autoFocus
                error={!!newWishlistError}
                helperText={newWishlistError}
                value={newWishlistName}
                onChange={handleUpdateNewWishlistName}
              />
            </form>
          ) : (
            <ListItemButton onClick={handleEnterAddMode}>
              <Add /> New Wishlist
            </ListItemButton>
          )}
        </ListItem>
      </List>
    </>
  )
}

export default Wishlists
