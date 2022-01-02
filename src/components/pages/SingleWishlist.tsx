import { FormEvent, useEffect, useState } from 'react'
import {
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useHistory, useParams } from 'react-router-dom'

import Api from 'services/Api'
import { WishlistWithItems } from 'ts/api'
import Loader from 'components/shared/Loader'
import AddTextButton from 'components/shared/AddTextButton'
import routes from 'constants/routes'
import Centered from 'components/shared/Centered'
import { Delete, Edit } from '@mui/icons-material'

type WishlistParams = {
  id: string
}

const SingleWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistWithItems | null>(null)
  const [wishlistLoading, setWishlistLoading] = useState<boolean>(true)
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
        history.push(routes.wishlists.path)
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
        const updatedWishlist = await Api.wishlists.rename(wishlist.id, value)
        setWishlist(updatedWishlist)
      } catch (error) {
        console.log('Error updating wishlist name', error)
      }
    }
  }

  const handleDeleteWishlist = async () => {
    if (wishlist) {
      try {
        const result = await Api.wishlists.delete(wishlist.id)
        history.push(routes.wishlists.path)
      } catch (error) {
        console.log('Error deleting wishlist', error)
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
        <IconButton onClick={handleUpdateWishlistName}>
          <Edit />
        </IconButton>
        <IconButton onClick={handleDeleteWishlist}>
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
