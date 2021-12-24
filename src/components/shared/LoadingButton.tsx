import { FC } from 'react'
import { Button, ButtonProps, CircularProgress } from '@mui/material'

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
}

const LoadingButton: FC<LoadingButtonProps> = ({ loading, ...other }) => (
  <Button {...other} startIcon={loading ? <CircularProgress size={20} /> : other.startIcon} />
)

export default LoadingButton
