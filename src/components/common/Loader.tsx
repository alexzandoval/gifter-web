import { FC, ReactNode } from 'react'
import { CircularProgress } from '@mui/material'

interface Props {
  children: ReactNode
  loading: boolean
  loader?: ReactNode
}

const Loader: FC<Props> = ({ children, loading, loader }) => {
  if (loading) {
    return <>{loader || <CircularProgress size={16} />}</>
  }
  return <>{children}</>
}

export default Loader
