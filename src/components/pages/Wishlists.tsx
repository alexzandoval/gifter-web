import { FormEvent, useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import Api from 'services/Api'
import { Wishlist } from 'ts/api'
import Loader from 'components/shared/Loader'
import AddTextButton from 'components/shared/AddTextButton'
import routes from 'constants/routes'

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [inAddMode, setInAddMode] = useState<boolean>(false)
  const [newWishlistName, setNewWishlistName] = useState<string>('')
  const [newWishlistError, setNewWishlistError] = useState<string>('')
  const [wishlistsLoading, setWishlistsLoading] = useState<boolean>(false)
  const [newWishlistIsLoading, setNewWishlistIsLoading] = useState<boolean>(false)

  const handleUpdateNewWishlistName = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget
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
      const newWishlist = await Api.wishlists.create({ name: newWishlistName })
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
        const fetchedWishlists = await Api.wishlists.getAll()
        setWishlists(fetchedWishlists)
      } finally {
        setWishlistsLoading(false)
      }
    }

    fetchWishlists()
  }, [])

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
              <ListItemButton component={RouterLink} to={routes.singleWishlist.id(wishlist.id)}>
                <ListItemText>{wishlist.name}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
        </Loader>
        <ListItem>
          <AddTextButton
            inAddMode={inAddMode}
            loading={newWishlistIsLoading}
            onEnterAddMode={handleEnterAddMode}
            onLeaveAddMode={handleLeaveAddMode}
            onSubmit={handleAddNewWishlist}
            label="New Wishlist Name"
            disabled={newWishlistIsLoading || wishlistsLoading}
            error={!!newWishlistError}
            helperText={newWishlistError}
            value={newWishlistName}
            onChange={handleUpdateNewWishlistName}
          >
            New Wishlist
          </AddTextButton>
        </ListItem>
      </List>
    </>
  )
}

export default Wishlists
