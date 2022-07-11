import { FC, PropsWithChildren, ReactElement } from 'react'
import { CircularProgress } from '@mui/material'

interface Props extends PropsWithChildren {
  loading: boolean
  loader?: ReactElement
}

const Loader: FC<Props> = ({ children, loading, loader }) => {
  if (loading) {
    return loader || <CircularProgress size={16} />
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

export default Loader
