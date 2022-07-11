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

import { ROUTES } from 'appConstants'
import { AddTextButton, Centered, Loader } from 'components/common'
import Api from 'services/Api'
import { WishlistWithItems } from 'ts/types'

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

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setWishlistLoading(true)
        const fetchedWishlist = await Api.wishlists.get(id)
        setWishlist(fetchedWishlist)
      } catch (e) {
        // TODO: Handle error
        // console.log('Error fetching wishlist', e)
        history.push(ROUTES.wishlists.path)
      } finally {
        setWishlistLoading(false)
      }
    }

    fetchWishlist()
  }, [id, history])

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
        const newItem = await Api.wishlists.addItem(wishlist.id, newItemName)
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
        const updatedWishlist = await Api.wishlists.rename(wishlist.id, value)
        setWishlist(updatedWishlist)
      } catch (error) {
        console.log('Error updating wishlist name', error)
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
        const deleteWasSuccessful = await Api.wishlists.delete(wishlist.id)
        history.push(ROUTES.wishlists.path)
      } catch (error) {
        console.log('Error deleting wishlist', error)
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
