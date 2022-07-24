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

import { ROUTES } from '@Constants'
import { AddTextButton, Loader } from '@Components/common'
import useNotification from '@Hooks/useNotification'
import { WishlistService } from '@Services'
import { Wishlist } from '@Types'

const Wishlists = () => {
  const [wishlists, setWishlists] = useState<Wishlist[]>([])
  const [inAddMode, setInAddMode] = useState<boolean>(false)
  const [newWishlistName, setNewWishlistName] = useState<string>('')
  const [newWishlistError, setNewWishlistError] = useState<string>('')
  const [wishlistsLoading, setWishlistsLoading] = useState<boolean>(false)
  const [newWishlistIsLoading, setNewWishlistIsLoading] = useState<boolean>(false)
  const notify = useNotification()

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
      const newWishlist = await WishlistService.create({ name: newWishlistName })
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
        const fetchedWishlists = await WishlistService.getAll()
        setWishlists(fetchedWishlists)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching wishlists list ::', e)
        notify.error('Error occurred while getting your wishlists, please try again later.', {
          redirect: ROUTES.home.path,
        })
      } finally {
        setWishlistsLoading(false)
      }
    }

    fetchWishlists()
  }, [notify])

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
              <ListItemButton component={RouterLink} to={ROUTES.singleWishlist.id(wishlist.id)}>
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
