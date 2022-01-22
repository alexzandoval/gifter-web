import { FC, ReactNode } from 'react'
import { Box, BoxProps } from '@mui/material'

interface Props extends BoxProps {
  children: ReactNode
  horizontal?: boolean
  vertical?: boolean
}

const Centered: FC<Props> = ({ children, horizontal, vertical, ...other }) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: horizontal ? 'center' : 'flex-start',
      alignContent: vertical ? 'center' : 'stretch',
      ...other.sx,
    }}
    {...other}
  >
    {children}
  </Box>
)

export default Centered
