import { FormEvent, useEffect, useState } from 'react'
import {
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

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [inAddMode, setInAddMode] = useState<boolean>(false)
  const [newWishlistName, setNewWishlistName] = useState<string>('')
  const [newWishlistError, setNewWishlistError] = useState<string>('')
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
    const newWishlist = await postWishlist({ name: newWishlistName })
    handleLeaveAddMode()
    setWishlists((prev) => [...prev, newWishlist])
  }

  useEffect(() => {
    getWishlists().then(setWishlists)
  }, [getWishlists])

  return (
    <>
      <Typography variant="h1">My Wishlists</Typography>
      <List>
        {wishlists.map((wishlist) => (
          <ListItem key={wishlist.id}>
            <ListItemButton component={RouterLink} to={`/wishlists/${wishlist.id}`}>
              <ListItemText>{wishlist.name}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem>
          {inAddMode ? (
            <form onSubmit={handleAddNewWishlist}>
              <TextField
                variant="standard"
                size="small"
                label="New Wishlist Name"
                sx={{ marginLeft: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={handleLeaveAddMode}>
                        <Close fontSize="inherit" />
                      </IconButton>
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
