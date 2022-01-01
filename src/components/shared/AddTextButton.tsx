import { FC, FormEvent, ReactNode } from 'react'
import { Add, Close } from '@mui/icons-material'
import {
  IconButton,
  InputAdornment,
  ListItemButton,
  StandardTextFieldProps,
  TextField,
} from '@mui/material'

import Loader from './Loader'

interface Props extends StandardTextFieldProps {
  children: ReactNode
  inAddMode: boolean
  loading: boolean
  onEnterAddMode: () => void
  onLeaveAddMode: () => void
  onSubmit: (e: FormEvent) => Promise<any>
}

const AddTextButton: FC<Props> = ({
  children,
  inAddMode,
  loading,
  onEnterAddMode,
  onLeaveAddMode,
  onSubmit,
  ...other
}) => {
  const onBlur = () => {
    if (!other.value) onLeaveAddMode()
  }

  if (inAddMode) {
    return (
      <form onSubmit={onSubmit}>
        <TextField
          variant="standard"
          size="small"
          sx={{ marginLeft: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Loader loading={loading}>
                  <IconButton size="small" onClick={onLeaveAddMode}>
                    <Close fontSize="inherit" />
                  </IconButton>
                </Loader>
              </InputAdornment>
            ),
          }}
          autoFocus
          onBlur={onBlur}
          {...other}
        />
      </form>
    )
  }

  return (
    <ListItemButton onClick={onEnterAddMode}>
      <Add /> {children}
    </ListItemButton>
  )
}

export default AddTextButton
