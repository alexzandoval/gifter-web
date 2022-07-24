import { FormEvent, useEffect, useState } from 'react'
import { Delete, Edit } from '@mui/icons-material'
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useHistory, useParams } from 'react-router-dom'

import { ROUTES } from '@Constants'
import { AddTextButton, Centered, Loader } from '@Components/common'
import useNotification from '@Hooks/useNotification'
import { WishlistService } from '@Services'
import { WishlistWithItems } from '@Types'

type WishlistParams = {
  id: string
}

const SingleWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistWithItems | null>(null)
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(true)
  const [wishlistIsUpdating, setWishlistIsUpdating] = useState<boolean>(false)
  const [inAddMode, setInAddMode] = useState<boolean>(false)
  const [newItemName, setNewItemName] = useState<string>('')
  const [newItemError, setNewItemError] = useState<string>('')
  const [newItemIsLoading, setNewItemIsLoading] = useState<boolean>(false)
  const { id } = useParams<WishlistParams>()
  const history = useHistory()
  const notify = useNotification()

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setWishlistLoading(true)
        const fetchedWishlist = await WishlistService.get(id)
        setWishlist(fetchedWishlist)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error fetching wishlist ::', e)
        notify.error('Error occurred while fetching wishlist, please try again later.', {
          redirect: ROUTES.wishlists.path,
        })
      } finally {
        setWishlistLoading(false)
      }
    }

    fetchWishlist()
  }, [id, history, notify])

  const handleUpdateNewItemName = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.currentTarget
    setNewItemName(value)
    if (newItemError && value.length > 0) {
      setNewItemError('')
    }
  }

  const handleEnterAddMode = () => {
    setInAddMode(true)
  }

  const handleLeaveAddMode = () => {
    setInAddMode(false)
    setNewItemName('')
    setNewItemError('')
  }

  const handleAddNewItem = async (e: FormEvent) => {
    e.preventDefault()
    if (newItemName.length === 0) {
      setNewItemError('Item cannot be empty')
      return
    }
    try {
      if (wishlist) {
        setNewItemIsLoading(true)
        const newItem = await WishlistService.addItem(wishlist.id, newItemName)
        setWishlist((prevWishlist) =>
          prevWishlist ? { ...prevWishlist, items: [...prevWishlist.items, newItem] } : null,
        )
        setNewItemName('')
        setNewItemError('')
      }
    } finally {
      setNewItemIsLoading(false)
    }
  }

  // const handleUpdateWishlistName = async (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const handleUpdateWishlistName = async () => {
    // const { value } = e.currentTarget
    const value = `test${Math.floor(Math.random() * 100)}`
    if (wishlist) {
      try {
        setWishlistIsUpdating(true)
        const updatedWishlist = await WishlistService.rename(wishlist.id, value)
        setWishlist(updatedWishlist)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating wishlist name ::', error)
        notify.error('Error occurred while updating wishlist name, please try again later.')
      } finally {
        setWishlistIsUpdating(false)
      }
    }
  }

  const handleDeleteWishlist = async () => {
    if (wishlist) {
      try {
        setWishlistIsUpdating(true)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const deleteWasSuccessful = await WishlistService.delete(wishlist.id)
        history.push(ROUTES.wishlists.path)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Error deleting wishlist ::', e)
        notify.error('Error occurred while deleting wishlist, please try again later.')
      } finally {
        setWishlistIsUpdating(false)
      }
    }
  }

  return (
    <>
      <Typography variant="h1">{wishlist?.name}</Typography>
      <Loader
        loading={wishlistLoading}
        loader={
          <Centered horizontal vertical>
            <CircularProgress />
          </Centered>
        }
      >
        <IconButton onClick={handleUpdateWishlistName} disabled={wishlistIsUpdating}>
          <Edit />
        </IconButton>
        <IconButton onClick={handleDeleteWishlist} disabled={wishlistIsUpdating}>
          <Delete />
        </IconButton>
        <List>
          {wishlist?.items.map((item) => (
            <ListItem key={item.id}>
              <ListItemText>{item.content}</ListItemText>
            </ListItem>
          ))}
        </List>
        <AddTextButton
          inAddMode={inAddMode}
          loading={newItemIsLoading}
          onEnterAddMode={handleEnterAddMode}
          onLeaveAddMode={handleLeaveAddMode}
          onSubmit={handleAddNewItem}
          label="New Item Name"
          error={!!newItemError}
          helperText={newItemError}
          value={newItemName}
          onChange={handleUpdateNewItemName}
        >
          Add new item to Wishlist
        </AddTextButton>
      </Loader>
    </>
  )
}

export default SingleWishlist
